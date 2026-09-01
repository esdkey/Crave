import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

export function Logo({ lang, className }: { lang: Locale; className?: string }) {
  return (
    <Link
      href={`/${lang}`}
      className={`inline-block leading-none ${className ?? ""}`}
      aria-label="Crave"
    >
      <Image
        src="/logo.png"
        alt="Crave"
        width={2103}
        height={748}
        className="h-9 w-auto md:h-12"
        priority
      />
    </Link>
  );
}
