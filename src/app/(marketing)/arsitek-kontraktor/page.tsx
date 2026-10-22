import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  HardHat,
  Instagram,
  KeyRound,
  MessageCircle,
  PenTool,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { HomeGallery } from "@/components/marketing/home/HomeSections";
import { ScrollReveal } from "@/components/ScrollReveal";

export const revalidate = 3600; // ISR 1 hour cache for high performance & edge delivery

const pageUrl = `${siteConfig.url}/arsitek-kontraktor`;
const pageTitle = "Jasa Arsitek & Kontraktor Rumah Jogja | Titik Huni";
const pageDescription =
  "Jasa arsitek dan kontraktor rumah terintegrasi di Yogyakarta. Layanan desain rumah modern hingga pembangunan berkualitas dengan transparansi biaya.";
const ogImage = `${siteConfig.url}/assets/images/rumah-bangunjiwo-2.jpg`;

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  keywords: [
    "jasa arsitek jogja",
    "kontraktor rumah jogja",
    "jasa bangun rumah jogja",
    "desain rumah jogja",
    "arsitek rumah minimalis jogja",
    "kontraktor rumah yogyakarta",
    "bangun rumah di lahan sendiri jogja",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 800,
        alt: "Jasa Arsitek dan Kontraktor Rumah Jogja - Titik Huni",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage],
  },
};

const steps = [
  {
    step: "01",
    icon: PenTool,
    title: "Konsultasi & Konsep Desain",
    description:
      "Kami memahami kebutuhan ruang, preferensi desain, dan anggaran untuk menyusun konsep serta visualisasi 3D.",
  },
  {
    step: "02",
    icon: FileText,
    title: "Gambar Kerja & RAB",
    description:
      "Penyusunan gambar teknis, spesifikasi material, dan Rencana Anggaran Biaya (RAB) sebagai acuan pembangunan.",
  },
  {
    step: "03",
    icon: HardHat,
    title: "Konstruksi & Pengawasan",
    description:
      "Pelaksanaan pembangunan dengan pengawasan berkala untuk menjaga kesesuaian desain, material, dan kualitas pekerjaan.",
  },
  {
    step: "04",
    icon: KeyRound,
    title: "Pemeriksaan & Serah Terima",
    description:
      "Pemeriksaan hasil pekerjaan bersama klien sebelum serah terima, dilanjutkan masa pemeliharaan sesuai kesepakatan.",
  },
];

const pillars = [
  {
    icon: CheckCircle2,
    title: "Satu Tim Terintegrasi",
    description:
      "Layanan desain hingga konstruksi dikoordinasikan dalam satu tim untuk menjaga kesesuaian perencanaan dan pelaksanaan.",
  },
  {
    icon: ShieldCheck,
    title: "Perencanaan Biaya Transparan",
    description:
      "Rincian material, pekerjaan, dan estimasi biaya disusun melalui RAB sebagai acuan anggaran pembangunan.",
  },
  {
    icon: Ruler,
    title: "Desain Berorientasi Fungsi",
    description:
      "Mengutamakan tata ruang fungsional, pencahayaan alami, dan sirkulasi udara sesuai kebutuhan penghuni.",
  },
];

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya berminat menggunakan jasa arsitek dan kontraktor untuk membangun rumah di Yogyakarta."
)}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/arsitek-kontraktor#service`,
      name: "Jasa Arsitek dan Kontraktor Titik Huni",
      description:
        "Layanan arsitek dan kontraktor terintegrasi di Yogyakarta. Perencanaan konsep, gambar kerja, RAB transparan, hingga pelaksanaan pembangunan rumah.",
      url: `${siteConfig.url}/arsitek-kontraktor`,
      telephone: siteConfig.organization.telephone,
      image: `${siteConfig.url}/assets/images/rumah-bangunjiwo-bantul.jpg`,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Yogyakarta",
        addressRegion: "Daerah Istimewa Yogyakarta",
        addressCountry: "ID",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Daerah Istimewa Yogyakarta",
      },
      provider: {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.organization.name,
        url: siteConfig.url,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.url}/arsitek-kontraktor#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Jasa Arsitek & Kontraktor",
          item: `${siteConfig.url}/arsitek-kontraktor`,
        },
      ],
    },
  ],
};

