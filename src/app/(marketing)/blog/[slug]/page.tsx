import { cache } from "react";
import { supabase } from "@/lib/supabaseClient";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { sanitizeRichText } from "@/lib/security/sanitize-rich-text";
import { resolveSeoRedirect } from "@/lib/seo/redirects";
import { siteConfig } from "@/config/site";
import { isSupabaseStorageUrl } from "@/lib/images/is-supabase-image";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export const revalidate = 3600; // ISR 1 hour

const getPostBySlug = cache(async (rawSlug: string) => {
  const cleanSlug = decodeURIComponent(rawSlug).toLowerCase().trim();
  const { data: post, error } = await supabase
    .from("posts")
    .select(`*, categories:category_id (name, slug)`)
    .eq("slug", cleanSlug)
    .is("deleted_at", null)
    .maybeSingle();

  return { post, error, cleanSlug };
});

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  return (posts ?? []).map((post) => ({ slug: post.slug }));
}

// 1. OPTIMASI METADATA & SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);

  if (!post) return { title: "Artikel Tidak Ditemukan" };

  // SEO Title: bersihkan suffix duplikat untuk mencegah triple branding
  const rawTitle = post.seo_title || post.title || "Artikel";
  const cleanTitle = rawTitle
    .replace(/\s*\|\s*(Blog\s+)?Titik\s+Huni/gi, "")
    .replace(/\s*-\s*Titik\s+Huni/gi, "")
    .trim();
  const fullTitle = `${cleanTitle} | Blog Titik Huni`;

  const defaultCanonical = `${siteConfig.url}/blog/${slug}`;
  let resolvedCanonical = defaultCanonical;
  if (post.canonical_url) {
    try {
      const parsed = new URL(post.canonical_url);
      if (
        parsed.hostname.includes("domain-titikhuni.com") ||
        parsed.hostname === "localhost"
      ) {
        resolvedCanonical = defaultCanonical;
      } else {
        resolvedCanonical = post.canonical_url;
      }
    } catch {
      resolvedCanonical = defaultCanonical;
    }
  }

  const resolvedDescription =
    post.meta_description || post.excerpt || siteConfig.description;
  const resolvedOgImage =
    post.og_image || post.featured_image || `${siteConfig.url}/og.jpg`;

  return {
    title: { absolute: fullTitle },
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
      url: resolvedCanonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [resolvedOgImage],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post, cleanSlug } = await getPostBySlug(slug);

  // SEO Fallback Redirect Resolution
  if (!post) {
    const redirectPath = await resolveSeoRedirect(`/blog/${cleanSlug}`);
    if (redirectPath) {
      permanentRedirect(redirectPath);
    }
    return notFound();
  }

  // 3. AMBIL RELASI UNIT & ARTIKEL TERKAIT (Ditetapkan Admin)
  const [relatedUnitsRes, relatedPostsRes] = await Promise.all([
    supabase
      .from("post_related_units")
      .select("units:unit_id (title, slug, location, price, image_url, status, deleted_at)")
      .eq("post_id", post.id),
    supabase
      .from("post_related_posts")
      .select("posts:related_post_id (title, slug, created_at, status, deleted_at)")
      .eq("post_id", post.id),
  ]);

  type UnitItem = { title: string; slug: string; location: string; price: number; image_url: string; status?: string; deleted_at?: string | null };
  type PostItem = { title: string; slug: string; created_at: string; status?: string; deleted_at?: string | null };

  const linkedUnits: UnitItem[] = (relatedUnitsRes.data || [])
    .map((item) => item.units as unknown as UnitItem | null)
    .filter((u): u is UnitItem => Boolean(u && !u.deleted_at && u.status !== "Draft"));

  const linkedPosts: PostItem[] = (relatedPostsRes.data || [])
    .map((item) => item.posts as unknown as PostItem | null)
    .filter((p): p is PostItem => Boolean(p && !p.deleted_at && p.status === "published" && p.slug !== cleanSlug));

  // Fallback ke unit aktif jika artikel belum memiliki relasi khusus dari admin
  let units: UnitItem[] = linkedUnits;
  if (units.length === 0) {
    const fallbackUnitsRes = await supabase
      .from("units")
      .select("title, slug, location, price, image_url")
      .is("deleted_at", null)
      .neq("status", "Draft")
      .limit(3)
      .order("priority_order", { ascending: true });
    units = (fallbackUnitsRes.data || []) as UnitItem[];
  }

  // Fallback ke artikel terbaru jika belum ada relasi artikel terkait
  let recentPosts: PostItem[] = linkedPosts;
  if (recentPosts.length === 0) {
    const fallbackPostsRes = await supabase
      .from("posts")
      .select("title, slug, created_at")
      .neq("slug", cleanSlug)
      .eq("status", "published")
      .is("deleted_at", null)
      .limit(5)
      .order("created_at", { ascending: false });
    recentPosts = (fallbackPostsRes.data || []) as PostItem[];
  }

  // Read-Time Sanitization Security boundary
  const safeContent = sanitizeRichText(post.content || "");

  const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(
    `Halo Titik Huni, saya membaca artikel "${post.title}" di blog dan ingin berkonsultasi mengenai hunian di Yogyakarta.`
  )}`;

  // 3. SCHEMA.ORG JSON-LD (BlogPosting & BreadcrumbList)
  const pageUrl = `${siteConfig.url}/blog/${cleanSlug}`;
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Beranda", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
    ...(post.categories?.name
      ? [
          {
            "@type": "ListItem",
            position: 3,
            name: post.categories.name,
            item: `${siteConfig.url}/blog/category/${post.categories.slug}`,
          },
          { "@type": "ListItem", position: 4, name: post.title, item: pageUrl },
        ]
      : [{ "@type": "ListItem", position: 3, name: post.title, item: pageUrl }]),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline: post.title,
        image: post.featured_image ? [post.featured_image] : [`${siteConfig.url}/og.jpg`],
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        description: post.excerpt || post.meta_description,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.organization.name,
          logo: {
            "@type": "ImageObject",
            url: siteConfig.organization.logo,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen font-sans text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="home-content-canvas min-h-screen">
        <section className="pb-16 pt-[calc(var(--header-height)+1.25rem)] sm:pb-20 md:pt-[calc(var(--header-height)+1.75rem)] md:pb-24">
          <div className="site-container">
            {/* BREADCRUMB NAVIGATION */}
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-foreground-soft sm:mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-primary focus-visible:outline-hidden"
                  >
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border-strong">
                  <ChevronRight size={13} className="opacity-60" />
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-primary focus-visible:outline-hidden"
                  >
                    Blog
                  </Link>
                </li>
                {post.categories?.name && (
                  <>
                    <li aria-hidden="true" className="text-border-strong">
                      <ChevronRight size={13} className="opacity-60" />
                    </li>
                    <li>
                      <Link
                        href={`/blog/category/${post.categories.slug}`}
                        className="transition-colors hover:text-primary focus-visible:outline-hidden"
                      >
                        {post.categories.name}
                      </Link>
                    </li>
                  </>
                )}
                <li aria-hidden="true" className="text-border-strong">
                  <ChevronRight size={13} className="opacity-60" />
                </li>
                <li aria-current="page" className="max-w-[200px] truncate font-medium text-foreground sm:max-w-none">
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* LAYOUT GRID UTAMA */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              {/* SIDEBAR KIRI: Rekomendasi Unit */}
              <aside className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-28 space-y-6">
                  <div className="border-b border-[#D5E2D7] pb-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3 py-0.5 text-[0.625rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span>{linkedUnits.length > 0 ? "Unit Terkait" : "Katalog Hunian"}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold tracking-tight text-foreground">
                      {linkedUnits.length > 0 ? "Pilihan Unit Terkait" : "Pilihan Unit Kami"}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {units.map((unit) => (
                      <Link
                        key={unit.slug}
                        href={`/unit/${unit.slug}`}
                        className="group block overflow-hidden rounded-xl border border-[#D5E2D7] bg-[#F4F7F4] p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-2xs"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-muted">
                          <Image
                            src={unit.image_url}
                            alt={unit.title}
                            fill
                            unoptimized={isSupabaseStorageUrl(unit.image_url)}
                            sizes="20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="mt-2.5 space-y-1">
                          <h4 className="text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {unit.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-foreground-muted">
                            <MapPin size={11} className="text-primary shrink-0" />
                            <span className="truncate">{unit.location}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/unit"
                    className="inline-flex items-center gap-2 text-xs font-medium text-foreground-muted transition-colors hover:text-primary"
                  >
                    <span>Lihat semua unit</span>
                    <ChevronRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </aside>

              {/* KONTEN UTAMA ARTIKEL */}
              <div className="lg:col-span-6">
                <article className="space-y-8">
                  <header className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                        <span className="size-1.5 rounded-full bg-primary" />
                        <span>{post.categories?.name || "Inspirasi Hunian"}</span>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-foreground-soft font-sans">
                        <Clock size={12} aria-hidden="true" />
                        <span>5 menit baca</span>
                      </span>
                    </div>

                    <h1 className="text-balance text-[clamp(1.85rem,3.5vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.035em] text-foreground">
                      {post.title}
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-foreground-soft">
                      <Calendar size={13} aria-hidden="true" />
                      <time dateTime={post.created_at} className="font-sans">
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    {post.featured_image && (
                      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D5E2D7] bg-surface-muted shadow-2xs">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          priority
                          unoptimized={isSupabaseStorageUrl(post.featured_image)}
                          quality={80}
                          sizes="(max-width: 1023px) 100vw, 55vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </header>

                  {/* AREA TEKS ARTIKEL */}
                  <section
                    className="prose prose-neutral max-w-none pt-2
                    prose-p:text-foreground-muted prose-p:leading-[1.8] prose-p:text-base
                    prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground
                    prose-img:rounded-2xl prose-img:border prose-img:border-[#D5E2D7] prose-img:shadow-2xs
                    prose-a:text-primary prose-a:font-medium hover:prose-a:underline"
                  >
                    {safeContent ? (
                      parse(safeContent)
                    ) : (
                      <p className="py-12 text-center text-foreground-muted">Memuat konten...</p>
                    )}
                  </section>

                  {/* INLINE ARCHITECTURAL CTA BOX */}
                  <div className="mt-12 overflow-hidden rounded-3xl border border-[#CFDDD1] bg-[#F1F6F2] p-7 sm:p-9 shadow-2xs">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3 py-0.5 text-[0.625rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span>Konsultasi Titik Huni</span>
                    </div>

                    <h3 className="mt-2 text-balance text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                      Ingin Mewujudkan Hunian Idaman di Yogyakarta?
                    </h3>

                    <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground-muted">
                      Diskusikan kebutuhan rancang bangun, perencanaan tata ruang, atau pilihan unit hunian bersama tim arsitek Titik Huni.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-button-primary group/cta justify-center"
                      >
                        <MessageCircle size={15} aria-hidden="true" />
                        <span>Konsultasi via WhatsApp</span>
                        <ArrowUpRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                        />
                      </a>

                      <Link
                        href="/unit"
                        className="site-button-secondary justify-center"
                      >
                        <span>Lihat Katalog Unit</span>
                        <ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>

              {/* SIDEBAR KANAN: Artikel Terkait */}
              <aside className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-28 space-y-6">
                  <div className="border-b border-[#D5E2D7] pb-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3 py-0.5 text-[0.625rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span>{linkedPosts.length > 0 ? "Artikel Terkait" : "Artikel Terbaru"}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold tracking-tight text-foreground">
                      {linkedPosts.length > 0 ? "Topik Terkait" : "Inspirasi Lainnya"}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {recentPosts.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/blog/${item.slug}`}
                        className="group block rounded-xl border border-[#D5E2D7] bg-[#F4F7F4] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-2xs"
                      >
                        <h4 className="text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-foreground-soft font-sans">
                          <Calendar size={11} aria-hidden="true" />
                          <span>
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-xs font-medium text-foreground-muted transition-colors hover:text-primary"
                  >
                    <span>Koleksi semua artikel</span>
                    <ChevronRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
