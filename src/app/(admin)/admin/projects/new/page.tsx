import { ProjectEditor } from "@/components/admin/projects/ProjectEditor";
import { requireAdminPage } from "@/utils/supabase/server";

export const metadata = {
  title: "Proyek Baru - Admin Titik Huni",
};

export default async function NewProjectPage() {
  await requireAdminPage();
  return <ProjectEditor />;
}
