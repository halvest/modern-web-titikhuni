// src/components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  Home,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Images,
  Loader2,
  X,
} from "lucide-react";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { name: "Leads", href: "/admin/leads", icon: Users },
    ],
  },
  {
    label: "Properti",
    items: [
      { name: "Unit Properti", href: "/admin/units", icon: Home },
      { name: "Kategori", href: "/admin/categories", icon: FolderTree },
    ],
  },
  {
    label: "Konten",
    items: [
      { name: "Proyek", href: "/admin/projects", icon: Images },
      { name: "Artikel Blog", href: "/admin/posts", icon: FileText },
    ],
  },
];

export default function AdminSidebar({
  isMobile,
  closeMobile,
}: {
  isMobile?: boolean;
  closeMobile?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLogoutError("Gagal keluar. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`bg-slate-950 h-full min-h-0 flex flex-col transition-all duration-300 relative flex-shrink-0 z-40 border-r border-slate-900/50 shadow-xl
      ${isMobile ? "w-full" : collapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Brand */}
      <div className={`h-16 flex items-center border-b border-slate-800/60 relative flex-shrink-0 ${collapsed ? "px-0 justify-center" : "px-6"}`}>
        {!collapsed ? (
          <div className="flex items-center">
            <Image
              src="/assets/icons/white-logo.png"
              alt="Titik Huni Logo"
              width={140}
              height={40}
              className="w-[110px] h-auto object-contain"
              priority
            />
          </div>
        ) : (
          <Image
            src="/assets/icons/white-logo.png"
            alt="TH Logo"
            width={40}
            height={40}
            className="h-8 w-8 object-cover object-left"
            priority
          />
        )}

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-full p-1.5 shadow-md text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700 transition-all z-50 focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
        {isMobile && (
          <button
            type="button"
            onClick={closeMobile}
            className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Tutup navigasi"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-7 overflow-y-auto" aria-label="Admin navigation">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 px-3 mb-3">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    title={collapsed ? item.name : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group overflow-hidden
                      ${active
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-emerald-500/20"
                        : "text-slate-400 font-medium hover:bg-slate-900 hover:text-slate-100 border border-transparent"
                      }
                      ${collapsed ? "justify-center" : ""}
                    `}
                  >
                    {active && !collapsed && (
                      <span className="w-1 h-1/2 bg-emerald-400 rounded-full absolute left-0 ml-1 shadow-[0_0_10px_rgba(52,211,153,0.5)]" aria-hidden="true" />
                    )}
                    
                    <item.icon
                      size={18}
                      strokeWidth={active ? 2.5 : 2}
                      className={`flex-shrink-0 z-10 transition-colors ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}
                    />
                    {!collapsed && (
                      <span className="text-[13px] z-10">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-slate-800/60 flex-shrink-0 bg-slate-950/80 ${collapsed ? "flex justify-center" : ""}`}>
        {logoutError && !collapsed && (
          <p role="alert" className="mb-3 rounded-lg bg-rose-500/10 px-3 py-2 text-[11px] font-medium leading-5 text-rose-400 border border-rose-500/20">
            {logoutError}
          </p>
        )}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Keluar"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 font-medium hover:text-rose-400 hover:bg-slate-900 transition-all w-full ${collapsed ? "justify-center w-auto" : ""}`}
        >
          {loggingOut ? <Loader2 size={18} className="flex-shrink-0 animate-spin text-rose-500" /> : <LogOut size={18} className="flex-shrink-0 group-hover:text-rose-400 transition-colors" />}
          {!collapsed && (
            <span className="text-[13px]">{loggingOut ? "Keluar..." : "Keluar Akun"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
