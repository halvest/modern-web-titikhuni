"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Search,
  X,
  ChevronDown,
  Edit,
  ExternalLink,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { deletePost } from "./actions";
import {
  ActionMenu,
  actionMenuItemClass,
  destructiveActionMenuItemClass,
} from "@/components/admin/ui/action-menu";

dayjs.extend(relativeTime);
dayjs.locale("id");

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string | null;
  categories: { name: string } | { name: string }[] | null;
};

function categoryName(categories: Post["categories"]) {
  return Array.isArray(categories) ? categories[0]?.name || "Umum" : categories?.name || "Umum";
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function PostStatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
        Dipublikasikan
      </span>
    );
  }
  if (status === "archived") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
        Diarsipkan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
      Draft
    </span>
  );
}

// ─── Post Row Actions ─────────────────────────────────────────────────────────

function PostRowActions({ post, onDeleted }: { post: Post; onDeleted: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Hapus artikel "${post.title}"?\n\nArtikel akan disembunyikan dari dashboard dan situs publik.`
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      const result = await deletePost(post.id);
      if (result?.error) throw new Error(result.error);
      toast.success(result.warning || "Artikel berhasil dihapus");
      onDeleted(post.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus artikel.";
      toast.error(message);
      if (/sesi berakhir|akses admin/i.test(message)) {
        router.replace("/admin/login?error=session_expired");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5 flex-shrink-0">
      {/* PRIMARY: Edit — always visible */}
      <Link
        href={`/admin/posts/edit/${post.id}`}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-500 transition-all hover:bg-slate-900 hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        aria-label={`Edit artikel ${post.title}`}
      >
        <Edit size={14} aria-hidden="true" />
        Edit
      </Link>

      {/* SECONDARY: More — always visible */}
      <ActionMenu loading={deleting} label={`Aksi lainnya untuk artikel ${post.title}`}>
        {post.status === "published" && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            tabIndex={-1}
            className={actionMenuItemClass}
          >
            <ExternalLink size={14} className="flex-shrink-0 text-slate-400" aria-hidden="true" />
            Lihat Artikel
          </Link>
        )}
        <div className="my-1 border-t border-slate-100" role="separator" />
        <button
          type="button"
          onClick={handleDelete}
          role="menuitem"
          tabIndex={-1}
          className={destructiveActionMenuItemClass}
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} aria-hidden="true" />}
          Hapus Artikel
        </button>
      </ActionMenu>
    </div>
  );
}

// ─── Mobile Post Card ─────────────────────────────────────────────────────────

function MobilePostCard({ post, onDeleted }: { post: Post; onDeleted: (id: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {post.featured_image ? (
        <div className="relative w-full h-32 bg-slate-100">
          <Image src={post.featured_image} alt={post.title} fill sizes="(max-width: 768px) 100vw" className="object-cover" loading="lazy" unoptimized />
        </div>
      ) : (
        <div className="w-full h-20 bg-slate-100 flex items-center justify-center">
          <FileText size={24} className="text-slate-300" aria-hidden="true" />
        </div>
      )}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-bold text-slate-900 leading-snug flex-1">{post.title}</p>
          <PostStatusBadge status={post.status} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{categoryName(post.categories)}</span>
          <span>{dayjs(post.created_at).fromNow()}</span>
        </div>
        {/* PERSISTENT mobile actions */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <PostRowActions post={post} onDeleted={onDeleted} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

export default function PostsWorkspace({ posts: initialPosts }: { posts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const hasActiveFilters = filterStatus !== "all" || search.trim() !== "";
  const handleReset = () => { setSearch(""); setFilterStatus("all"); };
  const handleDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return posts.filter((p) => {
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q) || categoryName(p.categories).toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [posts, filterStatus, search]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari artikel, kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-colors placeholder:text-slate-400 text-slate-900"
              aria-label="Cari artikel"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none text-sm bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-colors text-slate-900 cursor-pointer font-medium" aria-label="Filter status">
                <option value="all">Semua Status</option>
                <option value="published">Dipublikasikan</option>
                <option value="draft">Draft</option>
                <option value="archived">Diarsipkan</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            </div>
            {hasActiveFilters && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-2 py-2 transition-colors" aria-label="Reset filter">
                <X size={14} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 px-1">
        Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {posts.length} artikel
      </p>

      {filtered.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200">
                    <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Artikel</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dibuat</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((post) => (
                    <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            {post.featured_image ? (
                              <Image src={post.featured_image} alt={post.title} fill sizes="64px" className="object-cover" loading="lazy" unoptimized />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <FileText size={16} className="text-slate-400" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-slate-900 leading-snug truncate max-w-[280px]">{post.title}</p>
                            <p className="text-[13px] font-medium text-slate-400 mt-0.5 truncate">/blog/{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-medium text-slate-500">{categoryName(post.categories)}</span>
                      </td>
                      <td className="px-6 py-5">
                        <PostStatusBadge status={post.status} />
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-medium text-slate-500 whitespace-nowrap">{dayjs(post.created_at).fromNow()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <PostRowActions post={post} onDeleted={handleDeleted} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((post) => (
              <MobilePostCard key={post.id} post={post} onDeleted={handleDeleted} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-20 text-center shadow-sm">
          {hasActiveFilters ? (
            <>
              <p className="text-sm font-bold text-slate-700">Tidak ada artikel yang cocok dengan filter ini.</p>
              <p className="text-[13px] text-slate-500 mt-1 mb-6">Coba ubah kriteria pencarian atau filter yang aktif.</p>
              <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                <X size={14} /> Reset Filter
              </button>
            </>
          ) : (
            <>
              <FileText size={40} className="mx-auto text-slate-300 mb-4" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-700">Belum ada artikel.</p>
              <p className="text-[13px] text-slate-500 mt-1.5 mb-6">Mulai tulis konten blog perdana Titik Huni.</p>
              <Link href="/admin/posts/new" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow">
                Tulis Artikel
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
