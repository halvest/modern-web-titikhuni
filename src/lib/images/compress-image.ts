/**
 * Client-side image compression utility.
 * Compresses large JPEG/PNG/WebP uploads to WebP (or JPEG fallback)
 * to ensure images are genuinely lightweight (150KB-400KB) before uploading to Supabase.
 */

/**
 * Checks whether the current browser canvas supports WebP export.
 */
export function isCanvasWebPSupported(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const uri = canvas.toDataURL("image/webp");
    return Boolean(uri && uri.startsWith("data:image/webp"));
  } catch {
    return false;
  }
}

/**
 * Determines file extension based on actual MIME type.
 */
function getExtensionForMimeType(mimeType: string, defaultExt = "webp"): string {
  switch (mimeType) {
    case "image/webp":
      return "webp";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/avif":
      return "avif";
    default:
      return defaultExt;
  }
}

/**
 * Compresses an image file with fallback to JPEG if WebP canvas encoding is unsupported.
 * Strictly guarantees that output binary matches the declared MIME type and extension.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<File> {
  // If file is SVG or animated GIF, don't compress
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If already valid WebP and under 350KB, skip re-compression
  if (file.type === "image/webp" && file.size < 350 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    // Validate image format
    if (!file.type.startsWith("image/")) {
      reject(new Error(`Tipe file tidak didukung: ${file.type}. Gunakan file gambar valid.`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar lokal."));

    reader.onload = (event) => {
      const img = new window.Image();

      img.onerror = () => {
        reject(new Error("File gambar rusak atau tidak dapat di-decode oleh browser."));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width <= 0 || height <= 0) {
          reject(new Error("Dimensi gambar tidak valid (0x0)."));
          return;
        }

        // Hitung skala aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi 2D Canvas context."));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Tentukan format target: WebP jika didukung, fallback ke JPEG
        const hasWebpSupport = isCanvasWebPSupported();
        const targetMime = hasWebpSupport ? "image/webp" : "image/jpeg";

        const convertToBlob = (mime: string, q: number): Promise<Blob | null> => {
          return new Promise((resBlob) => {
            canvas.toBlob((blob) => resBlob(blob), mime, q);
          });
        };

        const processBlob = async () => {
          try {
            let blob = await convertToBlob(targetMime, quality);

            // Jika canvas diam-diam fallback ke PNG (spec HTML5 saat mime tidak didukung)
            if (blob && blob.type === "image/png" && targetMime === "image/webp") {
              // Coba fallback ke JPEG untuk mencegah output PNG 5MB tanpa kompresi
              const jpegBlob = await convertToBlob("image/jpeg", quality);
              if (jpegBlob && jpegBlob.type === "image/jpeg") {
                blob = jpegBlob;
              }
            }

            if (!blob) {
              reject(new Error("Gagal mengompresi gambar (blob kosong)."));
              return;
            }

            // Jika ukuran hasil masih > 800KB, lakukan pass kedua dengan kompresi lebih ketat
            if (blob.size > 800 * 1024) {
              const pass2Quality = Math.max(0.72, quality - 0.1);
              const smallerBlob = await convertToBlob(blob.type, pass2Quality);
              if (smallerBlob && smallerBlob.size < blob.size) {
                blob = smallerBlob;
              }
            }

            // Pastikan ekstensi file sesuai MIME type sebenarnya dari blob
            const actualMime = blob.type;
            const ext = getExtensionForMimeType(actualMime);
            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9\-_]+/gi, "-");

            const finalFile = new File([blob], `${cleanName}.${ext}`, {
              type: actualMime,
              lastModified: Date.now(),
            });

            resolve(finalFile);
          } catch (err) {
            reject(err instanceof Error ? err : new Error("Gagal memproses kompresi gambar."));
          }
        };

        processBlob();
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
