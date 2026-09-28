"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import {
  createProject,
  updateProject,
} from "@/app/(admin)/admin/projects/actions";

export type ProjectEditorData = {
  id?: string;
  title: string;
  slug: string;
  location: string;
  short_description: string;
  cover_image: string;
  gallery_images: string[];
  featured: boolean;
  featured_order: number | null;
  published: boolean;
};

const emptyProject: ProjectEditorData = {
  title: "",
  slug: "",
  location: "",
  short_description: "",
  cover_image: "",
  gallery_images: [],
  featured: false,
  featured_order: null,
  published: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectEditor({
  initialData,
}: {
  initialData?: ProjectEditorData;
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData ?? emptyProject);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const supabase = createClient();
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(initialData ?? emptyProject),
    [data, initialData]
  );
  useEffect(() => {
    const warnBeforeClose = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeClose);
    return () => window.removeEventListener("beforeunload", warnBeforeClose);
  }, [hasUnsavedChanges]);

  const leaveEditor = () => {
    if (hasUnsavedChanges && !window.confirm("Perubahan proyek belum disimpan. Tetap keluar?")) return;
    router.push("/admin/projects");
  };

  const setField = <K extends keyof ProjectEditorData>(
    key: K,
    value: ProjectEditorData[K]
  ) => setData((current) => ({ ...current, [key]: value }));

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    if (data.gallery_images.length + files.length > 20) {
      toast.error("Galeri maksimal berisi 20 gambar.");
      return;
    }

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024
    );
    if (invalidFile) {
      toast.error("Gunakan file gambar maksimal 10 MB.");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Mengunggah gambar proyek...");
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const safeName = file.name
            .toLowerCase()
            .replace(/[^a-z0-9.]+/g, "-")
            .replace(/^-+|-+$/g, "");
          const path = crypto.randomUUID() + "-" + safeName;
          const { error } = await supabase.storage
            .from("projects")
            .upload(path, file, {
              cacheControl: "31536000",
              upsert: false,
            });
          if (error) throw error;
          return supabase.storage.from("projects").getPublicUrl(path).data
            .publicUrl;
        })
      );

      setData((current) => ({
        ...current,
        gallery_images: Array.from(
          new Set([...current.gallery_images, ...urls])
        ),
        cover_image: current.cover_image || urls[0],
      }));
      toast.success(
        files.length === 1
          ? "Gambar berhasil diunggah."
          : files.length + " gambar berhasil diunggah.",
        { id: toastId }
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gambar gagal diunggah.",
        { id: toastId }
      );
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.gallery_images.length) return;
    const reordered = [...data.gallery_images];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setField("gallery_images", reordered);
  };

  const removeImage = (url: string) => {
    const gallery = data.gallery_images.filter((image) => image !== url);
    setData((current) => ({
      ...current,
      gallery_images: gallery,
      cover_image:
        current.cover_image === url ? gallery[0] ?? "" : current.cover_image,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploading) {
      toast.error("Tunggu hingga unggahan selesai.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("cover_image", data.cover_image);
    formData.set("gallery_images", JSON.stringify(data.gallery_images));
    formData.set("published", String(data.published));
    formData.set("featured", String(data.featured));
    formData.set(
      "featured_order",
      data.featured_order === null ? "" : String(data.featured_order)
    );
    startTransition(async () => {
      const result = data.id
        ? await updateProject(data.id, formData)
        : await createProject(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.warning || "Proyek berhasil disimpan.");
      router.push("/admin/projects");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col w-full" style={{ flex: "1 1 0%", minHeight: 0 }}>
      <div className="overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ flex: "1 1 0%", minHeight: 0 }}>
        <div className="mx-auto w-full max-w-5xl">
      <button
        type="button"
        onClick={leaveEditor}
        className="mb-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors hover:text-emerald-600 focus:outline-none"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Kembali ke Proyek
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {data.id ? "Edit " : "Tambah "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Proyek
                </span>
              </h1>
            </div>
            <p className="text-[13px] font-medium text-slate-500">
              Satu editor ringkas untuk konten, galeri, publikasi, dan urutan unggulan.
            </p>
          </div>
          <button
            type="submit"
            disabled={pending || uploading}
            className="inline-flex min-h-11 flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending || uploading ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Save size={16} aria-hidden="true" />
            )}
            Simpan Proyek
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                  Data Proyek
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Informasi Utama
                </h2>
                <p className="mt-1.5 text-[13px] text-slate-500">
                  Informasi ini otomatis menjadi judul dan deskripsi SEO.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Nama proyek
                  </span>
                  <input
                    name="title"
                    required
                    value={data.title}
                    onChange={(event) => {
                      const title = event.target.value;
                      setData((current) => ({
                        ...current,
                        title,
                        slug: slugTouched ? current.slug : slugify(title),
                      }));
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="Rumah Bangunjiwo"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Lokasi
                  </span>
                  <input
                    name="location"
                    required
                    value={data.location}
                    onChange={(event) => setField("location", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="Bantul, Yogyakarta"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Slug</span>
                  <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                    <span className="flex items-center border-r border-slate-200 px-4 text-[13px] font-medium text-slate-400">
                      /proyek/
                    </span>
                    <input
                      name="slug"
                      required
                      value={data.slug}
                      onChange={(event) => {
                        setSlugTouched(true);
                        setField("slug", slugify(event.target.value));
                      }}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none"
                      placeholder="rumah-bangunjiwo"
                    />
                  </div>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Deskripsi singkat
                  </span>
                  <textarea
                    name="short_description"
                    required
                    rows={4}
                    value={data.short_description}
                    onChange={(event) =>
                      setField("short_description", event.target.value)
                    }
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="Gambarkan karakter ruang dan pendekatan desain proyek secara ringkas."
                  />
                  <span className="mt-2 block text-[11px] font-medium text-slate-400">
                    Dipakai pada card, meta description, dan Open Graph.
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                    Visual
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Galeri Proyek
                  </h2>
                  <p className="mt-1.5 text-[13px] text-slate-500">
                    Unggah beberapa gambar, atur urutan, lalu pilih satu sebagai
                    cover.
                  </p>
                </div>
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 focus-within:ring-2 focus-within:ring-slate-900">
                  {uploading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <ImagePlus size={15} aria-hidden="true" />
                  )}
                  Tambah Gambar
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    disabled={uploading}
                    onChange={async (event) => {
                      await uploadFiles(Array.from(event.target.files ?? []));
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>

              {data.gallery_images.length ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.gallery_images.map((url, index) => {
                    const isCover = data.cover_image === url;
                    return (
                      <div
                        key={url}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={url}
                            alt={
                              "Gambar " +
                              (index + 1) +
                              " proyek " +
                              (data.title || "Titik Huni")
                            }
                            fill
                            sizes="(max-width: 640px) 50vw, 260px"
                            className="object-cover"
                          />
                          {isCover && (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[0.65rem] font-semibold text-white shadow-sm">
                              <Check size={11} aria-hidden="true" />
                              Cover
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 p-2">
                          <button
                            type="button"
                            onClick={() => setField("cover_image", url)}
                            disabled={isCover}
                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-slate-600 transition hover:bg-white disabled:text-emerald-600"
                          >
                            <Star size={13} aria-hidden="true" />
                            {isCover ? "Cover" : "Jadikan cover"}
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white disabled:opacity-25"
                            aria-label={"Geser gambar " + (index + 1) + " ke atas"}
                          >
                            <ArrowUp size={14} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 1)}
                            disabled={index === data.gallery_images.length - 1}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white disabled:opacity-25"
                            aria-label={"Geser gambar " + (index + 1) + " ke bawah"}
                          >
                            <ArrowDown size={14} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label={"Hapus gambar " + (index + 1)}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <label className="mt-6 flex min-h-[16rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50">
                  <ImagePlus
                    size={40}
                    className="text-slate-300"
                    aria-hidden="true"
                  />
                  <span className="mt-4 text-sm font-bold text-slate-700">
                    Unggah dokumentasi proyek
                  </span>
                  <span className="mt-1.5 text-[13px] text-slate-500">
                    JPG, PNG, WebP, atau AVIF · maksimal 10 MB per gambar
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    disabled={uploading}
                    onChange={async (event) => {
                      await uploadFiles(Array.from(event.target.files ?? []));
                      event.target.value = "";
                    }}
                  />
                </label>
              )}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                Publikasi
              </h2>
              <label className="mt-5 flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Terbitkan Proyek
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                    Proyek akan tampil di halaman portfolio publik.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={data.published}
                  onChange={(event) => {
                    const published = event.target.checked;
                    setData((current) => ({
                      ...current,
                      published,
                      featured: published ? current.featured : false,
                      featured_order: published
                        ? current.featured_order
                        : null,
                    }));
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label
                className={
                  "mt-3 flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors " +
                  (data.published
                    ? "cursor-pointer border-slate-200 hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60")
                }
              >
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Sorot di Homepage
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                    Maksimal 6 proyek pada area unggulan.
                  </span>
                </span>
                <input
                  type="checkbox"
                  disabled={!data.published}
                  checked={data.featured}
                  onChange={(event) => {
                    const featured = event.target.checked;
                    setData((current) => ({
                      ...current,
                      featured,
                      featured_order: featured
                        ? current.featured_order ?? 1
                        : null,
                    }));
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              {data.featured && (
                <label className="mt-4 block">
                  <span className="text-[13px] font-bold text-slate-700">
                    Urutan Unggulan
                  </span>
                  <select
                    value={data.featured_order ?? 1}
                    onChange={(event) =>
                      setField("featured_order", Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    {[1, 2, 3, 4, 5, 6].map((order) => (
                      <option key={order} value={order}>
                        Urutan {order}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                SEO Otomatis
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-emerald-900/70">
                Titik Huni akan meracik Title, lokasi, deskripsi, slug, cover, canonical, Open Graph,
                alt gambar, sitemap, dan structured data secara pintar tanpa perlu diisi manual.
              </p>
            </section>
          </aside>
        </div>
      </form>
    </div>
      </div>
    </div>
  );
}
