"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/units": "Unit Properti",
  "/admin/categories": "Kategori",
  "/admin/projects": "Proyek",
  "/admin/posts": "Artikel Blog",
};

function getPageTitle(pathname: string) {
  const route = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((item) => pathname === item || pathname.startsWith(`${item}/`));

  if (!route) return "Admin";
  if (pathname.endsWith("/new")) return `Tambah ${PAGE_TITLES[route]}`;
  if (pathname.includes("/edit/")) return `Edit ${PAGE_TITLES[route]}`;
  return PAGE_TITLES[route];
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="fixed inset-0 flex w-full min-h-0 overflow-hidden bg-slate-50">
      <div className="hidden lg:block" style={{ height: "100%" }}>
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigasi admin">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup navigasi"
          />
          <div className="relative h-full w-[min(84vw,18rem)] shadow-2xl">
            <AdminSidebar isMobile closeMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col" style={{ height: "100%" }}>
        <header className="z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 lg:hidden"
              aria-label="Buka navigasi"
              aria-expanded={mobileOpen}
            >
              <Menu size={19} aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Titik Huni Admin</p>
              <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:inline-flex"
            >
              Lihat situs <ExternalLink size={14} aria-hidden="true" />
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100" title="Administrator">
              <span className="text-xs font-semibold text-emerald-700">A</span>
            </div>
          </div>
        </header>

        <main 
          className={`flex flex-col ${
            pathname.endsWith("/new") || pathname.includes("/edit/")
              ? "overflow-hidden"
              : "overflow-y-auto p-4 sm:p-6 lg:p-8"
          }`}
          style={{ flex: "1 1 0%", minHeight: 0 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
