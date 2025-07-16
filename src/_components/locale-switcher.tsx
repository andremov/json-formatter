import Link from "next/link";

export default function LocaleSwitcher({
  lang = "en",
}: {
  lang?: "en" | "es";
}) {
  return (
    <div className="absolute left-1/2 top-5 flex -translate-x-1/2 rounded-md border border-gray-600 bg-gray-700">
      <Link
        href={"/en"}
        className={
          (lang === "en"
            ? "bg-gray-600 font-semibold text-white"
            : "text-gray-300 hover:text-white") + " px-3 py-1 transition-colors"
        }
      >
        EN
      </Link>

      <Link
        href={"/es"}
        className={
          (lang === "es"
            ? "bg-gray-600 font-semibold text-white"
            : "text-gray-300 hover:text-white") + " px-3 py-1 transition-colors"
        }
      >
        ES
      </Link>
    </div>
  );
}
