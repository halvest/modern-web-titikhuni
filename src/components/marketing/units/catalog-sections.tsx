import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Layers3,
  MapPin,
  MessageCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import type { CatalogUnit } from "./unit-card";
import { ScrollReveal } from "@/components/ScrollReveal";

export function CatalogSections({
  units: _units,
  whatsappUrl,
  dataUnavailable: _dataUnavailable,
}: {
  units: CatalogUnit[];
  whatsappUrl: string;
  dataUnavailable: boolean;
}) {
  const faqs = [
    {
      question: "Berapa harga rumah Titik Huni di Yogyakarta?",
      answer:
        "Harga rumah Titik Huni mulai dari Rp500 jutaan, tergantung lokasi, luas tanah, bangunan, dan spesifikasi masing-masing unit.",
    },
    {
      question: "Di mana lokasi perumahan Titik Huni?",
      answer:
        "Hunian Titik Huni dikembangkan di wilayah Yogyakarta. Detail lokasi dan pilihan unit dapat dilihat pada katalog hunian.",
    },
    {
      question: "Apakah rumah tersedia siap huni atau inden?",
      answer:
        "Kami menyediakan pilihan rumah siap huni dan inden sesuai ketersediaan proyek. Status setiap unit dapat dikonfirmasi melalui tim Titik Huni.",
    },
    {
      question: "Bagaimana legalitas rumah Titik Huni?",
      answer:
        "Informasi legalitas, termasuk status SHM dan PBG, dapat diperiksa berdasarkan dokumen dan tahapan masing-masing proyek sebelum pembelian.",
    },
    {
      question: "Bagaimana cara survei lokasi dan melakukan pembelian?",
      answer:
        "Hubungi tim Titik Huni melalui WhatsApp untuk menanyakan ketersediaan unit, menjadwalkan survei, serta mendapatkan informasi harga dan skema pembayaran.",
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
        className="scroll-mt-24 py-10 sm:py-12 md:py-16"
      >
        <div className="site-container">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>Panduan Memilih</span>
              </div>
              <h2
                id="comparison-title"
                className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.12]"
              >
                Temukan rumah yang{" "}
                <span className="text-primary">sesuai kebutuhan Anda.</span>
              </h2>
            </div>

            <div className="mt-7 grid grid-cols-1 items-stretch gap-5 sm:mt-8 md:grid-cols-3 md:gap-6">
              {[
                {
                  icon: Layers3,
                  title: "Sesuaikan Kebutuhan Ruang",
                  body: "Perhatikan luas tanah, bangunan, jumlah kamar, dan tata ruang yang mendukung aktivitas sehari-hari.",
                },
                {
                  icon: ShieldCheck,
                  title: "Pahami Harga & Spesifikasi",
                  body: "Bandingkan harga, spesifikasi bangunan, legalitas, dan skema pembayaran sebelum memutuskan.",
                },
                {
                  icon: MapPin,
                  title: "Kunjungi Lokasi",
                  body: "Lihat langsung lingkungan, akses, kenyamanan ruang, dan kualitas bangunan.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="group relative flex h-full flex-col justify-start rounded-2xl border border-[#D5E2D7] bg-[#F4F7F4] p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-2xs transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={19} aria-hidden="true" />
                  </div>

                  <h3 className="mt-4 text-base font-medium tracking-tight text-foreground sm:text-[17px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-[#D5E2D7] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-sm leading-6 text-foreground-muted">
                Kenali pendekatan desain dan proyek yang telah dikembangkan Titik Huni.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
                <Link
                  href="/tentang-kami"
                  className="site-link-editorial group inline-flex items-center gap-1.5"
                >
                  <span>Tentang Titik Huni</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <span className="hidden text-border sm:inline" aria-hidden="true">|</span>
                <Link
                  href="/proyek"
                  className="site-link-editorial group inline-flex items-center gap-1.5"
                >
                  <span>Lihat Proyek Selesai</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          2. FAQ ACCORDION (POLISHED & ACCESSIBLE)
          ======================================================== */}
      <section
        id="tanya-jawab"
        aria-labelledby="catalog-faq-title"
        className="scroll-mt-24 py-10 sm:py-12 md:py-16"
      >
        <div className="site-container">
          <ScrollReveal>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14 xl:gap-16">
              <div className="lg:col-span-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>Informasi Katalog</span>
                </div>
                <h2
                  id="catalog-faq-title"
                  className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.12]"
                >
                  Pertanyaan Seputar <span className="text-primary">Hunian</span>
                </h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                  Informasi singkat untuk membantu Anda memilih hunian yang sesuai kebutuhan.
                </p>
              </div>

              <div className="border-t border-[#D5E2D7] lg:col-span-8">
                {faqs.map(({ question, answer }, index) => (
                  <details
                    key={question}
                    className="group border-b border-[#D5E2D7] transition-colors"
                  >
                    <summary className="flex min-h-[58px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary focus-visible:outline-2 focus-visible:outline-primary sm:text-base [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="font-sans font-bold tabular-nums text-primary mr-2.5">
                          {index + 1}.
                        </span>
                        {question}
                      </span>
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
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          3. KONSULTASI & KUNJUNGAN (FINAL CTA)
          ======================================================== */}
      <section
        id="konsultasi"
        aria-labelledby="catalog-contact-title"
        className="scroll-mt-24 pt-6 pb-14 sm:pt-8 sm:pb-18 md:pt-10 md:pb-22"
      >
        <div className="site-container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-[#CFDDD1] bg-[#F1F6F2] p-7 sm:p-10 md:p-12 lg:p-14 shadow-xs">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Konsultasi &amp; Kunjungan</span>
                  </div>

                  <h2
                    id="catalog-contact-title"
                    className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.15]"
                  >
                    Temukan rumah yang tepat untuk Anda.
                  </h2>

                  <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base sm:leading-7">
                    Tertarik dengan salah satu hunian Titik Huni? Hubungi tim kami untuk informasi ketersediaan unit, harga, dan jadwal kunjungan lokasi.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3.5 sm:items-stretch lg:col-span-5 lg:items-end">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-catalog-cta="consultation-bottom"
                    className="site-button-primary group/cta w-full justify-center py-3.5 text-[15px] font-medium shadow-xs hover:shadow-md transition-all sm:w-auto"
                  >
                    <MessageCircle size={17} aria-hidden="true" />
                    <span>Konsultasi &amp; Jadwalkan Kunjungan</span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                    />
                  </a>

                  <p className="text-xs text-foreground-muted sm:text-center lg:text-right">
                    Konsultasikan pilihan hunian Anda bersama tim Titik Huni.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
