import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function HomeServices() {
  return (
    <section
      id="layanan"
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-transparent py-10 md:py-14 lg:py-16"
      aria-labelledby="services-title"
    >
      <div className="site-container">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-surface-muted sm:aspect-[16/10] lg:col-span-5 lg:aspect-[4/3]">
            <Image
              src="/assets/images/rumah-bangunjiwo-2.jpg"
              alt="Layanan arsitek dan kontraktor bangun rumah Titik Huni di Yogyakarta"
              fill
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                Studio rancang bangun · Yogyakarta
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-white/95 sm:text-base">
                Dari perancangan arsitektur hingga serah terima bangunan.
              </p>
            </figcaption>
          </figure>

          <ScrollReveal className="lg:col-span-7">
          <article>
            <p className="site-eyebrow text-primary before:bg-primary">
              Arsitek &amp; Kontraktor
            </p>

            <h2
              id="services-title"
              className="mt-4 max-w-xl text-balance text-[clamp(2rem,3.8vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em] text-foreground lg:mt-5"
            >
              Bangun rumah di lahan Anda sendiri.
            </h2>

            <p className="mt-4 max-w-xl text-pretty text-base font-normal leading-relaxed text-foreground-muted sm:text-[1.0625rem] lg:mt-5">
              Titik Huni menyediakan layanan desain arsitektur, perencanaan anggaran, dan pembangunan rumah terintegrasi di Yogyakarta. Kami mendampingi Anda mulai dari konsultasi kebutuhan ruang hingga konstruksi dengan pengawasan terukur dan kualitas material yang terpercaya.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-y border-border-strong/40 py-3.5 text-xs text-foreground-soft sm:gap-3 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                Desain arsitektur
              </span>
              <span className="text-border-strong">•</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                Konstruksi &amp; pengawasan
              </span>
              <span className="text-border-strong">•</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                Konsultasi kebutuhan &amp; anggaran
              </span>
            </div>

            <div className="mt-7">
              <Link
                href="/arsitek-kontraktor"
                className="site-button-secondary group"
              >
                Lihat layanan arsitek &amp; kontraktor
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
