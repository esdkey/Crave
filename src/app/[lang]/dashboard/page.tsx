import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const [productCount, pendingOrders, deliveredOrders, totalRevenue, customerCount, unread] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order
        .findMany({ include: { product: true } })
        .then((orders) =>
          orders
            .filter((o) => o.status !== "CANCELLED")
            .reduce((sum, o) => {
              const eff =
                o.product.salePrice != null &&
                o.product.salePrice < o.product.price
                  ? o.product.salePrice
                  : o.product.price;
              return sum + eff;
            }, 0),
        ),
      prisma.order.groupBy({ by: ["phone"] }).then((r) => r.length),
      prisma.notification.count({ where: { read: false } }),
    ]);

  const stats = [
    {
      label: d.statProducts,
      value: productCount,
      icon: "🧴",
      color: "bg-indigo-100 text-indigo-700",
      href: `/${lang}/dashboard/products`,
    },
    {
      label: d.statPendingOrders,
      value: pendingOrders,
      icon: "⏳",
      color: "bg-amber-100 text-amber-700",
      href: `/${lang}/dashboard/orders`,
    },
    {
      label: d.statDeliveredOrders,
      value: deliveredOrders,
      icon: "✅",
      color: "bg-emerald-100 text-emerald-700",
      href: `/${lang}/dashboard/orders`,
    },
    {
      label: d.statRevenue,
      value: `${totalRevenue} ${dict.common.currency}`,
      icon: "💰",
      color: "bg-green-100 text-green-700",
      href: `/${lang}/dashboard/orders`,
    },
    {
      label: d.statCustomers,
      value: customerCount,
      icon: "👥",
      color: "bg-sky-100 text-sky-700",
      href: `/${lang}/dashboard/customers`,
    },
    {
      label: d.statNewNotifications,
      value: unread,
      icon: "🔔",
      color: "bg-rose-100 text-rose-700",
      href: `/${lang}/dashboard/notifications`,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {d.overviewTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{d.overviewHint}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl ${s.color}`}
            >
              {s.icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-2xl font-extrabold text-slate-900">
                {s.value}
              </span>
              <span className="block text-sm text-slate-500">{s.label}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
