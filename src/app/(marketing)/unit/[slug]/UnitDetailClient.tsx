"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  MapPin,
  Maximize2,
  MessageCircle,
} from "lucide-react";
import { PROPERTY_REGIONS, type RegionSlug } from "@/config/regions";
import { siteConfig } from "@/config/site";
import { formatUnitPrice, getUnitLocationLabel, getUnitLocationParts } from "@/lib/unit-display";
import { ExpandableDescription } from "./ExpandableDescription";
import { MobileStickyCta } from "./MobileStickyCta";
import { UnitGallery } from "./UnitGallery";
import { trackUnitDetail, trackWhatsAppClick } from "@/lib/tracking/gtm";

export type SellingPoint = { text: string; symbol?: string };

export type UnitDetail = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  village?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  full_address?: string | null;
  image_url: string | null;
  gallery?: string[] | null;
  selling_points?: SellingPoint[] | null;
  land_area?: number | null;
  building_area?: number | null;
  floor_count?: number | null;
  bedroom_count?: number | null;
  bathroom_count?: number | null;
  carport_count?: number | null;
  certificate_type?: string | null;
  electricity_power?: number | null;
  water_source?: string | null;
  furnishing?: string | null;
  description?: string | null;
  price: number;
  price_prefix?: string | null;
  price_suffix?: string | null;
  status?: string | null;
  categories?: { name: string; slug: string } | null;
};

const specValue = (value: number | string | null | undefined, suffix = "") =>
  value !== null && value !== undefined && value !== "" ? `${value}${suffix}` : "Hubungi Agen";

const statusLabel: Record<string, string> = {
  Tersedia: "Tersedia",
  Booked: "Dipesan",
  Sold: "Terjual",
  "Coming Soon": "Coming Soon",
};

