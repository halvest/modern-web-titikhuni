# Strategi katalog rumah Titik Huni

Tanggal pengerjaan: 23 September 2026. Halaman: `/unit`.

## Tujuan dan batas bukti

Tujuannya memperluas relevansi halaman terhadap pencarian rumah di Yogyakarta dan membantu pengunjung melanjutkan ke detail rumah atau konsultasi. Optimasi halaman tidak menciptakan volume pencarian pasar dan tidak menjamin posisi di atas kompetitor.

Belum ada ekspor Search Console, Keyword Planner, data konversi, pengujian pengguna, atau pengukuran Core Web Vitals produksi untuk pekerjaan ini. Angka volume, kesulitan kata kunci, kenaikan trafik, dan proyeksi penjualan tidak diperkirakan tanpa data tersebut.

## Riset dan pilihan strategi digital marketing

Pengamatan terbatas atas [katalog Agen Rumah Jogja](https://agenrumahjogja.com/rumah-dijual/) menunjukkan penggunaan harga, spesifikasi, lokasi, FAQ, serta jalur WhatsApp. [Listing Bantul di Pinhome](https://www.pinhome.id/jual/rumah-baru/di-yogyakarta/kab-bantul) juga mengorganisasi pilihan berdasarkan lokasi, harga, dan status. Ini pengamatan isi halaman, bukan audit menyeluruh atau bukti posisi mereka pada Google pengguna tertentu. Klaim komersial milik mereka tidak disalin ke Titik Huni.

Hipotesis: katalog yang membantu pengunjung membandingkan informasi konkret dan menelusuri rumah pada lokasi spesifik lebih berguna daripada memperpanjang teks dengan pengulangan kata kunci. Untuk Titik Huni, bukti yang tersedia adalah data unit, alamat, harga, status, foto, dan halaman profil/proyek yang sudah ada.

| Kelompok kebutuhan pencarian | Tujuan halaman | Penerapan |
| --- | --- | --- |
| Rumah dijual di Yogyakarta / Jogja | Katalog utama | Title, H1, ringkasan katalog, deskripsi yang relevan |
| Rumah dijual di Sleman / Bantul | Menelusuri lokasi | Bagian lokasi dengan tautan ke unit dari alamat yang tercatat |
| Rumah Bangunjiwo / Kasihan / Kalasan / Pakem | Detail rumah tertentu | Nama unit dan alamat asli sebagai tautan kontekstual |
| Harga rumah Titik Huni | Membandingkan anggaran awal | Harga mulai terendah dari status Tersedia; bukan harga pasar Jogja |
| Arti spesifikasi / status / cara kunjungan | Mengurangi kebingungan | Panduan dan FAQ yang sesuai perilaku halaman |

Kumpulan ini merupakan hipotesis kata kunci berbasis produk dan isi hasil pencarian, bukan daftar kata kunci yang volumenya sudah diukur. `/unit` menjadi pusat katalog; halaman detail menangani rumah spesifik. Tidak dibuat halaman lokasi massal dengan isi salinan.

Alur konversi: pencarian → katalog → lokasi/spesifikasi → detail rumah → diskusi dengan tim. Pengunjung yang belum memiliki pilihan dapat membuka panduan atau langsung berkonsultasi. Tautan profil dan proyek memberi konteks tentang pengembang tanpa membuat klaim penghargaan, review, atau angka penjualan.

## Metode design thinking yang diterapkan

1. **Memahami kebutuhan:** masukan pengguna meminta kartu tetap, dua baris geser mandiri, dan Coming Soon di ujung kanan. Kebutuhan pembeli mengenai harga/lokasi/spesifikasi adalah hipotesis dari isi katalog dan pengamatan halaman pembanding, belum hasil wawancara.
2. **Merumuskan masalah:** pengunjung perlu mengenali rumah yang bisa ditelusuri, memahami harga mulai, dan membandingkan pilihan pada layar kecil tanpa kehilangan konteks.
3. **Mengembangkan solusi:** pertahankan kartu; ganti hero bergambar dengan pembuka editorial singkat agar katalog lebih cepat terlihat, lalu gunakan ringkasan padat, penelusuran lokasi dari data nyata, dua area geser, panduan tiga langkah, dan FAQ yang dibuka sesuai kebutuhan.
4. **Mewujudkan:** komponen kartu asli tetap digunakan. Enam listing menjadi 3 di baris atas dan 3 di bawah. Masing-masing memakai scroll native dan snap sendiri; desktop menampilkan tiga kolom. Jika katalog bertambah, setiap tiga listing berikutnya membentuk baris baru agar listing tidak hilang.
5. **Menguji:** periksa layout mobile/desktop, pergeseran tiap baris, urutan status, tautan detail, FAQ, metadata, dan kesesuaian schema dengan isi. Ini verifikasi implementasi, bukan klaim validasi konversi dengan pengguna nyata.

## Implementasi SEO dan integritas informasi

- Title dan H1 fokus pada rumah dijual di Yogyakarta; Sleman dan Bantul muncul dalam konteks lokasi.
- Pembuka halaman tetap berupa teks yang dapat dirayapi, tanpa hero bergambar. Pembahasan lokasi, harga mulai, spesifikasi, status, dan langkah kunjungan tetap tersedia di katalog serta bagian pendukung yang relevan; panjang teks bukan target tersendiri.
- Canonical absolut `/unit`, metadata sosial khusus halaman, gambar lokal yang benar-benar tersedia, serta instruksi indeks yang sesuai.
- Breadcrumb terlihat di halaman dan direpresentasikan sebagai `BreadcrumbList`.
- `CollectionPage` dan `ItemList` mengikuti listing serta urutan yang benar-benar ditampilkan. Coming Soon tidak diberi URL detail maupun penawaran harga. Tidak dibuat rating, ulasan, harga pasar, atau tanggal pembaruan fiktif.
- Harga ringkasan hanya memakai nilai numerik positif dari status Tersedia. Harga Sold dan nilai contoh Coming Soon tidak masuk perhitungan. Jumlah listing dibedakan dari stok kavling.
- Tombol kawasan pada `/unit` menyaring kartu langsung tanpa navigasi. Jumlah listing, jumlah Tersedia, dan harga mulai diperbarui sesuai hasil. Penyaringan memakai slug kategori kawasan yang tercatat pada unit; unit tanpa kategori kawasan tetap muncul di Semua properti agar tidak salah ditempatkan.
- Isi utama, tautan, FAQ, dan seluruh kartu hadir pada HTML server. Tidak ada duplikasi kartu khusus mobile versus desktop atau ketergantungan pada library slider.
- FAQ membantu pembaca. Tidak ada janji FAQ rich result; [pembaruan Google Juni 2026](https://developers.google.com/search/updates) menyatakan fitur tersebut sudah tidak ditampilkan.
- JSON-LD melakukan escaping `<`. Saat data gagal dimuat, halaman tidak mengklaim katalog kosong sebagai fakta atau menampilkan daftar schema yang gagal diambil.

Panduan resmi: [konten yang membantu pengguna](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [title yang deskriptif](https://developers.google.com/search/docs/appearance/title-link), [structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), dan [breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

## Pengukuran setelah publikasi

Perubahan ini masih pada proyek lokal; pengindeksan dan performa produksi belum diverifikasi. Sebelum rilis, simpan baseline 28 hari Search Console untuk `/unit`: klik, impresi, CTR, posisi rata-rata, perangkat, dan kueri bermerek versus nonmerek. Setelah rilis, bandingkan periode sebanding dan periksa perubahan stok/musiman sebelum menyimpulkan sebab-akibat.

Untuk funnel, gunakan GTM yang sudah ada untuk mengukur klik detail rumah, tautan lokasi, dan WhatsApp pada `#main-content`. Atribut `data-catalog-cta` disiapkan pada tautan lokasi dan konsultasi bawah; konfigurasi tag/event belum dipublikasikan. Klik WhatsApp adalah minat awal, bukan otomatis percakapan, lead berkualitas, atau penjualan. Cocokkan secara operasional dengan pertanyaan masuk dan jadwal kunjungan sebelum menilai hasil.

Setelah tersedia pada domain produksi, periksa URL Inspection, canonical yang dipilih Google, markup breadcrumb, dan data performa lapangan. Pemeriksaan lokal tidak membuktikan halaman telah terindeks atau memenuhi Core Web Vitals.

## Pekerjaan data yang perlu bukti lanjutan

- Beberapa unit tersedia belum tergabung dalam kategori kawasan yang sesuai untuk penelusuran. Bagian lokasi baru memakai alamat asli; kategori database tidak ditebak atau diubah. Audit kategori melalui admin bersama pemilik data.
- Periksa setiap harga mulai dan status secara berkala. Lengkapi lokasi Coming Soon sebelum peluncuran agar label tempat tidak lagi berupa teks contoh.
- Jika ingin menampilkan akses fasilitas, waktu tempuh, dokumen kepemilikan, opsi KPR, foto pembangunan, atau testimoni, kumpulkan bukti spesifik per unit terlebih dahulu.
- Prioritaskan kueri berdasarkan impresi dan kebutuhan pembeli yang benar-benar masuk setelah data tersedia. Perbaiki judul atau isi berdasarkan temuan tersebut, bukan target jumlah kata.

## Hasil verifikasi lokal

- ESLint pada ketiga file TSX yang diubah/ditambahkan dan build produksi Next.js beserta pemeriksaan TypeScript berhasil.
- Respons HTTP lokal 200; HTML server memiliki satu H1, dua area katalog, FAQ, dan JSON-LD dengan enam item.
- Canonical dan `og:url` mengarah ke `https://titikhuni.id/unit`. Gambar sosial menggunakan aset yang tersedia.
- Lebar mobile 390 px: tiga kartu pada setiap baris, tidak ada overflow halaman. Setelah baris pertama digeser, posisi horizontalnya sekitar 313 px sementara baris kedua tetap 0. Setelah baris kedua digeser hingga akhir, posisi baris pertama tetap sekitar 313 px dan baris kedua sekitar 577 px.
- Lebar desktop 1440 px: kedua baris menampilkan tiga kolom tanpa overflow horizontal.
- Setelah pembuka dipadatkan, kartu pertama mulai tampak dalam viewport mobile 390 × 844 px. Pemeriksaan ulang menunjukkan satu H1, tanpa gambar pada pembuka, dan tanpa overflow horizontal halaman.
- Coming Soon berada pada item terakhir, tidak berada dalam tautan, dan FAQ harga menampilkan Rp500.000.000 sesuai harga terendah listing Tersedia pada saat pemeriksaan.
- Perpindahan filter Jogja Utara, Selatan, Barat, Timur, lalu Semua properti tidak mengubah URL `/unit`. Hasil kosong Barat menunjukkan pesan dan tombol untuk memulihkan seluruh katalog; filter lain memperbarui kartu serta hitungan tanpa memuat ulang halaman.
- SHA-256 komponen kartu sebelum dan sesudah: `1980EC4AFD161DEBD6A1D88C67AB1F839061A62BA21D4791C4ED9DA006742F1D`. File desain kartu tidak berubah.

Belum dilakukan: publikasi produksi, pengujian Rich Results pada URL publik yang telah diperbarui, pengukuran Core Web Vitals lapangan, atau evaluasi kenaikan trafik/konversi.
