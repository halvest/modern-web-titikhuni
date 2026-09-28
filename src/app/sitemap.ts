import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { REGION_SLUGS } from "@/config/regions";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [unitsResult, postsResult, projectsResult] = await Promise.all([
    supabase
      .from("units")
      .select("slug, updated_at")
      .is("deleted_at", null)
      .neq("status", "Draft")
      .eq("is_indexed", true),
    supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published")
      .eq("is_indexed", true)
      .is("deleted_at", null),
    supabase
      .from("projects")
      .select("slug, updated_at")
      .eq("published", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/unit`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/proyek`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/tentang-kami`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/arsitek-kontraktor`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Region landing pages
  const regionPages: MetadataRoute.Sitemap = REGION_SLUGS.map((slug) => ({
    url: `${siteConfig.url}/unit/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const unitPages: MetadataRoute.Sitemap = (unitsResult.data ?? []).map((unit) => ({
    url: `${siteConfig.url}/unit/${unit.slug}`,
    lastModified: unit.updated_at ?? undefined,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = (postsResult.data ?? []).map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updated_at ?? undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectPages: MetadataRoute.Sitemap = (projectsResult.data ?? []).map(
    (project) => ({
      url: `${siteConfig.url}/proyek/${project.slug}`,
      lastModified: project.updated_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })
  );

  return [
    ...staticPages,
    ...regionPages,
    ...unitPages,
    ...postPages,
    ...projectPages,
  ];
}
