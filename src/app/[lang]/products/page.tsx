import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/site/ProductCard";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";
import { getProducts, localizedProduct } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CATEGORIES = ["HIM", "HER", "UNISEX"] as const;
type CategoryKey = (typeof CATEGORIES)[number];

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps<"/[lang]/products"> & { searchParams: Promise<{ cat?: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  const sp = await searchParams;
  const activeCat = CATEGORIES.includes(sp.cat as CategoryKey)
    ? (sp.cat as CategoryKey)
    : null;

  const all = (await getProducts()).map((p) =>
    localizedProduct(p, lang as Locale),
  );
  const products = activeCat
    ? all.filter((p) => p.category === activeCat)
    : all;

  const tabs = [
    { key: null, label: dict.products.all },
    { key: "HIM", label: dict.categories.him },
    { key: "HER", label: dict.categories.her },
    { key: "UNISEX", label: dict.categories.unisex },
  ] as const;

  return (
    <div>
      {/* Page hero */}
      <section className="hero-bg border-b border-burgundy/10">
        <Container className="py-14 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burgundy/60">
            {dict.nav.home}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            {dict.products.title}
          </h1>
          <p className="mt-3 text-ink/60">{dict.products.subtitle}</p>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          {/* Category filter tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => {
              const href =
                tab.key === null
                  ? `/${lang}/products`
                  : `/${lang}/products?cat=${tab.key}`;
              const isActive = activeCat === tab.key;
              return (
                <Link
                  key={tab.key ?? "all"}
                  href={href}
                  className={
                    isActive
                      ? "rounded-full bg-burgundy px-6 py-2.5 text-sm font-semibold text-cream shadow-soft"
                      : "rounded-full border border-burgundy/20 bg-white px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-burgundy hover:text-burgundy"
                  }
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  lang={lang as Locale}
                  dict={{
                    inStock: dict.common.inStock,
                    outOfStock: dict.common.outOfStock,
                    currency: dict.common.currency,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-ink/60">
              {dict.products.empty}
            </p>
          )}
        </Container>
      </section>
    </div>
  );
}
