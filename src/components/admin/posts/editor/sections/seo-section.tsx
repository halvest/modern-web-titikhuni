import React from "react";
import { PostFormData } from "../types";
import { FormInput, FormTextarea } from "../ui/form-input";
import { Globe, CheckCircle2, XCircle } from "lucide-react";

interface SeoSectionProps {
  data: PostFormData;
  onChange: (updates: Partial<PostFormData>) => void;
}

export function SeoSection({ data, onChange }: SeoSectionProps) {
  // SERP Preview constraints
  const titlePreview = data.seo_title || data.title || "Untitled Article";
  const descPreview = data.meta_description || data.excerpt || "No description provided.";
  const urlPreview = `titikhuni.id/blog/${data.slug || "new-article"}`;

  // SEO Completeness Checks
  const checks = [
    { label: "Title exists", passed: !!data.title && data.title.length > 5 },
    { label: "SEO Title optimized (40-60 chars)", passed: !!data.seo_title && data.seo_title.length >= 40 && data.seo_title.length <= 60 },
    { label: "Slug is defined", passed: !!data.slug && data.slug.length > 3 },
    { label: "Meta description (120-160 chars)", passed: !!data.meta_description && data.meta_description.length >= 120 && data.meta_description.length <= 160 },
    { label: "Featured Image provided", passed: !!data.featured_image },
    { label: "Category selected", passed: !!data.category_id },
    { label: "Internal linking used", passed: data.related_unit_ids?.length > 0 || data.related_post_ids?.length > 0 },
  ];

  const score = Math.round((checks.filter(c => c.passed).length / checks.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          SEO & Search Presence
        </h2>
        <p className="mt-1.5 text-[13px] font-medium text-slate-500">
          Optimize how this article appears on Google and social media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <FormInput
              label="SEO Title"
              value={data.seo_title}
              onChange={(e) => onChange({ seo_title: e.target.value })}
              placeholder={data.title || "Optimized title for search engines..."}
            />
            <div className="text-right -mt-4">
              <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${data.seo_title?.length >= 40 && data.seo_title?.length <= 60 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {data.seo_title?.length || 0} / 60 chars
              </span>
            </div>

            <FormTextarea
              label="Meta Description"
              value={data.meta_description}
              onChange={(e) => onChange({ meta_description: e.target.value })}
              placeholder={data.excerpt || "Brief summary for search results..."}
              rows={3}
            />
            <div className="text-right -mt-4">
              <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${data.meta_description?.length >= 120 && data.meta_description?.length <= 160 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {data.meta_description?.length || 0} / 160 chars
              </span>
            </div>

            <FormInput
              label="Canonical URL"
              value={data.canonical_url}
              onChange={(e) => onChange({ canonical_url: e.target.value })}
              placeholder={`https://titikhuni.id/blog/${data.slug || 'slug'}`}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <h3 className="text-[11px] uppercase font-bold text-slate-600 tracking-widest block mb-4">
              Google SERP Preview
            </h3>
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Globe size={14} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-slate-900 leading-tight">Titik Huni</p>
                  <p className="text-xs text-slate-500 truncate">https://{urlPreview}</p>
                </div>
              </div>
              <h4 className="text-xl font-medium text-[#1a0dab] hover:underline cursor-pointer truncate mb-1">
                {titlePreview}
              </h4>
              <p className="text-sm text-[#4d5156] line-clamp-2">
                {descPreview}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.16em] text-center mt-4">
              * This is an editorial preview, not a guarantee.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          {/* SEO Completeness */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] uppercase font-bold text-slate-600 tracking-widest">
                SEO Completeness
              </h3>
              <div className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest ${
                score === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                score > 60 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {score}%
              </div>
            </div>
            
            <ul className="space-y-3">
              {checks.map((check, i) => (
                <li key={i} className="flex items-start gap-2">
                  {check.passed ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-slate-300 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-[13px] font-medium ${check.passed ? 'text-slate-900' : 'text-slate-500'}`}>
                    {check.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-[11px] uppercase font-bold text-slate-600 tracking-widest">
              Search Indexing
            </h3>
            <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
              <input
                type="checkbox"
                checked={data.is_indexed}
                onChange={(e) => onChange({ is_indexed: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-[13px] font-medium text-slate-900">Allow search engines to index this article</span>
            </label>
            {!data.is_indexed && (
              <p className="text-[11px] font-bold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                ⚠️ Article will have a noindex tag.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
