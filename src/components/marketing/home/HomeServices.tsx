import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, HardHat, PenTool, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const serviceHighlights: { icon: LucideIcon; label: string }[] = [
  { icon: PenTool, label: "Desain arsitektur" },
  { icon: HardHat, label: "Konstruksi & pengawasan" },
  { icon: Calculator, label: "Konsultasi kebutuhan & anggaran" },
];

export function HomeServices() {
  return (
    <div className="relative overflow-hidden bg-transparent">
      <div className="site-container">
        <div className="grid items-center gap-7 md:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <ScrollReveal className="lg:col-span-5">
            <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-surface-muted sm:aspect-[16/10] sm:rounded-[1.75rem] lg:aspect-[6/5]">
              <Image
                src="/assets/images/rumah-bangunjiwo-2.jpg"
                alt="Layanan arsitek dan kontraktor bangun rumah Titik Huni di Yogyakarta"
                fill
                quality={75}
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover object-center transition-transform duration-1000 ease-out motion-safe:group-hover:scale-[1.035]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/25 bg-black/45 p-4 text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-5">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-emerald-300/90 sm:text-[0.68rem]">
                  Studio rancang bangun · Yogyakarta
                </p>
                <p className="mt-1.5 text-sm font-medium leading-snug text-white sm:text-base">
                  Dari perancangan arsitektur hingga serah terima bangunan.
                </p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7">
            <article>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>Arsitek &amp; Kontraktor</span>
              </div>

              <h2
                id="services-title"
                className="mt-3 max-w-xl text-balance text-[clamp(1.875rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.04em] text-foreground sm:mt-4 lg:mt-5"
              >
                Bangun rumah di lahan Anda sendiri.
              </h2>

              <p className="mt-4 max-w-xl text-pretty text-[0.9375rem] font-normal leading-[1.75] text-foreground-muted sm:text-[1.0625rem] lg:mt-5">
                Titik Huni menyediakan layanan desain arsitektur, perencanaan anggaran, dan pembangunan rumah terintegrasi di Yogyakarta. Kami mendampingi Anda mulai dari konsultasi kebutuhan ruang hingga konstruksi dengan pengawasan terukur dan kualitas material yang terpercaya.
              </p>

              <ul
                className="mt-6 grid gap-2.5 sm:grid-cols-3 sm:gap-3 lg:mt-7 lg:max-w-2xl"
                aria-label="Cakupan layanan"
              >
                {serviceHighlights.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="group flex items-center gap-3 rounded-2xl border border-[#D5E2D7] bg-[#F4F7F4] p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-xs sm:flex-col sm:items-start sm:gap-3 sm:p-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--sage)] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 lg:mt-8">
                <Link
                  href="/arsitek-kontraktor"
                  className="site-button-primary group w-full sm:w-auto"
                >
                  Lihat layanan arsitek &amp; kontraktor
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
