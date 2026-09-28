"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, Save, TriangleAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import { saveUnit, updateUnit } from "@/app/(admin)/admin/units/actions";
import { EditorNavigation, getEditorSections } from "./editor-navigation";
import { OverviewSection } from "./sections/overview-section";
import { PricingSection } from "./sections/pricing-section";
import { SellingPointsSection } from "./sections/selling-points-section";
import { DetailsSection } from "./sections/details-section";
import { LocationSection } from "./sections/location-section";
import { MediaSection } from "./sections/media-section";
import { SeoSection } from "./sections/seo-section";
import { PublishingSection, type PublishIssue } from "./sections/publishing-section";
import {
  type EditorMode,
  type EditorSection,
  type PropertyFieldErrors,
  type PropertyFormData,
} from "./types";

const DEFAULT_DATA: PropertyFormData = {
  title: "",
  slug: "",
  category_id: "",
  description: "",
  status: "Draft",
  price: "",
  price_prefix: "Mulai",
  price_suffix: "",
  location: "",
  village: "",
  district: "",
  city: "",
  province: "Daerah Istimewa Yogyakarta",
  full_address: "",
  selling_points: [],
  land_area: "",
  building_area: "",
  floor_count: "",
  bedroom_count: "",
  bathroom_count: "",
  carport_count: "",
  certificate_type: "",
  electricity_power: "",
  water_source: "",
  furnishing: "",
  image_url: "",
  gallery: [],
  seo_title: "",
  meta_description: "",
  canonical_url: "",
  is_indexed: true,
  og_image: "",
  is_featured: false,
  featured_order: null,
};

const ALLOWED_STATUSES = ["Tersedia", "Booked", "Sold", "Coming Soon", "Draft"];

function isValidOptionalUrl(value?: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateSection(data: PropertyFormData, section: EditorSection): PropertyFieldErrors {
  const errors: PropertyFieldErrors = {};
  if (section === "overview") {
    if (!data.title.trim()) errors.title = "Nama properti wajib diisi.";
    if (!data.slug.trim()) errors.slug = "Slug wajib diisi.";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) errors.slug = "Gunakan huruf kecil, angka, dan tanda hubung.";
    if (!ALLOWED_STATUSES.includes(data.status)) errors.status = "Pilih status unit yang valid.";
  }
  if (section === "pricing") {
    if (data.status !== "Coming Soon" && (!data.price || Number(data.price) <= 0)) {
      errors.price = "Harga harus lebih besar dari nol.";
    }
    if (data.price_prefix && !["Mulai", "Mulai dari", "Harga", "Promo"].includes(data.price_prefix)) {
      errors.price_prefix = "Pilih prefix harga yang valid.";
    }
    if (data.price_suffix && !["Juta", "Miliar"].includes(data.price_suffix)) {
      errors.price_suffix = "Pilih format harga yang valid.";
    }
  }
  if (section === "location") {
    if (!data.category_id) errors.category_id = "Wilayah Jogja wajib dipilih.";
    if (![data.location, data.village, data.district, data.city].some((value) => value.trim())) {
      errors.location = "Isi minimal satu informasi lokasi.";
    }
  }
  if (section === "selling-points") {
    if (data.selling_points.length > 8) errors.selling_points = "Maksimal 8 selling point.";
    else if (data.selling_points.length > 0 && data.selling_points.length < 3) errors.selling_points = "Tambahkan minimal 3 selling point atau kosongkan seluruhnya.";
    else if (data.selling_points.some((point) => !point.text.trim())) errors.selling_points = "Setiap selling point harus memiliki teks.";
  }
  if (section === "details") {
    const numericFields: Array<keyof Pick<PropertyFormData, "land_area" | "building_area" | "bedroom_count" | "bathroom_count" | "carport_count">> = [
      "land_area", "building_area", "bedroom_count", "bathroom_count", "carport_count",
    ];
    numericFields.forEach((field) => {
      if (data[field] !== "" && (!Number.isFinite(Number(data[field])) || Number(data[field]) < 0)) {
        errors[field] = "Masukkan angka nol atau lebih besar.";
      }
    });
    if (data.carport_count !== "" && !Number.isInteger(Number(data.carport_count))) {
      errors.carport_count = "Masukkan jumlah mobil dalam angka bulat.";
    }
    if (data.electricity_power !== "" && (!Number.isInteger(Number(data.electricity_power)) || Number(data.electricity_power) <= 0)) {
      errors.electricity_power = "Masukkan daya listrik dalam VA dengan angka bulat lebih dari nol.";
    }
    if (data.floor_count !== "" && (!Number.isInteger(Number(data.floor_count)) || Number(data.floor_count) <= 0)) {
      errors.floor_count = "Jumlah lantai harus berupa angka bulat lebih dari nol.";
    }
  }
  if (section === "media" && !data.image_url) errors.image_url = "Foto utama wajib diunggah sebelum publikasi.";
  if (section === "seo") {
    if (!isValidOptionalUrl(data.canonical_url)) errors.canonical_url = "Gunakan URL lengkap yang valid.";
    if (!isValidOptionalUrl(data.og_image)) errors.og_image = "Gunakan URL gambar yang valid.";
  }
  if (section === "publishing") {
    if (!ALLOWED_STATUSES.includes(data.status)) {
      errors.status = "Pilih status properti yang valid.";
    }
    if (
      data.is_featured &&
      (!Number.isInteger(data.featured_order) ||
        data.featured_order === null ||
        data.featured_order < 1 ||
        data.featured_order > 6)
    ) {
      errors.featured_order = "Pilih urutan homepage antara 1 sampai 6.";
    }
    if (data.is_featured && !["Tersedia", "Sold", "Coming Soon"].includes(data.status)) {
      errors.is_featured = "Hanya unit Tersedia, Terjual, atau Coming Soon yang dapat dipilih untuk homepage.";
    }
  }
  return errors;
}

