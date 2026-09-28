/**
 * Centralized definition of Yogyakarta property regions.
 * Single source of truth — do NOT duplicate region slugs elsewhere.
 *
 * These are the ONLY categories treated as geographic regions.
 * Other categories (investasi, minimalis, premium, tips) are property
 * tags/content categories and must NOT be exposed as location filters.
 */

export const PROPERTY_REGIONS = {
  "jogja-utara": {
    label: "Jogja Utara",
    title: "Rumah Dijual di Jogja Utara",
    metaTitle: "Rumah Dijual di Jogja Utara | Titik Huni",
    metaDescription:
      "Temukan rumah dijual di kawasan Jogja Utara dan sekitarnya. Properti terkurasi dengan informasi harga, spesifikasi, lokasi, dan legalitas yang jelas di Titik Huni.",
    intro:
      "Jelajahi pilihan rumah di kawasan Jogja Utara. Wilayah ini mencakup area Sleman dan sekitarnya yang dikenal dengan akses dekat kampus, pusat kota, serta fasilitas modern.",
    breadcrumbLabel: "Jogja Utara",
  },
  "jogja-selatan": {
    label: "Jogja Selatan",
    title: "Rumah Dijual di Jogja Selatan",
    metaTitle: "Rumah Dijual di Jogja Selatan | Titik Huni",
    metaDescription:
      "Cari rumah dijual di kawasan Jogja Selatan — mencakup Bantul dan sekitarnya. Lihat harga, spesifikasi, lokasi, dan detail properti pilihan Titik Huni.",
    intro:
      "Jelajahi pilihan rumah di kawasan Jogja Selatan. Area ini mencakup Bantul dan kecamatan sekitarnya yang dikenal dengan suasana lebih tenang namun tetap dekat pusat aktivitas Yogyakarta.",
    breadcrumbLabel: "Jogja Selatan",
  },
  "jogja-barat": {
    label: "Jogja Barat",
    title: "Rumah Dijual di Jogja Barat",
    metaTitle: "Rumah Dijual di Jogja Barat | Titik Huni",
    metaDescription:
      "Temukan pilihan rumah di kawasan Jogja Barat. Properti dengan harga, spesifikasi, dan lokasi lengkap tersedia di katalog Titik Huni.",
    intro:
      "Jelajahi pilihan rumah di kawasan Jogja Barat. Temukan properti berdasarkan lokasi, spesifikasi bangunan, dan kebutuhan tempat tinggal maupun investasi di wilayah ini.",
    breadcrumbLabel: "Jogja Barat",
  },
  "jogja-timur": {
    label: "Jogja Timur",
    title: "Rumah Dijual di Jogja Timur",
    metaTitle: "Rumah Dijual di Jogja Timur | Titik Huni",
    metaDescription:
      "Cari rumah dijual di kawasan Jogja Timur. Lihat harga, lokasi, dan spesifikasi properti pilihan yang tersedia di Titik Huni.",
    intro:
      "Jelajahi pilihan rumah di kawasan Jogja Timur. Temukan properti dengan informasi harga, spesifikasi, dan legalitas yang lengkap untuk kebutuhan hunian maupun investasi.",
    breadcrumbLabel: "Jogja Timur",
  },
} as const;

export type RegionSlug = keyof typeof PROPERTY_REGIONS;

export const REGION_SLUGS = Object.keys(PROPERTY_REGIONS) as RegionSlug[];

export function isRegionSlug(slug: string): slug is RegionSlug {
  return REGION_SLUGS.includes(slug as RegionSlug);
}

export function getRegionConfig(slug: RegionSlug) {
  return PROPERTY_REGIONS[slug];
}
