import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/site/ProductCard";
import { OrderForm } from "@/components/site/OrderForm";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import {
  getProductBySlug,
  getOtherProducts,
  localizedProduct,
} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const productLocalized = localizedProduct(product, lang as Locale);
  const others = (await getOtherProducts(product.id)).map((p) =>
    localizedProduct(p, lang as Locale),
  );

  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border border-burgundy/10 bg-cream">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={productLocalized.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-serif text-4xl tracking-[0.3em] text-burgundy/40">
                  CRAVE
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                product.isAvailable
                  ? "bg-burgundy/90 text-cream"
                  : "bg-ink/70 text-cream"
              }`}
            >
              {product.isAvailable
                ? dict.common.inStock
                : dict.common.outOfStock}
            </span>

            <h1 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
              {productLocalized.name}
            </h1>

            <p className="mt-2 text-xl text-burgundy">
              {dict.common.price}: {product.price} {dict.common.currency}
            </p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
                {dict.product.description}
              </h2>
              <p className="mt-2 text-ink/80">{productLocalized.description}</p>
            </div>

            {productLocalized.story && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
                  {dict.product.storyTitle}
                </h2>
                <p className="mt-2 text-ink/80">{productLocalized.story}</p>
              </div>
            )}

            {/* Order form */}
            {product.isAvailable && (
              <div className="mt-8 rounded-lg border border-burgundy/15 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-serif text-2xl text-ink">
                  {dict.product.orderTitle}
                </h2>
                <OrderForm productId={product.id} dict={dict.orderForm} />
              </div>
            )}
          </div>
        </div>

        {/* Other products */}
        {others.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-serif text-2xl text-ink">
              {dict.product.otherProducts}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
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
          </div>
        )}
      </Container>
    </div>
  );
}
