import { OrderStatusSelect } from "@/components/dashboard/OrderStatusSelect";
import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardOrdersPage({
  params,
}: PageProps<"/[lang]/dashboard/orders">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const labels = {
    PENDING: d.statusPending,
    CONFIRMED: d.statusConfirmed,
    PROCESSING: d.statusProcessing,
    SHIPPED: d.statusShipped,
    DELIVERED: d.statusDelivered,
    CANCELLED: d.statusCancelled,
  };

  const paymentLabels: Record<string, string> = {
    COD: d.paymentCod,
    VODAFONE_CASH: d.paymentVodafone,
    INSTAPAY: d.paymentInstapay,
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{d.ordersTitle}</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <p className="rounded-lg border border-burgundy/10 bg-white p-6 text-sm text-ink/60">
            {d.ordersEmpty}
          </p>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="rounded-lg border border-burgundy/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink/50">
                    {d.orderId} #{o.id.slice(0, 8)}
                  </p>
                  <p className="mt-1 font-medium text-ink">{o.customerName}</p>
                  <p className="text-sm text-ink/70">{o.phone}</p>
                </div>
                <div className="text-right text-xs text-ink/50">
                  {new Date(o.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-ink/50">{d.orderProduct}: </span>
                  <span className="text-ink">
                    {o.product.nameAr} / {o.product.nameEn}
                  </span>
                </div>
                <div>
                  <span className="text-ink/50">{d.orderAddress}: </span>
                  <span className="text-ink">{o.address}</span>
                </div>
                <div>
                  <span className="text-ink/50">{d.orderPayment}: </span>
                  <span className="text-ink">
                    {paymentLabels[o.paymentMethod] ?? o.paymentMethod} —{" "}
                    {o.product.price} {dict.common.currency}
                  </span>
                </div>
                {o.notes && (
                  <div>
                    <span className="text-ink/50">{d.orderNotes}: </span>
                    <span className="text-ink">{o.notes}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-burgundy/5 pt-3">
                <OrderStatusSelect
                  orderId={o.id}
                  current={o.status}
                  labels={labels}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
