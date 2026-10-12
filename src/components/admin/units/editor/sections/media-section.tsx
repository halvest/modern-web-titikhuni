import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpload } from "@/hooks/use-upload";
import { deleteUnitImage } from "@/app/(admin)/admin/units/actions";
import { type PropertyFieldErrors, type PropertyFormData } from "../types";

export function MediaSection({
  data,
  onChange,
  errors,
  onUploadingChange,
}: {
  data: PropertyFormData;
  onChange: (updates: Partial<PropertyFormData>) => void;
  errors: PropertyFieldErrors;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const { uploadImage } = useUpload();
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const uploading = uploadingMain || uploadingGallery;

  useEffect(() => onUploadingChange(uploading), [onUploadingChange, uploading]);
  useEffect(() => () => onUploadingChange(false), [onUploadingChange]);

  const handleMainImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const oldUrl = data.image_url;
    setUploadingMain(true);
    try {
      const publicUrl = await uploadImage(file);
      onChange({ image_url: publicUrl });
      toast.success("Foto utama berhasil diunggah");

      // Bersihkan file draft lama dari storage jika unit belum pernah disimpan ke database
      if (!data.id && oldUrl && oldUrl !== publicUrl) {
        deleteUnitImage({ imageUrl: oldUrl }).catch(() => {});
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Foto utama gagal diunggah");
    } finally {
      setUploadingMain(false);
      event.target.value = "";
    }
  };

  const handleRemoveMainImage = async () => {
    const currentUrl = data.image_url;
    onChange({ image_url: "" });
    if (!data.id && currentUrl) {
      deleteUnitImage({ imageUrl: currentUrl }).catch(() => {});
    }
  };

  const handleRemoveGalleryImage = async (url: string, index: number) => {
    onChange({ gallery: data.gallery.filter((_, itemIndex) => itemIndex !== index) });
    if (!data.id && url) {
      deleteUnitImage({ imageUrl: url }).catch(() => {});
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (data.gallery.length + files.length > 10) {
      toast.error("Galeri maksimal berisi 10 foto");
      event.target.value = "";
      return;
    }

    setUploadingGallery(true);
    const toastId = toast.loading("Mengunggah foto galeri...");
    const uploadedUrls: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
        toast.loading(`Mengunggah foto galeri (${index + 1}/${files.length})...`, { id: toastId });
      }

      onChange({ gallery: [...data.gallery, ...uploadedUrls] });
      toast.success("Galeri berhasil diperbarui", { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Foto galeri gagal diunggah";
      if (uploadedUrls.length) {
        onChange({ gallery: [...data.gallery, ...uploadedUrls] });
        toast.error(`${uploadedUrls.length} foto berhasil diunggah sebelum proses gagal. ${errorMessage}`, { id: toastId });
      } else {
        toast.error(errorMessage, { id: toastId });
      }
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="media-heading">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Media</p>
        <h2 id="media-heading" className="mt-1 text-xl font-semibold text-slate-900">Foto properti</h2>
        <p className="mt-1 text-sm text-slate-500">Gunakan foto utama yang jelas, lalu lengkapi sudut lain melalui galeri.</p>
        <p className="mt-3 text-xs text-slate-400"><span className="text-rose-500">*</span> Foto utama wajib sebelum publikasi</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div><h3 className="text-sm font-semibold text-slate-900">Foto Utama</h3><p className="mt-1 text-xs text-slate-500">Digunakan pada katalog dan halaman detail.</p></div>
          {data.image_url && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRemoveMainImage}
                disabled={uploadingMain}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:border-rose-200"
                aria-label="Hapus foto utama"
              >
                <Trash2 size={15} aria-hidden="true" />
                Hapus
              </button>
              <label className="relative inline-flex min-h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
                {uploadingMain ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Upload size={15} aria-hidden="true" />}
                Ganti Foto
                <input id="main-image-upload" name="mainImage" type="file" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleMainImageChange} disabled={uploadingMain} aria-label="Ganti foto utama" />
              </label>
            </div>
          )}
        </div>

        <div className={`relative mt-5 overflow-hidden rounded-xl border ${errors.image_url ? "border-rose-300" : "border-slate-200"} bg-slate-50`}>
          {data.image_url ? (
            <div className="relative aspect-[16/9] w-full"><Image src={data.image_url} alt={`Foto utama ${data.title || "properti"}`} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" unoptimized /></div>
          ) : (
            <label className="relative flex aspect-[16/9] cursor-pointer flex-col items-center justify-center overflow-hidden p-6 text-center transition-colors hover:bg-slate-100 focus-within:ring-2 focus-within:ring-emerald-500">
              {uploadingMain ? <Loader2 size={28} className="animate-spin text-emerald-600" aria-hidden="true" /> : <ImageIcon size={30} className="text-slate-300" aria-hidden="true" />}
              <span className="mt-3 text-sm font-medium text-slate-700">Upload Foto Utama</span>
              <span className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, atau AVIF · maksimal 8 MB.</span>
              <input id="main-image-upload" name="mainImage" type="file" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleMainImageChange} disabled={uploadingMain} aria-label="Upload foto utama" />
            </label>
          )}
        </div>
        {errors.image_url && <p className="mt-2 text-xs text-rose-600">{errors.image_url}</p>}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div><h3 className="text-sm font-semibold text-slate-900">Galeri</h3><p className="mt-1 text-xs text-slate-500">{data.gallery.length} dari maksimal 10 foto.</p></div>
          <label className="relative inline-flex min-h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500">
            {uploadingGallery ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
            Tambah Foto
            <input id="gallery-images-upload" name="galleryImages" type="file" multiple className="absolute inset-0 h-full w-full cursor-pointer opacity-0" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleGalleryUpload} disabled={uploadingGallery || data.gallery.length >= 10} aria-label="Tambah foto galeri" />
          </label>
        </div>

        {data.gallery.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.gallery.map((url, index) => (
              <div key={`${url}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image src={url} alt={`Foto galeri ${index + 1} untuk ${data.title || "properti"}`} fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(url, index)}
                  className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950/75 text-white transition-colors hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={`Hapus foto galeri ${index + 1}`}
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
            <ImageIcon size={28} className="mx-auto text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-700">Belum ada foto galeri.</p>
            <p className="mt-1 text-xs text-slate-500">Tambahkan beberapa foto untuk membantu calon pembeli memahami properti.</p>
          </div>
        )}
      </div>
    </section>
  );
}
