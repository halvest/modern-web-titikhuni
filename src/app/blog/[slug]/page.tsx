import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import {
  Calendar,
  ArrowLeft,
  Share2,
  Clock,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
    .select("title, excerpt, featured_image")
    .eq("slug", decodeURIComponent(slug))
    .maybeSingle();

  if (!post) return { title: "Artikel Tidak Ditemukan" };

  const fullTitle = `${post.title} | Blog Titik Huni`;

  return {
    title: fullTitle,
    description: post.excerpt,
    alternates: {
      canonical: `https://titikhuni.id/blog/${slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: post.excerpt,
      images: [post.featured_image || ""],
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

  const post = postRes.data;
  const units = unitsRes.data || [];
  const recentPosts = recentPostsRes.data || [];

  if (!post) return notFound();

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
    <div className="min-h-screen bg-white flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-20 md:pt-28">
        {/* BREADCRUMBS & NAVIGASI ATAS */}
        <div className="border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              <Link
                href="/blog"
                className="flex items-center gap-2 hover:text-black transition"
              >
                <ArrowLeft size={14} /> Blog
              </Link>
              <ChevronRight size={10} />
              <span className="text-neutral-900">{post.categories?.name}</span>
            </nav>
            <div className="flex items-center gap-5">
              <Share2
                size={16}
                className="text-neutral-400 hover:text-black cursor-pointer transition"
              />
              <Bookmark
                size={16}
                className="text-neutral-400 hover:text-black cursor-pointer transition"
              />
            </div>
          </div>
        </div>

        {/* LAYOUT GRID UTAMA */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          {/* SIDEBAR KIRI: Rekomendasi Unit (HCI: Contextual Relevance) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div className="pb-4 border-b border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
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
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                      <Image
                        src={unit.image_url}
                        alt={unit.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-emerald-600 transition-colors">
                        {unit.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <MapPin size={10} className="text-emerald-600" />
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
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition"
              >
                Lihat Semua Unit <ChevronRight size={12} />
              </Link>
            </div>
          </aside>

          {/* KONTEN UTAMA */}
          <main className="lg:col-span-6">
            <article className="space-y-10">
              <header className="space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-bold text-emerald-600 tracking-widest uppercase">
                  <span>{post.categories?.name}</span>
                  <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Clock size={12} /> 5 Menit Baca
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 leading-tight tracking-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-neutral-400">
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
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                )}
              </header>

              {/* AREA TEKS ARTIKEL */}
              <section
                className="prose prose-neutral max-w-none 
                prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
                prose-headings:font-semibold prose-headings:text-neutral-900
                prose-img:rounded-2xl prose-img:shadow-sm
                prose-a:text-emerald-600 prose-a:font-semibold hover:prose-a:underline"
              >
                {post.content ? (
                  parse(post.content)
                ) : (
                  <p className="text-center py-20 italic">Memuat konten...</p>
                )}
              </section>

              {/* INLINE CTA BOX */}
              <div className="mt-20 p-8 bg-neutral-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-white">
                    Temukan Titik Huni Anda
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-xs">
                    Konsultasikan properti Yogyakarta bersama
                    penasihat ahli kami.
                  </p>
                </div>
                <Link
                  href="/unit"
                  className="px-8 py-4 bg-white text-neutral-900 text-xs font-bold rounded-full hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-3"
                >
                  LIHAT UNIT <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          </main>

          {/* SIDEBAR KANAN: Artikel Terkait (Retention Strategy) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-10">
              <div className="pb-4 border-b border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
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
                    <h4 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>

              {/* NEWSLETTER PREVIEW */}
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-5">
                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">
                  Update Mingguan
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Dapatkan tren harga properti Jogja langsung di email Anda.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <button className="w-full py-2.5 bg-neutral-900 text-white text-[10px] font-bold rounded-xl hover:bg-black">
                    LANGGANAN
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
