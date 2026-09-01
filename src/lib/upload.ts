import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Persist an uploaded image under public/uploads and return its public URL
 * (e.g. "/uploads/abc123.jpg"). Throws on invalid type or oversize file.
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
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), bytes);

  return `/uploads/${folder}/${name}`;
}

/** Collect every submitted file for a multi-file field name. */
export function getFiles(formData: FormData, field: string): File[] {
  const all = formData.getAll(field) as File[];
  return all.filter((f) => f && f.size > 0);
}

/** Delete an uploaded file by public URL (best-effort, ignores missing). */
export async function deleteUploadedImage(publicUrl: string | null | undefined) {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  await fs.rm(filePath, { force: true }).catch(() => {});
}
