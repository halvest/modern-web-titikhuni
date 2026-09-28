import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { href: "/unit", label: "Pilihan hunian" },
  { href: "/proyek", label: "Portfolio proyek" },
  { href: "/tentang-kami", label: "Tentang kami" },
  { href: "/arsitek-kontraktor", label: "Arsitek & kontraktor" },
  { href: "/blog", label: "Jurnal & panduan" },
];

export function Footer() {
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");

  return (
    <footer
      id="site-footer"
      className="bg-[#131512] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 text-white/60 md:pt-10"
    >
      <div className="site-container">
        <div className="grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(30rem,0.85fr)] lg:items-start lg:gap-16 lg:pt-10">
          <div className="lg:max-w-sm xl:max-w-md">
            <Link
              href="/"
              aria-label="Titik Huni — beranda"
              className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src="/assets/icons/dark-titik-huni.png"
                alt="Titik Huni"
                width={678}
                height={166}
                className="h-auto w-36 brightness-0 invert md:w-40"
              />
            </Link>
            <p className="mt-4 max-w-sm text-balance text-lg font-medium leading-snug tracking-[-0.03em] text-surface sm:text-xl md:max-w-lg">
              Hunian modern yang terasa tepat untuk pulang.
            </p>
            <div className="mt-5 flex gap-2">
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
                  className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-white/20 text-white transition hover:border-primary hover:bg-primary active:scale-[0.95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 sm:gap-12 md:gap-16">
            <div>
              <p className="site-eyebrow text-white/45">Jelajahi</p>
              <nav
                aria-label="Navigasi footer"
                className="mt-3 flex flex-col"
              >
                {footerLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group inline-flex min-h-10 w-fit items-center gap-2 text-sm font-medium text-white transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="site-eyebrow text-white/45">Temui kami</p>
              <address className="mt-4 text-sm not-italic leading-6 text-white/60">
                Jl. Duwet, Kledokan,
                <br />
                Caturtunggal, Sleman,
                <br />
                D.I. Yogyakarta 55281
              </address>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                0851 9080 0168
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col items-start gap-4 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Titik Huni. Seluruh hak cipta
            dilindungi.
          </p>
          <a
            href="#main-content"
            className="inline-flex min-h-10 w-fit items-center gap-3 font-semibold uppercase tracking-[0.12em] text-white transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Kembali ke atas <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
