import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ConsentPreferencePanel } from "@/components/tracking/ConsentPreferencePanel";

export const metadata: Metadata = {
  title: "Kebijakan Privasi & Preferensi Cookie | Titik Huni",
  description:
    "Kebijakan privasi dan pengelolaan persetujuan cookie Titik Huni. Kami menerapkan kebijakan strict opt-in untuk perlindungan privasi pengunjung di Yogyakarta.",
  alternates: {
    canonical: `${siteConfig.url}/kebijakan-privasi`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KebijakanPrivasiPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="outline-none focus:outline-none"
    >
      <div className="site-container pt-[calc(var(--header-height)+2rem)] pb-16 sm:pb-24 lg:pb-32">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-foreground-soft">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground font-medium">
              Kebijakan Privasi
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-3xl border-b border-border pb-8">
          <p className="site-eyebrow text-primary">Transparansi &amp; Privasi</p>
          <h1 className="mt-3 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Kebijakan Privasi &amp; Pengelolaan Cookie
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-foreground-muted sm:text-lg">
            Titik Huni berkomitmen melindungi data dan privasi setiap pengunjung.
            Halaman ini menjelaskan bagaimana kami mengelola data, menggunakan teknologi
            pelacakan, dan memberi Anda kontrol penuh atas persetujuan privasi.
          </p>
          <p className="mt-3 text-xs text-foreground-soft">
            Pembaruan terakhir: 19 Oktober 2026
          </p>
        </header>

        {/* Content Section */}
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <article className="prose prose-neutral max-w-none lg:col-span-8 prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground-muted prose-p:leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold">1. Komitmen Privasi Kami</h2>
              <p>
                Titik Huni (selanjutnya disebut &ldquo;kami&rdquo;) adalah penyedia
                layanan arsitektur, rancang bangun, dan kurasi hunian di Daerah
                Istimewa Yogyakarta. Kami menghormati hak privasi setiap pengunjung situs web
                <strong className="text-foreground"> titikhuni.id</strong>. Kami tidak
                pernah menjual, menyewakan, atau memperdagangkan data pribadi pengunjung
                kepada pihak ketiga untuk tujuan komersial di luar lingkup layanan resmi kami.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">2. Kebijakan Strict Opt-In</h2>
              <p>
                Situs web ini menerapkan kebijakan <strong className="text-foreground">Strict Opt-In</strong>.
                Artinya, tidak ada tag analitik lanjutan maupun pelacakan pemasaran pihak ketiga
                (termasuk Google Tag Manager dan Meta Pixel) yang akan diaktifkan atau mengumpulkan
                data penjelajahan Anda sebelum Anda memberikan persetujuan eksplisit melalui banner
                persetujuan atau panel pengaturan di bawah ini.
              </p>
              <p>
                Jika Anda memilih untuk menolak atau belum menentukan pilihan, situs tetap berfungsi
                secara penuh tanpa mengurangi aksesibilitas informasi katalog properti, artikel blog,
                maupun kontak kami.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">3. Teknologi Pihak Ketiga yang Digunakan</h2>
              <p>
                Setelah mendapatkan persetujuan afirmatif Anda, situs web kami dapat menggunakan
                layanan pihak ketiga berikut:
              </p>
              <ul>
                <li>
                  <strong className="text-foreground">Google Tag Manager (GTM):</strong> Berfungsi
                  sebagai pengelola kontainer tag teknis untuk memfasilitasi integrasi analitik secara
                  terpusat tanpa memuat skrip tidak sah ke dalam aplikasi.
                </li>
                <li>
                  <strong className="text-foreground">Meta Pixel (Meta Ads):</strong> Digunakan
                  untuk mengukur efektivitas kampanye promosi perumahan kami di platform Meta
                  (Instagram &amp; Facebook) dan membantu kami menampilkan informasi properti yang
                  relevan kepada calon pembeli rumah di Yogyakarta.
                </li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">4. Data yang Tidak Dikumpulkan (Zero PII)</h2>
              <p>
                Kami menerapkan standar integritas data yang ketat:
              </p>
              <ul>
                <li>
                  Kami <strong className="text-foreground">tidak mengirimkan Personally Identifiable Information (PII)</strong>,
                  seperti nomor telepon pribadi, nama lengkap, atau isi pesan WhatsApp Anda ke dalam sistem pelacakan dataLayer atau Meta Pixel.
                </li>
                <li>
                  Event klik tautan WhatsApp hanya mencatat interaksi klik pada tombol rujukan keluar
                  (<em className="italic">outbound CTA click</em>) untuk keperluan statistik minat dan bukan merupakan bukti percakapan yang dimulai.
                </li>
                <li>
                  Data harga properti berstatus <em>Coming Soon</em> atau bernilai tidak valid secara otomatis disanitasi dan tidak dikirimkan ke server periklanan.
                </li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold">5. Hak Anda &amp; Pencabutan Persetujuan</h2>
              <p>
                Anda berhak mengubah atau mencabut persetujuan pelacakan kapan saja. Ketika Anda
                mencabut persetujuan melalui panel di bawah ini:
              </p>
              <ol>
                <li>Status penyimpanan browser Anda langsung diubah menjadi ditolak (<em>denied</em>).</li>
                <li>Sistem runtime kami secara otomatis memblokir seluruh pengiriman event pelacakan selanjutnya.</li>
                <li>Situs berupaya menghapus cookie pelacakan pihak pertama yang tersimpan di browser Anda (seperti <code>_fbp</code> dan <code>_fbc</code>).</li>
              </ol>
            </section>

            {/* Interactive Preference Panel */}
            <div className="mt-10 not-prose">
              <ConsentPreferencePanel />
            </div>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold">6. Hubungi Kami</h2>
              <p>
                Apabila Anda memiliki pertanyaan, klarifikasi, atau permohonan seputar
                kebijakan privasi dan pengelolaan data Titik Huni, silakan hubungi tim kami melalui:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-surface p-5 not-prose">
                <p className="text-sm font-semibold text-foreground">
                  {siteConfig.organization.name}
                </p>
                <p className="mt-1 text-xs text-foreground-muted">
                  Jl. Gondang Legi, Wedomartani, Kec. Ngemplak, Kabupaten Sleman, D.I. Yogyakarta 55584
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs">
                  <a
                    href={`mailto:${siteConfig.organization.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {siteConfig.organization.email}
                  </a>
                  <span className="text-border-strong">·</span>
                  <span className="text-foreground-soft">
                    WhatsApp: 0851 9080 0168
                  </span>
                </div>
              </div>
            </section>
          </article>

          {/* Quick Info Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <h3 className="text-sm font-semibold text-foreground">
                Ringkasan Prinsip Privasi
              </h3>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-foreground-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span><strong>Strict Opt-In:</strong> Nol pelacakan sebelum persetujuan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span><strong>Zero PII:</strong> Nomor telepon dan pesan pengguna tidak dikirim ke analitik.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span><strong>Kontrol Penuh:</strong> Cabut izin kapan pun melalui panel preferensi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span><strong>Isolasi Admin:</strong> Rute administrasi internal bebas dari tag pemasaran.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
