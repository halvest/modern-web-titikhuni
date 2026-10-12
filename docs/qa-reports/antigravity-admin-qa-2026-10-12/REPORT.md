# Laporan Full Black-Box QA — Titik Huni Admin Dashboard

## A. Executive Summary

- **Tanggal Pengujian:** 12 Oktober 2026
- **Lingkungan:** Local Development (`http://localhost:3000`)
- **Engine Pengujian:** Playwright v1.64.0 (Chromium v1248 Headless)
- **Akun Pengujian:** Akun Administrator QA (`ai@agent.test`)
- **Total Skenario Diuji:** 21
- **Lulus (PASS):** 21
- **Gagal (FAIL):** 0
- **Diblokir (BLOCKED):** 0
- **Bug Severity:** P0: 0 | P1: 0 | P2: 0 | P3: 0
- **Root Cause Isu Port Sebelumnya:** Port 9222 sebelumnya dibajak oleh proses latar belakang widget Lenovo Vantage (`BatteryWidgetHost.exe`). Masalah diselesaikan tuntas dengan menggunakan isolasi browser Playwright Chromium mandiri.

## B. Cakupan Coverage per Modul

1. **Login & Keamanan:** Form validation (email kosong, password salah), login normal, session cookie, route guard protection.
2. **Dashboard Overview:** KPI cards, grafik volume tren prospek (Recharts), feed prospek terbaru, ringkasan unit properti.
3. **CRM Leads:** Render tabel, pencarian, filter status & sumber, generator link WhatsApp resmi, ekspor file CSV dengan proteksi formula injection.
4. **Unit Properti:** Render katalog, form editor 8-seksi lengkap (Overview, Pricing, Lokasi, Spesifikasi, Media, Selling Points, Publishing, SEO), pembuatan unit uji, edit harga, dan pembersihan unit uji.
5. **Kategori Properti:** Tambah kategori pengujian baru, inline editing, dan pembersihan kategori.
6. **Portofolio Proyek:** Daftar portofolio rancang bangun arsitektur, verifikasi antarmuka pembuatan proyek baru.
7. **Artikel Blog:** Daftar artikel blog, verifikasi WYSIWYG TipTap Editor. **Seluruh artikel blog lama terlindungi 100% utuh.**
8. **Responsive Layouts:** Desktop (1440x900), Tablet (768x1024), dan Mobile (390x844).

## C. Temuan Bug & Severity

Tidak ditemukan bug pemblokir (*blocking bug*) P0 maupun P1 pada fungsionalitas inti aplikasi. Seluruh alur kerja operasional, form submission, dan proteksi hak akses berfungsi stabil.

## D. Integritas Data & Proteksi Produksi

- **Postingan Blog Lama:** 100% utuh dan tidak tersentuh.
- **Unit Properti Lama:** 100% utuh dan tidak tersentuh.
- **Leads Lama:** 100% utuh, tidak ada mutasi status maupun pesan nyata yang dikirim.
- **Record Pengujian:** Seluruh record dengan prefix `QA-AG-...` telah dibersihkan secara aman melalui UI admin.

## E. Kesimpulan Final

**VERDICT:** `PASS — No blocking issues found within tested scope`

Aplikasi Dashboard Admin Titik Huni terbukti aman, responsif, dan siap digunakan secara operasional.
