import { prisma } from "@/lib/prisma";
import {
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "@/lib/actions/dashboard";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardNotificationsPage({
  params,
}: PageProps<"/[lang]/dashboard/notifications">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">{d.notificationsTitle}</h1>
        {notifications.length > 0 && (
          <form action={markAllNotificationsRead}>
            <button
              type="submit"
              className="rounded-full border border-burgundy/30 px-4 py-2 text-sm text-burgundy hover:bg-burgundy hover:text-cream"
            >
              {d.markAllRead}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {notifications.length === 0 ? (
          <p className="rounded-lg border border-burgundy/10 bg-white p-6 text-sm text-ink/60">
            {d.notificationsEmpty}
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-4 rounded-lg border p-4 ${
                n.read
                  ? "border-burgundy/5 bg-white"
                  : "border-burgundy/20 bg-burgundy/5"
              }`}
            >
              <div>
                {!n.read && (
                  <span className="mb-1 inline-block rounded-full bg-burgundy px-2 py-0.5 text-[10px] font-medium uppercase text-cream">
                    New
                  </span>
                )}
                <p className="text-sm text-ink">{n.message}</p>
                <p className="mt-1 text-xs text-ink/50">
                  {new Date(n.createdAt).toLocaleString(
                    lang === "ar" ? "ar-EG" : "en-US",
                  )}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!n.read && (
                  <form action={markNotificationRead}>
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-burgundy/30 px-3 py-1 text-xs text-burgundy hover:bg-burgundy hover:text-cream"
                    >
                      {d.markRead}
                    </button>
                  </form>
                )}
                <form action={deleteNotification}>
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className="rounded-full px-3 py-1 text-xs text-ink/60 hover:bg-ink/10 hover:text-ink"
                  >
                    {d.deleteNote}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
