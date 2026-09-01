"use client";

import { deleteProduct } from "@/lib/actions/dashboard";
import { useRef } from "react";

export function ConfirmDelete({
  productId,
  lang,
  label,
  confirmLabel,
  cancelLabel,
  deleteLabel,
}: {
  productId: string;
  lang: string;
  label: string;
  confirmLabel: string;
  cancelLabel: string;
  deleteLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-full border border-burgundy/30 px-5 py-2.5 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
      >
        {label}
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto rounded-lg border border-burgundy/15 bg-white p-6 shadow-lg backdrop:bg-black/40"
      >
        <p className="text-ink">{confirmLabel}</p>
        <form action={deleteProduct} className="mt-4 flex justify-end gap-2">
          <input type="hidden" name="id" value={productId} />
          <input type="hidden" name="lang" value={lang} />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-full px-4 py-2 text-sm text-ink/70 hover:bg-ink/10"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="rounded-full bg-burgundy px-4 py-2 text-sm font-medium text-cream"
          >
            {deleteLabel}
          </button>
        </form>
      </dialog>
    </>
  );
}
