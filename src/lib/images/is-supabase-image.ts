/**
 * Checks whether an image URL originates from Supabase Storage.
 * Supabase storage images should be served directly by Supabase's CDN (unoptimized)
 * to avoid Next.js Image optimization server timeouts (upstream fetch timeout)
 * and to conserve Vercel's monthly transformation free tier quota.
 */
export function isSupabaseStorageUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.includes("supabase.co/storage/");
}
