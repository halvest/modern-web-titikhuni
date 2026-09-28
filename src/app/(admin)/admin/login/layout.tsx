import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Login",
  description: "Akses aman dashboard administrator Titik Huni.",
};

export default async function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  let isAdmin = false;

  try {
    await getAdminContext();
    isAdmin = true;
  } catch {
    // Tampilkan formulir login untuk sesi kosong, kedaluwarsa, atau non-admin.
  }

  if (isAdmin) redirect("/admin/dashboard");

  return children;
}
