import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/site/ProductCard";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";
import { getProducts, localizedProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  params,
}: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const products = (await getProducts()).map((p) =>
    localizedProduct(p, lang as Locale),
  );

  return (
    <div className="py-16 md:py-20">
      <Container>
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl text-ink md:text-5xl">
            {dict.products.title}
          </h1>
          <p className="mt-3 text-ink/60">{dict.products.subtitle}</p>
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
    </div>
  );
}
