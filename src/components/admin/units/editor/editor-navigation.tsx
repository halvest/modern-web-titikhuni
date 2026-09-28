import { AlertCircle, Check, ChevronRight } from "lucide-react";
import { type EditorMode, type EditorSection } from "./types";

export type EditorSectionItem = {
  id: EditorSection;
  label: string;
  description: string;
};

const EDIT_SECTIONS: EditorSectionItem[] = [
  { id: "overview", label: "Informasi Dasar", description: "Identitas dan status unit" },
  { id: "pricing", label: "Harga", description: "Nilai dan label harga" },
  { id: "location", label: "Lokasi", description: "Wilayah dan alamat" },
  { id: "selling-points", label: "Selling Point", description: "Keunggulan utama unit" },
  { id: "details", label: "Spesifikasi", description: "Bangunan, utilitas, kondisi" },
  { id: "media", label: "Foto", description: "Foto utama dan galeri" },
  { id: "seo", label: "SEO", description: "Tampilan mesin pencari" },
  { id: "publishing", label: "Publish", description: "Pemeriksaan dan penayangan" },
];

const CREATE_SECTIONS: EditorSectionItem[] = EDIT_SECTIONS;

export const getEditorSections = (mode: EditorMode) =>
  mode === "create" ? CREATE_SECTIONS : EDIT_SECTIONS;

export function EditorNavigation({
  mode,
  activeSection,
  onSelect,
  isComplete,
  hasError,
}: {
  mode: EditorMode;
  activeSection: EditorSection;
  onSelect: (section: EditorSection) => void;
  isComplete: (section: EditorSection) => boolean;
  hasError: (section: EditorSection) => boolean;
}) {
  const sections = getEditorSections(mode);

  return (
    <nav className="space-y-1" aria-label="Bagian editor properti">
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Informasi Properti
      </p>
      {sections.map((section, index) => {
        const active = section.id === activeSection;
        const error = hasError(section.id);
        const complete = isComplete(section.id);

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            aria-current={active ? "step" : undefined}
            className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              active
                ? "border-emerald-500/30 bg-gradient-to-r from-emerald-50/80 to-teal-50/30 shadow-[0_2px_10px_rgb(0,0,0,0.02)] text-slate-900 ring-1 ring-emerald-500/20"
                : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200/60 hover:shadow-sm"
            }`}
          >
            <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[10px] text-xs font-bold transition-all duration-300 ${
              error
                ? "bg-rose-100 text-rose-700"
                : complete
                  ? "bg-emerald-100 text-emerald-700"
                  : active
                    ? "bg-white text-emerald-600 shadow-sm border border-emerald-100"
                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm"
            }`}>
              {error ? <AlertCircle size={14} aria-hidden="true" /> : complete ? <Check size={14} aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[13px] font-bold ${active ? "text-slate-900" : "text-slate-700"}`}>{section.label}</span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-400">{section.description}</span>
            </span>
            <ChevronRight size={14} className={`transition-transform duration-300 ${active ? "text-emerald-600 translate-x-1" : "text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5"}`} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
