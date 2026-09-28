// src/app/(admin)/admin/leads/page.tsx
import { requireAdminPage } from "@/utils/supabase/server";
import { Suspense } from "react";
import { Users, TrendingUp, Eye, CheckCircle2 } from "lucide-react";
import LeadsWorkspace from "./LeadsWorkspace";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  unit_id: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  status: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  units: { id: string; title: string } | null;
};

type KpiItem = { label: string; value: number; iconBg: string; iconColor: string; icon: React.ReactNode };

export default async function AdminLeadsPage() {
  const { supabase } = await requireAdminPage();

  const { data: leads, error } = await supabase
    .from("leads")
    .select(
      "id, name, phone, email, message, unit_id, source, utm_source, utm_medium, status, next_follow_up_at, created_at, units(id, title)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto py-20 text-center">
        <p className="text-sm text-rose-500 font-medium">Data lead gagal dimuat.</p>
        <p className="text-xs text-slate-400 mt-1">Periksa koneksi database dan coba lagi.</p>
      </div>
    );
  }

  const allLeads = (leads as unknown as Lead[]) ?? [];

  // Server-side KPI computation
  const total = allLeads.length;
  const qualified = allLeads.filter(
    (l) => (l.status || "new").toLowerCase() === "qualified"
  ).length;
  const siteVisit = allLeads.filter(
    (l) => (l.status || "new").toLowerCase() === "site_visit"
  ).length;
  const won = allLeads.filter(
    (l) => (l.status || "new").toLowerCase() === "won"
  ).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-10 w-full pb-10">

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b border-slate-200/60 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
            Manajemen CRM
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Leads</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Kelola prospek, jadwalkan survei lokasi, dan pantau perjalanan lead menuju closing.
          </p>
        </div>
      </header>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
        <KpiCard label="Total Leads" value={total} description="Seluruh prospek masuk" iconBg="bg-gradient-to-br from-blue-100 to-indigo-50" iconColor="text-blue-600" icon={<Users size={20} strokeWidth={1.5} />} />
        <KpiCard label="Qualified" value={qualified} description="Prospek berkualitas" iconBg="bg-gradient-to-br from-emerald-100 to-teal-50" iconColor="text-emerald-600" icon={<TrendingUp size={20} strokeWidth={1.5} />} />
        <KpiCard label="Survei Lokasi" value={siteVisit} description="Sedang/telah survei" iconBg="bg-gradient-to-br from-amber-100 to-orange-50" iconColor="text-amber-600" icon={<Eye size={20} strokeWidth={1.5} />} />
        <KpiCard label="Closing" value={won} description="Penjualan berhasil" iconBg="bg-gradient-to-br from-violet-100 to-fuchsia-50" iconColor="text-violet-600" icon={<CheckCircle2 size={20} strokeWidth={1.5} />} />
      </div>

      {/* Client Workspace: Filters + Table */}
      <Suspense fallback={<div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />}>
        <LeadsWorkspace leads={allLeads} />
      </Suspense>
    </div>
  );
}

function KpiCard({
  label, value, description, iconBg, iconColor, icon,
}: {
  label: string; value: number; description: string; iconBg: string; iconColor: string; icon: React.ReactNode;
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
