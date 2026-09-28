import { createClient } from "@/utils/supabase/server";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { sanitizeRichText } from "@/lib/security/sanitize-rich-text";
import { resolveSeoRedirect } from "@/lib/seo/redirects";
import {
  Calendar,
  ArrowLeft,
  Clock,
  MapPin,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

// ✅ 1. OPTIMASI METADATA & SEO (Target Top 5)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, featured_image, seo_title, meta_description, canonical_url, og_image, is_indexed")
    .eq("slug", decodeURIComponent(slug))
    .maybeSingle();

  if (!post) return { title: "Artikel Tidak Ditemukan" };

  // SEO Fallbacks Implementation
  const resolvedTitle = post.seo_title || post.title || "Untitled Article";
  const fullTitle = `${resolvedTitle} | Blog Titik Huni`;
  const resolvedDescription = post.meta_description || post.excerpt || "";
  const resolvedCanonical = post.canonical_url || `https://titikhuni.id/blog/${slug}`;
  const resolvedOgImage = post.og_image || post.featured_image || "https://titikhuni.id/logo.png";

  return {
    title: fullTitle,
    description: resolvedDescription,
    alternates: {
      canonical: resolvedCanonical,
    },
    robots: {
      index: post.is_indexed !== false,
      follow: post.is_indexed !== false,
    },
    openGraph: {
      title: fullTitle,
      description: resolvedDescription,
      images: [resolvedOgImage],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const supabase = await createClient();

  // ✅ 2. PENGAMBILAN DATA PARALEL (ISR Optimized)
  const [postRes, unitsRes, recentPostsRes] = await Promise.all([
    supabase
      .from("posts")
      .select(`*, categories:category_id (name, slug)`)
      .eq("slug", cleanSlug)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("units")
      .select(`title, slug, location, price, image_url`)
      .is("deleted_at", null)
      .limit(3)
      .order("priority_order", { ascending: true }),
    supabase
      .from("posts")
      .select(`title, slug, created_at`)
      .neq("slug", cleanSlug)
      .is("deleted_at", null)
      .limit(5)
      .order("created_at", { ascending: false }),
  ]);

  let post = postRes.data;

  // SEO Fallback Redirect Resolution
  if (!post) {
    const redirectPath = await resolveSeoRedirect(`/blog/${cleanSlug}`);
    if (redirectPath) {
      permanentRedirect(redirectPath);
    }
    return notFound();
  }

  const units = unitsRes.data || [];
  const recentPosts = recentPostsRes.data || [];

  // Read-Time Sanitization Security boundary
  const safeContent = sanitizeRichText(post.content || "");

  // ✅ 3. SCHEMA.ORG JSON-LD (SEO BOOST)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.featured_image,
    datePublished: post.created_at,
    author: { "@type": "Organization", name: "Titik Huni" },
    description: post.excerpt,
    publisher: {
      "@type": "Organization",
      name: "Titik Huni",
      logo: { "@type": "ImageObject", url: "https://titikhuni.id/logo.png" },
    },
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-surface pt-[var(--header-height)] text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex-1">
        {/* BREADCRUMBS & NAVIGASI ATAS */}
        <div className="border-b border-surface-muted bg-surface/50">
          <div className="site-container flex min-h-14 items-center">
            <nav className="flex flex-wrap items-center gap-2 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground-soft">
              <Link
                href="/blog"
                className="flex items-center gap-2 hover:text-black transition"
              >
                <ArrowLeft size={14} /> Blog
              </Link>
              <ChevronRight size={10} />
              <span className="text-foreground">{post.categories?.name}</span>
            </nav>
          </div>
        </div>

        {/* LAYOUT GRID UTAMA */}
        <div className="site-container grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:py-16">
          {/* SIDEBAR KIRI: Rekomendasi Unit (HCI: Contextual Relevance) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div className="pb-4 border-b border-surface-muted">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Unit Kami
                </h3>
              </div>
              <div className="space-y-8">
                {units.map((unit) => (
                  <Link
                    key={unit.slug}
                    href={`/unit/${unit.slug}`}
                    className="group block space-y-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted">
                      <Image
                        src={unit.image_url}
                        alt={unit.title}
                        fill
                        sizes="25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {unit.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-foreground-soft">
                        <MapPin size={10} className="text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-tight">
                          {unit.location}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/unit"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground-soft hover:text-black transition"
              >
                Lihat Semua Unit <ChevronRight size={12} />
              </Link>
            </div>
          </aside>

          {/* KONTEN UTAMA */}
          <div className="lg:col-span-6">
            <article className="space-y-10">
              <header className="space-y-6">
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <span>{post.categories?.name}</span>
                  <span className="w-1 h-1 bg-surface-muted rounded-full" />
                  <span className="flex items-center gap-1.5 text-foreground-soft">
                    <Clock size={12} /> 5 Menit Baca
                  </span>
                </div>

                <h1 className="text-balance text-[clamp(2rem,7vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                  {post.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-foreground-soft">
                  <Calendar size={14} />
                  <time dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>

                {post.featured_image && (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-muted">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      preload
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </header>

              {/* AREA TEKS ARTIKEL */}
              <section
                className="prose prose-neutral max-w-none 
                prose-p:text-foreground-muted prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
                prose-headings:font-semibold prose-headings:text-foreground
                prose-img:rounded-2xl prose-img:shadow-sm
                prose-a:text-primary prose-a:font-semibold hover:prose-a:underline"
              >
                {safeContent ? (
                  parse(safeContent)
                ) : (
                  <p className="text-center py-20 ">Memuat konten...</p>
                )}
              </section>

              {/* INLINE CTA BOX */}
              <div className="group mt-20 flex flex-col items-center justify-between gap-8 rounded-2xl bg-[#17352a] p-8 md:flex-row">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-white">
                    Temukan Titik Huni Anda
                  </h3>
                  <p className="text-sm text-foreground-soft max-w-xs">
                    Konsultasikan properti Yogyakarta bersama
                    penasihat ahli kami.
                  </p>
                </div>
                <Link
                  href="/unit"
                  className="flex min-h-12 items-center gap-3 rounded-full bg-white px-8 py-3 text-xs font-bold text-foreground transition-all hover:-translate-y-0.5 hover:bg-surface-muted"
                >
                  LIHAT UNIT <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          </div>

          {/* SIDEBAR KANAN: Artikel Terkait (Retention Strategy) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-10">
              <div className="pb-4 border-b border-surface-muted">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Artikel Terbaru
                </h3>
              </div>
              <div className="space-y-10">
                {recentPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group block space-y-2"
                  >
                    <h4 className="text-sm font-semibold text-foreground leading-snug transition-colors group-hover:text-primary">
                      {item.title}
                    </h4>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-soft">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted transition hover:text-primary"
              >
                Semua artikel <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
