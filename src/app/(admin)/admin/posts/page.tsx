import { requireAdminPage } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus, FileText } from "lucide-react";
import PostsWorkspace from "./PostsWorkspace";

export const dynamic = "force-dynamic";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string | null;
  categories: { name: string } | { name: string }[] | null;
};

export default async function AdminPostsPage() {
  const { supabase } = await requireAdminPage();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, featured_image, created_at, updated_at, categories:category_id(name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-sm text-rose-500 font-bold">Data artikel gagal dimuat.</p>
        <p className="text-[13px] text-slate-400 mt-1">Periksa koneksi database dan coba lagi.</p>
      </div>
    );
  }

  const allPosts = (posts ?? []) as PostListItem[];
  const total = allPosts.length;
  const published = allPosts.filter((p) => p.status === "published").length;
  const unpublished = allPosts.filter((p) => p.status !== "published").length;

  return (
    <div className="w-full space-y-6">

      {/* Page Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Artikel</span>
            </h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500">
            Tulis, edit, dan kelola konten blog Titik Huni.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 self-start flex-shrink-0"
        >
          <Plus size={15} aria-hidden="true" />
          Tulis Artikel
        </Link>
      </header>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Artikel</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{total}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileText size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Dipublikasikan</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{published}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileText size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Belum Terbit</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{unpublished}</p>
          </div>
        </div>
      </div>

      <PostsWorkspace posts={allPosts} />
    </div>
  );
}
