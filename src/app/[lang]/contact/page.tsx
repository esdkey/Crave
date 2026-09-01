import { Container } from "@/components/ui/Container";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  const rows = [
    { label: dict.contact.phoneLabel, value: "+20 100 000 0000" },
    { label: dict.contact.whatsapp, value: "+20 100 000 0000" },
    { label: dict.contact.instagram, value: "@crave.perfumes" },
    { label: dict.contact.email, value: "hello@crave-eg.com" },
  ];

  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-burgundy/60">
          {dict.contact.title}
        </p>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">
          {dict.contact.heading}
        </h1>
        <p className="mt-4 text-ink/70">{dict.contact.subtitle}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className="rounded-lg border border-burgundy/10 bg-white p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
                {r.label}
              </p>
              <p className="mt-1 text-lg text-burgundy">{r.value}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-ink/50">{dict.contact.hours}</p>
      </Container>
    </div>
  );
}
