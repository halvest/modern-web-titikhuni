import { cache } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { resolveSeoRedirect } from "@/lib/seo/redirects";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { createPublicClient } from "@/utils/supabase/server";
import { isRegionSlug, PROPERTY_REGIONS, type RegionSlug } from "@/config/regions";
import { RegionPage } from "@/components/marketing/units/RegionPage";
import UnitDetailClient from "./UnitDetailClient";
import type { CatalogUnit } from "@/components/marketing/units/unit-card";
import { formatUnitPrice, getUnitLocationLabel } from "@/lib/unit-display";

export const revalidate = 1800; // Edge ISR 30 mins

type Props = {
  params: Promise<{ slug: string }>;
};

const getUnitBySlug = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data: unit, error } = await supabase
    .from("units")
    .select(
      `
      id, title, slug, category_id, location, village, district, city, province, full_address,
      price, price_prefix, price_suffix, status, image_url, gallery, selling_points,
      land_area, building_area, floor_count, bedroom_count, bathroom_count, carport_count,
      certificate_type, electricity_power, water_source, furnishing,
      description, priority_order, created_at, updated_at,
      is_indexed, seo_title, meta_description, canonical_url, og_image,
      categories ( name, slug )
    `
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .neq("status", "Draft")
    .maybeSingle();

  return { unit, error };
});

export async function generateStaticParams() {
  const regionParams = Object.keys(PROPERTY_REGIONS).map((slug) => ({ slug }));
  const supabase = createPublicClient();
  const { data: units } = await supabase
    .from("units")
    .select("slug")
    .is("deleted_at", null)
    .neq("status", "Draft");

  const unitParams = (units ?? []).map((u) => ({ slug: u.slug }));
  return [...regionParams, ...unitParams];
}

/* ============================================================
   GENERATE METADATA
   Handles both region slugs and property slugs.
   ============================================================ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Region pages have their own static metadata
  if (isRegionSlug(slug)) {
    const config = PROPERTY_REGIONS[slug];
    const regionUrl = `${siteConfig.url}/unit/${slug}`;
    return {
      title: { absolute: config.metaTitle },
      description: config.metaDescription,
      alternates: { canonical: regionUrl },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title: config.metaTitle,
        description: config.metaDescription,
        url: regionUrl,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        type: "website",
        images: [{ url: `${siteConfig.url}/og.jpg`, width: 1200, height: 630, alt: config.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: config.metaTitle,
        description: config.metaDescription,
        images: [`${siteConfig.url}/og.jpg`],
      },
    };
  }

  // Property detail metadata
  const { unit } = await getUnitBySlug(slug);

  if (!unit) {
    return {
      title: "Properti Tidak Ditemukan | Titik Huni",
    };
  }

  const isComingSoon = unit.status === "Coming Soon";
  const isNoindex = isComingSoon || unit.is_indexed === false;

  const conciseLocation = getConciseLocation(unit);
  let resolvedTitle: string;
  if (isComingSoon) {
    resolvedTitle = `${unit.title} — Segera Hadir | Titik Huni`;
  } else if (unit.seo_title && unit.seo_title.length >= 25) {
    resolvedTitle = unit.seo_title;
  } else if (unit.seo_title) {
    const brandPrefix = unit.seo_title.toLowerCase().includes("titik huni") ? "" : "Titik Huni ";
    resolvedTitle = `${brandPrefix}${unit.seo_title} | Rumah di ${conciseLocation} | Titik Huni`;
  } else {
    const titleBase = unit.title.toLowerCase().startsWith("titik huni")
      ? unit.title
      : `Titik Huni ${unit.title}`;
    resolvedTitle = `${titleBase} | Rumah di ${conciseLocation} | Titik Huni`;
  }

  const resolvedDesc = isComingSoon
    ? "Informasi unit properti segera hadir dari Titik Huni di Yogyakarta. Simak pembaruan spesifikasi dan ketersediaan."
    : unit.meta_description
    ? sanitizeMetaDescription(unit.meta_description)
    : buildDescription(unit);

  return generateSeoMetadata({
    title: resolvedTitle,
    description: resolvedDesc,
    path: `/unit/${slug}`,
    imageUrl: unit.og_image || unit.image_url || undefined,
    noindex: isNoindex,
    canonicalUrl: unit.canonical_url || undefined,
  });
}

/* ============================================================
   HELPERS
   ============================================================ */
