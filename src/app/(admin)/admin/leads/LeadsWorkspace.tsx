"use client";

import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MessageCircle,
  Download,
  Search,
  X,
  ChevronDown,
  Clock,
  AlertCircle,
  Calendar,
  Eye,
  Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  ActionMenu,
  actionMenuItemClass,
} from "@/components/admin/ui/action-menu";

dayjs.extend(relativeTime);
dayjs.locale("id");

// ─── Types ────────────────────────────────────────────────────────────────────

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  unit_id: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  status: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  units: { id: string; title: string } | { id: string; title: string }[] | null;
};

function relatedUnitTitle(units: Lead["units"]) {
  return Array.isArray(units) ? units[0]?.title || "" : units?.title || "";
}

function csvCell(value: string | null | undefined) {
  let safe = String(value ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@]/.test(safe)) safe = `'${safe}`;
  return `"${safe.replace(/"/g, '""')}"`;
}

// ─── Status System ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  new: { label: "Baru", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  contacted: { label: "Dihubungi", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  qualified: { label: "Qualified", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  site_visit: { label: "Survei", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  booking: { label: "Booking", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  won: { label: "Closing", bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  lost: { label: "Batal", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
};

const STATUS_OPTIONS = [
  { label: "Semua Status", value: "all" },
  { label: "Baru", value: "new" },
  { label: "Dihubungi", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Survei", value: "site_visit" },
  { label: "Booking", value: "booking" },
  { label: "Closing", value: "won" },
  { label: "Batal", value: "lost" },
];

const MUTABLE_STATUS_OPTIONS = STATUS_OPTIONS.slice(1);

function StatusBadge({ status }: { status: string | null }) {
  const key = (status || "new").toLowerCase();
  const cfg = STATUS_CONFIG[key] || {
    label: status || "—",
    bg: "bg-slate-50/80",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text} border border-white/50 shadow-sm backdrop-blur-sm`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot} flex-shrink-0`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

// ─── Follow-up Badge ──────────────────────────────────────────────────────────

function FollowUpBadge({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const date = dayjs(dateStr);
  const today = dayjs().startOf("day");
  const diffDays = date.startOf("day").diff(today, "day");

  if (diffDays < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
        <AlertCircle size={12} aria-hidden="true" />
        Terlambat {Math.abs(diffDays)}h
      </span>
    );
  }
  if (diffDays === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        <Clock size={12} aria-hidden="true" />
        Hari ini
      </span>
    );
  }
  if (diffDays === 1) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
        <Calendar size={12} aria-hidden="true" />
        Besok
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      <Calendar size={12} aria-hidden="true" />
      {date.format("DD MMM")}
    </span>
  );
}

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: string | null }) {
  if (!source) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
      {source}
    </span>
  );
}

// ─── Initials Avatar ──────────────────────────────────────────────────────────

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 shadow-sm text-slate-600 transition-transform group-hover:scale-105 group-hover:rotate-3`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ─── WhatsApp Link ────────────────────────────────────────────────────────────

function waLink(phone: string | null, name: string): string {
  if (!phone) return "#";
  const num = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const text = encodeURIComponent(
    `Halo ${name}, terima kasih telah menghubungi Titik Huni.`
  );
  return `https://wa.me/${num}?text=${text}`;
}

function LeadActions({
  lead,
  expanded,
  onToggle,
}: {
  lead: Lead;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        aria-expanded={expanded}
        aria-label={`${expanded ? "Tutup" : "Buka"} detail ${lead.name}`}
      >
        <Eye size={14} aria-hidden="true" />
        {expanded ? "Tutup" : "Buka"}
      </button>
      <ActionMenu label={`Aksi lainnya untuk ${lead.name}`}>
        {lead.phone && (
          <a
            href={waLink(lead.phone, lead.name)}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            tabIndex={-1}
            className={actionMenuItemClass}
          >
            <MessageCircle size={14} className="text-emerald-600" aria-hidden="true" />
            WhatsApp
          </a>
        )}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            role="menuitem"
            tabIndex={-1}
            className={actionMenuItemClass}
          >
            <Mail size={14} className="text-slate-400" aria-hidden="true" />
            Kirim Email
          </a>
        )}
      </ActionMenu>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

