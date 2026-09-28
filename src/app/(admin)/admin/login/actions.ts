"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type LoginError =
  | "invalid_credentials"
  | "unauthorized"
  | "profile_missing"
  | "profile_error"
  | "validation_error"
  | "session_expired"
  | "server_error"
  | null;

export type LoginState = {
  error: LoginError;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "validation_error" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return { error: "invalid_credentials" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      await supabase.auth.signOut();
      return { error: "profile_error" };
    }

    if (!profile) {
      await supabase.auth.signOut();
      return { error: "profile_missing" };
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      return { error: "unauthorized" };
    }
  } catch {
    return { error: "server_error" };
  }

  redirect("/admin/dashboard");
}
