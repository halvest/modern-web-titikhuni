# Post-Fix SEO Validation & Regression Test Report (Round 2)

**Validation Date:** 12 Oktober 2026  
**Test Engine:** Live Dev Server (`http://localhost:3000`) + Automated Crawler + Playwright Chromium Engine  
**Tester:** Senior Technical SEO & QA Automation Engineer  

---

## 1. Ringkasan Hasil Regresi & Verifikasi Teknis

| Komponen Pengujian | Metodologi | Cakupan Pengujian | Hasil | Status |
|---|---|---|---|---|
| **TypeScript Compilation** | `tsc --noEmit` via Build | Seluruh Codebase | 0 Errors | **PASS** |
| **ESLint Rules** | `eslint .` via `npm run lint` | Seluruh Codebase | 0 Errors / 0 Warnings | **PASS** |
| **Next.js Production Build** | `next build --webpack` | 43 Static/Dynamic Routes | 43 Routes Generated | **PASS** |
| **HTML Status & Routing** | Automated Crawler | 41 URLs | 41 Verified (200, 308, 404, 307) | **PASS** |
| **Canonical Origin Integrity** | DOM Selector Check | Seluruh Content URLs | 100% Menggunakan `https://titikhuni.id` | **PASS** |
| **Canonical Isolation 404/Admin** | DOM Selector Check | 7 Error & Admin URLs | 0 Canonical Leakage | **PASS** |
| **Robots.txt Rules** | Raw HTTP Text Check | 1 Endpoint | Sintaks Baku & Disallow Komprehensif | **PASS** |
| **XML Sitemap Integrity** | XML DOM Parsing | 22 URLs | 100% Canonical Valid (0 Placeholder / 0 Thin) | **PASS** |
| **Placeholder Content Containment** | Crawler & Meta Verification | `/unit/coming-soon` & `/proyek/tes` | `noindex, nofollow`, 0 Fake Price | **PASS** |
| **SERP Title Length Compliance** | Character Count (Decoded) | 36 Indexable/Content URLs | 0 Truncated (>65 char), 0 Short (<30 char) | **PASS** |
| **SERP Description Compliance** | Character Count (Decoded) | Seluruh Halaman Publik | 100% Sesuai Standar SERP (<= 160 char) | **PASS** |
| **Schema JSON-LD Parsing** | `JSON.parse` pada script ld+json | 41 Pages | 100% Valid Syntax Schema.org | **PASS** |
| **Single `<h1>` Constraint** | Headless Playwright DOM Audit | 11 Core Public Pages | 11/11 Tepat 1 `<h1>` | **PASS** |
| **Responsive Layout (390px & 1440px)** | Playwright Overflow Audit | 22 Layout Runs | 0 Layout Shift / 0 Horizontal Overflow | **PASS** |
| **Broken Image Check** | `naturalWidth > 0` validation | 64 Images Checked | 0 Broken Images | **PASS** |

---

## 2. Rincian Validasi Khusus Round 2

### A. Penanganan Konten Placeholder (`/unit/coming-soon` & `/proyek/tes`)
- **`/unit/coming-soon`:**
  - Status Database: `status = "Coming Soon"`, `price = 11111111111111`, `is_indexed = true`.
  - Output Metadata Aktual:
    - `<title>`: `Coming Soon — Segera Hadir | Titik Huni` (39 char).
    - `<meta name="robots">`: `noindex, nofollow, nocache`.
    - `<link rel="canonical">`: `https://titikhuni.id/unit/coming-soon` (self-referential, tidak berkonflik).
    - `sitemap.xml`: **TIDAK ADA** (otomatis difilter keluar).
    - Structured Data: Skema `Offer` tidak menyertakan `price` dummy Rp11,1T, menyetel ketersediaan ke `https://schema.org/PreOrder`.
  - Status: **PASS — AMAN DARI INDEKSASI GOOGLE**.
- **`/proyek/tes`:**
  - Status Database: Proyek dummy pengujian (`title = "tes"`, `slug = "tes"`).
  - Output Metadata Aktual:
    - `<title>`: `tes — Berbah, Sleman | Titik Huni` (33 char).
    - `<meta name="robots">`: `noindex, nofollow, nocache`.
    - `<link rel="canonical">`: `https://titikhuni.id/proyek/tes`.
    - `sitemap.xml`: **TIDAK ADA** (otomatis difilter keluar).
  - Status: **PASS — AMAN DARI INDEKSASI GOOGLE**.
  - Catatan Tindakan Admin: Admin disarankan meng-unpublish proyek "tes" via Dashboard Admin `/admin/projects` (ubah `published` ke `false` atau hapus). Jika URL diakses pasca-unpublish, otomatis mengembalikan status 404 murni.

---

### B. Normalisasi Tag Title & Meta Description Unit dan Proyek
- **`/unit/rumah-berbah-sleman`:**
  - Sebelum: Title `Pesona Pinka` (12 char, tanpa brand/lokasi); Description `204 char`.
  - Sesudah: Title `Titik Huni Pesona Pinka | Rumah di Berbah, Sleman | Titik Huni` (62 char); Description `153 char`.
  - Status: **PASS**.
- **`/unit/rumah-bantul-yogyakarta`:**
  - Sebelum: Title `Titik Huni Trirenggo | Rumah Dijual di Bantul, Yogyakarta | Titik Huni` (70 char).
  - Sesudah: Title `Titik Huni Trirenggo | Rumah di Bantul | Titik Huni` (51 char).
  - Status: **PASS**.
