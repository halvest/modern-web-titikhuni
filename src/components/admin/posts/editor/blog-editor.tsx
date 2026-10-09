"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronLeft, Save, Loader2, RefreshCcw } from "lucide-react";

import { PostFormData, BlogEditorSection } from "./types";
import { EditorNavigation } from "./editor-navigation";
import { GeneralSection } from "./sections/general-section";
import { TipTapSection } from "./sections/tiptap-section";
import { SeoSection } from "./sections/seo-section";
import { RelationsSection } from "./sections/relations-section";
import { PublishingSection } from "./sections/publishing-section";
import { savePost, updatePost } from "@/app/(admin)/admin/posts/actions";

interface BlogEditorProps {
  initialData?: PostFormData;
  categories: { id: string; name: string }[];
  isEditMode?: boolean;
}

const DEFAULT_DATA: PostFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featured_image: "",
  category_id: "",
  status: "draft",
  tags: [],
  seo_title: "",
  meta_description: "",
  canonical_url: "",
  is_indexed: true,
  og_image: "",
  related_unit_ids: [],
  related_post_ids: [],
};

export function BlogEditor({
  initialData,
  categories,
  isEditMode = false,
}: BlogEditorProps) {
  const router = useRouter();
  
  // Local state
  const [data, setData] = useState<PostFormData>(initialData || DEFAULT_DATA);
  const [originalData, setOriginalData] = useState<PostFormData>(initialData || DEFAULT_DATA);
  const [activeSection, setActiveSection] = useState<BlogEditorSection>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Deep comparison for unsaved changes (simplified)
  useEffect(() => {
    const isChanged = JSON.stringify(data) !== JSON.stringify(originalData);
    setHasUnsavedChanges(isChanged);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [data, originalData]);

  const handleUpdate = useCallback((updates: Partial<PostFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isValid = (section: BlogEditorSection): boolean => {
    switch (section) {
      case "general":
        return !!(data.title && data.slug && data.category_id);
      case "content":
        return !!data.content && data.content.length > 10;
      default:
        return true; 
    }
  };

  const isFormValid = () => {
    return isValid("general") && isValid("content");
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      toast.error("Lengkapi judul, slug, kategori, dan isi artikel sebelum menyimpan.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(isEditMode ? "Menyimpan perubahan..." : "Membuat artikel...");

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "tags" || key === "related_unit_ids" || key === "related_post_ids") {
          (value as string[]).forEach((val) => formData.append(key, val));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      if (isEditMode && data.id) {
        formData.append("id", data.id);
      }
      
      // If slug has changed, append the originalSlug so the backend can create a redirect
      if (isEditMode && initialData?.slug && initialData.slug !== data.slug) {
        formData.append("original_slug", initialData.slug);
      }

      // Call server action
      const result = isEditMode && data.id 
        ? await updatePost(data.id, formData) 
        : await savePost(formData);

      if (result?.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success(result?.warning || (isEditMode ? "Artikel berhasil diperbarui." : "Artikel berhasil dibuat."), { id: toastId });
        setOriginalData(data);
        if (!isEditMode) {
          router.push("/admin/posts");
          router.refresh();
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm("Perubahan artikel belum disimpan. Tetap keluar?")) return;
    router.push("/admin/posts");
  };

  return (
    <>
        {/* Page header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors hover:text-emerald-600 focus:outline-none mb-6"
            aria-label="Kembali ke daftar artikel"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Kembali ke Artikel
          </button>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {isEditMode ? "Edit " : "Tambah "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Artikel
                  </span>
                </h1>
              </div>
              <p className="text-[13px] font-medium text-slate-500 truncate max-w-xl">
                {data.title || "Artikel tanpa judul"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <RefreshCcw size={12} className="animate-spin-slow" /> Belum disimpan
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="inline-flex min-h-11 flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                {isSaving ? "Menyimpan..." : "Simpan Artikel"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left Sidebar Navigation */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-0 pb-4">
              <EditorNavigation
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isValid={isValid}
              />
            </div>
          </aside>
  
          {/* Mobile Horizontal Nav */}
          <div className="lg:hidden mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto p-4 shrink-0 scrollbar-hide">
            <div className="flex gap-2">
              <EditorNavigation
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isValid={isValid}
              />
            </div>
          </div>
  
          {/* Editor Section Panel */}
          <main className="flex-1 min-w-0 pb-32">
            <div className="max-w-4xl">
            {activeSection === "general" && (
              <GeneralSection
                data={data}
                onChange={handleUpdate}
                categories={categories}
                originalSlug={initialData?.slug}
              />
            )}
            {activeSection === "content" && (
              <TipTapSection data={data} onChange={handleUpdate} />
            )}
            {activeSection === "seo" && (
              <SeoSection data={data} onChange={handleUpdate} />
            )}
            {activeSection === "relations" && (
              <RelationsSection data={data} onChange={handleUpdate} />
            )}
            {activeSection === "publishing" && (
              <PublishingSection data={data} onChange={handleUpdate} />
            )}
            </div>
          </main>
        </div>
    </>
  );
}
