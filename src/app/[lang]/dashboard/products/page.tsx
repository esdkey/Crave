import Link from "next/link";
import Image from "next/image";
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
    include: {
      images: { orderBy: { position: "asc" } },
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {d.productsTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{d.productsCount}</p>
        </div>
        <Link
          href={`/${lang}/dashboard/products/new`}
          className="rounded-xl bg-burgundy px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-burgundy-dark"
        >
          + {d.addProduct}
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg text-slate-500">{d.productsEmpty}</p>
            <Link
              href={`/${lang}/dashboard/products/new`}
              className="mt-3 inline-block text-sm font-semibold text-burgundy hover:underline"
            >
              {d.addProduct}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-base">
              <thead className="border-b border-slate-200 bg-slate-50 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">{d.colProduct}</th>
                  <th className="px-5 py-3">{d.colPrice}</th>
                  <th className="px-5 py-3">{d.colStock}</th>
                  <th className="px-5 py-3">{d.colStatus}</th>
                  <th className="px-5 py-3">{d.colOrders}</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {p.images[0]?.url ? (
                            <Image
                              src={p.images[0].url}
                              alt={p.nameAr}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-xs text-slate-400">
                              🧴
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {p.nameAr}
                          </p>
                          <p className="truncate text-sm text-slate-500">
                            {p.nameEn}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-burgundy">
                      {p.salePrice != null && p.salePrice < p.price ? (
                        <span>
                          <span className="mr-2 text-xs text-slate-400 line-through">
                            {p.price}
                          </span>
                          {p.salePrice} {dict.common.currency}
                        </span>
                      ) : (
                        <>
                          {p.price} {dict.common.currency}
                        </>
                      )}
                    </td>
                    <td className="px-5 py-3">{p.stock}</td>
                    <td className="px-5 py-3">
                      {p.isAvailable ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {d.available}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                          {d.unavailable}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">{p._count.orders}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/${lang}/dashboard/products/${p.id}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-burgundy hover:bg-burgundy/10"
                      >
                        {dict.common.edit} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
