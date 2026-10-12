# On-Page SEO & Content Audit — Titik Huni

Audit komprehensif struktur konten, heading semantik, kualitas copywriting, internal links, dan atribut media per halaman pada website Titik Huni.

---

## 1. Homepage (`/`)

- **Search Intent:** Navigational + Commercial Exploration (Mengenal brand Titik Huni, melihat pilihan rumah baru, dan mengetahui opsi jasa bangun rumah).
- **Primary Keyword:** `developer rumah modern di yogyakarta`
- **Secondary Keywords:** `perumahan jogja`, `rumah sleman`, `rumah bantul`, `jasa bangun rumah jogja`, `arsitek jogja`.
- **Title Tag:** `Titik Huni | Developer Rumah Modern di Yogyakarta` (49 karakter, optimal).
- **Meta Description:** `Jelajahi rumah modern Titik Huni di Yogyakarta. Lihat pilihan hunian di Yogyakarta dan sekitarnya beserta lokasi, harga, spesifikasi, dan ketersediaan unit.` (156 karakter, optimal).
- **Heading H1:** `Ruang untuk hidup lebih tenang.` (Tepat 1 H1).
- **Subheadings (H2):**
  - `Rumah dijual di Yogyakarta.` (Transisi ke katalog properti).
  - `Bangun rumah di lahan Anda sendiri.` (Transisi ke jasa arsitek/kontraktor).
  - `Project Finished` (Showcase karya arsitektur selesai).
  - `Artikel Titik Huni` (Artikel edukasi terbaru).
  - `Pertanyaan Seputar Hunian & Layanan Titik Huni` (FAQ interaktif).
  - `Mulai Konsultasi Hunian` (Formulir kontak & WhatsApp).
- **Copywriting & Positioning:** Sangat jelas membagi dua fokus bisnis utama (Developer & Jasa Bangun) tanpa menimbulkan kebingungan bagi pengunjung.
- **Internal Links:**
  - Hero CTA ke `/unit`.
  - Link seksi arsitek ke `/arsitek-kontraktor`.
  - Link portofolio ke `/proyek` dan detail proyek.
  - Link artikel blog ke `/blog` dan detail artikel.
- **Image Alt Attributes:** 18 gambar terdeteksi; seluruh gambar unit dan hero memiliki atribut alt faktual (misal: `"Titik Huni Bangunjiwo, rumah di Kasihan, Bantul, Yogyakarta"`). Satu gambar latar hero menggunakan `alt=""` yang tepat untuk gambar dekoratif.
- **Evaluasi On-Page:** **PASS (Sangat Kuat)**.

---

## 2. Katalog Properti (`/unit`) & Landing Page Wilayah

### A. Halaman Indeks Katalog (`/unit`)
- **Search Intent:** Commercial Investigation (Mencari dan membandingkan properti yang dijual di berbagai wilayah Yogyakarta).
- **Primary Keyword:** `rumah dijual di yogyakarta` / `katalog rumah yogyakarta`.
- **Title Tag:** `Katalog Rumah Yogyakarta | Titik Huni` (37 karakter).
- **Meta Description:** `Katalog rumah di Yogyakarta dari Titik Huni. Temukan pilihan hunian dengan desain fungsional, spesifikasi lengkap, dan harga transparan di Yogyakarta.` (150 karakter).
- **H1:** `Rumah dijual di Yogyakarta.`
- **Konten & Fitur:** Filter dinamis (Semua, Tersedia, dll.), grid unit responsif, informasi harga mulai dari, luas tanah, luas bangunan, kamar tidur, dan sertifikat legalitas (SHM).
- **Internal Linking:** Setiap kartu unit menautkan ke halaman detail unik (`/unit/[slug]`) serta navigasi breadcrumb ke beranda.
- **Evaluasi On-Page:** **PASS**.

### B. Landing Page Wilayah (`/unit/jogja-utara`, `/unit/jogja-selatan`, dll.)
- **Search Intent:** Geo-targeted Commercial Investigation (Mencari rumah di sub-wilayah spesifik Yogyakarta).
- **Title Tag:** `Rumah Dijual di Jogja Utara | Titik Huni`, `Rumah Dijual di Jogja Selatan | Titik Huni`, dll.
- **H1:** Sama dengan judul wilayah (`Rumah Dijual di Jogja Utara`).
- **Copywriting Intro:** Memberikan gambaran karakter kawasan (contoh: Jogja Utara mengulas area Sleman dekat kampus dan fasilitas modern; Jogja Selatan mengulas kawasan Bantul yang asri dan tenang).
- **Evaluasi On-Page:** **PASS (Unik per wilayah, tidak duplikat)**.

### C. Halaman Detail Unit (`/unit/[slug]`)
- **Contoh Diuji:** `/unit/rumah-bantul-yogyakarta` (Titik Huni Trirenggo)
- **Title Tag:** `Titik Huni Trirenggo | Rumah Dijual di Bantul, Yogyakarta | Titik Huni` (70 karakter).
- **Meta Description:** Mengambil ringkasan otomatis spesifikasi riil (kamar, luas tanah, harga, SHM) tanpa angka karangan.
- **H1:** `Titik Huni Trirenggo`
- **Subheadings (H2):** `Keunggulan Properti`, `Tentang Properti`, `Spesifikasi`, `Lokasi`.
- **Data Faktual:** Menampilkan luas tanah 100 m², luas bangunan 50 m², 2 kamar tidur, SHM, daya listrik 1300 VA, PDAM.
- **Catatan P2:** Unit `coming-soon` memiliki data placeholder (`11111111111111` dan `1 m²`). Ditandai untuk admin agar tidak diindeks publik.
- **Evaluasi On-Page:** **PASS pada unit produksi riil**.

