import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

type CardProduct = {
  slug: string;
  name: string;
  isAvailable: boolean;
  price: number;
  salePrice: number | null;
  primaryImage: string | null;
};

type CardDict = {
  inStock: string;
  outOfStock: string;
  currency: string;
};

export function ProductCard({
  product,
  lang,
  dict,
}: {
  product: CardProduct;
  lang: Locale;
  dict: CardDict;
}) {
  const onSale =
    product.salePrice != null && product.salePrice < product.price;

  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-soft shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-serif text-3xl tracking-[0.3em] text-burgundy/40">
              CRAVE
            </span>
          </div>
        )}

        {/* Sale badge */}
        {onSale && (
          <span
            className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} rounded-full bg-gold px-3 py-1 text-xs font-semibold text-cream`}
          >
            {Math.round((1 - product.salePrice! / product.price) * 100)}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-5">
        <h3 className="font-serif text-xl leading-snug text-ink">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          {onSale && (
            <span className="text-sm text-ink/40 line-through">
              {product.price} {dict.currency}
            </span>
          )}
          <p className="text-base font-semibold text-burgundy">
            {onSale ? product.salePrice : product.price} {dict.currency}
          </p>
        </div>
      </div>

      {/* Hover quick-order button */}
      <div
        className={`absolute right-4 top-4 translate-y-0 rounded-full shadow-soft transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 ${
          lang === "ar" ? "left-4" : "right-4"
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-cream shadow-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
