"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/utils/supabase/server";

type ActionResult = {
  success?: boolean;
  warning?: string;
  error?: string;
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readProjectData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = normalizeSlug(String(formData.get("slug") ?? title));
  const location = String(formData.get("location") ?? "").trim();
  const shortDescription = String(
    formData.get("short_description") ?? ""
  ).trim();
  const coverImage = String(formData.get("cover_image") ?? "").trim();
  const published = formData.get("published") === "true";
  const featured = published && formData.get("featured") === "true";
  const rawOrder = Number(formData.get("featured_order"));
  const featuredOrder =
    featured && Number.isInteger(rawOrder) && rawOrder >= 1 && rawOrder <= 6
      ? rawOrder
      : null;

  let galleryImages: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("gallery_images") ?? "[]"));
    if (Array.isArray(parsed)) {
      galleryImages = parsed
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean);
    }
  } catch {
    galleryImages = [];
  }

  const uniqueImages = Array.from(
    new Set([coverImage, ...galleryImages].filter(Boolean))
  );

  if (!title || !slug || !location || !shortDescription || !coverImage) {
    throw new Error(
      "Judul, slug, lokasi, deskripsi singkat, dan cover wajib diisi."
    );
  }

  if (featured && featuredOrder === null) {
    throw new Error("Pilih urutan unggulan antara 1 sampai 6.");
  }

  if (!isImageLocation(coverImage) || uniqueImages.some((url) => !isImageLocation(url))) {
    throw new Error("Alamat gambar proyek tidak valid.");
  }

  return {
    title,
    slug,
    location,
    short_description: shortDescription,
    cover_image: coverImage,
    gallery_images: uniqueImages,
    featured,
    featured_order: featuredOrder,
    published,
    updated_at: new Date().toISOString(),
  };
}

function isImageLocation(value: string) {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function storagePath(url: string) {
  const marker = "/public/projects/";
  if (!url.includes(marker)) return null;
  return decodeURIComponent(url.split(marker)[1] ?? "");
}

function friendlyDatabaseError(message: string, code?: string) {
  if (code === "23505" && message.includes("featured_order")) {
    return "Urutan unggulan tersebut sudah dipakai proyek lain.";
  }
  if (code === "23505") return "Slug tersebut sudah digunakan.";
  if (code === "23514") {
    return "Data belum memenuhi aturan publikasi atau urutan unggulan.";
  }
  return message;
}

export async function createProject(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const projectData = readProjectData(formData);
    const { error } = await supabase.from("projects").insert(projectData).select("id").single();

    if (error) {
      return { error: friendlyDatabaseError(error.message, error.code) };
    }

    revalidatePath("/");
    revalidatePath("/proyek");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Proyek gagal disimpan.",
    };
  }
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const projectData = readProjectData(formData);
    const { data: previous, error: previousError } = await supabase
      .from("projects")
      .select("slug, cover_image, gallery_images")
      .eq("id", id)
      .maybeSingle();

    if (previousError) return { error: previousError.message };
    if (!previous) return { error: "Proyek tidak ditemukan." };

    const { data: updated, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      return { error: friendlyDatabaseError(error.message, error.code) };
    }
    if (!updated) return { error: "Proyek tidak ditemukan atau tidak dapat diubah." };

    const before = new Set([
      previous.cover_image,
      ...(previous.gallery_images ?? []),
    ]);
    const after = new Set([
      projectData.cover_image,
      ...projectData.gallery_images,
    ]);
    const removedPaths = Array.from(before)
      .filter((url) => !after.has(url))
      .map(storagePath)
      .filter((path): path is string => Boolean(path));

    let warning: string | undefined;
    if (removedPaths.length) {
      const storageResult = await supabase.storage.from("projects").remove(removedPaths);
      if (storageResult.error) warning = "Proyek tersimpan, tetapi sebagian media lama gagal dibersihkan.";
    }

    revalidatePath("/proyek/" + previous.slug);

    revalidatePath("/");
    revalidatePath("/proyek");
    revalidatePath("/proyek/" + projectData.slug);
    revalidatePath("/admin/projects");
    return { success: true, warning };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Perubahan gagal disimpan.",
    };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("slug, cover_image, gallery_images")
      .eq("id", id)
      .single();

    if (fetchError || !project) {
      return { error: "Proyek tidak ditemukan." };
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { error: error.message };

    const mediaPaths = Array.from(
      new Set([project.cover_image, ...(project.gallery_images ?? [])])
    )
      .map(storagePath)
      .filter((path): path is string => Boolean(path));

    let warning: string | undefined;
    if (mediaPaths.length) {
      const storageResult = await supabase.storage.from("projects").remove(mediaPaths);
      if (storageResult.error) warning = "Proyek terhapus, tetapi sebagian media gagal dibersihkan.";
    }

    revalidatePath("/");
    revalidatePath("/proyek");
    revalidatePath("/proyek/" + project.slug);
    revalidatePath("/admin/projects");
    return { success: true, warning };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Proyek gagal dihapus.",
    };
  }
}
