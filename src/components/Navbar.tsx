"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/config/site";

const links = [
  { name: "Beranda", href: "/" },
  { name: "Tentang kami", href: "/tentang-kami" },
  { name: "Katalog", href: "/unit" },
  { name: "Arsitek & kontraktor", href: "/arsitek-kontraktor" },
  { name: "Blog", href: "/blog" },
];

const whatsapp = `https://wa.me/${siteConfig.organization.telephone.replace(/\D/g, "")}?text=${encodeURIComponent("Halo Titik Huni, saya ingin konsultasi mengenai hunian.")}`;

function isCurrentRoute(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const heroMode = pathname === "/" && !scrolled && !menuOpen;

  // Track window scroll for transparent/solid header styling
  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  // Close menu immediately on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on desktop breakpoint resize
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeDesktopMenu = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktop.addEventListener("change", closeDesktopMenu);
    return () => desktop.removeEventListener("change", closeDesktopMenu);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background dragging
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  return (
    <>
      <header
        ref={header}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          heroMode
            ? "border-white/10 bg-gradient-to-b from-black/45 to-black/10 text-white"
            : "border-border/80 bg-white/[0.96] text-foreground shadow-[0_10px_35px_rgba(23,24,22,0.05)] backdrop-blur-[14px]"
        }`}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <div className="site-container flex h-[var(--header-height)] items-center justify-between gap-5">
          <Link
            href="/"
            aria-label="Titik Huni — beranda"
            onClick={() => setMenuOpen(false)}
            prefetch={true}
            className="relative z-10 inline-flex min-h-12 items-center"
          >
            <Image
              src="/assets/icons/dark-titik-huni.png"
              alt="Titik Huni"
              width={678}
              height={166}
              sizes="150px"
              loading="eager"
              preload
              unoptimized
              className={`h-auto w-[8.5rem] transition-[filter] duration-300 sm:w-[9.25rem] ${
                heroMode ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          {/* Navigasi Desktop */}
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-7 xl:flex"
          >
            {links.map((link) => {
              const active = isCurrentRoute(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-11 items-center text-[0.82rem] font-medium transition-colors after:absolute after:bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    heroMode
                      ? active
                        ? "text-white after:scale-x-100 after:bg-white"
                        : "text-white/75 after:scale-x-0 after:bg-white hover:text-white hover:after:scale-x-100"
                      : active
                        ? "text-primary after:scale-x-100 after:bg-primary"
                        : "text-foreground-muted after:scale-x-0 after:bg-primary hover:text-foreground hover:after:scale-x-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex site-button-primary"
            >
              <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
              Konsultasi
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button
              ref={toggle}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-white/[0.96] text-foreground transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 xl:hidden ${
                heroMode
                  ? "border-white/40 hover:bg-white"
                  : "border-border hover:border-border-strong"
              }`}
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu Mobile */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navigasi seluler"
            className="absolute inset-x-0 top-full z-50 pt-2 xl:hidden"
          >
            <div className="site-container">
              <div className="ml-auto max-h-[calc(100dvh-var(--header-height)-1.5rem)] w-full max-w-sm overscroll-contain overflow-y-auto rounded-2xl border border-[#D5E2D7] bg-white p-3 shadow-[0_20px_50px_rgba(23,24,22,0.18)] sm:p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  {links.map((link) => {
                    const active = isCurrentRoute(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch={true}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`group flex min-h-[50px] items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                          active
                            ? "bg-[#F4F7F4] text-primary font-semibold"
                            : "text-foreground hover:bg-[#F4F7F4] active:bg-[#EAF0EB]"
                        }`}
                      >
                        <span className="text-[15px] tracking-[-0.015em]">
                          {link.name}
                        </span>
                        <ArrowUpRight
                          size={17}
                          className={`shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                            active ? "text-primary" : "text-foreground-soft group-hover:text-foreground"
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-[#D5E2D7] pt-3">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="site-button-primary w-full justify-center py-3 text-[14px]"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    <span>Mulai konsultasi</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Backdrop overlay di mobile untuk closing yang mulus dan bebas benturan event */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity duration-200 xl:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
