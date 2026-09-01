import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function LoginPage({
  params,
}: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="rounded-xl border border-burgundy/15 bg-white p-8 shadow-sm">
          <h1 className="text-center font-serif text-3xl text-ink">
            {dict.login.title}
          </h1>
          <p className="mt-2 text-center text-sm text-ink/60">
            {dict.login.subtitle}
          </p>
          <div className="mt-6">
            <LoginForm dict={dict.login} lang={lang as string} />
          </div>
        </div>
      </Container>
    </div>
  );
}
