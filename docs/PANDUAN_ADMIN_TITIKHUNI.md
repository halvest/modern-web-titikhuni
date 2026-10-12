# PANDUAN LENGKAP DASHBOARD ADMIN & STRUKTUR OPERASIONAL
## Titik Huni — Property Management & Architecture Studio

Dokumen ini merupakan panduan resmi arsitektur sistem, struktur data, dan tata kelola operasional Dashboard Administrator **Titik Huni**. Panduan ini mencakup seluruh fitur manajemen konten (CRUD), pengelolaan prospek (CRM), siklus hidup media (*storage lifecycle*), serta standar operasional terbaik (*best practices*) bagi tim pengelola.

---

## DAFTAR ISI

1. [Gambaran Umum & Arsitektur Dashboard](#1-gambaran-umum--arsitektur-dashboard)
2. [Keamanan, Autentikasi, dan Hak Akses](#2-keamanan-autentikasi-dan-hak-akses)
3. [Peta Rute & Struktur Direktori Codebase](#3-peta-rute--struktur-direktori-codebase)
4. [Skema Database & Relasi Tabel](#4-skema-database--relasi-tabel)
5. [Panduan Modul & Operasional CRUD](#5-panduan-modul--operasional-crud)
   - [5.1. Dashboard Overview](#51-dashboard-overview)
   - [5.2. CRM Leads (Manajemen Prospek)](#52-crm-leads-manajemen-prospek)
   - [5.3. Unit Properti (Katalog Rumah & Hunian)](#53-unit-properti-katalog-rumah--hunian)
   - [5.4. Kategori Properti](#54-kategori-properti)
   - [5.5. Portofolio Proyek (Studio Arsitektur & Konstruksi)](#55-portofolio-proyek-studio-arsitektur--konstruksi)
   - [5.6. Artikel Blog & Edukasi Properti](#56-artikel-blog--edukasi-properti)
6. [Siklus Hidup Media & Manajemen Supabase Storage](#6-siklus-hidup-media--manajemen-supabase-storage)
7. [Panduan Operasional & Best Practices Admin](#7-panduan-operasional--best-practices-admin)
8. [Troubleshooting & Prosedur Darurat](#8-troubleshooting--prosedur-darurat)

---

## 1. GAMBARAN UMUM & ARSITEKTUR DASHBOARD

Dashboard Admin Titik Huni dirancang sebagai **pusat kendali operasional terpadu (*single source of truth*)** untuk mengelola seluruh aspek bisnis Titik Huni: pemasaran properti hunian di D.I. Yogyakarta, portofolio proyek rancang-bangun arsitektur, konten edukasi, serta tindak lanjut prospek pelanggan secara *real-time*.

### Stack Teknologi Admin
- **Framework Utama:** Next.js (App Router, Server Components & Server Actions hybrid).
- **Database & Backend:** Supabase PostgreSQL.
- **Autentikasi:** Supabase Auth terintegrasi sesi cookie HTTP-only (`@supabase/ssr`).
- **File & Media Storage:** Supabase Storage (Bucket terpisah: `properti`, `projects`, `blog`).
- **Styling UI:** Tailwind CSS dengan desain bertema gelap/terang modern, visual token konsisten, dan aksesibilitas ramah keyboard.
- **Editor Teks Kaya (WYSIWYG):** TipTap Editor dengan ekstensi kustom.
- **Validasi & Sanitasi:** Zod schema, sanitasi XSS kustom pada rich text, dan normalisasi slug otomatis.

---

## 2. KEAMANAN, AUTENTIKASI, DAN HAK AKSES

Akses ke Dashboard Admin diproteksi melalui sistem berlapis:

```
[Permintaan HTTP / Browser]
            │
            ▼
┌───────────────────────────┐
│ Proxy / Middleware Guard  │  Memeriksa adanya token sesi Supabase
└───────────┬───────────────┘
            │
            ├─► Belum login / Sesi habis ──► Redirect ke /admin/login
            │
            ▼
┌───────────────────────────┐
│ Server Action / Page Auth │  Fungsi requireAdminPage() & verifyAdmin()
└───────────┬───────────────┘
            │
            ├─► Cek tabel auth.users (ID terdaftar)
            ├─► Cek tabel public.profiles (role == 'admin')
            │
            ▼
┌───────────────────────────┐
│ Supabase Storage & DB RLS │  PostgreSQL Row-Level Security (is_admin())
└───────────────────────────┘
```

### Aturan Keamanan Utama:
1. **Otorisasi Berbasis Peran (RBAC):** Akun pengguna harus terdaftar pada Supabase Auth dan memiliki baris pada tabel `public.profiles` dengan kolom `role = 'admin'`. Pengguna publik tanpa hak admin akan ditolak dengan error `unauthorized`.
2. **Kerahasiaan Kredensial:** Kunci `SUPABASE_SERVICE_ROLE_KEY` **tidak pernah** diekspos ke browser atau kode sisi klien.
3. **Proteksi Penolakan Diam-Diam (RLS Safety):** Seluruh Server Action memvalidasi keberhasilan fisik operasi Storage (mencegah *silent rejection*).
4. **Pencegahan Injeksi Formula CSV:** Data prospek yang diekspor ke CSV dibersihkan dari karakter awalan sensitif (`=`, `+`, `-`, `@`) untuk mencegah eksekusi makro Excel berbahaya.

---

## 3. PETA RUTE & STRUKTUR DIREKTORI CODEBASE

### Peta Rute Dashboard (`/admin/*`)
| URL Path | Nama Modul | Fungsi Utama |
|---|---|---|
| `/admin/login` | Login Administrator | Halaman autentikasi email & password |
| `/admin/dashboard` | Overview Dashboard | Metrik KPI, tren prospek, ringkasan inventaris |
| `/admin/leads` | CRM Leads | Tabel prospek, filter status, WhatsApp action, ekspor CSV |
| `/admin/units` | Unit Properti | Katalog inventaris unit rumah, status, search & filter |
| `/admin/units/new` | Tambah Unit Baru | Formulir lengkap penambahan unit properti |
| `/admin/units/edit/[id]` | Edit Unit | Editor unit multi-seksi dengan sinkronisasi media |
| `/admin/categories` | Kategori | Manajemen kategori properti (nama & slug) |
| `/admin/projects` | Portofolio Proyek | Daftar portofolio rancang & bangun arsitektur |
| `/admin/projects/new` | Tambah Proyek Baru | Formulir pembuatan proyek portofolio baru |
| `/admin/projects/edit/[id]` | Edit Proyek | Editor portofolio proyek studio arsitektur |
| `/admin/posts` | Artikel Blog | Manajemen artikel edukasi & konten SEO |
| `/admin/posts/new` | Tulis Artikel Baru | Editor TipTap WYSIWYG untuk pembuatan artikel baru |
| `/admin/posts/edit/[id]` | Edit Artikel | Editor artikel dengan pengaturan relasi unit/proyek |

### Struktur Direktori File
```
src/
├── app/(admin)/
│   ├── layout.tsx                     # Layout global admin (metadata, shell)
│   └── admin/
│       ├── page.tsx                   # Redirect otomatis ke /admin/dashboard
│       ├── login/                     # Halaman & action autentikasi
│       ├── dashboard/page.tsx         # Dashboard KPI & overview
│       ├── leads/                     # Workspace CRM prospek & LeadsList
│       ├── categories/                # Workspace kategori & CategoryList
│       ├── units/
│       │   ├── page.tsx               # Halaman list unit
│       │   ├── UnitsWorkspace.tsx     # Komponen tabel, filter & search
│       │   ├── actions.ts             # Server Actions (CRUD unit & diffing media)
│       │   ├── DeleteButton.tsx       # Komponen dialog konfirmasi hapus
│       │   ├── new/page.tsx           # Route tambah unit
│       │   └── edit/[id]/page.tsx     # Route edit unit
│       ├── projects/                  # Workspace portofolio arsitektur
│       └── posts/                     # Workspace blog & TipTap actions
│
└── components/admin/
    ├── AdminSidebar.tsx               # Navigasi sidebar responsif (desktop & mobile)
    ├── AdminShell.tsx                 # Header, user badge, dan wrapper konten
    ├── ui/                            # Komponen tombol, action menu, modal
    ├── dashboard/LeadTrendChart.tsx   # Grafik visualisasi tren prospek
    ├── units/editor/
    │   ├── property-editor.tsx        # Shell editor unit properti
    │   ├── editor-navigation.tsx      # Sidebar internal navigasi 8 seksi
    │   └── sections/                  # 8 seksi formulir properti
    ├── projects/ProjectEditor.tsx      # Komponen form editor portofolio proyek
    └── posts/editor/                  # Komponen form editor artikel blog
```

---

## 4. SKEMA DATABASE & RELASI TABEL

Sistem menggunakan database PostgreSQL di Supabase dengan relasi antar-tabel sebagai berikut:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   categories    │       │     units       │       │    projects     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──┐   │ id (PK)         │   ┌──►│ id (PK)         │
│ name            │   └───│ category_id(FK) │   │   │ title           │
│ slug            │       │ title           │   │   │ slug            │
└─────────────────┘       │ slug            │   │   │ cover_image     │
                          │ price           │   │   │ gallery_images  │
                          │ status          │   │   │ published       │
                          │ image_url       │   │   └─────────────────┘
                          │ gallery (array) │   │
                          │ selling_points  │   │
                          │ deleted_at      │   │
                          └────────┬────────┘   │
                                   │            │
                                   ▼            │
                          ┌─────────────────┐   │   ┌─────────────────┐
                          │     leads       │   │   │     posts       │
                          ├─────────────────┤   │   ├─────────────────┤
                          │ id (PK)         │   │   │ id (PK)         │
                          │ unit_id (FK)    │───┘   │ title           │
                          │ name            │       │ slug            │
                          │ phone           │       │ content (HTML)  │
                          │ email           │       │ category_id(FK) │
                          │ status          │       │ status          │
                          │ next_follow_up  │       │ related_units   │───┐
                          │ utm_source      │       │ related_projects│───┘
                          └─────────────────┘       └─────────────────┘
```

---

## 5. PANDUAN MODUL & OPERASIONAL CRUD

---

### 5.1. Dashboard Overview

**Rute:** `/admin/dashboard`

Dashboard overview menyajikan indikator performa utama (*Key Performance Indicators*) secara seketika:
- **Metrik Utama:**
  - Total Leads Masuk (dengan persentase leads baru bulan ini).
  - Unit Properti Aktif (Tersedia vs Terjual).
  - Portofolio Proyek & Artikel Blog yang dipublikasikan.
- **Grafik Tren Prospek:** Visualisasi grafik volume prospek yang masuk per rentang waktu.
- **Prospek Terbaru:** Daftar 5-10 leads terbaru lengkap dengan status dan tombol aksi cepat.
- **Aset Properti Terkini:** Ringkasan inventaris unit terpopuler dan status penjualannya.

---

### 5.2. CRM Leads (Manajemen Prospek)

**Rute:** `/admin/leads`

Modul ini menampung seluruh pesan dan permintaan konsultasi yang dikirimkan oleh pengunjung melalui formulir kontak publik, tombol WhatsApp unit, atau formulir konsultasi arsitektur.

#### Data yang Dicatat:
- **Nama Klien:** Nama lengkap pengirim.
- **Nomor Telepon / WhatsApp:** Nomor kontak yang siap dihubungi.
- **Email:** Alamat surat elektronik klien.
- **Unit Terkait:** Properti spesifik yang ditanyakan (jika berasal dari halaman detail unit).
- **Pesan / Kebutuhan:** Rincian pesan atau preferensi yang disampaikan klien.
- **Sumber & UTM Tracking:** Mengetahui asal datangnya leads (`source`, `utm_source`, `utm_medium`, `utm_campaign`).
- **Jadwal Follow-Up (`next_follow_up_at`):** Tanggal janji temu atau waktu tindak lanjut berikutnya.

#### Siklus Status Prospek (Pipeline):
| Status | Label UI | Arti & Tahapan Operasional |
|---|---|---|
| `new` | **Baru** | Prospek baru masuk, belum dihubungi tim sales. **SLA respon: < 15 menit.** |
| `contacted` | **Dihubungi** | Tim sales telah mengirim pesan atau menelepon klien. |
| `qualified` | **Qualified** | Klien memiliki anggaran, kebutuhan, dan minat yang sesuai. |
| `site_visit` | **Survei** | Klien menyepakati jadwal survei lokasi / temu studio arsitektur. |
| `booking` | **Booking** | Klien telah membayar booking fee atau tanda jadi unit. |
| `won` | **Closing** | Transaksi berhasil (AJB/Akad kredit selesai atau kontrak konstruksi ditandatangani). |
| `lost` | **Batal** | Klien membatalkan minat, tidak merespon, atau anggaran tidak sesuai. |

#### Fitur & Prosedur Operasional Leads:
1. **Menghubungi via WhatsApp Cepat:**
   - Klik tombol **WhatsApp** pada baris prospek.
   - Sistem membuka aplikasi WhatsApp dengan nomor tujuan dan pesan sapaan resmi Titik Huni otomatis.
2. **Memperbarui Status Prospek:**
   - Klik menu aksi pada baris prospek -> Pilih **Ubah Status** -> Pilih tahapan pipeline yang sesuai.
3. **Mengatur Tanggal Follow-Up:**
   - Klik tombol kalender pada prospek -> Tentukan tanggal follow up berikutnya. Dashboard akan menandai prospek yang mendekati tenggat waktu tindak lanjut.
4. **Ekspor Data Prospek ke Excel / CSV:**
   - Klik tombol **Ekspor CSV** di sudut kanan atas tabel.
   - File CSV terunduh secara aman dengan sanitasi karakter formula injection.

---

### 5.3. Unit Properti (Katalog Rumah & Hunian)

**Rute:** `/admin/units` (Daftar) | `/admin/units/new` (Buat Baru) | `/admin/units/edit/[id]` (Ubah)

Modul inti untuk mengelola seluruh portofolio unit perumahan, tanah, dan villa yang dipasarkan Titik Huni.

#### 1. Menavigasi Tabel Katalog Unit:
- **Pencarian Real-Time:** Cari berdasarkan judul unit, lokasi kelurahan/kecamatan, atau nomor sertifikat.
- **Filter Status:** Saring berdasarkan `Tersedia`, `Booked`, `Terjual`, `Coming Soon`, atau `Draft`.
- **Filter Kategori:** Saring berdasarkan kluster hunian tertentu.
- **Quick Action Menu:**
  - *Edit*: Masuk ke editor 8-seksi.
  - *Lihat Halaman Publik*: Membuka halaman `/unit/[slug]` di tab baru.
  - *Hapus*: Menghapus unit secara aman.

---

#### 2. Formulir Editor Properti (8 Bagian Terstruktur)

Editor properti Titik Huni dibagi ke dalam 8 seksi untuk memastikan data terstruktur dan lengkap:

##### A. Seksi 1 — Overview (Informasi Dasar)
- **Judul Properti:** Nama komersial unit (contoh: *Titik Huni Bangunjiwo Type 65*).
- **Slug URL:** Tautan ramah SEO (contoh: `titik-huni-bangunjiwo-type-65`). Dibuat otomatis dari judul, namun dapat disesuaikan manual.
- **Kategori:** Pilih kluster atau jenis properti.
- **Deskripsi:** Uraian naratif lengkap mengenai konsep rumah, suasana lingkungan, dan daya tarik properti.

##### B. Seksi 2 — Pricing (Skema Harga)
- **Harga Pokok:** Angka nominal numerik murni tanpa titik/koma (contoh: `650000000` untuk 650 Juta). Sistem otomatis memformat ke bentuk rupiah.
- **Awalan Harga (*Price Prefix*):** Pilihan: `Mulai`, `Mulai dari`, `Harga`, atau `Promo`.
- **Akhiran Harga (*Price Suffix*):** Pilihan: `Juta` atau `Miliar` (opsional untuk ringkasan kartu).

##### C. Seksi 3 — Lokasi (Geografis & Alamat)
- **Lokasi Ringkas:** Teks ringkas untuk kartu katalog (contoh: *Bangunjiwo, Kasihan, Bantul*).
- **Kelurahan / Desa:** Nama desa/kelurahan setempat (contoh: *Bangunjiwo*).
- **Kecamatan:** Nama kecamatan (contoh: *Kasihan*).
- **Kabupaten / Kota:** Pilihan wilayah D.I. Yogyakarta:
  - *Sleman*
  - *Bantul*
  - *Kota Yogyakarta*
  - *Kulon Progo*
  - *Gunungkidul*
- **Provinsi:** Terisi otomatis *Daerah Istimewa Yogyakarta*.
- **Alamat Lengkap:** Alamat presisi untuk keperluan survei internal.

##### D. Seksi 4 — Spesifikasi & Detail Teknis
- **Luas Tanah (LT):** Luas dalam meter persegi ($m^2$).
- **Luas Bangunan (LB):** Luas bangunan dalam meter persegi ($m^2$).
- **Jumlah Lantai:** 1 lantai, 2 lantai, atau mezanin.
- **Kamar Tidur (KT) & Kamar Mandi (KM):** Jumlah ruang.
- **Carport:** Kapasitas kendaraan roda empat.
- **Jenis Legalitas / Sertifikat:** `SHM` (Sertifikat Hak Milik), `HGB` (Hak Guna Bangunan), atau `SHMSK`.
- **Daya Listrik:** Kapasitas daya PLN (misal: 1300 VA, 2200 VA).
- **Sumber Air:** `Sumur Bor` atau `PDAM`.
- **Kondisi Perabotan (*Furnishing*):** `Unfurnished`, `Semi Furnished`, atau `Fully Furnished`.

##### E. Seksi 5 — Media & Galeri Foto
- **Foto Utama (*Thumbnail / Cover*):**
  - Foto terbaik yang mewakili fasad rumah tampak depan.
  - Tampil pada kartu katalog publik dan hero section halaman detail.
  - Gambar dikompresi otomatis ke format WebP ringan (< 300 KB).
  - Terdapat tombol **Ganti Foto** dan tombol **Hapus**.
- **Galeri Foto Tambahan:**
  - Upload multi-file untuk foto interior: ruang tamu, kamar tidur, dapur, toilet, denah arsitektur, dan lingkungan perumahan.
  - Setiap foto memiliki tombol hapus instan yang terintegrasi dengan proteksi storage.

##### F. Seksi 6 — Selling Points (Keunggulan Utama)
- Tambahkan poin-poin fasilitas atau keunggulan strategis dalam bentuk butir poin singkat.
- Contoh:
  - *5 Menit ke Ring Road Selatan*
  - *Air Sumur Jernih & Bebas Banjir*
  - *One Gate System & Keamanan 24 Jam*
  - *Plafon Tinggi 4 Meter Sirkulasi Sejuk*

##### G. Seksi 7 — Publishing & Status
- **Status Unit:**
  - `Draft`: Disimpan untuk pengerjaan internal, **tidak tampil di web publik**.
  - `Tersedia`: Unit aktif siap dipasarkan dan menerima survei.
  - `Coming Soon`: Unit dalam persiapan pra-rilis.
  - `Booked`: Klien telah mengunci unit dengan tanda jadi.
  - `Terjual`: Unit telah laku terjual (tetap dapat diakses untuk portofolio).
- **Unit Pilihan (*Featured Unit*):**
  - Centang opsi untuk menampilkan unit di bagian **Rekomendasi Utama** pada Beranda Titik Huni.
  - Atur **Urutan Unggulan (*Featured Order*)** (angka 1, 2, 3...) untuk menentukan urutan kartu.

##### H. Seksi 8 — SEO & Meta Tag
- **Judul SEO (*SEO Title*):**
  - Judul yang muncul di tab browser dan hasil pencarian Google.
  - Panjang optimal: **50 - 60 karakter**. Terdapat indikator panjang karakter visual.
- **Deskripsi Meta (*Meta Description*):**
  - Ringkasan 1-2 kalimat untuk snippet Google.
  - Panjang optimal: **120 - 160 karakter**.
- **Canonical URL:** Tautan kanonikal default (kosongkan jika sesuai rute default).
- **Index oleh Mesin Pencari (*is_indexed*):**
  - Pastikan aktif (`true`) agar terindeks Google. Nonaktifkan jika unit bersifat privat.
- **Custom OpenGraph Image:** Foto kustom untuk pratinjau saat tautan dibagikan ke WhatsApp / media sosial.

---

#### 3. Prosedur Penghapusan Unit (Delete)
1. Buka daftar unit di `/admin/units`.
2. Klik menu aksi pada unit yang hendak dihapus -> Pilih **Hapus Unit**.
3. Modal konfirmasi muncul untuk mencegah penghapusan tidak disengaja.
4. **Mekanisme Otomatis:**
   - Sistem memutuskan keterkaitan database.
   - Sistem memeriksa seluruh file foto unit.
   - File fisik yang hanya digunakan oleh unit tersebut otomatis dihapus dari Supabase Storage.
   - File foto yang masih digunakan oleh unit lain **tetap terlindungi** dan tidak akan terhapus.

---

### 5.4. Kategori Properti

**Rute:** `/admin/categories`

Modul pendukung untuk mengelompokkan unit hunian ke dalam kluster atau kategori tertentu (misalnya: *Rumah Siap Huni*, *Rumah Pesan Bangun*, *Villa Tropis*, *Kavling Tanah*).

#### Operasi CRUD Kategori:
- **Tambah Kategori:**
  1. Masukkan nama kategori pada input form atas (contoh: *Rumah Minimalis Sleman*).
  2. Slug URL terisi otomatis.
  3. Klik tombol **Tambah Kategori**.
- **Edit Kategori:**
  1. Klik tombol **Edit** pada baris kategori yang bersangkutan.
  2. Ubah nama kategori langsung pada baris tabel (*inline edit*).
  3. Klik tombol centang hijau (**Simpan**).
- **Hapus Kategori:**
  1. Klik tombol tempat sampah (**Hapus**).
  2. Jika kategori masih memiliki relasi ke unit aktif, sistem akan menolak penghapusan demi menjaga integritas data.

---

### 5.5. Portofolio Proyek (Studio Arsitektur & Konstruksi)

**Rute:** `/admin/projects` (Daftar) | `/admin/projects/new` (Buat Baru) | `/admin/projects/edit/[id]` (Ubah)

Modul untuk memamerkan hasil karya rancang arsitektur, renovasi, dan konstruksi bangunan fisik yang dikerjakan oleh studio Titik Huni.

#### Field yang Dikelola:
- **Judul Proyek:** Nama proyek (contoh: *Rumah Tropis Bangunjiwo*, *Villa Minimalis Pakem*).
- **Slug URL:** Tautan halaman portofolio (`/proyek/[slug]`).
- **Lokasi Proyek:** Wilayah pengerjaan (contoh: *Bantul, D.I. Yogyakarta*).
- **Deskripsi Singkat:** Penjelasan konsep desain, luas lahan, dan tantangan arsitektural yang diselesaikan.
- **Foto Cover:** Foto render 3D utama atau foto hasil akhir bangunan (*real project*).
- **Galeri Foto Proyek:** Multi-upload dokumentasi proses desain, denah, tampak fasad, hingga detail interior.
- **Status Publikasi (*Published*):** Toggle aktif/nonaktif untuk menampilkan di halaman `/proyek`.
- **Proyek Unggulan (*Featured*):** Menampilkan proyek pada *Featured Section* di Beranda atau halaman studio arsitektur.

---

### 5.6. Artikel Blog & Edukasi Properti

**Rute:** `/admin/posts` (Daftar) | `/admin/posts/new` (Tulis Baru) | `/admin/posts/edit/[id]` (Ubah)

Modul konten untuk strategi *Inbound Marketing* dan SEO lokal, seperti panduan membeli rumah di Jogja, tips memilih arsitek, regulasi sertifikat tanah di DIY, dan inspirasi desain.

#### Fitur Editor Artikel:
1. **Editor TipTap WYSIWYG:**
   - Dukungan Heading (H2, H3) untuk struktur artikel yang rapi.
   - Format teks: Tebal (*Bold*), Miring (*Italic*), Kutipan (*Blockquote*).
   - Daftar berbutir (*Bullet list*) dan bernomor (*Ordered list*).
   - Penyisipan tautan web (*Hyperlinks*) dan gambar ilustrasi.
   - Sanitasi HTML otomatis di sisi server untuk membersihkan script berbahaya.
2. **Kategori & Tagging:**
   - Kelompokkan artikel ke kategori (misal: *Tips Properti*, *Arsitektur*, *Legalitas*).
   - Tambahkan tag kata kunci relevan.
3. **Relasi Silang Konten (*Internal Linking Booster*):**
   - **Tautkan ke Unit Terkait:** Pilih unit rumah yang relevan dengan artikel. Pengunjung yang membaca artikel akan melihat rekomendasi unit terkait di akhir tulisan.
   - **Tautkan ke Proyek Arsitektur:** Pasangkan artikel tips desain dengan proyek nyata Titik Huni.
4. **Pengaturan SEO Artikel:**
   - Meta title kustom, meta description, dan preview kartu Google.
   - Status artikel: `Draft`, `Published`, atau `Archived`.

---

## 6. SIKLUS HIDUP MEDIA & MANAJEMEN SUPABASE STORAGE

Pengelolaan media foto di Titik Huni telah dirancang secara presisi untuk mencegah penumpukan file sampah (*orphaned images*) dan menghemat kuota Supabase Storage.

### Arsitektur Bucket Penyimpanan
| Nama Bucket | Folder Path | Kegunaan | Hak Akses RLS |
|---|---|---|---|
| `properti` | `units/` | Foto utama & galeri unit properti | Publik: Baca \| Admin: Tulis & Hapus |
| `projects` | `projects/` | Foto cover & dokumentasi arsitektur | Publik: Baca \| Admin: Tulis & Hapus |
| `blog` | `blog/` | Foto cover artikel blog edukasi | Publik: Baca \| Admin: Tulis & Hapus |

### 5 Pilar Siklus Hidup Media Titik Huni:

```
1. Unggah Gambar di UI
   └─► Kompresi otomatis ke WebP (< 300 KB, max 1920px)
       └─► Diunggah ke bucket properti/units/<hash>-<timestamp>.webp

2. Pembatalan Draft (Belum Disimpan)
   └─► Admin menghapus foto atau membatalkan form baru
       └─► File fisik LANGSUNG dibersihkan dari storage seketika

3. Penggantian Foto Utama (Update Unit)
   └─► Admin mengganti foto utama dengan foto baru
       └─► Database di-update terlebih dahulu (Fail-safe)
           └─► Diffing foto lama vs foto baru dijalankan
               └─► Foto lama dihapus fisik dari Storage jika tidak dipakai unit lain

4. Penghapusan Galeri
   └─► Admin mengklik tombol tempat sampah pada salah satu foto galeri
       └─► Array gallery di database diperbarui
           └─► File fisik yang dikeluarkan otomatis dihapus dari Storage

5. Penghapusan Unit Lengkap
   └─► Unit dihapus dari database
       └─► Sistem memindai seluruh foto yang terkait
           └─► Proteksi Shared Reference: Hanya file unik yang dihapus;
               file yang dipakai unit lain tetap aman dipertahankan.
```

### Tool Audit Storage Mandiri
Admin atau pengembang dapat memeriksa kesehatan storage kapan saja melalui terminal lokal:
```bash
# Uji pemindaian tanpa menghapus (Dry-Run):
node scripts/audit-unit-storage.mjs --dry-run

# Jalankan pengujian otomatis lifecycle:
node --experimental-strip-types scripts/test-unit-storage-lifecycle.mjs
```

---

## 7. PANDUAN OPERASIONAL & BEST PRACTICES ADMIN

Untuk menjaga standar kualitas tinggi di mata calon pembeli dan mesin pencari, ikuti pedoman berikut:

### 1. Standar Foto & Visual:
- **Rasio Foto Utama:** Gunakan rasio lanskap **16:9** atau **4:3**. Pastikan foto horizontal, bukan vertikal.
- **Pencahayaan:** Ambil foto fasad saat cuaca cerah (pagi hari jam 08.00–10.00 atau sore hari jam 15.30–17.00) agar pencahayaan alami optimal.
- **Kerapian Objek:** Hindari memotret ruangan yang berantakan atau terhalang kendaraan yang tidak perlu.
- **Sistem Otomatis:** Anda tidak perlu mengecilkan resolusi secara manual; sistem secara otomatis mengompresi gambar ke WebP ringan beresolusi tajam.

### 2. Standar Penulisan Judul & Slug:
- **Gunakan Pola Judul yang Konsisten:**
  - *Format:* `[Nama Kluster/Brand] [Nama Lokasi/Kecamatan] [Tipe/Luas]`
  - *Contoh Benar:* `Titik Huni Trirenggo Bantul Tipe 54`
  - *Contoh Salah:* `RUMAH DIJUAL MURAH BANTUL BANGET BU CEPAT`
- **Slug yang Bersih:** Gunakan huruf kecil dipisahkan tanda strip (contoh: `titik-huni-trirenggo-bantul`). Hindari karakter aneh atau angka acak.

### 3. Standar SEO Lokal Yogyakarta:
- **Sertakan Entitas Lokal:** Sebutkan nama kecamatan, jarak ke fasilitas penting (UGM, Malioboro, Ring Road, Bandara YIA, Stasiun Tugu, dsb.).
- **Meta Description Menarik:** Buat kalimat ajakan yang ramah:
  > *"Rumah minimalis siap huni di Bangunjiwo, Kasihan, Bantul. Legalitas SHM & IMB lengkap, air jernih, akses mobil leluasa. Konsultasikan survei sekarang dengan Titik Huni."*

### 4. Standar Layanan Respon Leads (SLA):
- Calon pembeli properti memiliki tingkat konversi tertinggi jika dihubungi dalam **15 menit pertama** setelah mengisi formulir.
- Gunakan fitur tombol WhatsApp langsung pada dashboard untuk menyapa klien dengan sopan, menyebutkan nama klien dan unit yang diminati.

---

## 8. TROUBLESHOOTING & PROSEDUR DARURAT

| Gejala Masalah | Penyebab Kemungkinan | Solusi Penanganan |
|---|---|---|
| **Gagal Login ("Akun tidak memiliki akses")** | Email terdaftar belum memiliki baris `role = 'admin'` di tabel `profiles`. | Hubungi lead developer untuk memperbarui role akun di Supabase: `UPDATE profiles SET role = 'admin' WHERE id = '...';` |
| **Sesi Berakhir Mendadak** | Cookie refresh token Supabase kedaluwarsa setelah tidak aktif. | Masuk kembali melalui `/admin/login`. |
| **Gagal Mengunggah Foto** | Format file tidak didukung (harus JPG, PNG, WebP) atau ukuran file asli melebihi 15 MB. | Pastikan file berformat gambar standar dan tidak corrupt. |
| **Halaman Publik Masih Menampilkan Data Lama** | Halaman menggunakan strategi caching Next.js ISR (Revalidate 30 menit / 1 jam). | Server Action secara otomatis memicu `revalidatePath()`. Refresh halaman dengan `Ctrl + F5` atau tunggu beberapa detik. |
| **Tombol Hapus Galeri Tidak Merespon** | Koneksi internet terputus saat proses sinkronisasi Storage. | Periksa koneksi internet, lalu coba refresh halaman editor. |

---

> **Dokumen Terkait:**
> - Panduan Teknis Developer: `TITIK_HUNI_MASTER_AGENT_GUIDE.md`
> - Skrip Audit Storage: `scripts/audit-unit-storage.mjs`
> - Suite Pengujian Otomatis: `scripts/test-unit-storage-lifecycle.mjs`
