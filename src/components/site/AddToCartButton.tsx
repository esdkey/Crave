"use client";

import { useCart } from "./cart-context";

export function AddToCartButton({
  product,
  label,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    salePrice: number | null;
    image: string | null;
  };
  label: string;
}) {
  const { add } = useCart();

  return (
    <button
      type="button"
      onClick={() =>
        add({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
        })
      }
      className="w-full rounded-full border border-burgundy/30 px-6 py-3 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
    >
      {label}
    </button>
  );
}
