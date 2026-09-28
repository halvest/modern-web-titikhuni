import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
} from "lucide-react";
import { FeaturedProjectCard } from "@/components/marketing/projects/FeaturedProjectCard";
import { siteConfig } from "@/config/site";
import { getFeaturedProjects } from "@/lib/projects";
import { ScrollReveal } from "@/components/ScrollReveal";

const principles = [
  {
    title: "Cahaya alami",
    copy: "Bukaan yang membuat ruang lebih sehat dan hidup.",
  },
  {
    title: "Material jujur",
    copy: "Tekstur hangat, awet, dan tidak berlebihan.",
  },
  {
    title: "Dibangun terbatas",
    copy: "Lebih sedikit rumah, lebih banyak perhatian.",
  },
];

export function HomeAbout() {
  return (
    <section
      id="tentang-kami"
      className="relative flex scroll-mt-[var(--header-height)] overflow-hidden bg-transparent py-8 md:py-12 lg:min-h-[calc(100svh-var(--header-height))] lg:items-center lg:py-10 xl:py-12"
      aria-labelledby="about-title"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] opacity-55 lg:block"
        aria-hidden="true"
      >
        <div className="architectural-grid h-full w-full" />
      </div>

      <div className="site-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          <ScrollReveal className="lg:col-span-7">
          <article>
            <p className="site-eyebrow text-primary before:bg-primary">
              Tentang Titik Huni
            </p>

            <h2
              id="about-title"
              className="mt-4 max-w-4xl text-balance text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.03] tracking-[-0.045em] text-foreground lg:mt-5"
            >
              Rumah dirancang dari cara hidup, bukan sekadar luas bangunan.
            </h2>

            <p className="mt-4 max-w-2xl text-pretty text-[1.0625rem] font-normal leading-[1.75] text-foreground-muted lg:mt-6">
              Titik Huni adalah boutique developer rumah modern di Yogyakarta
              yang mengembangkan hunian terbatas di Sleman dan Bantul. Cahaya
              alami, sirkulasi udara, material jujur, dan proporsi ruang menjadi
              dasar setiap desain.
            </p>

            <ul className="mt-5 grid grid-cols-3 border-y border-border-strong/50 lg:mt-7">
              {principles.map((principle) => (
                <li
                  key={principle.title}
                  className="group min-w-0 border-r border-border-strong/50 px-2 py-3 first:pl-0 last:border-r-0 last:pr-0 sm:px-4 lg:px-5 lg:py-4"
                >
                  <h3 className="text-[0.68rem] font-semibold leading-4 tracking-[-0.015em] text-foreground sm:text-sm sm:leading-normal">
                    {principle.title}
                  </h3>
                  <p className="mt-1 hidden text-xs leading-5 text-foreground-soft md:block">
                    {principle.copy}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-row flex-wrap items-center gap-3 lg:mt-7">
              <Link
                href="/tentang-kami"
                className="site-button-secondary"
              >
                Lebih jauh tentang Titik Huni
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="site-button-secondary"
                aria-label="Kunjungi Instagram Titik Huni"
              >
                <Instagram size={16} aria-hidden="true" />
                Instagram
                <ArrowUpRight
                  size={14}
                  className="text-foreground-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </article>
          </ScrollReveal>

          <figure className="group relative aspect-[7/6] w-full overflow-hidden rounded-[1.75rem] bg-surface-muted md:aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:h-[min(64svh,39rem)] lg:min-h-[28rem]">
            <Image
              src="/assets/images/taman-titikhuni-2.jpg"
              alt="Rumah modern Titik Huni di Yogyakarta dengan taman, cahaya alami, dan sirkulasi udara"
              fill
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/70" />

            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7 lg:p-7 xl:p-8">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/60">
                Arsitektur tropis · Yogyakarta
              </p>
              <p className="mt-2 max-w-sm text-xl font-medium leading-snug tracking-[-0.025em]">
                Cahaya, udara, dan taman menjadi bagian dari rumah.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export async function HomeGallery() {
  const { projects, error } = await getFeaturedProjects(6);
  const hasSingleProject = !error && projects.length === 1;

  return (
    <section
      id="galeri"
      className="scroll-mt-[var(--header-height)] bg-transparent pt-10 pb-8 text-foreground md:pt-12 md:pb-10 lg:pb-12"
      aria-labelledby="gallery-title"
    >
      <div className="site-container">
        <ScrollReveal>
        <header className="mb-7 flex flex-col items-end text-right lg:mb-8">
          <p className="site-eyebrow text-primary before:bg-primary">Proyek Titik Huni</p>
          <h2
            id="gallery-title"
            className="mt-3 text-balance text-[clamp(2rem,3.4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.045em] text-foreground"
          >
            Project <span className="text-primary">Finished</span>
          </h2>
        </header>
        </ScrollReveal>

        {error ? (
          <div className="rounded-3xl border border-border bg-white px-6 py-20 text-center">
            <p className="text-lg font-medium tracking-tight">Portfolio belum dapat dimuat.</p>
            <p className="mt-2 text-sm text-foreground-muted">Silakan coba kembali beberapa saat lagi.</p>
          </div>
        ) : projects.length ? (
          <div className={hasSingleProject ? "max-w-[28rem]" : "grid grid-cols-1 gap-x-5 gap-y-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6"}>
            {projects.map((project, index) => <FeaturedProjectCard key={project.id} project={project} wide={hasSingleProject} eager={index === 0} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-white px-6 py-20 text-center">
            <p className="text-lg font-medium tracking-tight">Proyek pilihan sedang dikurasi.</p>
            <p className="mt-2 text-sm text-foreground-muted">Kunjungi kembali untuk melihat karya terbaru Titik Huni.</p>
          </div>
        )}

        <footer className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-pretty text-sm leading-6 text-foreground-muted">
            Jelajahi foto, lokasi, dan detail proyek rumah di Yogyakarta dalam portofolio Titik Huni.
          </p>
          <Link
            href="/proyek"
            className="site-link-editorial group"
          >
            Lihat semua proyek
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </section>
  );
}
