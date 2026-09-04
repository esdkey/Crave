"use client";

import { useCart } from "./cart-context";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay, type SearchableProduct } from "./SearchOverlay";
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

type SearchDict = {
  placeholder: string;
  noResults: string;
  results: string;
  viewAll: string;
};

export function CartHost({
  lang,
  cartDict,
  searchDict,
  products,
}: {
  lang: Locale;
  cartDict: CartDict;
  searchDict: SearchDict;
  products: SearchableProduct[];
}) {
  const { searchOpen, setSearchOpen } = useCart();

  return (
    <>
      <CartDrawer lang={lang} dict={cartDict} />
      <SearchOverlay
        key={searchOpen ? "open" : "closed"}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        lang={lang}
        dict={searchDict}
        products={products}
      />
    </>
  );
}
