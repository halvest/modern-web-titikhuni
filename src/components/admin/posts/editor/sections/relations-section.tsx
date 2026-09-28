import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PostFormData } from "../types";
import { createClient } from "@/utils/supabase/client";
import { Link2, Building, FileText, Loader2, Search, TriangleAlert } from "lucide-react";

const supabase = createClient();

interface RelationsSectionProps {
  data: PostFormData;
  onChange: (updates: Partial<PostFormData>) => void;
}

export function RelationsSection({ data, onChange }: RelationsSectionProps) {
  const [units, setUnits] = useState<{id: string; title: string; image_url: string; status: string}[]>([]);
  const [posts, setPosts] = useState<{id: string; title: string; status: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unitSearch, setUnitSearch] = useState("");
  const [postSearch, setPostSearch] = useState("");

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const [unitsRes, postsRes] = await Promise.all([
          supabase.from("units").select("id, title, image_url, status").is("deleted_at", null).order("created_at", { ascending: false }),
          supabase.from("posts").select("id, title, status").is("deleted_at", null).neq("id", data.id || "00000000-0000-0000-0000-000000000000").order("created_at", { ascending: false })
        ]);
        if (unitsRes.error) throw unitsRes.error;
        if (postsRes.error) throw postsRes.error;
        if (unitsRes.data) setUnits(unitsRes.data);
        if (postsRes.data) setPosts(postsRes.data);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Relasi gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };
    fetchRelations();
  }, [data.id]);

  const toggleUnit = (id: string) => {
    const newIds = data.related_unit_ids.includes(id) 
      ? data.related_unit_ids.filter(uid => uid !== id)
      : [...data.related_unit_ids, id];
    onChange({ related_unit_ids: newIds });
  };

  const togglePost = (id: string) => {
    const newIds = data.related_post_ids.includes(id) 
      ? data.related_post_ids.filter(pid => pid !== id)
      : [...data.related_post_ids, id];
    onChange({ related_post_ids: newIds });
  };

  const filteredUnits = units.filter(u => u.title?.toLowerCase().includes(unitSearch.toLowerCase()));
  const filteredPosts = posts.filter(p => p.title?.toLowerCase().includes(postSearch.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          Tautan Internal <Link2 size={20} className="text-slate-300" />
        </h2>
        <p className="mt-1.5 text-[13px] font-medium text-slate-500">
          Hubungkan artikel dengan properti atau artikel lain yang relevan.
        </p>
      </div>

      {loadError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Data relasi gagal dimuat. Coba buka kembali bagian ini.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Related Properties */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] uppercase font-bold text-emerald-600 tracking-widest flex items-center gap-2">
              <Building size={16} /> Properti Terkait
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 border border-slate-200">
              {data.related_unit_ids?.length || 0} dipilih
            </span>
          </div>

          <div className="relative mb-5 shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari properti..." 
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 outline-none text-[13px] font-medium text-slate-900 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-neutral-300" /></div>
            ) : filteredUnits.length === 0 ? (
              <div className="text-center text-[13px] text-slate-500 font-medium mt-10">Properti tidak ditemukan.</div>
            ) : (
              filteredUnits.map(unit => {
                const isSelected = data.related_unit_ids?.includes(unit.id);
                return (
                  <label key={unit.id} className={`flex items-center gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'}`}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleUnit(unit.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0 border-slate-300"
                    />
                    {unit.image_url && (
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={unit.image_url} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                    )}
                    <div className="overflow-hidden">
                      <p className={`text-[13px] font-bold truncate ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>{unit.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mt-1">{unit.status}</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Related Posts */}
        {/* Related Posts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] uppercase font-bold text-emerald-600 tracking-widest flex items-center gap-2">
              <FileText size={16} /> Artikel Terkait
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 border border-slate-200">
              {data.related_post_ids?.length || 0} dipilih
            </span>
          </div>

          <div className="relative mb-5 shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari artikel..." 
              value={postSearch}
              onChange={(e) => setPostSearch(e.target.value)}
              className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 outline-none text-[13px] font-medium text-slate-900 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-neutral-300" /></div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center text-[13px] text-slate-500 font-medium mt-10">Artikel tidak ditemukan.</div>
            ) : (
              filteredPosts.map(post => {
                const isSelected = data.related_post_ids?.includes(post.id);
                return (
                  <label key={post.id} className={`flex items-center gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'}`}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => togglePost(post.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0 border-slate-300"
                    />
                    <div className="overflow-hidden">
                      <p className={`text-[13px] font-bold truncate ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>{post.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mt-1">{post.status}</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
