import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/projects/ProjectEditor";
import { requireAdminPage } from "@/utils/supabase/server";

export const metadata = {
  title: "Edit Proyek - Admin Titik Huni",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdminPage();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, location, short_description, cover_image, gallery_images, featured, featured_order, published"
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <ProjectEditor
      initialData={{
        id: data.id,
        title: data.title,
        slug: data.slug,
        location: data.location,
        short_description: data.short_description,
        cover_image: data.cover_image,
        gallery_images: data.gallery_images ?? [],
        featured: data.featured,
        featured_order: data.featured_order,
        published: data.published,
      }}
    />
  );
}
