# Structured Data (Schema.org / JSON-LD) Audit Report

**Audit Date:** 12 Oktober 2026  
**Scope:** Parsing, Validitas Schema.org, Kelayakan Google Rich Results, Integritas Data Faktual.

---

## 1. Inventarisasi Skema JSON-LD per Halaman & Status Google Rich Results

> [!IMPORTANT]
> **Pemisahan Validitas Schema.org vs Kelayakan Google Rich Results:**  
> Sintaks JSON-LD yang valid menurut validator Schema.org **tidak otomatis berarti halaman tersebut akan memunculkan rich snippet di Google SERP**. Google Search Central memiliki kebijakan fitur spesifik (Search Gallery) yang membatasi jenis rich results yang ditayangkan.

| Halaman / Template | Tipe Schema Terpasang | `@id` Entitas Utama | Validitas Schema.org | Kelayakan Fitur Google Rich Results (SERP) |
|---|---|---|---|---|
| **Marketing Layout (Global)** | `Organization`, `RealEstateAgent`, `WebSite`, `Service` | `https://titikhuni.id/#organization`<br>`https://titikhuni.id/#website` | **VALID** | **Knowledge Graph & Sitelinks Search Box:** Mendukung identitas entitas brand lokal. |
| **Homepage (`/`)** | Skema Global + `FAQPage` | `https://titikhuni.id/#website`<br>`FAQPage` node | **VALID** | **NON-ELIGIBLE di SERP (Kebijakan Google Ags 2023):** Google membatasi accordion FAQ rich results hanya untuk situs otoritas pemerintah dan kesehatan resmi. Skema tetap valid secara semantik untuk pemahaman entitas mesin pencari. |
| **Katalog Properti (`/unit`)** | Skema Global + `CollectionPage`, `BreadcrumbList`, `ItemList` | `https://titikhuni.id/unit#webpage`<br>`https://titikhuni.id/unit#listings` | **VALID** | **Eligible: Breadcrumbs.** ItemList berstatus "Coming Soon" di-render aman sebagai `Thing` tanpa link palsu. |
| **Detail Unit (`/unit/[slug]`)** | Skema Global + `RealEstateListing`, `SingleFamilyResidence`, `Offer`, `BreadcrumbList` | `https://titikhuni.id/unit/[slug]#listing`<br>`https://titikhuni.id/unit/[slug]#property` | **VALID** | **Eligible: Breadcrumbs.** *(Catatan: Google SERP tidak memiliki fitur visual khusus 'RealEstateListing'; skema ini murni untuk semantic graph. Unit `coming-soon` disterilkan dari harga palsu Rp11,1T).* |
| **Layanan Arsitek (`/arsitek-kontraktor`)** | Skema Global + `ProfessionalService`, `BreadcrumbList` | `https://titikhuni.id/arsitek-kontraktor#service`<br>`...#breadcrumb` | **VALID** | **Eligible: Breadcrumbs & Local Business Graph.** Mendukung representasi studio rancang bangun di Google Maps / Knowledge Panel. |
| **Portofolio (`/proyek`)** | Skema Global + `CollectionPage`, `ItemList` | `https://titikhuni.id/proyek` | **VALID** | Standard semantic markup. |
| **Detail Proyek (`/proyek/[slug]`)** | Skema Global + `CreativeWork`, `BreadcrumbList` | `https://titikhuni.id/proyek/[slug]#project` | **VALID** | **Eligible: Breadcrumbs.** |
| **Blog Index (`/blog`)** | Skema Global + `Blog` | `https://titikhuni.id/blog` | **VALID** | Standard semantic markup. |
| **Detail Artikel (`/blog/[slug]`)** | Skema Global + `BlogPosting`, `BreadcrumbList` | `https://titikhuni.id/blog/[slug]#article`<br>`...#breadcrumb` | **VALID** | **Eligible: Article / BlogPosting Rich Results & Breadcrumbs.** Lengkap dengan publisher logo valid, image array, datePublished, dan dateModified. |
| **Kategori Blog (`/blog/category/[slug]`)** | Skema Global + `CollectionPage`, `BreadcrumbList` | `https://titikhuni.id/blog/category/[slug]#webpage` | **VALID** | **Eligible: Breadcrumbs.** |
| **Tentang Kami (`/tentang-kami`)** | Skema Global + `AboutPage`, `BreadcrumbList` | `https://titikhuni.id/tentang-kami#webpage` | **VALID** | **Eligible: Breadcrumbs & Organization Knowledge Graph.** |

---

## 2. Rincian Remediasi Structured Data yang Telah Diterapkan

### A. Perbaikan Broken Publisher Logo pada `BlogPosting` (P2 — Selesai)
- **Kondisi Awal:** Skema memuat `publisher.logo.url = "https://titikhuni.id/logo.png"` yang menghasilkan HTTP 404 (file tidak ada di `public/`).
- **Perbaikan:** Dialihkan ke aset logo resmi `siteConfig.organization.logo` (`https://titikhuni.id/assets/icons/dark-titik-huni.png`). Menambahkan `dateModified` dan `BreadcrumbList` otomatis.

### B. Normalisasi Entitas Ganda pada Halaman Tentang Kami (P2 — Selesai)
- **Kondisi Awal:** Terjadi konflik node `@id: https://titikhuni.id#organization` terpisah dengan skema global `https://titikhuni.id/#organization`.
- **Perbaikan:** Node duplikat dieliminasi; skema `AboutPage` ditautkan ke entitas utama menggunakan `mainEntity: { "@id": "https://titikhuni.id/#organization" }`.

### C. Proteksi Skema `Offer` pada Unit Placeholder `coming-soon` (P2 — Selesai)
- **Kondisi Awal:** Unit placeholder `coming-soon` memuat nilai kolom database dummy `price: 11111111111111` (Rp11,1 Triliun). Hal ini berisiko dibaca bot mesin pencari sebagai data penipuan/ketidakwajaran harga.
- **Perbaikan:** Pada rute detail unit, jika `unit.status === "Coming Soon"`, properti `price` tidak disertakan dalam skema `Offer`, dan ketersediaan diatur ke `https://schema.org/PreOrder`. Halaman juga dilindungi dengan direktif `noindex, nofollow` serta disingkirkan dari `sitemap.xml`.

---

## 3. Kesesuaian Nilai JSON-LD dengan Konten yang Terlihat

Setiap nilai dalam JSON-LD diverifikasi secara ketat terhadap elemen DOM HTML visual yang dapat dilihat pengguna:
1. **Harga & Ketersediaan Properti:**
   - Unit Trirenggo: Nilai skema `price: 500000000`, `priceCurrency: "IDR"`, `availability: "https://schema.org/InStock"` persis sesuai teks halaman *"Mulai dari Rp500 Juta"* dan status *"Tersedia"*.
   - Unit Pesona Pinka: Nilai skema `price: 550000000`, `availability: "https://schema.org/SoldOut"` persis sesuai badge *"Sold"* pada tampilan visual.
   - Tidak ada rekayasa harga, status ketersediaan, atau ulasan bintang buatan.
2. **Spesifikasi Fisik Unit:**
   - Kamar tidur, luas bangunan, luas tanah, dan daya listrik pada skema `SingleFamilyResidence` diekstrak langsung dari database riil unit.
3. **Data FAQ:**
   - Seluruh 5 pertanyaan dan jawaban pada skema `FAQPage` di homepage persis sama dengan teks accordion komponen FAQ pengguna.
4. **Alamat & Kontak Bisnis:**
   - Nomor telepon `+62-851-9080-0168`, email, dan wilayah operasional `Yogyakarta, ID` seragam di seluruh markup global.
