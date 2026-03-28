import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Hash } from "lucide-react";

// 1. Generate Metadata Dinamis untuk SEO Kategori
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", params.slug)
    .single();

  if (!category) return { title: "Kategori Tidak Ditemukan" };

  return {
    title: `Artikel ${category.name} | Titik Huni Blog`,
    description: `Kumpulan artikel edukasi dan tips properti kategori ${category.name}.`,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

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
    .eq("slug", params.slug)
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
    <main className="min-h-screen bg-white pb-32">
      {/* Header Kategori */}
      <section className="pt-32 pb-20 px-6 border-b border-neutral-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/blog"
            className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 hover:text-black transition-colors flex items-center gap-2"
          >
            All Journal <ArrowRight size={12} />
          </Link>
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              <span className="text-neutral-200">#</span>
              {category.name}
            </h1>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Found {posts.length} articles in this category
            </p>
          </div>
        </div>
      </section>

      {/* Grid Artikel */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post: any) => (
              <article key={post.id} className="group space-y-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-[4/3] block rounded-[32px] overflow-hidden bg-neutral-50 shadow-sm group-hover:shadow-2xl transition-all duration-500"
                >
                  <Image
                    src={post.featured_image || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    <span className="text-black">{category.name}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-black leading-tight tracking-tighter uppercase group-hover:text-neutral-500 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-400 font-medium leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pt-2 group-hover:gap-4 transition-all"
                  >
                    Read More <ArrowRight size={14} strokeWidth={3} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-4">
            <Hash className="mx-auto text-neutral-100" size={60} />
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
              Belum ada artikel di kategori ini.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
