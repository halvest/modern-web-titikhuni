import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import type { CatalogUnit } from "@/components/marketing/units/unit-card";
import { CatalogFilter } from "@/components/marketing/units/catalog-filter";
import { CatalogSections } from "@/components/marketing/units/catalog-sections";
import { siteConfig } from "@/config/site";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 1800; // ISR 30 minutes for ultra-fast TTFB

const PAGE_PATH = "/unit";
const PAGE_URL = `${siteConfig.url}${PAGE_PATH}`;
const PAGE_TITLE = "Katalog Rumah Yogyakarta | Titik Huni";
const PAGE_DESCRIPTION =
  "Katalog rumah di Yogyakarta dari Titik Huni. Temukan pilihan hunian dengan desain fungsional, spesifikasi lengkap, dan harga transparan di Yogyakarta.";
const OG_IMAGE = `${siteConfig.url}/assets/images/konsep_titikhuni.webp`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [{ url: OG_IMAGE, width: 3750, height: 1969, alt: "Konsep hunian Titik Huni di Yogyakarta" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION, images: [OG_IMAGE] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

type RawUnit = Omit<CatalogUnit, "category"> & {
  categories: CatalogUnit["category"] | CatalogUnit["category"][];
};

function normalizeUnit(row: RawUnit): CatalogUnit {
  let category = Array.isArray(row.categories)
    ? row.categories[0] ?? null
    : row.categories;

  if (!category || !category.slug) {
    const loc = (row.location || "").toLowerCase();
    const title = (row.title || "").toLowerCase();
    if (loc.includes("bantul") || loc.includes("kasihan") || title.includes("bangunjiwo") || title.includes("trirenggo")) {
      category = { name: "Jogja Selatan", slug: "jogja-selatan" };
    } else if (loc.includes("kalasan") || loc.includes("berbah") || title.includes("tirtomartani") || title.includes("pinka")) {
      category = { name: "Jogja Timur", slug: "jogja-timur" };
    } else if (loc.includes("pakem") || loc.includes("candibinangun") || loc.includes("sleman")) {
      category = { name: "Jogja Utara", slug: "jogja-utara" };
    } else if (loc.includes("godean") || loc.includes("kulon") || loc.includes("sedayu")) {
      category = { name: "Jogja Barat", slug: "jogja-barat" };
    }
  }

  return { ...row, category };
}

const STATUS_RANK: Record<string, number> = {
  Tersedia: 0,
  Booked: 1,
  Sold: 2,
  "Coming Soon": 10,
};

function sortUnits(units: CatalogUnit[]): CatalogUnit[] {
  return [...units].sort(
    (a, b) =>
      (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9) ||
      (a.priority_order ?? Number.MAX_SAFE_INTEGER) -
        (b.priority_order ?? Number.MAX_SAFE_INTEGER) ||
      Date.parse(b.created_at) - Date.parse(a.created_at) ||
      a.id.localeCompare(b.id)
  );
}

export default async function UnitCatalogPage() {
  const { data: rawUnits, error } = await supabase
    .from("units")
    .select(
      "id, title, slug, location, price, price_prefix, certificate_type, status, image_url, land_area, building_area, bedroom_count, bathroom_count, carport_count, priority_order, created_at, updated_at, categories:category_id(name, slug)"
    )
    .is("deleted_at", null)
    .neq("status", "Draft");

  const allUnits: CatalogUnit[] = ((rawUnits ?? []) as unknown as RawUnit[]).map(
    normalizeUnit
  );
  const units = sortUnits(allUnits);
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    "Halo Titik Huni, saya sedang mencari rumah di Yogyakarta. Bisa bantu rekomendasikan pilihan terbaik?"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "id-ID",
        publisher: { "@id": `${siteConfig.url}/#organization` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        ...(!error && units.length ? { mainEntity: { "@id": `${PAGE_URL}#listings` } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Katalog", item: PAGE_URL },
        ],
      },
      ...(!error && units.length ? [{
        "@type": "ItemList",
        "@id": `${PAGE_URL}#listings`,
        name: "Katalog rumah Titik Huni",
        numberOfItems: units.length,
        itemListElement: units.map((unit, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: unit.status === "Coming Soon"
            ? { "@type": "Thing", name: `${unit.title} — segera hadir` }
            : { "@type": "WebPage", name: unit.title, url: `${PAGE_URL}/${unit.slug}` },
        })),
      }] : []),
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen font-sans text-foreground"
    >
      <script
        id="catalog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="home-content-canvas min-h-screen">
        {/* ========================================================
            1. UNIFIED COMPACT ABOVE-THE-FOLD FRAME
            ======================================================== */}
        <section
          id="pilihan-hunian"
          className="relative pt-[calc(var(--header-height)+1rem)] pb-12 sm:pb-16 md:pt-[calc(var(--header-height)+1.5rem)] md:pb-20"
          aria-labelledby="unit-page-title"
        >
          <div className="site-container relative">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-foreground-soft sm:mb-5">
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
                  Katalog
                </li>
              </ol>
            </nav>

            {/* Compact Editorial Header (Unified in one frame) */}
            <div className="flex flex-col justify-between gap-4 pb-4 lg:flex-row lg:items-end md:pb-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>Katalog Titik Huni · Yogyakarta</span>
                </div>
                <h1
                  id="unit-page-title"
                  className="mt-3 text-balance text-[clamp(2.15rem,4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em] text-foreground"
                >
                  Rumah dijual di <span className="text-primary">Yogyakarta.</span>
                </h1>
              </div>

              <div className="flex flex-col gap-2.5 lg:max-w-md lg:items-end lg:text-right">
                <p className="text-pretty text-sm leading-relaxed text-foreground-muted">
                  Jelajahi hunian terkurasi Titik Huni di Yogyakarta. Bandingkan lokasi, harga, dan spesifikasi arsitektur ruang.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-catalog-cta="consultation-intro"
                  data-cta-location="unit_catalog_intro"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary-hover"
                >
                  <span>Konsultasi Ketersediaan Unit</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Interactive Filters + Responsive Unit Grid */}
            <div className="pt-6 md:pt-8">
              {error ? (
                <div className="rounded-[1.5rem] border border-border bg-white/70 p-10 text-center sm:p-14">
                  <p className="font-medium text-foreground">
                    Katalog belum dapat dimuat saat ini.
                  </p>
                  <p className="mt-2 text-sm text-foreground-muted">
                    Silakan segarkan kembali halaman beberapa saat lagi.
                  </p>
                </div>
              ) : units.length > 0 ? (
                <CatalogFilter units={units} />
              ) : (
                <div className="rounded-[1.5rem] border border-border bg-white/70 p-10 text-center sm:p-16">
                  <Search
                    size={38}
                    className="mx-auto mb-4 text-foreground-soft"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h2 className="text-2xl font-medium tracking-tight text-foreground">
                    Belum ada properti aktif saat ini
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground-muted">
                    Katalog sedang diperbarui. Hubungi tim kami untuk mendapatkan informasi ketersediaan unit terbaru.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta-location="unit_catalog_empty_state"
                    className="site-button-primary mt-6"
                  >
                    Hubungi WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Lower Editorial Sections: Panduan, FAQ, CTA */}
        <CatalogSections
          units={units}
          whatsappUrl={whatsappUrl}
          dataUnavailable={Boolean(error)}
        />
      </div>
    </main>
  );
}
