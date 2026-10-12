# Panduan Desain & Naskah Konten (Copywriting) Halaman Tentang Kami

**Halaman**: `http://localhost:3000/tentang-kami`  
**Brand**: Titik Huni (*Pengembang & Studio Arsitektur Yogyakarta*)  
**Fokus Dokumen**: Tata Desain Visual, Pendekatan UI/UX, dan Salinan Teks Lengkap (*Copywriting Blueprint*)  

---

## 1. Filosofi Desain & Arah Visual

Desain halaman **Tentang Kami** dirancang dengan pendekatan **arsitektural kontemporer**: tenang, terukur, fungsional, dan menghindari dekorasi yang berlebihan.

### A. Palet Warna & Karakter Visual
* **Deep Forest Green (`--primary: #234438`)**: Merepresentasikan ketenangan alam tropis Yogyakarta, kestabilan, dan dedikasi studio. Digunakan pada judul utama, aksen *eyebrow*, ikon, dan tombol aksi utama.
* **Sage Tint (`--sage: #EDF5EE`)**: Digunakan sebagai kontras lembut pada kartu studio & kontak di bagian penutup halaman, menciptakan kesan ramah dan terbuka untuk berdiskusi.
* **Canvas White & Surface (`#FFFFFF` & `#FAFAF8`)**: Warna latar bersih yang memberikan ruang bernapas lega (*white space*), menonjolkan foto fasad dan ketajaman teks.
* **Muted Charcoal (`--foreground-muted: #666863`)**: Digunakan untuk teks deskriptif agar nyaman dibaca dan tidak melelahkan mata (*readable & low glare*).

### B. Tipografi & Hierarki Teks
* **Font Family**: *Manrope* (dengan fitur tipografi `calt`, `ss01`).
* **H1 Hero Headline**: Ukuran dinamis `text-[clamp(2rem,4.2vw,3.5rem)]` dengan *letter-spacing* ketat (`tracking-[-0.04em]`) untuk kesan modern dan percaya diri.
* **H2 Section Headline**: Ukuran `text-2xl sm:text-3xl font-medium tracking-tight`.
* **Body Copy**: Ukuran `text-sm sm:text-base leading-relaxed` dengan batas lebar paragraf (`max-w-2xl` hingga `max-w-3xl`) agar baris baca tidak terlalu panjang di layar lebar.

---

## 2. Prinsip Copywriting & Tone of Voice

### A. Gaya Bahasa (*Tone of Voice*)
1. **Tenang & Bersahaja (*Understated & Grounded*)**:
   Tidak memakai jargon bombastis seperti *"Terbaik di Indonesia"*, *"Satu-satunya"*, atau *"Hunian Termewah"*.
2. **Spesifik & Faktual**:
   Langsung menyebutkan wilayah nyata (*Sleman & Bantul*), nama kawasan (*Candibinangun, Bangunjiwo, Kalasan, Berbah*), dan kepastian hukum (*SHM & PBG*).
3. **Berorientasi pada Penghuni (*Human-Centric*)**:
   Menekankan bagaimana desain rumah mempengaruhi kenyamanan aktivitas harian, suhu udara sejuk, dan efisiensi ruang keluarga.
4. **Bebas *AI-Slop* / Penomoran Palsu**:
   Tidak ada nomor buatan `01`, `02`, `03` yang sering diasosiasikan dengan konten otomatis generik. Setiap poin berdiri sendiri berdasarkan bobot fungsinya.

---

## 3. Rincian Naskah & Struktur Konten per Bagian

Berikut adalah salinan teks (*copywriting*) lengkap kata-demi-kata yang tampil pada halaman:

---

### Bagian 1: Hero & Pengenalan Studio

* **Navigasi Breadcrumb**:  
  `Beranda / Tentang Kami`

* **Eyebrow Tag**:  
  `PROFIL TITIK HUNI`

* **Judul Utama (H1)**:  
  > **"Rumah yang nyaman dimulai dari rancangan yang tepat."**

