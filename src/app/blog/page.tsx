import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowUpRight, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

// 🔥 SEO OPTIMIZED METADATA
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
  alternates: {
    canonical: "https://titikhuni.id/blog",
  },
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

  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("type", "post");

  const { data: posts } = await supabase
    .from("posts")
    .select(`*, categories:category_id (name, slug)`)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* 🔥 STRUCTURED DATA (SEO BOOST BESAR) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog Titik Huni",
            url: "https://titikhuni.id/blog",
            description:
              "Blog properti berisi tips investasi, panduan membeli rumah, dan tren properti terbaru di Yogyakarta.",
          }),
        }}
      />

      <main className="bg-neutral-50 min-h-screen flex flex-col">
        {/* NAVBAR */}
        <Navbar />

        <div className="flex-1 pt-20 md:pt-28">
          {/* HERO */}
          <section className="px-6 pt-10 pb-12">
            <div className="max-w-7xl mx-auto">
              <header className="max-w-3xl">
                <p className="text-xs text-emerald-600 uppercase tracking-[0.3em] mb-4 font-semibold">
                  Blog Properti
                </p>

                {/* 🔥 H1 SEO */}
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
                  Insight, Tips & Tren Properti di Yogyakarta
                </h1>

                <p className="mt-4 text-neutral-500 text-sm leading-relaxed">
                  Panduan lengkap membeli rumah, strategi investasi properti,
                  hingga tren terbaru pasar properti Jogja.
                </p>
              </header>

              {/* CATEGORY */}
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="px-4 py-2 text-xs rounded-full bg-black text-white"
                >
                  Semua
                </Link>

                {categories?.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blog/category/${cat.slug}`}
                    className="px-4 py-2 text-xs rounded-full border border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-400 transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* BLOG GRID */}
          <section className="px-6 pb-24">
            <div className="max-w-7xl mx-auto">
              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                {posts?.map((post) => (
                  <article key={post.id} className="group">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                        <Image
                          src={
                            post.featured_image ||
                            "/assets/images/placeholder-blog.jpg"
                          }
                          alt={post.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-2 text-neutral-400 text-xs">
                          <Calendar size={12} />
                          <time dateTime={post.created_at}>
                            {new Date(post.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </time>
                        </div>

                        {/* 🔥 H2 SEO PER ARTICLE */}
                        <h2 className="text-lg font-semibold text-neutral-900 leading-snug group-hover:text-emerald-600 transition">
                          {post.title}
                        </h2>

                        <p className="text-sm text-neutral-500 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-neutral-400 group-hover:text-black transition">
                          <span>Baca artikel</span>
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* EMPTY */}
              {(!posts || posts.length === 0) && (
                <div className="py-32 text-center">
                  <BookOpen
                    className="mx-auto text-neutral-200 mb-4"
                    size={48}
                  />
                  <p className="text-sm text-neutral-400">
                    Belum ada artikel tersedia
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}
