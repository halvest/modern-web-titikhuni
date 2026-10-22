import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { supabase } from "@/lib/supabaseClient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { isSupabaseStorageUrl } from "@/lib/images/is-supabase-image";

export const revalidate = 3600; // ISR 1 hour for fast edge TTFB

const PAGE_PATH = "/blog";
const PAGE_URL = `${siteConfig.url}${PAGE_PATH}`;
const PAGE_TITLE = "Blog & Panduan Properti Yogyakarta | Titik Huni";
const PAGE_DESCRIPTION =
  "Kumpulan artikel, tips perencanaan desain rumah, dan panduan memilih properti di Yogyakarta dari Titik Huni.";
const OG_IMAGE = `${siteConfig.url}/assets/images/konsep_titikhuni.webp`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords: [
    "blog properti jogja",
    "artikel arsitektur jogja",
    "tips bangun rumah jogja",
    "panduan beli rumah yogyakarta",
    "desain rumah minimalis",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: siteConfig.name,
    type: "website",
    locale: siteConfig.locale,
    images: [{ url: OG_IMAGE, width: 3750, height: 1969, alt: "Blog Titik Huni" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya membaca artikel di blog Titik Huni dan ingin berkonsultasi mengenai hunian di Yogyakarta."
)}`;

export default async function BlogArchivePage() {
  const [{ data: categoriesData }, { data: posts }] = await Promise.all([
    supabase
      .from("categories")
      .select("name, slug")
      .order("name", { ascending: true }),
    supabase
      .from("posts")
      .select("*, categories:category_id (name, slug)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  // Saring kategori yang memiliki artikel terpublikasi untuk navigasi blog yang relevan
  const publishedCategorySlugs = new Set(
    (posts ?? [])
      .map((p) => {
        const cat = p.categories as { slug?: string } | { slug?: string }[] | null;
        return Array.isArray(cat) ? cat[0]?.slug : cat?.slug;
      })
      .filter((slug): slug is string => Boolean(slug))
  );

  const categories = (categoriesData ?? []).filter((category) =>
    publishedCategorySlugs.has(category.slug)
  );

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
    <main id="main-content" tabIndex={-1} className="min-h-screen font-sans text-foreground">
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
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-foreground-soft sm:mb-5">
              <ol className="flex items-center gap-1.5 sm:gap-2">
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
                <li aria-current="page" className="font-medium text-foreground">
                  Blog
                </li>
              </ol>
            </nav>

            {/* Header Editorial */}
            <ScrollReveal>
              <header className="flex flex-col justify-between gap-4 pb-4 sm:gap-5 lg:flex-row lg:items-end">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Blog &amp; Inspirasi Hunian</span>
                  </div>
                  <h1
                    id="blog-page-title"
                    className="mt-3 text-balance text-[clamp(2.15rem,4.2vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground"
                  >
                    Inspirasi desain dan panduan hunian <span className="text-primary">di Yogyakarta.</span>
                  </h1>
                </div>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base lg:text-right">
                  Catatan dan tips praktis seputar rancang bangun, pemilihan hunian, serta kenyamanan hidup sehari-hari di Yogyakarta.
                </p>
              </header>

              {/* Category Filter Pills */}
              <nav
                aria-label="Kategori artikel"
                className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 sm:gap-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <Link
                  href="/blog"
                  aria-current="page"
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[11px] border border-primary bg-primary px-4 py-2 text-[13px] font-medium text-white shadow-xs"
                >
                  <span>Semua artikel</span>
                  {posts?.length ? (
                    <span className="text-[11px] font-semibold tabular-nums text-white/80">
                      ({posts.length})
                    </span>
                  ) : null}
                </Link>

                {categories?.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[11px] border border-border-strong bg-white/80 px-4 py-2 text-[13px] font-medium text-foreground-muted transition-colors hover:border-primary hover:bg-white hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </ScrollReveal>

            {/* ========================================================
                2. FEATURED ARTICLE (LATEST HIGHLIGHT)
                ======================================================== */}
            {featuredPost && (
              <div className="mt-8 sm:mt-10 md:mt-12">
                <ScrollReveal>
                  <article className="group overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D5E2D7] bg-[#F4F7F4] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-sm lg:grid lg:grid-cols-12 lg:items-stretch">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted lg:col-span-7 lg:aspect-auto">
                      <Image
                        src={featuredPost.featured_image || "/assets/images/konsep_titikhuni.webp"}
                        alt={featuredPost.title}
                        fill
                        priority
                        unoptimized={isSupabaseStorageUrl(featuredPost.featured_image)}
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
                          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-primary">
                            Artikel Pilihan
                          </span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={featuredPost.created_at} className="inline-flex items-center gap-1.5 font-sans">
                            <Calendar size={13} aria-hidden="true" />
                            {new Date(featuredPost.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                        </div>

                        <h2 className="mt-3.5 text-balance text-[clamp(1.4rem,2.2vw,1.95rem)] font-medium leading-[1.2] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
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

                      <div className="mt-6 border-t border-[#D5E2D7] pt-5">
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="site-button-primary group/btn w-full justify-between sm:w-auto"
                        >
                          <span>Baca Selengkapnya</span>
                          <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              </div>
            )}

            {/* ========================================================
                3. ARTICLE GRID
                ======================================================== */}
            {gridPosts.length > 0 && (
              <div className="mt-12 sm:mt-16">
                <ScrollReveal>
                  <div className="mb-6 flex items-end justify-between sm:mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                        <span className="size-1.5 rounded-full bg-primary" />
                        <span>Koleksi Artikel</span>
                      </div>
                      <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2rem]">
                        Artikel pilihan lainnya
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-foreground-muted">
                      {gridPosts.length} artikel
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {gridPosts.map((post) => (
                      <article
                        key={post.id}
                        className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#D5E2D7] bg-[#F4F7F4] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-sm"
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
                              unoptimized={isSupabaseStorageUrl(post.featured_image)}
                              quality={75}
                              sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 380px"
                              className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"
                              aria-hidden="true"
                            />
                            <span className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full bg-white/95 text-foreground shadow-xs backdrop-blur-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                              <ArrowUpRight size={15} aria-hidden="true" />
                            </span>
                          </figure>

                          <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-foreground-soft">
                              <span className="font-semibold text-primary">
                                {post.categories?.name || "Inspirasi"}
                              </span>
                              <span aria-hidden="true">·</span>
                              <time dateTime={post.created_at} className="inline-flex items-center gap-1.5 font-sans">
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

                            <div className="mt-auto flex items-center justify-between border-t border-[#D5E2D7] pt-4 text-xs font-semibold uppercase tracking-wider text-primary">
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
                </ScrollReveal>
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
              <ScrollReveal>
                <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-[#CFDDD1] bg-[#F1F6F2] p-7 sm:p-10 md:p-12 lg:p-14 shadow-xs">
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                    <div className="lg:col-span-7">
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                        <span className="size-1.5 rounded-full bg-primary" />
                        <span>Konsultasi Hunian</span>
                      </div>

                      <h2 className="mt-2.5 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.15]">
                        Punya pertanyaan seputar bangun rumah atau properti di Jogja?
                      </h2>

                      <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground-muted sm:text-base sm:leading-7">
                        Diskusikan ide, rencana tata ruang, atau pilihan lokasi hunian bersama tim Titik Huni tanpa biaya konsultasi.
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3.5 sm:items-stretch lg:col-span-5 lg:items-end">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta-location="blog_archive_bottom_cta"
                        className="site-button-primary group/cta w-full justify-center py-3.5 text-[15px] font-medium shadow-xs hover:shadow-md transition-all sm:w-auto"
                      >
                        <MessageCircle size={17} aria-hidden="true" />
                        <span>Konsultasi via WhatsApp</span>
                        <ArrowUpRight
                          size={16}
                          aria-hidden="true"
                          className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                        />
                      </a>

                      <p className="text-xs text-foreground-muted sm:text-center lg:text-right">
                        Konsultasikan rencana hunian Anda bersama tim Titik Huni.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
