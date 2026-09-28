import { requireAdminPage } from "@/utils/supabase/server";
import { BlogEditor } from "@/components/admin/posts/editor/blog-editor";
import { notFound } from "next/navigation";
import { PostFormData, PostStatus } from "@/components/admin/posts/editor/types";

export const metadata = {
  title: "Edit Article - Admin",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { supabase } = await requireAdminPage();

  // Fetch categories and post data in parallel
  const [categoriesRes, postRes, tagsRes, relatedUnitsRes, relatedPostsRes] = await Promise.all([
    supabase.from("categories").select("id, name").order("name", { ascending: true }),
    supabase.from("posts").select("*").eq("id", id).single(),
    supabase.from("post_tags").select("tags(name)").eq("post_id", id),
    supabase.from("post_related_units").select("unit_id").eq("post_id", id),
    supabase.from("post_related_posts").select("related_post_id").eq("post_id", id),
  ]);

  if (postRes.error || !postRes.data) {
    return notFound();
  }

  const dbPost = postRes.data;

  // Extract relations
  const tags = (tagsRes.data || [])
    .map((row) => {
      const relation = row.tags as { name?: string } | { name?: string }[] | null;
      return Array.isArray(relation) ? relation[0]?.name : relation?.name;
    })
    .filter((name): name is string => Boolean(name));
  const relatedUnits = (relatedUnitsRes.data || []).map(r => r.unit_id);
  const relatedPosts = (relatedPostsRes.data || []).map(r => r.related_post_id);

  // Map DB data to our Editor state format
  const initialData: PostFormData = {
    id: dbPost.id,
    title: dbPost.title || "",
    slug: dbPost.slug || "",
    content: dbPost.content || "",
    excerpt: dbPost.excerpt || "",
    featured_image: dbPost.featured_image || "",
    category_id: dbPost.category_id || "",
    status: (["draft", "published", "archived"] as string[]).includes(dbPost.status)
      ? (dbPost.status as PostStatus)
      : "draft",
    tags: tags,

    // SEO fields
    seo_title: dbPost.seo_title || "",
    meta_description: dbPost.meta_description || "",
    canonical_url: dbPost.canonical_url || "",
    is_indexed: dbPost.is_indexed ?? true,
    og_image: dbPost.og_image || "",

    // Relations
    related_unit_ids: relatedUnits,
    related_post_ids: relatedPosts,
  };

  return (
    <BlogEditor
      initialData={initialData}
      categories={categoriesRes.data || []}
      isEditMode={true}
    />
  );
}
