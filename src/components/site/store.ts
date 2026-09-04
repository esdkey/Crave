"use client";

import { useMemo } from "react";

type Listener = () => void;

export type CartStore<T> = {
  subscribe: (listener: Listener) => () => void;
  get: () => T;
  set: (next: T) => void;
  update: (fn: (prev: T) => T) => void;
  load: () => void;
};

export function useStore<T>(reader: () => T, storageKey: string): CartStore<T> {
  return useMemo(() => createStore(reader, storageKey), [reader, storageKey]);
}

function createStore<T>(reader: () => T, storageKey: string): CartStore<T> {
  let current: T = reader();
  let hydrated = typeof window === "undefined";
  const listeners = new Set<Listener>();

  function emit() {
    for (const l of listeners) l();
  }

  function persist() {
    if (typeof window === "undefined" || !hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(current));
    } catch {
      // ignore quota / private mode errors
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get() {
      return current;
    },
    load() {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(storageKey);
        current = raw ? (JSON.parse(raw) as T) : (reader() as T);
      } catch {
        current = reader() as T;
      }
      hydrated = true;
      emit();
    },
    set(next) {
      current = next;
      persist();
      emit();
    },
    update(fn) {
      current = fn(current);
      persist();
      emit();
    },
  };
}
