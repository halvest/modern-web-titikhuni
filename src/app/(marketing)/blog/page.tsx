import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title:
    "Blog Properti Jogja: Tips Investasi, Beli Rumah & Tren 2026 | Titik Huni",
  description:
    "Pelajari tips investasi properti, cara membeli rumah pertama, hingga tren properti terbaru di Yogyakarta. Panduan lengkap untuk investor dan pembeli rumah.",
  keywords: [
    "blog properti jogja",
    "tips beli rumah pertama",
    "investasi properti yogyakarta",
    "harga rumah jogja",
    "tren properti 2026",
    "cara beli rumah KPR",
  ],
  alternates: { canonical: "https://titikhuni.id/blog" },
  openGraph: {
    title: "Blog Properti & Investasi di Yogyakarta | Titik Huni",
    description:
      "Insight properti, tips beli rumah, dan strategi investasi di Jogja.",
    url: "https://titikhuni.id/blog",
    siteName: "Titik Huni",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Properti Jogja | Titik Huni",
    description: "Tips beli rumah & strategi investasi properti di Yogyakarta.",
  },
};

export default async function BlogArchivePage() {
  const supabase = await createClient();
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
    url: "https://titikhuni.id/blog",
    description:
      "Blog properti berisi tips investasi, panduan membeli rumah, dan tren properti terbaru di Yogyakarta.",
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="home-content-canvas min-h-screen">
        <section
          className="pb-12 pt-[calc(var(--header-height)+1rem)] sm:pb-14 md:pt-[calc(var(--header-height)+1.5rem)] md:pb-16"
          aria-labelledby="blog-page-title"
        >
          <div className="site-container">
            <nav aria-label="Breadcrumb" className="mb-3.5 text-xs text-foreground-soft sm:mb-4">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:text-primary hover:underline">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">Blog</li>
              </ol>
            </nav>

            <header className="flex flex-col justify-between gap-5 border-b border-border/80 pb-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="site-eyebrow text-primary before:bg-primary">Artikel Titik Huni · Yogyakarta</p>
                <h1
                  id="blog-page-title"
                  className="mt-2 text-balance text-[clamp(2.15rem,4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em]"
                >
                  Panduan hunian dan properti <span className="text-primary">di Yogyakarta.</span>
                </h1>
              </div>
              <p className="max-w-md text-pretty text-sm leading-6 text-foreground-muted lg:text-right sm:text-base sm:leading-7">
                Temukan panduan membeli rumah, memahami desain, dan memilih lokasi dengan lebih yakin.
              </p>
            </header>

            <nav
              aria-label="Kategori artikel"
              className="-mx-5 flex gap-2 overflow-x-auto border-b border-border/80 px-5 py-4 scrollbar-hide sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0"
            >
              <Link
                href="/blog"
                aria-current="page"
                className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white"
              >
                Semua artikel
              </Link>
              {categories?.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex min-h-10 shrink-0 items-center rounded-lg border border-border-strong bg-white px-4 text-sm font-medium text-foreground-muted transition-colors hover:border-primary hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-3 md:mt-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Wawasan Titik Huni</p>
                <h2 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Artikel terbaru</h2>
              </div>
              {posts?.length ? (
                <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-foreground-muted">
                  {posts.length} artikel
                </p>
              ) : null}
            </div>

            <div className="mt-5 md:mt-6">
              {posts?.length ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                  {posts.map((post, index) => (
                    <article
                      key={post.id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/80 bg-white"
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
                            preload={index === 0}
                            loading={index === 0 ? undefined : "lazy"}
                            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" aria-hidden="true" />
                          <span className="absolute right-3.5 top-3.5 flex size-9 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </span>
                        </figure>

                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-foreground-soft">
                            <span className="text-primary">{post.categories?.name || "Wawasan"}</span>
                            <span aria-hidden="true" className="size-1 rounded-full bg-foreground-soft" />
                            <time dateTime={post.created_at} className="inline-flex items-center gap-1.5">
                              <Calendar size={13} aria-hidden="true" />
                              {new Date(post.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                          <h3 className="mt-2.5 text-xl font-medium leading-tight tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
                            {post.title}
                          </h3>
                          {post.excerpt ? (
                            <p className="mb-5 mt-2 line-clamp-3 text-sm leading-6 text-foreground-muted">
                              {post.excerpt}
                            </p>
                          ) : null}
                          <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4 text-xs">
                            <span className="font-medium text-foreground-soft">Admin Titik Huni</span>
                            <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-primary">
                              Baca artikel
                              <ArrowRight
                                size={14}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-white p-10 text-center sm:p-14">
                  <BookOpen size={34} className="mx-auto text-foreground-soft" strokeWidth={1.5} aria-hidden="true" />
                  <p className="mt-4 font-medium">Artikel sedang disiapkan.</p>
                  <p className="mt-2 text-sm text-foreground-soft">
                    Kunjungi kembali untuk membaca panduan dan wawasan terbaru dari Titik Huni.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