function mergeErrors(...groups: PropertyFieldErrors[]) {
  return Object.assign({}, ...groups) as PropertyFieldErrors;
}

function createFormData(data: PropertyFormData) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "gallery") {
      (value as string[]).forEach((url) => formData.append("gallery", url));
    } else if (key === "selling_points") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return formData;
}

type SaveIntent = "draft" | "continue" | "publish" | "save";
type SaveState = "idle" | "saved" | "error";

export function PropertyEditor({
  initialData,
  categories,
  mode,
  initialSection,
}: {
  initialData?: PropertyFormData;
  categories: { id: string; name: string }[];
  mode: EditorMode;
  initialSection?: EditorSection;
}) {
  const router = useRouter();
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const sections = useMemo(() => getEditorSections(mode), [mode]);
  const firstSection = sections.some((section) => section.id === initialSection) ? initialSection! : sections[0].id;
  const [data, setData] = useState<PropertyFormData>(initialData || DEFAULT_DATA);
  const [originalData, setOriginalData] = useState<PropertyFormData>(initialData || DEFAULT_DATA);
  const [activeSection, setActiveSection] = useState<EditorSection>(firstSection);
  const [attemptedSections, setAttemptedSections] = useState<Set<EditorSection>>(new Set());
  const [completedSections, setCompletedSections] = useState<Set<EditorSection>>(() => {
    if (mode !== "create" || !initialData) return new Set();
    const initialIndex = sections.findIndex((section) => section.id === firstSection);
    return new Set(sections.slice(0, Math.max(0, initialIndex)).map((section) => section.id));
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>(initialData ? "saved" : "idle");
  const [showPublishErrors, setShowPublishErrors] = useState(false);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(originalData),
    [data, originalData]
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleUpdate = useCallback((updates: Partial<PropertyFormData>) => {
    setData((current) => ({ ...current, ...updates }));
    setSaveState("idle");
  }, []);

  const sectionErrors = useCallback((section: EditorSection) => {
    const errors = validateSection(data, section);
    return errors;
  }, [data]);

  const publishErrors = useMemo(
    () => mergeErrors(...(["overview", "pricing", "location", "selling-points", "details", "media", "seo", "publishing"] as EditorSection[]).map((section) => validateSection(data, section))),
    [data]
  );

  const publishIssues = useMemo<PublishIssue[]>(() => {
    const definitions: Array<{ field: keyof PropertyFormData; label: string; section: EditorSection }> = [
      { field: "title", label: "Nama properti", section: "overview" },
      { field: "slug", label: "URL properti", section: "overview" },
      { field: "status", label: "Status unit", section: "overview" },
      { field: "price", label: "Harga", section: "pricing" },
      { field: "price_prefix", label: "Prefix harga", section: "pricing" },
      { field: "price_suffix", label: "Format harga", section: "pricing" },
      { field: "category_id", label: "Wilayah Jogja", section: "location" },
      { field: "location", label: "Lokasi", section: "location" },
      { field: "selling_points", label: "Selling point", section: "selling-points" },
      { field: "land_area", label: "Luas tanah", section: "details" },
      { field: "building_area", label: "Luas bangunan", section: "details" },
      { field: "floor_count", label: "Jumlah lantai", section: "details" },
      { field: "bedroom_count", label: "Kamar tidur", section: "details" },
      { field: "bathroom_count", label: "Kamar mandi", section: "details" },
      { field: "carport_count", label: "Kapasitas carport", section: "details" },
      { field: "certificate_type", label: "Sertifikat", section: "details" },
      { field: "electricity_power", label: "Daya listrik", section: "details" },
      { field: "water_source", label: "Sumber air", section: "details" },
      { field: "furnishing", label: "Furnishing", section: "details" },
      { field: "image_url", label: "Foto utama", section: "media" },
      { field: "canonical_url", label: "Canonical override", section: "seo" },
      { field: "og_image", label: "OG image override", section: "seo" },
      { field: "featured_order", label: "Urutan unit pilihan", section: "publishing" },
      { field: "is_featured", label: "Kurasi homepage", section: "publishing" },
    ];
    return definitions.filter((definition) => publishErrors[definition.field]).map(({ label, section }) => ({ label, section }));
  }, [publishErrors]);

  const currentIndex = sections.findIndex((section) => section.id === activeSection);
  const currentSection = sections[currentIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio to get the most prominent one
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const activeId = visibleEntries[0].target.id.replace("section-", "") as EditorSection;
          if (activeId !== activeSection) {
            setActiveSection(activeId);
          }
        }
      },
      { rootMargin: "-100px 0px -40% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    sections.forEach((section) => {
      const el = document.getElementById(`section-${section.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, activeSection]);

  const navigateTo = (section: EditorSection) => {
    setActiveSection(section);
    if (section !== "publishing") setShowPublishErrors(false);

    // Scroll only the editor viewport. scrollIntoView also scrolls ancestors,
    // including the locked admin shell, which can move the action bar offscreen.
    const scrollContainer = editorScrollRef.current;
    const target = document.getElementById(`section-${section}`);
    if (!scrollContainer || !target) return;

    const containerTop = scrollContainer.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    scrollContainer.scrollTo({
      top: scrollContainer.scrollTop + targetTop - containerTop - 24,
      behavior: "smooth",
    });
  };

  const cancel = () => {
    if (hasUnsavedChanges && !window.confirm("Perubahan belum disimpan. Keluar dari editor?")) return;
    router.push("/admin/units");
  };

  const persist = async (intent: SaveIntent) => {
    if (isSaving || isUploading) return false;

    let validationErrors: PropertyFieldErrors = {};
    if (intent === "draft") {
      validationErrors = validateSection(data, "overview");
      if (Object.keys(validationErrors).length) setActiveSection("overview");
    } else if (intent === "continue") {
      validationErrors = sectionErrors(activeSection);
    } else if (intent === "publish" || (intent === "save" && data.status !== "Draft")) {
      validationErrors = publishErrors;
      setShowPublishErrors(true);
    } else {
      validationErrors = mergeErrors(validateSection(data, "overview"), validateSection(data, "details"), validateSection(data, "seo"), validateSection(data, "publishing"));
    }

    if (Object.keys(validationErrors).length) {
      setAttemptedSections(new Set(sections.map((section) => section.id)));
      if (intent === "publish" || intent === "save") {
        const firstIssue = publishIssues[0];
        if (firstIssue) navigateTo(firstIssue.section);
      } else {
        // If draft error, navigate to overview
        navigateTo("overview");
      }
      setSaveState("error");
      toast.error(intent === "publish" ? "Properti belum dapat dipublikasikan." : "Periksa kembali bidang yang wajib diisi.");
      return false;
    }

    const nextStatus = intent === "draft"
      ? "Draft"
      : intent === "publish" && data.status === "Draft"
        ? "Tersedia"
        : data.status;
    const payload = { ...data, status: nextStatus };
    const formData = createFormData(payload);
    setIsSaving(true);
    setSaveState("idle");
    const toastId = toast.loading(intent === "publish" ? "Mempublikasikan properti..." : "Menyimpan properti...");

    try {
      const result = payload.id ? await updateUnit(payload.id, formData) : await saveUnit(formData);
      if (result?.error) throw new Error(result.error);

      const savedData = { ...payload, id: payload.id || result?.id };
      setData(savedData);
      setOriginalData(savedData);
      setSaveState("saved");
      setCompletedSections((current) => new Set([...current, activeSection]));
      setAttemptedSections((current) => {
        const next = new Set(current);
        next.delete(activeSection);
        return next;
      });
      const warning = "warning" in result && typeof result.warning === "string" ? result.warning : undefined;
      toast.success(warning || (intent === "publish" ? "Properti berhasil dibuat." : "Perubahan tersimpan."), { id: toastId });

      if (intent === "publish") {
        router.push("/admin/units");
        return true;
      }

      const savedId = savedData.id;
      if (mode === "create" && savedId) {
        const nextSection = activeSection;
        setActiveSection(nextSection);
        router.replace(`/admin/units/edit/${savedId}?flow=create&step=${nextSection}`);
      }
      return true;
    } catch (error) {
      setSaveState("error");
      toast.error(error instanceof Error ? error.message : "Properti gagal disimpan.", { id: toastId });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const visibleErrors = attemptedSections.has(activeSection) || showPublishErrors ? sectionErrors(activeSection) : {};
  const statusLabel = isUploading
    ? "Upload media sedang berjalan"
    : isSaving
      ? "Menyimpan..."
      : saveState === "error"
        ? "Gagal menyimpan"
        : hasUnsavedChanges
          ? "Perubahan belum disimpan"
          : saveState === "saved"
            ? "Semua perubahan tersimpan"
            : "Belum disimpan";

  return (
    <div className="flex flex-col w-full" style={{ flex: "1 1 0%", minHeight: 0 }}>

      {/* ── Scrollable content area (owns the padding) ── */}
      <div ref={editorScrollRef} className="overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ flex: "1 1 0%", minHeight: 0 }}>

        {/* Page header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={cancel}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors hover:text-emerald-600 focus:outline-none mb-4"
            aria-label="Kembali ke daftar properti"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Kembali ke Properti
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {mode === "create" ? "Tambah " : "Edit "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Properti
                  </span>
                </h1>
                {data.status && (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                    {data.status === "Sold" ? "Terjual" : data.status}
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide ${saveState === "error" ? "text-rose-600" : hasUnsavedChanges ? "text-amber-600" : saveState === "saved" ? "text-emerald-600" : "text-slate-400"}`}>
                {isSaving || isUploading ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : saveState === "error" ? <TriangleAlert size={13} aria-hidden="true" /> : saveState === "saved" && !hasUnsavedChanges ? <CheckCircle2 size={13} aria-hidden="true" /> : null}
                {statusLabel}
              </div>
            </div>

            {mode === "edit" && data.slug && data.status !== "Draft" && (
              <Link
                href={`/unit/${data.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <ExternalLink size={15} aria-hidden="true" /> Lihat Unit
              </Link>
            )}
          </div>
        </div>

        {/* Body: sidebar nav + main form */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar navigation — desktop */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-6 max-h-[calc(100dvh-96px)] overflow-y-auto pb-4 scrollbar-thin">
              <EditorNavigation
                mode={mode}
                activeSection={activeSection}
                onSelect={navigateTo}
                isComplete={(section) => mode === "create" ? completedSections.has(section) : !Object.keys(sectionErrors(section)).length}
                hasError={(section) => attemptedSections.has(section) && !!Object.keys(sectionErrors(section)).length}
              />
            </div>
          </aside>

          {/* Mobile section picker */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div>
                <p className="text-xs font-medium text-slate-500">Bagian {currentIndex + 1} dari {sections.length}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{currentSection.label}</p>
              </div>
              <select
                aria-label="Pilih bagian"
                value={activeSection}
                onChange={(event) => navigateTo(event.target.value as EditorSection)}
                className="h-10 max-w-[180px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}
              </select>
            </div>
          </div>

          {/* Main form */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              <div id="section-overview"><OverviewSection data={data} onChange={handleUpdate} errors={visibleErrors} originalSlug={originalData.slug} /></div>
              <div id="section-pricing"><PricingSection data={data} onChange={handleUpdate} errors={visibleErrors} /></div>
              <div id="section-location"><LocationSection data={data} onChange={handleUpdate} categories={categories} errors={visibleErrors} /></div>
              <div id="section-selling-points"><SellingPointsSection data={data} onChange={handleUpdate} errors={visibleErrors} /></div>
              <div id="section-details"><DetailsSection data={data} onChange={handleUpdate} errors={visibleErrors} /></div>
              <div id="section-media"><MediaSection data={data} onChange={handleUpdate} errors={visibleErrors} onUploadingChange={setIsUploading} /></div>
              <div id="section-seo"><SeoSection data={data} onChange={handleUpdate} errors={visibleErrors} /></div>
              <div id="section-publishing"><PublishingSection data={data} onChange={handleUpdate} issues={publishIssues} showIssues={showPublishErrors} onNavigate={navigateTo} errors={sectionErrors("publishing")} /></div>
            </div>
          </main>
        </div>
      </div>

      {/* ── Action bar — shrink-0, always at bottom of viewport ── */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide ${saveState === "error" ? "text-rose-600" : hasUnsavedChanges ? "text-amber-600" : saveState === "saved" ? "text-emerald-600" : "text-slate-400"}`}>
            {isSaving || isUploading ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : saveState === "error" ? <TriangleAlert size={13} aria-hidden="true" /> : saveState === "saved" && !hasUnsavedChanges ? <CheckCircle2 size={13} aria-hidden="true" /> : null}
            {statusLabel}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={cancel}
              className="inline-flex justify-center min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => persist("draft")}
              disabled={isSaving || isUploading}
              className="inline-flex justify-center min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <Save size={15} aria-hidden="true" /> Simpan Draft
            </button>
            <button
              type="button"
              onClick={() => persist("publish")}
              disabled={isSaving || isUploading}
              className="group relative inline-flex justify-center min-h-10 overflow-hidden items-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] transition-all hover:bg-slate-800 hover:shadow-[0_6px_20px_rgb(0,0,0,0.23)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]" />
              <span className="relative flex items-center gap-2">
                {isSaving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
                {isSaving ? "Menyimpan..." : data.status === "Draft" ? "Publish" : "Simpan & Publish"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
