import { SupabaseClient } from "@supabase/supabase-js";

export const PROPERTI_BUCKET = "properti";
export const UNITS_PREFIX = "units/";
export const PLACEHOLDER_FILENAME = "units/.emptyFolderPlaceholder";

/**
 * Normalizes any URL, relative path, or storage key into a clean `units/<filename>` object path.
 * Returns null if the path is invalid, points outside `units/`, attempts directory traversal, or is the placeholder.
 */
export function extractPropertiStoragePath(urlOrPath: string | null | undefined): string | null {
  if (!urlOrPath || typeof urlOrPath !== "string") return null;

  const trimmed = urlOrPath.trim();
  if (!trimmed) return null;

  // Strip query parameters and hash fragments
  const clean = trimmed.split("?")[0].split("#")[0];

  // Prevent directory traversal attacks
  if (clean.includes("..") || clean.includes("\\")) {
    return null;
  }

  // Case 1: Already a relative path starting with 'units/'
  if (clean.startsWith(UNITS_PREFIX)) {
    const filename = clean.slice(UNITS_PREFIX.length);
    if (!filename || clean === PLACEHOLDER_FILENAME) return null;
    return clean;
  }

  // Case 2: Full public URL or relative API path: e.g. /storage/v1/object/public/properti/units/<file>
  const publicMarker = `/storage/v1/object/public/${PROPERTI_BUCKET}/`;
  const markerIndex = clean.indexOf(publicMarker);
  if (markerIndex !== -1) {
    const subpath = clean.slice(markerIndex + publicMarker.length);
    if (subpath.startsWith(UNITS_PREFIX) && subpath !== PLACEHOLDER_FILENAME) {
      return subpath;
    }
    return null;
  }

  // Case 3: Authenticated/signed URL format
  const signMarker = `/storage/v1/object/sign/${PROPERTI_BUCKET}/`;
  const signIndex = clean.indexOf(signMarker);
  if (signIndex !== -1) {
    const subpath = clean.slice(signIndex + signMarker.length);
    if (subpath.startsWith(UNITS_PREFIX) && subpath !== PLACEHOLDER_FILENAME) {
      return subpath;
    }
    return null;
  }

  return null;
}

/**
 * Checks if a storage object path is currently referenced by any active unit
 * (or legacy unit_images row), optionally excluding a specific unit ID (e.g. during update/delete).
 */
export async function isStorageObjectReferenced(
  supabase: SupabaseClient,
  storagePath: string,
  excludeUnitId?: string
): Promise<boolean> {
  const normalized = extractPropertiStoragePath(storagePath);
  if (!normalized) return false;

  // 1. Check active units (where deleted_at IS NULL)
  let unitQuery = supabase
    .from("units")
    .select("id, image_url, gallery")
    .is("deleted_at", null);

  if (excludeUnitId) {
    unitQuery = unitQuery.neq("id", excludeUnitId);
  }

  const { data: units, error: unitError } = await unitQuery;
  if (unitError) {
    console.error("[Storage Check] Error querying active units:", unitError.message);
    // Fail-safe: if query fails, assume it might be referenced to prevent accidental deletion
    return true;
  }

  if (units && units.length > 0) {
    const isReferencedInUnits = units.some((unit) => {
      const allUrls = [unit.image_url, ...(unit.gallery || [])].filter(Boolean);
      return allUrls.some((url) => extractPropertiStoragePath(url) === normalized);
    });

    if (isReferencedInUnits) return true;
  }

  // 2. Check legacy unit_images table if it contains rows
  try {
    let imagesQuery = supabase
      .from("unit_images")
      .select("id, unit_id, image_url")
      .ilike("image_url", `%${normalized}%`);

    if (excludeUnitId) {
      imagesQuery = imagesQuery.neq("unit_id", excludeUnitId);
    }

    const { data: legacyImages } = await imagesQuery;
    if (legacyImages && legacyImages.length > 0) {
      return true;
    }
  } catch {
    // If unit_images doesn't exist or isn't accessible, ignore
  }

  return false;
}

/**
 * Safely removes objects from the Supabase Storage 'properti' bucket in controlled batches.
 * Includes retry mechanism for transient network or storage errors.
 */
