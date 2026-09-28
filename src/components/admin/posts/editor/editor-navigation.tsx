import React from "react";
import { BlogEditorSection } from "./types";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface EditorNavigationProps {
  activeSection: BlogEditorSection;
  setActiveSection: (section: BlogEditorSection) => void;
  isValid: (section: BlogEditorSection) => boolean;
}

const SECTIONS: { id: BlogEditorSection; label: string; desc: string }[] = [
  { id: "general", label: "Informasi", desc: "Identitas & media" },
  { id: "content", label: "Isi Artikel", desc: "Editor konten" },
  { id: "relations", label: "Relasi", desc: "Tautan internal" },
  { id: "seo", label: "SEO", desc: "Tampilan pencarian" },
  { id: "publishing", label: "Publikasi", desc: "Status visibilitas" },
];

export function EditorNavigation({
  activeSection,
  setActiveSection,
  isValid,
}: EditorNavigationProps) {
  return (
    <nav className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 lg:gap-1">
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        const valid = isValid(section.id);
        
        return (
          <button
            key={section.id}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(section.id);
            }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
              isActive
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className={`transition-opacity ${valid ? "opacity-100" : "opacity-20"}`}>
                <CheckCircle2 size={16} className={isActive ? "text-emerald-400" : "text-emerald-500"} />
              </div>
              <div>
                <p className={`text-[13px] font-bold ${isActive ? "text-white" : "text-slate-900"}`}>
                  {section.label}
                </p>
                <p className={`text-[10px] uppercase tracking-[0.16em] font-bold mt-0.5 ${isActive ? "text-slate-400" : "text-slate-400"}`}>
                  {section.desc}
                </p>
              </div>
            </div>
            
            <ChevronRight
              size={14}
              className={`transition-transform ${isActive ? "translate-x-0 opacity-100 text-slate-400" : "opacity-0 -translate-x-2 text-slate-300"}`}
            />
          </button>
        );
      })}
    </nav>
  );
}
