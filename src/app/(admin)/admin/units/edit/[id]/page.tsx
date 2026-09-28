import { requireAdminPage } from "@/utils/supabase/server";
import { PropertyEditor } from "@/components/admin/units/editor/property-editor";
import { notFound } from "next/navigation";
import { EditorSection, PropertyFormData } from "@/components/admin/units/editor/types";
import { REGION_SLUGS } from "@/config/regions";

export const metadata = {
  title: "Edit Property Unit - Admin",
};

export default async function EditUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ flow?: string; step?: string }>;
}) {
  const [resolvedParams, query] = await Promise.all([params, searchParams]);
  const id = resolvedParams.id;
  const { supabase } = await requireAdminPage();

  // Fetch categories and unit data in parallel
  const [categoriesRes, unitRes] = await Promise.all([
    supabase.from("categories").select("id, name").in("slug", [...REGION_SLUGS]).order("name", { ascending: true }),
    supabase.from("units").select("*").eq("id", id).single(),
  ]);

  if (unitRes.error || !unitRes.data) {
    return notFound();
  }

  const dbUnit = unitRes.data;

  // Map DB data to our Editor state format
  const initialData: PropertyFormData = {
    id: dbUnit.id,
    title: dbUnit.title || "",
    slug: dbUnit.slug || "",
    category_id: dbUnit.category_id || "",
    description: dbUnit.description || "",
    status: dbUnit.status || "Draft",
    price: (dbUnit.price || "").toString(),
    price_prefix: dbUnit.price_prefix || "",
    price_suffix: dbUnit.price_suffix || "",
    location: dbUnit.location || "",
    village: dbUnit.village || "",
    district: dbUnit.district || "",
    city: dbUnit.city || "",
    province: dbUnit.province || "Daerah Istimewa Yogyakarta",
    full_address: dbUnit.full_address || "",
    selling_points: Array.isArray(dbUnit.selling_points) ? dbUnit.selling_points : [],
    land_area: (dbUnit.land_area || "").toString(),
    building_area: (dbUnit.building_area || "").toString(),
    floor_count: (dbUnit.floor_count ?? "").toString(),
    bedroom_count: (dbUnit.bedroom_count || "").toString(),
    bathroom_count: (dbUnit.bathroom_count || "").toString(),
    carport_count: (dbUnit.carport_count ?? "").toString(),
    certificate_type: dbUnit.certificate_type || "",
    electricity_power: (dbUnit.electricity_power ?? "").toString(),
    water_source: dbUnit.water_source || "",
    furnishing: dbUnit.furnishing || "",
    image_url: dbUnit.image_url || "",
    gallery: dbUnit.gallery || [],
    // Mapping new SEO fields if they exist
    seo_title: dbUnit.seo_title || "",
    meta_description: dbUnit.meta_description || "",
    canonical_url: dbUnit.canonical_url || "",
    is_indexed: dbUnit.is_indexed ?? true,
    og_image: dbUnit.og_image || "",
    is_featured: dbUnit.is_featured ?? false,
    featured_order: dbUnit.featured_order ?? null,
  };

  const createSections: EditorSection[] = ["overview", "pricing", "location", "selling-points", "details", "media", "seo", "publishing"];
  const requestedSection = query.step as EditorSection | undefined;
  const isCreateFlow = query.flow === "create";
  const initialSection = requestedSection && createSections.includes(requestedSection)
    ? requestedSection
    : undefined;

  return (
    <PropertyEditor
      initialData={initialData}
      categories={categoriesRes.data || []}
      mode={isCreateFlow ? "create" : "edit"}
      initialSection={initialSection}
    />
  );
}
