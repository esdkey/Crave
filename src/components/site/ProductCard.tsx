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
  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-burgundy/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-serif text-3xl tracking-[0.3em] text-burgundy/40">
              CRAVE
            </span>
          </div>
        )}
        <span
          className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} rounded-full px-3 py-1 text-xs font-medium ${
            product.isAvailable
              ? "bg-burgundy/90 text-cream"
              : "bg-ink/70 text-cream"
          }`}
        >
          {product.isAvailable ? dict.inStock : dict.outOfStock}
        </span>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-serif text-lg text-ink">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          {product.salePrice != null && product.salePrice < product.price && (
            <span className="text-sm text-ink/40 line-through">
              {product.price} {dict.currency}
            </span>
          )}
          <p className="text-sm font-semibold text-burgundy">
            {product.salePrice != null && product.salePrice < product.price
              ? product.salePrice
              : product.price}{" "}
            {dict.currency}
          </p>
        </div>
      </div>
    </Link>
  );
}
