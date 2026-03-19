"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  PieChart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles, // Icon untuk Leads Baru
} from "lucide-react";

export default function AdminSidebar({
  isMobile,
  closeMobile,
}: {
  isMobile?: boolean;
  closeMobile?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // --- UPDATE MENU DISINI ---
  const menus = [
    { name: "Dashboard Utama", href: "/admin/dashboard", icon: Users },
    { name: "Leads Baru", href: "/admin/leads-baru", icon: Sparkles }, // Menu Baru
    { name: "Laporan & Grafik", href: "/admin/laporan", icon: PieChart },
  ];
  // --------------------------

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const getItemClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-amber-500 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;
  };

  return (
    <div
      className={`bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 relative
      ${isMobile ? "w-full" : collapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-slate-100 relative">
        {!collapsed && (
          <span className="font-bold text-xl text-slate-800 tracking-tight">
            Haspro<span className="text-amber-500">agency</span>
          </span>
        )}
        {collapsed && (
          <span className="font-bold text-xl text-amber-500">A</span>
        )}

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 text-slate-500"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <p
          className={`text-xs font-semibold text-slate-400 uppercase mb-2 px-3 ${
            collapsed ? "text-center" : ""
          }`}
        >
          {collapsed ? "Menu" : "Main Menu"}
        </p>

        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            onClick={closeMobile}
            className={getItemClass(menu.href)}
            title={collapsed ? menu.name : ""}
          >
            <menu.icon size={20} className={collapsed ? "mx-auto" : ""} />
            {!collapsed && (
              <span className="font-medium text-sm">{menu.name}</span>
            )}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Keluar</span>}
        </button>
      </div>
    </div>
  );
}
