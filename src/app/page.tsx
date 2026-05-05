import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const requestHeaders = await headers();
  const acceptLanguage = requestHeaders.get("accept-language") ?? "";
  const locale = acceptLanguage.toLowerCase().includes("es") ? "es" : "en";

  redirect(`/${locale}`);
}
