"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

type NavDict = {
  home: string;
  products: string;
  about: string;
  story: string;
  contact: string;
};

export function MobileNav({
  lang,
  dict,
}: {
  lang: Locale;
  dict: NavDict;
}) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: `/${lang}`, label: dict.home },
    { href: `/${lang}/products`, label: dict.products },
    { href: `/${lang}/about`, label: dict.about },
    { href: `/${lang}/story`, label: dict.story },
    { href: `/${lang}/contact`, label: dict.contact },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 border-t border-burgundy/10 py-2 text-sm font-medium text-burgundy"
      >
        <span>{open ? "✕" : "☰"}</span>
      </button>
      {open && (
        <ul className="border-t border-burgundy/10 bg-cream px-4 py-2 text-center">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-ink hover:text-burgundy"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
