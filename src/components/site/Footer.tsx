import { Logo } from "./Logo";
import type { Locale } from "@/app/[lang]/dictionaries";

type FooterDict = {
  tagline: string;
  rights: string;
  follow: string;
};

export function Footer({
  dict,
  lang,
}: {
  dict: FooterDict;
  lang: Locale;
}) {
  return (
    <footer className="border-t border-burgundy/10 bg-cream-dark">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <Logo lang={lang} />
          <p className="max-w-md text-sm text-ink/70">{dict.tagline}</p>
          <p className="text-xs text-ink/50">
            © {new Date().getFullYear()} {dict.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
