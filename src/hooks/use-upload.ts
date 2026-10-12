import { createClient } from "@/utils/supabase/client";
import { compressImage } from "@/lib/images/compress-image";

export const useUpload = () => {
  const uploadImage = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Gunakan file JPG, PNG, WebP, atau AVIF.");
    }
    if (file.size > 15 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 15 MB.");
    }

    // Kompresi otomatis gambar ke WebP (max 1920px) agar file menjadi ringan (150-300KB)
    const fileToUpload = await compressImage(file);

    const supabase = createClient();
    // 1. Buat nama file unik
    const ext = fileToUpload.name.split(".").pop()?.toLowerCase() || "webp";
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
    const filePath = `units/${fileName}`;

    // 2. Upload ke bucket 'properti' (di dalam folder 'units/')
    const { data, error } = await supabase.storage
      .from("properti")
      .upload(filePath, fileToUpload, { cacheControl: "31536000", upsert: false });

    if (error) throw error;

    // 3. Ambil URL Publik
    const {
      data: { publicUrl },
    } = supabase.storage.from("properti").getPublicUrl(filePath);

    return publicUrl;
  };

  return { uploadImage };
};
