"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductFormState } from "@/lib/actions/dashboard";

type ProductFormDict = {
  formNameAr: string;
  formNameEn: string;
  formSlug: string;
  formPrice: string;
  formSalePrice: string;
  formStock: string;
  formAvailable: string;
  formFeatured: string;
  formCategory: string;
  categoryHim: string;
  categoryHer: string;
  categoryUnisex: string;
  formImages: string;
  formStay: string;
  formCover: string;
  formDescAr: string;
  formDescEn: string;
  formStoryAr: string;
  formStoryEn: string;
  removeImage: string;
  imagesNote: string;
  formErrorImageTooLarge: string;
  formErrorUnsupported: string;
  formErrorUpload: string;
  formErrorSave: string;
  formErrorSlugExists: string;
  formInvalidFields: string;
};

type FormAction = (
  state: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

type ExistingImage = { id: string; url: string };

export function ProductForm({
  action,
  lang,
  dict,
  submitLabel,
  product,
}: {
  action: FormAction;
  lang: string;
  dict: ProductFormDict;
  submitLabel: string;
  product?: {
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
    price: number;
    salePrice: number | null;
    stock: number;
    isAvailable: boolean;
    featured: boolean;
    category: "HIM" | "HER" | "UNISEX";
    descriptionAr: string;
    descriptionEn: string;
    storyAr: string | null;
    storyEn: string | null;
    images: ExistingImage[];
  };
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState(action, undefined);
  const router = useRouter();

  const errorKey = state?.error ?? null;
  const errorMap: Record<string, string> = {
    formErrorImageTooLarge: dict.formErrorImageTooLarge,
    formErrorUnsupported: dict.formErrorUnsupported,
    formErrorUpload: dict.formErrorUpload,
    formErrorSave: dict.formErrorSave,
    formErrorSlugExists: dict.formErrorSlugExists,
    formInvalidFields: dict.formInvalidFields,
  };
  const errorMessage = errorKey ? errorMap[errorKey] : null;

  useEffect(() => {
    if (state && !state.error && !pending) {
      router.push(`/${lang}/dashboard/products`);
      router.refresh();
    }
  }, [state, pending, router, lang]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  }

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <input type="hidden" name="lang" value={lang} />
      {product && <input type="hidden" name="id" value={product.id} />}

      {errorMessage && (
        <p className="rounded-xl bg-burgundy/10 px-4 py-3 text-sm font-semibold text-burgundy">
          {errorMessage}
        </p>
      )}

      {/* Names */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput
          label={dict.formNameAr}
          name="nameAr"
          defaultValue={product?.nameAr}
          required
          dir="rtl"
        />
        <FieldInput
          label={dict.formNameEn}
          name="nameEn"
          defaultValue={product?.nameEn}
          required
        />
      </div>

      {/* Slug + price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput
          label={dict.formSlug}
          name="slug"
          defaultValue={product?.slug}
          required
          placeholder="my-perfume"
        />
        <FieldInput
          label={dict.formPrice}
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          required
        />
        <FieldInput
          label={dict.formSalePrice}
          name="salePrice"
          type="number"
          step="0.01"
          defaultValue={product?.salePrice ?? ""}
          placeholder=""
        />
      </div>

      {/* Stock + availability/featured */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-4">
          <FieldInput
            label={dict.formStock}
            name="stock"
            type="number"
            defaultValue={product?.stock ?? 0}
          />
          <FieldSelect
            label={dict.formCategory}
            name="category"
            defaultValue={product?.category ?? "UNISEX"}
            options={[
              { value: "HIM", label: dict.categoryHim },
              { value: "HER", label: dict.categoryHer },
              { value: "UNISEX", label: dict.categoryUnisex },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-end gap-6">
          <CheckField
            label={dict.formAvailable}
            name="isAvailable"
            defaultChecked={product?.isAvailable ?? true}
          />
          <CheckField
            label={dict.formFeatured}
            name="featured"
            defaultChecked={product?.featured ?? false}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {dict.formImages}
        </label>

        {/* Existing images */}
        {product && product.images.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-slate-500">
              {dict.formStay}
            </p>
            <div className="flex flex-wrap gap-3">
              {product.images.map((img, i) => (
                <label
                  key={img.id}
                  className="group relative block h-24 w-24 cursor-pointer overflow-hidden rounded-xl border border-slate-200"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  {i === 0 && (
                    <span className="absolute left-0 top-0 rounded-br-lg bg-burgundy px-1.5 py-0.5 text-[10px] font-bold text-cream">
                      {dict.formCover}
                    </span>
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/50 text-center text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <span>
                      {dict.removeImage}
                      <input
                        type="checkbox"
                        name="existingRemove"
                        value={img.id}
                        className="ml-1 accent-burgundy"
                      />
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Upload new */}
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-burgundy hover:bg-burgundy/5">
          <span className="text-2xl">🖼️</span>
          <span className="text-sm font-semibold text-slate-600">
            {dict.formImages}
          </span>
          <span className="text-xs text-slate-400">{dict.imagesNote}</span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="sr-only"
          />
        </label>

        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="96px" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Descriptions & stories */}
      <FieldArea
        label={dict.formDescAr}
        name="descriptionAr"
        defaultValue={product?.descriptionAr}
        required
        dir="rtl"
        span
      />
      <FieldArea
        label={dict.formDescEn}
        name="descriptionEn"
        defaultValue={product?.descriptionEn}
        required
        span
      />
      <FieldArea
        label={dict.formStoryAr}
        name="storyAr"
        defaultValue={product?.storyAr ?? ""}
        dir="rtl"
        span
      />
      <FieldArea
        label={dict.formStoryEn}
        name="storyEn"
        defaultValue={product?.storyEn ?? ""}
        span
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-burgundy px-6 py-3.5 text-base font-semibold text-cream shadow-sm transition-colors hover:bg-burgundy-dark disabled:opacity-60"
      >
        {pending ? "..." : submitLabel}
      </button>
    </form>
  );
}

function FieldInput({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
  step,
  dir,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
  placeholder?: string;
  step?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      />
    </div>
  );
}

function FieldArea({
  label,
  name,
  defaultValue,
  required,
  dir,
  span,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  dir?: "rtl" | "ltr";
  span?: boolean;
}) {
  return (
    <div className={span ? "" : ""}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        dir={dir}
        rows={3}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      />
    </div>
  );
}

function FieldSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-base text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-burgundy"
      />
      {label}
    </label>
  );
}
