"use client";

import JSONFormatter from "~/_components/json-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";
import type LocaleStrings from "~/utils/types";
import locale from "~/utils/locale.json";
import { Footer } from "~/_components/footer";
import { Header } from "~/_components/header";
import { useParams } from "next/navigation";

export default function HomePage() {
  const { lang } = useParams<{ lang: "en" | "es" }>();
  const localeStrings = locale[lang] as LocaleStrings;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex flex-col justify-between">
      <Header title={localeStrings.title} />

      <JSONFormatter localeStrings={localeStrings} />

      <Footer
        author={localeStrings.author}
        description={localeStrings.description}
        owner={localeStrings.owner}
      />
    </div>
  );
}
