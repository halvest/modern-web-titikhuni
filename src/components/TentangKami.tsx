import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Home,
  Layers3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sun,
  Wind,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ScrollReveal } from "@/components/ScrollReveal";

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya ingin berkonsultasi mengenai hunian atau pembangunan rumah di Yogyakarta."
)}`;

const approaches = [
  {
    title: "Tata Ruang Fungsional",
    icon: Layers3,
    desc: "Denah disusun efisien mengikuti alur aktivitas harian, memaksimalkan fungsi tanpa ruang mati.",
  },
  {
    title: "Pencahayaan Alami",
    icon: Sun,
    desc: "Bukaan jendela dan ventilasi atas ditata agar ruangan terang alami sepanjang siang tanpa panas berlebih.",
  },
  {
    title: "Sirkulasi Udara Silang",
    icon: Wind,
    desc: "Penataan ventilasi silang menjaga pergantian udara pasif tetap sejuk dan nyaman.",
  },
  {
    title: "Material Tropis Awet",
    icon: ShieldCheck,
    desc: "Material dipilih sesuai iklim lokal Yogyakarta, tahan cuaca, dan mudah dirawat.",
  },
];

export function TentangKami() {
  return (
    <div className="text-foreground">
      {/* ========================================================
          1. HERO & PROFIL RINGKAS
          ======================================================== */}
      <section
        aria-labelledby="about-hero-title"
        className="pb-6 pt-[calc(var(--header-height)+1.25rem)] sm:pb-8 md:pt-[calc(var(--header-height)+1.75rem)] md:pb-10"
      >
        <div className="site-container">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-5 text-xs text-foreground-soft sm:mb-6"
          >
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
                Tentang Kami
              </li>
            </ol>
          </nav>

          {/* Heading & Intro */}
          <ScrollReveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>Profil Titik Huni</span>
                </div>
                <h1
                  id="about-hero-title"
                  className="mt-3 text-balance text-[clamp(2.25rem,4.5vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground"
                >
                  Rumah yang nyaman dimulai dari{" "}
                  <span className="text-primary">rancangan yang tepat.</span>
                </h1>
              </div>

              <div className="lg:col-span-5">
                <div className="space-y-3 border-l-2 border-primary/25 pl-4 sm:pl-5 text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem] sm:leading-7">
                  <p className="text-pretty">
                    Titik Huni adalah pengembang hunian berbasis desain di Yogyakarta yang berfokus pada rumah tinggal dengan tata ruang fungsional, pencahayaan alami, dan kenyamanan sehari-hari.
                  </p>
                  <p className="text-pretty">
                    Melalui Titik Huni Residential, kami mengembangkan dan memasarkan hunian dengan karakter desain yang khas. Sementara Titik Huni Studio menyediakan layanan desain arsitektur dan konstruksi rumah tinggal sesuai kebutuhan klien.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Banner Media Arsitektur */}
          <ScrollReveal className="mt-6 sm:mt-8">
            <div className="group relative w-full overflow-hidden rounded-2xl border border-border/80 bg-surface-muted shadow-[0_16px_40px_-20px_rgba(35,68,56,0.12)] sm:rounded-3xl">
              <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full">
                <Image
                  src="/assets/images/konsep_titikhuni.webp"
                  alt="Konsep arsitektur Titik Huni Yogyakarta"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1023px) 100vw, 1360px"
                  className="object-cover object-center transition-transform duration-1000 ease-out motion-safe:group-hover:scale-[1.02]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 rounded-xl border border-white/20 bg-black/45 px-3.5 py-2 text-white shadow-xs backdrop-blur-md sm:px-4 sm:py-2.5">
                  <p className="text-xs font-medium text-white sm:text-sm">
                    Titik Huni Yogyakarta
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          2. DUA LAYANAN UTAMA
          ======================================================== */}
      <section
        id="layanan"
        aria-labelledby="services-heading"
        className="scroll-mt-24 pt-4 pb-12 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20"
      >
        <div className="site-container">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>Layanan Kami</span>
              </div>
              <h2
                id="services-heading"
                className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.12]"
              >
                Mengembangkan hunian. Merancang ruang untuk kehidupan.
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                Menyediakan pilihan rumah siap huni maupun layanan desain dan bangun
                rumah di atas lahan Anda.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 items-stretch gap-6 sm:mt-9 md:grid-cols-2 md:gap-8">
              {/* Card 1: Residential */}
              <article className="group relative flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#CFDDD1] bg-[#F2F6F3] p-6 sm:p-8 md:p-9 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-2xs">
                      <Home size={14} aria-hidden="true" />
                      <span>Titik Huni Residential</span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                    Pengembangan Hunian
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem]">
                    Kami mengembangkan rumah tinggal di Yogyakarta dengan desain fungsional, pencahayaan alami, dan kenyamanan sehari-hari.
                  </p>

                  <div className="mt-6 border-t border-[#D5E3D7] pt-5">
                    <ul className="space-y-2.5 text-xs text-foreground sm:text-sm">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Tata ruang yang fungsional</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Lokasi dengan akses yang mendukung aktivitas</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Legalitas Terjamin</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Lokasi: Yogyakarta dan sekitarnya.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#D5E3D7] pt-5">
                  <Link
                    href="/unit"
                    className="site-button-primary group/btn w-full justify-between sm:w-auto"
                  >
                    <span>Lihat Katalog</span>
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                  </Link>
                </div>
              </article>

              {/* Card 2: Studio */}
              <article className="group relative flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#CFDDD1] bg-[#F2F6F3] p-6 sm:p-8 md:p-9 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-2xs">
                      <Building2 size={14} aria-hidden="true" />
                      <span>Titik Huni Studio</span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                    Desain Arsitektur &amp; Konstruksi
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem]">
                    Kami menyediakan layanan desain dan pembangunan rumah tinggal di Yogyakarta yang disesuaikan dengan kebutuhan, karakter, dan anggaran klien.
                  </p>

                  <div className="mt-6 border-t border-[#D5E3D7] pt-5">
                    <ul className="space-y-2.5 text-xs text-foreground sm:text-sm">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Desain fungsional dan personal sesuai kebutuhan klien</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Layanan desain 3D, gambar kerja</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Perencanaan biaya yang transparan dan terukur</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Pembangunan yang dikerjakan profesional</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span>Lokasi: Yogyakarta dan sekitarnya</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#D5E3D7] pt-5">
                  <Link
                    href="/arsitek-kontraktor"
                    className="site-button-secondary group/btn w-full justify-between sm:w-auto border-black/10 bg-white hover:border-primary hover:text-primary hover:bg-white"
                  >
                    <span>Konsultasikan Proyek Anda</span>
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          3. PENDEKATAN PERANCANGAN
          ======================================================== */}
      <section
        aria-labelledby="approach-heading"
        className="scroll-mt-24 py-8 sm:py-10 md:py-14"
      >
        <div className="site-container">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>Pendekatan Kami</span>
              </div>
              <h2
                id="approach-heading"
                className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.12]"
              >
                Fokus kenyamanan hidup sehari-hari
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base">
                Empat prinsip sederhana yang memandu setiap denah dan bentuk rumah:
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {approaches.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#D5E2D7] bg-[#F4F7F4] p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-sm"
                  >
                    <div>
                      <div className="flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-2xs transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                        <Icon size={19} aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 text-base font-medium tracking-tight text-foreground sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          4. STUDIO & KONTAK TERPADU (CTA)
          ======================================================== */}
      <section
        id="kontak"
        aria-labelledby="contact-heading"
        className="scroll-mt-24 pt-6 pb-14 sm:pt-8 sm:pb-18 md:pt-10 md:pb-22"
      >
        <div className="site-container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-[#CFDDD1] bg-[#F1F6F2] p-7 sm:p-10 md:p-12 lg:p-14 shadow-xs">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                {/* Kolom Info Studio */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Studio &amp; Kantor</span>
                  </div>
                  <h2
                    id="contact-heading"
                    className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.15]"
                  >
                    Punya pertanyaan seputar hunian di Jogja?
                  </h2>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base sm:leading-7">
                    Diskusikan kebutuhan rumah, rencana desain, atau jadwal kunjungan
                    ke studio kami tanpa biaya konsultasi.
                  </p>

                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-black/5 bg-white/90 p-4 shadow-2xs backdrop-blur-xs">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--sage)] text-primary">
                      <MapPin size={17} aria-hidden="true" />
                    </div>
                    <span className="text-xs leading-relaxed text-foreground sm:text-sm sm:leading-relaxed">
                      Jl. Gondang Legi, Gondang Legi, Wedomartani, Kec. Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55584
                    </span>
                  </div>
                </div>

                {/* Kolom Tombol CTA Terpadu */}
                <div className="flex flex-col gap-3.5 sm:flex-row lg:col-span-5 lg:flex-col lg:justify-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-button-primary group/cta w-full justify-center py-3.5 text-[15px] font-medium shadow-xs hover:shadow-md transition-all"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    <span>Konsultasi via WhatsApp</span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                    />
                  </a>

                  <Link
                    href="/unit"
                    className="site-button-secondary group/cta w-full justify-center border-black/10 bg-white py-3.5 text-[15px] font-medium shadow-2xs hover:border-primary hover:text-primary hover:bg-white transition-all"
                  >
                    <span>Lihat Katalog</span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover/cta:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}