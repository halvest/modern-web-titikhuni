import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
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

export const metadata: Metadata = {
  title:
    "Arsitek & Kontraktor Rumah Jogja | Jasa Desain & Bangun Rumah - Titik Huni",
  description:
    "Titik Huni menyediakan jasa arsitek dan kontraktor terintegrasi di Yogyakarta. Layanan desain rumah minimalis modern hingga pembangunan rumah dengan kualitas dan transparansi biaya.",
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

const steps = [
  {
    icon: PenTool,
    title: "Konsultasi & Konsep Desain",
    description:
      "Diskusi kebutuhan ruang, gaya hidup, dan budget Anda. Kami merumuskannya menjadi desain denah fungsional dan tampak 3D yang estetis.",
  },
  {
    icon: FileText,
    title: "RAB & Perencanaan Anggaran",
    description:
      "Penyusunan Rencana Anggaran Biaya (RAB) yang transparan dan mendetail hingga material terkecil, beserta gambar kerja struktur (DED).",
  },
  {
    icon: HardHat,
    title: "Konstruksi & Pengawasan Ketat",
    description:
      "Proses pembangunan fisik oleh tim lapangan berpengalaman, diawasi berkala agar sesuai dengan gambar kerja dan spesifikasi material.",
  },
  {
    icon: KeyRound,
    title: "Serah Terima & Garansi",
    description:
      "Pengecekan kualitas akhir bersama sebelum serah terima kunci. Rumah siap dihuni dengan garansi struktur dan retensi pemeliharaan.",
  },
];

const pillars = [
  {
    icon: CheckCircle2,
    title: "Satu Tim Terintegrasi",
    description:
      "Tidak perlu repot mengoordinasikan arsitek dan tukang secara terpisah. Kami menangani seluruh siklus dari gagasan hingga bangunan berdiri.",
  },
  {
    icon: ShieldCheck,
    title: "Transparansi Biaya",
    description:
      "Setiap material dan pekerjaan dirinci jelas di awal dalam RAB. Menghindari pembengkakan biaya tak terduga di tengah proses pembangunan.",
  },
  {
    icon: Ruler,
    title: "Desain Berorientasi Fungsi",
    description:
      "Bukan sekadar indah dipandang. Desain kami mengutamakan sirkulasi udara silang, pencahayaan alami, dan kenyamanan jangka panjang.",
  },
];

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya berminat menggunakan jasa arsitek dan kontraktor untuk membangun rumah di Yogyakarta."
)}`;

export default function ArsitekKontraktorPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface text-foreground">
      <div className="home-content-canvas min-h-screen">
        {/* ========================================================
            1. HERO SECTION
            ======================================================== */}
        <section
          aria-labelledby="hero-title"
          className="pb-14 pt-[calc(var(--header-height)+1.5rem)] sm:pb-20 md:pt-[calc(var(--header-height)+2rem)] md:pb-24"
        >
          <div className="site-container">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5 text-xs text-foreground-soft sm:mb-6">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:text-primary hover:underline">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border-strong">/</li>
                <li aria-current="page" className="font-medium text-foreground">
                  Jasa Arsitek &amp; Kontraktor
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
              <div className="lg:col-span-6">
                <p className="site-eyebrow text-primary before:bg-primary">
                  Layanan Rancang Bangun · Yogyakarta
                </p>
                <h1
                  id="hero-title"
                  className="mt-3.5 text-balance text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.04em] text-foreground"
                >
                  Bangun rumah impian Anda tanpa{" "}
                  <span className="text-primary">kerumitan.</span>
                </h1>
                <p className="mt-5 text-pretty text-base leading-relaxed text-foreground-muted sm:text-[1.125rem]">
                  Dari coretan denah hingga serah terima kunci. Titik Huni mengintegrasikan desain arsitektur, perencanaan anggaran terukur, dan eksekusi konstruksi dalam satu tim tepercaya.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-button-primary group w-full sm:w-auto"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Konsultasi Gratis
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <a href="#cara-kerja" className="site-link-editorial text-sm font-medium">
                    Pelajari cara kerja kami
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-surface-muted shadow-[0_16px_40px_-20px_rgba(35,68,56,0.15)] sm:aspect-[16/10] sm:rounded-[1.75rem] lg:aspect-[4/3]">
                  <Image
                    src="/assets/images/rumah-bangunjiwo-2.jpg"
                    alt="Proses desain dan bangun rumah modern Titik Huni di Yogyakarta"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
                    aria-hidden="true"
                  />
                  <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/25 bg-black/45 p-4 text-white shadow-md backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-5">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                      Studio Arsitektur &amp; Konstruksi
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug text-white sm:text-base">
                      Mewujudkan ruang hidup fungsional dan abadi.
                    </p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. VALUE PROPOSITIONS / PILLARS
            ======================================================== */}
        <section
          aria-labelledby="pillars-title"
          className="border-y border-border/80 bg-white py-16 sm:py-20 lg:py-24"
        >
          <div className="site-container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="site-eyebrow text-primary before:bg-primary">
                Keunggulan Layanan
              </p>
              <h2
                id="pillars-title"
                className="mt-3 text-balance text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em] text-foreground"
              >
                Mengapa mempercayakan proyek Anda pada kami?
              </h2>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                Membangun rumah tidak harus membingungkan. Kami hadir dengan pendekatan sistematis dan transparan untuk memberikan ketenangan pikiran.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:mt-14">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_30px_-15px_rgba(35,68,56,0.12)] sm:p-8"
                >
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-[var(--sage)] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <pillar.icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.65] text-foreground-muted">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. WORKFLOW / CARA KERJA
            ======================================================== */}
        <section id="cara-kerja" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="site-container">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
                <p className="site-eyebrow text-primary before:bg-primary">Alur Kerja Kami</p>
                <h2 className="mt-3 text-balance text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em] text-foreground">
                  Proses jelas di setiap langkah.
                </h2>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                  Dari sekadar ide hingga siap dihuni, kami mendampingi Anda di setiap fase dengan laporan progres berkala dan pengawasan terukur.
                </p>

                <div className="mt-8 hidden lg:block">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-button-primary"
                  >
                    Mulai Diskusi Proyek
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative ml-4 space-y-10 border-l border-primary/20 pl-7 sm:ml-6 sm:space-y-12 sm:pl-9">
                  {steps.map((step) => (
                    <div key={step.title} className="group relative">
                      {/* Timeline Node */}
                      <span className="absolute -left-[2.35rem] sm:-left-[2.85rem] top-0.5 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-white text-primary shadow-xs transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        <step.icon size={15} strokeWidth={1.8} aria-hidden="true" />
                      </span>

                      <h3 className="text-xl font-medium tracking-tight text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-[1.65] text-foreground-muted sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. PORTFOLIO SHOWCASE
            ======================================================== */}
        <section aria-labelledby="gallery-title" className="border-t border-border/80 bg-white pb-16 sm:pb-20 md:pb-24">
          <HomeGallery />
        </section>

        {/* ========================================================
            5. BOTTOM CTA
            ======================================================== */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="site-container">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-primary px-6 py-14 text-center text-white shadow-[0_20px_50px_-25px_rgba(35,68,56,0.3)] sm:px-12 sm:py-20 md:px-16">
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-balance text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
                  Mari rencanakan rumah impian Anda.
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                  Konsultasikan lahan, kebutuhan ruang, dan perkiraan budget Anda bersama tim arsitek Titik Huni tanpa komitmen awal.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-button-hero"
                  >
                    <MessageCircle size={17} aria-hidden="true" />
                    Hubungi via WhatsApp
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[11px] border border-white/30 bg-white/10 px-5 py-2.5 text-[14px] font-medium text-white backdrop-blur-xs transition-colors duration-300 hover:bg-white/20"
                  >
                    <Instagram size={16} aria-hidden="true" />
                    Instagram Titik Huni
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
