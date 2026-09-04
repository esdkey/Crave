import { Cormorant_Garamond, Inter, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/components/site/cart-context";
import { CartHost } from "@/components/site/CartHost";
import { getProducts, localizedProduct } from "@/lib/products";
import type { SearchableProduct } from "@/components/site/SearchOverlay";
import "@/app/globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
});

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary();

  const rawProducts = await getProducts();
  const localized = rawProducts.map((p) => localizedProduct(p, lang as Locale));
  const searchProducts: SearchableProduct[] = localized.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    image: p.primaryImage,
  }));

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${cormorant.variable} ${inter.variable} ${cairo.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header
            nav={dict.nav}
            categories={dict.categories}
            lang={lang as Locale}
            announcement={dict.home.announcement}
          />
          <CartHost
            lang={lang as Locale}
            cartDict={dict.cart}
            searchDict={dict.search}
            products={searchProducts}
          />
          <main className="flex-1">{children}</main>
          <Footer dict={dict.footer} lang={lang as Locale} nav={dict.nav} />
        </CartProvider>
      </body>
    </html>
  );
}
