export function Footer({
  owner,
  author,
  description,
}: {
  owner: string;
  author: string;
  description: string;
}) {
  return (
    <div className="bg-cream-tinted border-t border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-warm-gray">
            {owner}{" "}
            <a
              href="https://andremov.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-terracotta hover:text-terracotta/80 transition-colors duration-200"
            >
              {author}
            </a>
          </div>
          <div className="text-xs text-warm-gray">{description}</div>
        </div>
      </div>
    </div>
  );
}
