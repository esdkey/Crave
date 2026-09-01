type ProductFormDict = {
  formNameAr: string;
  formNameEn: string;
  formSlug: string;
  formPrice: string;
  formStock: string;
  formAvailable: string;
  formFeatured: string;
  formImageUrl: string;
  formDescAr: string;
  formDescEn: string;
  formStoryAr: string;
  formStoryEn: string;
};

type FormAction = (formData: FormData) => Promise<void>;

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
    stock: number;
    isAvailable: boolean;
    featured: boolean;
    imageUrl: string | null;
    descriptionAr: string;
    descriptionEn: string;
    storyAr: string | null;
    storyEn: string | null;
  };
}) {
  return (
    <form action={action} className="space-y-5 rounded-lg border border-burgundy/10 bg-white p-6">
      <input type="hidden" name="lang" value={lang} />
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label={dict.formNameAr}
          name="nameAr"
          defaultValue={product?.nameAr}
          required
          dir="rtl"
        />
        <InputField
          label={dict.formNameEn}
          name="nameEn"
          defaultValue={product?.nameEn}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label={dict.formSlug}
          name="slug"
          defaultValue={product?.slug}
          required
          placeholder="my-perfume"
        />
        <InputField
          label={dict.formPrice}
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          required
        />
      </div>

      <InputField
        label={dict.formImageUrl}
        name="imageUrl"
        defaultValue={product?.imageUrl ?? ""}
        placeholder="https://.../image.jpg (optional, place in /public)"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label={dict.formStock}
          name="stock"
          type="number"
          defaultValue={product?.stock ?? 0}
        />
      </div>

      <div className="flex flex-wrap gap-6">
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

      <TextAreaField
        label={dict.formDescAr}
        name="descriptionAr"
        defaultValue={product?.descriptionAr}
        required
        dir="rtl"
      />
      <TextAreaField
        label={dict.formDescEn}
        name="descriptionEn"
        defaultValue={product?.descriptionEn}
        required
      />
      <TextAreaField
        label={dict.formStoryAr}
        name="storyAr"
        defaultValue={product?.storyAr ?? ""}
        dir="rtl"
      />
      <TextAreaField
        label={dict.formStoryEn}
        name="storyEn"
        defaultValue={product?.storyEn ?? ""}
      />

      <button
        type="submit"
        className="w-full rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-burgundy-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function InputField({
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
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">
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
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  dir,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        dir={dir}
        rows={3}
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
      />
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
    <label className="flex items-center gap-2 text-sm text-ink">
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
