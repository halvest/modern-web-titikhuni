"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/utils/supabase/server";
import {
  extractPropertiStoragePath,
  isStorageObjectReferenced,
  removeUnitStorageObjects,
  auditUnitStorageOrphans,
} from "@/lib/storage/unit-images";

const ALLOWED_STATUSES = ["Tersedia", "Booked", "Sold", "Coming Soon", "Draft"] as const;
const ALLOWED_PRICE_PREFIXES = ["Mulai", "Mulai dari", "Harga", "Promo"] as const;
const ALLOWED_PRICE_SUFFIXES = ["Juta", "Miliar"] as const;

type SellingPoint = { text: string; symbol?: string };

type UnitPayload = {
  title: string | null;
  slug: string | null;
  location: string | null;
  price: number;
  status: (typeof ALLOWED_STATUSES)[number];
  category_id: string | null;
  image_url: string | null;
  land_area: number;
  building_area: number;
  bedroom_count: number;
  bathroom_count: number;
  carport_count: number | null;
  floor_count: number | null;
  certificate_type: string | null;
  electricity_power: number | null;
  water_source: string | null;
  furnishing: string | null;
  price_prefix: string | null;
  price_suffix: string | null;
  village: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  full_address: string | null;
  selling_points: SellingPoint[];
  description: string;
  gallery: string[];
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  is_indexed: boolean;
  og_image: string | null;
  is_featured: boolean;
  featured_order: number | null;
  updated_at: string;
};

function stringValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || null;
}

function numberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key)?.toString() || "0");
  return Number.isFinite(value) ? value : -1;
}

function optionalNumberValue(formData: FormData, key: string) {
  const rawValue = formData.get(key)?.toString().trim();
  if (!rawValue) return null;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : -1;
}

function sellingPointsValue(formData: FormData): SellingPoint[] {
  try {
    const parsed = JSON.parse(formData.get("selling_points")?.toString() || "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => {
      if (!item || typeof item !== "object") return { text: "" };
      const point = item as Record<string, unknown>;
      return {
        text: typeof point.text === "string" ? point.text.trim() : "",
        symbol: typeof point.symbol === "string" ? point.symbol.trim() : "",
      };
    });
  } catch {
    return [];
  }
}

