# FULL AUDIT & ANALISIS KOMPREHENSIF: HALAMAN /UNIT
**Target URL**: `http://localhost:3000/unit`  
**Brand**: Titik Huni (Curated Boutique Residential Developer, Yogyakarta)  
**Dokumen**: Rekap Hasil Audit Desain, SEO, UX, Conversion, dan Performance  
**Status**: **TAHAP 1 — ANALYSIS & AUDIT ONLY (No Code Changed)**  

---

## A. EXECUTIVE SUMMARY

1. **Dual Header / Redundant Intro Above-the-Fold (UX & Density)**:  
   Terdapat dua blok heading berurutan sebelum kartu properti tampil:  
   - Header 1 (Hero): *"Katalog Titik Huni / Rumah dijual di Yogyakarta"*  
   - Header 2 (Section Katalog): *"Katalog rumah Titik Huni / Bandingkan lokasi, harga, dan status"*  
   Akibatnya, pada laptop standar (1366×768) dan sebagian layar 1440×900, kartu properti pertama terdorong ke bawah garis lipatan (*below the fold*), menghalangi penemuan cepat produk.
2. **Curated Inventory vs. Quadrant Filter Mismatch (UX & IA)**:  
   Total inventaris katalog saat ini berjumlah **6 unit** (4 Tersedia, 1 Terjual, 1 Coming Soon). Membagi 6 unit ke dalam 4 filter kuadran mata angin (`Jogja Utara`, `Jogja Selatan`, `Jogja Barat`, `Jogja Timur`) menyebabkan:
   - `Jogja Barat`: **0 unit (Empty State)**
   - `Jogja Timur`: **1 unit (Terjual)**
   - `Jogja Utara`: **1 unit**
   - `Jogja Selatan`: **2 unit**  
   Pengunjung yang mengklik filter mengalami friksi tinggi karena sering melihat state kosong/sangat sedikit.
3. **Pola Slider Horisontal Bertingkat yang Membingungkan di Mobile/Tablet (UX)**:  
   Di layar `< 1024px`, komponen `catalog-unit-rows.tsx` membagi 6 kartu menjadi dua baris terpisah berisi 3 unit, di mana masing-masing baris dijadikan *carousel horizontal terpisah* (*"Pilihan 1–3 — Geser untuk melihat ⇆"* lalu di bawahnya *"Pilihan 4–6 — Geser untuk melihat ⇆"*). User terpaksa melakukan swipe horizontal dua kali di area berbeda daripada scroll vertikal natural.
4. **State Filter Masih Client-Only Tanpa URL Parameters (SEO & Shareability)**:  
   Filter kawasan hanya menggunakan `useState` lokal. Memilih kawasan tidak memperbarui URL (`?kawasan=...`), sehingga hasil filter tidak dapat di-share, di-bookmark, atau diindeks secara terkontrol.
5. **Inkonsistensi Design System dengan Beranda & Tentang Kami (Visual)**:  
   - Halaman `/unit` masih menggunakan tombol `rounded-full` (pill) pada filter dan bottom CTA, sementara Beranda & Tentang Kami sudah beralih ke standar editorial baru (`rounded-[11px]`).
   - Latar belakang section katalog menggunakan abu-abu `bg-surface-muted` (`#F5F5F2`) blok tebal, bukan kanvas hangat terpadu `.home-content-canvas` (`#FCFDFB` + aksen sage glow lembut).
6. **Redundansi Konten di Bagian Bawah (Content Density)**:  
   Section *"Mulai dari lokasi"* di bawah katalog hanya mengulang kembali 4 listing yang sama persis dalam bentuk daftar teks biasa (*Rumah dijual di Sleman* dan *Rumah dijual di Bantul*), menambah panjang halaman hingga 4.500px+ tanpa nilai tambah yang signifikan.
7. **Kekuatan Teknis yang Sudah Sangat Baik (Keep)**:  
   - Tidak ada error console di browser (0 errors, 0 warnings).
   - Structured Data JSON-LD (`CollectionPage`, `BreadcrumbList`, `ItemList`) valid dan bersih.
   - Metadata SEO dan Semantic Heading (`H1`, `H2`, `H3`) tertata rapi tanpa duplikasi H1.

---

## B. CURRENT PAGE STRUCTURE & DEPENDENCY TREE

