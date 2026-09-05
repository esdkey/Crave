import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

/** Neon Object Storage bucket holding product images (public_read). */
export const STORAGE_BUCKET = "product-images";
/** Relative URL prefix for images proxied through the app from the bucket. */
export const STORAGE_URL_PREFIX = "/product-storage/";

function storageConfigured(): boolean {
  return Boolean(
    process.env.AWS_ENDPOINT_URL_S3 &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY,
  );
}

function files(): Files {
  return new Files({ adapter: neon({ bucket: STORAGE_BUCKET }) });
}

/**
 * Persist an uploaded image to Neon Object Storage (or local public/uploads as a
 * fallback when storage isn't configured) and return its public URL.
 * Throws on invalid type or oversize file.
 */
export async function saveUploadedImage(
  file: File | undefined | null,
  folder = "products",
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!ALLOWED.has(file.type)) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  const ext = EXT[file.type] ?? "jpg";
  const name = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (storageConfigured()) {
    const key = `${folder}/${name}`;
    await files().upload(key, bytes, { contentType: file.type });
    return `${STORAGE_URL_PREFIX}${key}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);

  return `/uploads/${folder}/${name}`;
}

/** Collect every submitted file for a multi-file field name. */
export function getFiles(formData: FormData, field: string): File[] {
  const all = formData.getAll(field) as File[];
  return all.filter((f) => f && f.size > 0);
}

/** Delete an uploaded image by public URL (best-effort, ignores missing). */
export async function deleteUploadedImage(publicUrl: string | null | undefined) {
  if (!publicUrl) return;

  if (publicUrl.startsWith(STORAGE_URL_PREFIX)) {
    const key = publicUrl.slice(STORAGE_URL_PREFIX.length);
    await files().delete(key).catch(() => {});
    return;
  }

  if (publicUrl.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", publicUrl);
    await fs.rm(filePath, { force: true }).catch(() => {});
  }
}

/** Resolve a stored product image URL to bytes + mime for serving. */
export async function readStorageImage(
  key: string,
): Promise<{ bytes: Buffer; contentType: string } | null> {
  if (key.length === 0) return null;
  try {
    const file = await files().download(key);
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(key).slice(1).toLowerCase();
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
    return { bytes: buf, contentType };
  } catch {
    return null;
  }
}