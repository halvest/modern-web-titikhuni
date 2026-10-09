import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Hash } from "lucide-react";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Generate Metadata Dinamis untuk SEO Kategori
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", slug)
    .single();

  const title = category
    ? `Kategori: ${category.name} | Titik Huni`
    : "Kategori Blog | Titik Huni";
  const desc = category
    ? `Kumpulan artikel properti dan arsitektur untuk kategori ${category.name}.`
    : "Kumpulan artikel properti dan arsitektur dari Titik Huni.";

  return generateSeoMetadata({
    title,
    description: desc,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;


  // 2. Ambil data kategori & artikel terkait dalam satu query
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
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !category) {
    notFound();
  }

  // Filter artikel yang hanya status 'published' dan belum di-soft delete
  const posts =
    category.posts?.filter(
      (p: any) => p.status === "published" && p.deleted_at === null,
    ) || [];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background pb-24 pt-[var(--header-height)]"
    >
      {/* Header Kategori */}
      <section className="site-section border-b border-border pb-16">
        <div className="site-container space-y-8">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground-soft transition-colors hover:text-primary"
          >
            Semua artikel <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <div className="space-y-4">
            <p className="site-eyebrow">Kategori jurnal</p>
            <h1 className="flex items-baseline gap-3 text-balance text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              <span className="font-normal  text-primary">#</span>
              <span>{category.name}</span>
            </h1>
            <p className="text-sm text-foreground-soft">
              {posts.length} artikel dalam kategori ini
            </p>
          </div>
        </div>
      </section>

      {/* Grid Artikel */}
      <section className="site-container mt-16 md:mt-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any, index: number) => (
              <article key={post.id} className="group space-y-5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                  <Image
                    src={post.featured_image || "/assets/images/konsep_titikhuni.webp"}
                    alt={post.title}
                    fill
                    priority={index === 0}
                    quality={75}
                    sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                </Link>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-soft">
                    <span className="text-primary">{category.name}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} aria-hidden="true" />
                      {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-balance text-2xl font-medium leading-tight tracking-[-0.035em] transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="line-clamp-2 text-sm leading-7 text-foreground-muted">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex min-h-10 items-center gap-2 pt-1 text-sm font-semibold transition-all group-hover:gap-3 group-hover:text-primary"
                  >
                    Baca artikel <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-[1.5rem] border border-border bg-white/50 py-28 text-center">
            <Hash className="mx-auto text-foreground-soft" size={52} aria-hidden="true" />
            <p className="text-sm font-medium text-foreground-soft">
              Belum ada artikel di kategori ini.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
