// src/components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  Home,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  PlusCircle,
  FolderTree,
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

  // Struktur Menu yang disesuaikan dengan skema database baru
  const menuGroups = [
    {
      label: "Utama",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Leads Properti", href: "/admin/leads", icon: Users },
      ],
    },
    {
      label: "Inventory",
      items: [
        { name: "Unit Properti", href: "/admin/units", icon: Home },
        { name: "Kategori", href: "/admin/categories", icon: FolderTree },
      ],
    },
    {
      label: "Konten",
      items: [{ name: "Artikel Blog", href: "/admin/posts", icon: FileText }],
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`bg-white border-r border-neutral-200 h-screen flex flex-col transition-all duration-300 relative shadow-sm
      ${isMobile ? "w-full" : collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-neutral-100 relative">
        {!collapsed ? (
          <span className="font-black text-xl tracking-tighter text-neutral-900 uppercase">
            Titik<span className="text-neutral-300">Huni</span>
          </span>
        ) : (
          <span className="font-black text-xl text-black mx-auto">T.</span>
        )}

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-7 bg-white border border-neutral-200 rounded-full p-1 shadow-sm hover:bg-neutral-50 text-neutral-400 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Navigation Content */}
      <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 px-3 mb-4">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? "bg-black text-white shadow-lg shadow-black/10"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                  }`}
                  title={collapsed ? item.name : ""}
                >
                  <item.icon
                    size={18}
                    className={`${collapsed ? "mx-auto" : ""} flex-shrink-0`}
                  />
                  {!collapsed && (
                    <span className="font-bold text-xs uppercase tracking-widest">
                      {item.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / User Area */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} />
          {!collapsed && (
            <span className="font-bold text-xs uppercase tracking-widest">
              Keluar
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
