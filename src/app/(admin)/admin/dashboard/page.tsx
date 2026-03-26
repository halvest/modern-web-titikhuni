"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Users, Home, FileText, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeUnits: 0,
    totalPosts: 0,
    recentLeads: [] as any[],
  });

  useEffect(() => {
    async function checkAuthAndFetch() {
      // 1. Validasi Sesi Langsung
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      try {
        // 2. Ambil Statistik Pararel
        const [leads, units, posts, recent] = await Promise.all([
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

        setStats({
          totalLeads: leads.count || 0,
          activeUnits: units.count || 0,
          totalPosts: posts.count || 0,
          recentLeads: recent.data || [],
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetch();
  }, [router]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Memuat Dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
          Dashboard <span className="text-neutral-400">Utama</span>
        </h1>
        <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-widest">
          Selamat Datang, Admin Titik Huni
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Unit Aktif"
          value={stats.activeUnits}
          icon={<Home size={20} />}
        />
        <StatCard
          label="Artikel Blog"
          value={stats.totalPosts}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Conversion"
          value="4.8%"
          icon={<TrendingUp size={20} />}
          color="bg-black text-white"
        />
      </div>

      {/* Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center">
            <h3 className="font-bold uppercase text-[10px] tracking-widest">
              Leads Terbaru
            </h3>
          </div>
          <table className="w-full text-left">
            <tbody className="divide-y divide-neutral-50">
              {stats.recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold uppercase">{lead.name}</p>
                    <p className="text-[10px] text-neutral-400">{lead.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-medium text-neutral-500">
                    {lead.units?.title || "Umum"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href="/admin/leads"
                      className="text-black hover:scale-110 transition-transform inline-block"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <QuickLink label="Tambah Unit" href="/admin/units/new" />
          <QuickLink label="Tulis Blog" href="/admin/posts/new" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color = "bg-white text-neutral-900",
}: any) {
  return (
    <div
      className={`${color} p-6 rounded-3xl border border-neutral-100 shadow-sm transition-transform hover:scale-[1.02]`}
    >
      <div className="p-2 bg-neutral-100/10 w-fit rounded-xl mb-4 text-neutral-400">
        {icon}
      </div>
      <p className="text-[9px] uppercase tracking-widest font-bold opacity-60 mb-1">
        {label}
      </p>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-5 bg-white border border-neutral-100 rounded-2xl hover:bg-black hover:text-white transition-all group"
    >
      <span className="text-xs font-bold uppercase tracking-widest">
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-neutral-300 group-hover:text-white"
      />
    </Link>
  );
}
