import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users, Home, FileText, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Proteksi Halaman (Server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  // 2. Ambil Statistik Secara Paralel (Efisiensi Tinggi)
  const [leadsCount, unitsCount, postsCount, recentLeads] = await Promise.all([
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
      .select("*, units(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
          Dashboard <span className="text-neutral-400">Utama</span>
        </h1>
        <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-widest">
          Selamat Datang, {user.email?.split("@")[0]}
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Leads"
          value={leadsCount.count || 0}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Unit Aktif"
          value={unitsCount.count || 0}
          icon={<Home size={20} />}
        />
        <StatCard
          label="Artikel Blog"
          value={postsCount.count || 0}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Conversion"
          value="4.8%"
          icon={<TrendingUp size={20} />}
          className="bg-black text-white"
        />
      </div>

      {/* Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/30">
            <h3 className="font-bold uppercase text-[10px] tracking-widest text-neutral-500">
              Leads Terbaru
            </h3>
            <Link
              href="/admin/leads"
              className="text-[10px] font-bold uppercase hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-neutral-50">
                {recentLeads.data && recentLeads.data.length > 0 ? (
                  recentLeads.data.map((lead: any) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-neutral-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold uppercase text-neutral-800">
                          {lead.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-medium">
                          {lead.whatsapp || lead.phone || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-1 bg-neutral-100 rounded text-neutral-500 uppercase">
                          {lead.units?.title || "Umum"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-neutral-300 group-hover:text-black transition-all inline-block"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-xs text-neutral-400"
                    >
                      Belum ada leads masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold uppercase text-[10px] tracking-widest text-neutral-400 ml-2">
            Aksi Cepat
          </h3>
          <QuickLink label="Tambah Unit Baru" href="/admin/units/new" />
          <QuickLink label="Tulis Blog" href="/admin/posts/new" />
          <QuickLink label="Kelola Leads" href="/admin/leads" />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   UI COMPONENTS (INTERNAL)
   ========================================================================== */

function StatCard({ label, value, icon, className = "" }: any) {
  return (
    <div
      className={`p-6 rounded-3xl border border-neutral-100 shadow-sm transition-all hover:shadow-md ${className || "bg-white text-neutral-900"}`}
    >
      <div className="p-2 bg-neutral-50 rounded-xl w-fit mb-4 text-neutral-400 group-hover:bg-white transition-colors">
        {icon}
      </div>
      <p className="text-[9px] uppercase tracking-widest font-bold opacity-50 mb-1">
        {label}
      </p>
      <p className="text-3xl font-black tracking-tighter leading-none">
        {value}
      </p>
    </div>
  );
}

function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-5 bg-white border border-neutral-100 rounded-2xl hover:bg-black hover:text-white transition-all group shadow-sm active:scale-95"
    >
      <span className="text-xs font-bold uppercase tracking-widest">
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-neutral-300 group-hover:text-white transition-colors"
      />
    </Link>
  );
}