* **Deskripsi Pengantar**:  
  > "Titik Huni adalah pengembang hunian sekaligus studio perancangan arsitektur di Sleman dan Bantul. Kami fokus pada tata ruang yang efisien, respons terhadap iklim tropis, serta kepastian legalitas untuk setiap rumah yang kami hadirkan."

* **Media Banner Fasad**:
  * Gambar: `/assets/images/konsep_titikhuni.webp`
  * Proporsi: Rasio `16:9` pada ponsel, melebar ke `21:9` pada layar desktop.
  * Karakter Visual: Menampilkan fasad rumah tropis minimalis bergaris bersih, bukaan lebar, dan tanaman hijau tanpa distraksi teks berlebih di atas gambar.

---

### Bagian 2: Dua Fokus Layanan Utama

* **Eyebrow Tag**:  
  `LAYANAN KAMI`

* **Judul Seksi (H2)**:  
  > **"Mengembangkan hunian. Merancang ruang untuk kehidupan."**

* **Sub-judul**:  
  > "Menyediakan pilihan rumah siap huni maupun layanan desain dan bangun rumah di atas lahan Anda."

#### Kartu Layanan A: Titik Huni Residential
* **Label Kategori**: `Titik Huni Residential` (Ikon `Home`)
* **Judul Layanan (H3)**:  
  > **"Pengembangan Hunian"**
* **Deskripsi**:  
  > "Kami mengembangkan rumah tinggal di Yogyakarta dengan desain fungsional, pencahayaan alami, dan kenyamanan sehari-hari."
* **Poin Kunci**:  
  * • Tata ruang yang fungsional  
  * • Lokasi dengan akses yang mendukung aktivitas  
  * • Legalitas Terjamin  
  * • Lokasi: Yogyakarta dan sekitarnya.  
* **Teks Tombol (CTA)**:  
  `Lihat Hunian Kami →` (Mengarah ke `/unit`)

#### Kartu Layanan B: Titik Huni Studio
* **Label Divisi**: `TITIK HUNI STUDIO` (Ikon `Building2`)
* **Judul Layanan (H3)**:  
  > **"Desain Arsitektur & Konstruksi"**
* **Deskripsi**:  
  > "Kami menyediakan layanan desain dan pembangunan rumah tinggal di Yogyakarta yang disesuaikan dengan kebutuhan, karakter, dan anggaran klien."
* **Poin Kunci**:  
  * • Desain fungsional dan personal sesuai kebutuhan klien  
  * • Layanan desain 3D, gambar kerja  
  * • Perencanaan biaya yang transparan dan terukur  
  * • Pembangunan yang dikerjakan profesional  
  * • Lokasi: Yogyakarta dan sekitarnya  
* **Teks Tombol (CTA)**:  
  `Konsultasikan Proyek Anda →` (Mengarah ke `/arsitek-kontraktor`)

---

### Bagian 3: Pendekatan Perancangan Tropis

* **Eyebrow Tag**:  
  `PENDEKATAN KAMI`

* **Judul Seksi (H2)**:  
  > **"Fokus kenyamanan hidup sehari-hari"**

* **Sub-judul**:  
  > "Empat prinsip sederhana yang memandu setiap denah dan bentuk rumah:"

* **4 Pilar Kartu Pendekatan**:
  1. **Tata Ruang Fungsional** (Ikon `Layers3`):  
     > *"Denah disusun efisien mengikuti alur aktivitas harian, memaksimalkan fungsi tanpa ruang mati."*
  2. **Pencahayaan Alami** (Ikon `Sun`):  
     > *"Bukaan jendela dan ventilasi atas ditata agar ruangan terang alami sepanjang siang tanpa panas berlebih."*
  3. **Sirkulasi Udara Silang** (Ikon `Wind`):  
     > *"Penataan ventilasi silang menjaga pergantian udara pasif tetap sejuk dan nyaman."*
  4. **Material Tropis Awet** (Ikon `ShieldCheck`):  
     > *"Material dipilih sesuai iklim lokal Yogyakarta, tahan cuaca, dan mudah dirawat."*

