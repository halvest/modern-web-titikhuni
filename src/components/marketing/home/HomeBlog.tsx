import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { ScrollReveal } from "@/components/ScrollReveal";

function getCategoryName(category: { name: string } | { name: string }[] | null): string {
  if (Array.isArray(category)) return category[0]?.name || "Jurnal Titik Huni";
  return category?.name || "Jurnal Titik Huni";
}

export async function HomeBlog() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, featured_image, categories:category_id(name)")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !posts?.length) return null;

  return (
    <section
      id="jurnal"
      aria-labelledby="home-blog-title"
      className="scroll-mt-[var(--header-height)] bg-transparent py-8 text-foreground md:py-12 lg:py-10 xl:py-12"
    >
      <div className="site-container">
        <ScrollReveal>
        <header className="mb-6 max-w-3xl lg:mb-7">
          <p className="site-eyebrow text-primary before:bg-primary">
            Artikel &amp; Inspirasi
          </p>
          <h2
            id="home-blog-title"
            className="mt-4 text-balance text-[clamp(2.35rem,4vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.05em] lg:mt-5"
          >
            Artikel Titik Huni
          </h2>
        </header>
        </ScrollReveal>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="min-w-0">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full items-center gap-3 rounded-[0.875rem] border border-[#dce6dd] bg-[#f1f5f0] p-2.5 shadow-[0_12px_30px_-28px_rgba(35,68,56,0.4)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-[#e8efe8] hover:shadow-[0_16px_30px_-24px_rgba(35,68,56,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[0.6rem] bg-surface-muted">
                  <Image
                    src={post.featured_image || "/assets/images/konsep_titikhuni.webp"}
                    alt={post.title}
                    fill
                    loading="lazy"
                    sizes="6rem"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-primary">
                    {getCategoryName(post.categories)}
                  </p>
                  <h3 className="mt-1 text-sm font-medium leading-5 tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary sm:text-[0.9375rem] sm:leading-[1.4]">
                    {post.title}
                  </h3>
                </div>
                <ArrowUpRight size={15} strokeWidth={1.7} className="shrink-0 self-start text-primary" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-border-strong pt-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
            Panduan dan catatan Titik Huni tentang hunian, desain, dan properti di Yogyakarta.
          </p>
          <Link
            href="/blog"
            className="site-link-editorial group"
          >
            Lihat semua artikel
            <ArrowRight size={16} strokeWidth={1.7} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
