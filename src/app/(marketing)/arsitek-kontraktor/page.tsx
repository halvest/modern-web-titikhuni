import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title:
    "Arsitek & Kontraktor Rumah Jogja | Jasa Desain & Bangun Rumah - Titik Huni",
  description:
    "Titik Huni menyediakan jasa arsitek dan kontraktor rumah di Yogyakarta. Layanan desain rumah minimalis modern hingga pembangunan rumah dengan kualitas terbaik.",
  keywords: [
    "arsitek rumah jogja",
    "kontraktor rumah jogja",
    "jasa desain rumah jogja",
    "bangun rumah jogja",
    "arsitek minimalis jogja",
    "kontraktor rumah yogyakarta",
  ],
  alternates: {
    canonical: "https://titikhuni.id/arsitek-kontraktor",
  },
};

const services = [
  {
    title: "Desain Arsitektur",
    description:
      "Perancangan rumah dengan pendekatan arsitektur minimalis modern yang mempertimbangkan fungsi ruang, pencahayaan alami, dan kenyamanan hunian.",
  },
  {
    title: "Perencanaan Bangunan",
    description:
      "Penyusunan gambar kerja, perencanaan struktur, serta estimasi biaya pembangunan untuk memastikan proses pembangunan berjalan dengan baik.",
  },
  {
    title: "Konstruksi Rumah",
    description:
      "Pelaksanaan pembangunan rumah dengan pengawasan kualitas konstruksi agar hasil akhir sesuai dengan desain dan standar pembangunan yang baik.",
  },
];

const process = [
  {
    title: "Memahami kebutuhan",
    description:
      "Proses dimulai dengan kebutuhan ruang, kondisi lahan, dan konteks kehidupan sehari-hari Anda.",
  },
  {
    title: "Merancang dengan matang",
    description:
      "Desain, gambar kerja, struktur, dan estimasi biaya disusun sebagai dasar pembangunan yang jelas.",
  },
  {
    title: "Membangun & mengawasi",
    description:
      "Pembangunan dilaksanakan dengan pengawasan kualitas agar hasilnya tetap selaras dengan rancangan.",
  },
];

