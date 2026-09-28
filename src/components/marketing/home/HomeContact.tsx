import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const homeWhatsApp = `https://wa.me/${siteConfig.organization.telephone.replace(/\D/g, "")}?text=${encodeURIComponent("Halo Titik Huni, saya ingin konsultasi mengenai hunian dan layanan pembangunan rumah di Yogyakarta.")}`;

export function HomeContact() {
  return (
    <section
      id="kontak"
      aria-labelledby="contact-title"
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-transparent py-10 text-foreground md:py-14 lg:py-16"
    >
      <div className="site-container">
        <div className="grid items-center gap-6 rounded-[1.5rem] bg-[linear-gradient(115deg,#f3f8f3_0%,#e8f1e9_100%)] px-6 py-8 sm:px-8 md:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 lg:px-10 lg:py-12">
          <div>
            <p className="site-eyebrow text-primary before:bg-primary">Konsultasi &amp; Kunjungan</p>
            <h2
              id="contact-title"
              className="mt-4 max-w-[45rem] text-balance text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.05em] lg:mt-5"
            >
              Punya rencana untuk rumah Anda?
            </h2>
          </div>

          <div>
            <p className="max-w-md text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
              Diskusikan rencana hunian Anda—mulai dari cek ketersediaan unit,
              jadwal survei lokasi, hingga rancang bangun rumah di Yogyakarta
              bersama tim Titik Huni.
            </p>
            <a
              href={homeWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="homepage_final_cta"
              className="site-button-primary mt-6 w-full sm:w-auto"
            >
              <span className="inline-flex items-center gap-3">
                <MessageCircle size={16} aria-hidden="true" />
                Konsultasi via WhatsApp
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
