// src/app/(admin)/admin/units/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Home,
  Layers,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/formatRupiah";
import { toast, Toaster } from "react-hot-toast";

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("units")
        .select(
          `
          *,
          categories (name)
        `,
        )
        .is("deleted_at", null) // Mengambil unit yang tidak di-soft delete
        .order("priority_order", { ascending: true });

      if (error) throw error;
      setUnits(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data unit");
    } finally {
      setLoading(false);
    }
  }

  async function softDeleteUnit(id: string) {
    if (
      !confirm("Arsipkan unit ini? Unit tidak akan tampil di website publik.")
    )
      return;

    const { error } = await supabase
      .from("units")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengarsipkan unit");
    } else {
      toast.success("Unit berhasil diarsipkan");
      setUnits(units.filter((u) => u.id !== id));
    }
  }

  const filteredUnits = units.filter(
    (unit) =>
      unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-neutral-50 min-h-screen">
      <Toaster />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
            Katalog <span className="text-neutral-400">Properti</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-bold">
            Total Listing: {units.length} Properti Aktif
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari Properti..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-black transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/admin/units/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg shadow-black/10"
          >
            <Plus size={16} /> Tambah Unit
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center uppercase text-[10px] tracking-[0.3em] text-neutral-400">
            Menyusun Katalog...
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="py-20 text-center uppercase text-[10px] tracking-[0.3em] text-neutral-400">
            Belum ada unit yang terdaftar
          </div>
        ) : (
          filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white border border-neutral-100 rounded-3xl p-4 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl hover:shadow-neutral-200/40 transition-all duration-500"
            >
              {/* Thumbnail */}
              <div className="relative w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                <Image
                  src={unit.image_url}
                  alt={unit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Info Utama */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-neutral-100 rounded text-[9px] font-black uppercase tracking-tighter text-neutral-500">
                    {unit.categories?.name || "Uncategorized"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                      unit.status === "Tersedia"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 uppercase tracking-tight leading-none">
                  {unit.title}
                </h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  <Layers size={12} /> {unit.location}
                </p>
                <p className="text-sm font-black text-black pt-1">
                  {formatRupiah(unit.price)}
                </p>
              </div>

              {/* Specs Brief */}
              <div className="hidden lg:grid grid-cols-2 gap-x-8 gap-y-2 px-8 border-x border-neutral-50 text-neutral-500">
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Tanah: <span className="text-black">{unit.land_area}m²</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Bangunan:{" "}
                  <span className="text-black">{unit.building_area}m²</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Kamar:{" "}
                  <span className="text-black">{unit.bedroom_count}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Urutan:{" "}
                  <span className="text-black">#{unit.priority_order}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pr-4 w-full md:w-auto justify-end">
                <Link
                  href={`/unit/${unit.slug}`}
                  target="_blank"
                  className="p-3 text-neutral-400 hover:text-black transition-colors"
                  title="Lihat di Web"
                >
                  <ExternalLink size={18} />
                </Link>
                <Link
                  href={`/admin/units/edit/${unit.id}`}
                  className="p-3 bg-neutral-50 text-neutral-600 rounded-xl hover:bg-black hover:text-white transition-all"
                >
                  <Edit3 size={18} />
                </Link>
                <button
                  onClick={() => softDeleteUnit(unit.id)}
                  className="p-3 text-neutral-300 hover:text-red-600 transition-colors"
                  title="Arsipkan"
                >
                  <EyeOff size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
