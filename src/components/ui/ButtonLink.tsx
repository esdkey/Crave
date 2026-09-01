import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-burgundy text-cream hover:bg-burgundy-dark",
  outline:
    "border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream",
  ghost: "text-burgundy hover:bg-burgundy/10",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
