"use client";

import JSONFormatter from "~/_components/json-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

type PageProps = {
  params: { lang: "en" | "es" };
};

export default function HomePage({ params }: PageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LocaleSwitcher lang={params.lang} />
      <JSONFormatter lang={params.lang} />
    </main>
  );
}
