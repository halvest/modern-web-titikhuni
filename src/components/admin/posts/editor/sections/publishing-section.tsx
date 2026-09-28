import React from "react";
import { PostFormData, PostStatus } from "../types";
import { Send, FileText, Archive } from "lucide-react";

interface PublishingSectionProps {
  data: PostFormData;
  onChange: (updates: Partial<PostFormData>) => void;
}

const STATUS_OPTIONS: { id: PostStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { 
    id: "draft", 
    label: "Draft",
    icon: <FileText size={18} />, 
    desc: "Disembunyikan dari publik selama proses penulisan."
  },
  { 
    id: "published", 
    label: "Dipublikasikan",
    icon: <Send size={18} />, 
    desc: "Tampil di blog dan dapat dibaca semua pengunjung."
  },
  { 
    id: "archived", 
    label: "Diarsipkan",
    icon: <Archive size={18} />, 
    desc: "Tidak tampil di publik, tetapi tetap tersimpan."
  }
];

export function PublishingSection({ data, onChange }: PublishingSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Publikasi
        </h2>
        <p className="mt-1.5 text-[13px] font-medium text-slate-500">
          Atur apakah artikel tampil atau disembunyikan dari publik.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-[11px] uppercase font-bold text-slate-600 tracking-widest block mb-6">
          Status Visibilitas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = data.status === status.id;
            
            return (
              <label 
                key={status.id}
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? "border-emerald-500 bg-emerald-50/30 shadow-sm" 
                    : "border-slate-100 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <input 
                  type="radio" 
                  name="status"
                  value={status.id}
                  checked={isSelected}
                  onChange={(e) => onChange({ status: e.target.value as PostStatus })}
                  className="w-5 h-5 rounded-full text-emerald-600 focus:ring-emerald-500 accent-emerald-600 mt-0.5"
                />
                <div>
                  <div className={`flex items-center gap-2 mb-1.5 ${isSelected ? "text-emerald-700" : "text-slate-600"}`}>
                    {status.icon}
                    <span className="text-sm font-bold">{status.label}</span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                    {status.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
