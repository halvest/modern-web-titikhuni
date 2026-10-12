"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getAdminContext, verifyAdmin } from "@/utils/supabase/server";
import { sanitizeRichText } from "@/lib/security/sanitize-rich-text";

const ALLOWED_STATUSES = new Set(["draft", "published", "archived"]);

type ActionResult = {
  success?: boolean;
  id?: string;
  warning?: string;
  error?: string;
};

type PostPayload = {
  title: string | null;
  slug: string | null;
  content: string;
  excerpt: string;
  featured_image: string | null;
  category_id: string | null;
  status: string;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  is_indexed: boolean;
  og_image: string | null;
  updated_at: string;
  author_id?: string;
};

function textValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || null;
}

function isHttpUrl(value: string | null) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function buildPostPayload(formData: FormData, authorId?: string): PostPayload {
  const requestedStatus = textValue(formData, "status") || "draft";
  return {
    title: textValue(formData, "title"),
    slug: textValue(formData, "slug"),
    content: sanitizeRichText(formData.get("content")?.toString() || ""),
    excerpt: textValue(formData, "excerpt") || "",
    featured_image: textValue(formData, "featured_image"),
    category_id: textValue(formData, "category_id"),
    status: ALLOWED_STATUSES.has(requestedStatus) ? requestedStatus : "draft",
    seo_title: textValue(formData, "seo_title"),
    meta_description: textValue(formData, "meta_description"),
    canonical_url: textValue(formData, "canonical_url"),
    is_indexed: formData.get("is_indexed") === "true",
    og_image: textValue(formData, "og_image"),
    updated_at: new Date().toISOString(),
    ...(authorId ? { author_id: authorId } : {}),
  };
}

function validatePost(post: PostPayload) {
  if (!post.title || !post.slug || !post.category_id) {
    return "Judul, slug, dan kategori wajib diisi.";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    return "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.";
  }
  if (!isHttpUrl(post.canonical_url) || !isHttpUrl(post.og_image)) {
    return "Canonical URL dan OG image harus berupa URL lengkap yang valid.";
  }
  if (post.status === "published" && post.content.replace(/<[^>]*>/g, "").trim().length < 10) {
    return "Isi artikel terlalu pendek untuk dipublikasikan.";
  }
  return null;
}

function relationValues(formData: FormData, key: string) {
  return Array.from(new Set(formData.getAll(key).map(String).map((value) => value.trim()).filter(Boolean)));
}

function normalizeTagSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function syncRelations(supabase: SupabaseClient, postId: string, formData: FormData) {
  const tags = relationValues(formData, "tags");
  const unitIds = relationValues(formData, "related_unit_ids");
  const postIds = relationValues(formData, "related_post_ids").filter((id) => id !== postId);

  const cleanupQueries = await Promise.all([
    supabase.from("post_tags").delete().eq("post_id", postId),
    supabase.from("post_related_units").delete().eq("post_id", postId),
    supabase.from("post_related_posts").delete().eq("post_id", postId),
  ]);
  const cleanupError = cleanupQueries.find((result) => result.error)?.error;
  if (cleanupError) throw new Error(`Relasi lama gagal diperbarui: ${cleanupError.message}`);

  const tagIds: string[] = [];
  for (const rawName of tags) {
    const name = rawName.trim().replace(/\s+/g, " ");
    if (!name) continue;
    const slug = normalizeTagSlug(name);
    if (!slug) continue;

    // 1. Cek tag berdasarkan slug
    const bySlug = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (bySlug.error) throw new Error(`Tag gagal diperiksa: ${bySlug.error.message}`);

    let tagId = bySlug.data?.id;

    // 2. Jika belum ditemukan, periksa kecocokan nama case-insensitive
    if (!tagId) {
      const byName = await supabase
        .from("tags")
        .select("id")
        .ilike("name", name)
        .maybeSingle();

      if (byName.error) throw new Error(`Tag gagal diperiksa: ${byName.error.message}`);
      tagId = byName.data?.id;
    }

    // 3. Jika tag belum ada di database, buat tag baru dengan name dan slug valid
    if (!tagId) {
      const created = await supabase
        .from("tags")
        .insert({ name, slug })
        .select("id")
        .single();

      if (created.error) {
        if (created.error.code === "23505") {
          // Penanganan benturan bila tag dibuat bersamaan
          const fallback = await supabase
            .from("tags")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

          if (fallback.data?.id) {
            tagId = fallback.data.id;
          } else {
            throw new Error(`Tag gagal dibuat: ${created.error.message}`);
          }
        } else {
          throw new Error(`Tag gagal dibuat: ${created.error.message}`);
        }
      } else {
        tagId = created.data.id;
      }
    }

    if (tagId && !tagIds.includes(tagId)) {
      tagIds.push(tagId);
    }
  }

  const insertQueries = [];
  if (tagIds.length) {
    insertQueries.push(supabase.from("post_tags").insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId }))));
  }
  if (unitIds.length) {
    insertQueries.push(supabase.from("post_related_units").insert(unitIds.map((unitId) => ({ post_id: postId, unit_id: unitId }))));
  }
  if (postIds.length) {
    insertQueries.push(supabase.from("post_related_posts").insert(postIds.map((relatedPostId) => ({ post_id: postId, related_post_id: relatedPostId }))));
  }

  const insertResults = await Promise.all(insertQueries);
  const insertError = insertResults.find((result) => result.error)?.error;
  if (insertError) throw new Error(`Relasi artikel gagal disimpan: ${insertError.message}`);
}

function revalidatePostPaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function databaseError(error: { code?: string; message: string }) {
  return error.code === "23505" ? "Slug sudah digunakan." : error.message;
}

export async function savePost(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAdminContext();
    const postData = buildPostPayload(formData, user.id);
    const validationError = validatePost(postData);
    if (validationError) return { error: validationError };

    const created = await supabase.from("posts").insert(postData).select("id, slug").single();
    if (created.error) return { error: databaseError(created.error) };

    try {
      await syncRelations(supabase, created.data.id, formData);
    } catch (error) {
      await supabase.from("posts").delete().eq("id", created.data.id);
      throw error;
    }

    revalidatePostPaths(created.data.slug);
    return { success: true, id: created.data.id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Artikel gagal disimpan." };
  }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const postData = buildPostPayload(formData);
    const validationError = validatePost(postData);
    if (validationError) return { error: validationError };

    const existing = await supabase.from("posts").select("slug").eq("id", id).maybeSingle();
    if (existing.error) return { error: existing.error.message };
    if (!existing.data) return { error: "Artikel tidak ditemukan." };

    const updated = await supabase.from("posts").update(postData).eq("id", id).select("id").maybeSingle();
    if (updated.error) return { error: databaseError(updated.error) };
    if (!updated.data) return { error: "Artikel tidak ditemukan atau tidak dapat diubah." };

    let warning: string | undefined;
    if (existing.data.slug !== postData.slug) {
      const redirectResult = await supabase.from("redirects").upsert({
        old_path: `/blog/${existing.data.slug}`,
        new_path: `/blog/${postData.slug}`,
        is_permanent: true,
      }, { onConflict: "old_path" });
      if (redirectResult.error) warning = "Artikel tersimpan, tetapi redirect slug lama gagal dibuat.";
    }

    try {
      await syncRelations(supabase, id, formData);
    } catch (error) {
      warning = error instanceof Error ? error.message : "Artikel tersimpan, tetapi relasi gagal diperbarui.";
    }

    revalidatePostPaths(existing.data.slug);
    revalidatePostPaths(postData.slug);
    return { success: true, id, warning };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Perubahan artikel gagal disimpan." };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const fetched = await supabase
      .from("posts")
      .select("id, slug")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (fetched.error) return { error: fetched.error.message };
    if (!fetched.data) return { error: "Artikel tidak ditemukan." };

    const deleted = await supabase
      .from("posts")
      .update({
        deleted_at: new Date().toISOString(),
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();
    if (deleted.error) return { error: deleted.error.message };
    if (!deleted.data) return { error: "Artikel tidak ditemukan atau tidak dapat dihapus." };

    revalidatePostPaths(fetched.data.slug);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Artikel gagal dihapus." };
  }
}
