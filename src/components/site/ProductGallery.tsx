"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [null];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-burgundy/10 bg-cream">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-serif text-4xl tracking-[0.3em] text-burgundy/40">
              CRAVE
            </span>
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-cream transition-colors ${
                i === active
                  ? "border-burgundy"
                  : "border-transparent hover:border-burgundy/40"
              }`}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <span className="grid h-full place-items-center text-[10px] text-burgundy/40">
                  CRAVE
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
