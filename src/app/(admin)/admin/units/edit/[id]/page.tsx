// src/app/(admin)/admin/units/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function EditUnitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    price: 0,
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
    const fetchData = async () => {
      try {
        // 1. Ambil Kategori
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .eq("type", "unit");
        if (catData) setCategories(catData);

        // 2. Ambil Data Unit berdasarkan ID
        const { data: unitData, error } = await supabase
          .from("units")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        if (unitData) setFormData(unitData);
      } catch (error: any) {
        toast.error("Gagal mengambil data unit");
        router.push("/admin/units");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("units")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;

      toast.success("Unit berhasil diperbarui!");
      router.push("/admin/units");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto bg-neutral-50 min-h-screen">
      <Toaster />
      <Link
        href="/admin/units"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Kembali ke Daftar
        </span>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <header>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
            Edit <span className="text-neutral-400">Properti</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-bold">
            ID: {params.id}
          </p>
        </header>

        {/* Section: Informasi Utama */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
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
                className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
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
                className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400">
                Harga (IDR)
              </label>
              <input
                required
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) })
                }
                className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
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
                className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sold">Sold</option>
                <option value="Booked">Booked</option>
                <option value="Coming Soon">Coming Soon</option>
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
                className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
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

        {/* Section: Spesifikasi Teknis */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-neutral-50 pb-4">
            Spesifikasi Bangunan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FormGroup
              label="Kamar Tidur"
              value={formData.bedroom_count}
              onChange={(v) =>
                setFormData({ ...formData, bedroom_count: parseInt(v) })
              }
            />
            <FormGroup
              label="Kamar Mandi"
              value={formData.bathroom_count}
              onChange={(v) =>
                setFormData({ ...formData, bathroom_count: parseInt(v) })
              }
            />
            <FormGroup
              label="Luas Tanah"
              value={formData.land_area}
              onChange={(v) =>
                setFormData({ ...formData, land_area: parseInt(v) })
              }
            />
            <FormGroup
              label="Luas Bangunan"
              value={formData.building_area}
              onChange={(v) =>
                setFormData({ ...formData, building_area: parseInt(v) })
              }
            />
          </div>

          <div className="space-y-2 pt-4">
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
              className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:bg-neutral-400"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Memproses..." : "Perbarui Properti"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormGroup({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-neutral-400">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
      />
    </div>
  );
}
