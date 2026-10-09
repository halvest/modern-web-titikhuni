import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Sparkles,
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
  const { projects, error } = await getFeaturedProjects(3);
  const hasSingleProject = !error && projects.length === 1;

  return (
    <div className="bg-transparent pt-14 md:pt-20 lg:pt-24">
      <div className="site-container">
        <ScrollReveal>
          <header className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <div>
              <p className="site-eyebrow text-primary before:bg-primary">Proyek Titik Huni</p>
              <h2
                id="gallery-title"
                className="mt-3 text-balance text-[clamp(1.875rem,3.2vw,3rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground"
              >
                Project <span className="text-primary">Finished</span>
              </h2>
            </div>

            {!error && projects.length > 0 ? (
              <>
                <Link
                  href="/proyek"
                  className="site-link-editorial hidden shrink-0 md:inline-flex"
                >
                  Lihat semua proyek
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                {!hasSingleProject ? (
                  <p
                    className="flex shrink-0 items-center gap-1.5 pb-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-foreground-soft md:hidden"
                    aria-hidden="true"
                  >
                    Geser
                    <ArrowRight size={14} className="motion-safe:animate-pulse" />
                  </p>
                ) : null}
              </>
            ) : null}
          </header>
        </ScrollReveal>

        {error ? (
          <div className="rounded-3xl border border-border bg-white px-6 py-20 text-center">
            <p className="text-lg font-medium tracking-tight">Portfolio belum dapat dimuat.</p>
            <p className="mt-2 text-sm text-foreground-muted">Silakan coba kembali beberapa saat lagi.</p>
          </div>
        ) : projects.length ? (
          <div
            className={
              hasSingleProject
                ? "grid gap-5 sm:grid-cols-2 lg:max-w-4xl"
                : "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 sm:-mx-7 sm:scroll-px-7 sm:px-7 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex w-[82%] max-w-[22rem] shrink-0 snap-start sm:w-[22rem] md:w-auto md:max-w-none"
              >
                <FeaturedProjectCard project={project} wide={hasSingleProject} eager={index === 0} />
              </div>
            ))}

            {/* Kartu terakhir: Lihat Semua Proyek (CTA) */}
            <div className="flex w-[82%] max-w-[22rem] shrink-0 snap-start sm:w-[22rem] md:w-auto md:max-w-none">
              <article className="flex h-full w-full min-w-0 flex-1">
                <Link
                  href="/proyek"
                  aria-label="Jelajahi seluruh portofolio proyek Titik Huni"
                  className="group flex h-full w-full flex-col rounded-[1rem] transition-transform duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-primary">
                    <Image
                      src="/assets/images/rumah-candibinangun-sleman.jpg"
                      alt="Lihat semua proyek portofolio Titik Huni"
                      fill
                      sizes="(max-width: 767px) 85vw, (max-width: 1023px) 50vw, 25vw"
                      className="object-cover blur-[2px] grayscale transition-[filter,transform] duration-700 ease-out opacity-60 motion-safe:group-hover:scale-[1.04] group-hover:blur-sm group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay transition-colors duration-300" />
                  </div>

                  <div className="relative z-10 mx-2 -mt-7 flex flex-1 flex-col rounded-[0.85rem] border border-primary-800 bg-primary p-4 text-white shadow-[0_18px_35px_-22px_rgba(35,68,56,0.5)] sm:mx-3 sm:-mt-8 sm:p-5">
                    <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/75">
                      <Sparkles size={12} className="shrink-0 text-emerald-300" aria-hidden="true" />
                      Portofolio Lengkap
                    </p>
                    <h3 className="mt-2 text-balance text-[clamp(1.2rem,1.7vw,1.45rem)] font-medium leading-[1.22] tracking-[-0.03em] text-white group-hover:text-emerald-100 transition-colors">
                      Jelajahi Semua Proyek
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-10 text-[0.8125rem] leading-5 text-white/80">
                      Temukan inspirasi hunian modern dari portofolio karya Titik Huni.
                    </p>
                    <span className="mt-auto flex items-center justify-between gap-3 border-t border-white/20 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white">
                      Selengkapnya
                      <ArrowRight
                        size={16}
                        className="shrink-0 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </article>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-white px-6 py-20 text-center">
            <p className="text-lg font-medium tracking-tight">Proyek pilihan sedang dikurasi.</p>
            <p className="mt-2 text-sm text-foreground-muted">Kunjungi kembali untuk melihat karya terbaru Titik Huni.</p>
          </div>
        )}
      </div>
    </div>
  );
}
