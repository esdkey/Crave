import { Container } from "@/components/ui/Container";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-burgundy/60">
          {dict.about.title}
        </p>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">
          {dict.about.heading}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/80">
          {dict.about.paragraph1}
        </p>
        <p className="mt-4 leading-relaxed text-ink/80">
          {dict.about.paragraph2}
        </p>

        <h2 className="mt-12 font-serif text-2xl text-ink">
          {dict.about.valuesTitle}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Value title={dict.about.value1Title} text={dict.about.value1Text} />
          <Value title={dict.about.value2Title} text={dict.about.value2Text} />
          <Value title={dict.about.value3Title} text={dict.about.value3Text} />
        </div>
      </Container>
    </div>
  );
}

function Value({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-burgundy/10 bg-white p-5">
      <h3 className="font-serif text-lg text-burgundy">{title}</h3>
      <p className="mt-2 text-sm text-ink/70">{text}</p>
    </div>
  );
}
