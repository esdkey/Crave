import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { HeaderActions } from "./HeaderActions";
import type { Locale } from "@/app/[lang]/dictionaries";
import Link from "next/link";

type NavDict = {
  home: string;
  products: string;
  about: string;
  story: string;
  contact: string;
};

type Categories = {
  him: string;
  her: string;
  unisex: string;
  himSubtitle: string;
  herSubtitle: string;
  unisexSubtitle: string;
};

type Announcement = {
  text: string;
  href: string;
};

export function Header({
  nav,
  categories,
  lang,
  announcement,
}: {
  nav: NavDict;
  categories: Categories;
  lang: Locale;
  announcement?: Announcement;
}) {
  const shopLinks = [
    { href: `/${lang}/products?cat=HIM`, label: categories.him },
    { href: `/${lang}/products?cat=HER`, label: categories.her },
    { href: `/${lang}/products?cat=UNISEX`, label: categories.unisex },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar — static, dark, clickable */}
      {announcement && (
        <Link
          href={`/${lang}${announcement.href}`}
          className="block bg-burgundy-dark text-center text-xs font-medium uppercase tracking-wide text-cream transition-colors hover:bg-burgundy"
        >
          <span className="mx-auto inline-block max-w-full truncate px-4 py-2">
            <span className="mr-1 inline-block text-gold" aria-hidden>✦</span>
            {announcement.text}
          </span>
        </Link>
      )}

      {/* Main bar — 3 zones: nav | logo | icons */}
      <div className="border-b border-burgundy/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-3 px-4 py-3 md:px-6">
          {/* Left zone — nav links */}
          <nav className="flex items-center justify-start gap-6 text-sm font-medium text-ink">
            <Link href={`/${lang}`} className="nav-link transition-colors hover:text-burgundy hidden sm:inline">
              {nav.home}
            </Link>

            {/* Shop dropdown */}
            <div className="group relative hidden sm:block">
              <Link href={`/${lang}/products`} className="nav-link transition-colors hover:text-burgundy">
                {nav.products}
              </Link>
              <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="min-w-44 rounded-2xl border border-burgundy/10 bg-cream p-2 shadow-card">
                  {shopLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-xl px-3 py-2 text-sm text-ink transition-colors hover:bg-burgundy/10 hover:text-burgundy"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href={`/${lang}/about`} className="nav-link transition-colors hover:text-burgundy hidden lg:inline">
              {nav.about}
            </Link>
            <Link href={`/${lang}/contact`} className="nav-link transition-colors hover:text-burgundy hidden xl:inline">
              {nav.contact}
            </Link>
          </nav>

          {/* Center zone — logo */}
          <div className="flex justify-center">
            <Logo lang={lang} />
          </div>

          {/* Right zone — icons */}
          <div className="flex items-center justify-end gap-2">
            <HeaderActions lang={lang} />
            <LanguageSwitcher lang={lang} />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <MobileNav lang={lang} dict={nav} />
    </header>
  );
}
