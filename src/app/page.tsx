import JSONFormatter from "~/_components/json-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

export default function HomePage() {
  return (
    <main className="h-screen max-h-screen pb-4 pt-16">
      <LocaleSwitcher />
      <JSONFormatter />
    </main>
  );
}
