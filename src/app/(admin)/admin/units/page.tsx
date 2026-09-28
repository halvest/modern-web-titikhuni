// src/app/(admin)/admin/units/page.tsx
import { requireAdminPage } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Home, CheckCircle2, Clock, PackageX } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import UnitsWorkspace from "./UnitsWorkspace";

dayjs.extend(relativeTime);
dayjs.locale("id");

export const dynamic = "force-dynamic";

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
  categories: { id: string; name: string } | { id: string; name: string }[] | null;
};

type Category = { id: string; name: string };

export default async function UnitsPage() {
  const { supabase } = await requireAdminPage();

  const [{ data: units, error: unitsError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase
      .from("units")
      .select(
        "id, title, slug, location, price, status, image_url, category_id, land_area, bedroom_count, bathroom_count, seo_title, meta_description, is_indexed, og_image, is_featured, featured_order, updated_at, categories(id, name)"
      )
      .is("deleted_at", null)
      .order("priority_order", { ascending: true }),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  const allUnits = (units as unknown as Unit[]) ?? [];
  const unitsWithUpdatedLabels = allUnits.map((unit) => ({
    ...unit,
    updated_label: unit.updated_at ? dayjs(unit.updated_at).fromNow() : "—",
  }));
  const allCategories = (categories as Category[]) ?? [];

  // Server-side KPI computation
  const total = allUnits.length;
  const available = allUnits.filter((u) => u.status === "Tersedia").length;
  const booked = allUnits.filter((u) => u.status === "Booked").length;
  const sold = allUnits.filter(
    (u) => u.status === "Sold" || u.status === "Terjual"
  ).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-10 w-full pb-10">

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b border-slate-200/60 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
            Manajemen Properti
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Unit & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Listing</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Kelola data properti, harga, media visual, dan visibilitas pencarian (SEO).
          </p>
        </div>
        <Link
          href="/admin/units/new"
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-[0_8px_25px_rgb(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 self-start sm:self-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]" />
          <span className="relative flex items-center gap-2">
            <span className="text-lg leading-none mt-[-2px]">+</span> Tambah Unit
          </span>
        </Link>
      </header>

      {(unitsError || categoriesError) && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Data properti belum dapat dimuat lengkap. Coba muat ulang halaman.
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
        <KpiCard
          label="Total Unit"
          value={total}
          description="Keseluruhan listing properti"
          iconBg="bg-gradient-to-br from-blue-100 to-indigo-50"
          iconColor="text-blue-600"
          icon={<Home size={20} strokeWidth={1.5} />}
        />
        <KpiCard
          label="Tersedia"
          value={available}
          description="Unit siap dipasarkan"
          iconBg="bg-gradient-to-br from-emerald-100 to-teal-50"
          iconColor="text-emerald-600"
          icon={<CheckCircle2 size={20} strokeWidth={1.5} />}
        />
        <KpiCard
          label="Booked"
          value={booked}
          description="Sedang dalam proses KPR/cicilan"
          iconBg="bg-gradient-to-br from-amber-100 to-orange-50"
          iconColor="text-amber-600"
          icon={<Clock size={20} strokeWidth={1.5} />}
        />
        <KpiCard
          label="Terjual"
          value={sold}
          description="Properti yang sudah serah terima"
          iconBg="bg-gradient-to-br from-violet-100 to-fuchsia-50"
          iconColor="text-violet-600"
          icon={<PackageX size={20} strokeWidth={1.5} />}
        />
      </div>

      {/* Client Workspace: Filters + Table */}
      {!unitsError && <UnitsWorkspace units={unitsWithUpdatedLabels} categories={allCategories} />}
    </div>
  );
}

function KpiCard({
  label,
  value,
  description,
  iconBg,
  iconColor,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col z-10">
          <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-slate-500">
            {label}
          </p>
          <p className="mt-3.5 text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
            {value.toLocaleString("id-ID")}
          </p>
          <p className="mt-3 text-[11px] font-medium text-slate-400">
            {description}
          </p>
        </div>
        <div
          className={`relative z-10 flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-[14px] ${iconBg} ${iconColor} shadow-[inset_0_1px_3px_rgb(255,255,255,0.5)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
