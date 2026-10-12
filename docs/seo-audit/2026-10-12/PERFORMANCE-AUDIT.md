# Performance & Core Web Vitals Lab Audit Report

**Audit Date:** 12 Oktober 2026  
**Environment:** Local Development Server (Next.js 16.3.4, React 19, Node.js v22.16.0)  
**Testing Methodology:** Automated multi-run benchmark (3-run median) for TTFB, total load time, and DOM payload sizes.  
*Pernyataan Data:* Data lapangan pengguna nyata (*Field Data / Chrome User Experience Report - CrUX*) tidak tersedia pada lingkungan lokal. Seluruh angka di bawah merupakan **pengukuran lab aktual (*Lab Data*)** yang diperoleh secara terukur.

---

## 1. Hasil Pengukuran Halaman Representatif

| Halaman yang Diuji | Rute URL | TTFB Lab (Median) | Total Waktu Unduh | Ukuran HTML Dokumen | Jumlah Script | Jumlah Style | Jumlah Gambar |
|---|---|---|---|---|---|---|---|
| **Homepage** | `/` | **652.26 ms** | 672.27 ms | 205 KB | 18 | 1 | 18 |
| **Katalog Properti** | `/unit` | **355.52 ms** | 363.04 ms | 149 KB | 16 | 1 | 8 |
| **Detail Properti** | `/unit/rumah-bantul-yogyakarta` | **437.13 ms** | 443.85 ms | 123 KB | 16 | 1 | 4 |
| **Layanan Arsitek & Kontraktor** | `/arsitek-kontraktor` | **336.87 ms** | 349.07 ms | 157 KB | 16 | 1 | 7 |
| **Detail Proyek** | `/proyek/pesona-pinka` | **296.44 ms** | 301.64 ms | 112 KB | 16 | 1 | 13 |
| **Detail Artikel Blog** | `/blog/7-hal-...` | **808.72 ms** | 815.27 ms | 125 KB | 16 | 1 | 6 |

---

## 2. Analisis Core Web Vitals & Faktor Kecepatan

### A. Largest Contentful Paint (LCP)
- **Hero Image Prioritization:**
  - Homepage: Gambar hero di-load dengan elemen `<Image priority>` dan `sizes="100vw"`.
  - Halaman Layanan (`/arsitek-kontraktor`): Hero image `/assets/images/rumah-bangunjiwo-2.jpg` menggunakan atribut `priority`.
  - Detail Proyek & Unit: Cover image utama menggunakan atribut `priority` sehingga elemen LCP ter-render segera tanpa menunggu JavaScript hydration.
- **Konfigurasi Format Gambar:**
  `next.config.mjs` menetapkan format `image/webp` dengan kualitas terkonfigurasi `[75, 80]`, mencegah peringatan resolusi browser dan menjaga visual tajam pada ukuran file yang ringkas.

### B. Cumulative Layout Shift (CLS)
- **Dimensi Rasio Aspek (Aspect Ratio):**
  Seluruh kontainer gambar menggunakan kelas utilitas aspect ratio eksplisit (misal: `aspect-[4/3]`, `aspect-[16/10]`, `aspect-[16/9]`) bersama dengan komponen `next/image fill`.
  Hal ini mencegah lonjakan tata letak (*layout shift*) saat gambar selesai diunduh.
- **Font Display Strategy:**
  Font utama `Manrope` dikonfigurasi melalui `next/font/google` dengan opsi:
  `display: "swap"`, `preload: true`, dan variabel CSS `--font-manrope`.
  Next.js secara otomatis meng-inline font fallback metrics untuk meminimalkan pergeseran teks (*FOUT/CLS*).

### C. Interaction to Next Paint (INP) & JavaScript Payload
- **Komponen Server vs Klien:**
  Mayoritas konten halaman bersifat **Server Components** murni (Next.js App Router). Komponen klien (`"use client"`) dibatasi hanya pada interaktivitas esensial:
  - Filter katalog (`CatalogFilter`)
  - Galeri lightbox proyek (`ProjectGallery`)
  - Slider/Accordion interaktif
- **Tree-Shaking & Bundle Optimization:**
  `next.config.mjs` mengaktifkan `experimental.optimizePackageImports: ["lucide-react"]` untuk mencegah import seluruh pustaka icon ke dalam bundle klien.

---

## 3. Caching & Edge Delivery Architecture

- **Incremental Static Regeneration (ISR):**
  - Homepage & Layanan: `revalidate = 3600` (1 jam).
  - Katalog & Detail Properti: `revalidate = 1800` (30 menit).
  - Output pada production build menunjukkan 43 rute terkompilasi statis (○ Static / ● SSG), sehingga pada server production Vercel Edge, TTFB aktual diperkirakan turun drastis ke kisaran **<100 ms** karena respon disajikan langsung dari Edge Cache global.
- **Cache-Control Headers untuk Media:**
  `minimumCacheTTL: 31536000` (365 hari) terkonfigurasi untuk aset gambar yang dioptimalkan Next.js.
