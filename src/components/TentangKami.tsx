import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Instagram, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getPublishedProjects } from "@/lib/projects";
import { ScrollReveal } from "@/components/ScrollReveal";

const principles = [
  {
    num: "01",
    title: "Desain yang sederhana dan jujur pada material.",
    desc: "Menghargai karakter asli bahan, proporsi ruang yang fungsional, dan meniadakan elemen ornamen yang tidak esensial.",
  },
  {
    num: "02",
    title: "Ruang yang menghadirkan hidup lebih tenang dan cukup.",
    desc: "Mengoptimalkan pencahayaan alami dan sirkulasi silang agar rumah terasa lapang, sejuk, dan membumi untuk ditinggali.",
  },
  {
    num: "03",
    title: "Hunian yang terkurasi, bukan pembangunan massal.",
    desc: "Setiap hunian dikembangkan secara terbatas untuk menjaga kualitas detail konstruksi dan karakter arsitektural yang abadi.",
  },
];

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya ingin konsultasi mengenai hunian, desain rumah, atau pembangunan rumah di Yogyakarta."
)}`;

export async function TentangKami() {
  const { projects } = await getPublishedProjects();
  const featuredProject = projects?.[0];

  return (
    <div className="relative text-foreground">
      {/* Background Architectural Grid Accent (consistent with HomeAbout) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] opacity-35 lg:block"
        aria-hidden="true"
      >
        <div className="architectural-grid h-full w-full" />
      </div>

      {/* ========================================================
          1. HERO — UNIFIED COMPACT EDITORIAL HEADER
          ======================================================== */}
      <section
        className="relative pt-[calc(var(--header-height)+1rem)] pb-12 sm:pb-16 md:pt-[calc(var(--header-height)+1.5rem)] md:pb-20"
        aria-labelledby="about-page-title"
      >
        <div className="site-container relative">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-3.5 text-xs text-foreground-soft sm:mb-4">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:text-primary hover:underline">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                Tentang Kami
              </li>
            </ol>
          </nav>

          {/* Compact Editorial Header (Unified in one frame) */}
          <header className="flex flex-col justify-between gap-5 border-b border-border/80 pb-7 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="site-eyebrow text-primary before:bg-primary">
                Developer Titik Huni · Yogyakarta
              </p>
              <h1
                id="about-page-title"
                className="mt-2 text-balance text-[clamp(2.15rem,4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em] text-foreground"
              >
                Hunian yang terasa <span className="text-primary">tepat.</span>
              </h1>
            </div>

            <div className="flex flex-col gap-3 lg:max-w-md lg:items-end lg:text-right">
              <p className="text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                Titik Huni menghadirkan hunian modern di Yogyakarta yang dirancang secara terbatas, mengedepankan fungsionalitas, sirkulasi, dan material jujur.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                Konsultasi Hunian <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </header>

          {/* Wide Hero Image Banner */}
          <div className="mt-8 md:mt-10 lg:mt-12">
            <figure className="group relative w-full overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] bg-surface-muted shadow-[0_20px_45px_-20px_rgba(35,68,56,0.15)] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src="/assets/images/konsep_titikhuni.webp"
                alt="Konsep arsitektur hunian Titik Huni dengan orientasi cahaya alami dan material jujur"
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 md:p-10">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Konsep Arsitektur · Yogyakarta
                </p>
                <p className="mt-2 text-lg font-medium leading-snug text-white/95 sm:text-xl md:text-2xl max-w-2xl">
                  Material alami, cahaya yang cukup, dan ruang tenang.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. PENDEKATAN — ONE VIEWPORT EDITORIAL SPREAD
          ======================================================== */}
      <section
        aria-labelledby="approach-title"
        className="relative border-t border-border/80 py-12 md:py-16 lg:py-0 lg:min-h-[85svh] flex flex-col justify-center"
      >
        <div className="site-container w-full my-auto py-4 sm:py-6 lg:py-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-16">
            {/* Left 5 cols: Architectural Imagery with Curvature & Overlay */}
            <div className="lg:col-span-5">
              <figure className="group relative aspect-[4/5] max-h-[48vh] xl:max-h-[54vh] w-full overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-[0_20px_45px_-20px_rgba(35,68,56,0.12)]">
                <Image
                  src="/assets/images/ruang-tamu-titikhuni.jpg"
                  alt="Interior ruang hunian Titik Huni dengan tata cahaya alami"
                  fill
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                    Interior &amp; Pencahayaan Alami
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-medium leading-snug text-white/95">
                    Orientasi bukaan terencana &amp; sirkulasi silang.
                  </p>
                </figcaption>
              </figure>
            </div>

            {/* Right 7 cols: Editorial Philosophy & Horizontal Density */}
            <ScrollReveal className="flex flex-col justify-center lg:col-span-7 lg:pl-4 xl:pl-8">
              <div>
                <p className="site-eyebrow text-primary before:bg-primary">
                  Pendekatan Desain
                </p>

                <h2
                  id="approach-title"
                  className="mt-3.5 text-balance text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.04em] text-foreground"
                >
                  Rumah modern yang dirancang untuk <span className="text-primary">kehidupan sehari-hari.</span>
                </h2>

                <div className="mt-4 border-t border-border/80 pt-4 md:mt-5 md:pt-5">
                  <div className="max-w-[540px] space-y-3 text-[0.95rem] md:text-[1rem] leading-[1.75] text-foreground-muted">
                    <p>
                      Setiap hunian Titik Huni dirancang dengan memperhatikan tata
                      ruang, pencahayaan alami, sirkulasi udara, pemilihan material,
                      serta hubungan antara ruang dalam dan lingkungan sekitarnya.
                    </p>
                    <p>
                      Kami mengembangkan rumah secara terbatas, bukan melalui
                      pembangunan massal. Pendekatan ini memberi kami ruang untuk
                      menghadirkan desain rumah yang lebih terukur, fungsional, dan
                      memiliki karakter yang tahan lama.
                    </p>
                  </div>
                </div>

                {/* Features highlight row (aligned with HomeServices style) */}
                <div className="mt-5 flex flex-wrap items-center gap-2 border-y border-border-strong/40 py-3 text-xs text-foreground-soft sm:gap-3 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Pencahayaan alami
                  </span>
                  <span className="text-border-strong">•</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Sirkulasi silang
                  </span>
                  <span className="text-border-strong">•</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Material jujur
                  </span>
                </div>

                <div className="mt-5">
                  <Link
                    href="/arsitek-kontraktor"
                    className="site-link-editorial group text-[14px] font-medium"
                  >
                    Pelajari layanan arsitek dan kontraktor Titik Huni
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. PRINSIP + QUOTE — ONE VIEWPORT INTEGRATED SPREAD
          ======================================================== */}
      <section
        aria-labelledby="principles-title"
        className="relative border-t border-border/80 py-12 md:py-16 lg:py-0 lg:min-h-[85svh] flex flex-col justify-center"
      >
        <div className="site-container w-full my-auto py-4 sm:py-6 lg:py-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
              <div>
                <p className="site-eyebrow text-primary before:bg-primary">
                  Prinsip Titik Huni
                </p>
                <h2
                  id="principles-title"
                  className="mt-2 text-balance text-[clamp(1.85rem,3.2vw,2.65rem)] font-medium leading-[1.08] tracking-[-0.04em] text-foreground"
                >
                  Prinsip yang kami <span className="text-primary">pegang.</span>
                </h2>
              </div>
              <p className="text-[0.75rem] uppercase tracking-widest text-foreground-soft hidden md:block">
                Filosofi Pengembangan
              </p>
            </div>
          </ScrollReveal>

          {/* 3 Horizontal Cards (Theme-matched with Beranda) */}
          <div className="mt-7 grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8 md:mt-8">
            {principles.map((principle) => (
              <div
                key={principle.num}
                className="group rounded-[1.25rem] border border-border/80 bg-white/75 p-6 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:bg-white hover:shadow-[0_12px_30px_-15px_rgba(35,68,56,0.12)] flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    Prinsip {principle.num}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xl font-light text-primary/30"
                  >
                    {principle.num}
                  </span>
                </div>
                <h3 className="mt-3.5 text-[1.0625rem] font-medium leading-[1.35] tracking-[-0.02em] text-foreground">
                  {principle.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-[1.65] text-foreground-muted">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Integrated Quote Card — Gradient container matching HomeContact style */}
          <ScrollReveal className="mt-7 sm:mt-8 md:mt-9">
            <div className="rounded-[1.5rem] border border-emerald-900/10 bg-[linear-gradient(115deg,#f3f8f3_0%,#e8f1e9_60%,#ffffff_100%)] p-6 sm:p-8 md:p-9 shadow-[0_12px_35px_-20px_rgba(35,68,56,0.12)]">
              <div className="max-w-4xl">
                <blockquote>
                  <p className="text-balance text-[clamp(1.2rem,2.1vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.03em] text-foreground">
                    &ldquo;Rumah yang baik bukanlah rumah yang paling besar atau paling
                    mewah, melainkan rumah yang terasa cukup dan tepat untuk pulang.&rdquo;
                  </p>
                </blockquote>

                <div className="mt-4 flex items-center gap-3 text-[0.75rem] text-foreground-soft">
                  <p className="site-eyebrow text-primary before:bg-primary">
                    Titik Huni · Filosofi Hunian Yogyakarta
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          4. SELECTED PROJECT PROOF — ONE VIEWPORT SPREAD (8:4 GRID)
          ======================================================== */}
      {featuredProject && (
        <section
          aria-labelledby="proof-title"
          className="relative border-t border-border/80 py-12 md:py-16 lg:py-0 lg:min-h-[85svh] flex flex-col justify-center"
        >
          <div className="site-container w-full my-auto py-4 sm:py-6 lg:py-8">
            <ScrollReveal>
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end md:mb-8">
                <div>
                  <p className="site-eyebrow text-primary before:bg-primary">
                    Proyek Pilihan
                  </p>
                  <h2
                    id="proof-title"
                    className="mt-2 text-balance text-[clamp(1.75rem,2.8vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.04em] text-foreground"
                  >
                    Karya yang diwujudkan dalam <span className="text-primary">ruang nyata.</span>
                  </h2>
                </div>

                <Link
                  href="/proyek"
                  className="site-link-editorial group text-[14px] font-medium"
                >
                  Lihat semua proyek
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </ScrollReveal>

            {/* Asymmetric 8 + 4 Project Presentation */}
            <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
              {/* 8 Cols Image with HomeCurvature */}
              <div className="lg:col-span-8">
                <Link
                  href={`/proyek/${featuredProject.slug}`}
                  className="group relative block aspect-[16/10] max-h-[50vh] xl:max-h-[56vh] w-full overflow-hidden rounded-[1.5rem] bg-surface-muted shadow-[0_20px_45px_-20px_rgba(35,68,56,0.15)]"
                >
                  <Image
                    src={
                      featuredProject.cover_image ||
                      "/assets/images/konsep_titikhuni.webp"
                    }
                    alt={featuredProject.title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 65vw"
                    className="object-cover brightness-105 transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />

                  {featuredProject.location && (
                    <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-primary shadow-xs backdrop-blur-xs">
                      {featuredProject.location}
                    </div>
                  )}
                </Link>
              </div>

              {/* 4 Cols Editorial Metadata Card */}
              <div className="flex flex-col justify-between rounded-[1.5rem] border border-border/80 bg-white/80 p-6 sm:p-7 shadow-[0_18px_35px_-22px_rgba(35,68,56,0.18)] backdrop-blur-xs lg:col-span-4">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
                    Portofolio Selesai
                  </p>

                  <h3 className="mt-2 text-[clamp(1.25rem,1.8vw,1.6rem)] font-medium leading-[1.25] tracking-tight text-foreground">
                    <Link
                      href={`/proyek/${featuredProject.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {featuredProject.title}
                    </Link>
                  </h3>

                  <p className="mt-3 text-[0.875rem] leading-[1.7] text-foreground-muted">
                    {featuredProject.short_description ||
                      "Wujud eksplorasi arsitektur Titik Huni yang mengintegrasikan pencahayaan alami, material lokal, dan ketenangan ruang hidup kontekstual."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/80">
                  <Link
                    href={`/proyek/${featuredProject.slug}`}
                    className="site-button-secondary w-full justify-between"
                  >
                    <span>Eksplorasi Proyek</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          5. FINAL CTA — MATCHED WITH HOMECONTACT DESIGN SYSTEM
          ======================================================== */}
      <section
        id="kontak"
        aria-labelledby="about-cta-title"
        className="relative py-12 md:py-16 lg:py-20"
      >
        <div className="site-container">
          <div className="grid items-center gap-6 rounded-[1.75rem] bg-[linear-gradient(115deg,#f3f8f3_0%,#e8f1e9_100%)] p-7 sm:p-9 md:p-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:p-14 border border-emerald-900/10 shadow-[0_20px_50px_-25px_rgba(35,68,56,0.18)]">
            <div>
              <p className="site-eyebrow text-primary before:bg-primary">
                Konsultasi &amp; Kunjungan
              </p>

              <h2
                id="about-cta-title"
                className="mt-3.5 text-balance text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground"
              >
                Ceritakan rumah yang ingin Anda <span className="text-primary">wujudkan.</span>
              </h2>

              <p className="mt-3 max-w-lg text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                Diskusikan rencana hunian Anda—mulai dari pilihan lokasi, konsultasi
                kebutuhan tata ruang, hingga rancang bangun rumah di Yogyakarta bersama
                tim Titik Huni.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source="tentang_kami_cta"
                aria-label="Konsultasi hunian dengan Titik Huni via WhatsApp"
                className="site-button-primary w-full sm:w-auto"
              >
                <span className="inline-flex items-center gap-2.5">
                  <MessageCircle size={16} aria-hidden="true" />
                  Konsultasi via WhatsApp
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kunjungi profil Instagram Titik Huni"
                className="site-button-secondary w-full sm:w-auto"
              >
                <Instagram size={15} aria-hidden="true" />
                Instagram Titik Huni
                <ArrowUpRight
                  size={14}
                  className="text-foreground-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}