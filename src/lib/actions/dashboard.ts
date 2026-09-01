"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

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
  imageUrl: z.string().optional().default(""),
  stock: z.coerce.number().int().min(0).default(0),
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

export async function createProduct(formData: FormData) {
  await requireRole(["ADMIN"]);
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.error("createProduct validation", parsed.error.flatten());
    return;
  }
  const data = parsed.data;
  await prisma.product.create({
    data: {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      slug: data.slug,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      storyAr: data.storyAr || undefined,
      storyEn: data.storyEn || undefined,
      price: data.price,
      imageUrl: data.imageUrl || null,
      stock: data.stock,
      isAvailable: data.isAvailable,
      featured: data.featured,
    },
  });
  revalidatePath("/", "layout");
  redirect(`/${langOf(formData)}/dashboard/products`);
}

export async function updateProduct(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = await productIdOrThrow(formData);
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.error("updateProduct validation", parsed.error.flatten());
    return;
  }
  const data = parsed.data;
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
      imageUrl: data.imageUrl || null,
      stock: data.stock,
      isAvailable: data.isAvailable,
      featured: data.featured,
    },
  });
  revalidatePath("/", "layout");
  redirect(`/${langOf(formData)}/dashboard/products`);
}

export async function deleteProduct(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = await productIdOrThrow(formData);
  await prisma.product.delete({ where: { id } });
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
