import { requireAdminPage } from "@/utils/supabase/server";
import { BlogEditor } from "@/components/admin/posts/editor/blog-editor";

export const metadata = {
  title: "New Article - Admin",
};

export default async function NewPostPage() {
  const { supabase } = await requireAdminPage();

  // Fetch categories for the editor dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <BlogEditor
      categories={categories || []}
      isEditMode={false}
    />
  );
}
