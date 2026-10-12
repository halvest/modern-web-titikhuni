# Panduan Desain & Naskah Konten (Copywriting) Halaman Arsitek & Kontraktor

**Halaman**: `http://localhost:3000/arsitek-kontraktor`  
**Brand**: Titik Huni (*Studio Arsitektur & Kontraktor Terintegrasi di Yogyakarta*)  
**Fokus Dokumen**: Tata Desain Visual, Pendekatan UI/UX, dan Salinan Teks Lengkap (*Copywriting Blueprint*)  

---

## 1. Filosofi Desain & Arah Visual

Halaman **Arsitek & Kontraktor** dirancang dengan konsep **Desain Terpadu (*Design & Build*)**: memberikan kepastian, transparansi teknis, dan ketenangan pikiran bagi pemilik lahan yang ingin mendesain dan membangun rumah di Daerah Istimewa Yogyakarta.

### A. Palet Warna & Karakter Visual
* **Deep Forest Green (`--primary: #234438`)**: Merepresentasikan integritas konstruksi, ketegasan arsitektural, dan dedikasi studio. Digunakan pada judul penting, tombol utama, node linimasa alur kerja, dan *hero CTA box*.
* **Sage Tint (`--sage: #EDF5EE`)**: Digunakan sebagai kontainer ikon pada kartu keunggulan, memberikan nuansa sejuk dan ramah.
* **Canvas Clean White (`#FFFFFF`) & Surface Tint (`#FAFAF8`)**: Latar belakang bersih dengan kontras tinggi untuk mempermudah pemindaian teks dan detail portofolio.
* **Muted Charcoal (`--foreground-muted: #666863`)**: Digunakan untuk deskripsi alur kerja dan penjelasan teknis agar mudah dibaca (*high legibility*).

### B. Tipografi & Hierarki Teks
* **Font Family**: *Manrope* (dengan OpenType features `calt`, `ss01`).
* **H1 Hero Headline**: Ukuran adaptif `text-[clamp(2.25rem,4.5vw,4rem)]` dengan *letter-spacing* padat (`tracking-[-0.04em]`).
* **H2 Section Headline**: Ukuran `text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.1]`.
* **Sub-headline & Body**: `text-base sm:text-lg leading-relaxed text-foreground-muted`.

---

## 2. Prinsip Copywriting & Tone of Voice

### A. Gaya Bahasa (*Tone of Voice*)
1. **Bebas Kerumitan (*Clarity over Jargon*)**:
   Menghindari istilah teknis rumit yang menakutkan klien awam. Menggunakan perumpamaan jelas seperti *"dari coretan denah hingga serah terima kunci"*.
2. **Fokus pada Kepastian & Transparansi Biaya**:
   Mengatasi ketakutan terbesar pemilik rumah: *biaya membengkak* dan *arsitek vs tukang yang saling lempar tanggung jawab*. Penekanan kuat pada **RAB terinci tanpa biaya siluman** dan **Satu Tim Terintegrasi**.
3. **Anti-Overclaim**:
   Tidak ada janji berlebihan. Keunggulan disampaikan melalui fakta alur kerja (gambar kerja detail DED, pengawasan berkala, retensi pemeliharaan).
4. **Bebas Penomoran Artifisial (`01, 02, 03`)**:
   Setiap langkah dan nilai disampaikan melalui hierarki judul dan ikon fungsional (`PenTool`, `FileText`, `HardHat`, `KeyRound`).

---

## 3. Rincian Naskah & Struktur Konten per Bagian

Berikut adalah salinan teks (*copywriting*) lengkap kata-demi-kata yang tampil pada halaman:

---

### Bagian 1: Hero Section & Nilai Utama

* **Navigasi Breadcrumb**:  
  `Beranda / Jasa Arsitek & Kontraktor`

* **Eyebrow Tag**:  
  `TITIK HUNI STUDIO · YOGYAKARTA`

* **Judul Utama (H1)**:  
  > **"Rancang dengan matang. Bangun dengan tepat."**

* **Deskripsi Pengantar**:  
  > "Titik Huni Studio menyediakan layanan desain arsitektur dan konstruksi rumah tinggal di Yogyakarta. Kami membantu mewujudkan kebutuhan ruang melalui perencanaan desain, anggaran yang terukur, dan pelaksanaan pembangunan yang terarah."

