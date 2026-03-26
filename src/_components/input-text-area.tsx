import { Check, Copy, ChevronUp } from "lucide-react";
import { Fragment, useState } from "react";
import LocaleStrings from "~/utils/types";

interface InputTextAreaProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  buttonLabels: LocaleStrings["buttons"];
  onSetSampleData?: () => void;
}

export function InputTextArea({
  title,
  value,
  onChange,
  placeholder,
  buttonLabels,
  onSetSampleData,
}: InputTextAreaProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex min-h-12 flex-col gap-2 rounded-lg ease-in-out flex-1 p-6 bg-cream-tinted border border-sand">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-walnut">{title}</h2>
        <div className="flex items-center gap-2">
          {onSetSampleData && (
            <button
              onClick={onSetSampleData}
              className="flex items-center gap-2 rounded-md bg-olive px-2 py-1 text-cream outline-none transition-colors duration-200 hover:bg-olive/85"
            >
              <span>{buttonLabels.sample}</span>
            </button>
          )}
          <button
            disabled={!value}
            onClick={handleCopy}
            className={`flex items-center gap-2 rounded-md bg-terracotta px-2 py-1 text-cream outline-none transition-colors duration-200 hover:bg-terracotta/85 ${
              isCopied ? "bg-olive text-cream hover:bg-olive/85" : ""
            }`}
          >
            {isCopied ? (
              <Fragment>
                <Check className="size-4" />
                <span>{buttonLabels.copied}</span>
              </Fragment>
            ) : (
              <Fragment>
                <Copy className="size-4" />
                <span>{buttonLabels.copy}</span>
              </Fragment>
            )}
          </button>
        </div>
      </div>

      <div className="flex md:max-h-full md:opacity-100 min-h-0 flex-1 overflow-hidden px-1 transition-all duration-300 ease-in-out opacity-100">
        <textarea
          name="input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full flex-1 resize-none rounded-md border border-sand bg-cream p-4 font-mono text-walnut placeholder-warm-gray outline-none transition-colors duration-200 focus:ring-terracotta/50 focus:ring-2"
        />
      </div>
    </div>
  );
}
