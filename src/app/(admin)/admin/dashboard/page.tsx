import { requireAdminPage } from "@/utils/supabase/server";
import {
  Users,
  Home,
  FileText,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  TriangleAlert,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import LeadTrendChart from "@/components/admin/dashboard/LeadTrendChart";

dayjs.extend(relativeTime);
dayjs.locale("id");

// ─── Types ────────────────────────────────────────────────────────────────────

type Lead = {
  id: string;
  name: string;
  phone?: string;
  status?: string;
  source?: string;
  created_at: string;
  units?: { title: string } | { title: string }[] | null;
};

type Unit = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  new: { label: "Baru", bg: "bg-blue-50/80", text: "text-blue-700", dot: "bg-blue-500" },
  contacted: { label: "Dihubungi", bg: "bg-sky-50/80", text: "text-sky-700", dot: "bg-sky-500" },
  qualified: { label: "Qualified", bg: "bg-emerald-50/80", text: "text-emerald-700", dot: "bg-emerald-500" },
  site_visit: { label: "Survei", bg: "bg-amber-50/80", text: "text-amber-700", dot: "bg-amber-500" },
  booking: { label: "Booking", bg: "bg-orange-50/80", text: "text-orange-700", dot: "bg-orange-500" },
  won: { label: "Closing", bg: "bg-violet-50/80", text: "text-violet-700", dot: "bg-violet-500" },
  lost: { label: "Batal", bg: "bg-rose-50/80", text: "text-rose-700", dot: "bg-rose-500" },
};

const UNIT_STATUS_MAP: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  Tersedia: { label: "Tersedia", bg: "bg-emerald-50/80", text: "text-emerald-700", dot: "bg-emerald-500" },
  Terjual: { label: "Terjual", bg: "bg-violet-50/80", text: "text-violet-700", dot: "bg-violet-500" },
  Booked: { label: "Booked", bg: "bg-amber-50/80", text: "text-amber-700", dot: "bg-amber-500" },
  "Coming Soon": { label: "Segera", bg: "bg-blue-50/80", text: "text-blue-700", dot: "bg-blue-500" },
};