### 1. Source Dependency Tree
```
src/app/(marketing)/unit/page.tsx (Server Component, SEO, JSON-LD, Hero Intro, Supabase Fetch)
 ├── src/config/site.ts (Metadata URLs, telepon organisasi, WhatsApp message)
 ├── src/utils/supabase/server.ts (Supabase Server Client)
 ├── src/components/marketing/units/catalog-filter.tsx ("use client", State filter kawasan, stats harga/stok)
 │    ├── src/config/regions.ts (PROPERTY_REGIONS, REGION_SLUGS)
 │    ├── src/lib/formatRupiah.ts (Formatting nominal mata uang)
 │    └── src/components/marketing/units/catalog-unit-rows.tsx (Render baris grid / slider mobile)
 │         └── src/components/marketing/units/unit-card.tsx (Card visual, badges, spec icons, detail link)
 └── src/components/marketing/units/catalog-sections.tsx (Sub-sections: Mulai dari lokasi, 3 Panduan, FAQ, Bottom CTA)
```

### 2. Page Flow Aktual
```
Navbar (Global Layout)
 ↓
Breadcrumb: Beranda / Rumah di Yogyakarta
 ↓
Hero / Page Intro (H1: "Rumah dijual di Yogyakarta.")
 ↓
Section Katalog:
 ├ Title: "Katalog rumah Titik Huni"
 ├ Stats Row: "6 listing · 4 tersedia · Harga mulai Rp 500.000.000"
 ├ Disclaimer teks kecil
 └ Filter Pills: [Semua properti] [Jogja Utara] [Jogja Selatan] [Jogja Barat] [Jogja Timur]
 ↓
Unit Grid (3 kolom desktop / 2 slider terpisah di mobile)
 ↓
Section "Mulai dari lokasi" (Daftar teks Sleman & Bantul)
 ↓
Section "Sebelum menentukan pilihan" (Panduan 3 kolom: 01, 02, 03)
 ↓
Section "Tanya Jawab" (5 item FAQ Accordion)
 ↓
Section Final CTA (Deep green box: "Sudah menemukan rumah yang ingin dilihat?")
 ↓
Footer (Global Layout)
```

---

## C. VISUAL AUDIT TABLE

| Section | Current Implementation | Problem / Finding | Status | Recommendation |
|---|---|---|---|---|
| **Breadcrumb & Hero** | Border bawah, H1 2 kolom (teks kiri, deskripsi kanan), 2 link anchor. | Bersih, tetapi memakan tinggi ~260px tanpa media visual. Link anchor *"Lihat pilihan rumah ↓"* kurang esensial karena jaraknya hanya beberapa pixel ke bawah. | **POLISH** | Buat layout intro lebih compact dan langsung menyatu dengan filter. Hapus jump link anchor yang redundan. |
| **Katalog Header & Stats** | H2 *"Katalog rumah Titik Huni"* + stats row (*6 listing, 4 tersedia, harga mulai*) + disclaimer. | Menjadi heading kedua berurutan setelah H1. Informasi stats bagus tapi terpisah jauh dari kontrol filter. | **POLISH** | Integrasikan stats row langsung di sebelah atau di atas chips filter tanpa membuat blok judul kedua yang masif. |
| **Region Filter Pills** | 5 pills `rounded-full` (`Semua properti`, `Jogja Utara`, dst). | Menggunakan pill rounded-full lama. Pembagian 4 mata angin menghasilkan 0 listing di Jogja Barat dan 1 listing terjual di Jogja Timur. | **REDESIGN** | Ganti pill rounded-full dengan filter segmented arsitektural (`rounded-[10px]`). Pertimbangkan filter berbasis Kabupaten aktual (Sleman & Bantul) atau status. |
| **Unit Cards Grid** | 3 kolom desktop, border halus, bayangan hover ringan. | Visual render jernih, hierarki kartu rapi. Namun spec icon terhimpit di bagian bawah (`KT`, `KM`, `Carport`, `LT`, `LB`). | **POLISH** | Pertahankan grid 3 kolom desktop, rapikan penataan spec agar tidak berdesakan, sesuaikan badge status ke standar Beranda. |
| **Mulai dari Lokasi** | Daftar nama unit teks biasa dibagi kolom Sleman & Bantul. | Mengulang listing yang sudah ada tepat di atasnya. Menambah panjang halaman tanpa value visual baru. | **REMOVE / MERGE** | Hapus daftar listing duplikat ini. Jika ingin mempertahankan SEO internal link Sleman & Bantul, integrasikan dalam filter atau intro. |
| **Panduan Memilih** | 3 kolom horizontal (`01`, `02`, `03`) dengan background abu-abu. | Konten edukatifnya bagus, tapi background abu-abu `bg-surface-muted` terasa memotong kontinuitas visual. | **POLISH** | Sesuaikan styling dengan cards editorial Beranda/Tentang Kami (warna kanvas hangat, tipografi halus). |
| **FAQ Accordion** | 2 kolom desktop: judul kiri, 5 accordion `<details>` kanan. | Sangat fungsional, semantik native HTML, membantu long-tail SEO. | **KEEP** | Pertahankan, perhalus garis divider dan ikon toggle. |
| **Final CTA** | Kotak hijau gelap `bg-primary text-white` dengan tombol putih pill. | Pesan tepat sasaran, tetapi tombolnya masih `rounded-full` dan bentuknya memanjang kaku. | **POLISH** | Ubah kontainer CTA agar selaras dengan `HomeContact` (gradasi lembut sage atau card rounded 1.75rem berkelas dengan tombol 11px). |

