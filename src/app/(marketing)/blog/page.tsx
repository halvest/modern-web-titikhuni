import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 3600; // ISR 1 hour for lightning-fast TTFB

const PAGE_PATH = "/blog";
const PAGE_URL = `${siteConfig.url}${PAGE_PATH}`;
const PAGE_TITLE = "Blog Properti Jogja: Tips Investasi, Beli Rumah & Tren 2026 | Titik Huni";
const PAGE_DESCRIPTION =
  "Pelajari tips investasi properti, cara membeli rumah pertama, hingga tren properti terbaru di Yogyakarta. Panduan lengkap untuk investor dan pembeli rumah.";
const OG_IMAGE = `${siteConfig.url}/assets/images/konsep_titikhuni.webp`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords: [
    "blog properti jogja",
    "tips beli rumah pertama",
    "investasi properti yogyakarta",
    "harga rumah jogja",
    "tren properti 2026",
    "cara beli rumah KPR",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Blog Properti & Investasi di Yogyakarta | Titik Huni",
    description: "Insight properti, tips beli rumah, dan strategi investasi di Jogja.",
    url: PAGE_URL,
    siteName: siteConfig.name,
    type: "website",
    locale: siteConfig.locale,
    images: [{ url: OG_IMAGE, width: 3750, height: 1969, alt: "Blog Titik Huni" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Properti Jogja | Titik Huni",
    description: "Tips beli rumah & strategi investasi properti di Yogyakarta.",
    images: [OG_IMAGE],
  },
};

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya membaca artikel di blog Titik Huni dan ingin konsultasi mengenai hunian di Yogyakarta."
)}`;

export default async function BlogArchivePage() {
  const [{ data: categories }, { data: posts }] = await Promise.all([
    supabase.from("categories").select("name, slug").eq("type", "post"),
    supabase
      .from("posts")
      .select("*, categories:category_id (name, slug)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Titik Huni",
    url: PAGE_URL,
    description: PAGE_DESCRIPTION,
  };

  const featuredPost = posts?.[0];
  const gridPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="home-content-canvas min-h-screen">
        {/* ========================================================
            1. HERO & CATEGORY BAR
            ======================================================== */}
        <section
          className="pb-10 pt-[calc(var(--header-height)+1.25rem)] sm:pb-12 md:pt-[calc(var(--header-height)+1.75rem)] md:pb-14"
          aria-labelledby="blog-page-title"
        >
          <div className="site-container">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-foreground-soft sm:mb-5">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:text-primary hover:underline">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border-strong">/</li>
                <li aria-current="page" className="font-medium text-foreground">
                  Blog
                </li>
              </ol>
            </nav>

            {/* Header Typography */}
            <header className="flex flex-col justify-between gap-5 border-b border-border/80 pb-7 sm:gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="site-eyebrow text-primary before:bg-primary">
                  Wawasan &amp; Panduan · Yogyakarta
                </p>
                <h1
                  id="blog-page-title"
                  className="mt-2.5 text-balance text-[clamp(2.15rem,4.2vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.045em] text-foreground"
                >
                  Panduan hunian dan properti <span className="text-primary">di Yogyakarta.</span>
                </h1>
              </div>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base lg:text-right">
                Insight terkurasi mengenai perencanaan rumah, pemilihan lokasi, dan investasi properti di Sleman &amp; Bantul.
              </p>
            </header>

            {/* Category Filter Pills */}
            <nav
              aria-label="Kategori artikel"
              className="-mx-5 flex items-center gap-2 overflow-x-auto border-b border-border/70 px-5 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0"
            >
              <Link
                href="/blog"
                aria-current="page"
                className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[11px] border border-primary bg-primary px-4 text-[13px] font-medium text-white shadow-xs"
              >
                Semua artikel
                {posts?.length ? (
                  <span className="font-mono text-[11px] tabular-nums text-white/80">
                    ({posts.length})
                  </span>
                ) : null}
              </Link>

              {categories?.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[11px] border border-border-strong bg-white/80 px-4 text-[13px] font-medium text-foreground-muted transition-colors hover:border-primary hover:bg-white hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* ========================================================
                2. FEATURED ARTICLE (LATEST HIGHLIGHT)
                ======================================================== */}
            {featuredPost && (
              <div className="mt-8 sm:mt-10 md:mt-12">
                <article className="group overflow-hidden rounded-[1.5rem] border border-border/80 bg-white shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_40px_-20px_rgba(35,68,56,0.14)] lg:grid lg:grid-cols-12 lg:items-stretch">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted lg:col-span-7 lg:aspect-auto">
                    <Image
                      src={featuredPost.featured_image || "/assets/images/konsep_titikhuni.webp"}
                      alt={featuredPost.title}
                      fill
                      priority
                      quality={75}
                      sizes="(max-width: 1023px) 100vw, 58vw"
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70"
                      aria-hidden="true"
                    />
                    {featuredPost.categories?.name && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[0.65rem] font-medium text-white shadow-xs backdrop-blur-md sm:bottom-4 sm:left-4">
                        {featuredPost.categories.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-foreground-soft">
                        <span className="font-semibold uppercase tracking-wider text-primary">
                          Artikel Unggulan
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={featuredPost.created_at} className="inline-flex items-center gap-1.5">
                          <Calendar size={13} aria-hidden="true" />
                          {new Date(featuredPost.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>

                      <h2 className="mt-3 text-balance text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-[1.2] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      {featuredPost.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-foreground-muted sm:text-base">
                          {featuredPost.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 border-t border-border/70 pt-5">
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="site-button-primary w-full justify-between sm:w-auto"
                      >
                        <span>Baca Artikel Lengkap</span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* ========================================================
                3. ARTICLE GRID
                ======================================================== */}
            {gridPosts.length > 0 && (
              <div className="mt-12 sm:mt-16">
                <div className="mb-6 flex items-baseline justify-between sm:mb-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Koleksi Tulisan
                    </p>
                    <h2 className="mt-1 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                      Artikel lainnya
                    </h2>
                  </div>
                  <span className="text-xs text-foreground-soft">
                    {gridPosts.length} artikel
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                  {gridPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/80 bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_14px_35px_-15px_rgba(35,68,56,0.12)] motion-safe:hover:-translate-y-1"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        aria-label={`Baca artikel ${post.title}`}
                      >
                        <figure className="relative m-0 aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                          <Image
                            src={post.featured_image || "/assets/images/konsep_titikhuni.webp"}
                            alt={post.title}
                            fill
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 380px"
                            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"
                            aria-hidden="true"
                          />
                          <span className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-xs backdrop-blur-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </span>
                        </figure>

                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-foreground-soft">
                            <span className="font-semibold text-primary">
                              {post.categories?.name || "Wawasan"}
                            </span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={post.created_at} className="inline-flex items-center gap-1.5">
                              <Calendar size={12} aria-hidden="true" />
                              {new Date(post.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </time>
                          </div>

                          <h3 className="mt-2.5 text-[1.125rem] font-medium leading-[1.3] tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="mt-2.5 line-clamp-3 text-sm leading-[1.65] text-foreground-muted">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                            <span>Baca artikel</span>
                            <ArrowRight
                              size={14}
                              className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!posts?.length && (
              <div className="mt-10 rounded-2xl border border-border bg-white p-10 text-center sm:p-16">
                <BookOpen size={36} className="mx-auto text-foreground-soft" strokeWidth={1.5} aria-hidden="true" />
                <h2 className="mt-4 text-xl font-medium tracking-tight text-foreground">
                  Artikel sedang dipersiapkan
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-foreground-muted">
                  Kunjungi kembali untuk membaca panduan dan wawasan terbaru seputar hunian dari Titik Huni.
                </p>
              </div>
            )}

            {/* ========================================================
                4. RELEVANT CONSULTATION CTA
                ======================================================== */}
            <div className="mt-14 sm:mt-18 md:mt-20">
              <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary/20 bg-[var(--sage)] p-6 sm:rounded-3xl sm:p-8 md:p-10 lg:flex-row lg:items-center">
                <div className="max-w-xl">
                  <p className="site-eyebrow text-primary before:bg-primary">
                    Konsultasi Hunian
                  </p>
                  <h2 className="mt-2 text-balance text-[clamp(1.65rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.035em] text-foreground">
                    Punya pertanyaan seputar bangun rumah atau properti di Jogja?
                  </h2>
                  <p className="mt-2 text-sm leading-[1.65] text-foreground-muted sm:text-base">
                    Diskusikan ide, kebutuhan ruang, atau opsi lokasi rumah bersama tim Titik Huni tanpa biaya.
                  </p>
                </div>

                <div className="w-full sm:w-auto lg:shrink-0">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-button-primary w-full sm:w-auto"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Diskusi via WhatsApp
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
