import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component: ignore if middleware is handling refreshes
          }
        },
      },
    },
  );
}

export async function getAdminContext() {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (claimsError || !userId) {
    throw new Error("Sesi berakhir. Silakan masuk kembali.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Akses admin diperlukan.");
  }

  return {
    supabase,
    user: {
      id: userId,
      email: typeof data.claims.email === "string" ? data.claims.email : null,
    },
  };
}

export async function verifyAdmin() {
  const { supabase } = await getAdminContext();
  return supabase;
}

export async function requireAdminPage() {
  try {
    return await getAdminContext();
  } catch {
    redirect("/admin/login");
  }
}