function getConciseLocation(unit: {
  location?: string | null;
  village?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
}) {
  const parts = [unit.village, unit.district, unit.city]
    .map((v) => v?.trim())
    .filter(Boolean) as string[];

  if (parts.length >= 2) {
    return parts.slice(0, 2).join(", ");
  }
  if (parts.length === 1) return parts[0];

  const legacy = (unit.location || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  // Normalize known typos
  const normalized = legacy.map((p) => (p.toLowerCase() === "bebah" ? "Berbah" : p));

  if (normalized.length >= 3 && normalized[normalized.length - 1].toLowerCase().includes("yogya")) {
    return normalized.slice(0, 2).join(", ");
  }
  if (normalized.length >= 2 && normalized[normalized.length - 1].toLowerCase().includes("yogya")) {
    return normalized[0];
  }
  if (normalized.length >= 2) {
    return normalized.slice(0, 2).join(", ");
  }
  return normalized[0] || "Yogyakarta";
}

function sanitizeMetaDescription(desc: string, maxLen = 160): string {
  const clean = desc.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const truncated = clean.slice(0, maxLen - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

function buildDescription(unit: {
  title: string;
  location?: string | null;
  village?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  price?: number | null;
  price_prefix?: string | null;
  price_suffix?: string | null;
  status?: string | null;
  bedroom_count?: number | null;
  land_area?: number | null;
  certificate_type?: string | null;
}) {
  const locationLabel = getUnitLocationLabel(unit);
  const formattedPrice = formatUnitPrice({
    price: unit.price,
    prefix: unit.price_prefix,
    suffix: unit.price_suffix,
    status: unit.status,
  });
  const pricePhrase = unit.price_prefix
    ? `${formattedPrice.charAt(0).toLowerCase()}${formattedPrice.slice(1)}`
    : `seharga ${formattedPrice}`;
  const specs = [
    unit.bedroom_count ? `${unit.bedroom_count} kamar tidur` : null,
    unit.land_area ? `luas tanah ${unit.land_area} m²` : null,
    unit.certificate_type || null,
  ].filter(Boolean);
  return `${unit.title} di ${locationLabel} ${pricePhrase}. ${specs.join(", ")}${specs.length ? ". " : ""}Lihat detail dan jadwalkan survey bersama Titik Huni.`.slice(0, 160);
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default async function UnitSlugPage({ params }: Props) {
  const { slug } = await params;

  /* ── REGION PAGE ──────────────────────────────────────── */
  if (isRegionSlug(slug)) {
    const regionSlug = slug as RegionSlug;
    const supabase = createPublicClient();

    const { data: rawUnits, error } = await supabase
      .from("units")
      .select(
        "id, title, slug, location, price, price_prefix, certificate_type, status, image_url, land_area, building_area, bedroom_count, bathroom_count, carport_count, priority_order, created_at, updated_at, categories:category_id(name, slug)"
      )
      .is("deleted_at", null)
      .neq("status", "Draft");

    // Filter client-side after normalization with location fallback
    const units: CatalogUnit[] = ((rawUnits ?? []) as unknown as Array<
      Omit<CatalogUnit, "category"> & {
        categories: CatalogUnit["category"] | CatalogUnit["category"][];
      }
    >)
      .map((row) => {
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
      })
      .filter((unit) => unit.category?.slug === regionSlug);

    return (
      <RegionPage
        regionSlug={regionSlug}
        units={units}
        error={Boolean(error)}
      />
    );
  }

  /* ── PROPERTY DETAIL PAGE ────────────────────────────── */
  const { unit, error } = await getUnitBySlug(slug);

  if (error || !unit) {
    const redirectPath = await resolveSeoRedirect(`/unit/${slug}`);
    if (redirectPath) permanentRedirect(redirectPath);
    notFound();
  }

  // Normalize categories field
  const categories = Array.isArray(unit.categories)
    ? unit.categories[0] ?? null
    : unit.categories ?? null;
  const normalizedUnit = { ...unit, categories };

  const regionSlug = categories?.slug as RegionSlug | undefined;

  /* JSON-LD */
  const availabilityMap: Record<string, string> = {
    Tersedia: "https://schema.org/InStock",
    Booked: "https://schema.org/Reserved",
    Sold: "https://schema.org/SoldOut",
    "Coming Soon": "https://schema.org/PreOrder",
  };

  const pageUrl = `${siteConfig.url}/unit/${slug}`;
  const locationLabel = getUnitLocationLabel(unit);
  const images = Array.from(new Set([unit.image_url, ...(unit.gallery || [])].filter(Boolean)));
  const additionalProperty = [
    unit.land_area && { "@type": "PropertyValue", name: "Luas Tanah", value: unit.land_area, unitText: "m²" },
    unit.floor_count && { "@type": "PropertyValue", name: "Jumlah Lantai", value: unit.floor_count },
    unit.carport_count !== null && unit.carport_count !== undefined && { "@type": "PropertyValue", name: "Carport", value: unit.carport_count },
    unit.certificate_type && { "@type": "PropertyValue", name: "Sertifikat", value: unit.certificate_type },
    unit.electricity_power && { "@type": "PropertyValue", name: "Daya Listrik", value: unit.electricity_power, unitText: "VA" },
    unit.water_source && { "@type": "PropertyValue", name: "Sumber Air", value: unit.water_source },
    unit.furnishing && { "@type": "PropertyValue", name: "Furnishing", value: unit.furnishing },
  ].filter(Boolean);
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Beranda", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Rumah Yogyakarta", item: `${siteConfig.url}/unit` },
    ...(regionSlug && isRegionSlug(regionSlug)
      ? [
          {
            "@type": "ListItem",
            position: 3,
            name: PROPERTY_REGIONS[regionSlug].breadcrumbLabel,
            item: `${siteConfig.url}/unit/${regionSlug}`,
          },
          { "@type": "ListItem", position: 4, name: unit.title, item: pageUrl },
        ]
      : [{ "@type": "ListItem", position: 3, name: unit.title, item: pageUrl }]),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        "@id": `${pageUrl}#listing`,
        name: unit.title,
        description: unit.description || `Properti dijual di ${locationLabel}.`,
        image: images,
        url: pageUrl,
        itemOffered: {
          "@type": "SingleFamilyResidence",
          "@id": `${pageUrl}#property`,
          name: unit.title,
          image: images,
          numberOfBedrooms: unit.bedroom_count || undefined,
          numberOfBathroomsTotal: unit.bathroom_count || undefined,
          floorSize: unit.building_area
            ? { "@type": "QuantitativeValue", value: unit.building_area, unitText: "m²" }
            : undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: unit.full_address || undefined,
            addressLocality: unit.village || unit.district || unit.location || undefined,
            addressRegion: unit.city || unit.province || "Daerah Istimewa Yogyakarta",
            addressCountry: "ID",
          },
          additionalProperty,
        },
        offers: {
          "@type": "Offer",
          ...(unit.status === "Coming Soon" ? {} : { price: unit.price }),
          priceCurrency: "IDR",
          availability:
            availabilityMap[unit.status ?? ""] ||
            "https://schema.org/LimitedAvailability",
          url: pageUrl,
        },
        seller: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <UnitDetailClient unit={normalizedUnit} />
    </>
  );
}
