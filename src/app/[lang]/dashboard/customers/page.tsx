import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardCustomersPage({
  params,
}: PageProps<"/[lang]/dashboard/customers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const byPhone = new Map<string, {
    name: string;
    phone: string;
    count: number;
    total: number;
  }>();

  for (const o of orders) {
    const cur = byPhone.get(o.phone) || {
      name: o.customerName,
      phone: o.phone,
      count: 0,
      total: 0,
    };
    cur.count += 1;
    cur.total += o.product.price;
    byPhone.set(o.phone, cur);
  }

  const customers = Array.from(byPhone.values()).sort(
    (a, b) => b.total - a.total,
  );

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{d.customersTitle}</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-burgundy/10 bg-white">
        {customers.length === 0 ? (
          <p className="p-6 text-sm text-ink/60">{d.customersEmpty}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-burgundy/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">{d.orderCustomer}</th>
                <th className="px-4 py-3">{d.orderPhone}</th>
                <th className="px-4 py-3">{d.orderCount}</th>
                <th className="px-4 py-3">{d.totalSpent}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy/5">
              {customers.map((c) => (
                <tr key={c.phone} className="hover:bg-burgundy/5">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3">{c.count}</td>
                  <td className="px-4 py-3 text-burgundy">
                    {c.total} {dict.common.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