---

## D. ABOVE-THE-FOLD AUDIT (1440×900 & 1366×768)

### Pada Resolusi 1440×900:
- **Navbar**: ~72px (8% viewport).
- **Hero & Intro**: ~260px (29% viewport).
- **Catalog Header, Stats, Filter**: ~220px (24% viewport).
- **Unit Cards yang Terlihat**: Hanya ~250px (hanya tampak atap foto render dan badge status `TERSEDIA`). User belum bisa melihat nama unit, lokasi, harga, ataupun spesifikasi.
- **Rasio**: ~65% layar digunakan untuk teks pengantar dan filter, hanya ~35% untuk bagian teratas kartu.

### Pada Resolusi 1366×768 (Laptop Standard):
- **Kartu unit hampir 100% tersembunyi di bawah garis lipatan (*fold*)**. User hanya melihat teks H1, deskripsi, dan tombol filter.
- **Masalah Utama**: Keberadaan 2 judul section bertingkat (`Rumah dijual di Yogyakarta` diikuti `Katalog rumah Titik Huni`) dan margin vertikal yang renggang (`py-6 sm:py-9 lg:py-12` lalu `py-7 md:py-12`).

---

## E. UNIT CARD AUDIT

| Elemen Card | Implementasi Saat Ini | Evaluasi / Masalah | Rekomendasi |
|---|---|---|---|
| **Image Container** | Aspect ratio `16/10`, `rounded-t-[1.25rem]`, hover scale `1.035`. Watermark teks `titik huni` di tengah foto render. | Proporsi foto bagus. Watermark tengah sedikit mengganggu pandangan arsitektur tapi dapat dipahami untuk proteksi aset. | **KEEP** (Pertahankan rasio 16:10). |
| **Status Badge** | Floating pill di pojok kiri atas foto: `TERSEDIA` (dot hijau), `TERJUAL` (dot abu), `COMING SOON` (gembok). | Jelas, kontras cukup, informatif. | **KEEP** (Sesuaikan sedikit radiusnya agar tidak terlalu bulat lonjong). |
| **Price Overlay** | Floating pill hitam transparan di pojok kiri bawah foto: `Mulai dari Rp X Juta` / `Harga menyusul`. | Penempatan di atas foto membuat kartu terasa agak ramai (badge menumpuk di atas foto). | **POLISH** (Eksplorasi memindahkan harga ke header teks kartu agar foto lebih bersih). |
| **Title & Location** | Judul `text-lg font-semibold`, lokasi `text-[0.8125rem]` dengan pin icon (`MapPin`). | Sangat jelas, format lokasi konsisten (*Bantul, Yogyakarta*, *Kalasan, Sleman, Yogyakarta*). | **KEEP**. |
| **Spesifikasi** | Baris horizontal berisi 5 item: `KT`, `KM`, `Carport`, `LT`, `LB`. | Terlalu padat di 1 baris. Pada layar tablet dan mobile, teks `LT 100 m² LB 50 m²` saling menempel dan rawan wrap berantakan. | **POLISH** (Beri separator titik tengah `·` atau gunakan 3–4 spec utama yang paling esensial). |
| **CTA Action** | Lingkaran kecil dengan teks `DETAIL ↗` atau `SEGERA HADIR 🔒`. | Seluruh kartu sudah dibungkus tag `<Link>`, sehingga tombol ini bersifat *affordance indicator*. | **KEEP** (Ganti ikon dari `ArrowUpRight` ke `ArrowRight` untuk navigasi internal). |

