"use client";

import React, { useState } from "react";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export function CategoryList({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");

  // Helper untuk buat slug otomatis
  const createSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setLoading(true);

    const slug = createSlug(newName);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: newName, slug }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setCategories([...categories, data[0]]);
      setNewName("");
      toast.success("Kategori berhasil ditambahkan");
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Hapus kategori ini? Data unit dengan kategori ini mungkin akan terpengaruh.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Kategori dihapus");
    } catch (err) {
      toast.error("Gagal menghapus kategori");
    }
  };

  return (
    <div className="space-y-12">
      {/* FORM TAMBAH KATEGORI */}
      <section className="bg-white border border-stone-100 p-8 rounded-sm shadow-sm">
        <form onSubmit={handleAddCategory} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">
              Nama Kategori Baru
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Contoh: Villa Modern"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-transparent border-b border-stone-200 py-2 text-sm outline-none focus:border-stone-900 transition-all font-light"
              />
              <button
                disabled={loading}
                className="px-6 py-2 bg-stone-900 text-white text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:opacity-30"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Tambah"
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* LIST KATEGORI */}
      <div className="grid gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-300 mb-2">
          Daftar Kategori Aktif
        </p>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-stone-100 p-5 flex items-center justify-between group hover:border-stone-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-stone-50 flex items-center justify-center rounded-full text-stone-300 group-hover:text-stone-900 transition-colors">
                <Tag size={14} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-900">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-stone-300 font-mono italic">
                  slug: {cat.slug}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 text-stone-200 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-center py-10 text-[10px] uppercase tracking-widest text-stone-300 italic border border-dashed border-stone-100">
            Belum ada kategori yang dibuat.
          </p>
        )}
      </div>
    </div>
  );
}
