"use client";

import React, { useState } from "react";
import { Edit3, Loader2, Plus, Save, Tag, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  ActionMenu,
  actionMenuItemClass,
  destructiveActionMenuItemClass,
} from "@/components/admin/ui/action-menu";

type Category = { id: string; name: string; slug: string };

const createSlug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function CategoryActions({
  category,
  editing,
  busy,
  onPrimary,
  onCancel,
  onDelete,
}: {
  category: Category;
  editing: boolean;
  busy: boolean;
  onPrimary: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={onPrimary}
        disabled={busy}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
        aria-label={`${editing ? "Simpan" : "Edit"} kategori ${category.name}`}
      >
        {busy ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : editing ? (
          <Save size={14} aria-hidden="true" />
        ) : (
          <Edit3 size={14} aria-hidden="true" />
        )}
        {editing ? "Simpan" : "Edit"}
      </button>
      <ActionMenu loading={busy} label={`Aksi lainnya untuk kategori ${category.name}`}>
        {editing && (
          <button type="button" onClick={onCancel} role="menuitem" tabIndex={-1} className={actionMenuItemClass}>
            <X size={14} className="text-slate-400" aria-hidden="true" />
            Batal Edit
          </button>
        )}
        {editing && <div className="my-1 border-t border-slate-100" role="separator" />}
        <button type="button" onClick={onDelete} role="menuitem" tabIndex={-1} className={destructiveActionMenuItemClass}>
          <Trash2 size={14} aria-hidden="true" />
          Hapus Kategori
        </button>
      </ActionMenu>
    </div>
  );
}

export function CategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: createSlug(newName) }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error);
      setCategories((current) => [...current, data].sort((a, b) => a.name.localeCompare(b.name, "id")));
      setNewName("");
      toast.success("Kategori berhasil ditambahkan");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleSave = async (category: Category) => {
    if (!editName.trim()) return;
    setSavingId(category.id);
    try {
      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: category.id, name: editName.trim(), slug: createSlug(editName) }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error);
      setCategories((current) => current.map((item) => item.id === category.id ? data : item));
      cancelEdit();
      toast.success("Kategori berhasil diperbarui");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui kategori");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Hapus kategori "${category.name}"?\n\nKategori hanya dapat dihapus jika tidak digunakan oleh unit atau artikel.`
    );
    if (!confirmed) return;
    setDeletingId(category.id);
    try {
      const response = await fetch(`/api/categories?id=${category.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (editingId === category.id) cancelEdit();
      toast.success("Kategori dihapus");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus kategori");
    } finally {
      setDeletingId(null);
    }
  };

  const categoryActions = (category: Category) => {
    const editing = editingId === category.id;
    return (
      <CategoryActions
        category={category}
        editing={editing}
        busy={savingId === category.id || deletingId === category.id}
        onPrimary={() => editing ? handleSave(category) : startEdit(category)}
        onCancel={cancelEdit}
        onDelete={() => handleDelete(category)}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div id="tambah-kategori" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg font-bold text-slate-900">Tambah Kategori Baru</h2>
        </div>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Contoh: Villa Modern"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 sm:py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            aria-label="Nama kategori baru"
          />
          <button
            type="submit"
            disabled={loading || !newName.trim()}
            className="inline-flex h-[48px] sm:h-[46px] w-full sm:w-auto justify-center flex-shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
            Simpan
          </button>
        </form>
        {newName && <p className="mt-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest">Slug: <span className="font-mono lowercase tracking-normal text-emerald-600">{createSlug(newName)}</span></p>}
      </div>

      {categories.length > 0 ? (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th scope="col" className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Kategori</th>
                  <th scope="col" className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Slug</th>
                  <th scope="col" className="w-40 px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => {
                  const editing = editingId === category.id;
                  return (
                    <tr key={category.id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-500 transition-all group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-sm">
                            <Tag size={16} aria-hidden="true" />
                          </div>
                          {editing ? (
                            <input
                              value={editName}
                              onChange={(event) => setEditName(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") handleSave(category);
                                if (event.key === "Escape") cancelEdit();
                              }}
                              autoFocus
                              className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              aria-label={`Nama kategori ${category.name}`}
                            />
                          ) : (
                            <span className="text-sm font-bold text-slate-900">{category.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5"><span className="font-mono text-xs font-medium text-slate-500">{editing ? createSlug(editName) : category.slug}</span></td>
                      <td className="px-6 py-5">{categoryActions(category)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {categories.map((category) => {
              const editing = editingId === category.id;
              return (
                <div key={category.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100/80">
                      <Tag size={16} className="text-slate-500" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {editing ? (
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") handleSave(category);
                            if (event.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          aria-label={`Nama kategori ${category.name}`}
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-900">{category.name}</p>
                      )}
                      <p className="mt-1 truncate font-mono text-[11px] font-medium text-slate-500">{editing ? createSlug(editName) : category.slug}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-2">{categoryActions(category)}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white py-14 text-center shadow-sm">
          <Tag size={28} className="mx-auto mb-3 text-slate-300" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-500">Belum ada kategori.</p>
          <p className="mt-1 text-xs text-slate-400">Tambahkan kategori baru menggunakan form di atas.</p>
        </div>
      )}
    </div>
  );
}
