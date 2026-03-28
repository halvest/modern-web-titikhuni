import { supabase } from "@/lib/supabaseClient";

export const useUpload = () => {
  const uploadImage = async (file: File) => {
    // 1. Buat nama file unik
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `units/${fileName}`;

    // 2. Upload ke bucket 'properti'
    const { data, error } = await supabase.storage
      .from("properti")
      .upload(filePath, file);

    if (error) throw error;

    // 3. Ambil URL Publik
    const {
      data: { publicUrl },
    } = supabase.storage.from("properti").getPublicUrl(filePath);

    return publicUrl;
  };

  return { uploadImage };
};
