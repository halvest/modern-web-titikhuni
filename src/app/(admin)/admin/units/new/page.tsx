import { requireAdminPage } from "@/utils/supabase/server";
import { PropertyEditor } from "@/components/admin/units/editor/property-editor";
import { REGION_SLUGS } from "@/config/regions";

export const metadata = {
  title: "New Property Unit - Admin",
};

export default async function NewUnitPage() {
  const { supabase } = await requireAdminPage();

  // Fetch categories for the editor dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .in("slug", [...REGION_SLUGS])
    .order("name", { ascending: true });

  return (
    <PropertyEditor
      categories={categories || []}
      mode="create"
    />
  );
}