export default function UnitDetailClient({ unit }: { unit: UnitDetail }) {
  const hasTrackedViewRef = useRef<string | null>(null);

  useEffect(() => {
    if (unit.slug && hasTrackedViewRef.current !== unit.slug) {
      hasTrackedViewRef.current = unit.slug;
      trackUnitDetail({
        title: unit.title,
        slug: unit.slug,
        price: unit.price,
        status: unit.status,
      });
    }
  }, [unit.slug, unit.title, unit.price, unit.status]);

  const gallery = Array.from(new Set([unit.image_url, ...(unit.gallery || [])].filter(Boolean))) as string[];
  const regionSlug = unit.categories?.slug as RegionSlug | undefined;
  const region = regionSlug && PROPERTY_REGIONS[regionSlug] ? PROPERTY_REGIONS[regionSlug] : null;
  const locationLabel = getUnitLocationLabel(unit);
  const locationParts = getUnitLocationParts(unit);
  const structuredLocation = [unit.village, unit.district, unit.city, unit.province];
  const structuredLabels = ["Kelurahan / Area", "Kecamatan", "Kabupaten / Kota", "Provinsi"];
  const locationRows = structuredLocation.some(Boolean)
    ? structuredLocation.map((value, index) => ({ label: structuredLabels[index], value })).filter((item) => item.value)
    : locationParts.map((value, index) => ({ label: structuredLabels[structuredLabels.length - locationParts.length + index] || "Lokasi", value }));
  const priceLabel = formatUnitPrice({ price: unit.price, prefix: unit.price_prefix, suffix: unit.price_suffix, status: unit.status });
  const phone = siteConfig.organization.telephone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Halo Titik Huni, saya tertarik dengan ${unit.title} di ${locationLabel}. Apakah unitnya masih tersedia?`)}`;
  const surveyUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Halo Titik Huni, saya ingin menjadwalkan survei untuk ${unit.title} di ${locationLabel}.`)}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.full_address || locationLabel)}`;
  const sellingPoints = Array.isArray(unit.selling_points) ? unit.selling_points.filter((point) => point?.text) : [];

  const quickSpecs = [
    { icon: BedDouble, label: "KT", value: specValue(unit.bedroom_count) },
    { icon: Bath, label: "KM", value: specValue(unit.bathroom_count) },
    { icon: Maximize2, label: "LT", value: specValue(unit.land_area, " m²") },
    { icon: Building2, label: "LB", value: specValue(unit.building_area, " m²") },
    { icon: CarFront, label: "Carport", value: specValue(unit.carport_count) },
  ];

  const specGroups = [
    {
      title: "Dimensi",
      items: [
        ["Luas Tanah", specValue(unit.land_area, " m²")],
        ["Luas Bangunan", specValue(unit.building_area, " m²")],
        ["Jumlah Lantai", specValue(unit.floor_count)],
      ],
    },
    {
      title: "Ruangan",
      items: [
        ["Kamar Tidur", specValue(unit.bedroom_count)],
        ["Kamar Mandi", specValue(unit.bathroom_count)],
        ["Carport", unit.carport_count !== null && unit.carport_count !== undefined ? `${unit.carport_count} mobil` : "Hubungi Agen"],
      ],
    },
    {
      title: "Legalitas & Utilitas",
      items: [
        ["Sertifikat", specValue(unit.certificate_type)],
        ["Daya Listrik", unit.electricity_power ? `${unit.electricity_power.toLocaleString("id-ID")} VA` : "Hubungi Agen"],
        ["Sumber Air", specValue(unit.water_source)],
      ],
    },
    { title: "Kondisi", items: [["Furnishing", specValue(unit.furnishing)]] },
  ];

  return (
    <>
      <main id="main-content" tabIndex={-1} className="bg-background pb-24 text-foreground lg:pb-14">
        <article>
        <nav aria-label="Breadcrumb" className="border-b border-border bg-white pt-[var(--header-height)]">
          <div className="site-container flex min-h-12 items-center gap-1.5 overflow-hidden text-xs text-foreground-soft sm:gap-2">
            <Link href="/" className="shrink-0 hover:text-primary">Beranda</Link>
            <ChevronRight size={13} className="shrink-0" aria-hidden="true" />
            <Link href="/unit" className="shrink-0 hover:text-primary">Unit</Link>
            {region && <><ChevronRight size={13} className="shrink-0" aria-hidden="true" /><Link href={`/unit/${regionSlug}`} className="shrink-0 hover:text-primary">{region.label}</Link></>}
            <ChevronRight size={13} className="shrink-0" aria-hidden="true" />
            <span className="truncate text-foreground" aria-current="page">{unit.title}</span>
          </div>
        </nav>

        <div>
          <div className="site-container py-4 sm:py-6 lg:py-8">
            <UnitGallery images={gallery} title={unit.title} />

            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12">
              <div className="min-w-0">
                <header className="border-b border-border pb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                      {statusLabel[unit.status || ""] || unit.status || "Tersedia"}
                    </span>
                    {region && <span className="text-xs font-medium text-foreground-soft">{region.label}</span>}
                  </div>
                  <h1 className="mt-3 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-[2.65rem]">{unit.title}</h1>
                  <p className="mt-3 flex items-start gap-2 text-sm text-foreground-muted sm:text-base"><MapPin size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />{locationLabel}</p>
                  <p className="mt-5 text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl lg:hidden">{priceLabel}</p>

                  <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-white sm:grid-cols-5">
                    {quickSpecs.map(({ icon: Icon, label, value }, index) => (
                      <div key={label} className={`flex min-w-0 items-center gap-2.5 px-3 py-3.5 sm:px-4 ${index % 2 === 1 ? "border-l border-border" : ""} ${index >= 2 ? "border-t border-border" : ""} ${index > 0 ? "sm:border-l sm:border-border" : ""} sm:border-t-0 ${index === quickSpecs.length - 1 && quickSpecs.length % 2 !== 0 ? "col-span-2 sm:col-span-1" : ""}`}>
                        <Icon size={18} className="shrink-0 text-primary" strokeWidth={1.7} aria-hidden="true" />
                        <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-soft">{label}</p><p className="truncate text-sm font-semibold text-foreground">{value}</p></div>
                      </div>
                    ))}
                  </div>
                </header>

                <div className="divide-y divide-border">
                  {sellingPoints.length > 0 && (
                    <section aria-labelledby="selling-points-heading" className="py-7 sm:py-8">
                      <h2 id="selling-points-heading" className="text-xl font-semibold tracking-tight text-foreground">Keunggulan Properti</h2>
                      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {sellingPoints.map((point, index) => (
                          <li key={`${point.text}-${index}`} className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-foreground">
                            {point.symbol ? <span className="flex h-6 min-w-6 items-center justify-center text-primary" aria-hidden="true">{point.symbol}</span> : <Check size={17} className="shrink-0 text-primary" aria-hidden="true" />}
                            <span>{point.text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section aria-labelledby="about-heading" className="py-7 sm:py-8">
                    <h2 id="about-heading" className="text-xl font-semibold tracking-tight text-foreground">Tentang Properti</h2>
                    <div className="mt-4"><ExpandableDescription text={unit.description || "Informasi lengkap properti dapat dikonsultasikan langsung dengan tim Titik Huni."} /></div>
                  </section>

                  <section aria-labelledby="specifications-heading" className="py-7 sm:py-8">
                    <h2 id="specifications-heading" className="text-xl font-semibold tracking-tight text-foreground">Spesifikasi</h2>
                    <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4">
                      {specGroups.map((group) => (
                        <div key={group.title} className="min-w-0">
                          <h3 className="min-h-10 text-sm font-semibold text-foreground">{group.title}</h3>
                          <dl className="divide-y divide-border border-t border-border">
                            {group.items.map(([label, value]) => (
                              <div key={label} className="py-3">
                                <dt className="text-xs text-foreground-soft">{label}</dt>
                                <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section aria-labelledby="location-heading" className="py-7 sm:py-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 id="location-heading" className="text-xl font-semibold tracking-tight text-foreground">Lokasi</h2>
                      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong px-4 text-sm font-semibold text-foreground hover:bg-surface">
                        Lihat Lokasi <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                    <div className="mt-4 grid gap-4 rounded-xl border border-border bg-white p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-soft">Area properti</p>
                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                          {locationRows.map((item, index) => <div key={`${item.value}-${index}`}><p className="text-[11px] text-foreground-soft">{item.label}</p><p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p></div>)}
                        </div>
                        {unit.full_address && <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-foreground-muted">{unit.full_address}</p>}
                      </div>
                      <MapPin size={28} className="hidden text-primary sm:block" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                  </section>

                </div>
              </div>

              <aside aria-label="Hubungi Titik Huni" className="hidden lg:block">
                <div className="sticky top-24 rounded-xl border border-border bg-white p-5 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.25)] xl:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground-soft">Harga properti</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{priceLabel}</p>
                  <div className="mt-4 flex items-center justify-between border-y border-border py-3 text-sm"><span className="text-foreground-soft">Status unit</span><span className="font-semibold text-primary">{statusLabel[unit.status || ""] || unit.status || "Tersedia"}</span></div>
                  <p className="mt-4 text-sm leading-6 text-foreground-muted">Tanyakan ketersediaan, skema pembayaran, dan jadwal kunjungan langsung kepada tim kami.</p>
                  <div className="mt-5 space-y-2.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta-location="unit_detail_sidebar"
                      onClick={() => trackWhatsAppClick("unit_detail_sidebar", "Hubungi via WhatsApp", whatsappUrl)}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
                    >
                      <MessageCircle size={17} /> Hubungi via WhatsApp
                    </a>
                    <a
                      href={surveyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta-location="unit_detail_survey"
                      onClick={() => trackWhatsAppClick("unit_detail_survey", "Jadwalkan Survey", surveyUrl)}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-border-strong px-4 text-sm font-semibold text-foreground hover:bg-surface"
                    >
                      <CalendarDays size={17} /> Jadwalkan Survey
                    </a>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-foreground-soft">Harga, spesifikasi, dan ketersediaan dapat berubah. Konfirmasikan kembali bersama tim Titik Huni.</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
        </article>
      </main>
      <MobileStickyCta price={priceLabel} whatsappUrl={whatsappUrl} />
    </>
  );
}
