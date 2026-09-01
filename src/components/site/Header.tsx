import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import type { Locale } from "@/app/[lang]/dictionaries";
import Link from "next/link";

type NavDict = {
  home: string;
  products: string;
  about: string;
  story: string;
  contact: string;
};

export function Header({
  dict,
  lang,
  marquee,
}: {
  dict: NavDict;
  lang: Locale;
  marquee?: string[];
}) {
  const links = [
    { href: `/${lang}`, label: dict.home },
    { href: `/${lang}/products`, label: dict.products },
    { href: `/${lang}/about`, label: dict.about },
    { href: `/${lang}/story`, label: dict.story },
    { href: `/${lang}/contact`, label: dict.contact },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement marquee */}
      {marquee && marquee.length > 0 && (
        <div className="overflow-hidden bg-burgundy text-cream">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {marquee.map((item) => (
                  <span
                    key={dup + item}
                    className="inline-flex items-center gap-6 px-4 py-2 text-xs font-medium uppercase tracking-wide"
                  >
                    {item}
                    <span className="text-gold" aria-hidden>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main bar */}
      <div className="border-b border-burgundy/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex flex-1 items-center gap-3 md:hidden">
            <span className="w-6" aria-hidden />
          </div>

          <Logo lang={lang} />

          {/* Desktop nav */}
          <nav className="hidden flex-1 md:block">
            <ul className="flex items-center justify-center gap-8 text-sm font-medium text-ink">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="nav-link transition-colors hover:text-burgundy">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Link
              href={`/${lang}/products`}
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-burgundy/10 hover:text-burgundy sm:inline-flex"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>
            <LanguageSwitcher lang={lang} />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <MobileNav lang={lang} dict={dict} />
    </header>
  );
}
