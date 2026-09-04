"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useStore } from "./store";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string | null;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY: CartItem[] = [];
const STORAGE_KEY = "crave-cart";

function unitPrice(item: CartItem): number {
  return item.salePrice != null && item.salePrice < item.price
    ? item.salePrice
    : item.price;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useStore<CartItem[]>(() => EMPTY, STORAGE_KEY);

  const items = useSyncExternalStore(store.subscribe, store.get, () => EMPTY);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    store.load();
  }, [store]);

  const add = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      store.update((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [...prev, { ...item, qty }];
      });
      setOpen(true);
    },
    [store],
  );

  const remove = useCallback(
    (id: string) => {
      store.update((prev) => prev.filter((i) => i.id !== id));
    },
    [store],
  );

  const updateQty = useCallback(
    (id: string, qty: number) => {
      store.update((prev) =>
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
      );
    },
    [store],
  );

  const clear = useCallback(() => store.set(EMPTY), [store]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + unitPrice(i) * i.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      open,
      setOpen,
      searchOpen,
      setSearchOpen,
      add,
      remove,
      updateQty,
      clear,
    }),
    [items, count, subtotal, open, setOpen, searchOpen, setSearchOpen, add, remove, updateQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
