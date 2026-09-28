import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";
import type { CatalogUnit } from "./unit-card";

export function CatalogSections({
  units,
  whatsappUrl,
  dataUnavailable,
}: {
  units: CatalogUnit[];
  whatsappUrl: string;
  dataUnavailable: boolean;
}) {
  const available = units.filter((unit) => unit.status === "Tersedia");
  const prices = available
    .map((unit) => Number(unit.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  const minimumPrice = prices.length ? Math.min(...prices) : null;

  const faqs = [
    {
      question: "Berapa harga mulai rumah Titik Huni di Yogyakarta?",
      answer:
        minimumPrice !== null
          ? `Harga mulai terendah yang tercantum untuk unit berstatus Tersedia di katalog ini adalah ${formatRupiah(
              minimumPrice
            )}. Angka tersebut berasal dari katalog Titik Huni, bukan gambaran harga seluruh pasar Yogyakarta. Harga akhir mengikuti pilihan unit dan rincian yang dikonfirmasi tim.`
          : "Harga unit yang tersedia belum dapat dirangkum dari katalog saat ini. Hubungi tim Titik Huni untuk meminta harga unit yang Anda minati.",
    },
    {
      question: "Bagaimana mencari rumah di Sleman atau Bantul?",
      answer:
        "Gunakan filter wilayah di atas untuk memilah pilihan di Sleman maupun Bantul. Setiap kartu menampilkan detail kecamatan dan kelurahan; buka halaman detail rumah untuk memastikan aksesibilitas dan lingkungan sekitar.",
    },
    {
      question: "Apa arti KT, KM, LT, LB, dan Carport pada kartu?",
      answer:
        "KT adalah jumlah kamar tidur, KM kamar mandi, LT luas tanah, dan LB luas bangunan dalam meter persegi. Angka carport menunjukkan kapasitas parkir kendaraan. Pada status Coming Soon, spesifikasi detail akan dirilis bertahap.",
    },
    {
      question: "Apakah semua rumah di halaman ini masih tersedia?",
      answer:
        "Perhatikan label status di setiap kartu. Tersedia berarti unit aktif dan siap dikonfirmasi jadwal kunjungannya. Dipesan dan Terjual menandai status transaksi terkini. Coming Soon menandai proyek mendatang yang sedang dalam proses persiapan.",
    },
    {
      question: "Bagaimana menjadwalkan kunjungan dan menanyakan pembayaran?",
      answer:
        "Hubungi tim Titik Huni melalui WhatsApp, sebutkan nama rumah atau wilayah yang diminati. Tim kami akan mengonfirmasi ketersediaan terkini, skema pembayaran, serta mendampingi survei lokasi secara privat.",
    },
  ];

  return (
    <>
      {/* ========================================================
          1. PANDUAN PEMILIHAN (COMPACT EDITORIAL SPREAD)
          ======================================================== */}
      <section
        id="panduan"
        aria-labelledby="comparison-title"
        className="scroll-mt-[var(--header-height)] border-t border-border/80 py-12 md:py-16 lg:py-20"
      >
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="site-eyebrow text-primary before:bg-primary">
              Panduan Memilih
            </p>
            <h2
              id="comparison-title"
              className="mt-3 text-balance text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em] text-foreground"
            >
              Bandingkan rumah dengan{" "}
              <span className="text-primary">informasi yang relevan.</span>
            </h2>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 md:mt-10">
            {[
              {
                number: "01",
                title: "Sesuaikan kebutuhan ruang",
                body: "Perhatikan perbandingan luas tanah, luas bangunan, jumlah kamar, dan orientasi cahaya. Luas yang sama dapat menghadirkan pengalaman hidup yang sangat berbeda tergantung perancangan tata ruangnya.",
              },
              {
                number: "02",
                title: "Pahami struktur harga mulai",
                body: "Gunakan harga awal pada kartu sebagai acuan. Diskusikan rincian spesifikasi, kelengkapan material, dan tahapan pembayaran secara transparan bersama tim kami sebelum mengambil keputusan.",
              },
              {
                number: "03",
                title: "Rasakan suasana lokasi langsung",
                body: "Jadwalkan survei ke lokasi untuk merasakan ketenangan lingkungan, aksesibilitas harian, sirkulasi angin alami, dan kualitas pengerjaan konstruksi arsitektural di lapangan.",
              },
            ].map(({ number, title, body }) => (
              <div
                key={number}
                className="border-t border-border/80 pt-5 flex flex-col"
              >
                <span className="font-mono text-xl font-light text-primary/40 sm:text-2xl mb-2">
                  {number}
                </span>
                <h3 className="text-lg font-medium tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-[1.7] text-foreground-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-sm leading-6 text-foreground-muted">
              Pelajari filosofi desain dan rekam jejak pembangunan Titik Huni di Yogyakarta.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
              <Link
                href="/tentang-kami"
                className="site-link-editorial group inline-flex items-center gap-1.5"
              >
                <span>Tentang Titik Huni</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/proyek"
                className="site-link-editorial group inline-flex items-center gap-1.5"
              >
                <span>Lihat Proyek Selesai</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FAQ ACCORDION (POLISHED & ACCESSIBLE)
          ======================================================== */}
      <section
        id="tanya-jawab"
        aria-labelledby="catalog-faq-title"
        className="scroll-mt-[var(--header-height)] border-t border-border/80 py-12 md:py-16 lg:py-20"
      >
        <div className="site-container grid gap-8 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          <div className="lg:col-span-4">
            <p className="site-eyebrow text-primary before:bg-primary">
              Informasi Katalog
            </p>
            <h2
              id="catalog-faq-title"
              className="mt-3 text-balance text-[clamp(1.75rem,2.8vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.04em] text-foreground"
            >
              Pertanyaan tentang <span className="text-primary">katalog rumah.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
              Jawaban ringkas untuk mempermudah eksplorasi pilihan hunian dan persiapan konsultasi Anda.
            </p>
          </div>

          <div className="border-t border-border/80 lg:col-span-8">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group border-b border-border/80 transition-colors"
              >
                <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[15px] font-medium leading-snug text-foreground focus-visible:outline-2 focus-visible:outline-primary sm:text-base [&::-webkit-details-marker]:hidden">
                  <span>{question}</span>
                  <Plus
                    size={17}
                    className="shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-2xl pb-5 pr-6 text-sm leading-[1.75] text-foreground-muted">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FINAL CTA — HOMECONTACT DESIGN SYSTEM
          ======================================================== */}
      <section
        aria-labelledby="catalog-contact-title"
        className="relative py-12 md:py-16 lg:py-20"
      >
        <div className="site-container">
          <div className="grid items-center gap-6 rounded-[1.75rem] bg-primary p-7 sm:p-9 md:p-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:p-14 text-white shadow-[0_20px_50px_-25px_rgba(35,68,56,0.22)]">
            <div>
              <p className="site-eyebrow text-white/70 before:bg-white/70">
                Konsultasi &amp; Kunjungan
              </p>

              <h2
                id="catalog-contact-title"
                className="mt-3.5 text-balance text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.04em] text-white"
              >
                Sudah menemukan rumah yang ingin Anda lihat?
              </h2>

              <p className="mt-3.5 max-w-lg text-pretty text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                Sampaikan nama unit, kebutuhan tata ruang, dan kisaran anggaran Anda. Tim Titik Huni akan mengonfirmasi ketersediaan serta mendampingi jadwal kunjungan lokasi.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-catalog-cta="consultation-bottom"
                className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-[11px] bg-white px-6 py-3 text-[14px] font-medium text-primary transition-all duration-300 hover:bg-[#FAFCF9] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full sm:w-auto"
              >
                <MessageCircle size={16} aria-hidden="true" />
                <span>Diskusikan Pilihan Rumah</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <p className="text-xs text-white/60">
                Konsultasi langsung dengan tim pengembangan Titik Huni.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
