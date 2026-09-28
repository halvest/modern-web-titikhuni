export type SellingPoint = {
  text: string;
  symbol?: string;
};

export interface PropertyFormData {
  id?: string;
  // Overview
  title: string;
  slug: string;
  category_id: string;
  description: string;
  status: string;

  // Pricing
  price: string;
  price_prefix: string;
  price_suffix: string;

  // Location
  location: string;
  village: string;
  district: string;
  city: string;
  province: string;
  full_address: string;

  // Selling points
  selling_points: SellingPoint[];

  // Details
  land_area: string;
  building_area: string;
  floor_count: string;
  bedroom_count: string;
  bathroom_count: string;
  carport_count: string;
  certificate_type: string;
  electricity_power: string;
  water_source: string;
  furnishing: string;

  // Media
  image_url: string;
  gallery: string[];

  // SEO
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  is_indexed: boolean;
  og_image?: string;

  // Publishing
  priority_order?: number;
  is_featured: boolean;
  featured_order: number | null;
}

export type PropertyFieldErrors = Partial<Record<keyof PropertyFormData, string>>;

export type EditorSection =
  | "overview"
  | "pricing"
  | "location"
  | "selling-points"
  | "details"
  | "media"
  | "seo"
  | "publishing";

export type EditorMode = "create" | "edit";
