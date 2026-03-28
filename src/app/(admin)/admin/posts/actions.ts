"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * UTILITY: Ekstrak Path file dari URL Supabase Storage
 */
const extractPathFromUrl = (url: string, bucket: string) => {
  if (!url) return null;
  try {
    const segment = `/public/${bucket}/`;
    if (!url.includes(segment)) return null;
    return url.split(segment)[1];
  } catch (e) {
    return null;
  }
};

/**
 * UTILITY: Ekstrak semua URL gambar dari string HTML (Konten TipTap)
 */
const extractImagesFromHtml = (html: string) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

/**
 * ==========================================
 * ACTIONS: BLOG POSTS (CRUD)
 * ==========================================
 */

export async function savePost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const postData = {
    title: formData.get("title")?.toString() || null,
    slug: formData.get("slug")?.toString() || null,
    content: formData.get("content")?.toString() || "",
    excerpt: formData.get("excerpt")?.toString() || "",
    featured_image: formData.get("featured_image")?.toString() || null,
    category_id: formData.get("category_id")?.toString() || null,
    status: formData.get("status")?.toString() || "draft",
    author_id: user?.id || null,
    updated_at: new Date().toISOString(),
  };

  if (!postData.title || !postData.slug) {
    return { error: "Judul dan Slug wajib diisi." };
  }

  const { error } = await supabase.from("posts").insert([postData]);

  if (error) {
    if (error.code === "23505") return { error: "Slug sudah digunakan." };
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();

  const postData = {
    title: formData.get("title")?.toString() || null,
    slug: formData.get("slug")?.toString() || null,
    content: formData.get("content")?.toString() || "",
    excerpt: formData.get("excerpt")?.toString() || "",
    featured_image: formData.get("featured_image")?.toString() || null,
    category_id: formData.get("category_id")?.toString() || null,
    status: formData.get("status")?.toString() || "draft",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("posts").update(postData).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${postData.slug}`);
  revalidatePath("/admin/posts");

  return { success: true };
}

/**
 * DELETE POST (PERMANENT HARD DELETE)
 * Menghapus Featured Image, Semua Gambar di dalam Konten, dan Baris Database.
 */
export async function deletePost(id: string) {
  const supabase = await createClient();

  try {
    // 1. Ambil data lengkap sebelum dihapus
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("featured_image, content")
      .eq("id", id)
      .single();

    if (fetchError || !post) throw new Error("Artikel tidak ditemukan.");

    // 2. Kumpulkan semua URL gambar (Featured Image + Gambar di dalam Konten)
    const contentImages = extractImagesFromHtml(post.content || "");
    const allImages = [
      ...(post.featured_image ? [post.featured_image] : []),
      ...contentImages,
    ];

    // 3. Ekstrak path dan hapus dari Storage
    const pathsToDelete = allImages
      .map((url) => extractPathFromUrl(url, "blog"))
      .filter((path): path is string => path !== null);

    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("blog")
        .remove(pathsToDelete);

      if (storageError)
        console.error("Gagal hapus file storage:", storageError.message);
    }

    // 4. Hapus baris data secara PERMANEN dari tabel (Hard Delete)
    const { error: dbError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    // 5. Update Cache
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");

    return { success: true };
  } catch (err: any) {
    return { error: "Gagal menghapus: " + err.message };
  }
}
