"use client";

import { updateOrderStatus } from "@/lib/actions/dashboard";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type StatusLabels = Record<(typeof statuses)[number], string>;

export function OrderStatusSelect({
  orderId,
  current,
  labels,
}: {
  orderId: string;
  current: string;
  labels: StatusLabels;
}) {
  return (
    <form action={updateOrderStatus} className="flex items-center gap-2">
      <input type="hidden" name="id" value={orderId} />
      <select
        name="status"
        defaultValue={current}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="rounded-md border border-ink/20 bg-white px-2 py-1.5 text-sm text-ink focus:border-burgundy focus:outline-none"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {labels[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
