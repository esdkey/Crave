import { Logo } from "./Logo";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

type FooterDict = {
  tagline: string;
  rights: string;
  follow: string;
  support: string;
  shipping: string;
  returns: string;
  faq: string;
};

type FooterNav = {
  home: string;
  products: string;
  about: string;
  story: string;
  contact: string;
};

export function Footer({
  dict,
  lang,
  nav,
}: {
  dict: FooterDict;
  lang: Locale;
  nav?: FooterNav;
}) {
  const now = new Date().getFullYear();

  const columns = [
    {
      title: nav?.about ?? "Crave",
      links: [
        { href: `/${lang}`, label: nav?.home ?? "Home" },
        { href: `/${lang}/products`, label: nav?.products ?? "Products" },
        { href: `/${lang}/about`, label: nav?.about ?? "About" },
        { href: `/${lang}/story`, label: nav?.story ?? "Our Story" },
      ],
    },
    {
      title: dict.support,
      links: [
        { href: `/${lang}/contact`, label: nav?.contact ?? "Contact" },
        { href: `/${lang}/products`, label: dict.shipping },
        { href: `/${lang}/products`, label: dict.returns },
        { href: `/${lang}/products`, label: dict.faq },
      ],
    },
  ];

  return (
    <footer className="bg-burgundy-dark text-cream">
      {/* Golden glow transition band */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(185,138,80,0.55), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center md:flex-row md:justify-between md:px-6 md:text-left">
          <div>
            <Logo lang={lang} />
            <p className="mt-4 max-w-md text-sm text-cream/70">{dict.tagline}</p>
          </div>
          <div className="flex items-center gap-4" aria-label={dict.follow}>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-cream transition-colors hover:bg-gold hover:text-burgundy-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-cream transition-colors hover:bg-gold hover:text-burgundy-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 11.08a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.44-4.4-1.2L2 20l1.62-5.1a8.5 8.5 0 1 1 18.38-3.82Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="border-t border-cream/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-cream/70">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
              Crave
            </h4>
            <p className="text-sm leading-relaxed text-cream/70">{dict.tagline}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-cream/50 md:px-6">
          © {now} {dict.rights}
        </div>
      </div>
    </footer>
  );
}
