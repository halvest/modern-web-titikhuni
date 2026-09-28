"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Search, SlidersHorizontal, X } from "lucide-react";

export type CatalogFilterState = {
  q: string;
  location: string;
  category: string;
  budget: string;
  status: string;
  sort: string;
};

type FilterOption = { value: string; label: string };

export function CatalogFilters({
  value,
  locations,
  categories,
}: {
  value: CatalogFilterState;
  locations: FilterOption[];
  categories: FilterOption[];
}) {
  const router = useRouter();
  const [filters, setFilters] = useState(value);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setFilters(value), [value]);

  const update = (field: keyof CatalogFilterState, nextValue: string) => {
    setFilters((current) => ({ ...current, [field]: nextValue }));
  };

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, currentValue]) => {
      const cleanValue = currentValue.trim();
      if (cleanValue) params.set(key, cleanValue);
    });
    startTransition(() => router.push(params.size ? `/unit?${params}` : "/unit"));
  };

  const hasFilters = Object.values(value).some(Boolean);

  const selectClassName =
    "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  const filterFields = (prefix: string) => (
    <>
      <div className="md:min-w-[120px] md:flex-1">
        <label htmlFor={`${prefix}-location`} className="sr-only">Lokasi</label>
        <select id={`${prefix}-location`} value={filters.location} onChange={(event) => update("location", event.target.value)} className={selectClassName}>
          <option value="">Semua lokasi</option>
          {locations.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      {categories.length > 0 && (
        <div className="md:min-w-[120px] md:flex-1">
          <label htmlFor={`${prefix}-category`} className="sr-only">Tipe properti</label>
          <select id={`${prefix}-category`} value={filters.category} onChange={(event) => update("category", event.target.value)} className={selectClassName}>
            <option value="">Semua tipe</option>
            {categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      )}
      <div className="md:min-w-[120px] md:flex-1">
        <label htmlFor={`${prefix}-budget`} className="sr-only">Rentang harga</label>
        <select id={`${prefix}-budget`} value={filters.budget} onChange={(event) => update("budget", event.target.value)} className={selectClassName}>
          <option value="">Semua harga</option>
          <option value="under-600">Hingga Rp600 juta</option>
          <option value="600-800">Rp600–800 juta</option>
          <option value="over-800">Di atas Rp800 juta</option>
        </select>
      </div>
      <div className="md:min-w-[120px] md:flex-1">
        <label htmlFor={`${prefix}-status`} className="sr-only">Status properti</label>
        <select id={`${prefix}-status`} value={filters.status} onChange={(event) => update("status", event.target.value)} className={selectClassName}>
          <option value="">Semua status</option>
          <option value="Tersedia">Tersedia</option>
          <option value="Coming Soon">Coming Soon</option>
          <option value="Booked">Booked</option>
          <option value="Sold">Terjual</option>
        </select>
      </div>
      <div className="md:min-w-[130px] md:flex-1">
        <label htmlFor={`${prefix}-sort`} className="sr-only">Urutkan properti</label>
        <select id={`${prefix}-sort`} value={filters.sort} onChange={(event) => update("sort", event.target.value)} className={selectClassName}>
          <option value="">Tersedia lebih dulu</option>
          <option value="latest">Terbaru</option>
          <option value="price-asc">Harga terendah</option>
          <option value="price-desc">Harga tertinggi</option>
        </select>
      </div>
    </>
  );

  return (
    <form onSubmit={apply} role="search" className="rounded-xl border border-border bg-background p-3 sm:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
        <div className="relative md:min-w-[220px] md:flex-[1.5]">
          <label htmlFor="catalog-search" className="sr-only">Cari lokasi atau nama properti</label>
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-soft" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={filters.q}
            onChange={(event) => update("q", event.target.value)}
            placeholder="Cari lokasi atau nama properti"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-foreground-soft focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="hidden md:contents">{filterFields("desktop")}</div>

        <button
          type="submit"
          disabled={isPending}
          className="hidden h-11 flex-shrink-0 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 md:inline-flex"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : "Terapkan"}
        </button>
      </div>

      <details className="group mt-3 rounded-lg border border-border md:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} aria-hidden="true" />Filter &amp; Urutkan</span>
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="grid grid-cols-1 gap-3 border-t border-border p-3 sm:grid-cols-2">
          {filterFields("mobile")}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-semibold text-white transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 sm:col-span-2"
          >
            {isPending ? <><Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />Memuat...</> : "Terapkan filter"}
          </button>
        </div>
      </details>

      {hasFilters && (
        <div className="mt-3 flex justify-end border-t border-border pt-3">
          <Link
            href="/unit"
            className="inline-flex min-h-10 items-center gap-1.5 px-2 text-sm font-medium text-foreground-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X size={15} aria-hidden="true" />Reset filter
          </Link>
        </div>
      )}
    </form>
  );
}
