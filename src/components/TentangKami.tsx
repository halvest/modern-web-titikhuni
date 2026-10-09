import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MessageCircle,
  MapPin,
  Sun,
  Wind,
  Layers3,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { getPublishedProjects } from "@/lib/projects";

const benefits: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Layers3,
    title: "Tata ruang fungsional",
    description:
      "Ruang dirancang sesuai kebutuhan sehari-hari, terasa lega, dan mudah digunakan.",
  },
  {
    icon: Sun,
    title: "Cahaya alami",
    description:
      "Bukaan direncanakan untuk membantu cahaya matahari masuk ke dalam rumah.",
  },
  {
    icon: Wind,
    title: "Sirkulasi udara",
    description:
      "Memperhatikan aliran udara agar hunian terasa lebih nyaman untuk ditinggali.",
  },
];

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya ingin konsultasi mengenai desain atau pembangunan rumah di Yogyakarta."
)}`;

export async function TentangKami() {
  const { projects } = await getPublishedProjects();
  const featuredProject = projects?.[0];

  return (
    <div className="text-foreground">
      {/* Hero: one clear message and one primary action */}
      <section
        aria-labelledby="about-page-title"
        className="pb-14 pt-[calc(var(--header-height)+1.5rem)] sm:pb-20 md:pt-[calc(var(--header-height)+2rem)]"
      >
        <div className="site-container">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm text-foreground-soft"
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="underline-offset-4 hover:text-primary hover:underline"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                Tentang Kami
              </li>
            </ol>
          </nav>

          <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:pb-10">
            <div className="max-w-3xl">
              <p className="site-eyebrow text-primary before:bg-primary">
                Tentang Titik Huni
              </p>
              <h1
                id="about-page-title"
                className="mt-3 text-balance text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.045em]"
              >
                Rumah yang nyaman dimulai dari{" "}
                <span className="text-primary">rancangan yang tepat.</span>
              </h1>
            </div>

            <div className="max-w-xl md:justify-self-end">
              <p className="text-base leading-7 text-foreground-muted">
                Titik Huni menghadirkan pendekatan desain dan pembangunan rumah
                di Yogyakarta yang mengutamakan fungsi ruang, cahaya alami, dan
                kenyamanan sehari-hari.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source="tentang_kami_hero"
                className="site-button-primary mt-5 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Konsultasi via WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <figure className="relative mt-7 aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted sm:mt-9 sm:aspect-[16/8] sm:rounded-3xl lg:aspect-[21/8]">
            <Image
              src="/assets/images/konsep_titikhuni.webp"
              alt="Konsep hunian modern Titik Huni dengan pencahayaan alami dan material sederhana"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
              aria-hidden="true"
            />
            <figcaption className="absolute bottom-4 left-4 max-w-lg text-white sm:bottom-7 sm:left-7">
              <p className="text-sm font-medium text-white/80">
                Desain sederhana. Ruang yang berfungsi.
              </p>
              <p className="mt-1 text-xl font-medium leading-snug sm:text-2xl">
                Hunian yang dirancang untuk kehidupan sehari-hari.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Benefits: practical language, three scannable items */}
      <section
        aria-labelledby="approach-title"
        className="border-t border-border py-14 sm:py-20"
      >
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="site-eyebrow text-primary before:bg-primary">
              Pendekatan Kami
            </p>
            <h2
              id="approach-title"
              className="mt-3 text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.04em]"
            >
              Hal penting dalam setiap rancangan rumah.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground-muted">
              Bukan hanya tampilan, rumah perlu mendukung aktivitas, kenyamanan,
              dan kebutuhan penghuninya.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-white p-5 sm:p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--sage)] text-primary">
                  <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-medium tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <Link
            href="/arsitek-kontraktor"
            className="site-link-editorial mt-7 inline-flex items-center gap-2 text-sm font-medium"
          >
            Pelajari layanan arsitek dan kontraktor
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Proof: real project, if one is published */}
      {featuredProject && (
        <section
          aria-labelledby="project-title"
          className="border-t border-border py-14 sm:py-20"
        >
          <div className="site-container">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="site-eyebrow text-primary before:bg-primary">
                  Proyek Pilihan
                </p>
                <h2
                  id="project-title"
                  className="mt-3 text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.04em]"
                >
                  Lihat hasil karya Titik Huni.
                </h2>
              </div>
              <Link
                href="/proyek"
                className="site-link-editorial inline-flex items-center gap-2 text-sm font-medium"
              >
                Semua proyek
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <article className="grid overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-[1.25fr_0.75fr] md:rounded-3xl">
              <Link
                href={`/proyek/${featuredProject.slug}`}
                aria-label={`Lihat detail proyek ${featuredProject.title}`}
                className="group relative block aspect-[4/3] bg-surface-muted md:aspect-auto md:min-h-[340px]"
              >
                <Image
                  src={
                    featuredProject.cover_image ||
                    "/assets/images/konsep_titikhuni.webp"
                  }
                  alt={featuredProject.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </Link>

              <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-9">
                {featuredProject.location && (
                  <p className="flex items-center gap-1.5 text-sm text-foreground-soft">
                    <MapPin size={15} aria-hidden="true" />
                    {featuredProject.location}
                  </p>
                )}
                <h3 className="mt-3 text-2xl font-medium leading-tight tracking-tight">
                  {featuredProject.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground-muted">
                  {featuredProject.short_description ||
                    "Lihat detail proyek dan pendekatan desain yang diterapkan oleh Titik Huni."}
                </p>
                <Link
                  href={`/proyek/${featuredProject.slug}`}
                  className="site-button-secondary mt-6 inline-flex w-full items-center justify-between sm:w-fit sm:min-w-48"
                >
                  Lihat detail proyek
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Final CTA: clear next step */}
      <section
        id="kontak"
        aria-labelledby="about-cta-title"
        className="py-14 sm:py-20"
      >
        <div className="site-container">
          <div className="flex flex-col gap-6 rounded-2xl bg-[var(--sage)] p-6 sm:rounded-3xl sm:p-9 md:flex-row md:items-center md:justify-between md:gap-10 md:p-12">
            <div className="max-w-2xl">
              <p className="site-eyebrow text-primary before:bg-primary">
                Langkah Selanjutnya
              </p>
              <h2
                id="about-cta-title"
                className="mt-3 text-balance text-[clamp(1.9rem,3.5vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.04em]"
              >
                Punya rencana membangun rumah?
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                Ceritakan kebutuhan dan rencana Anda. Tim Titik Huni siap
                membantu membahas langkah yang sesuai.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source="tentang_kami_cta"
                aria-label="Konsultasi dengan Titik Huni melalui WhatsApp"
                className="site-button-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Konsultasi via WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kunjungi Instagram Titik Huni"
                className="site-button-secondary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Instagram size={16} aria-hidden="true" />
                Instagram Titik Huni
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}