"use client";

import { useActionState, useState } from "react";
import { submitOrder, type OrderFormState } from "@/lib/actions/order";

type OrderDict = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  paymentCod: string;
  paymentVodafone: string;
  paymentInstapay: string;
  transferInfo: string;
  transferMethod: string;
  transferMethodValue: string;
  screenshot: string;
  screenshotOptional: string;
  notes: string;
  submit: string;
  success: string;
  error: string;
  requiredFields: string;
  shippingNotice: string;
};

export function OrderForm({
  productId,
  dict,
  payment,
}: {
  productId: string;
  dict: OrderDict;
  payment: { vodafone: string | null; instapay: string | null };
}) {
  const [state, formAction, pending] = useActionState(
    submitOrder,
    undefined as OrderFormState,
  );
  const [method, setMethod] = useState("COD");

  const showVodafone = method === "VODAFONE_CASH" && !!payment.vodafone;
  const showInstapay = method === "INSTAPAY" && !!payment.instapay;
  const showTransfer = showVodafone || showInstapay;

  const transferLabel =
    method === "VODAFONE_CASH" ? dict.paymentVodafone : dict.paymentInstapay;
  const transferValue =
    method === "VODAFONE_CASH" ? payment.vodafone : payment.instapay;

  if (state?.success) {
    return (
      <div className="rounded-lg border border-burgundy/20 bg-burgundy/5 p-6 text-center">
        <p className="text-2xl text-burgundy">✓</p>
        <p className="mt-2 text-ink">{dict.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />

      {state?.message && (
        <p className="rounded-md bg-burgundy/10 px-3 py-2 text-sm text-burgundy">
          {dict.error}
        </p>
      )}

      <Field
        label={dict.name}
        name="customerName"
        error={state?.errors?.customerName}
      />
      <Field
        label={dict.phone}
        name="phone"
        type="tel"
        error={state?.errors?.phone}
      />
      <Field
        label={dict.address}
        name="address"
        error={state?.errors?.address}
      />

      <div>
        <label
          htmlFor="paymentMethod"
          className="mb-1 block text-sm font-medium text-ink"
        >
          {dict.paymentMethod}
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
        >
          <option value="COD">{dict.paymentCod}</option>
          {payment.vodafone && (
            <option value="VODAFONE_CASH">{dict.paymentVodafone}</option>
          )}
          {payment.instapay && (
            <option value="INSTAPAY">{dict.paymentInstapay}</option>
          )}
        </select>
        {state?.errors?.paymentMethod && (
          <p className="mt-1 text-sm text-burgundy">{dict.requiredFields}</p>
        )}
      </div>

      {showTransfer && (
        <div className="rounded-lg border border-burgundy/20 bg-cream px-4 py-3">
          <p className="text-xs text-ink/70">{dict.transferInfo}</p>
          <p className="mt-1 text-sm text-ink">
            {dict.transferMethod} <span className="font-semibold text-burgundy">{transferLabel}</span>
          </p>
          <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-ink">
            {transferValue}
          </p>
          <p className="mt-1 text-xs text-ink/70">{dict.transferMethodValue}</p>
        </div>
      )}

      {showTransfer && (
        <div>
          <label
            htmlFor="screenshot"
            className="mb-1 block text-sm font-medium text-ink"
          >
            {dict.screenshot}
          </label>
          <input
            id="screenshot"
            name="screenshot"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink file:mr-3 file:rounded file:border-0 file:bg-burgundy file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-cream"
          />
          <p className="mt-1 text-xs text-ink/60">{dict.screenshotOptional}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-sm font-medium text-ink"
        >
          {dict.notes}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
        />
      </div>

      <p className="rounded-md bg-cream-dark px-3 py-2 text-xs text-ink/70">
        {dict.shippingNotice}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-burgundy-dark disabled:opacity-60"
      >
        {pending ? "..." : dict.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
      />
      {error && <p className="mt-1 text-sm text-burgundy">{error[0]}</p>}
    </div>
  );
}
