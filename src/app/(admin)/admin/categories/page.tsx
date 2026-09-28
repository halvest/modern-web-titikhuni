import { requireAdminPage } from "@/utils/supabase/server";
import { CategoryList } from "./CategoryList";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdminPage();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  return (
    <div className="w-full space-y-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Kategori</span>
            </h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500">
            Atur dan kelompokkan konten blog serta unit properti Titik Huni.
          </p>
        </div>
        <a
          href="#tambah-kategori"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          <Plus size={15} aria-hidden="true" />
          Tambah Kategori
        </a>
      </header>
      {error ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">
          Data kategori gagal dimuat. Periksa koneksi lalu muat ulang halaman.
        </div>
      ) : (
        <CategoryList initialCategories={categories || []} />
      )}
    </div>
  );
}
