import { createPublicClient } from "@/utils/supabase/server";

export async function resolveSeoRedirect(path: string): Promise<string | null> {
  const supabase = createPublicClient();

  // Normalize the path by ensuring it starts with a slash and no trailing slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const { data: redirect } = await supabase
    .from("redirects")
    .select("new_path")
    .eq("old_path", normalizedPath)
    .maybeSingle();

  if (redirect?.new_path) {
    return redirect.new_path;
  }

  return null;
}
