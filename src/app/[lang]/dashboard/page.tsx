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

  const [productCount, pendingOrders, deliveredOrders, customerCount, unread] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.groupBy({ by: ["phone"] }).then((r) => r.length),
      prisma.notification.count({ where: { read: false } }),
    ]);

  const stats = [
    { label: d.statProducts, value: productCount, href: `/${lang}/dashboard/products` },
    { label: d.statPendingOrders, value: pendingOrders, href: `/${lang}/dashboard/orders` },
    { label: d.statDeliveredOrders, value: deliveredOrders, href: `/${lang}/dashboard/orders` },
    { label: d.statCustomers, value: customerCount, href: `/${lang}/dashboard/customers` },
    { label: d.statNewNotifications, value: unread, href: `/${lang}/dashboard/notifications` },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{d.overviewTitle}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-burgundy/15 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="font-serif text-4xl text-burgundy">{s.value}</p>
            <p className="mt-1 text-sm text-ink/70">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-burgundy/10 bg-white p-6">
        <p className="text-sm text-ink/70">{d.overviewHint}</p>
      </div>
    </div>
  );
}
