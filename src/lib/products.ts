import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Product, ProductImage } from "@/generated/prisma/client";

const withImages = {
  images: { orderBy: { position: "asc" } },
} as const;

export type ProductWithImages = Product & { images: ProductImage[] };

export const getProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "asc" },
    include: withImages,
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isAvailable: true, featured: true },
    orderBy: { createdAt: "asc" },
    take: 4,
    include: withImages,
  });
});

export const getProductsByCategory = cache(
  async (category: "HIM" | "HER" | "UNISEX") => {
    return prisma.product.findMany({
      where: { isAvailable: true, category },
      orderBy: { createdAt: "asc" },
      take: 4,
      include: withImages,
    });
  },
);

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: withImages,
  });
});

export const getOtherProducts = cache(async (excludeId: string) => {
  return prisma.product.findMany({
    where: { isAvailable: true, id: { not: excludeId } },
    orderBy: { createdAt: "asc" },
    take: 3,
    include: withImages,
  });
});

// First (lowest position) image is the cover/primary.
export function primaryImage(p: ProductWithImages): string | null {
  return p.images[0]?.url ?? null;
}

export function localizedProduct<T extends ProductWithImages>(
  p: T,
  lang: Locale,
): T & {
  name: string;
  description: string;
  story: string;
  primaryImage: string | null;
} {
  return {
    ...p,
    name:
      lang === "ar"
        ? (p.nameAr as string)
        : (p.nameEn as string),
    description:
      lang === "ar"
        ? (p.descriptionAr as string)
        : (p.descriptionEn as string),
    story: lang === "ar" ? (p.storyAr as string) : (p.storyEn as string),
    primaryImage: primaryImage(p),
  };
}
