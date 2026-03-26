// src/app/admin/leads/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Search,
  Filter,
  MoreVertical,
  MessageCircle,
  Calendar,
  User,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select(
          `
          *,
          units (title)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data leads");
    } finally {
      setLoading(false);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus data");
    } else {
      toast.success("Lead berhasil dihapus");
      setLeads(leads.filter((l) => l.id !== id));
    }
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm),
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-neutral-50 min-h-screen">
      <Toaster />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900">
            Database <span className="text-neutral-400">Leads</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-bold">
            Total Masuk: {leads.length} Calon Pembeli
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
              placeholder="Cari Nama / No. HP..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100">
                <th className="px-8 py-5 font-bold">Kontak Calon Pembeli</th>
                <th className="px-8 py-5 font-bold">Unit Yang Diminati</th>
                <th className="px-8 py-5 font-bold">Sumber & Tanggal</th>
                <th className="px-8 py-5 font-bold">Pesan</th>
                <th className="px-8 py-5 font-bold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-neutral-400 uppercase text-[10px] tracking-widest"
                  >
                    Sinkronisasi Data...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-neutral-400 uppercase text-[10px] tracking-widest"
                  >
                    Belum ada leads masuk
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-black group-hover:text-white transition-colors">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            {lead.name}
                          </p>
                          <p className="text-xs text-neutral-400 font-medium">
                            {lead.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-neutral-700 uppercase tracking-tight">
                        {lead.units?.title || "Konsultasi Umum"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="w-fit px-2 py-0.5 bg-neutral-100 rounded text-[9px] font-black uppercase tracking-tighter text-neutral-500">
                          {lead.source}
                        </span>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Calendar size={10} />{" "}
                          {new Date(lead.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-neutral-500 max-w-[200px] truncate italic">
                        "{lead.message || "Tanpa pesan"}"
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Halo ${lead.name}, saya Admin Titik Huni. Terkait minat Anda pada unit ${lead.units?.title || "properti kami"}...`}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                        <button
                          onClick={() => deleteLead(lead.id)}
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