---

## F. FILTER UX & ARCHITECTURE AUDIT

- **Mekanisme Filter**: Menggunakan client-side React `useState<RegionSlug | null>(null)`.
- **Daftar Filter**:
  1. `Semua properti` (6 unit)
  2. `Jogja Utara` (1 unit: Candibinangun)
  3. `Jogja Selatan` (2 unit: Trirenggo, Coming Soon)
  4. `Jogja Barat` (0 unit → Empty state)
  5. `Jogja Timur` (1 unit: Pesona Pinka - Terjual)
- **Kelemahan UX**:
  1. Pengunjung yang menekan `Jogja Barat` langsung disambut state kosong (*"Belum ada properti di Jogja Barat"*).
  2. Pengunjung yang menekan `Jogja Timur` hanya melihat 1 rumah yang sudah berstatus **TERJUAL**.
  3. Tidak ada indikator jumlah unit di setiap tombol filter (misal: *Jogja Utara (1)*).
  4. State tidak tercatat di URL (`?kawasan=...`), sehingga hasil filter hilang saat page refresh atau dibagikan.
- **Kelemahan SEO**:
  Karena filter berupa client state, bot Google hanya melihat state default ("Semua properti"). Padahal di sitemap dan router terdapat route `/unit/[slug]` yang menangani landing page region (`/unit/jogja-utara`, `/unit/jogja-selatan`). Terdapat *disconnect* antara filter tombol di `/unit` dengan halaman kawasan individual.

---

## G. SEO AUDIT

| Parameter | Data Saat Ini | Evaluasi |
|---|---|---|
| **Page Title** | `Rumah Dijual di Yogyakarta, Sleman & Bantul | Titik Huni` (57 karakter) | **Sangat Baik**: Menyasar primary keyword kota & 2 kabupaten utama tanpa keyword stuffing. |
| **Meta Description** | `Cari rumah dijual di Yogyakarta, Sleman, dan Bantul dari Titik Huni. Bandingkan harga mulai, lokasi, spesifikasi, dan status unit, lalu diskusikan jadwal kunjungan.` (163 karakter) | **Sangat Baik**: Mengandung call-to-action jelas dan mencakup entitas lokasi. |
| **Canonical** | `https://titikhuni.id/unit` | **Valid**: Mengarah tepat ke URL kanonikal katalog. |
| **Robots** | `index, follow, max-image-preview:large, max-snippet:-1` | **Valid**. |
| **OpenGraph & Twitter** | Lengkap dengan `og:image` (`konsep_titikhuni.webp`), `og:title`, `og:description`. | **Valid**. |
| **Search Intent** | Commercial Investigation & Property Discovery. | **Sesuai**: Pengunjung berada di tahap riset properti aktif sebelum menghubungi developer. |

---

## H. HEADING HIERARCHY TREE

```
H1: Rumah dijual di Yogyakarta.
 ├─ H2: Katalog rumah Titik Huni
 │   ├─ H3: Titik Huni Trirenggo
 │   ├─ H3: Titik Huni Tirtomartani
 │   ├─ H3: Titik Huni Candibinangun
 │   ├─ H3: Titik Huni Bangunjiwo
 │   ├─ H3: Titik Huni Pesona Pinka
 │   └─ H3: Coming Soon
 ├─ H2: Jelajahi rumah di Sleman dan Bantul.
 │   ├─ H3: Rumah dijual di Sleman
 │   └─ H3: Rumah dijual di Bantul
 ├─ H2: Bandingkan rumah dengan informasi yang relevan.
 │   ├─ H3: 01 Sesuaikan ruang
 │   ├─ H3: 02 Pahami harga mulai
 │   └─ H3: 03 Lihat langsung lokasinya
 ├─ H2: Pertanyaan tentang rumah Titik Huni di Yogyakarta.
 └─ H2: Sudah menemukan rumah yang ingin dilihat?
```