function buildUnitPayload(formData: FormData): UnitPayload {
  const gallery = formData
    .getAll("gallery")
    .map((item) => item.toString())
    .filter(Boolean);
  const requestedStatus = formData.get("status")?.toString() || "Draft";
  const status = ALLOWED_STATUSES.includes(requestedStatus as UnitPayload["status"])
    ? (requestedStatus as UnitPayload["status"])
    : "Draft";

  const village = stringValue(formData, "village");
  const district = stringValue(formData, "district");
  const city = stringValue(formData, "city");
  const province = stringValue(formData, "province");
  const granularLocation = [village, district, city].filter(Boolean);
  const structuredLocation = granularLocation.length
    ? [...granularLocation, province].filter(Boolean).join(", ")
    : "";

  return {
    title: stringValue(formData, "title"),
    slug: stringValue(formData, "slug"),
    location: structuredLocation || stringValue(formData, "location"),
    price: numberValue(formData, "price"),
    status,
    category_id: stringValue(formData, "category_id"),
    image_url: stringValue(formData, "image_url") || gallery[0] || null,
    land_area: numberValue(formData, "land_area"),
    building_area: numberValue(formData, "building_area"),
    bedroom_count: numberValue(formData, "bedroom_count"),
    bathroom_count: numberValue(formData, "bathroom_count"),
    carport_count: optionalNumberValue(formData, "carport_count"),
    floor_count: optionalNumberValue(formData, "floor_count"),
    certificate_type: stringValue(formData, "certificate_type"),
    electricity_power: optionalNumberValue(formData, "electricity_power"),
    water_source: stringValue(formData, "water_source"),
    furnishing: stringValue(formData, "furnishing"),
    price_prefix: stringValue(formData, "price_prefix"),
    price_suffix: stringValue(formData, "price_suffix"),
    village,
    district,
    city,
    province,
    full_address: stringValue(formData, "full_address"),
    selling_points: sellingPointsValue(formData),
    description: stringValue(formData, "description") || "",
    gallery,
    seo_title: stringValue(formData, "seo_title"),
    meta_description: stringValue(formData, "meta_description"),
    canonical_url: stringValue(formData, "canonical_url"),
    is_indexed: formData.get("is_indexed") === "true",
    og_image: stringValue(formData, "og_image"),
    is_featured: formData.get("is_featured") === "true",
    featured_order: optionalNumberValue(formData, "featured_order"),
    updated_at: new Date().toISOString(),
  };
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

function validateUnit(payload: UnitPayload) {
  if (!payload.title || !payload.slug) {
    return "Nama properti dan slug wajib diisi.";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
    return "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.";
  }
  if ([payload.price, payload.land_area, payload.building_area, payload.bedroom_count, payload.bathroom_count].some((value) => value < 0)) {
    return "Nilai harga, luas, dan jumlah ruangan tidak boleh negatif.";
  }
  if (payload.carport_count !== null && (!Number.isInteger(payload.carport_count) || payload.carport_count < 0)) {
    return "Kapasitas carport harus berupa angka bulat nol atau lebih besar.";
  }
  if (payload.floor_count !== null && (!Number.isInteger(payload.floor_count) || payload.floor_count <= 0)) {
    return "Jumlah lantai harus berupa angka bulat lebih dari nol.";
  }
  if (payload.electricity_power !== null && (!Number.isInteger(payload.electricity_power) || payload.electricity_power <= 0)) {
    return "Daya listrik harus berupa angka bulat lebih dari nol.";
  }
  if (payload.certificate_type !== null && !["SHM", "HGB", "Lainnya"].includes(payload.certificate_type)) {
    return "Pilih jenis sertifikat yang valid.";
  }
  if (payload.water_source !== null && !["Sumur", "PDAM", "Sumur Bor", "Lainnya"].includes(payload.water_source)) {
    return "Pilih sumber air yang valid.";
  }
  if (payload.furnishing !== null && !["Non Furnished", "Semi Furnished", "Full Furnished"].includes(payload.furnishing)) {
    return "Pilih kondisi furnishing yang valid.";
  }
  if (payload.price_prefix !== null && !ALLOWED_PRICE_PREFIXES.includes(payload.price_prefix as (typeof ALLOWED_PRICE_PREFIXES)[number])) {
    return "Pilih prefix harga yang valid.";
  }
  if (payload.price_suffix !== null && !ALLOWED_PRICE_SUFFIXES.includes(payload.price_suffix as (typeof ALLOWED_PRICE_SUFFIXES)[number])) {
    return "Pilih format harga yang valid.";
  }
  if (payload.selling_points.length > 8) {
    return "Selling point maksimal berisi 8 item.";
  }
  if (payload.selling_points.some((point) => point.text.length > 100 || (point.symbol && point.symbol.length > 4))) {
    return "Periksa teks dan simbol selling point.";
  }
  if (!isHttpUrl(payload.canonical_url) || !isHttpUrl(payload.og_image)) {
    return "Canonical URL dan OG image harus menggunakan URL lengkap yang valid.";
  }
  if (
    payload.status !== "Draft" &&
    (!payload.category_id ||
      !payload.location ||
      !payload.image_url ||
      (payload.status !== "Coming Soon" && payload.price <= 0) ||
      (payload.selling_points.length > 0 && payload.selling_points.length < 3) ||
      payload.selling_points.some((point) => !point.text))
  ) {
    return "Lengkapi wilayah, lokasi, foto, harga, dan minimal 3 selling point jika digunakan sebelum publikasi.";
  }
  if (payload.is_featured && !["Tersedia", "Sold", "Coming Soon"].includes(payload.status)) {
    return "Hanya unit Tersedia, Terjual, atau Coming Soon yang dapat dipilih untuk homepage.";
  }
  if (
    payload.is_featured &&
    (!Number.isInteger(payload.featured_order) ||
      payload.featured_order === null ||
      payload.featured_order < 1 ||
      payload.featured_order > 6)
  ) {
    return "Urutan unit pilihan harus berada di antara 1 sampai 6.";
  }
  if (!payload.is_featured) payload.featured_order = null;
  return null;
}

function databaseErrorMessage(error: { code?: string; message: string }) {
  if (error.code !== "23505") return error.message;
  if (error.message.includes("units_featured_order_unique")) {
    return "Urutan homepage tersebut sudah digunakan unit lain. Pilih urutan yang berbeda.";
  }
  return "Slug sudah ada, gunakan slug lain.";
}

function revalidateUnitPaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/unit");
  revalidatePath("/admin/units");
  if (slug) revalidatePath(`/unit/${slug}`);
}

