"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  FileText,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

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
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          categories (name)
        `,
        )
        .is("deleted_at", null) // Soft Delete Awareness
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat daftar artikel");
    } finally {
      setLoading(false);
    }
  }

  async function softDeletePost(id: string) {
    if (
      !confirm(
        "Arsipkan artikel ini? Artikel tidak akan tampil di blog publik.",
      )
    )
      return;

    const { error } = await supabase
      .from("posts")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengarsipkan artikel");
    } else {
      toast.success("Artikel berhasil diarsipkan");
      setPosts(posts.filter((p) => p.id !== id));
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-neutral-50 min-h-screen">
      <Toaster />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
            Manajemen <span className="text-neutral-400">Konten</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-bold">
            Total Artikel: {posts.length} Publikasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari Judul Artikel..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-black transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg shadow-black/10"
          >
            <Plus size={16} /> Tulis Artikel
          </Link>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100">
                <th className="px-8 py-5 font-bold">Artikel</th>
                <th className="px-8 py-5 font-bold">Kategori</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold">Statistik</th>
                <th className="px-8 py-5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center uppercase text-[10px] tracking-widest text-neutral-400"
                  >
                    Sinkronisasi Database...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center uppercase text-[10px] tracking-widest text-neutral-400"
                  >
                    Belum ada artikel yang ditulis
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-neutral-300">
                              <FileText size={16} />
                            </div>
                          )}
                        </div>
                        <div className="max-w-md">
                          <p className="text-sm font-bold text-neutral-900 line-clamp-1 uppercase tracking-tight">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] text-neutral-400 flex items-center gap-1 uppercase">
                              <Calendar size={10} />{" "}
                              {new Date(post.created_at).toLocaleDateString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2 py-1 bg-neutral-100 rounded text-[9px] font-black uppercase tracking-tighter text-neutral-500">
                        {post.categories?.name || "Umum"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                          post.status === "published"
                            ? "bg-green-50 text-green-600"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1">
                        <Eye size={12} /> {post.views || 0} Views
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-neutral-400 hover:text-black transition-colors"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-2 bg-neutral-50 text-neutral-600 rounded-lg hover:bg-black hover:text-white transition-all"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => softDeletePost(post.id)}
                          className="p-2 text-neutral-300 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
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
