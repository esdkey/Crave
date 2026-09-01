import Link from "next/link";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { createProduct } from "@/lib/actions/dashboard";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  params,
}: PageProps<"/[lang]/dashboard/products/new">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">{d.formTitleNew}</h1>
        <Link
          href={`/${lang}/dashboard/products`}
          className="text-sm text-burgundy hover:underline"
        >
          {dict.common.back}
        </Link>
      </div>
      <ProductForm
        action={createProduct}
        lang={lang}
        dict={d}
        submitLabel={d.saveProduct}
      />
    </div>
  );
}
