# Log Perubahan Teknis (Changes Made) — SEO Titik Huni

Dokumentasi seluruh file yang dimodifikasi selama audit dan perbaikan teknis SEO Round 1 & Round 2, beserta justifikasi teknis, bukti sebelum & sesudah, dan verifikasi regresi.

---

## 1. `src/app/layout.tsx` (Round 1)

- **Masalah Awal:** Tag `<link rel="canonical" href="https://titikhuni.id">` bocor ke seluruh rute privat admin (`/admin/login`) dan rute error 404.
- **Root Cause:** Root layout App Router mendefinisikan objek `alternates: { canonical: SITE_URL }` secara global. Melalui pewarisan metadata Next.js, sub-halaman yang tidak mendefinisikan canonical sendiri secara otomatis mewarisi canonical homepage.
- **Perubahan yang Dibuat:** Menghapus `alternates.canonical` dari metadata root layout. Setiap halaman publik (`/`, `/unit`, `/arsitek-kontraktor`, dll.) sudah memiliki deklarasi canonical uniknya masing-masing.
- **Alasan Teknis:** Mencegah konflik berbahaya antara direktif `noindex` pada halaman privat admin dengan canonical homepage, serta mencegah sinyal soft-404 pada URL error.
- **Sebelum:** `/admin/login` dan `/invalid-url-404` memiliki canonical `https://titikhuni.id`.
- **Sesudah:** `/admin/login` dan `/invalid-url-404` tidak lagi memiliki tag canonical homepage.
- **Pengujian:** Verifikasi crawler status 404 dan 200 admin, build `npm run build` sukses.
- **Risiko Residual:** Nol (semua halaman publik penting telah memiliki canonical eksplisit).

---

## 2. `src/app/not-found.tsx` *(Berkas Baru — Round 1)*

- **Masalah Awal:** Website tidak memiliki template 404 kustom di root `app/`, sehingga Next.js me-render fallback generik dengan judul layout default.
- **Perubahan yang Dibuat:** Membuat `src/app/not-found.tsx` lengkap dengan:
  - `title: { absolute: "404: Halaman Tidak Ditemukan | Titik Huni" }`
  - `robots: { index: false, follow: false }`
  - Konten informatif dan tautan kembali ke Beranda, Katalog Unit, Jasa Arsitek, dan Portofolio.
- **Alasan Teknis:** Standar teknis SEO mengharuskan halaman error memiliki status HTTP 404, judul spesifik, direktif noindex, dan tidak menyertakan canonical ke homepage.
- **Sebelum:** Title fallback default, canonical homepage tersemat.
- **Sesudah:** Title spesifik 404, robots `noindex, nofollow`, tanpa tag canonical, navigasi kembali ramah pengguna.
- **Pengujian:** Browser check dan HTTP status check pada `/halaman-ngawur-404-test` (mengembalikan HTTP 404).

---

## 3. `src/app/robots.ts` (Round 1)

- **Masalah Awal:** Direktif `Disallow: /admin/` hanya menutup URL dengan trailing slash dan `Host: https://titikhuni.id` memuat protokol URL.
- **Root Cause:** Sintaks tidak mencakup variasi `/admin` tanpa trailing slash dan `Host:` RFC merekomendasikan hostname murni.
- **Perubahan yang Dibuat:**
  - `disallow: ["/admin", "/api/", "/dashboard"]`
  - `host: new URL(siteConfig.url).host` (`titikhuni.id`).
- **Alasan Teknis:** Memastikan bot tidak merayapi `/admin` atau URL legacy redirect `/dashboard` sebelum redirect terjadi.
- **Sebelum:** `Disallow: /admin/`, `Host: https://titikhuni.id`.
- **Sesudah:** `Disallow: /admin`, `Disallow: /dashboard`, `Host: titikhuni.id`.
- **Pengujian:** Request live ke `http://localhost:3000/robots.txt`.

---

## 4. `src/app/sitemap.ts` (Round 1 & Round 2)

- **Masalah Awal:**
  - *Round 1:* Memasukkan 7 kategori kosong (termasuk 4 wilayah properti) ke sitemap blog yang menghasilkan halaman kosong.
  - *Round 2:* Memasukkan unit placeholder `/unit/coming-soon` (harga dummy Rp11,1T) dan proyek testing `/proyek/tes` ke dalam `sitemap.xml`.
- **Root Cause:** Kueri tabel tidak memfilter status "Coming Soon" dan slug testing internal.
- **Perubahan yang Dibuat:**
  - Menambahkan filter `.neq("status", "Coming Soon")` pada kueri tabel `units`.
  - Menambahkan filter `.neq("slug", "tes")` pada kueri tabel `projects`.
  - Mempertahankan filter kategori artikel aktif (`status = 'published'` dan `is_indexed = true`).
- **Alasan Teknis:** Memastikan sitemap hanya berisi URL canonical yang 100% ditujukan untuk pengindeksan publik, tanpa memboroskan crawl budget Google pada data pengujian atau placeholder.
- **Sebelum:** 31 URL (Round 0) -> 24 URL (Round 1).
- **Sesudah:** 22 URL murni produksi (Round 2), bebas dari placeholder `coming-soon`, proyek `tes`, dan kategori kosong.
- **Pengujian:** Request live ke `http://localhost:3000/sitemap.xml`.

---

## 5. `src/app/(marketing)/unit/[slug]/page.tsx` (Round 2)

