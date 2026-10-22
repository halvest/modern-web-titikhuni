import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { RegionNav } from "@/components/marketing/units/region-nav";
import { UnitCard, type CatalogUnit } from "@/components/marketing/units/unit-card";
import { siteConfig } from "@/config/site";
import {
  PROPERTY_REGIONS,
  type RegionSlug,
} from "@/config/regions";

interface RegionPageProps {
  regionSlug: RegionSlug;
  units: CatalogUnit[];
  error: boolean;
}

const STATUS_RANK: Record<string, number> = {
  Tersedia: 0,
  "Coming Soon": 1,
  Booked: 2,
  Sold: 3,
};

function sortUnits(units: CatalogUnit[]): CatalogUnit[] {
  return [...units].sort(
    (a, b) =>
      (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9) ||
      (a.priority_order ?? Number.MAX_SAFE_INTEGER) -
        (b.priority_order ?? Number.MAX_SAFE_INTEGER) ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

export function RegionPage({ regionSlug, units: rawUnits, error }: RegionPageProps) {
  const config = PROPERTY_REGIONS[regionSlug];
  const units = sortUnits(rawUnits);
  
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Halo Titik Huni, saya tertarik mencari rumah di kawasan ${config.label}. Bisa bantu rekomendasikan pilihan terbaik?`
  );

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background pt-[var(--header-height)] text-foreground"
    >
      <section className="site-section pb-14 md:pb-[4.5rem]">
        <div className="site-container grid items-end gap-9 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="site-eyebrow">Katalog · {config.label}</p>
            <h1 className="mt-5 max-w-5xl text-balance text-[clamp(3rem,7vw,6.75rem)] font-medium leading-[0.93] tracking-[-0.06em]">
              {config.title}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-pretty text-base leading-8 text-foreground-muted">
              {config.intro}
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="region_catalog_intro"
              className="site-button-primary mt-6"
            >
              Konsultasi pencarian
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-14 md:py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-9 flex flex-col justify-between gap-3 border-b border-border pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="site-eyebrow">Pilih kawasan</p>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                {units.length} pilihan di {config.label}
              </h2>
            </div>
            <Link
              href="/unit"
              className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-foreground-muted transition hover:text-primary"
            >
              Semua wilayah <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <RegionNav activeRegion={regionSlug} />

          {error ? (
            <div className="rounded-[1.5rem] border border-border bg-background p-10 text-center sm:p-14">
              <p className="font-medium text-foreground">
                Katalog belum dapat dimuat.
              </p>
              <p className="mt-2 text-sm text-foreground-soft">
                Silakan coba kembali beberapa saat lagi.
              </p>
            </div>
          ) : units.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {units.map((unit, index) => (
                <UnitCard key={unit.id} unit={unit} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-border bg-background p-10 text-center sm:p-16">
              <Search
                size={40}
                className="mx-auto mb-4 text-foreground-soft"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h2 className="text-2xl font-medium tracking-[-0.035em] text-foreground">
                Belum ada properti aktif di {config.label}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-7 text-foreground-soft">
                Katalog wilayah ini sedang diperbarui. Tim kami dapat membantu
                mencarikan alternatif yang sesuai dengan kebutuhan Anda.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/unit" className="site-button-secondary">
                  Lihat semua wilayah
                </Link>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="region_catalog_empty_state"
                  className="site-button-primary"
                >
                  Konsultasi WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