export async function removeUnitStorageObjects(
  supabase: SupabaseClient,
  storagePaths: string[],
  options?: { batchSize?: number; maxRetries?: number }
): Promise<{
  removed: string[];
  failed: Array<{ path: string; error: string }>;
}> {
  const batchSize = options?.batchSize ?? 20;
  const maxRetries = options?.maxRetries ?? 2;

  // Filter and sanitize paths strictly against the allowlist
  const validPaths = Array.from(
    new Set(
      storagePaths
        .map(extractPropertiStoragePath)
        .filter((path): path is string => Boolean(path) && path !== PLACEHOLDER_FILENAME)
    )
  );

  const removed: string[] = [];
  const failed: Array<{ path: string; error: string }> = [];

  if (validPaths.length === 0) {
    return { removed, failed };
  }

  // Process in controlled batches
  for (let i = 0; i < validPaths.length; i += batchSize) {
    const batch = validPaths.slice(i, i + batchSize);
    let attempt = 0;
    let batchSuccess = false;
    let lastError = "";

    while (attempt <= maxRetries && !batchSuccess) {
      try {
        const { data, error } = await supabase.storage.from(PROPERTI_BUCKET).remove(batch);

        if (error) {
          lastError = error.message;
          attempt++;
          if (attempt <= maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
          }
        } else {
          // data contains array of actually removed files from Supabase Storage
          const removedNames = (data || []).map((file) => file.name);
          if (removedNames.length > 0) {
            removed.push(...removedNames);
            const removedSet = new Set(removedNames);
            const unremoved = batch.filter((p) => !removedSet.has(p));
            if (unremoved.length > 0) {
              for (const p of unremoved) {
                failed.push({ path: p, error: "File tidak dihapus oleh Storage API" });
              }
            }
            batchSuccess = true;
          } else {
            lastError = "Storage API mengembalikan 0 file terhapus (izin ditolak atau file tidak ditemukan)";
            attempt++;
            if (attempt <= maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
            }
          }
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown storage removal error";
        attempt++;
        if (attempt <= maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
        }
      }
    }

    if (!batchSuccess) {
      for (const path of batch) {
        failed.push({ path, error: lastError });
      }
    }
  }

  return { removed, failed };
}

export type OrphanCandidate = {
  name: string;
  sizeBytes: number;
  createdAt: string;
  reason: string;
};

export type AuditResult = {
  scannedCount: number;
  activeCount: number;
  orphanCount: number;
  ignoredCount: number;
  reclaimableBytes: number;
  candidates: OrphanCandidate[];
  deleted: string[];
  failed: Array<{ path: string; error: string }>;
  isDryRun: boolean;
};

/**
 * Audits all objects in bucket 'properti' under 'units/' to identify orphaned files.
 * Provides dry-run by default. Enforces age threshold (default 60 mins) to protect in-flight uploads.
 */
export async function auditUnitStorageOrphans(
  supabase: SupabaseClient,
  options?: {
    dryRun?: boolean;
    limit?: number;
    olderThanMinutes?: number;
  }
): Promise<AuditResult> {
  const isDryRun = options?.dryRun ?? true;
  const limit = options?.limit;
  const olderThanMinutes = options?.olderThanMinutes ?? 60;
  const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);

  // 1. Fetch all active references from database
  const { data: activeUnits, error: unitError } = await supabase
    .from("units")
    .select("id, image_url, gallery")
    .is("deleted_at", null);

  if (unitError) {
    throw new Error(`Gagal membaca data unit aktif: ${unitError.message}`);
  }

  const activePaths = new Set<string>();
  for (const unit of activeUnits || []) {
    const urls = [unit.image_url, ...(unit.gallery || [])].filter(Boolean);
    for (const url of urls) {
      const p = extractPropertiStoragePath(url);
      if (p) activePaths.add(p);
    }
  }

  // Check legacy unit_images as well
  try {
    const { data: legacyImages } = await supabase
      .from("unit_images")
      .select("image_url");

    for (const item of legacyImages || []) {
      const p = extractPropertiStoragePath(item.image_url);
      if (p) activePaths.add(p);
    }
  } catch {
    // optional table
  }

  // 2. List all files from bucket 'properti' under 'units/'
  type StorageFileObject = NonNullable<
    Awaited<ReturnType<ReturnType<SupabaseClient["storage"]["from"]>["list"]>>["data"]
  >[number];
  const allObjects: StorageFileObject[] = [];
  let page = 0;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.storage.from(PROPERTI_BUCKET).list("units", {
      limit: pageSize,
      offset: page * pageSize,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      throw new Error(`Gagal membaca isi storage properti: ${error.message}`);
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allObjects.push(...data);
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  const candidates: OrphanCandidate[] = [];
  let activeCount = 0;
  let ignoredCount = 0;
  let reclaimableBytes = 0;

  for (const obj of allObjects) {
    const fullPath = `units/${obj.name}`;

    // Skip placeholder
    if (obj.name === ".emptyFolderPlaceholder" || fullPath === PLACEHOLDER_FILENAME) {
      ignoredCount++;
      continue;
    }

    // Check if referenced by active unit
    if (activePaths.has(fullPath)) {
      activeCount++;
      continue;
    }

    // Check creation date to avoid deleting in-flight uploads
    const createdAt = obj.created_at ? new Date(obj.created_at) : new Date(0);
    if (createdAt > cutoffTime) {
      ignoredCount++;
      continue;
    }

    const size = typeof obj.metadata?.size === "number" ? obj.metadata.size : 0;
    reclaimableBytes += size;

    candidates.push({
      name: fullPath,
      sizeBytes: size,
      createdAt: createdAt.toISOString(),
      reason: "Tidak direferensikan oleh unit aktif mana pun dan melewati batas waktu aman",
    });
  }

  const targetedCandidates = limit && limit > 0 ? candidates.slice(0, limit) : candidates;

  let deleted: string[] = [];
  let failed: Array<{ path: string; error: string }> = [];

  if (!isDryRun && targetedCandidates.length > 0) {
    const pathsToDelete = targetedCandidates.map((c) => c.name);
    const result = await removeUnitStorageObjects(supabase, pathsToDelete);
    deleted = result.removed;
    failed = result.failed;
  }

  return {
    scannedCount: allObjects.length,
    activeCount,
    orphanCount: candidates.length,
    ignoredCount,
    reclaimableBytes,
    candidates: targetedCandidates,
    deleted,
    failed,
    isDryRun,
  };
}
