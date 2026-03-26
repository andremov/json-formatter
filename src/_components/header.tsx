import { LogoIcon } from "./logo-icon";
import LocaleSwitcher from "./locale-switcher";

export function Header({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm shadow-sm border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <LogoIcon className="size-10 rotate-12 text-walnut" />
            <LocaleSwitcher />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-walnut flex items-center gap-2">
              <span>{title}</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