---

## I. KEYWORD MAPPING TABLE

| Keyword | Search Intent | Target Halaman | Relevansi di `/unit` | Catatan |
|---|---|---|---|---|
| `rumah dijual di yogyakarta` | Commercial Investigation | `/unit` | **UTAMA (Primary)** | Tercantum kuat di H1 dan Title. |
| `rumah jogja` | Commercial / Navigational | `/` (Beranda) & `/unit` | **PENDUKUNG** | Masuk secara alami dalam body copy. |
| `rumah dijual di sleman` | Local Commercial | `/unit/jogja-utara` & `/unit` | **PENDUKUNG** | Sesuai inventory aktual (Pakem, Kalasan). |
| `rumah dijual di bantul` | Local Commercial | `/unit/jogja-selatan` & `/unit` | **PENDUKUNG** | Sesuai inventory aktual (Trirenggo, Bangunjiwo). |
| `harga rumah titik huni jogja` | Direct Commercial | `/unit` & `/unit/[slug]` | **PENDUKUNG** | Dijawab langsung oleh FAQ dan stats harga mulai. |
| `arsitek rumah jogja` | Commercial Service | `/arsitek-kontraktor` | **BUKAN TARGET** | Jangan dicampuradukkan di H1 `/unit`. |

---

## J. INTERNAL LINK MAP

```
Beranda (/)
 │
 ├── Nav: "Unit kami" ───► /unit
 │                          │
 │                          ├── Card Click ──────► /unit/titik-huni-trirenggo
 │                          ├── Card Click ──────► /unit/titik-huni-tirtomartani
 │                          ├── Card Click ──────► /unit/titik-huni-candibinangun
 │                          ├── Card Click ──────► /unit/titik-huni-bangunjiwo
 │                          ├── Card Click ──────► /unit/titik-huni-pesona-pinka
 │                          │
 │                          ├── Link Panduan ────► /tentang-kami
 │                          ├── Link Panduan ────► /proyek
 │                          │
 │                          └── WhatsApp CTA ────► External WhatsApp Link
```

---

## K. STRUCTURED DATA AUDIT (JSON-LD)

- **Skema Saat Ini**:
  1. `CollectionPage`: Mengidentifikasi halaman sebagai katalog koleksi.
  2. `BreadcrumbList`: 2 item (`Beranda` → `Rumah di Yogyakarta`).
  3. `ItemList`: Mendaftar seluruh properti dengan status `WebPage` (untuk unit aktif) dan `Thing` (untuk unit Coming Soon).
- **Evaluasi**:
  - **Sangat Positif**: Tidak ada penyalahgunaan skema `Product` yang tidak valid (Google Merchant Center melarang skema `Product` untuk real estat rumah tinggal).
  - Skema `ItemList` memuat daftar unit secara dinamis sesuai query database.

---

## L. IMAGE AUDIT

- **Komponen**: `next/image` dengan `fill`, `object-cover`.
- **Preload Strategy**:
  - Kartu indeks `0, 1, 2` di-preload via atribut `preload={index < 3}`.
  - Kartu berikutnya di-lazy load secara otomatis.
- **Sizes Attribute**:
  - `sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"`
  - Sesuai dengan pembagian kolom grid desktop (3 kolom = 33vw).
- **Alt Text**:
  - Format: `${unit.title}, rumah di ${displayLocation}`. Informatif, alami, tanpa keyword spam.

---

## M. PERFORMANCE AUDIT

| File | Komponen | Masalah / Temuan | Dampak | Prioritas |
|---|---|---|---|---|
| `page.tsx` | `UnitCatalogPage` | Query Supabase berjalan pada setiap request tanpa ISR / `revalidate` cache. | TTFB dapat melambat jika koneksi Supabase mengalami latensi. | **P2 (Medium)** |
| `page.tsx` | - | Tidak ada file `loading.tsx` khusus di folder `/unit`. | Pengguna melihat browser loading indicator penuh saat navigasi lambat. | **P2 (Medium)** |
| `catalog-unit-rows.tsx` | `CatalogUnitRows` | Slider horizontal di mobile merender `overscroll-x-contain` dan snap-points manual. | Sedikit beban pada scrolling touch native di browser mobile lama. | **P3 (Polish)** |

---

## N. SUPABASE / DATA AUDIT

