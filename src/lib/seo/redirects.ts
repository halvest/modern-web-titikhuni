import { createClient } from "@/utils/supabase/server";

export async function resolveSeoRedirect(path: string): Promise<string | null> {
  const supabase = await createClient();
  
  // Normalize the path by ensuring it starts with a slash and no trailing slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  const { data: redirect } = await supabase
    .from("redirects")
    .select("new_path")
    .eq("old_path", normalizedPath)
    .single();
    
  if (redirect?.new_path) {
    return redirect.new_path;
  }
  
  return null;
}