* **Tombol Tindakan (CTA Buttons)**:
  * **Tombol Utama**: `Konsultasi via WhatsApp ↗`  
    *(Membuka WhatsApp resmi dengan pesan default konsultasi arsitek dan kontraktor di Yogyakarta)*
  * **Tautan Sekunder**: `Pelajari Layanan Kami →` *(Melompat halus ke `#layanan`)*

* **Media Fasad Studio**:
  * Gambar: `/assets/images/rumah-bangunjiwo-2.jpg` (Fasad proyek nyata di Bangunjiwo, Yogyakarta)
  * Rasio Aspek: `4/3` pada ponsel, melebar ke `16/10` pada tablet, dan `4/3` proporsional pada desktop.
  * *Caption Badge Glassmorphism*:
    * Tag: `STUDIO ARSITEKTUR & KONSTRUKSI` (Aksen hijau emerald)
    * Teks: *"Mewujudkan ruang hidup fungsional dan abadi."*

---

### Bagian 2: Keunggulan Layanan (*Value Propositions*)

* **Eyebrow Tag**:  
  `KEUNGGULAN LAYANAN`

* **Judul Seksi (H2)**:  
  > **"Mengapa memilih Titik Huni Studio?"**

* **Deskripsi Seksi**:  
  > "Kami menggabungkan perencanaan desain, anggaran, dan pelaksanaan konstruksi dalam proses kerja yang terarah dan transparan."

* **3 Kartu Keunggulan**:
  1. **Satu Tim Terintegrasi** (Ikon `CheckCircle2`):  
     > *"Layanan desain hingga konstruksi dikoordinasikan dalam satu tim untuk menjaga kesesuaian perencanaan dan pelaksanaan."*
  2. **Perencanaan Biaya Transparan** (Ikon `ShieldCheck`):  
     > *"Rincian material, pekerjaan, dan estimasi biaya disusun melalui RAB sebagai acuan anggaran pembangunan."*
  3. **Desain Berorientasi Fungsi** (Ikon `Ruler`):  
     > *"Mengutamakan tata ruang fungsional, pencahayaan alami, dan sirkulasi udara sesuai kebutuhan penghuni."*

---

### Bagian 3: Alur Kerja (*Workflow Step-by-Step*)

* **Eyebrow Tag**:  
  `ALUR KERJA KAMI`

* **Judul Seksi (H2)**:  
  > **"Proses terencana di setiap tahap."**

* **Deskripsi Seksi**:  
  > "Dari konsultasi awal hingga serah terima bangunan, setiap tahap dikerjakan berdasarkan perencanaan, koordinasi, dan pengawasan yang terarah."

* **Tombol Diskusi (CTA)**:  
  `Mulai Diskusi Proyek →` *(Mengarah langsung ke WhatsApp resmi)*

* **4 Langkah Linimasa Terpadu**:
  | Langkah | Ikon | Judul Tahapan | Deskripsi Copywriting |
  | :--- | :--- | :--- | :--- |
  | **01** | `PenTool` | **Konsultasi & Konsep Desain** | Kami memahami kebutuhan ruang, preferensi desain, dan anggaran untuk menyusun konsep serta visualisasi 3D. |
  | **02** | `FileText` | **Gambar Kerja & RAB** | Penyusunan gambar teknis, spesifikasi material, dan Rencana Anggaran Biaya (RAB) sebagai acuan pembangunan. |
  | **03** | `HardHat` | **Konstruksi & Pengawasan** | Pelaksanaan pembangunan dengan pengawasan berkala untuk menjaga kesesuaian desain, material, dan kualitas pekerjaan. |
  | **04** | `KeyRound` | **Pemeriksaan & Serah Terima** | Pemeriksaan hasil pekerjaan bersama klien sebelum serah terima, dilanjutkan masa pemeliharaan sesuai kesepakatan. |

---

### Bagian 4: Galeri Portofolio Proyek (*Visual Proof*)

