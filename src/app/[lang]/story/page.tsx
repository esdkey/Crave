import { Container } from "@/components/ui/Container";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function StoryPage({ params }: PageProps<"/[lang]/story">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-burgundy/60">
          {dict.story.title}
        </p>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">
          {dict.story.heading}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/80">
          {dict.story.paragraph1}
        </p>
        <p className="mt-4 leading-relaxed text-ink/80">
          {dict.story.paragraph2}
        </p>

        <div className="mt-12 rounded-lg border border-burgundy/15 border-l-4 bg-white p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-burgundy">
            {dict.story.missionTitle}
          </h2>
          <p className="mt-3 font-serif text-2xl text-ink">
            {dict.story.mission}
          </p>
        </div>
      </Container>
    </div>
  );
}
