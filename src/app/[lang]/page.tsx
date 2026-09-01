import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductCard } from "@/components/site/ProductCard";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";
import { getFeaturedProducts, localizedProduct } from "@/lib/products";

export default async function HomePage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const featured = (await getFeaturedProducts()).map((p) =>
    localizedProduct(p, lang as Locale),
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-burgundy/10 bg-cream">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <Image
            src="/logo.png"
            alt=""
            width={2103}
            height={748}
            className="h-[70vh] w-auto"
            aria-hidden
          />
        </div>
        <Container className="relative py-20 text-center md:py-32">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-burgundy/60">
            {dict.home.eyebrow}
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-ink md:text-6xl md:leading-tight">
            {dict.home.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-ink/70 md:text-lg">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href={`/${lang}/products`}>
              {dict.home.ctaProducts}
            </ButtonLink>
            <ButtonLink href={`/${lang}/about`} variant="outline">
              {dict.home.ctaAbout}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              {dict.home.featuredTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              {dict.home.featuredSubtitle}
            </p>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
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
            <p className="text-center text-ink/60">{dict.products.empty}</p>
          )}
          <div className="mt-10 text-center">
            <ButtonLink href={`/${lang}/products`} variant="outline">
              {dict.common.viewAllProducts}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* About teaser */}
      <section className="border-t border-burgundy/10 bg-cream-dark py-16 md:py-24">
        <Container className="max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-burgundy/60">
            Crave
          </p>
          <h2 className="font-serif text-3xl text-ink md:text-4xl">
            {dict.home.aboutTeaser.split(".")[0]}.
          </h2>
          <p className="mt-4 text-ink/70">{dict.home.aboutTeaser}</p>
          <div className="mt-8">
            <ButtonLink href={`/${lang}/story`} variant="ghost">
              {dict.home.learnMore} →
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
