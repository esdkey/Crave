"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { saveUploadedImage, getFiles, deleteUploadedImage } from "@/lib/upload";
import {
  setPaymentSetting,
  PAYMENT_VODAFONE_KEY,
  PAYMENT_INSTAPAY_KEY,
} from "@/lib/payment";

const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export async function updateOrderStatus(formData: FormData) {
  await requireRole(["ADMIN", "SHIPPING"]);
  const id = formData.get("id") as string;
  const status = orderStatusSchema.parse(formData.get("status"));
  if (!id) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/", "layout");
}

const productSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  storyAr: z.string().optional().default(""),
  storyEn: z.string().optional().default(""),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().nonnegative().optional().transform((v) =>
    v != null && v > 0 ? v : undefined,
  ),
  stock: z.coerce.number().int().min(0).default(0),
  category: z.enum(["HIM", "HER", "UNISEX"]).default("UNISEX"),
  isAvailable: z
    .string()
    .optional()
    .transform((v) => v === "on"),
  featured: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

function langOf(formData: FormData) {
  return (formData.get("lang") as string) || "ar";
}

async function productIdOrThrow(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("missing id");
  return id;
}

/** Save newly uploaded product images under public/uploads/products. */
async function uploadNewImages(formData: FormData): Promise<{
  urls: string[];
  error?: string;
}> {
  const files = getFiles(formData, "images");
  const urls: string[] = [];
  for (const file of files) {
    try {
      const url = await saveUploadedImage(file, "products");
      if (url) urls.push(url);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      const error =
        code === "IMAGE_TOO_LARGE"
          ? "formErrorImageTooLarge"
          : code === "UNSUPPORTED_IMAGE_TYPE"
            ? "formErrorUnsupported"
            : "formErrorUpload";
      return { urls, error };
    }
  }
  return { urls };
}

/** Delete existing product image rows (and their files) selected for removal. */
async function removeExistingImages(formData: FormData) {
  const removeIds = formData.getAll("existingRemove") as string[];
  if (removeIds.length === 0) return;
  const images = await prisma.productImage.findMany({
    where: { id: { in: removeIds } },
  });
  await prisma.productImage.deleteMany({ where: { id: { in: removeIds } } });
  for (const img of images) {
    await deleteUploadedImage(img.url);
  }
}

export type ProductFormState = { error?: string } | undefined;

/** True when a Prisma/DriverAdapter error is a unique-constraint violation (e.g. duplicate slug). */
function isUniqueViolation(err: unknown): boolean {
  const msg =
    (err instanceof Error ? err.message : String(err)) +
    " " +
    ((err as { driverAdapterError?: Error })?.driverAdapterError?.message ?? "");
  return (
    /unique/i.test(msg) &&
    (/constraint/i.test(msg) || /UniqueConstraint|already exists/i.test(msg))
  );
}

/** Best-effort delete of uploaded files when the product save failed. */
async function cleanupNewImages(urls: string[]) {
  for (const url of urls) {
    await deleteUploadedImage(url);
  }
}

export async function createProduct(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireRole(["ADMIN"]);
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.error("createProduct validation", parsed.error.flatten());
    return { error: "formInvalidFields" };
  }
  const data = parsed.data;

  const { urls: imageUrls, error: uploadError } = await uploadNewImages(formData);
  if (uploadError) return { error: uploadError };

  try {
    const product = await prisma.product.create({
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        slug: data.slug,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        storyAr: data.storyAr || undefined,
        storyEn: data.storyEn || undefined,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock,
        isAvailable: data.isAvailable,
        featured: data.featured,
        category: data.category,
      },
    });

    if (imageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          productId: product.id,
          url,
          position: i,
        })),
      });
    }
  } catch (err) {
    await cleanupNewImages(imageUrls);
    console.error("createProduct", err);
    if (isUniqueViolation(err)) return { error: "formErrorSlugExists" };
    return { error: "formErrorSave" };
  }

  revalidatePath("/", "layout");
  return {};
}

export async function updateProduct(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireRole(["ADMIN"]);
  const id = await productIdOrThrow(formData);
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.error("updateProduct validation", parsed.error.flatten());
    return { error: "formInvalidFields" };
  }
  const data = parsed.data;

  await removeExistingImages(formData);
  const { urls: imageUrls, error: uploadError } = await uploadNewImages(formData);
  if (uploadError) return { error: uploadError };

  try {
    await prisma.product.update({
      where: { id },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        slug: data.slug,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        storyAr: data.storyAr || undefined,
        storyEn: data.storyEn || undefined,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock,
        isAvailable: data.isAvailable,
        featured: data.featured,
        category: data.category,
      },
    });

    if (imageUrls.length > 0) {
      const maxPos = await prisma.productImage.aggregate({
        where: { productId: id },
        _max: { position: true },
      });
      const start = (maxPos._max.position ?? -1) + 1;
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          productId: id,
          url,
          position: start + i,
        })),
      });
    }
  } catch (err) {
    await cleanupNewImages(imageUrls);
    console.error("updateProduct", err);
    if (isUniqueViolation(err)) return { error: "formErrorSlugExists" };
    return { error: "formErrorSave" };
  }

  revalidatePath("/", "layout");
  return {};
}

export async function deleteProduct(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = await productIdOrThrow(formData);
  const images = await prisma.productImage.findMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  for (const img of images) {
    await deleteUploadedImage(img.url);
  }
  revalidatePath("/", "layout");
  redirect(`/${langOf(formData)}/dashboard/products`);
}

export async function markNotificationRead(formData: FormData) {
  await requireRole(["ADMIN", "SHIPPING"]);
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.notification.update({ where: { id }, data: { read: true } });
  revalidatePath("/", "layout");
}

export async function markAllNotificationsRead() {
  await requireRole(["ADMIN", "SHIPPING"]);
  await prisma.notification.updateMany({ data: { read: true } });
  revalidatePath("/", "layout");
}

export async function deleteNotification(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.notification.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export type SettingsState = { saved?: boolean } | undefined;

export async function saveSettings(
  _state: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireRole(["ADMIN"]);
  const vodafone = (formData.get("vodafoneNumber") as string) ?? "";
  const instapay = (formData.get("instapayNumber") as string) ?? "";
  await setPaymentSetting(PAYMENT_VODAFONE_KEY, vodafone);
  await setPaymentSetting(PAYMENT_INSTAPAY_KEY, instapay);
  revalidatePath("/", "layout");
  return { saved: true };
}
