import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const primaryLinks = [
  { href: "/unit", label: "Pilihan hunian" },
  { href: "/proyek", label: "Portfolio proyek" },
  { href: "/arsitek-kontraktor", label: "Arsitek & kontraktor" },
  { href: "/tentang-kami", label: "Tentang kami" },
  { href: "/blog", label: "Blog & panduan" },
  { href: "/kebijakan-privasi", label: "Kebijakan privasi" },
];

const serviceLinks = [
  { href: "/unit", label: "Rumah siap huni & indent" },
  { href: "/arsitek-kontraktor", label: "Desain arsitektur tropis" },
  { href: "/arsitek-kontraktor", label: "Konstruksi & bangun baru" },
  { href: "/unit", label: "Kawasan Yogyakarta" },
  { href: "/arsitek-kontraktor", label: "Konsultasi perencanaan" },
];

export function Footer() {
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Titik Huni, saya ingin berkonsultasi mengenai hunian atau proyek properti di Yogyakarta."
  )}`;

  return (
    <footer
      id="site-footer"
      className="border-t border-white/10 bg-[#121411] text-white/70"
    >
      <div className="site-container pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] pt-12 md:pt-16">
        {/* Main Grid: Brand Column + Navigation Columns + Info Column */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* 1. Brand & Value Proposition Column */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label="Titik Huni — Beranda"
              className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Titik Huni"
                width={678}
                height={166}
                sizes="170px"
                unoptimized
                className="h-auto w-36 brightness-0 invert md:w-44"
              />
            </Link>

            <p className="mt-4 text-balance text-base font-medium leading-relaxed tracking-[-0.02em] text-white/90 sm:text-lg">
              Hunian modern yang terasa tepat untuk pulang.
            </p>

            <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-white/60">
              Developer properti dan studio perancangan arsitektur berorientasi kenyamanan hidup di kawasan Yogyakarta dan sekitarnya.
            </p>

            {/* Studio Status Indicator */}
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/80">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Studio &amp; Kantor Aktif · Yogyakarta</span>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 flex items-center gap-2.5">
              {[
                {
                  href: siteConfig.social.instagram,
                  label: "Instagram Titik Huni",
                  icon: Instagram,
                },
                {
                  href: siteConfig.social.facebook,
                  label: "Facebook Titik Huni",
                  icon: Facebook,
                },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-white/80 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* 2 & 3. Navigation Columns (Desktop Only - Hidden on Mobile) */}
          <div className="hidden grid-cols-2 gap-8 lg:col-span-5 lg:grid">
            {/* Jelajahi */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Jelajahi
              </p>
              <nav aria-label="Navigasi utama footer" className="mt-4 flex flex-col space-y-1">
                {primaryLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group inline-flex min-h-[38px] w-fit items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-emerald-400"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Layanan & Area */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Layanan &amp; Area
              </p>
              <nav aria-label="Layanan dan fokus area" className="mt-4 flex flex-col space-y-1">
                {serviceLinks.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="group inline-flex min-h-[38px] w-fit items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-emerald-400"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* 4. Kontak & Studio */}
          <div className="border-t border-white/10 pt-8 lg:col-span-3 lg:border-t-0 lg:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Studio &amp; Kontak
            </p>

            <address className="mt-4 space-y-3.5 not-italic text-sm text-white/65">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-1 shrink-0 text-emerald-400" aria-hidden="true" />
                <p className="leading-relaxed">
                  Jl. Gondang Legi, Wedomartani,
                  <br />
                  Kec. Ngemplak, Sleman,
                  <br />
                  D.I. Yogyakarta 55584
                </p>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-white/60">
                <Clock size={15} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Senin – Sabtu, 08.30 – 17.00 WIB</span>
              </div>
            </address>

            <div className="mt-5 space-y-2 border-t border-white/10 pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="footer_contact"
                className="group inline-flex min-h-[40px] items-center gap-2 text-sm font-medium text-white transition-colors duration-200 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle size={15} className="text-emerald-400" aria-hidden="true" />
                <span>0851 9080 0168</span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <div>
                <a
                  href={`mailto:${siteConfig.organization.email}`}
                  className="inline-flex min-h-[36px] items-center gap-2 text-xs text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Mail size={14} className="text-emerald-400" aria-hidden="true" />
                  <span>{siteConfig.organization.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 text-xs text-white/45 sm:mt-16 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} Titik Huni. Seluruh hak cipta dilindungi.
            </p>
            <Link
              href="/kebijakan-privasi"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-2 w-fit mx-auto sm:mx-0"
            >
              Kebijakan Privasi &amp; Preferensi Cookie
            </Link>
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <span className="hidden text-white/40 md:inline">
              D.I. Yogyakarta, Indonesia
            </span>

            <a
              href="#main-content"
              aria-label="Kembali ke atas halaman"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              <span>Kembali ke atas</span>
              <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

