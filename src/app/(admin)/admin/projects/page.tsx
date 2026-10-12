import Image from "next/image";
import Link from "next/link";
import { Edit3, Images, Plus, Star } from "lucide-react";
import { requireAdminPage } from "@/utils/supabase/server";
import type { Project } from "@/lib/projects";
import { DeleteProjectButton } from "./DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdminPage();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, location, short_description, cover_image, gallery_images, featured, featured_order, published, created_at, updated_at"
    )
    .order("featured", { ascending: false })
    .order("featured_order", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  const projects = (data ?? []) as Project[];
  const publishedCount = projects.filter((project) => project.published).length;
  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <div className="w-full space-y-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Proyek</span>
            </h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500">
            Kelola portfolio visual dan proyek pilihan di homepage Titik Huni.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          <Plus size={15} aria-hidden="true" />
          Tambah Proyek
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: projects.length, icon: Images },
          { label: "Terbit", value: publishedCount, icon: Images },
          { label: "Unggulan", value: featuredCount, icon: Star },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <item.icon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
              <p className="text-2xl font-black text-slate-900">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">
          Data proyek gagal dimuat.
        </div>
      ) : projects.length ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group grid gap-5 p-5 transition-colors hover:bg-slate-50/50 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={project.cover_image}
                    alt={"Cover " + project.title}
                    fill
                    sizes="160px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-bold text-slate-900">
                      {project.title}
                    </h2>
                    <span
                      className={
                        "rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider " +
                        (project.published
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-500")
                      }
                    >
                      {project.published ? "Terbit" : "Draft"}
                    </span>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                        <Star size={12} fill="currentColor" aria-hidden="true" />
                        Unggulan {project.featured_order}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 truncate text-[13px] font-medium text-slate-500">
                    {project.location} <span className="mx-1 text-slate-300">•</span> {project.gallery_images.length} gambar
                  </p>
                  <p className="mt-2.5 line-clamp-1 text-[13px] leading-relaxed text-slate-400">
                    {project.short_description}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={"/admin/projects/edit/" + project.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-900 hover:text-white hover:shadow-sm"
                    aria-label={"Edit proyek " + project.title}
                  >
                    <Edit3 size={15} aria-hidden="true" />
                  </Link>
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <Images
            size={36}
            className="mx-auto text-slate-300"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-bold text-slate-700">
            Belum ada proyek.
          </p>
          <p className="mt-1.5 text-[13px] text-slate-500">
            Tambahkan karya pertama untuk mengisi portfolio Titik Huni.
          </p>
        </div>
      )}
    </div>
  );
}
