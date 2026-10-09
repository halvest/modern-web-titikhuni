import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Images,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getPublishedProjectBySlug } from "@/lib/projects";
import { ProjectGallery } from "@/components/marketing/projects/ProjectGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

function absoluteImageUrl(url: string) {
  return url.startsWith("http") ? url : siteConfig.url + url;
}

/** Display-only: normalizes comma spacing, e.g. "Sleman,Yogyakarta" → "Sleman, Yogyakarta". */
function formatLocation(location: string) {
  return location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: "Proyek Tidak Ditemukan | Titik Huni" };
  }

  const title = project.title + " — " + project.location + " | Titik Huni";
  const url = siteConfig.url + "/proyek/" + project.slug;
  const image = absoluteImageUrl(project.cover_image);

  return {
    title: { absolute: title },
    description: project.short_description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description: project.short_description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 800,
          alt: "Foto " + project.title + " di " + project.location,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.short_description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const { project, error } = await getPublishedProjectBySlug(slug);

  if (error || !project) notFound();

  const pageUrl = siteConfig.url + "/proyek/" + project.slug;
  const images = Array.from(
    new Set([project.cover_image, ...(project.gallery_images ?? [])])
  );
  const location = formatLocation(project.location);
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan proyek ${project.title}`
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": pageUrl + "#project",
        name: project.title,
        description: project.short_description,
        url: pageUrl,
        image: images.map(absoluteImageUrl),
        contentLocation: {
          "@type": "Place",
          name: project.location,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Proyek",
            item: siteConfig.url + "/proyek",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-surface pt-[var(--header-height)] text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────
          Starts below the fixed navbar so controls are never covered.
          Landscape on mobile/tablet, near-fullscreen on desktop. */}
      <section
        aria-label="Hero proyek"
        className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted sm:aspect-[16/9] lg:aspect-auto lg:h-[calc(100svh-var(--header-height))] lg:max-h-[54rem] lg:min-h-[34rem]"
      >
        <Image
          src={project.cover_image}
          alt={"Foto " + project.title + " di " + location}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* legibility overlay — heavier at the bottom where the title sits */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />

        {/* top controls */}
        <div className="site-container absolute inset-x-0 top-0 flex items-center justify-between gap-3 pt-3 sm:pt-5 lg:pt-8">
          <Link
            href="/proyek"
            className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-11 sm:px-4 sm:text-xs"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Semua Proyek
          </Link>
        </div>

        {/* title block */}
        <div className="site-container absolute inset-x-0 bottom-0 pb-4 sm:pb-8 lg:pb-14">
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.2em]">
            <MapPin size={11} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </div>
          <h1 className="mt-2 max-w-4xl text-balance text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white drop-shadow-md sm:mt-3 sm:text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,4.75rem)] lg:leading-[0.98] lg:tracking-[-0.045em]">
            {project.title}
          </h1>
        </div>
      </section>

      <article>
        {/* ── GALLERY ─────────────────────────────────────── */}
        <ProjectGallery
          images={images}
          title={project.title}
          location={location}
        />

        {/* ── ABOUT + DETAIL CARD ─────────────────────────── */}
        <section
          id="deskripsi"
          aria-labelledby="project-desc-title"
          className="border-t border-border bg-white"
        >
          <div className="site-container grid gap-8 py-12 md:grid-cols-12 md:gap-10 md:py-16 lg:gap-12 lg:py-20">
            {/* narrative */}
            <div className="md:col-span-6 lg:col-span-7">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary">
                Tentang Proyek
              </p>
              <h2
                id="project-desc-title"
                className="mt-2 text-2xl font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-[1.75rem] lg:text-3xl"
              >
                {project.title}
              </h2>
              <p className="mt-5 max-w-[62ch] whitespace-pre-line text-pretty text-base leading-relaxed text-foreground-muted sm:text-lg sm:leading-[1.75]">
                {project.short_description}
              </p>
            </div>

            {/* detail card + CTA */}
            <aside
              aria-label="Detail proyek"
              className="md:col-span-6 lg:col-span-5 xl:col-span-4 xl:col-start-9"
            >
              <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 md:sticky md:top-[calc(var(--header-height)+1.5rem)]">
                <dl className="divide-y divide-border">
                  <div className="flex items-start gap-3 pb-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary ring-1 ring-border">
                      <MapPin size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-foreground-soft">
                        Lokasi
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">
                        {location}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary ring-1 ring-border">
                      <Images size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-foreground-soft">
                        Dokumentasi
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">
                        {images.length} foto proyek
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 border-t border-border pt-6">
                  <p className="text-sm font-medium text-foreground">
                    Ingin membangun hunian serupa?
                  </p>
                  <p className="mt-1 text-sm text-foreground-soft">
                    Diskusikan kebutuhan Anda langsung dengan tim kami.
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-button-primary group w-full"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Tanya via WhatsApp
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                    <Link
                      href="/proyek"
                      className="site-button-secondary w-full"
                    >
                      Lihat proyek lainnya
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
