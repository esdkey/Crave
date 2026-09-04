import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { OrderForm } from "@/components/site/OrderForm";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import { getPaymentConfig } from "@/lib/payment";
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
  const payment = await getPaymentConfig();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const productLocalized = localizedProduct(product, lang as Locale);
  const gallery = productLocalized.images
    .map((i) => i.url)
    .filter((u): u is string => !!u);
  const others = (await getOtherProducts(product.id)).map((p) =>
    localizedProduct(p, lang as Locale),
  );

  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={gallery} name={productLocalized.name} />

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

            <div className="mt-2 flex items-baseline gap-3">
              {productLocalized.salePrice != null &&
                productLocalized.salePrice < productLocalized.price && (
                  <span className="text-lg text-ink/40 line-through">
                    {productLocalized.price} {dict.common.currency}
                  </span>
                )}
              <p className="font-serif text-3xl text-burgundy">
                {productLocalized.salePrice != null &&
                productLocalized.salePrice < productLocalized.price
                  ? productLocalized.salePrice
                  : productLocalized.price}{" "}
                {dict.common.currency}
              </p>
            </div>

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
              <div className="mt-8 space-y-3">
                <AddToCartButton
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: productLocalized.name,
                    price: productLocalized.price,
                    salePrice: productLocalized.salePrice,
                    image: productLocalized.primaryImage,
                  }}
                  label={dict.product.addToCart}
                />
                <div className="rounded-lg border border-burgundy/15 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 font-serif text-2xl text-ink">
                    {dict.product.orderTitle}
                  </h2>
                  <OrderForm
                  productId={product.id}
                  dict={dict.orderForm}
                  payment={{
                    vodafone: payment.vodafoneNumber || null,
                    instapay: payment.instapayNumber || null,
                  }}
                  />
                </div>
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
