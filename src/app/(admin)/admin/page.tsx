import { redirect } from "next/navigation";
import { requireAdminPage } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  await requireAdminPage();
  redirect("/admin/dashboard");
}
