import "server-only";
import { lang } from "next/root-params";

const dictionaries = {
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
} as const;

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export type Dictionary = (typeof dictionaries)[Locale] extends () => Promise<
  infer T
>
  ? T
  : never;

export async function getDictionary(forceLocale?: Locale): Promise<Dictionary> {
  if (forceLocale) {
    return dictionaries[forceLocale]();
  }
  const locale = await lang();
  if (!hasLocale(locale)) {
    // fallback to default
    return dictionaries.ar();
  }
  return dictionaries[locale]();
}
