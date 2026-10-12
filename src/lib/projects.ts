import { cache } from "react";
import { createPublicClient } from "@/utils/supabase/server";

export type Project = {
  id: string;
  title: string;
  slug: string;
  location: string;
  short_description: string;
  cover_image: string;
  gallery_images: string[];
  featured: boolean;
  featured_order: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const PROJECT_FIELDS =
  "id, title, slug, location, short_description, cover_image, gallery_images, featured, featured_order, published, created_at, updated_at";

export async function getFeaturedProjects(limit = 6) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("published", true)
    .eq("featured", true)
    .order("featured_order", { ascending: true })
    .limit(Math.min(limit, 6));

  return { projects: (data ?? []) as Project[], error };
}

export async function getPublishedProjects() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("featured_order", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  return { projects: (data ?? []) as Project[], error };
}

export async function getPublishedProjectsPage(page = 1, pageSize = 9) {
  const safePage = Math.max(1, Math.trunc(page));
  const safePageSize = Math.min(24, Math.max(1, Math.trunc(pageSize)));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  const supabase = createPublicClient();
  const { data, count, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS, { count: "exact" })
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("featured_order", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .range(from, to);

  return {
    projects: (data ?? []) as Project[],
    total: count ?? 0,
    page: safePage,
    pageSize: safePageSize,
    error,
  };
}

export const getPublishedProjectBySlug = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return { project: data as Project | null, error };
});