- **Query**:
  ```ts
  .from("units")
  .select("id, title, slug, location, price, status, image_url, land_area, building_area, bedroom_count, bathroom_count, carport_count, priority_order, created_at, updated_at, categories:category_id(name, slug)")
  .is("deleted_at", null)
  .neq("status", "Draft");
  ```
- **Evaluasi**:
  - **Efisien**: Tidak menggunakan `select *`. Hanya mengambil field spesifik yang dibutuhkan untuk kartu katalog.
  - **Filter Database**: Menyingkirkan `deleted_at` dan `status: Draft`.
  - **Sorting**: Dilakukan di memory JS dengan prioritas: `Tersedia (0) > Booked (1) > Sold (2) > Coming Soon (10)`.

---

## O. MOBILE AUDIT (390×844)

1. **Horizontal Carousel Bertingkat**:
   - Di mobile, kartu unit dipecah menjadi baris-baris slider horizontal (`auto-cols-[86%] snap-x overflow-x-auto`).
   - Karena ada 6 unit, user melihat **2 slider horizontal terpisah**. Ini adalah anti-pattern pada mobile browsing; user mengharapkan scrolling vertikal kontinu seperti katalog pada umumnya.
2. **Chips Filter**:
   - Chips filter kawasan dapat digeser ke samping (*horizontal scrollable chips*).
   - Terdapat efek fade gradien di ujung kanan agar user tahu ada opsi berikutnya.
3. **Card Readability**:
   - Foto dan teks proporsional. Namun baris spesifikasi (`KT`, `KM`, `Carport`, `LT`, `LB`) sedikit padat dan beberapa teks turun ke baris baru.

---

## P. TABLET AUDIT (768–1024px)

- Layout tablet saat ini membagi baris menjadi slider 2 kolom (`auto-cols-[46%]`).
- Terlihat indikator teks *"Pilihan 1–3 — Geser untuk melihat ⇆"*.
- Layar tablet 768px–1024px memiliki ruang horizontal yang cukup lebar untuk menampilkan **2-column vertical grid murni** daripada memaksakan horizontal carousel.

---

## Q. ACCESSIBILITY (a11y) AUDIT

- **Breadcrumbs**: Menggunakan `<nav aria-label="Breadcrumb">` dengan `<ol>` dan `aria-current="page"`.
- **Filter**: Menggunakan `aria-pressed={activeRegion === slug}` dan `role="group" aria-label="Filter kawasan"`.
- **Live Region**: Ada teks tersembunyi `<p className="sr-only" role="status" aria-live="polite">` yang mengabarkan pembaca layar berapa jumlah properti yang tampil setelah difilter.
- **Card Interactive Semantic**: Seluruh kartu dibungkus tag `<Link>` tunggal yang bersih tanpa tombol bersarang (*no nested buttons*).
- **Coming Soon State**: Unit Coming Soon menggunakan `div cursor-default` tanpa link mati, menghindari broken navigation.

---

## R. CTA & CONVERSION AUDIT

1. **Jalur Konversi Pengunjung**:
   - *Browse Katalog* → *Klik Card Detail* → *Pelajari Denah & Spesifikasi di Detail Page* → *Kontak WhatsApp*.
   - Jalur ini sangat sehat karena tidak memaksakan tombol WhatsApp raksasa di setiap kartu listing.
2. **Konsultasi Intro (Hero)**:
   - Terdapat link *"Tanya tim kami ↗"* yang langsung membuka WhatsApp dengan pesan terarah: *"Halo Titik Huni, saya sedang mencari rumah di Yogyakarta. Bisa bantu rekomendasikan pilihan terbaik?"*.
3. **Bottom CTA**:
   - Terdapat tombol *"Diskusikan pilihan rumah ↗"*.
   - Kelemahan: Styling tombol masih berbentuk kapsul lonjong (`rounded-full`) yang berbeda dari sistem tombol homepage.

---

## S. DESIGN SYSTEM CONSISTENCY

