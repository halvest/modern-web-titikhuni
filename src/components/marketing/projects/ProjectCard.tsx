import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Images, MapPin } from "lucide-react";
import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  priority = false,
  className = "",
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  return (
    <article className={`group flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/80 bg-white ${className}`}>
      <Link
        href={`/proyek/${project.slug}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-label={`Lihat proyek ${project.title} di ${project.location}`}
      >
        <figure className="relative m-0 aspect-[16/10] w-full overflow-hidden bg-surface-muted">
          <Image
            src={project.cover_image}
            alt={`Foto ${project.title} di ${project.location}`}
            fill
            preload={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" aria-hidden="true" />
          {project.gallery_images.length > 0 && (
            <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-950/75 px-2.5 py-1 text-[0.68rem] font-medium text-white">
              <Images size={12} aria-hidden="true" /> {project.gallery_images.length} foto
            </span>
          )}
          <div className="absolute right-3.5 top-3.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
        </figure>
        <div className="flex flex-1 flex-col p-5">
          <p className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-primary">
            <MapPin size={13} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{project.location}</span>
          </p>
          <h3 className="mt-2.5 text-xl font-medium leading-tight tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mb-5 mt-2 line-clamp-3 text-sm leading-6 text-foreground-muted">
            {project.short_description}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4 text-xs">
            <span className="font-medium text-foreground-soft">Dokumentasi proyek</span>
            <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-primary">
              Lihat detail <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