---

## 3. Layanan Arsitek & Kontraktor (`/arsitek-kontraktor`)

- **Search Intent:** Commercial Service (Mencari jasa profesional untuk merancang desain arsitektur dan membangun rumah di lahan sendiri di Jogja).
- **Primary Keyword:** `jasa arsitek jogja`, `kontraktor rumah jogja`.
- **Secondary Keywords:** `jasa bangun rumah jogja`, `desain rumah jogja`, `bangun rumah di lahan sendiri jogja`.
- **Title Tag Pasca-Perbaikan:** `Jasa Arsitek & Kontraktor Rumah Jogja | Titik Huni` (51 karakter, bersih dari suffix dobel).
- **Meta Description:** `Titik Huni menyediakan jasa arsitek dan kontraktor terintegrasi di Yogyakarta. Layanan desain rumah minimalis modern hingga pembangunan rumah dengan kualitas dan transparansi biaya.` (181 karakter).
- **H1:** `Rancang dengan matang. Bangun dengan tepat.`
- **Pilar & Tahapan:**
  - 3 Nilai Utama: *Satu Tim Terintegrasi*, *Perencanaan Biaya Transparan (RAB)*, *Desain Berorientasi Fungsi*.
  - 4 Langkah Alur Kerja: *01 Konsultasi & Konsep Desain*, *02 Gambar Kerja & RAB*, *03 Konstruksi & Pengawasan*, *04 Pemeriksaan & Serah Terima*.
- **CTA:** Tombol WhatsApp terhubung langsung ke pesan konsultasi desain bangun rumah yang spesifik.
- **Evaluasi On-Page:** **PASS (Sangat Komprehensif)**.

---

## 4. Portofolio Proyek (`/proyek` & `/proyek/[slug]`)

- **Search Intent:** Informational / Proof of Work (Melihat dokumentasi pekerjaan rancang bangun aktual).
- **Title Tag:** `Portofolio Arsitek & Kontraktor di Yogyakarta | Titik Huni` (62 karakter).
- **H1:** `Karya arsitektur dan konstruksi kami.`
- **Detail Proyek (`/proyek/pesona-pinka`):**
  - Title: `Pesona Pinka — Berbah, Sleman | Titik Huni` (42 karakter).
  - H1: `Pesona Pinka`.
  - Galeri interaktif dengan 10+ foto proyek beresolusi tinggi, dokumentasi visual, dan lokasi proyek riil di Berbah, Sleman.
- **Catatan P2:** Proyek `tes` (judul dan deskripsi bertuliskan 'tes') terdeteksi berstatus published. Direkomendasikan di-unpublish oleh admin.
- **Evaluasi On-Page:** **PASS pada proyek portofolio utama**.

---

## 5. Blog & Edukasi Properti (`/blog` & `/blog/[slug]`)

- **Search Intent:** Informational (Pencarian tips persiapan dana, pemilihan lokasi, dan konsep desain rumah tropis).
- **Struktur Halaman Utama Blog (`/blog`):**
  - Title: `Blog & Panduan Properti Yogyakarta | Titik Huni` (51 karakter).
  - H1: `Inspirasi desain dan panduan hunian di Yogyakarta.`
  - Filter kategori dinamis (hanya menampilkan kategori dengan artikel aktif).
- **Audit Detail Artikel Pasca-Perbaikan:**
  1. `/blog/7-hal-yang-perlu-dipertimbangkan-sebelum-membeli-rumah-di-yogyakarta`:
     - Title: `7 Tips Membeli Rumah di Yogyakarta | Blog Titik Huni` (51 karakter, canonical origin internal, schema BlogPosting + Breadcrumbs valid).
  2. `/blog/cara-memilih-lokasi-rumah-di-jogja-yang-nyaman-untuk-jangka-panjang`:
     - Title: `Cara Memilih Lokasi Rumah di Jogja | Blog Titik Huni` (54 karakter).
  3. `/blog/desain-rumah-minimalis-tropis-yang-cocok-untuk-iklim-yogyakarta`:
     - Title: `Desain Rumah Minimalis Tropis di Yogyakarta | Blog Titik Huni` (65 karakter).
- **Internal Link Contextual:** Setiap artikel blog menautkan ke unit properti terkait di sidebar kiri dan artikel rekomendasi lainnya di bagian bawah.
- **Evaluasi On-Page:** **PASS (Kualitas artikel tinggi, bebas thin content)**.

---

## 6. Halaman Tentang Kami (`/tentang-kami`)

- **Search Intent:** Navigational / Trust (Profil pengembang dan filosofi arsitektur).
- **Title Tag:** `Tentang Titik Huni | Pengembang Hunian Yogyakarta` (49 karakter).
- **H1:** `Rumah yang nyaman dimulai dari rancangan yang tepat.`
- **Konten:** Menguraikan pendekatan hunian berorientasi kenyamanan hidup sehari-hari, optimalisasi sirkulasi udara alami, dan transparansi proses konstruksi.
- **Evaluasi On-Page:** **PASS**.
