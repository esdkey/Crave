import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary, hasLocale } from "../dictionaries";
import { logout } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

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
    {
      href: `/${lang}/dashboard`,
      label: d.navOverview,
      icon: "📊",
    },
    {
      href: `/${lang}/dashboard/products`,
      label: d.navProducts,
      icon: "🧴",
    },
    {
      href: `/${lang}/dashboard/orders`,
      label: d.navOrders,
      icon: "📦",
    },
    {
      href: `/${lang}/dashboard/customers`,
      label: d.navCustomers,
      icon: "👥",
    },
    {
      href: `/${lang}/dashboard/notifications`,
      label: d.navNotifications,
      icon: "🔔",
    },
    {
      href: `/${lang}/dashboard/settings`,
      label: d.navSettings,
      icon: "⚙️",
    },
  ];

  return (
    <div
      className={`${manrope.variable} font-admin relative min-h-screen bg-[#f5f6fa] text-base text-slate-800`}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-burgundy text-lg font-bold text-cream">
              C
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Crave <span className="text-burgundy">Admin</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block" dir="auto">
              <p className="text-sm font-semibold leading-tight text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <form action={logout}>
              <input type="hidden" name="lang" value={lang} />
              <button
                type="submit"
                className="rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-burgundy-dark"
              >
                {d.logout}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="border-t border-slate-200 lg:hidden">
          <ul className="flex overflow-x-auto">
            {nav.map((n) => (
              <li key={n.href} className="shrink-0">
                <Link
                  href={n.href}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-burgundy"
                >
                  <span>{n.icon}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:w-60 lg:shrink-0">
          <nav className="space-y-1 lg:sticky lg:top-24">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-burgundy hover:shadow-sm"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100">
                  {n.icon}
                </span>
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
