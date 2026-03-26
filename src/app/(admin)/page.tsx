"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Users,
  Home,
  FileText,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeUnits: 0,
    totalPosts: 0,
    recentLeads: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Hitung Total Leads
        const { count: leadsCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });

        // 2. Hitung Unit Properti Aktif
        const { count: unitsCount } = await supabase
          .from("units")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null);

        // 3. Hitung Artikel Blog Terbit
        const { count: postsCount } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");

        // 4. Ambil 5 Leads Terbaru
        const { data: recentLeads } = await supabase
          .from("leads")
          .select("*, units(title)")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalLeads: leadsCount || 0,
          activeUnits: unitsCount || 0,
          totalPosts: postsCount || 0,
          recentLeads: recentLeads || [],
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
          Statistik <span className="text-neutral-400">Utama</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-widest">
          Titik Huni Management Control
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Leads Masuk"
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
          label="Konversi"
          value="4.8%"
          icon={<TrendingUp size={20} />}
          color="bg-black text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center">
            <h3 className="font-bold uppercase text-[10px] tracking-[0.2em]">
              Leads Terbaru
            </h3>
            <Link
              href="/admin/leads"
              className="text-[10px] font-bold uppercase text-neutral-400 hover:text-black"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50 text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {stats.recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold">{lead.name}</p>
                      <p className="text-[10px] text-neutral-400">
                        {lead.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-medium text-neutral-600">
                      {lead.units?.title || "Umum"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/leads`}
                        className="text-black hover:underline inline-flex items-center gap-1 text-[10px] font-bold uppercase"
                      >
                        Detail <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
            Aksi Cepat
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/units/new"
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-black hover:text-white transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                Tambah Unit
              </span>
              <ArrowUpRight
                size={16}
                className="text-neutral-300 group-hover:text-white"
              />
            </Link>
            <Link
              href="/admin/posts/new"
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-black hover:text-white transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                Tulis Blog
              </span>
              <ArrowUpRight
                size={16}
                className="text-neutral-300 group-hover:text-white"
              />
            </Link>
          </div>
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
      className={`${color} p-6 rounded-3xl border border-neutral-100 shadow-sm`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-neutral-50/10 rounded-xl">{icon}</div>
      </div>
      <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-50 mb-1">
        {label}
      </p>
      <p className="text-3xl font-black tracking-tighter leading-none">
        {value}
      </p>
    </div>
  );
}
