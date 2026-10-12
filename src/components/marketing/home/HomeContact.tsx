import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ScrollReveal } from "@/components/ScrollReveal";

export const homeWhatsApp = `https://wa.me/${siteConfig.organization.telephone.replace(/\D/g, "")}?text=${encodeURIComponent("Halo Titik Huni, saya ingin konsultasi mengenai hunian dan layanan pembangunan rumah di Yogyakarta.")}`;

export function HomeContact() {
  return (
    <section
      id="kontak"
      aria-labelledby="contact-title"
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-transparent py-10 text-foreground md:py-14 lg:py-16"
    >
      <div className="site-container">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-[#CFDDD1] bg-[#F1F6F2] p-7 sm:p-10 md:p-12 lg:p-14 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>Konsultasi &amp; Kunjungan</span>
                </div>

                <h2
                  id="contact-title"
                  className="mt-3 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.15]"
                >
                  Punya rencana untuk rumah Anda?
                </h2>

                <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base sm:leading-7">
                  Diskusikan rencana hunian Anda—mulai dari cek ketersediaan unit,
                  jadwal survei lokasi, hingga rancang bangun rumah di Yogyakarta
                  bersama tim Titik Huni.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3.5 sm:items-stretch lg:col-span-5 lg:items-end">
                <a
                  href={homeWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source="homepage_final_cta"
                  className="site-button-primary group/cta w-full justify-center py-3.5 text-[15px] font-medium shadow-xs hover:shadow-md transition-all sm:w-auto"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  <span>Konsultasi via WhatsApp</span>
                  <ArrowUpRight
                    size={16}
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
  );
}
