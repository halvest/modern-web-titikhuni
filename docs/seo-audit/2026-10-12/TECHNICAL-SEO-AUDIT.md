# Technical SEO Audit Report — Titik Huni

**Audit Date:** 12 Oktober 2026  
**Scope:** Architecture, Indexing, Routing, Canonicalization, Metadata, Semantics, and Structured Data.

---

## 1. HTTP Status, Routing & Redirection Architecture

### A. Routing & Status Code Validation
Pengujian dilakukan terhadap 41 URL aktual pada live dev server Next.js App Router:
- **Halaman Beranda (`/`):** Mengembalikan HTTP `200 OK`.
- **Katalog & Landing Page Wilayah (`/unit`, `/unit/jogja-utara`, dll.):** Mengembalikan HTTP `200 OK`.
- **Detail Unit, Proyek, dan Artikel Valid:** Mengembalikan HTTP `200 OK`.
- **Rute Slug Tidak Ditemukan (`/unit/invalid-slug`, `/blog/invalid-slug`, dll.):** Mengembalikan HTTP `404 Not Found` murni, bukan halaman 200 kosong (*soft-404*).
- **Rute Utilitas Privat (`/admin/dashboard`):** Menolak akses anonim dan mengembalikan HTTP `307 Temporary Redirect` menuju `/admin/login`.
- **Rute Legacy (`/dashboard`):** Mengembalikan HTTP `307 Temporary Redirect` menuju `/admin/dashboard`.

### B. Trailing Slash & Normalisasi URL
Next.js App Router dikonfigurasi dengan standar non-trailing slash. Pengujian URL dengan trailing slash:
- `/unit/` -> HTTP `308 Permanent Redirect` -> `/unit` (PASS)
- `/proyek/` -> HTTP `308 Permanent Redirect` -> `/proyek` (PASS)
- `/arsitek-kontraktor/` -> HTTP `308 Permanent Redirect` -> `/arsitek-kontraktor` (PASS)
Tidak ditemukan redirect chain (*rantai redirect*) atau redirect loop.

### C. Database Redirect Table (`redirects`)
Tabel `redirects` di Supabase menangani 6 riwayat slug lama:
1. `/unit/tes` -> `/unit/coming-soon` (HTTP 308)
2. `/unit/rumah-bantu-yogyakarta` -> `/unit/rumah-bantul-yogyakarta` (HTTP 308)
3. `/unit/pesona-pinka` -> `/unit/rumah-berbah-sleman` (HTTP 308)
4. `/unit/bangunjiwo-bantul` -> `/unit/rumah-bangunjiwo-bantul` (HTTP 308)
5. `/unit/rumah-candibinangun` -> `/unit/rumah-candibinangun-sleman` (HTTP 308)
6. `/blog/jangan-salah-pilih-developer-...` -> `/blog/7-hal-yang-perlu-dipertimbangkan-sebelum-membeli-rumah-di-yogyakarta` (HTTP 308)
Seluruh rute ini diuji dan menghasilkan redirect 308 langsung tanpa lompatan perantara.

---

## 2. Indexability, Robots.txt & XML Sitemap

### A. Robots.txt Analysis & Fix
- **Lokasi Kode:** `src/app/robots.ts`
- **Output Aktual:** `https://titikhuni.id/robots.txt`
```text
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /dashboard

Host: titikhuni.id
Sitemap: https://titikhuni.id/sitemap.xml
```
- **Penyempurnaan:**
  - Sebelumnya menggunakan `Disallow: /admin/` yang berisiko meloloskan crawl pada URL `/admin` tanpa trailing slash. Telah diperbaiki menjadi `Disallow: /admin` yang menutup seluruh variasi awalan `/admin`.
  - Direktif `Host:` dinormalisasi menjadi `titikhuni.id` (tanpa protokol `https://`), sesuai spesifikasi sintaks Yandex/RFC.

### B. XML Sitemap Architecture & Thin-Content Cleanup
- **Lokasi Kode:** `src/app/sitemap.ts`
- **Output Aktual:** `https://titikhuni.id/sitemap.xml`
- **Temuan Kritis Awal (P1):**
  Sebelumnya `sitemap.ts` memasukkan 31 URL, termasuk 4 kategori wilayah properti (`/blog/category/jogja-utara`, dll.) serta kategori tanpa artikel yang menghasilkan halaman kosong *"Belum ada artikel dalam kategori ini"*.