export default function LeadsWorkspace({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Unique sources for filter dropdown
  const sources = useMemo(() => {
    const set = new Set(
      leads
        .map((l) => l.utm_source || l.source)
        .filter(Boolean) as string[]
    );
    return Array.from(set).sort();
  }, [leads]);

  const hasActiveFilters = filterStatus !== "all" || filterSource !== "all" || search.trim() !== "";

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      const matchStatus =
        filterStatus === "all" ||
        (l.status || "new").toLowerCase() === filterStatus;
      const matchSource =
        filterSource === "all" ||
        (l.utm_source || l.source || "").toLowerCase() === filterSource.toLowerCase();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        (l.phone || "").includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        relatedUnitTitle(l.units).toLowerCase().includes(q);
      return matchStatus && matchSource && matchSearch;
    });
  }, [leads, filterStatus, filterSource, search]);

  const handleReset = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterSource("all");
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const previousStatus = leads.find((lead) => lead.id === id)?.status ?? "new";
    setUpdatingId(id);
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    try {
      const res = await fetch("/api/leads/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error || "Status gagal diperbarui.");
      toast.success("Status diperbarui");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal sinkronisasi ke database");
      setLeads((current) =>
        current.map((lead) => lead.id === id ? { ...lead, status: previousStatus } : lead)
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    const headers = ["Tanggal", "Nama", "Telepon", "Email", "Pesan", "Status", "Sumber", "Properti"].map(csvCell).join(",") + "\n";
    const rows = filtered.map(
      (lead) => [
        dayjs(lead.created_at).format("YYYY-MM-DD HH:mm"),
        lead.name,
        lead.phone,
        lead.email,
        lead.message,
        lead.status || "new",
        lead.utm_source || lead.source,
        relatedUnitTitle(lead.units),
      ].map(csvCell).join(",") + "\n"
    );
    const blob = new Blob([headers, ...rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Leads_TitikHuni_${dayjs().format("DDMMMYYYY")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("File CSV berhasil diunduh");
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Cari nama, telepon, email, properti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-white placeholder:text-slate-400"
              aria-label="Cari lead"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer"
                aria-label="Filter status"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            </div>

            {/* Source filter */}
            {sources.length > 0 && (
              <div className="relative">
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="appearance-none text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-emerald-500 bg-white text-slate-700 cursor-pointer"
                  aria-label="Filter sumber"
                >
                  <option value="all">Semua Sumber</option>
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
              </div>
            )}

            {/* Reset filter */}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-2 py-2 transition-colors"
                aria-label="Reset filter"
              >
                <X size={14} />
                Reset
              </button>
            )}

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all ml-auto sm:ml-0"
              aria-label="Ekspor data ke CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium self-center">Filter aktif:</span>
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                {STATUS_OPTIONS.find(s => s.value === filterStatus)?.label}
                <button onClick={() => setFilterStatus("all")} className="hover:text-blue-900 ml-0.5" aria-label="Hapus filter status">
                  <X size={11} />
                </button>
              </span>
            )}
            {filterSource !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                {filterSource}
                <button onClick={() => setFilterSource("all")} className="hover:text-slate-900 ml-0.5" aria-label="Hapus filter sumber">
                  <X size={11} />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                "{search}"
                <button onClick={() => setSearch("")} className="hover:text-slate-900 ml-0.5" aria-label="Hapus pencarian">
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Result count ────────────────────────────────────────────── */}
      <p className="text-xs text-slate-500 px-1">
        Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari {leads.length} lead
      </p>

      {/* ── Desktop Table ────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <>
          <div className="hidden md:block bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200">
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Lead
                    </th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Properti
                    </th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Sumber
                    </th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Follow-up
                    </th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Masuk
                    </th>
                    <th scope="col" className="w-40 px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((lead) => {
                    const isUpdating = updatingId === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-50/60 transition-colors group ${isUpdating ? "opacity-60" : ""}`}
                      >
                        {/* Lead identity */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar name={lead.name} />
                            <div>
                              <p className="text-sm font-medium text-slate-900 leading-none">
                                {lead.name}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {lead.phone || lead.email || "—"}
                              </p>
                              {expandedId === lead.id && (
                                <div className="mt-3 max-w-sm rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                                  {lead.email && <p className="mb-1"><span className="font-medium text-slate-500">Email:</span> {lead.email}</p>}
                                  <p className="whitespace-pre-wrap leading-relaxed">
                                    {lead.message || "Tidak ada pesan dari lead."}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-700">
                            {relatedUnitTitle(lead.units) || (
                              <span className="text-slate-400">—</span>
                            )}
                          </span>
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4">
                          <SourceBadge source={lead.utm_source || lead.source} />
                        </td>

                        {/* Status (editable) */}
                        <td className="px-5 py-4">
                          <div className="relative inline-block">
                            <select
                              value={(lead.status || "new").toLowerCase()}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value)
                              }
                              disabled={isUpdating}
                              className="appearance-none cursor-pointer pr-5 text-xs font-medium rounded-md border-0 outline-none focus:ring-1 focus:ring-emerald-500 transition-all bg-transparent"
                              aria-label={`Status lead ${lead.name}`}
                              style={{ minWidth: 0 }}
                            >
                              {MUTABLE_STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {/* Visual badge layered below */}
                            <span className="pointer-events-none absolute inset-0 flex items-center">
                              <StatusBadge status={lead.status} />
                            </span>
                          </div>
                        </td>

                        {/* Follow-up */}
                        <td className="px-5 py-4">
                          <FollowUpBadge dateStr={lead.next_follow_up_at} />
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {dayjs(lead.created_at).fromNow()}
                          </span>
                        </td>

                        {/* Actions — always visible */}
                        <td className="px-5 py-4 text-right">
                          <LeadActions
                            lead={lead}
                            expanded={expandedId === lead.id}
                            onToggle={() => setExpandedId((id) => id === lead.id ? null : lead.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile Cards ─────────────────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {filtered.map((lead) => (
              <MobileLeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={handleStatusChange}
                isUpdating={updatingId === lead.id}
              />
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] py-20 text-center flex flex-col items-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4 border border-slate-100">
            <Search size={24} className="text-slate-400" strokeWidth={1.5} />
          </div>
          {hasActiveFilters ? (
            <>
              <p className="text-sm font-medium text-slate-600">
                Tidak ada lead yang cocok dengan filter ini.
              </p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Coba ubah kriteria pencarian atau filter yang aktif.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <X size={14} />
                Reset Filter
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-600">
                Belum ada lead masuk.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Lead dari website dan campaign akan muncul di sini.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Lead Card ─────────────────────────────────────────────────────────

function MobileLeadCard({
  lead,
  onStatusChange,
  isUpdating,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  isUpdating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-[1.25rem] border border-slate-200/70 shadow-[0_2px_20px_rgb(0,0,0,0.02)] p-5 space-y-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group ${isUpdating ? "opacity-60" : ""}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <InitialsAvatar name={lead.name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{lead.name}</p>
          <p className="text-xs text-slate-400 truncate">
            {lead.phone || lead.email || "—"}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-slate-400 font-medium mb-0.5">Properti</p>
          <p className="text-slate-700">
            {relatedUnitTitle(lead.units) || "—"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-medium mb-0.5">Sumber</p>
          <p className="text-slate-700">
            {lead.utm_source || lead.source || "—"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-medium mb-0.5">Follow-up</p>
          <FollowUpBadge dateStr={lead.next_follow_up_at} />
        </div>
        <div>
          <p className="text-slate-400 font-medium mb-0.5">Masuk</p>
          <p className="text-slate-700">{dayjs(lead.created_at).fromNow()}</p>
        </div>
      </div>

      {expanded && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          {lead.email && <p className="mb-1"><span className="font-medium text-slate-500">Email:</span> {lead.email}</p>}
          <p className="whitespace-pre-wrap leading-relaxed">
            {lead.message || "Tidak ada pesan dari lead."}
          </p>
        </div>
      )}

      {/* Status update */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <select
          value={(lead.status || "new").toLowerCase()}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
          disabled={isUpdating}
          className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-emerald-500 bg-white text-slate-700"
          aria-label={`Ubah status ${lead.name}`}
        >
          {MUTABLE_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

      </div>
      <div className="flex items-center justify-end border-t border-slate-100 pt-2">
        <LeadActions lead={lead} expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
      </div>
    </div>
  );
}
