import { createClient } from "@/utils/supabase/client";

export const useUpload = () => {
  const uploadImage = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Gunakan file JPG, PNG, WebP, atau AVIF.");
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 8 MB.");
    }
    const supabase = createClient();
    // 1. Buat nama file unik
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `units/${fileName}`;

    // 2. Upload ke bucket 'units'
    const { data, error } = await supabase.storage
      .from("units")
      .upload(filePath, file, { cacheControl: "31536000", upsert: false });

    if (error) throw error;

    // 3. Ambil URL Publik
    const {
      data: { publicUrl },
    } = supabase.storage.from("units").getPublicUrl(filePath);

    return publicUrl;
  };

  return { uploadImage };
};