- **`/unit/rumah-kalasan-sleman`:**
  - Sebelum: Title 82 char.
  - Sesudah: Title `Titik Huni Tirtomartani | Rumah di Kalasan, Sleman | Titik Huni` (63 char).
  - Status: **PASS**.
- **`/unit/rumah-bangunjiwo-bantul`:**
  - Sebelum: Title 80 char.
  - Sesudah: Title `Titik Huni Bangunjiwo | Rumah di Kasihan, Bantul | Titik Huni` (61 char).
  - Status: **PASS**.
- **`/unit/rumah-candibinangun-sleman`:**
  - Sebelum: Title 81 char.
  - Sesudah: Title `Titik Huni Candibinangun | Rumah di Pakem, Sleman | Titik Huni` (62 char).
  - Status: **PASS**.
- **`/arsitek-kontraktor`:**
  - Sebelum: Description 181 char; Title decoded mengandung `&amp;` (54 char).
  - Sesudah: Description 147 char; Title bersih 50 char.
  - Status: **PASS**.
- **`/proyek/pesona-pinka`:**
  - Sebelum: Description 320 char (terpotong kasar di SERP).
  - Sesudah: Description 159 char rapi dipotong pada batas kata.
  - Status: **PASS**.

---

### C. XML Sitemap Integrity
- **Total URL Sitemap:** 22 URL.
- **Rincian:**
  - 6 Halaman statis utama (`/`, `/unit`, `/blog`, `/proyek`, `/tentang-kami`, `/arsitek-kontraktor`)
  - 4 Landing page wilayah properti (`/unit/jogja-utara`, `jogja-selatan`, `jogja-barat`, `jogja-timur`)
  - 5 Halaman detail unit aktif (Trirenggo, Berbah, Kalasan, Bangunjiwo, Candibinangun)
  - 3 Artikel blog aktif
  - 1 Kategori blog aktif (`/blog/category/tips`)
  - 3 Portofolio proyek aktif (Pesona Pinka, Rumah Johan, Rumah Hekal)
- **Eliminasi:**
  - 0 rute kosong / thin content.
  - 0 unit placeholder `coming-soon`.
  - 0 proyek dummy `tes`.
- **Status:** **PASS — 100% CANONICAL INDEXABLE URLS**.

---

## 3. Fondasi Pengukuran SEO Produksi (Production SEO Measurement)

### A. Pengujian Domain Produksi
- **Uji Konektivitas Eksternal:** Permintaan HTTP ke `https://titikhuni.id` dari runner lokal saat ini menghasilkan `fetch failed` (domain belum mengarah ke DNS aktif / jaringan lokal terisolasi).
- **Catatan Penting:** Hasil pengujian dev server lokal (`http://localhost:3000`) **TIDAK diasumsikan identik 100% dengan kondisi CDN/Edge produksi**. Pengujian live pada domain produksi wajib dilakukan segera setelah DNS aktif dan deployment Vercel/Cloudflare selesai.

### B. Checklist Operasional Google Search Console (7 Langkah Wajib)

1. **Verifikasi Properti Domain (Domain Property):**
   - Tambahkan properti `titikhuni.id` (bukan hanya URL-prefix) di Google Search Console menggunakan verifikasi TXT record DNS pada registrar/Cloudflare.
2. **Submit XML Sitemap:**
   - Kirimkan endpoint sitemap resmi: `https://titikhuni.id/sitemap.xml`.
   - Pastikan status sitemap berubah menjadi *"Success"* dan mendeteksi tepat 22 URL.
3. **URL Inspection (Inspeksi URL Awal):**
   - Uji URL primer: Homepage (`/`), Katalog (`/unit`), Layanan (`/arsitek-kontraktor`), dan Portofolio (`/proyek`).
   - Periksa tab *"Test Live URL"* untuk memastikan tidak ada kesalahan rendering JavaScript, CSS terblokir, atau error canonical.
   - Minta pengindeksan (*Request Indexing*) untuk halaman-halaman prioritas tersebut.
4. **Pemantauan Page Indexing (Coverage):**
   - Pantau tab *"Pages"* di GSC secara berkala untuk memastikan tidak ada URL valid yang masuk ke kategori *"Excluded by ‘noindex’ tag"* secara keliru.
   - Pastikan URL `/admin/*`, `/unit/coming-soon`, `/proyek/tes`, dan kategori kosong tetap berada di kategori *"Excluded"* yang tepat.
5. **Search Performance Monitoring (Pasca-Indexing):**
   - Pantau metrik impressions, clicks, CTR, dan posisi rata-rata (*Average Position*) untuk kata kunci primer: `jasa arsitek jogja`, `kontraktor rumah jogja`, `rumah dijual jogja`, dan brand `titik huni`.
   - Validasi hipotesis di `KEYWORD-MAP.md` berdasarkan query riil pengguna Google.
6. **Core Web Vitals & Page Experience:**
   - Pisahkan **Lab Data** (Lighthouse / devtools) dari **Field Data** (data pengguna nyata dari Chrome User Experience Report - CrUX).
   - Biarkan data lapangan berakumulasi minimal 28 hari pasca-peluncuran publik untuk metrik LCP (Largest Contentful Paint), INP (Interaction to Next Paint), dan CLS (Cumulative Layout Shift).
7. **Manual Actions & Security Issues:**
   - Periksa tab *"Security & Manual Actions"* untuk memastikan status *"No issues detected"*.