---

### Bagian 4: Studio Fisik & Jalur Komunikasi

* **Tampilan Visual**: Kartu berbingkai melengkung (*rounded-3xl*) dengan latar belakang *sage green* lembut (`bg-[var(--sage)]`).
* **Eyebrow Tag**:  
  `STUDIO & KANTOR`

* **Judul Seksi (H2)**:  
  > **"Punya pertanyaan seputar hunian di Jogja?"**

* **Sub-judul**:  
  > "Diskusikan kebutuhan rumah, rencana desain, atau jadwal kunjungan ke studio kami tanpa biaya konsultasi."

* **Informasi Fisik**:
  * **Alamat Kantor**: `Jl. Gondang Legi, Gondang Legi, Wedomartani, Kec. Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55584` (Ikon `MapPin`)
  * **Jam Buka**: `Senin – Sabtu, 08.30 – 17.00 WIB` (Ikon `Clock`)

* **Tombol Tindakan (CTA Buttons)**:
  * **Tombol Utama**: `Konsultasi via WhatsApp ↗`  
    *(Membuka obrolan WhatsApp resmi dengan pesan default: "Halo Titik Huni, saya ingin berkonsultasi mengenai hunian atau pembangunan rumah di Yogyakarta.")*
  * **Tombol Sekunder**: `Lihat Unit Tersedia →`  
    *(Tautan ke katalog unit)*

---

## 4. Perilaku Tampilan & Responsivitas (Mobile vs Desktop)

| Komponen Halaman | Tampilan Layar Ponsel (Mobile `< 640px`) | Tampilan Layar Lebar (Desktop `≥ 1024px`) |
| :--- | :--- | :--- |
| **Hero & Judul H1** | Teks mengalir vertikal, ukuran font adaptif (`~32px`), margin samping 20px nyaman. | Judul berukuran `~56px`, komposisi tipografi lebar dan elegan. |
| **Banner Fasad** | Rasio aspek 16:9, sudut melengkung 16px (`rounded-2xl`). | Rasio aspek sinematik 21:9, sudut melengkung 24px (`rounded-3xl`). |
| **Dua Kartu Layanan** | Menumpuk 1 kolom vertikal; tombol aksi berukuran penuh (*w-full*) mudah di-tap. | 2 kolom berdampingan (*grid-cols-2*), tinggi kartu seimbang (*equal height*). |
| **4 Pilar Desain** | 1 kolom vertikal (atau 2 kolom pada tablet), spasi ringkas. | 4 kolom mendatar (*grid-cols-4*), menyajikan 4 kartu sejajar. |
| **Seksi Kontak & CTA** | Formasi vertikal: info alamat di atas, diikuti 2 tombol bertumpuk lebar penuh. | Split grid 12 kolom: info studio di kiri (7 col), 2 tombol sejajar vertikal di kanan (5 col). |

---

## 5. Keunggulan Hasil Redesain

1. **Kejelasan Informasi (*Clarity*)**: Pengunjung dapat memahami dalam 5 detik apa yang ditawarkan Titik Huni (Developer rumah tapak & Jasa bangun rumah di Sleman/Bantul).
2. **Kenyamanan Membaca (*Readability*)**: Tidak ada dinding teks berlebihan; poin-poin disusun dengan daftar peluru (*bullet points*) yang mudah dipindai (*scannable*).
3. **Sentuhan Ramah Pengguna Mobile (*Touch-Friendly*)**: Semua tombol aksi memiliki tinggi minimal 44px dan spasi aman dari tepi layar.
4. **Kredibilitas Nyata**: Menyajikan alamat fisik studio yang jelas dan jam operasional, menumbuhkan rasa percaya calon pembeli properti di Yogyakarta.
