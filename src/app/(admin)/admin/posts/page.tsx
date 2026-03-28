"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  FileText,
  Eye,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { deletePost } from "./actions"; // Pastikan path ke action.ts benar

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);

      // Mengambil data dengan join kategori
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          categories:category_id (
            name
          )
        `,
        )
        // .is("deleted_at", null) // Baris ini opsional jika Anda ingin tetap pakai soft delete,
        // tapi untuk Hard Delete (Permanen), baris ini tidak diperlukan.
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error Details:", error);
        throw error;
      }

      setPosts(data || []);
    } catch (error: any) {
      toast.error(
        "Gagal sinkronisasi: " + (error.message || "Periksa koneksi"),
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * FIX: Hard Delete Permanen
   * Memanggil Server Action untuk menghapus row di DB dan file di Storage
   */
  async function handlePermanentDelete(id: string) {
    if (
      !confirm(
        "Hapus artikel ini secara PERMANEN? File gambar di storage juga akan dihapus dan tidak bisa dikembalikan.",
      )
    )
      return;

    try {
      const result = await deletePost(id);

      if (result?.success) {
        toast.success("Artikel dan media berhasil dihapus permanen");
        // Update state lokal agar baris hilang dari UI
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        toast.error(result?.error || "Gagal menghapus artikel");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan sistem: " + error.message);
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 md:p-12 space-y-10 bg-white min-h-screen">
      <Toaster />

      {/* Hero Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-neutral-900">
            Content <span className="text-neutral-300">Hub</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
            Admin Management — {posts.length} entries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search articles..."
              className="pl-12 pr-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold outline-none w-full md:w-80 focus:bg-white focus:ring-4 focus:ring-neutral-50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-2xl shadow-black/10"
          >
            <Plus size={18} strokeWidth={3} /> New Article
          </Link>
        </div>
      </header>

      {/* Table Content */}
      <div className="border border-neutral-100 rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-neutral-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400 border-b border-neutral-100">
                <th className="px-10 py-6">Publication Details</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-10 py-32 text-center text-[10px] font-bold text-neutral-300 uppercase tracking-widest animate-pulse"
                  >
                    Synchronizing Database...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-10 py-32 text-center text-[10px] font-bold text-neutral-300 uppercase tracking-widest"
                  >
                    No articles found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-neutral-50/30 transition-all"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-16 rounded-2xl overflow-hidden bg-neutral-100 shadow-sm">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-neutral-200">
                              <FileText size={20} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-black text-neutral-900 leading-tight tracking-tighter uppercase">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={12} />{" "}
                              {new Date(post.created_at).toLocaleDateString(
                                "id-ID",
                              )}
                            </span>
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <Eye size={12} /> {post.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-100 px-3 py-1.5 rounded-full">
                        {post.categories?.name || "General"}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${post.status === "published" ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"}`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${post.status === "published" ? "text-neutral-900" : "text-neutral-400"}`}
                        >
                          {post.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-3 bg-neutral-900 text-white rounded-xl hover:bg-black transition-all shadow-xl shadow-black/10"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handlePermanentDelete(post.id)}
                          className="p-3 text-neutral-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