export async function saveUnit(formData: FormData) {
  try {
    const supabase = await verifyAdmin();
    const unitData = buildUnitPayload(formData);
    const validationError = validateUnit(unitData);
    if (validationError) return { error: validationError };

    const { data, error } = await supabase
      .from("units")
      .insert([unitData])
      .select("id, slug")
      .single();

    if (error) {
      return { error: databaseErrorMessage(error) };
    }

    revalidateUnitPaths(data.slug);
    return { success: true, id: data.id, slug: data.slug };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan unit." };
  }
}

export async function updateUnit(id: string, formData: FormData) {
  try {
    const supabase = await verifyAdmin();
    const unitData = buildUnitPayload(formData);
    const validationError = validateUnit(unitData);
    if (validationError) return { error: validationError };

    const { data: existing, error: readError } = await supabase
      .from("units")
      .select("slug, image_url, gallery")
      .eq("id", id)
      .single();
    if (readError) return { error: readError.message };

    const { error } = await supabase
      .from("units")
      .update(unitData)
      .eq("id", id)
      .select("id")
      .single();
    if (error) {
      return { error: databaseErrorMessage(error) };
    }

    let warning: string | undefined;

    // Bersihkan file fisik yang diganti/dihapus dari unit ini (setelah DB berhasil diperbarui)
    const beforeImages = new Set([existing.image_url, ...(existing.gallery || [])].filter(Boolean) as string[]);
    const afterImages = new Set([unitData.image_url, ...(unitData.gallery || [])].filter(Boolean) as string[]);
    const removedUrls = Array.from(beforeImages).filter((url) => !afterImages.has(url));

    if (removedUrls.length > 0) {
      const pathsToDelete: string[] = [];
      for (const url of removedUrls) {
        const storagePath = extractPropertiStoragePath(url);
        if (storagePath) {
          // Pastikan aset ini tidak dibagi oleh unit aktif lain
          const isReferenced = await isStorageObjectReferenced(supabase, storagePath, id);
          if (!isReferenced) {
            pathsToDelete.push(storagePath);
          }
        }
      }

      if (pathsToDelete.length > 0) {
        const { failed } = await removeUnitStorageObjects(supabase, pathsToDelete);
        if (failed.length > 0) {
          warning = "Unit diperbarui, namun sebagian file gambar lama gagal dibersihkan dari storage.";
        }
      }
    }

    if (existing.slug && unitData.slug && existing.slug !== unitData.slug) {
      const { error: redirectError } = await supabase.from("redirects").upsert(
        {
          old_path: `/unit/${existing.slug}`,
          new_path: `/unit/${unitData.slug}`,
          is_permanent: true,
        },
        { onConflict: "old_path" }
      );
      if (redirectError) {
        warning = (warning ? `${warning} ` : "") + "Redirect dari slug lama gagal dibuat.";
      }
    }

    revalidateUnitPaths(existing.slug);
    revalidateUnitPaths(unitData.slug);
    return { success: true, id, slug: unitData.slug, warning };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan perubahan unit." };
  }
}

