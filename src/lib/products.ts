import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Product } from "@/generated/prisma/client";

export const getProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "asc" },
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isAvailable: true, featured: true },
    orderBy: { createdAt: "asc" },
    take: 4,
  });
});

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
  });
});

export const getOtherProducts = cache(async (excludeId: string) => {
  return prisma.product.findMany({
    where: { isAvailable: true, id: { not: excludeId } },
    orderBy: { createdAt: "asc" },
    take: 3,
  });
});

// Localized field picker
export function productField(p: Product, lang: Locale, field: string) {
  // returns localized name/desc/story based on lang
  return p[`${field}${lang === "ar" ? "Ar" : "En"}` as keyof Product] as string;
}

export function localizedProduct<T extends Product>(
  p: T,
  lang: Locale,
): T & {
  name: string;
  description: string;
  story: string;
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
  };
}
