import Link from "next/link";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const { lang } = useParams<{ lang: "en" | "es" }>();

  return (
    <div className="flex rounded-md border border-sand p-1 gap-1">
      <Link
        href={"/en"}
        className={
          (lang === "en" ? "bg-sand font-semibold" : "hover:bg-cream-tinted") +
          " px-4 py-1 text-walnut transition-colors duration-200 rounded-sm text-sm"
        }
      >
        EN
      </Link>

      <Link
        href={"/es"}
        className={
          (lang === "es" ? "bg-sand font-semibold" : "hover:bg-cream-tinted") +
          " px-4 py-1 text-walnut transition-colors duration-200 rounded-sm text-sm"
        }
      >
        ES
      </Link>
    </div>
  );
}
