import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/projects";

export function FeaturedProjectCard({
  project,
  wide = false,
  eager = false,
}: {
  project: Project;
  wide?: boolean;
  eager?: boolean;
}) {
  return (
    <article className="flex h-full w-full min-w-0 flex-1">
      <Link
        href={`/proyek/${project.slug}`}
        aria-label={`Lihat proyek ${project.title} di ${project.location}`}
        className="group flex h-full w-full flex-col rounded-[1rem] transition-transform duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1rem] bg-surface-muted">
          <Image
            src={project.cover_image}
            alt={`Foto ${project.title} di ${project.location}`}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={
              wide
                ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 50vw"
                : "(max-width: 767px) 85vw, (max-width: 1023px) 50vw, 25vw"
            }
            className="object-cover brightness-105 transition-[filter,transform] duration-700 ease-out motion-safe:group-hover:scale-[1.04] motion-safe:group-hover:brightness-110"
          />
        </div>

        <div className="relative z-10 mx-2 -mt-7 flex flex-1 flex-col rounded-[0.85rem] border border-border bg-white p-4 text-foreground shadow-[0_18px_35px_-22px_rgba(35,68,56,0.25)] sm:mx-3 sm:-mt-8 sm:p-5">
          <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
            <MapPin size={12} className="shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{project.location}</span>
          </p>
          <h3 className="mt-2 text-balance text-[clamp(1.2rem,1.7vw,1.45rem)] font-medium leading-[1.22] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-[0.8125rem] leading-5 text-foreground-muted">
            {project.short_description}
          </p>
          <span className="mt-auto flex items-center justify-between gap-3 border-t border-border-strong pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary">
            Lihat detail proyek
            <ArrowUpRight
              size={16}
              className="shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
