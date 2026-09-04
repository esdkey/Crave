"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import type { Locale } from "@/app/[lang]/dictionaries";

const iconClass =
  "flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-burgundy/10 hover:text-burgundy";

export function HeaderActions({ lang }: { lang: Locale }) {
  const { count, setOpen, setSearchOpen } = useCart();

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
        className={iconClass}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {/* Account */}
      <Link
        href={`/${lang}/login`}
        aria-label="Account"
        className={iconClass}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>

      {/* Cart */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Cart"
        className={`${iconClass} relative`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-cream">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
