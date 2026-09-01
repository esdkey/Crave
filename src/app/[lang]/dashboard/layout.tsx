import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary, hasLocale } from "../dictionaries";
import { logout } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/login`);

  const dict = await getDictionary();
  const d = dict.dashboard;

  const nav = [
    { href: `/${lang}/dashboard`, label: d.navOverview },
    { href: `/${lang}/dashboard/products`, label: d.navProducts },
    { href: `/${lang}/dashboard/orders`, label: d.navOrders },
    { href: `/${lang}/dashboard/customers`, label: d.navCustomers },
    { href: `/${lang}/dashboard/notifications`, label: d.navNotifications },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:px-6">
      {/* Sidebar */}
      <aside className="md:w-56 md:shrink-0">
        <div className="rounded-xl border border-burgundy/15 bg-white p-4 md:sticky md:top-24">
          <div className="mb-3 border-b border-burgundy/10 pb-3">
            <p className="truncate text-sm font-semibold text-ink">
              {user.name}
            </p>
            <p className="text-xs text-ink/50">{user.email}</p>
          </div>
          <nav>
            <ul className="space-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="block rounded-md px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-burgundy/10 hover:text-burgundy"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <form action={logout}>
                  <input type="hidden" name="lang" value={lang} />
                  <button
                    type="submit"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-burgundy transition-colors hover:bg-burgundy/10"
                  >
                    {d.logout}
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
