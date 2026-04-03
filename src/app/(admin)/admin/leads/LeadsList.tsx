"use client";

import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { MessageCircle, User, Download, Filter, Search } from "lucide-react";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = [
  { label: "Semua", value: "all", color: "bg-stone-50 text-stone-400" },
  { label: "Baru", value: "new", color: "bg-blue-50 text-blue-600" },
  {
    label: "Dihubungi",
    value: "contacted",
    color: "bg-amber-50 text-amber-600",
  },
  { label: "Survey", value: "survey", color: "bg-purple-50 text-purple-600" },
  {
    label: "Closing",
    value: "closing",
    color: "bg-emerald-50 text-emerald-600",
  },
  { label: "Lost", value: "lost", color: "bg-stone-100 text-stone-400" },
];

export function LeadsList({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        filterStatus === "all" || lead.status === filterStatus;
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [leads, filterStatus, searchTerm]);

  // ✅ Fungsi Ekspor ke CSV (Excel Compatible)
  const exportToExcel = () => {
    const headers = ["Tanggal,Nama,WhatsApp,Pesan,Status,Sumber,URL\n"];
    const rows = filteredLeads.map(
      (l) =>
        `${dayjs(l.created_at).format("YYYY-MM-DD")},${l.name},${l.phone},"${l.message || ""}",${l.status || "new"},${l.utm_source || "organic"},${l.source_url || ""}\n`,
    );

    const blob = new Blob([...headers, ...rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Leads_TitikHuni_${dayjs().format("DDMMMYYYY")}.csv`,
    );
    link.click();
    toast.success("File CSV berhasil diunduh");
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
    );

    try {
      const res = await fetch("/api/leads/update-status", {
        method: "PATCH",
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status diperbarui");
    } catch (err) {
      toast.error("Gagal sinkronisasi ke database");
    }
  };

  return (
    <div className="space-y-8">
      {/* TOOLBAR: Filter, Search, Export */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-stone-100 rounded-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
            />
            <input
              type="text"
              placeholder="Cari nama atau nomor..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-stone-100 outline-none focus:border-stone-900 transition-all font-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-[10px] font-medium uppercase tracking-widest border border-stone-100 px-4 py-2 outline-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-6 py-2 border border-stone-900 text-stone-900 text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all rounded-sm w-full md:w-auto justify-center"
        >
          <Download size={14} /> Ekspor CSV
        </button>
      </div>

      {/* LIST LEADS */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white border border-stone-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-700 hover:border-stone-300"
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-300">
                  <User size={16} strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-tight uppercase text-stone-900">
                    {lead.name}
                  </h3>
                  <p className="text-[9px] font-medium uppercase tracking-widest text-stone-300">
                    {dayjs(lead.created_at).format("DD MMM YYYY • HH:mm")}
                  </p>
                </div>
                <select
                  value={lead.status || "new"}
                  onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                  className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full cursor-pointer outline-none transition-all ${
                    STATUS_OPTIONS.find(
                      (s) => s.value === (lead.status || "new"),
                    )?.color
                  }`}
                >
                  {STATUS_OPTIONS.slice(1).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {lead.message && (
                <p className="text-xs text-stone-500 font-light leading-relaxed italic pl-14 max-w-2xl">
                  "{lead.message}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-stone-50 lg:pl-10">
              <div className="hidden xl:block text-right">
                <p className="text-[9px] font-medium uppercase tracking-widest text-stone-300 mb-1">
                  Channel
                </p>
                <p className="text-[10px] font-medium text-emerald-600">
                  {lead.utm_source || "organic"}
                </p>
              </div>
              <a
                href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=Halo%20${lead.name},%20terima%20kasih%20telah%20menghubungi%20Titik%20Huni.`}
                target="_blank"
                className="flex items-center gap-4 px-6 py-3 bg-stone-900 text-white text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all duration-500 rounded-sm"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        ))}
        {filteredLeads.length === 0 && (
          <div className="py-20 text-center text-[10px] uppercase tracking-widest text-stone-300">
            Data tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
