import JSONFormatter from "~/_components/json-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LocaleSwitcher />
      <JSONFormatter />
    </main>
  );
}