- **Perbaikan yang Diterapkan:**
  - `sitemap.ts` kini memfilter daftar kategori sehingga hanya menyertakan kategori yang memiliki relasi artikel `published` dan `is_indexed = true`.
  - Jumlah URL dalam sitemap berkurang menjadi **24 URL berkualitas tinggi** yang seluruhnya siap diindeks.
  - Setiap URL dynamic unit, post, dan project menyertakan nilai `lastModified` aktual dari kolom `updated_at` database Supabase.

---

## 3. Canonicalization Architecture

### A. Perbaikan Fatal Canonical Dummy Domain (P0)
- **File:** `src/app/(marketing)/blog/[slug]/page.tsx`
- **Masalah:** Artikel blog memuat tag:
  `<link rel="canonical" href="https://domain-titikhuni.com/blog/tips-membeli-rumah-di-yogyakarta">`
- **Penyebab:** Kolom `canonical_url` pada tabel `posts` terisi placeholder `domain-titikhuni.com`. Kode template membaca kolom tersebut tanpa validasi origin.
- **Solusi Teknis:**
  Ditambahkan fungsi resolver canonical yang memvalidasi domain. Jika domain terdeteksi sebagai placeholder atau `localhost`, canonical secara otomatis dialihkan ke origin resmi `siteConfig.url` (`https://titikhuni.id/blog/${slug}`).

### B. Isolasi Kebocoran Canonical Root Layout (P1)
- **File:** `src/app/layout.tsx` & `src/app/not-found.tsx`
- **Masalah:** Root `layout.tsx` menyetel `alternates: { canonical: SITE_URL }`. Akibat inheritance App Router, setiap route yang tidak menyetel canonical sendiri (seperti halaman 404 dan `/admin/login`) memunculkan canonical ke homepage.
- **Solusi Teknis:**
  - `alternates.canonical` dihapus dari root `layout.tsx`. Setiap halaman publik tetap menyetel canonical uniknya sendiri.
  - Berkas baru `src/app/not-found.tsx` dibuat dengan eksplisit `robots: { index: false, follow: false }` tanpa tag canonical.

---

## 4. Metadata & Title Optimization

### A. Deduplikasi Title Tag
Next.js App Router root layout menetapkan `title.template = "%s | Titik Huni"`. Template individual yang menyertakan suffix nama brand tanpa pembungkus `{ absolute: ... }` menyebabkan pengulangan suffix.

| Halaman | Title Sebelum Perbaikan | Title Pasca-Perbaikan | Status |
|---|---|---|---|
| `/arsitek-kontraktor` | `Arsitek & Kontraktor Rumah Jogja \| Jasa Desain & Bangun Rumah - Titik Huni \| Titik Huni` (95 char) | `Jasa Arsitek & Kontraktor Rumah Jogja \| Titik Huni` (51 char) | **PASS** |
| `/blog/7-hal-...` | `7 Tips Membeli Rumah di Yogyakarta \| Titik Huni \| Blog Titik Huni \| Titik Huni` (78 char) | `7 Tips Membeli Rumah di Yogyakarta \| Blog Titik Huni` (51 char) | **PASS** |
| `/blog/cara-memilih-...` | `Cara Memilih Lokasi Rumah di Jogja \| Titik Huni \| Blog Titik Huni \| Titik Huni` (81 char) | `Cara Memilih Lokasi Rumah di Jogja \| Blog Titik Huni` (54 char) | **PASS** |
| `/blog/desain-rumah-...` | `Desain Rumah Minimalis Tropis di Yogyakarta \| Titik Huni \| Blog Titik Huni \| Titik Huni` (92 char) | `Desain Rumah Minimalis Tropis di Yogyakarta \| Blog Titik Huni` (65 char) | **PASS** |

### B. Open Graph & Twitter Cards
- Halaman `/arsitek-kontraktor` kini memiliki metadata Open Graph mandiri dengan foto arsitektur dan deskripsi yang fokus pada layanan desain bangun rumah, menggantikan fallback generik katalog properti.
- Halaman blog kini menyertakan `og:url` yang sinkron dengan canonical resmi dan dimensi gambar standar 1200x630.

---

## 5. Semantic HTML & Accessible Structure

Pengujian headless Chromium Playwright memastikan kepatuhan semantik:
- **Single `<h1>` Constraint:** Seluruh 11 rute publik memiliki tepat 1 elemen `<h1>`.
- **Heading Sequence:** Struktur dokumen menggunakan hierarki logis `<h1>` -> `<h2>` -> `<h3>` tanpa lompatan styling.
- **Image Attributes:** Seluruh gambar informatif menggunakan teks alternatif (`alt`) faktual. Gambar dekoratif menggunakan `alt=""` atau atribut aria yang sesuai.
- **Responsive Layout:** Nol (*0*) horizontal overflow pada resolusi mobile 390x844 dan desktop 1440x900.
