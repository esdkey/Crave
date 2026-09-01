import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductCard } from "@/components/site/ProductCard";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";
import {
  getFeaturedProducts,
  getProducts,
  getProductsByCategory,
  localizedProduct,
} from "@/lib/products";

export default async function HomePage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  const featured = (await getFeaturedProducts()).map((p) =>
    localizedProduct(p, lang as Locale),
  );

  const allProducts = (await getProducts()).map((p) =>
    localizedProduct(p, lang as Locale),
  );
  const newest = allProducts.slice(0, 4);

  const categoryCards = [
    {
      key: "HIM",
      title: dict.categories.him,
      subtitle: dict.categories.himSubtitle,
      image: (await getProductsByCategory("HIM"))[0]?.images[0]?.url ?? null,
    },
    {
      key: "HER",
      title: dict.categories.her,
      subtitle: dict.categories.herSubtitle,
      image: (await getProductsByCategory("HER"))[0]?.images[0]?.url ?? null,
    },
    {
      key: "UNISEX",
      title: dict.categories.unisex,
      subtitle: dict.categories.unisexSubtitle,
      image: (await getProductsByCategory("UNISEX"))[0]?.images[0]?.url ?? null,
    },
  ];

  const features = [
    { title: dict.home.feature1Title, text: dict.home.feature1Text },
    { title: dict.home.feature2Title, text: dict.home.feature2Text },
    { title: dict.home.feature3Title, text: dict.home.feature3Text },
  ];

  const testimonials = [
    { quote: dict.home.t1Quote, name: dict.home.t1Name },
    { quote: dict.home.t2Quote, name: dict.home.t2Name },
    { quote: dict.home.t3Quote, name: dict.home.t3Name },
  ];

  const brands = ["CRAVE", "MAISON", "ÉLIXIR", "OR", "VERDANT", "NOKTA"];

  const cardDict = {
    inStock: dict.common.inStock,
    outOfStock: dict.common.outOfStock,
    currency: dict.common.currency,
  };

  return (
    <div>
      {/* Hero — full-bleed image with overlaid headline */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden">
        <Image
          src="/background-2.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" aria-hidden />
        <Container className="relative">
          <div className="max-w-xl text-cream">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              {dict.home.heroKicker}
            </p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.05] text-white md:text-7xl">
              {dict.home.heroOverlay1}
              <br />
              {dict.home.heroOverlay2}{" "}
              <span className="text-gold">{dict.home.heroOverlay3}</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-white/85 md:text-lg">
              {dict.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href={`/${lang}/products`} className="px-8 py-3.5 text-base">
                {dict.home.ctaProducts} ↗
              </ButtonLink>
              <ButtonLink
                href={`/${lang}/about`}
                variant="outline"
                className="border-cream/60 text-cream hover:bg-cream hover:text-burgundy"
              >
                {dict.home.ctaAbout}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Brand strip */}
      <section className="border-b border-burgundy/10 bg-cream py-10">
        <Container>
          <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-ink/40">
            {dict.home.brandsTitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {brands.map((b) => (
              <span
                key={b}
                className="font-serif text-2xl tracking-[0.2em] text-ink/25 transition-colors hover:text-ink/50 sm:text-3xl"
              >
                {b}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Category cards — For Him / For Her / Unisex */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-burgundy/60">
              {dict.home.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink md:text-5xl">
              {dict.home.shopByTitle}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {categoryCards.map((card) => (
              <Link
                key={card.key}
                href={`/${lang}/products?cat=${card.key}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-card"
              >
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-cream-dark">
                    <span className="font-serif text-3xl tracking-[0.3em] text-burgundy/30">
                      CRAVE
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div>
                    <h3 className="font-serif text-3xl font-semibold text-white md:text-4xl">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">{card.subtitle}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-burgundy shadow-soft">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Best Sellers / Featured */}
      <section className="border-t border-burgundy/10 bg-cream-dark py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-burgundy/60">
              {dict.home.bestSellersEyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink md:text-5xl">
              {dict.home.featuredTitle}
            </h2>
            <p className="mt-3 text-sm text-ink/60">
              {dict.home.featuredSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang as Locale} dict={cardDict} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href={`/${lang}/products`}>{dict.common.viewAllProducts}</ButtonLink>
          </div>
        </Container>
      </section>

      {/* Wide promo banner */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-burgundy-dark shadow-card">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(185,138,80,0.35),transparent_55%)]" aria-hidden />
            <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-14">
              <div className="text-cream">
                <p className="max-w-sm text-sm text-cream/70 md:text-base">
                  {dict.home.bannerKicker}
                </p>
                <div className="mt-6">
                  <ButtonLink
                    href={`/${lang}/products`}
                    className="bg-gold px-8 py-3.5 text-base text-burgundy-dark hover:bg-gold/90"
                  >
                    {dict.home.bannerCta} ↗
                  </ButtonLink>
                </div>
              </div>
              <div className="text-right md:text-left md:text-right">
                <h2 className="font-serif text-4xl font-bold leading-tight text-cream md:text-6xl">
                  {dict.home.bannerTitle1}
                  <br />
                  {dict.home.bannerTitle2}
                  <br />
                  <span className="text-gold">{dict.home.bannerTitle3}</span>
                </h2>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* New Arrivals */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl text-ink md:text-5xl">
              {dict.home.newArrivalsTitle}
            </h2>
            <p className="mt-3 text-sm text-ink/60">
              {dict.home.newArrivalsSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang as Locale} dict={cardDict} />
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-burgundy/10 bg-cream py-16">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <h3 className="font-serif text-xl text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{f.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-dark py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              {dict.home.testimonialsTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              {dict.home.testimonialsSubtitle}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-[1.5rem] bg-white p-7 shadow-soft"
              >
                <div className="mb-4 flex gap-0.5 text-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="flex-1 text-ink/70">{t.quote}</blockquote>
                <figcaption className="mt-5 font-serif text-lg text-burgundy">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* About teaser */}
      <section className="relative overflow-hidden bg-burgundy py-16 text-center md:py-24">
        <Container className="relative max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-cream/60">
            Crave
          </p>
          <h2 className="font-serif text-3xl text-cream md:text-4xl">
            {dict.home.aboutTeaser.split(".")[0]}.
          </h2>
          <p className="mt-4 text-cream/70">{dict.home.aboutTeaser}</p>
          <div className="mt-8">
            <ButtonLink
              href={`/${lang}/story`}
              className="bg-cream text-burgundy hover:bg-cream-dark"
            >
              {dict.home.learnMore} →
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