* **Komponen**: `<HomeGallery />`
* **Fungsi Desain**: Menyajikan dokumentasi foto nyata fasad, interior, dan ruang terbuka hasil rancang bangun Titik Huni di berbagai sudut Yogyakarta (Bangunjiwo, Candibinangun, Berbah, Kalasan).
* **Tujuan Psikologis**: Membuktikan standar estetika modern tropis dan kualitas eksekusi lapangan kepada calon klien.

---

### Bagian 5: Penutup & Konversi (*Bottom Hero CTA*)

* **Tampilan Visual**: Kartu berukuran masif dengan latar hijau botol tua (`bg-primary`), sudut lengkung `rounded-[2rem]`, dan efek pencahayaan radial halus di bagian atas (*radial gradient glow*).
* **Judul Penutup (H2)**:  
  > **"Mari rencanakan rumah impian Anda."**
* **Paragraf Ajakan**:  
  > "Konsultasikan lahan, kebutuhan ruang, dan perkiraan budget Anda bersama tim arsitek Titik Huni tanpa komitmen awal."
* **Tombol Tindakan (CTA Buttons)**:
  * **Tombol WhatsApp (Hero Button)**:  
    `Hubungi via WhatsApp ↗`  
    *(Tombol putih kontras tinggi dengan ikon `MessageCircle`)*
  * **Tombol Instagram**:  
    `Instagram Titik Huni`  
    *(Tombol berlatar kaca transparan `bg-white/10 border-white/30` untuk melihat update proyek terkini)*

---

## 4. Perilaku Tampilan & Responsivitas (Mobile vs Desktop)

| Elemen Antarmuka | Tampilan Ponsel (Mobile `< 640px`) | Tampilan Layar Lebar (Desktop `≥ 1024px`) |
| :--- | :--- | :--- |
| **Hero Layout** | Susunan vertikal bertumpuk; teks di atas, foto fasad di bawah. Tombol WhatsApp melebar penuh (*w-full*). | Grid 12 kolom berdampingan (*6 col teks : 6 col media fasad*); tombol sejajar horizontal. |
| **Kartu Keunggulan** | 1 kolom vertikal bertumpuk rapi; bantalan padding 24px nyaman di layar sempit. | 3 kolom mendatar sejajar (*grid-cols-3*); efek melayang lembut saat kursor melintas (*hover lift*). |
| **Alur Kerja (Workflow)** | Linimasa vertikal dengan garis hijau di sebelah kiri dan node ikon melingkar. | Grid 12 kolom: judul & tombol sticky di sebelah kiri (5 col), alur linimasa mengalir di sebelah kanan (7 col). |
| **Tombol CTA Hero Bawah** | Tombol WhatsApp & Instagram bertumpuk vertikal dengan ukuran sentuh penuh ramah jempol. | Tombol berjejer horizontal di tengah kartu (*flex-wrap justify-center*). |

---

## 5. Ringkasan File & Komponen Terkait

1. **Halaman Route Utama**:  
   [`src/app/(marketing)/arsitek-kontraktor/page.tsx`](file:///e:/project-new/modern-web-titikhuni/src/app/(marketing)/arsitek-kontraktor/page.tsx) — Halaman server-side lengkap berisi seluruh seksi, metadata SEO, dan alur kerja.
2. **Komponen Form Terpisah**:  
   [`src/components/JasaBangun.tsx`](file:///e:/project-new/modern-web-titikhuni/src/components/JasaBangun.tsx) — Modul interaktif formulir konsultasi dan entri lead Supabase.
3. **Komponen Galeri**:  
   [`src/components/marketing/home/HomeSections.tsx`](file:///e:/project-new/modern-web-titikhuni/src/components/marketing/home/HomeSections.tsx) — Modul portofolio visual `<HomeGallery />`.
4. **Konfigurasi Kontak**:  
   [`src/config/site.ts`](file:///e:/project-new/modern-web-titikhuni/src/config/site.ts) — Nomor telepon WhatsApp dan tautan sosial media resmi.

---

## 6. Status Teknis & Verifikasi

* **Linter & Type Safety**: Lolos `npx tsc --noEmit` dengan **0 error**.
* **Production Build**: Lolos `next build` dengan status **Exit Code 0**.
* **SEO Metadata**: Terkonfigurasi canonical URL `https://titikhuni.id/arsitek-kontraktor` dan kata kunci strategis rancang bangun Yogyakarta.
