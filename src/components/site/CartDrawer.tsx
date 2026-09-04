"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-context";
import type { Locale } from "@/app/[lang]/dictionaries";

type CartDict = {
  title: string;
  empty: string;
  emptyMessage: string;
  continueShopping: string;
  total: string;
  items: string;
  item: string;
  remove: string;
  orderNow: string;
  subtotal: string;
};

export function CartDrawer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: CartDict;
}) {
  const { items, subtotal, open, setOpen, updateQty, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dict.title}
        className="fixed top-0 z-50 flex h-full w-full max-w-sm flex-col bg-cream shadow-card transition-[transform] duration-300 ease-out"
        style={{
          [lang === "ar" ? "left" : "right"]: 0,
          transform: open
            ? "translateX(0)"
            : lang === "ar"
              ? "translateX(-100%)"
              : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-burgundy/10 px-5 py-4">
          <h2 className="font-serif text-xl text-ink">{dict.title}</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label={dict.title}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-burgundy/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-burgundy/40">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <p className="font-serif text-2xl text-ink">{dict.empty}</p>
            <p className="text-sm text-ink/60">{dict.emptyMessage}</p>
            <Link
              href={`/${lang}/login`}
              className="text-sm font-medium text-burgundy underline-offset-4 hover:underline"
            >
              {dict.emptyMessage}
            </Link>
          </div>
        ) : (
          /* Items list */
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-3 text-xs text-ink/50">
              {count} {count === 1 ? dict.item : dict.items}
            </div>
            <ul className="space-y-4">
              {items.map((item) => {
                const price =
                  item.salePrice != null && item.salePrice < item.price
                    ? item.salePrice
                    : item.price;
                return (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-burgundy/10 bg-white p-3"
                  >
                    <Link
                      href={`/${lang}/products/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-serif text-xs text-burgundy/40">
                          CRAVE
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/${lang}/products/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-serif text-base leading-snug text-ink hover:text-burgundy"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-burgundy">
                          {price} {lang === "ar" ? "ج.م" : "EGP"}
                        </span>
                        {item.salePrice != null && item.salePrice < item.price && (
                          <span className="text-xs text-ink/40 line-through">
                            {item.price}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-burgundy/15 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="text-xs text-ink/50 hover:text-burgundy"
                            aria-label={dict.remove}
                          >
                            −
                          </button>
                          <span className="min-w-7 text-center text-sm text-ink">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="text-xs text-ink/50 hover:text-burgundy"
                            aria-label="+"
                          >
                            +
                          </button>
                        </div>
                        <Link
                          href={`/${lang}/products/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="rounded-full bg-burgundy px-3 py-1 text-xs font-medium text-cream transition-colors hover:bg-burgundy-dark"
                        >
                          {dict.orderNow}
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Footer: total + continue shopping */}
        {items.length > 0 && (
          <div className="border-t border-burgundy/10 px-5 py-4">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm text-ink/60">{dict.total}</span>
              <span className="font-serif text-2xl text-burgundy">
                {subtotal} {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>
            <Link
              href={`/${lang}/products`}
              onClick={() => setOpen(false)}
              className="block w-full rounded-full border border-burgundy/30 px-6 py-3 text-center text-sm font-medium text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
            >
              {dict.continueShopping}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
