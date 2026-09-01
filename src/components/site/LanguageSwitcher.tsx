"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const target: Locale = lang === "ar" ? "en" : "ar";

  // Strip the leading /<lang> and rebuild the path for the other locale.
  const rest = pathname.replace(
    new RegExp(`^/${lang}(?=/|$)`),
    "",
  ) || "/";
  const href = `/${target}${rest}`;

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-burgundy/30 px-3 py-1.5 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <span className="text-xs">{lang === "ar" ? "EN" : "عربي"}</span>
    </Link>
  );
}