- **Masalah Awal:**
  1. Halaman `/unit/coming-soon` dapat diindeks (`index, follow`) dan menyajikan skema `Offer` dengan harga fiktif `11111111111111`.
  2. Judul unit properti aktif terlalu panjang (70-82 karakter) karena menyertakan nama kabupaten dan provinsi ganda (`Kalasan, Sleman, Yogyakarta | Titik Huni`).
  3. Unit `/unit/rumah-berbah-sleman` hanya memiliki judul 12 karakter (`Pesona Pinka`) dan deskripsi 204 karakter yang terpotong di SERP.
- **Perubahan yang Dibuat:**
  - Jika `unit.status === "Coming Soon"`: set `noindex: true`, canonical self-referential, judul informatif `"Coming Soon — Segera Hadir | Titik Huni"`, dan hapus properti `price` dari skema `Offer`.
  - Implementasi fungsi `getConciseLocation()` yang merapikan bagian wilayah menjadi format ringkas (Kecamatan + Kabupaten), memangkas redundansi "Yogyakarta".
  - Normalisasi judul unit: `Titik Huni [Nama] | Rumah di [Kecamatan, Kabupaten] | Titik Huni` (semua unit berada di rentang optimal 51-63 karakter).
  - Implementasi fungsi `sanitizeMetaDescription()` yang memotong deskripsi panjang di batas kata maksimal 160 karakter untuk mencegah elipsis buruk di SERP.
- **Sebelum:** Judul unit terpotong (82 char), Pesona Pinka 12 char, coming-soon indexable dengan harga palsu Rp11,1T.
- **Sesudah:** Seluruh judul unit 51-63 karakter, deskripsi 153-160 karakter, coming-soon noindex tanpa fake price.
- **Pengujian:** Verifikasi crawler dan browser pada 6 URL unit.

---

## 6. `src/app/(marketing)/proyek/[slug]/page.tsx` (Round 2)

- **Masalah Awal:**
  1. Proyek testing dummy `/proyek/tes` berstatus published dan indexable (`index, follow`).
  2. Proyek `/proyek/pesona-pinka` memiliki deskripsi 320 karakter di `<meta name="description">` yang terpotong di SERP.
- **Perubahan yang Dibuat:**
  - Jika `project.slug === "tes"`: set `robots: { index: false, follow: false, nocache: true }`.
  - Implementasi fungsi `sanitizeProjectDescription()` yang memangkas meta description maksimal 160 karakter di batas kata, sementara teks panjang asli di body copy tetap dipertahankan untuk pengunjung.
- **Sebelum:** `/proyek/tes` indexable di Google; deskripsi `/proyek/pesona-pinka` 320 char.
- **Sesudah:** `/proyek/tes` terlindungi noindex; deskripsi Pesona Pinka 159 char rapi.
- **Pengujian:** Request live ke `/proyek/tes` dan `/proyek/pesona-pinka`.

---

## 7. `src/app/(marketing)/arsitek-kontraktor/page.tsx` (Round 1 & Round 2)

- **Masalah Awal:**
  - *Round 1:* Title tag triple branding 95 karakter; OpenGraph mewarisi data katalog perumahan.
  - *Round 2:* Deskripsi meta 181 karakter (melebihi standar optimal SERP Google 160 char) dan karakter `&` diekstrak sebagai entity `&amp;`.
- **Perubahan yang Dibuat:**
  - Memadatkan `pageDescription` menjadi 147 karakter: *"Jasa arsitek dan kontraktor rumah terintegrasi di Yogyakarta. Layanan desain rumah modern hingga pembangunan berkualitas dengan transparansi biaya."*
  - Menjaga `title: { absolute: "Jasa Arsitek & Kontraktor Rumah Jogja | Titik Huni" }` (50 karakter bersih).
- **Sebelum:** Deskripsi 181 char terpotong di SERP.
- **Sesudah:** Deskripsi 147 char padat, konversi tinggi, mencakup kata kunci primer arsitek & kontraktor Jogja.
- **Pengujian:** Crawler verification.

---

## 8. `src/app/(marketing)/blog/[slug]/page.tsx` (Round 1)

- **Masalah Awal:** Canonical URL mengarah ke domain dummy eksternal `https://domain-titikhuni.com/blog/...`, logo publisher skema mengarah ke 404, title triple branding.
- **Perubahan yang Dibuat:** Resolver otomatis canonical ke `https://titikhuni.id/blog/[slug]`, logo diarahkan ke aset resmi `dark-titik-huni.png`, ditambahkan `dateModified` dan `BreadcrumbList`.
- **Sebelum:** Canonical eksternal rusak, logo 404.
- **Sesudah:** Canonical 100% internal origin, schema Article lengkap.

---

## 9. `src/app/(marketing)/tentang-kami/page.tsx` (Round 1)

- **Masalah Awal:** Deklarasi duplikat entitas `RealEstateAgent` yang menyebabkan konflik `@id`.
- **Perubahan yang Dibuat:** Menghapus deklarasi ganda dan menautkan skema `AboutPage` ke node `#organization`.

---

## 10. `scripts/seo-audit-crawler.mjs` & Skrip Validasi (Round 2)

- **Masalah Awal:** Crawler mengekstrak tag HTML mentah sehingga entitas seperti `&amp;` terhitung sebagai 5 karakter, bukan 1 karakter `&`.
- **Perubahan yang Dibuat:** Menambahkan fungsi `decodeHtmlEntities()` pada pipeline ekstraksi crawler dan CSV generator agar perhitungan panjang karakter akurat sesuai apa yang dilihat oleh browser dan Googlebot.
