"use client";

import { useState, useEffect } from "react";
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
  const [lastScroll, setLastScroll] = useState(0);
  const pathname = usePathname();

  // Auto hide navbar saat scroll
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      // Sembunyikan jika scroll ke bawah, tampilkan jika scroll ke atas
      if (current > lastScroll && current > 100 && !menuOpen) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll, menuOpen]);

  return (
    <>
      {/* Breadcrumb Schema SEO */}
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
              item: `https://titikhuni.com${item.href}`,
            })),
          }),
        }}
      />

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="backdrop-blur-xl bg-white/70 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Developer Properti Titik Huni Yogyakarta"
                width={130}
                height={40}
                priority
                className="w-auto h-9 md:h-10"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? "text-black"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href={WHATSAPP_URL}
                target="_blank"
                className="bg-neutral-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-neutral-200"
              >
                Hubungi Sekarang
              </Link>
            </nav>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-neutral-800 transition-transform active:scale-90"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown (Accordion Style) */}
          <div
            className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden border-t border-neutral-100 ${
              menuOpen ? "max-h-[500px] py-8 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-lg font-bold transition-all ${
                    pathname === link.href
                      ? "text-black translate-x-2"
                      : "text-neutral-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href={WHATSAPP_URL}
                target="_blank"
                className="bg-neutral-900 text-white text-center py-4 rounded-xl font-bold mt-4 active:scale-95 transition-all shadow-xl"
              >
                Hubungi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
