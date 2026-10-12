import { cache } from "react";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, ArrowUpRight, ChevronRight, BookOpen, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { ScrollReveal } from "@/components/ScrollReveal";
import { isSupabaseStorageUrl } from "@/lib/images/is-supabase-image";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

const getCategoryBySlug = cache(async (slug: string) => {
  const { data: category, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      posts (
        id,
        title,
        slug,
        excerpt,
        featured_image,
        created_at,
        status,
        deleted_at
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  return { category, error };
});

export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  return (categories ?? []).map((c) => ({ slug: c.slug }));
}

// 1. Generate Metadata Dinamis untuk SEO Kategori
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Kategori Tidak Ditemukan | Titik Huni" };
  }

  const posts =
    (category.posts?.filter(
      (p: any) => p.status === "published" && p.deleted_at === null,
    ) as any[]) || [];

  const hasPosts = posts.length > 0;
  const title = `Kategori: ${category.name} | Blog Titik Huni`;
  const desc = hasPosts
    ? `Kumpulan artikel properti dan inspirasi hunian untuk kategori ${category.name} di Yogyakarta.`
    : `Kumpulan artikel properti dan desain hunian kategori ${category.name} dari Titik Huni.`;

  return generateSeoMetadata({
    title,
    description: desc,
    path: `/blog/category/${slug}`,
    noindex: !hasPosts, // Cegah indexing halaman kategori kosong / thin content!
  });
}

const whatsappUrl = `https://wa.me/${siteConfig.organization.telephone.replace(
  /\D/g,
  ""
)}?text=${encodeURIComponent(
  "Halo Titik Huni, saya membaca artikel di blog Titik Huni dan ingin berkonsultasi mengenai hunian di Yogyakarta."
)}`;

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const { category, error } = await getCategoryBySlug(slug);

  if (error || !category) {
    notFound();
  }

  // Filter artikel yang hanya status 'published' dan belum di-soft delete
  const posts =
    (category.posts?.filter(
      (p: any) => p.status === "published" && p.deleted_at === null,
    ) as any[]) || [];

  const pageUrl = `${siteConfig.url}/blog/category/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: `Kategori: ${category.name} | Blog Titik Huni`,
        url: pageUrl,
        inLanguage: "id-ID",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
          { "@type": "ListItem", position: 3, name: category.name, item: pageUrl },
        ],
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
        <section
          className="pb-16 pt-[calc(var(--header-height)+1.25rem)] sm:pb-20 md:pt-[calc(var(--header-height)+1.75rem)] md:pb-24"
          aria-labelledby="category-page-title"
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
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-primary focus-visible:outline-hidden"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border-strong">
                  <ChevronRight size={13} className="opacity-60" />
                </li>
                <li aria-current="page" className="font-medium text-foreground">
                  {category.name}
                </li>
              </ol>
            </nav>

            {/* Header Kategori */}
            <ScrollReveal>
              <header className="flex flex-col justify-between gap-4 pb-6 sm:gap-5 lg:flex-row lg:items-end">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--sage)]/80 px-3.5 py-1 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-primary shadow-2xs">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Kategori Artikel</span>
                  </div>
                  <h1
                    id="category-page-title"
                    className="mt-3 text-balance text-[clamp(2.15rem,4.2vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.04em] text-foreground"
                  >
                    Topik: <span className="text-primary">{category.name}</span>
                  </h1>
                </div>
                <div className="text-sm font-medium text-foreground-muted lg:text-right">
                  <span>{posts.length} artikel terbit</span>
                </div>
              </header>
            </ScrollReveal>

            {/* Grid Artikel */}
            {posts.length > 0 ? (
              <div className="mt-8 sm:mt-10">
                <ScrollReveal>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {posts.map((post: any) => (
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
                                {category.name}
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

                            <h2 className="mt-2.5 text-[1.125rem] font-medium leading-[1.3] tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
                              {post.title}
                            </h2>

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
            ) : (
              <div className="mt-10 rounded-2xl border border-border bg-white p-10 text-center sm:p-16">
                <BookOpen size={36} className="mx-auto text-foreground-soft" strokeWidth={1.5} aria-hidden="true" />
                <h2 className="mt-4 text-xl font-medium tracking-tight text-foreground">
                  Belum ada artikel dalam kategori ini
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-foreground-muted">
                  Kunjungi halaman blog untuk melihat koleksi inspirasi dan artikel lainnya.
                </p>
                <div className="mt-6">
                  <Link href="/blog" className="site-button-primary">
                    Lihat Semua Artikel
                  </Link>
                </div>
              </div>
            )}

            {/* CTA Konsultasi Sesuai Desain Induk */}
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
