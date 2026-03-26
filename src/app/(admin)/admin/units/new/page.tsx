// src/app/(admin)/admin/units/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function UnitFormPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    price: "",
    status: "Tersedia",
    category_id: "",
    description: "",
    bedroom_count: 0,
    bathroom_count: 0,
    land_area: 0,
    building_area: 0,
    priority_order: 0,
    image_url: "",
  });

  useEffect(() => {
    // Ambil daftar kategori untuk dropdown
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("type", "unit");
      if (data) setCategories(data);
    };

    // Jika Mode Edit, ambil data unit yang sudah ada
    const fetchUnitData = async () => {
      if (!isEdit) return;
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("id", params?.id)
        .single();
      if (data) setFormData(data);
    };

    fetchCategories();
    fetchUnitData();
  }, [isEdit, params?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, updated_at: new Date() };

      const { error } = isEdit
        ? await supabase.from("units").update(payload).eq("id", params?.id)
        : await supabase.from("units").insert([payload]);

      if (error) throw error;

      toast.success(isEdit ? "Unit diperbarui!" : "Unit berhasil ditambah!");
      router.push("/admin/units");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto bg-neutral-50 min-h-screen">
      <Toaster />
      <Link
        href="/admin/units"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Kembali
        </span>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Informasi Dasar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400">
                Nama Unit
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
                placeholder="Contoh: Rumah Modern Bangunjiwo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400">
                Slug (URL)
              </label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
                placeholder="rumah-modern-bangunjiwo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400">
                Harga (Angka Saja)
              </label>
              <input
                required
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sold">Terjual</option>
                <option value="Booked">Dipesan</option>
                <option value="Coming Soon">Segera Hadir</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400">
                Kategori
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Spesifikasi & Media
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InputSpec
              label="Kamar Tidur"
              value={formData.bedroom_count}
              onChange={(val) =>
                setFormData({ ...formData, bedroom_count: parseInt(val) })
              }
            />
            <InputSpec
              label="Kamar Mandi"
              value={formData.bathroom_count}
              onChange={(val) =>
                setFormData({ ...formData, bathroom_count: parseInt(val) })
              }
            />
            <InputSpec
              label="Luas Tanah (m²)"
              value={formData.land_area}
              onChange={(val) =>
                setFormData({ ...formData, land_area: parseInt(val) })
              }
            />
            <InputSpec
              label="Luas Bangunan (m²)"
              value={formData.building_area}
              onChange={(val) =>
                setFormData({ ...formData, building_area: parseInt(val) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-neutral-400">
              URL Gambar Utama
            </label>
            <input
              required
              type="text"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-neutral-400">
              Deskripsi
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
        >
          <Save size={18} /> {loading ? "Menyimpan..." : "Simpan Unit Properti"}
        </button>
      </form>
    </div>
  );
}

function InputSpec({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-neutral-400">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:border-black transition-all"
      />
    </div>
  );
}
