import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { ConfirmDelete } from "@/components/dashboard/ConfirmDelete";
import { updateProduct } from "@/lib/actions/dashboard";
import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../../../dictionaries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: PageProps<"/[lang]/dashboard/products/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-ink">{d.formTitleEdit}</h1>
        <div className="flex items-center gap-2">
          <ConfirmDelete
            productId={product.id}
            lang={lang}
            label={dict.common.delete}
            confirmLabel={d.deleteConfirm}
            cancelLabel={dict.common.cancel}
            deleteLabel={dict.common.delete}
          />
          <Link
            href={`/${lang}/dashboard/products`}
            className="text-sm text-burgundy hover:underline"
          >
            {dict.common.back}
          </Link>
        </div>
      </div>
      <ProductForm
        action={updateProduct}
        lang={lang}
        dict={d}
        submitLabel={d.updateProduct}
        product={{
          id: product.id,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          slug: product.slug,
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stock,
          isAvailable: product.isAvailable,
          featured: product.featured,
          descriptionAr: product.descriptionAr,
          descriptionEn: product.descriptionEn,
          storyAr: product.storyAr,
          storyEn: product.storyEn,
          images: product.images.map((i) => ({ id: i.id, url: i.url })),
        }}
      />
    </div>
  );
}
