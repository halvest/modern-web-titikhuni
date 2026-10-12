import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home, Search, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "404: Halaman Tidak Ditemukan | Titik Huni",
  },
  description:
    "Halaman yang Anda cari tidak ditemukan atau telah dipindahkan. Jelajahi katalog rumah dan portofolio arsitek Titik Huni di Yogyakarta.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[80vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 font-sans text-foreground"
    >
      <div className="mx-auto max-w-xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs mb-4">
          <span className="size-1.5 rounded-full bg-primary" />
          <span>Error 404 · Halaman Tidak Ditemukan</span>
        </div>

        <h1 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Halaman yang Anda cari <span className="text-primary">tidak tersedia.</span>
        </h1>

        <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
          Tautan yang Anda tuju mungkin sudah dipindahkan, dihapus, atau alamat URL yang dimasukkan kurang tepat.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="site-button-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
          >
            <Home size={16} aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/unit"
            className="site-button-secondary inline-flex items-center gap-2 border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface"
          >
            <Building2 size={16} aria-hidden="true" />
            <span>Katalog Rumah</span>
          </Link>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-foreground-soft">
          <p>Butuh bantuan informasi unit properti atau konsultasi arsitek di Jogja?</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/arsitek-kontraktor" className="text-primary hover:underline">
              Jasa Arsitek &amp; Kontraktor
            </Link>
            <span>·</span>
            <Link href="/proyek" className="text-primary hover:underline">
              Portofolio Proyek
            </Link>
            <span>·</span>
            <Link href="/blog" className="text-primary hover:underline">
              Blog &amp; Panduan
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