const reasons = [
  "Pendekatan desain yang sederhana dan fungsional",
  "Material yang dipilih secara jujur dan berkualitas",
  "Proses desain hingga pembangunan yang terintegrasi",
  "Fokus pada kualitas ruang dan kenyamanan hunian",
];

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(/\D/g, "")}?text=${encodeURIComponent("Halo Titik Huni, saya ingin konsultasi desain dan pembangunan rumah di Yogyakarta.")}`;

export default function ArsitekKontraktorPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface text-foreground">
      <div className="home-content-canvas min-h-screen">
        <section
          aria-labelledby="service-title"
          className="pb-12 pt-[calc(var(--header-height)+1rem)] sm:pb-14 md:pt-[calc(var(--header-height)+1.5rem)] md:pb-16"
        >
          <div className="site-container">
            <nav aria-label="Breadcrumb" className="mb-3.5 text-xs text-foreground-soft sm:mb-4">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="underline-offset-4 hover:text-primary hover:underline">Beranda</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">Arsitek &amp; Kontraktor</li>
              </ol>
            </nav>

            <header className="flex flex-col justify-between gap-5 border-b border-border/80 pb-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="site-eyebrow text-primary before:bg-primary">Arsitek &amp; Kontraktor · Yogyakarta</p>
                <h1
                  id="service-title"
                  className="mt-2 text-balance text-[clamp(2.15rem,4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em]"
                >
                  Desain dan pembangunan rumah <span className="text-primary">dalam satu alur.</span>
                </h1>
              </div>
              <div className="max-w-md lg:text-right">
                <p className="text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                  Wujudkan rumah dengan perencanaan ruang, desain, dan pelaksanaan yang terhubung dari awal.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Konsultasi proyek
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </header>

            <div className="mt-6 grid overflow-hidden rounded-[1.25rem] border border-border/80 bg-white lg:grid-cols-2">
              <figure className="relative m-0 aspect-[4/3] overflow-hidden bg-surface-muted lg:aspect-auto lg:min-h-[26rem]">
                <Image
                  src="/assets/images/rumah-bangunjiwo-2.jpg"
                  alt="Fasad rumah modern rancangan Titik Huni"
                  fill
                  preload
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm leading-6 text-white sm:p-7">
                  Desain dan pembangunan rumah di Yogyakarta
                </figcaption>
              </figure>
              <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Dari gagasan hingga menjadi ruang</p>
                <h2 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                  Rumah dirancang untuk kehidupan sehari-hari.
                </h2>
                <div className="mt-4 max-w-xl space-y-3 text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                  <p>
                    Kami membantu merancang dan membangun rumah dengan mempertimbangkan kebutuhan ruang, pencahayaan alami, sirkulasi udara, serta hubungan rumah dengan lingkungan sekitarnya.
                  </p>
                  <p>
                    Mulai dari desain rumah minimalis modern, gambar kerja, dan perencanaan biaya hingga pembangunan dengan pengawasan kualitas.
                  </p>
                </div>
                <ul className="mt-6 grid gap-2 border-t border-border pt-5 text-sm font-medium text-foreground sm:grid-cols-2">
                  {["Desain arsitektur", "Perencanaan bangunan", "Konstruksi rumah", "Konsultasi di Yogyakarta"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={15} className="shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="services-title" className="border-y border-border/80 bg-white py-12 sm:py-14 md:py-16">
          <div className="site-container">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Layanan kami</p>
                <h2 id="services-title" className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Tiga tahap, satu visi.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7 md:text-right">
                Setiap keputusan desain tetap terjaga hingga tahap pembangunan.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {services.map((service, index) => (
                <article key={service.title} className="flex min-w-0 flex-col rounded-[1.25rem] border border-border/80 bg-surface p-5 sm:p-6">
                  <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                  <h3 className="mt-5 text-xl font-medium leading-tight tracking-[-0.025em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-foreground-muted">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="process-title" className="py-12 sm:py-14 md:py-16">
          <div className="site-container grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            <div className="max-w-lg">
              <p className="site-eyebrow text-primary before:bg-primary">Alur kolaborasi</p>
              <h2 id="process-title" className="mt-2 text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                Proses yang jelas dari awal.
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                Kebutuhan, rancangan, dan pelaksanaan berjalan berurutan agar Anda tahu apa yang dikerjakan di setiap tahap.
              </p>
            </div>
            <ol className="overflow-hidden rounded-[1.25rem] border border-border/80 bg-white">
              {process.map((step, index) => (
                <li key={step.title} className="grid gap-3 border-b border-border/80 p-5 last:border-b-0 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:p-6">
                  <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.02em]">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="reasons-title" className="bg-white py-12 sm:py-14 md:py-16">
          <div className="site-container grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            <div className="max-w-lg">
              <p className="site-eyebrow text-primary before:bg-primary">Mengapa Titik Huni</p>
              <h2 id="reasons-title" className="mt-2 text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                Rumah yang nyaman dimulai dari keputusan yang tepat.
              </h2>
            </div>
            <ul className="divide-y divide-border/80 border-y border-border/80">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-3 py-4 text-sm font-medium leading-6 text-foreground sm:py-5 sm:text-base">
                  <Check size={17} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="service-contact-title" className="py-12 sm:py-14 md:py-16">
          <div className="site-container">
            <div className="grid gap-6 rounded-[1.25rem] bg-primary p-6 text-white sm:p-8 md:grid-cols-[1fr_auto] md:items-end md:p-10">
              <div>
                <p className="site-eyebrow text-white/70 before:bg-white">Mulai proyek Anda</p>
                <h2 id="service-contact-title" className="mt-3 max-w-3xl text-balance text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl md:text-4xl">
                  Konsultasikan rumah impian Anda.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
                  Hubungi kami untuk konsultasi desain dan pembangunan rumah di Yogyakarta bersama tim Titik Huni.
                </p>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface">
                <MessageCircle size={17} aria-hidden="true" />
                Konsultasi sekarang
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
