"use client";

import { useState, useEffect, useCallback } from "react";
import type LocaleStrings from "~/utils/types";
import { InputTextArea } from "./input-text-area";
import { OutputTextArea } from "./output-text-area";

const debounce = (func: (arg: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

export default function JSONFormatter({
  localeStrings,
}: {
  localeStrings: LocaleStrings;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formatJSON = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setOutput("");
        setParsedData(null);
        setError("");
        return;
      }

      try {
        const parsed = JSON.parse(value) as unknown;
        const formatted = JSON.stringify(parsed, null, 2);
        setOutput(formatted);
        setParsedData(parsed);
        setError("");
      } catch (error) {
        const parsedErr = error as { message: string };
        const msg = parsedErr.message;
        setError("Invalid JSON: " + msg);
        setOutput("");
        setParsedData(null);
      }
    }, 300),
    []
  );

  useEffect(() => {
    formatJSON(input);
  }, [input, formatJSON]);

  const handleSetSampleData = () => {
    const sampleData = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345",
        country: "USA",
      },
      hobbies: ["reading", "swimming", "coding"],
      isActive: true,
      lastLogin: null,
    };
    setInput(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
        <InputTextArea
          title={localeStrings.labels.input}
          value={input}
          onChange={setInput}
          placeholder={localeStrings.labels.data}
          buttonLabels={localeStrings.buttons}
          onSetSampleData={handleSetSampleData}
        />

        <OutputTextArea
          title={localeStrings.labels.output}
          value={output}
          parsedData={parsedData}
          error={error}
          buttonLabels={localeStrings.buttons}
          errorLabel={localeStrings.error}
        />
      </div>
    </div>
  );
}