function getStatusBadge(raw?: string) {
  const key = (raw || "new").toLowerCase();
  const s = STATUS_MAP[key] || { label: raw || "—", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} border border-white/50 shadow-sm backdrop-blur-sm`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

function getUnitStatusBadge(raw?: string) {
  const s =
    UNIT_STATUS_MAP[raw || ""] ||
    { label: raw || "—", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} border border-white/50 shadow-sm backdrop-blur-sm`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

function buildTrend(
  leads: Lead[]
): { label: string; leads: number }[] {
  const days: { label: string; leads: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = dayjs().subtract(i, "day");
    const count = leads.filter((l) =>
      dayjs(l.created_at).isSame(d, "day")
    ).length;
    days.push({ label: d.format("DD/MM"), leads: count });
  }
  return days;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const { supabase, user } = await requireAdminPage();

  const [
    leadsResult,
    unitsResult,
    postsResult,
    recentLeadsResult,
    recentUnitsResult,
    last7DaysLeadsResult,
    leadStatusesResult,
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("units")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("leads")
      .select("id, name, phone, status, source, created_at, units(title)")
      .order("created_at", { ascending: false })
      .limit(7),
    supabase
      .from("units")
      .select("id, title, status, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("id, created_at")
      .gte(
        "created_at",
        dayjs().subtract(6, "day").startOf("day").toISOString()
      ),
    supabase.from("leads").select("id, status"),
  ]);

  const leads = recentLeadsResult.data as Lead[] ?? [];
  const units = recentUnitsResult.data as Unit[] ?? [];
  const trendData = buildTrend((last7DaysLeadsResult.data as Lead[]) ?? []);
  const username = user.email?.split("@")[0] ?? "Admin";

  const allLeads = (leadStatusesResult.data ?? []) as Array<{ id: string; status: string | null }>;
  const countByStatus = (status: string) =>
    allLeads.filter((lead) => (lead.status || "new").toLowerCase() === status).length;

  const funnelStages = [
    { label: "Semua Lead Masuk", count: leadsResult.count ?? 0, color: "bg-slate-300" },
    { label: "Prospek Berkualitas", count: countByStatus("qualified"), color: "bg-blue-400" },
    { label: "Survei Lokasi", count: countByStatus("site_visit"), color: "bg-amber-400" },
    { label: "Booking Fee", count: countByStatus("booking"), color: "bg-orange-400" },
    { label: "Closing / Terjual", count: countByStatus("won"), color: "bg-emerald-500" },
  ];
  const maxFunnel = funnelStages[0].count || 1;
  const dataErrorCount = [
    leadsResult,
    unitsResult,
    postsResult,
    recentLeadsResult,
    recentUnitsResult,
    last7DaysLeadsResult,
    leadStatusesResult,
  ].filter((result) => result.error).length;

  return (
    <div className="space-y-8 sm:space-y-10 max-w-[1400px] mx-auto w-full pb-10">
      {/* ── Header Area ─────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b border-slate-200/60 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
            Ringkasan Eksekutif
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dasbor <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Titik Huni</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Selamat datang, <span className="text-slate-800 capitalize">{username}</span>. Berikut adalah performa properti Anda hari ini.
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

      {dataErrorCount > 0 && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 text-sm text-amber-900 shadow-sm backdrop-blur-md">
          <TriangleAlert size={18} className="mt-0.5 flex-shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-800">Sebagian data belum dapat dimuat.</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700/80">Koneksi ke database sedang mengalami kendala. Metrik tertentu mungkin belum lengkap. Silakan muat ulang halaman setelah koneksi membaik.</p>
          </div>
        </div>
      )}

      {/* ── KPI Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        <KpiCard
          label="Total Leads Masuk"
          value={leadsResult.count ?? 0}
          description="Prospek terekam dalam sistem"
          iconBg="bg-gradient-to-br from-blue-100 to-indigo-50"
          iconColor="text-blue-600"
          icon={<Users size={20} strokeWidth={1.5} />}
          href="/admin/leads"
        />
        <KpiCard
          label="Unit Properti Aktif"
          value={unitsResult.count ?? 0}
          description="Rumah tersedia dalam katalog"
          iconBg="bg-gradient-to-br from-emerald-100 to-teal-50"
          iconColor="text-emerald-600"
          icon={<Home size={20} strokeWidth={1.5} />}
          href="/admin/units"
        />
        <KpiCard
          label="Artikel Terbit"
          value={postsResult.count ?? 0}
          description="Konten Jurnal & Inspirasi"
          iconBg="bg-gradient-to-br from-violet-100 to-fuchsia-50"
          iconColor="text-violet-600"
          icon={<FileText size={20} strokeWidth={1.5} />}
          href="/admin/posts"
        />
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Lead trend chart (2/3 width) */}
        <div className="xl:col-span-2 flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Tren Performa Lead
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Statistik 7 hari terakhir</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400">
              <TrendingUp size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="p-6 pt-5 bg-gradient-to-b from-transparent to-slate-50/30">
            <LeadTrendChart data={trendData} />
          </div>
        </div>

        {/* Lead Funnel (1/3 width) */}
        <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Distribusi Funnel Lead
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">Konversi tahap ke tahap</p>
          </div>
          <div className="p-6 flex-1 bg-gradient-to-b from-transparent to-slate-50/30">
            <div className="space-y-6">
              {funnelStages.map((stage) => {
                const pct = maxFunnel > 0 ? Math.round((stage.count / maxFunnel) * 100) : 0;
                return (
                  <div key={stage.label} className="group relative">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-600 transition-colors group-hover:text-slate-900">{stage.label}</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {stage.count}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full ${stage.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Leads */}
        <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Lead Terbaru</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Prospek masuk yang perlu ditindaklanjuti</p>
            </div>
            <Link
              href="/admin/leads"
              className="group flex h-9 items-center gap-2 rounded-lg bg-slate-50 px-3 text-[11px] font-bold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Semua <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kontak Lead</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Properti Diminati</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-3">
                            <span className="text-sm font-bold text-slate-600">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                              {lead.name}
                            </p>
                            {lead.phone && (
                              <p className="text-[11px] font-medium text-slate-500 mt-1.5">
                                {lead.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs font-medium text-slate-600 truncate max-w-[160px] inline-block">
                          {Array.isArray(lead.units) ? lead.units[0]?.title || "—" : lead.units?.title || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                          {dayjs(lead.created_at).fromNow()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 mb-3">
                        <Users size={20} className="text-slate-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Belum ada lead masuk.</p>
                      <p className="text-xs text-slate-400 mt-1">Lead dari form landing page akan otomatis muncul di sini.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Units */}
        <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Katalog Unit Properti</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Pembaruan listing terbaru</p>
            </div>
            <Link
              href="/admin/units"
              className="group flex h-9 items-center gap-2 rounded-lg bg-slate-50 px-3 text-[11px] font-bold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Kelola <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div>
            {units.length > 0 ? (
              <ul className="divide-y divide-slate-50">
                {units.map((unit) => (
                  <li key={unit.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100/50 to-teal-50 border border-emerald-100 shadow-sm transition-transform group-hover:scale-105 group-hover:-rotate-3">
                        <Home size={18} className="text-emerald-700" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {unit.title}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1">
                          Ditambahkan {dayjs(unit.created_at).format("DD MMM YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4 shrink-0">
                      {getUnitStatusBadge(unit.status)}
                      <Link
                        href={`/admin/units/edit/${unit.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label={`Edit ${unit.title}`}
                      >
                        <MoreHorizontal size={14} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-14 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 mb-3">
                  <Home size={20} className="text-slate-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-slate-600">Belum ada unit properti.</p>
                <Link
                  href="/admin/units/new"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  + Tambah Listing Pertama
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card Component ───────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  description,
  icon,
  iconBg,
  iconColor,
  href,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]"
    >
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
      
      {/* Decorative arrow indicator */}
      <div className="absolute bottom-6 right-6 opacity-0 translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-slate-300">
        <ArrowUpRight size={20} strokeWidth={2} />
      </div>
    </Link>
  );
}

