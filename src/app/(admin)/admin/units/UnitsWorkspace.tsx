"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  Edit,
  ExternalLink,
  MapPin,
  Home,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteUnit } from "./actions";
import { formatRupiah } from "@/lib/formatRupiah";
import {
  ActionMenu,
  actionMenuItemClass,
  destructiveActionMenuItemClass,
} from "@/components/admin/ui/action-menu";

type Unit = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  price: number;
  status: string;
  image_url: string | null;
  category_id: string | null;
  land_area: number | null;
  bedroom_count: number | null;
  bathroom_count: number | null;
  seo_title: string | null;
  meta_description: string | null;
  is_indexed: boolean | null;
  og_image: string | null;
  is_featured: boolean;
  featured_order: number | null;
  updated_at: string | null;
  updated_label: string;
  categories: { id: string; name: string } | { id: string; name: string }[] | null;
};

type Category = { id: string; name: string };

function unitCategory(unit: Unit) {
  return Array.isArray(unit.categories) ? unit.categories[0] || null : unit.categories;
}

// ─── Status System ────────────────────────────────────────────────────────────

const UNIT_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  Tersedia: { label: "Tersedia", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Booked: { label: "Booked", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Sold: { label: "Terjual", bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  "Coming Soon": { label: "Coming Soon", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Draft: { label: "Draft", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

function UnitStatusBadge({ status }: { status: string }) {
  const cfg = UNIT_STATUS_CONFIG[status] || { label: status, bg: "bg-slate-50/80", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text} border border-white/50 shadow-sm backdrop-blur-sm`}>
      <span className={`size-1.5 rounded-full ${cfg.dot} flex-shrink-0`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function HomepageBadge({ unit }: { unit: Unit }) {
  if (!unit.is_featured) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
      <Star size={12} className="fill-current" aria-hidden="true" />
      Urutan {unit.featured_order ?? "—"}
    </span>
  );
}

// ─── SEO Readiness ────────────────────────────────────────────────────────────

function getSeoIssues(unit: Unit): string[] {
  const issues: string[] = [];
  if (!unit.meta_description) issues.push("Meta description kosong");
  if (!unit.image_url && !unit.og_image) issues.push("Gambar utama belum ada");
  if (!unit.location) issues.push("Lokasi belum diisi");
  if (unit.is_indexed === false) issues.push("Noindex aktif");
  return issues;
}

function SeoReadinessBadge({ unit }: { unit: Unit }) {
  const issues = getSeoIssues(unit);
  if (issues.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
        <CheckCircle size={13} aria-hidden="true" />
        Siap
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 cursor-help" title={issues.join(" • ")}>
      <AlertTriangle size={13} aria-hidden="true" />
      {issues.length} masalah
    </span>
  );
}

function UnitThumbnail({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="w-16 h-11 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Home size={16} className="text-slate-400" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
      <Image src={src} alt={alt} fill sizes="64px" className="object-cover" loading="lazy" />
    </div>
  );
}

// ─── Row More Menu ────────────────────────────────────────────────────────────

function UnitRowActions({ unit, onDeleted }: { unit: Unit; onDeleted: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(`Hapus "${unit.title}" dari katalog?\n\nUnit akan disembunyikan dari dashboard dan situs publik.`);
    if (!confirmed) return;
    setDeleting(true);
    try {
      const result = await deleteUnit(unit.id);
      if (result?.error) throw new Error(result.error);
      toast.success("Unit berhasil dihapus dari katalog");
      onDeleted(unit.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus unit.";
      toast.error(message);
      if (/sesi berakhir|akses admin/i.test(message)) {
        router.replace("/admin/login?error=session_expired");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5 flex-shrink-0">
      {/* PRIMARY: Edit — always visible */}
      <Link
        href={`/admin/units/edit/${unit.id}`}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        aria-label={`Edit ${unit.title}`}
      >
        <Edit size={14} aria-hidden="true" />
        Edit
      </Link>

      {/* SECONDARY: More — always visible */}
      <ActionMenu loading={deleting} label={`Aksi lainnya untuk ${unit.title}`}>
        <Link
          href={`/unit/${unit.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          tabIndex={-1}
          className={actionMenuItemClass}
        >
          <ExternalLink size={14} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
          Lihat Halaman
        </Link>
        <div className="my-1 border-t border-slate-100" role="separator" />
        <button
          type="button"
          onClick={handleDelete}
          role="menuitem"
          tabIndex={-1}
          className={destructiveActionMenuItemClass}
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} aria-hidden="true" />}
          Hapus Unit
        </button>
      </ActionMenu>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

export default function UnitsWorkspace({ units: initialUnits, categories }: { units: Unit[]; categories: Category[] }) {
  const router = useRouter();
  const [units, setUnits] = useState(initialUnits);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const hasActiveFilters = filterStatus !== "all" || filterCategory !== "all" || search.trim() !== "";

  const handleReset = () => { setSearch(""); setFilterStatus("all"); setFilterCategory("all"); };
  const handleDeleted = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
    router.refresh();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return units.filter((u) => {
      const matchStatus = filterStatus === "all" || u.status === filterStatus;
      const category = unitCategory(u);
      const matchCategory = filterCategory === "all" || category?.id === filterCategory;
      const matchSearch = !q || u.title.toLowerCase().includes(q) || (u.slug || "").toLowerCase().includes(q) || (u.location || "").toLowerCase().includes(q) || (category?.name || "").toLowerCase().includes(q);
      return matchStatus && matchCategory && matchSearch;
    });
  }, [units, filterStatus, filterCategory, search]);

  const statusOptions = [
    { label: "Semua Status", value: "all" },
    ...Object.entries(UNIT_STATUS_CONFIG).map(([val, cfg]) => ({ label: cfg.label, value: val })),
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari unit, lokasi, kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-white placeholder:text-slate-400"
              aria-label="Cari unit properti"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer" aria-label="Filter status">
                {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            </div>
            {categories.length > 0 && (
              <div className="relative">
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="appearance-none text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer" aria-label="Filter kategori">
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
              </div>
            )}
            {hasActiveFilters && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-2 py-2 transition-colors" aria-label="Reset semua filter">
                <X size={14} /> Reset
              </button>
            )}
          </div>
        </div>
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium self-center">Filter aktif:</span>
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                {UNIT_STATUS_CONFIG[filterStatus]?.label || filterStatus}
                <button onClick={() => setFilterStatus("all")} aria-label="Hapus filter status"><X size={11} /></button>
              </span>
            )}
            {filterCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                {categories.find((c) => c.id === filterCategory)?.name}
                <button onClick={() => setFilterCategory("all")} aria-label="Hapus filter kategori"><X size={11} /></button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                "{search}"
                <button onClick={() => setSearch("")} aria-label="Hapus pencarian"><X size={11} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 px-1">
        Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {units.length} unit
      </p>

      {filtered.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200">
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Properti</th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Harga</th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Homepage</th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SEO</th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Diperbarui</th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UnitThumbnail src={unit.image_url} alt={unit.title} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 leading-snug truncate max-w-[200px]">{unit.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {unit.location && (
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                  <MapPin size={10} className="flex-shrink-0" aria-hidden="true" />
                                  {unit.location}
                                </span>
                              )}
                              {unitCategory(unit)?.name && (
                                <span className="text-xs text-slate-300">· <span className="text-slate-400">{unitCategory(unit)?.name}</span></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">{formatRupiah(unit.price)}</p>
                        {(unit.land_area || unit.bedroom_count) && (
                          <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                            {unit.land_area ? `${unit.land_area}m²` : ""}{unit.bedroom_count ? ` · ${unit.bedroom_count}KT` : ""}{unit.bathroom_count ? ` · ${unit.bathroom_count}KM` : ""}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4"><UnitStatusBadge status={unit.status} /></td>
                      <td className="px-5 py-4"><HomepageBadge unit={unit} /></td>
                      <td className="px-5 py-4"><SeoReadinessBadge unit={unit} /></td>
                      <td className="px-5 py-4">
                        <time dateTime={unit.updated_at ?? undefined} className="text-xs text-slate-400 whitespace-nowrap">{unit.updated_label}</time>
                      </td>
                      <td className="px-5 py-4">
                        <UnitRowActions unit={unit} onDeleted={handleDeleted} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((unit) => (
              <MobileUnitCard key={unit.id} unit={unit} onDeleted={handleDeleted} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] py-20 text-center flex flex-col items-center">
          {hasActiveFilters ? (
            <>
              <p className="text-sm font-medium text-slate-600">Tidak ada properti yang cocok dengan filter ini.</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Coba ubah kriteria pencarian atau filter yang aktif.</p>
              <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                <X size={14} /> Reset Filter
              </button>
            </>
          ) : (
            <>
              <Home size={32} className="mx-auto text-slate-300 mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-600">Belum ada properti.</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Tambahkan unit pertama untuk mulai mengelola inventory Titik Huni.</p>
              <Link href="/admin/units/new" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                Tambah Unit
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MobileUnitCard({ unit, onDeleted }: { unit: Unit; onDeleted: (id: string) => void }) {
  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {unit.image_url ? (
        <div className="relative w-full h-36 bg-slate-100">
          <Image src={unit.image_url} alt={unit.title} fill sizes="(max-width: 768px) 100vw" className="object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="w-full h-24 bg-slate-100 flex items-center justify-center">
          <Home size={24} className="text-slate-300" aria-hidden="true" />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-snug">{unit.title}</p>
            {unit.location && (
              <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin size={10} aria-hidden="true" /> {unit.location}
              </p>
            )}
          </div>
          <UnitStatusBadge status={unit.status} />
        </div>
        {unit.is_featured && <HomepageBadge unit={unit} />}
        <div>
          <p className="text-base font-semibold text-slate-900">{formatRupiah(unit.price)}</p>
          {(unit.land_area || unit.bedroom_count) && (
            <p className="text-xs text-slate-400 mt-0.5">
              {unit.land_area ? `${unit.land_area}m²` : ""}{unit.bedroom_count ? ` · ${unit.bedroom_count} KT` : ""}{unit.bathroom_count ? ` · ${unit.bathroom_count} KM` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <SeoReadinessBadge unit={unit} />
          <time dateTime={unit.updated_at ?? undefined}>{unit.updated_label}</time>
        </div>
        {/* PERSISTENT mobile actions */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <UnitRowActions unit={unit} onDeleted={onDeleted} />
        </div>
      </div>
    </div>
  );
}
