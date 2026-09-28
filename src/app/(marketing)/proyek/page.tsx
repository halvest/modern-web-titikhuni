import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { ProjectCard } from "@/components/marketing/projects/ProjectCard";
import { siteConfig } from "@/config/site";
import { getPublishedProjectsPage } from "@/lib/projects";

const pageUrl = siteConfig.url + "/proyek";
const pageTitle = "Portofolio Proyek Hunian di Yogyakarta";
const pageDescription =
  "Jelajahi foto, lokasi, dan detail proyek rumah di Yogyakarta dalam portofolio Titik Huni. Temukan dokumentasi hunian di Sleman dan Bantul.";

type ProjectsPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

const PAGE_SIZE = 9;

function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(rawValue || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function projectsPageHref(page: number) {
  return page <= 1 ? "/proyek#daftar-proyek" : `/proyek?page=${page}#daftar-proyek`;
}

function paginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  const visiblePages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const pages = Array.from(visiblePages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

export async function generateMetadata({ searchParams }: ProjectsPageProps): Promise<Metadata> {
  const currentPage = parsePage((await searchParams).page);
  const canonical = currentPage === 1 ? pageUrl : `${pageUrl}?page=${currentPage}`;
  const title = currentPage === 1 ? pageTitle : `${pageTitle} - Halaman ${currentPage}`;
  return {
    title: { absolute: `${title} | Titik Huni` },
    description: pageDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: pageDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: `${siteConfig.url}/og.jpg`, width: 1200, height: 630, alt: "Portofolio proyek rumah Titik Huni di Yogyakarta" }],
    },
    twitter: { card: "summary_large_image", title, description: pageDescription, images: [`${siteConfig.url}/og.jpg`] },
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const requestedPage = parsePage((await searchParams).page);
  const { projects, total, error } = await getPublishedProjectsPage(requestedPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (!error && total > 0 && requestedPage > totalPages) redirect(projectsPageHref(totalPages));
  const startItem = total > 0 ? (requestedPage - 1) * PAGE_SIZE + 1 : 0;
  const endItem = Math.min(requestedPage * PAGE_SIZE, total);
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Halo Titik Huni, saya ingin berdiskusi mengenai desain dan pembangunan proyek hunian.")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: requestedPage === 1 ? pageUrl : `${pageUrl}?page=${requestedPage}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: (requestedPage - 1) * PAGE_SIZE + index + 1,
        name: project.title,
        url: siteConfig.url + "/proyek/" + project.slug,
      })),
    },
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-surface text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="home-content-canvas min-h-screen">
        <section className="pt-[calc(var(--header-height)+1rem)] pb-12 sm:pb-16 md:pt-[calc(var(--header-height)+1.5rem)] md:pb-20" aria-labelledby="projects-page-title">
          <div className="site-container">
            <nav aria-label="Breadcrumb" className="mb-3.5 text-xs text-foreground-soft sm:mb-4">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="underline-offset-4 hover:text-primary hover:underline">Beranda</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">Proyek</li>
              </ol>
            </nav>

            <header className="flex flex-col justify-between gap-5 border-b border-border/80 pb-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="site-eyebrow text-primary before:bg-primary">Portofolio Titik Huni · Yogyakarta</p>
                <h1 id="projects-page-title" className="mt-2 text-balance text-[clamp(2.15rem,4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em]">
                  Proyek hunian yang kami <span className="text-primary">wujudkan.</span>
                </h1>
              </div>
              <div className="max-w-md lg:text-right">
                <p className="text-pretty text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
                  Jelajahi dokumentasi desain dan pembangunan hunian Titik Huni di Yogyakarta.
                </p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
                  Diskusikan proyek Anda <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </header>

            <div id="daftar-proyek" className="mt-7 scroll-mt-24 flex flex-wrap items-end justify-between gap-3 md:mt-9">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Karya Titik Huni</p>
                <h2 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Portofolio terbaru</h2>
              </div>
              {!error && projects.length > 0 && (
                <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-foreground-muted">
                  Menampilkan {startItem}–{endItem} dari {total} proyek
                </p>
              )}
            </div>

            <div className="mt-5 md:mt-6">
          {error ? (
            <div className="rounded-xl border border-border bg-white p-10 text-center sm:p-14">
              <FolderKanban size={34} className="mx-auto text-foreground-soft" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-4 font-medium">Portofolio belum dapat dimuat.</p>
              <p className="mt-2 text-sm text-foreground-soft">
                Silakan coba kembali beberapa saat lagi.
              </p>
            </div>
          ) : projects.length ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} priority={index === 0} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav aria-label="Navigasi halaman proyek" className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10">
                  {requestedPage > 1 ? (
                    <Link href={projectsPageHref(requestedPage - 1)} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-white px-4 text-sm font-semibold text-foreground hover:bg-surface">Sebelumnya</Link>
                  ) : (
                    <span aria-disabled="true" className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground-soft opacity-50">Sebelumnya</span>
                  )}

                  {paginationItems(requestedPage, totalPages).map((item, index) => item === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className="inline-flex size-11 items-center justify-center text-sm text-foreground-soft" aria-hidden="true">…</span>
                  ) : (
                    <Link
                      key={item}
                      href={projectsPageHref(item)}
                      aria-label={`Halaman ${item}`}
                      aria-current={item === requestedPage ? "page" : undefined}
                      className={`inline-flex size-11 items-center justify-center rounded-lg border text-sm font-semibold ${item === requestedPage ? "border-primary bg-primary text-white" : "border-border-strong bg-white text-foreground hover:bg-surface"}`}
                    >
                      {item}
                    </Link>
                  ))}

                  {requestedPage < totalPages ? (
                    <Link href={projectsPageHref(requestedPage + 1)} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-white px-4 text-sm font-semibold text-foreground hover:bg-surface">Berikutnya</Link>
                  ) : (
                    <span aria-disabled="true" className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground-soft opacity-50">Berikutnya</span>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-border bg-white p-10 text-center sm:p-14">
              <FolderKanban size={34} className="mx-auto text-foreground-soft" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-4 font-medium">Portofolio sedang dikurasi.</p>
              <p className="mt-2 text-sm text-foreground-soft">
                Kunjungi kembali untuk melihat karya terbaru Titik Huni.
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
