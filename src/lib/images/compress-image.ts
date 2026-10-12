/**
 * Client-side image compression utility.
 * Compresses large JPEG/PNG/WebP uploads to WebP (max 1920px, 82% quality)
 * to reduce file size from 3MB-10MB down to 150KB-350KB before uploading to Supabase.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<File> {
  // If file is SVG or animated GIF, don't compress
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If already WebP and under 350KB, skip compression
  if (file.type === "image/webp" && file.size < 350 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

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
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // If compressed result is unexpectedly larger than original and original is small, keep original
            if (blob.size >= file.size && file.size < 400 * 1024) {
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, "");
            const compressedFile = new File([blob], `${cleanName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
