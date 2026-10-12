import Link from "next/link";
import { cache } from "react";
import { ArrowRight } from "lucide-react";
import { CatalogFilter } from "@/components/marketing/units/catalog-filter";
import { createPublicClient } from "@/utils/supabase/server";
import { ScrollReveal } from "@/components/ScrollReveal";

export const getFeaturedUnits = cache(async () => {
  const supabase = createPublicClient();

  return supabase
    .from("units")
    .select(
      "id, title, slug, location, price, price_prefix, certificate_type, status, image_url, land_area, building_area, bedroom_count, bathroom_count, carport_count, featured_order",
    )
    .is("deleted_at", null)
    .in("status", ["Tersedia", "Sold", "Coming Soon"])
    .eq("is_featured", true)
    .order("featured_order", { ascending: true })
    .limit(6);
});

export async function Unit() {
  const { data: units, error } = await getFeaturedUnits();

  return (
    <section
      id="unit"
      className="scroll-mt-20 overflow-hidden bg-transparent py-12 sm:py-16 lg:py-20"
      aria-labelledby="catalog-title"
    >
      <div className="site-container">
        <ScrollReveal>
        <header className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>Listing Titik Huni - Yogyakarta</span>
            </div>
            <h2
              id="catalog-title"
              className="mt-4 max-w-4xl text-balance text-[clamp(1.875rem,4.5vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.045em] text-foreground lg:mt-5"
            >
              Rumah dijual di{" "}
              <span className="text-primary">Yogyakarta.</span>
            </h2>
          </div>
          <p className="max-w-xl text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7 md:col-span-4 md:justify-self-end">
            Jelajahi rumah modern Titik Huni di Yogyakarta: unit tersedia,
            hunian terjual, dan proyek yang segera hadir.
          </p>
        </header>
        </ScrollReveal>

        <div className="pt-7 lg:pt-9">
          {error || !units?.length ? (
            <div className="rounded-[1.25rem] border border-border bg-background px-6 py-8 sm:px-8 text-center sm:text-left">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-foreground-soft">
                Informasi unit pilihan
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-foreground">
                {error
                  ? "Unit pilihan belum dapat dimuat"
                  : "Kurasi hunian terbaru segera hadir"}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-7 text-foreground-muted">
                Lihat katalog lengkap atau hubungi tim kami untuk mengetahui
                hunian yang saat ini tersedia.
              </p>
            </div>
          ) : (
            <>
              <CatalogFilter units={units as any} hideStats />
            </>
          )}

          <footer className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center lg:mt-10">
            <p className="max-w-lg text-xs leading-6 text-foreground-soft">
              Harga dan ketersediaan dapat berubah. Konfirmasikan detail unit
              sebelum menjadwalkan kunjungan.
            </p>
            <Link
              href="/unit"
              className="site-link-editorial group"
            >
              Lihat semua listing
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
}
