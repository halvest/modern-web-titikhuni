import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Images } from "lucide-react";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getPublishedProjectBySlug } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

function absoluteImageUrl(url: string) {
  return url.startsWith("http") ? url : siteConfig.url + url;
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
  const galleryImages = images.slice(1);
  const whatsappNumber = siteConfig.organization.telephone.replace(/\D/g, "");

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
      className="min-h-screen bg-surface text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── HERO FULLSCREEN ─────────────────────────────────────── */}
      <section
        aria-label="Hero proyek"
        className="relative h-[100svh] w-full overflow-hidden"
      >
        <Image
          src={project.cover_image}
          alt={"Foto " + project.title + " di " + project.location}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 to-black/75" />

        {/* top nav bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-8">
          <Link
            href="/proyek"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all hover:bg-black/40"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Semua Proyek
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <Images size={14} aria-hidden="true" />
            {images.length} foto
          </span>
        </div>

        {/* hero title pinned to bottom */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-16 lg:px-16 lg:pb-20">
          <p className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/60">
            <MapPin size={12} aria-hidden="true" />
            {project.location}
          </p>
          <h1 className="mt-4 max-w-5xl text-balance text-[clamp(2.4rem,5.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
            {project.title}
          </h1>
        </div>
      </section>

      <article>
        {/* ── DESCRIPTION ─────────────────────────────────────── */}
        <section
          id="deskripsi"
          className="site-container py-14 md:py-20 lg:py-24"
          aria-labelledby="project-desc-title"
        >
          <div className="grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-20">
            {/* left: meta */}
            <div className="md:col-span-4">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-primary">
                Tentang Proyek
              </p>
              <h2
                id="project-desc-title"
                className="mt-4 text-2xl font-medium leading-snug tracking-[-0.04em] text-foreground lg:text-[1.75rem]"
              >
                Dokumentasi {project.title}.
              </h2>

              <dl className="mt-8 flex flex-col gap-0">
                {[
                  { label: "Lokasi", value: project.location },
                  {
                    label: "Dokumentasi",
                    value: `${images.length} foto proyek`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="border-t border-border py-4">
                    <dt className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-foreground-soft">
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* right: description + CTA */}
            <div className="flex flex-col justify-between gap-10 md:col-span-7 md:col-start-6">
              <p className="text-pretty text-lg leading-9 text-foreground-muted lg:text-xl lg:leading-[1.8]">
                {project.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan proyek ${encodeURIComponent(project.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-hover"
                >
                  Tanya via WhatsApp
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
                <Link
                  href="/proyek"
                  className="inline-flex items-center gap-2.5 rounded-full border border-border-strong px-6 py-3.5 text-sm font-semibold text-foreground-muted transition-all duration-300 hover:border-foreground hover:text-foreground"
                >
                  Proyek lainnya
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PHOTO GALLERY CAROUSEL ───────────────────────────── */}
        {galleryImages.length > 0 && (
          <section
            className="pb-16 md:pb-24"
            aria-label={"Galeri foto " + project.title}
          >
            {/* section header */}
            <div className="site-container mb-8 flex items-end justify-between border-t border-foreground/10 pt-8 md:mb-10 md:pt-10">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-primary">
                  Galeri
                </p>
                <h2 className="mt-2.5 text-2xl font-medium tracking-[-0.04em] text-foreground lg:text-3xl">
                  Galeri foto <span className="font-normal text-primary">{project.title}.</span>
                </h2>
              </div>
              <p className="shrink-0 text-xs font-medium text-foreground-soft">
                {galleryImages.length} foto
              </p>
            </div>

            {/* horizontal snap carousel */}
            <div
              role="list"
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5 md:px-10 lg:gap-6 lg:px-16"
            >
              {galleryImages.map((img, idx) => {
                const aspectClass =
                  idx % 3 === 0
                    ? "h-[58vw] w-[78vw] md:h-[58vh] md:w-[52vw] lg:h-[62vh] lg:w-[44vw]"
                    : idx % 3 === 1
                      ? "h-[58vw] w-[62vw] md:h-[58vh] md:w-[38vw] lg:h-[62vh] lg:w-[30vw]"
                      : "h-[58vw] w-[70vw] md:h-[58vh] md:w-[46vw] lg:h-[62vh] lg:w-[38vw]";

                return (
                  <figure
                    key={img}
                    role="listitem"
                    className={`relative shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-muted md:rounded-3xl ${aspectClass}`}
                  >
                    <Image
                      src={img}
                      alt={`Foto ${idx + 2} proyek ${project.title} di ${project.location}`}
                      fill
                      sizes="(max-width: 768px) 78vw, 52vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </figure>
                );
              })}
            </div>

            <p className="mt-5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground-soft">
              Geser untuk melihat semua
            </p>
          </section>
        )}
      </article>
    </main>
  );
}

