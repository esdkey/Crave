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
  dashboard: string;
};

export function Header({
  dict,
  lang,
}: {
  dict: NavDict;
  lang: Locale;
}) {
  const links = [
    { href: `/${lang}`, label: dict.home },
    { href: `/${lang}/products`, label: dict.products },
    { href: `/${lang}/about`, label: dict.about },
    { href: `/${lang}/story`, label: dict.story },
    { href: `/${lang}/contact`, label: dict.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-burgundy/10 bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <LanguageSwitcher lang={lang} />
        <Logo lang={lang} />
        <Link
          href={`/${lang}/login`}
          className="text-xs font-medium tracking-wide text-burgundy/70 uppercase transition-colors hover:text-burgundy"
        >
          {dict.dashboard}
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="mx-auto hidden max-w-6xl md:block">
        <ul className="flex justify-center gap-8 border-t border-burgundy/10 py-2 text-sm font-medium text-ink">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="transition-colors hover:text-burgundy"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile nav */}
      <MobileNav lang={lang} dict={dict} />
    </header>
  );
}