| Elemen UI | Beranda (`/`) & Tentang Kami (`/tentang-kami`) | Halaman Katalog Unit (`/unit`) Saat Ini | Keselarasan |
|---|---|---|---|
| **Background** | `.home-content-canvas` (putih hangat `#FCFDFB` + radial sage glow halus) | Hero: `bg-background` (putih polos), Katalog: `bg-surface-muted` (abu-abu blok) | **Beda (Inkonsisten)** |
| **Grid Motif** | Watermark `.architectural-grid` halus di latar belakang | Polos tanpa grid arsitektural | **Beda** |
| **Tombol / Pills** | `rounded-[11px]`, radius tegas dan modern arsitektural | Filter: `rounded-full`, Bottom CTA: `rounded-full` | **Beda (Legacy Pill)** |
| **Garis Struktur** | Garis 1px tipis (`border-border`) | Border tebal dan blok warna kontras | **Perlu Penyelarasan** |
| **Aksen Tipografi** | Kata kunci utama di-highlight dengan warna hijau Titik Huni (`text-primary`) | Hero H1 menggunakan highlight `text-primary`, tetapi bagian katalog lainnya polos | **Cukup Selaras** |

---

## T. WHAT IS ALREADY GOOD (KEEP)

1. **Image Preload & Next/Image Optimization**: Strategi preloading 3 unit pertama dan lazy-loading sisanya sudah sangat benar.
2. **JSON-LD Schema Hierarchy**: Penggunaan `CollectionPage` dan `ItemList` murni tanpa skema e-commerce palsu adalah praktik SEO modern terbaik.
3. **Card Link Semantics**: Seluruh card clickable sebagai satu link tanpa nested interactive tags.
4. **Data Normalization & Ranking**: Logika sorting `Tersedia > Booked > Sold > Coming Soon` menjamin user selalu melihat unit yang siap dibeli di posisi paling atas.
5. **Data Protection / Watermarking**: Watermark visual pada foto render menjaga orisinalitas karya arsitektur Titik Huni.
6. **Zero Console Errors**: Kode bersih tanpa warning hydration atau runtime error.

---

## U. CRITICAL ISSUES (P0)

*(Tidak ada issue P0 yang merusak fungsionalitas website saat ini).*

---

## V. HIGH PRIORITY ISSUES (P1)

1. **Mobile Multi-Row Horizontal Scroll Carousel**:  
   Memecah 6 unit menjadi dua carousel horizontal terpisah di layar kecil menyulitkan navigasi. Seharusnya ditampilkan sebagai **vertical feed** atau grid 1-kolom / 2-kolom yang mengalir natural.
2. **Double Header / Push Below the Fold pada Desktop Standar**:  
   Adanya dua blok intro berturut-turut mendorong kartu unit keluar dari layar pertama laptop 1366×768.

---

## W. MEDIUM PRIORITY ISSUES (P2)

1. **Distribusi Filter Kuadran vs. Volume Inventory Aktual**:  
   Filter 4 mata angin tidak seimbang dengan 6 unit yang ada (Jogja Barat kosong, Jogja Timur hanya 1 unit terjual). Lebih relevan memfilter berdasarkan status ketersediaan atau kabupaten riil (Sleman / Bantul).
2. **Inkonsistensi Background & Pill Buttons**:  
   Penggunaan `bg-surface-muted` dan tombol `rounded-full` membuat `/unit` terasa seperti peninggalan versi template lama dibandingkan Beranda dan Tentang Kami.
3. **Redundansi Section "Mulai dari lokasi"**:  
   Mengulang kembali 4 listing yang sama persis di bawah grid katalog.

---

## X. MINOR POLISH (P3)

1. **Cramped Spec Row**: Penataan `KT`, `KM`, `Carport`, `LT`, `LB` pada kartu unit dapat diperjelas dengan separator halus.
2. **Price Placement**: Badge harga yang menempel di pojok bawah foto dapat diintegrasikan lebih elegan ke panel teks.
3. **Internal Navigation Icon**: Ikon `DETAIL ↗` menggunakan panah diagonal (standar external link), seharusnya menggunakan panah kanan `ArrowRight` untuk navigasi internal.

---

## Y. TOP 10 QUICK WINS

