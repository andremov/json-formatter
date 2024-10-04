"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { AlertCircle, Check, Copy } from "lucide-react";
import locale from "~/utils/locale.json";
import type LocaleStrings from "~/utils/types";

const debounce = (func: (arg: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

export default function JSONFormatter({ lang = "en" }: { lang?: "en" | "es" }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const localeStrings = locale[lang] as LocaleStrings;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formatJSON = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setOutput("");
        setError("");
        return;
      }

      try {
        const parsed = JSON.parse(value) as string;
        const formatted = JSON.stringify(parsed, null, 2);
        setOutput(formatted);
        setError("");
      } catch (error) {
        const parsedErr = error as { message: string };
        const msg = parsedErr.message;
        setError("Invalid JSON: " + msg);
        setOutput("");
      }
    }, 300),
    [],
  );

  useEffect(() => {
    formatJSON(input);
  }, [input, formatJSON]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="mb-4 text-center text-2xl font-bold">
        {localeStrings.title}
      </h1>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {localeStrings.labels.input}
          </h2>
          <textarea
            placeholder={localeStrings.labels.data}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-[calc(100vh-200px)] min-h-[300px] w-full resize-none rounded-md border border-gray-200 p-4 outline-none transition focus:border-blue-400"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {localeStrings.labels.output}
            </h2>
            {output && (
              <button
                onClick={handleCopy}
                className={
                  "flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1 outline-none transition hover:bg-gray-200" +
                  (isCopied ? "bg-green-600 text-white" : "")
                }
              >
                {isCopied ? (
                  <Fragment>
                    <Check className="h-4 w-4" />
                    <span>{localeStrings.buttons.copied}</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Copy className="h-4 w-4" />
                    <span>{localeStrings.buttons.copy}</span>
                  </Fragment>
                )}
              </button>
            )}
          </div>

          <div className="relative h-[calc(100vh-200px)] min-h-[300px]">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md border border-red-500 p-4 text-red-500">
                <AlertCircle className="absolute left-5 top-5 h-4 w-4" />
                <div className="flex flex-col gap-2">
                  <span className="font-bold">{localeStrings.error}</span>
                  <span>{error}</span>
                </div>
              </div>
            ) : (
              <pre className="h-full overflow-auto rounded-md bg-gray-200 p-4">
                <code>{output}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
