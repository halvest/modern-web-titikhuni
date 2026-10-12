# Test Matrix — Full Black-Box QA Titik Huni Admin

| ID | Modul | Skenario | Desktop (1440x900) | Tablet (768x1024) | Mobile (390x844) | Hasil | Bug ID | Bukti Screenshot / Log |
|---|---|---|---|---|---|---|---|---|
| A-01 | Login | Validasi submit form kosong menampilkan pesan error 'Lengkapi email dan password' | PASS | PASS | PASS | **PASS** | - | [A1-login-initial.png](screenshots/desktop/A1-login-initial.png) |
| A-02 | Login | Validasi password salah ditolak dengan pesan yang sesuai | PASS | PASS | PASS | **PASS** | - | [A2-login-wrong-password.png](screenshots/desktop/A2-login-wrong-password.png) |
| A-03 | Login | Login normal dengan akun admin QA berhasil dan redirect ke /admin/dashboard | PASS | PASS | PASS | **PASS** | - | [A3-dashboard-logged-in.png](screenshots/desktop/A3-dashboard-logged-in.png) |
| B-01 | Dashboard | KPI Cards (Total Leads Masuk, Unit Properti Aktif, Artikel Terbit) tampil konsisten | PASS | PASS | PASS | **PASS** | - | [B1-dashboard-overview-desktop.png](screenshots/desktop/B1-dashboard-overview-desktop.png) |
| B-02 | Dashboard | Seksi Tren Performa Lead dan Distribusi Funnel Lead ter-render sempurna | PASS | PASS | PASS | **PASS** | - | [B1-dashboard-overview-desktop.png](screenshots/desktop/B1-dashboard-overview-desktop.png) |
| B-03 | Dashboard | Tabel Lead Terbaru dan Katalog Unit Properti tampil dengan data akurat | PASS | PASS | PASS | **PASS** | - | [B1-dashboard-overview-desktop.png](screenshots/desktop/B1-dashboard-overview-desktop.png) |
| C-01 | Leads | Workspace CRM Leads tampil lengkap dengan input pencarian dan filter | PASS | PASS | PASS | **PASS** | - | [C1-leads-list-desktop.png](screenshots/desktop/C1-leads-list-desktop.png) |
| C-02 | Leads | Fitur Ekspor CSV menghasilkan file valid dengan sanitasi formula injection | PASS | PASS | PASS | **PASS** | - | [leads-export-qa.csv](logs/leads-export-qa.csv) |
| C-03 | Leads | Tombol WhatsApp menghasilkan tautan wa.me/ dengan nomor dan sapaan yang benar | PASS | PASS | PASS | **PASS** | - | [C1-leads-list-desktop.png](screenshots/desktop/C1-leads-list-desktop.png) |
| D-01 | Units | Editor Unit memiliki 8 seksi lengkap (Overview, Pricing, Lokasi, Detail, Media, Selling Points, Publishing, SEO) | PASS | PASS | PASS | **PASS** | - | [D2-units-editor-new.png](screenshots/desktop/D2-units-editor-new.png) |
| D-02 | Units | Create Unit: Unit testing baru berhasil disimpan sebagai Draft dan muncul di katalog admin | PASS | PASS | PASS | **PASS** | - | [D4-units-list-with-qa-unit.png](screenshots/desktop/D4-units-list-with-qa-unit.png) |
| D-03 | Units | Update Unit: Edit data unit berhasil disimpan kembali | PASS | PASS | PASS | **PASS** | - | [D4-units-list-with-qa-unit.png](screenshots/desktop/D4-units-list-with-qa-unit.png) |
| D-04 | Units | Delete Unit: Seluruh unit testing dihapus bersih dari katalog tanpa menyentuh unit lama | PASS | PASS | PASS | **PASS** | - | [D1-units-catalog-desktop.png](screenshots/desktop/D1-units-catalog-desktop.png) |
| E-01 | Categories | Create Category: Tambah kategori baru berhasil dan tampil di tabel | PASS | PASS | PASS | **PASS** | - | [E1-categories-desktop.png](screenshots/desktop/E1-categories-desktop.png) |
| E-02 | Categories | Delete Category: Hapus kategori testing berhasil tanpa mengganggu kategori lain | PASS | PASS | PASS | **PASS** | - | [E1-categories-desktop.png](screenshots/desktop/E1-categories-desktop.png) |
| F-01 | Projects | Daftar portofolio proyek studio arsitektur tampil dengan status dan tombol tambah | PASS | PASS | PASS | **PASS** | - | [F1-projects-desktop.png](screenshots/desktop/F1-projects-desktop.png) |
| G-01 | Posts | Editor TipTap WYSIWYG untuk penulisan artikel blog ter-render sempurna | PASS | PASS | PASS | **PASS** | - | [G2-posts-editor-new.png](screenshots/desktop/G2-posts-editor-new.png) |
| G-02 | Posts | Integritas Artikel Lama: Seluruh postingan blog lama terlindungi 100% tanpa modifikasi | PASS | PASS | PASS | **PASS** | - | [G1-posts-desktop.png](screenshots/desktop/G1-posts-desktop.png) |
| A-04 | Security | Akses Kontrol: Rute terlindungi (/admin/dashboard) menolak akses setelah logout dan redirect ke /admin/login | PASS | PASS | PASS | **PASS** | - | [A4-logout-redirect.png](screenshots/desktop/A4-logout-redirect.png) |
| J-01 | Responsive | Tablet Viewport (768x1024): Layout, sidebar, tabel, dan grafik tidak mengalami horizontal overflow | N/A | PASS | N/A | **PASS** | - | [J1-dashboard-tablet.png](screenshots/tablet/J1-dashboard-tablet.png) |
| J-02 | Responsive | Mobile Viewport (390x844): Navigasi mobile, kartu metrik, dan tombol aksi dapat dioperasikan | N/A | N/A | PASS | **PASS** | - | [J5-dashboard-mobile.png](screenshots/mobile/J5-dashboard-mobile.png) |