1. Satukan intro Hero dan katalog menjadi **satu header terpadu yang padat**, sehingga kartu unit langsung terlihat di layar pertama desktop 1366×768 / 1440×900.
2. Ubah layout kartu mobile dari 2 carousel horizontal bertingkat menjadi **vertical feed natural**.
3. Bungkus halaman dengan `.home-content-canvas` agar nuansa warna, atmosfer sage, dan latar belakang putih hangat menyatu dengan Beranda.
4. Ganti tombol filter dan tombol CTA dari bentuk kapsul bulat (`rounded-full`) ke standar arsitektural Titik Huni (`rounded-[11px]`).
5. Hapus section teks duplikat *"Mulai dari lokasi"* yang mengulang isi kartu.
6. Perbaiki ikon tombol kartu dari `ArrowUpRight` ke `ArrowRight`.
7. Tambahkan aksen watermark halus `.architectural-grid` di area Hero katalog.
8. Berikan indikator jumlah listing pada tombol filter (misal: *Semua (6)*, *Sleman (2)*, *Bantul (3)*).
9. Tambahkan `revalidate = 1800` (ISR) pada `page.tsx` untuk menjaga kecepatan respon server.
10. Sederhanakan baris spesifikasi kartu agar tidak bertumpuk di layar ponsel.

---

## Z. REDESIGN OPPORTUNITIES

1. **Unified Compact Header (Above-the-Fold)**:
   - *Current*: Hero terpisah dengan border bawah + Section Katalog dengan judul kedua.
   - *Problem*: Mengonsumsi 65% tinggi layar sebelum kartu terlihat.
   - *Direction*: Gabungkan H1, deskripsi ringkas, stats counter, dan filter bar dalam satu frame editorial arsitektur yang padat.
2. **Harmonious Filter & Inventory Experience**:
   - *Current*: Filter 4 kuadran statis dengan 1 opsi kosong melompong.
   - *Problem*: User mengalami *dead-end* di Jogja Barat.
   - *Direction*: Filter berbasis Kabupaten (Semua, Sleman, Bantul) atau status (Tersedia, Terjual, Segera Hadir).
3. **Mobile Browsing Streamlining**:
   - *Current*: 2 slider geser ke samping secara terpisah.
   - *Problem*: Gestur geser horizontal yang tidak lazim untuk katalog pendek.
   - *Direction*: Grid 1 kolom vertikal yang bersih, elegan, dan cepat discan dengan jempol.

---

## AA. IDEAL PAGE FLOW (RECOMMENDED ARCHITECTURE)

```
Navbar
 ↓
Unified Editorial Hero & Filter Bar (Compact Above-the-Fold)
 ├ Eyebrow: "Katalog Titik Huni · Yogyakarta"
 ├ H1: "Rumah dijual di Yogyakarta."
 ├ Subtitle ringkas + Stats Counter (6 unit · 4 tersedia · Mulai Rp 500 Jt)
 └ Modern Filter Controls (Semua · Sleman · Bantul · Tersedia)
 ↓
Unit Showcase Grid (Focal Point Utama)
 ├ Desktop: 3 Kolom arsitektural luas & proporsional
 └ Mobile: Clean vertical stream (1 kolom per kartu)
 ↓
Curated Advice / Nilai Tambah ("Sebelum Menentukan Pilihan")
 └ 3 Kartu panduan ringkas & elegan (Ruang, Harga Mulai, Survei Lokasi)
 ↓
FAQ Ringkas (5 Pertanyaan Esensial)
 ↓
Closing Consultation Card (Selaras dengan HomeContact)
 ↓
Footer
```

---

## AB. ROADMAP OPTIMASI

### 1. SEO Roadmap
- **Fase 1**: Pertahankan H1, Title, dan Meta Description yang saat ini sudah sangat baik.
- **Fase 2**: Pastikan canonical URL tetap stabil ke `/unit`.
- **Fase 3**: Pertahankan skema `ItemList` dan `CollectionPage` JSON-LD yang sudah valid.

### 2. Design Roadmap
- **Fase 1**: Satukan background dengan `.home-content-canvas`.
- **Fase 2**: Kompakkan area Above-the-Fold desktop agar kartu langsung tampil di 1366×768.
- **Fase 3**: Ganti semua elemen pill `rounded-full` menjadi `rounded-[11px]`.
- **Fase 4**: Ganti slider horizontal mobile menjadi vertical feed.

### 3. Performance Roadmap
- **Fase 1**: Pertahankan optimasi gambar `next/image` dengan preload 3 kartu pertama.
- **Fase 2**: Tambahkan ISR cache pada `page.tsx` untuk menstabilkan TTFB query Supabase.

---
*Dokumen ini disimpan sebagai referensi baseline audit sebelum tahap implementasi atau perombakan desain.*
