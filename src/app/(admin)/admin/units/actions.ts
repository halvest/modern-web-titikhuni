"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * UTILITY: Ekstrak Path file yang akurat
 * Menangani URL publik Supabase untuk mendapatkan path asli file di bucket.
 */
const extractPathFromUrl = (url: string) => {
  if (!url) return null;
  try {
    // Mencari bagian setelah 'public/units/' untuk mendapatkan path file asli
    const segment = "/public/units/";
    if (!url.includes(segment)) return null;

    const path = url.split(segment)[1];
    return path;
  } catch (e) {
    return null;
  }
};

/**
 * SAVE UNIT (CREATE)
 */
export async function saveUnit(formData: FormData) {
  const supabase = await createClient();

  // FIX: Mengambil semua append "gallery" dari FormData menjadi array
  const gallery = formData.getAll("gallery").map((item) => item.toString());

  const unitData: any = {
    title: formData.get("title")?.toString() || null,
    slug: formData.get("slug")?.toString() || null,
    location: formData.get("location")?.toString() || null,
    price: parseInt(formData.get("price")?.toString() || "0"),
    status: formData.get("status")?.toString() || "Tersedia",
    category_id: formData.get("category_id")?.toString() || null,

    // Gunakan image_url utama, jika tidak ada ambil index pertama dari gallery
    image_url:
      formData.get("image_url")?.toString() ||
      (gallery.length > 0 ? gallery[0] : null),

    land_area: parseInt(formData.get("land_area")?.toString() || "0"),
    building_area: parseInt(formData.get("building_area")?.toString() || "0"),
    bedroom_count: parseInt(formData.get("bedroom_count")?.toString() || "0"),
    bathroom_count: parseInt(formData.get("bathroom_count")?.toString() || "0"),
    description: formData.get("description")?.toString() || "",

    // Pastikan ini terkirim sebagai array string ke database
    gallery: gallery,
    updated_at: new Date().toISOString(),
  };

  // Validasi
  if (!unitData.title || !unitData.slug || unitData.price <= 0) {
    return { error: "Mohon lengkapi Judul, Slug, dan Harga." };
  }

  const { error } = await supabase.from("units").insert([unitData]);

  if (error) {
    if (error.code === "23505")
      return { error: "Slug sudah ada, gunakan slug lain." };
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/unit");
  revalidatePath("/admin/units");
  redirect("/admin/units");
}

/**
 * UPDATE UNIT (EDIT)
 */
export async function updateUnit(id: string, formData: FormData) {
  const supabase = await createClient();

  const gallery = formData.getAll("gallery").map((item) => item.toString());

  const unitData: any = {
    title: formData.get("title")?.toString() || null,
    slug: formData.get("slug")?.toString() || null,
    location: formData.get("location")?.toString() || null,
    price: parseInt(formData.get("price")?.toString() || "0"),
    status: formData.get("status")?.toString() || "Tersedia",
    category_id: formData.get("category_id")?.toString() || null,
    image_url:
      formData.get("image_url")?.toString() ||
      (gallery.length > 0 ? gallery[0] : null),
    land_area: parseInt(formData.get("land_area")?.toString() || "0"),
    building_area: parseInt(formData.get("building_area")?.toString() || "0"),
    bedroom_count: parseInt(formData.get("bedroom_count")?.toString() || "0"),
    bathroom_count: parseInt(formData.get("bathroom_count")?.toString() || "0"),
    description: formData.get("description")?.toString() || "",
    gallery: gallery,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("units").update(unitData).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/units");
  revalidatePath(`/unit/${unitData.slug}`);
  return { success: true };
}

/**
 * DELETE UNIT (HARD DELETE & CLEAN STORAGE)
 */
export async function deleteUnit(id: string) {
  const supabase = await createClient();

  try {
    // 1. Ambil data foto sebelum dihapus
    const { data: unit } = await supabase
      .from("units")
      .select("image_url, gallery")
      .eq("id", id)
      .single();

    if (unit) {
      // Gabungkan semua foto (utama + gallery)
      const allImages = [
        ...(unit.image_url ? [unit.image_url] : []),
        ...(unit.gallery || []),
      ];

      // Ekstrak path asli untuk dihapus di storage
      const pathsToDelete = allImages
        .map((url) => extractPathFromUrl(url))
        .filter((path): path is string => path !== null);

      // 2. Eksekusi penghapusan di Storage
      if (pathsToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("units")
          .remove(pathsToDelete);

        if (storageError) {
          console.error("Gagal bersihkan storage:", storageError.message);
        }
      }
    }

    // 3. Hapus data di database
    const { error: dbError } = await supabase
      .from("units")
      .delete()
      .eq("id", id);
    if (dbError) throw dbError;

    revalidatePath("/");
    revalidatePath("/unit");
    revalidatePath("/admin/units");

    return { success: true };
  } catch (err: any) {
    console.error("Delete Error:", err);
    return { error: "Gagal menghapus total unit dan medianya." };
  }
}
