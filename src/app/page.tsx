import { redirect } from "next/navigation";
import { defaultLocale } from "@/app/[lang]/dictionaries";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
