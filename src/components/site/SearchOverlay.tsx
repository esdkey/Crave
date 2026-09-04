"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

export type SearchableProduct = {
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string | null;
};

type SearchDict = {
  placeholder: string;
  noResults: string;
  results: string;
  viewAll: string;
};

export function SearchOverlay({
  open,
  onClose,
  lang,
  dict,
  products,
}: {
  open: boolean;
  onClose: () => void;
  lang: Locale;
  dict: SearchDict;
  products: SearchableProduct[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, products]);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-x-0 top-0 mx-auto max-w-2xl px-4 pt-20 md:pt-28">
        <div className="overflow-hidden rounded-3xl border border-burgundy/10 bg-cream shadow-card">
          {/* Input row */}
          <div className="flex items-center gap-3 border-b border-burgundy/10 px-5 py-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink/40" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.placeholder}
              className="w-full bg-transparent text-lg text-ink placeholder:text-ink/35 focus:outline-none"
              aria-label={dict.placeholder}
            />
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-burgundy/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-ink/50">
                  {dict.noResults}
                </p>
              ) : (
                <ul>
                  {results.map((p) => {
                    const price =
                      p.salePrice != null && p.salePrice < p.price
                        ? p.salePrice
                        : p.price;
                    return (
                      <li key={p.slug}>
                        <Link
                          href={`/${lang}/products/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-burgundy/5"
                        >
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center font-serif text-xs text-burgundy/40">
                                CRAVE
                              </span>
                            )}
                          </span>
                          <span className="flex-1 font-serif text-lg leading-snug text-ink">
                            {p.name}
                          </span>
                          <span className="text-sm font-semibold text-burgundy">
                            {price} {lang === "ar" ? "ج.م" : "EGP"}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* View all */}
              <div className="p-2">
                <Link
                  href={`/${lang}/products`}
                  onClick={onClose}
                  className="block rounded-2xl bg-cream-dark px-4 py-3 text-center text-sm font-medium text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
                >
                  {dict.viewAll}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
