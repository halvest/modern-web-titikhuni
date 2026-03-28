"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { updateUnit } from "../../actions";
import { useUpload } from "@/hooks/use-upload";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const { uploadImage } = useUpload();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    location: "",
    price: 0,
    status: "Tersedia",
    category_id: "", // Inisialisasi string kosong, bukan null
    description: "",
    bedroom_count: 0,
    bathroom_count: 0,
    land_area: 0,
    building_area: 0,
    image_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          supabase.from("categories").select("*"),
          supabase.from("units").select("*").eq("id", id).single(),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (unitRes.error) throw unitRes.error;

        // FIX: Pastikan category_id tidak null agar select tidak error
        const unitData = unitRes.data;
        setFormData({
          ...unitData,
          category_id: unitData.category_id || "", // Jika null, ubah jadi ""
        });

        setImagePreview(unitData.image_url);
        setGallery(unitData.gallery || []);
      } catch (error: any) {
        toast.error("Data tidak ditemukan");
        router.push("/admin/units");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadImage(file);
      setImagePreview(publicUrl);
      setFormData((prev: any) => ({ ...prev, image_url: publicUrl }));
      toast.success("Gambar utama diperbarui");
    } catch (err) {
      toast.error("Gagal unggah gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (gallery.length + files.length > 10)
      return toast.error("Maksimal 10 foto");

    setUploading(true);
    const toastId = toast.loading("Mengunggah galeri...");
    try {
      const newUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        newUrls.push(url);
      }
      setGallery((prev) => [...prev, ...newUrls]);
      toast.success("Galeri diperbarui", { id: toastId });
    } catch (err) {
      toast.error("Gagal unggah galeri", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      // Masukkan semua field dari formData state
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Pastikan galeri terbaru ikut terkirim
      data.delete("gallery");
      gallery.forEach((url) => data.append("gallery", url));

      const result = await updateUnit(id, data);

      if (result?.error) {
        toast.error(result.error);
        setSaving(false);
      } else {
        toast.success("Unit berhasil diperbarui");
        router.push("/admin/units");
        router.refresh();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan");
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-neutral-200" size={40} />
      </div>
    );

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen bg-neutral-50/50">
      <Toaster />
      <Link
        href="/admin/units"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-black mb-10 transition-all group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-[10px] uppercase tracking-widest font-black">
          Back to Inventory
        </span>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-10 pb-24">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-neutral-900 leading-none">
              Edit <span className="text-neutral-300">Listing</span>
            </h1>
            <p className="text-[10px] text-neutral-400 mt-3 font-bold uppercase tracking-widest italic">
              ID: {id}
            </p>
          </div>
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-black text-white px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-xl"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* KOLOM KIRI & TENGAH */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm space-y-6">
              <FormInput
                label="Nama Properti"
                value={formData.title}
                onChange={(v: string) => setFormData({ ...formData, title: v })}
              />
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Slug"
                  value={formData.slug}
                  onChange={(v: string) =>
                    setFormData({ ...formData, slug: v })
                  }
                />
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">
                    Kategori
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full p-4 bg-neutral-50 rounded-2xl outline-none border border-transparent focus:border-black/5 transition-all text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <FormInput
                label="Lokasi"
                value={formData.location}
                onChange={(v: string) =>
                  setFormData({ ...formData, location: v })
                }
              />
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm space-y-6">
              <label className="text-[10px] uppercase font-black text-neutral-400 tracking-widest block">
                Galeri Foto Properti
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((url, i) => (
                  <div
                    key={url}
                    className="relative aspect-square rounded-xl overflow-hidden border bg-neutral-50 group"
                  >
                    <Image
                      src={url}
                      alt="Gallery"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {gallery.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center hover:bg-neutral-50 cursor-pointer transition-all">
                    <Upload size={20} className="text-neutral-400 mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
              <label className="text-[10px] uppercase font-black text-neutral-400 tracking-widest mb-4 block">
                Deskripsi Properti
              </label>
              <textarea
                rows={5}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-6 bg-neutral-50 rounded-2xl outline-none text-sm leading-relaxed border border-transparent focus:border-black/5 transition-all resize-none"
              />
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm space-y-6">
              <label className="text-[10px] uppercase font-black text-neutral-400 tracking-widest block">
                Thumbnail Utama
              </label>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 group border">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="text-neutral-200" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Upload className="text-white" size={24} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm space-y-6">
              <FormInput
                label="Harga (IDR)"
                type="number"
                value={formData.price}
                onChange={(v: string) => setFormData({ ...formData, price: v })}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Tanah (m²)"
                  type="number"
                  value={formData.land_area}
                  onChange={(v: string) =>
                    setFormData({ ...formData, land_area: v })
                  }
                />
                <FormInput
                  label="Bangunan (m²)"
                  type="number"
                  value={formData.building_area}
                  onChange={(v: string) =>
                    setFormData({ ...formData, building_area: v })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Kamar Tidur"
                  type="number"
                  value={formData.bedroom_count}
                  onChange={(v: string) =>
                    setFormData({ ...formData, bedroom_count: v })
                  }
                />
                <FormInput
                  label="Kamar Mandi"
                  type="number"
                  value={formData.bathroom_count}
                  onChange={(v: string) =>
                    setFormData({ ...formData, bathroom_count: v })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-neutral-50 rounded-2xl outline-none border border-transparent focus:border-neutral-200 transition-all text-sm font-bold"
      />
    </div>
  );
}