export async function deleteUnit(id: string) {
  try {
    const supabase = await verifyAdmin();

    const { data: unit, error: fetchError } = await supabase
      .from("units")
      .select("id, slug, image_url, gallery")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (fetchError) return { error: fetchError.message };
    if (!unit) return { error: "Unit tidak ditemukan." };

    // Kumpulkan path gambar milik unit ini sebelum record dinonaktifkan
    const allImages = [unit.image_url, ...(unit.gallery || [])].filter(Boolean) as string[];
    const pathsToRemove: string[] = [];

    for (const url of allImages) {
      const storagePath = extractPropertiStoragePath(url);
      if (storagePath) {
        // Pastikan tidak ada unit aktif lain yang berbagi aset ini
        const isReferenced = await isStorageObjectReferenced(supabase, storagePath, id);
        if (!isReferenced) {
          pathsToRemove.push(storagePath);
        }
      }
    }

    // Perbarui record database: tandai soft-delete dan bersihkan referensi agar tidak ada pointer mati
    const { data: deleted, error: dbError } = await supabase
      .from("units")
      .update({
        deleted_at: new Date().toISOString(),
        status: "Draft",
        is_featured: false,
        featured_order: null,
        image_url: null,
        gallery: [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (dbError) return { error: dbError.message };
    if (!deleted) return { error: "Unit tidak ditemukan atau tidak dapat dihapus." };

    // Bersihkan juga dari tabel relasi unit_images jika ada
    try {
      await supabase.from("unit_images").delete().eq("unit_id", id);
    } catch {
      // Abaikan jika tabel tidak dipakai
    }

    // Hapus file fisik gambar di Supabase Storage
    let warning: string | undefined;
    if (pathsToRemove.length > 0) {
      const { failed } = await removeUnitStorageObjects(supabase, pathsToRemove);
      if (failed.length > 0) {
        warning = "Unit berhasil dihapus, tetapi sebagian file gambar gagal dihapus dari storage.";
      }
    }

    revalidateUnitPaths(unit.slug);
    return { success: true, warning };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus unit." };
  }
}

/**
 * Menghapus satu gambar secara aman dari storage dan database.
 * Jika unitId diberikan, referensi di database diperbarui terlebih dahulu.
 * Jika unitId tidak diberikan (gambar draft yang belum disimpan), gambar langsung dihapus dari storage.
 */
export async function deleteUnitImage(params: {
  unitId?: string;
  imageUrl: string;
}) {
  try {
    const supabase = await verifyAdmin();
    const storagePath = extractPropertiStoragePath(params.imageUrl);

    if (!storagePath) {
      return { error: "URL gambar tidak valid atau berada di luar storage unit." };
    }

    if (params.unitId) {
      const { data: unit, error: fetchError } = await supabase
        .from("units")
        .select("id, slug, image_url, gallery")
        .eq("id", params.unitId)
        .is("deleted_at", null)
        .maybeSingle();

      if (fetchError || !unit) {
        return { error: "Unit tidak ditemukan." };
      }

      // Pastikan gambar memang terdaftar pada unit ini
      const isMain = unit.image_url === params.imageUrl;
      const inGallery = (unit.gallery || []).includes(params.imageUrl);

      if (!isMain && !inGallery) {
        return { error: "Gambar tidak terdaftar pada unit ini." };
      }

      // Perbarui record database terlebih dahulu (database-first consistency)
      const updatedGallery = (unit.gallery || []).filter((u: string) => u !== params.imageUrl);
      const updatedMain = isMain ? (updatedGallery[0] || null) : unit.image_url;

      const { error: updateError } = await supabase
        .from("units")
        .update({
          image_url: updatedMain,
          gallery: updatedGallery,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.unitId);

      if (updateError) {
        return { error: `Gagal memperbarui database: ${updateError.message}` };
      }

      // Bersihkan dari tabel relasi jika ada
      try {
        await supabase
          .from("unit_images")
          .delete()
          .eq("unit_id", params.unitId)
          .eq("image_url", params.imageUrl);
      } catch {
        // ignore
      }

      // Cek apakah ada unit aktif lain yang menggunakan file ini
      const isReferenced = await isStorageObjectReferenced(supabase, storagePath, params.unitId);
      let warning: string | undefined;

      if (!isReferenced) {
        const { failed } = await removeUnitStorageObjects(supabase, [storagePath]);
        if (failed.length > 0) {
          warning = "Referensi database berhasil dihapus, namun file fisik storage gagal dibersihkan.";
        }
      }

      revalidateUnitPaths(unit.slug);
      return { success: true, warning };
    } else {
      // Penghapusan gambar draft yang belum disimpan ke DB
      const isReferenced = await isStorageObjectReferenced(supabase, storagePath);
      if (isReferenced) {
        return { error: "Gambar masih digunakan oleh unit aktif lain dan tidak dapat dihapus." };
      }

      const { failed } = await removeUnitStorageObjects(supabase, [storagePath]);
      if (failed.length > 0) {
        return { error: `Gagal menghapus file dari storage: ${failed[0]?.error}` };
      }

      return { success: true };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus gambar." };
  }
}

/**
 * Server Action untuk audit orphaned storage objects
 */
export async function auditUnitStorageAction(options?: {
  dryRun?: boolean;
  limit?: number;
  olderThanMinutes?: number;
}) {
  try {
    const supabase = await verifyAdmin();
    const result = await auditUnitStorageOrphans(supabase, options);
    return { success: true, result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal melakukan audit storage." };
  }
}
