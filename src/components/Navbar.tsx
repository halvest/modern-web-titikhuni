"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/6285190800168?text=Halo%20Titik%20Huni,%20saya%20ingin%20konsultasi%20mengenai%20hunian";

const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/tentang-kami" },
  { name: "Unit Kami", href: "/unit" },
  { name: "Arsitek & Kontraktor", href: "/arsitek-kontraktor" },
  { name: "Blog", href: "/blog" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const lastScroll = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();

  // ✅ SUPER SMOOTH SCROLL HANDLER (RAF)
  useEffect(() => {
    const updateScroll = () => {
      const current = window.scrollY;

      // background state (minimize re-render)
      if (current > 20 !== scrolled) {
        setScrolled(current > 20);
      }

      // hide/show navbar
      if (current > lastScroll.current && current > 120 && !menuOpen) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScroll.current = current;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen, scrolled]);

  // close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ✅ SEO Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: NAV_LINKS.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `https://titikhuni.id${item.href}`,
            })),
          }),
        }}
      />

      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-[100] transition-transform duration-500 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* BACKGROUND (ANTI INVISIBLE) */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-neutral-200"
              : "bg-white/80 backdrop-blur-md"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
            {/* LOGO */}
            <Link href="/" className="relative z-[110]">
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Developer Properti Premium Yogyakarta - Titik Huni"
                width={140}
                height={45}
                priority
                className="w-auto h-8 md:h-9 lg:h-10"
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative group text-[13px] font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-black"
                        : "text-neutral-700 hover:text-black"
                    }`}
                  >
                    {link.name}

                    <span
                      className={`absolute left-0 -bottom-1 h-[1.5px] bg-black transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}

              {/* CTA */}
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 text-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-black hover:scale-[1.03] active:scale-95 transition-all shadow-md"
              >
                Konsultasi Gratis
              </Link>
            </nav>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
              className="md:hidden p-2 text-neutral-800"
            >
              {menuOpen ? (
                <X size={26} strokeWidth={1.5} />
              ) : (
                <Menu size={26} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* MOBILE MENU */}
          <div
            className={`md:hidden transition-all duration-500 overflow-hidden ${
              menuOpen ? "max-h-[500px] opacity-100 py-8" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-8 flex flex-col gap-7">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-lg font-semibold transition-colors ${
                      isActive
                        ? "text-black"
                        : "text-neutral-700 hover:text-black"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* MOBILE CTA */}
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 text-white text-center py-4 rounded-xl font-semibold mt-2 active:scale-95 transition-all shadow-md"
              >
                Konsultasi Gratis
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
