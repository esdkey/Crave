"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

type LoginDict = {
  title: string;
  email: string;
  password: string;
  submit: string;
  error: string;
};

export function LoginForm({
  dict,
  lang,
}: {
  dict: LoginDict;
  lang: string;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="lang" value={lang} />
      {state?.error && (
        <p className="rounded-md bg-burgundy/10 px-3 py-2 text-sm text-burgundy">
          {dict.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
          {dict.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-ink"
        >
          {dict.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-ink focus:border-burgundy focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-burgundy-dark disabled:opacity-60"
      >
        {pending ? "..." : dict.submit}
      </button>
    </form>
  );
}
