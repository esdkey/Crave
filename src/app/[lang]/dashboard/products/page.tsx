import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardProductsPage({
  params,
}: PageProps<"/[lang]/dashboard/products">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">{d.productsTitle}</h1>
        <Link
          href={`/${lang}/dashboard/products/new`}
          className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-burgundy-dark"
        >
          {d.addProduct}
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-burgundy/10 bg-white">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-ink/60">{d.productsEmpty}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-burgundy/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">{d.colName}</th>
                <th className="px-4 py-3">{d.colPrice}</th>
                <th className="px-4 py-3">{d.colStock}</th>
                <th className="px-4 py-3">{d.colStatus}</th>
                <th className="px-4 py-3">{d.colOrders}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-burgundy/5">
                  <td className="px-4 py-3 font-medium text-ink">
                    {p.nameAr} <span className="text-ink/40">/ {p.nameEn}</span>
                  </td>
                  <td className="px-4 py-3 text-burgundy">
                    {p.price} {dict.common.currency}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-ink/10 text-ink/60"
                      }`}
                    >
                      {p.isAvailable ? d.available : d.unavailable}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p._count.orders}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/${lang}/dashboard/products/${p.id}`}
                      className="text-sm text-burgundy hover:underline"
                    >
                      {dict.common.edit}
                    </Link>
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