export default function ArsitekKontraktorPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen font-sans text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="home-content-canvas min-h-screen">
        {/* ========================================================
            1. HERO SECTION
            ======================================================== */}
        <section
          aria-labelledby="hero-title"
          className="pb-10 pt-[calc(var(--header-height)+1.25rem)] sm:pb-12 md:pt-[calc(var(--header-height)+1.75rem)] md:pb-16"
        >
          <div className="site-container">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-5 text-xs text-foreground-soft sm:mb-6">
              <ol className="flex items-center gap-1.5 sm:gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-primary focus-visible:outline-hidden"
                  >
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border-strong">
                  <ChevronRight size={13} className="opacity-60" />
                </li>
                <li aria-current="page" className="font-medium text-foreground">
                  Jasa Arsitek &amp; Kontraktor
                </li>
              </ol>
            </nav>

            <ScrollReveal>
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Titik Huni Studio · Yogyakarta</span>
                  </div>

                  <h1
                    id="hero-title"
                    className="mt-3.5 text-balance text-[clamp(2.25rem,4.5vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground"
                  >
                    Rancang dengan matang.{" "}
                    <span className="text-primary">Bangun dengan tepat.</span>
                  </h1>

                  <p className="mt-4 text-pretty text-base leading-relaxed text-foreground-muted sm:text-[1.0625rem]">
                    Titik Huni Studio menyediakan layanan desain arsitektur dan konstruksi rumah tinggal di Yogyakarta. Kami membantu mewujudkan kebutuhan ruang melalui perencanaan desain, anggaran yang terukur, dan pelaksanaan pembangunan yang terarah.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-button-primary group/cta w-full sm:w-auto"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      <span>Konsultasi via WhatsApp</span>
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                    <a href="#layanan" className="site-link-editorial group/link text-sm font-medium">
                      <span>Pelajari Layanan Kami</span>
                      <ArrowRight size={15} className="transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/80 bg-surface-muted shadow-[0_16px_40px_-20px_rgba(35,68,56,0.12)] sm:aspect-[16/10] sm:rounded-3xl lg:aspect-[4/3]">
                    <Image
                      src="/assets/images/rumah-bangunjiwo-2.jpg"
                      alt="Proses desain dan bangun rumah modern Titik Huni di Yogyakarta"
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
                      aria-hidden="true"
                    />
                    <figcaption className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/50 px-3.5 py-2 text-white shadow-xs backdrop-blur-md sm:px-4 sm:py-2.5">
                      <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      <p className="text-xs font-medium tracking-wide text-white/95 sm:text-sm">
                        Titik Huni Studio Arsitektur &amp; Konstruksi
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================
            4. PORTFOLIO SHOWCASE
            ======================================================== */}
        <section aria-labelledby="gallery-title" className="pb-12 sm:pb-16 md:pb-20">
          <HomeGallery />
        </section>

        {/* ========================================================
            2. VALUE PROPOSITIONS / PILLARS
            ======================================================== */}
        <section
          id="layanan"
          aria-labelledby="pillars-title"
          className="scroll-mt-24 py-10 sm:py-12 md:py-16"
        >
          <div className="site-container">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>Keunggulan Layanan</span>
                </div>
                <h2
                  id="pillars-title"
                  className="mt-3 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.12]"
                >
                  Mengapa memilih <span className="text-primary">Titik Huni Studio?</span>
                </h2>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                  Kami menggabungkan perencanaan desain, anggaran, dan pelaksanaan konstruksi dalam proses kerja yang terarah dan transparan.
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6 sm:mt-10">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="group flex flex-col justify-start rounded-2xl border border-[#D5E2D7] bg-[#F4F7F4] p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-2xs transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <pillar.icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-base font-medium tracking-tight text-foreground sm:text-[17px]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================
            3. WORKFLOW / CARA KERJA
            ======================================================== */}
        <section id="cara-kerja" className="scroll-mt-24 py-10 sm:py-12 md:py-16">
          <div className="site-container">
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
                <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Alur Kerja Kami</span>
                  </div>

                  <h2 className="mt-3 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.12]">
                    Proses terencana di{" "}
                    <span className="text-primary">setiap tahap.</span>
                  </h2>

                  <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                    Dari konsultasi awal hingga serah terima bangunan, setiap tahap dikerjakan berdasarkan perencanaan, koordinasi, dan pengawasan yang terarah.
                  </p>

                  <div className="mt-7">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-button-primary group/btn w-full justify-between sm:w-auto"
                    >
                      <span>Mulai Diskusi Proyek</span>
                      <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="relative ml-3 space-y-6 border-l-2 border-[#CFDDD1] pl-6 sm:ml-5 sm:space-y-7 sm:pl-8">
                    {steps.map((step) => (
                      <div key={step.title} className="group relative">
                        {/* Timeline Node Icon */}
                        <span className="absolute -left-[2.15rem] sm:-left-[2.75rem] top-2 flex size-8 items-center justify-center rounded-xl border border-[#CFDDD1] bg-white text-primary shadow-2xs transition-colors duration-300 group-hover:bg-primary group-hover:text-white sm:size-9">
                          <step.icon size={16} strokeWidth={1.8} aria-hidden="true" />
                        </span>

                        {/* Step Card Content */}
                        <div className="rounded-2xl border border-[#D5E2D7] bg-[#F4F7F4] p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-sm sm:p-6">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base font-medium tracking-tight text-foreground sm:text-[17px]">
                              {step.title}
                            </h3>
                            <span className="shrink-0 inline-flex items-center justify-center rounded-lg border border-primary/25 bg-white px-3 py-1 font-sans text-sm sm:text-[15px] font-bold tabular-nums text-primary shadow-2xs">
                              {step.step}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================
            5. BOTTOM CTA
            ======================================================== */}
        <section className="scroll-mt-24 pt-4 pb-14 sm:pt-6 sm:pb-18 md:pt-8 md:pb-22">
          <div className="site-container">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-[#CFDDD1] bg-[#F1F6F2] p-7 sm:p-10 md:p-12 lg:p-14 shadow-xs">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span>Konsultasi &amp; Perencanaan</span>
                    </div>

                    <h2 className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.15]">
                      Mari rencanakan rumah impian Anda.
                    </h2>

                    <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base sm:leading-7">
                      Konsultasikan lahan, kebutuhan ruang, dan perkiraan budget Anda bersama tim arsitek Titik Huni tanpa komitmen awal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3.5 sm:flex-row lg:col-span-5 lg:flex-col lg:justify-center">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta-location="service_arsitek_kontraktor"
                      className="site-button-primary group/cta w-full justify-center py-3.5 text-[15px] font-medium shadow-xs hover:shadow-md transition-all"
                    >
                      <MessageCircle size={17} aria-hidden="true" />
                      <span>Hubungi via WhatsApp</span>
                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                      />
                    </a>

                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-button-secondary group/cta w-full justify-center border-black/10 bg-white py-3.5 text-[15px] font-medium shadow-2xs hover:border-primary hover:text-primary hover:bg-white transition-all"
                    >
                      <Instagram size={16} aria-hidden="true" />
                      <span>Instagram Titik Huni</span>
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </main>
  );
}
