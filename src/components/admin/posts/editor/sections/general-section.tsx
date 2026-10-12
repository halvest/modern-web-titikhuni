import React, { useState } from "react";
import { PostFormData } from "../types";
import { FormInput, FormTextarea } from "../ui/form-input";
import { Upload, Image as ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { compressImage } from "@/lib/images/compress-image";

interface GeneralSectionProps {
  data: PostFormData;
  onChange: (updates: Partial<PostFormData>) => void;
  categories: { id: string; name: string }[];
  originalSlug?: string;
}

export function GeneralSection({
  data,
  onChange,
  categories,
  originalSlug,
}: GeneralSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const generateSlug = (text: string) => {
    const slug = text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    onChange({ title: text, slug });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 15 * 1024 * 1024) {
      toast.error("Gunakan JPG, PNG, WebP, atau AVIF maksimal 15 MB.");
      e.target.value = "";
      return;
    }
    
    setIsUploading(true);
    const toastId = toast.loading("Mengompresi dan mengunggah gambar...");
    
    try {
      const fileToUpload = await compressImage(file);
      const fileName = `${Date.now()}-${fileToUpload.name.replace(/[^a-zA-Z0-9.\-]/g, "")}`;
      const { error } = await supabase.storage.from("blog").upload(fileName, fileToUpload, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from("blog").getPublicUrl(fileName);
      onChange({ featured_image: publicUrl });
      toast.success("Gambar berhasil diunggah.", { id: toastId });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gambar gagal diunggah.", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const showSlugWarning = originalSlug && data.slug && originalSlug !== data.slug;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Informasi Artikel
        </h2>
        <p className="mt-1.5 text-[13px] font-medium text-slate-500">
          Atur identitas, kategori, ringkasan, dan gambar utama artikel.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <FormInput
          label="Judul Artikel *"
          value={data.title}
          onChange={(e) => generateSlug(e.target.value)}
          placeholder="Contoh: 5 Tips Membeli Rumah Impian"
        />

        <div className="space-y-2">
          <FormInput
            label="Slug URL *"
            value={data.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            placeholder="e.g. tips-membeli-rumah"
          />
          {showSlugWarning && (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold flex items-start gap-2 border border-amber-200">
              <span>⚠️</span>
              <p>
                Mengubah slug akan mengganti URL publik. Redirect permanen otomatis dibuat dari
                <code className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded text-[10px]">/blog/{originalSlug}</code> to 
                <code className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded text-[10px]">/blog/{data.slug}</code> 
                saat artikel disimpan.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="post-category" className="text-[11px] uppercase font-bold text-slate-600 tracking-widest block">
              Kategori *
            </label>
            <select
              id="post-category"
              value={data.category_id}
              onChange={(e) => onChange({ category_id: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-medium text-slate-900 appearance-none cursor-pointer"
            >
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          
          <FormInput
            label="Tag (pisahkan dengan koma)"
            value={data.tags.join(", ")}
            onChange={(e) => onChange({ tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
            placeholder="Contoh: Tips, KPR, Investasi"
          />
        </div>

        <FormTextarea
          label="Ringkasan"
          value={data.excerpt}
          onChange={(e) => onChange({ excerpt: e.target.value })}
          rows={3}
          placeholder="Ringkasan singkat artikel..."
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <div>
          <h3 className="text-[11px] uppercase font-bold text-slate-600 tracking-widest block mb-3">
            Gambar Utama
          </h3>
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-slate-50 group border-2 border-dashed border-slate-300 hover:border-emerald-400 transition-all">
            {data.featured_image ? (
              <>
                <Image
                  src={data.featured_image}
                  alt="Featured"
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-3 right-3">
                  <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-white">
                    <Upload size={14} /> Ganti
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileUpload}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={isUploading}
                      aria-label="Ganti featured image"
                    />
                  </label>
                </div>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors">
                <ImageIcon size={40} className="mb-3" />
                <span className="text-sm font-bold">
                  {isUploading ? "Mengunggah..." : "Klik untuk mengunggah gambar"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-3 text-center font-medium">
            Ukuran disarankan 1200×630 piksel. Maksimal 2 MB.
          </p>
        </div>
      </div>
    </div>
  );
}
