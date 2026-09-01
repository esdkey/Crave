"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginState =
  | { error?: string }
  | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "login.error" };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) return { error: "login.error" };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "login.error" };

  const lang = (formData.get("lang") as string) || "ar";

  const session = await getSession();
  session.userId = user.id;
  session.name = user.name;
  session.email = user.email;
  session.role = user.role;
  session.isLoggedIn = true;
  await session.save();

  redirect(`/${lang}/dashboard`);
}

export async function logout(formData: FormData) {
  const lang = (formData.get("lang") as string) || "ar";
  const session = await getSession();
  session.destroy();
  redirect(`/${lang}/login`);
}
