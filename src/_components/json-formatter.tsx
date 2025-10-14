"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import type LocaleStrings from "~/utils/types";
import clsx from "clsx";
import { TextArea } from "./text-area";

const debounce = (func: (arg: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

// JSON Renderer with folding capabilities
interface JSONRendererProps<T = unknown> {
  keyName: string;
  data: T;
  depth?: number;
}

function JSONArrayRenderer({
  keyName,
  data,
  depth = 0,
}: JSONRendererProps<Array<unknown>>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (data.length === 0) {
    <div className="my-1 ml-5">
      <span>{`"${keyName}": `}</span>
      <span>{"[]"}</span>
    </div>;
  }

  if (isCollapsed) {
    return (
      <div className={`${depth === 0 ? "" : "ml-5"} my-1`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center rounded px-1 hover:bg-gray-700"
        >
          <ChevronRight className="mr-1 h-3 w-3" />
          <span>{`"${keyName || "root"}": `}</span>
          {"["}
          <span className="text-gray-400">{data.length} items</span>
          {"]"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${depth === 0 ? "" : "ml-5"} my-1 rounded-xl border-l border-dashed border-gray-600`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="inline-flex items-center rounded px-1 hover:bg-gray-700"
      >
        <ChevronDown className="mr-1 h-3 w-3" />
        {keyName && <span>{`"${keyName}": `}</span>}
        {"["}
      </button>
      {data.map((item: unknown, index: number) => (
        <JSONRenderer
          key={index.toString()}
          keyName={index.toString()}
          data={item}
          depth={depth + 1}
        />
      ))}
      <div className="ml-5">{"]"}</div>
    </div>
  );
}

function JSONObjectRenderer({
  keyName,
  data,
  depth = 0,
}: JSONRendererProps<Record<string, unknown>>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const keys = Object.keys(data);

  if (keys.length === 0) {
    return (
      <div className="my-1 ml-5">
        <span>{`"${keyName}": `}</span>
        <span>{"{}"}</span>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className={`${depth === 0 ? "" : "ml-5"} my-1`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center rounded px-1 hover:bg-gray-700"
        >
          <ChevronRight className="mr-1 h-3 w-3" />
          <span>{`"${keyName || "root"}": `}</span>
          {"{"}
          <span className="text-gray-400">{keys.length} properties</span>
          {"}"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${depth === 0 ? "" : "ml-5"} my-1 rounded-xl border-l border-dashed border-gray-600`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="inline-flex items-center rounded px-1 hover:bg-gray-700"
      >
        <ChevronDown className="mr-1 h-3 w-3" />
        {keyName && <span>{`"${keyName}": `}</span>}
        {"{"}
      </button>
      {keys.map((key, index) => (
        <JSONRenderer
          key={key}
          keyName={key}
          data={data[key]}
          depth={depth + 1}
        />
      ))}
      <div className="ml-5">{"}"}</div>
    </div>
  );
}

function JSONRenderer({ keyName, data, depth = 0 }: JSONRendererProps) {
  if (data === null) {
    return (
      <div className="my-1 ml-10">
        <span>{`"${keyName}": `}</span>
        <span>null</span>;
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <div className="my-1 ml-10">
        <span>{`"${keyName}": `}</span>
        {data.toString()}
      </div>
    );
  }

  if (typeof data === "number") {
    return (
      <div className="my-1 ml-10">
        <span>{`"${keyName}": `}</span>
        <span>{data}</span>
      </div>
    );
  }

  if (typeof data === "string") {
    return (
      <div className="my-1 ml-10">
        <span>{`"${keyName}": `}</span>
        <span>{`"${data}"`}</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    return <JSONArrayRenderer keyName={keyName} data={data} depth={depth} />;
  }

  if (typeof data === "object" && data !== null) {
    return (
      <JSONObjectRenderer
        keyName={keyName}
        data={data as Record<string, unknown>}
        depth={depth}
      />
    );
  }

  return (
    <div className="my-1 ml-10">
      <span>{`"${keyName}": `}</span>
      <span>{String(data)}</span>;♦
    </div>
  );
}

export default function JSONFormatter({
  localeStrings,
  showColumns,
}: {
  localeStrings: LocaleStrings;
  showColumns: boolean;
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
    [],
  );

  useEffect(() => {
    formatJSON(input);
  }, [input, formatJSON]);

  return (
    <div className="container mx-auto flex h-full max-h-full flex-col overflow-hidden bg-gray-900 text-white">
      <div
        className={clsx([
          "flex flex-1 flex-col gap-1 overflow-hidden md:gap-2 lg:px-2",
          {
            "md:flex-row": showColumns,
            "md:flex-col": !showColumns,
          },
        ])}
      >
        <TextArea
          title={localeStrings.labels.input}
          value={input}
          showColumns={showColumns}
          copyActionLabel={localeStrings.buttons.copy}
          copiedActionLabel={localeStrings.buttons.copied}
          minimizeLabel={localeStrings.buttons.minimize}
          expandLabel={localeStrings.buttons.expand}
        >
          <textarea
            name="input"
            placeholder={localeStrings.labels.data}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 resize-none rounded-md border border-gray-600 bg-gray-800 p-4 font-mono text-white placeholder-gray-400 outline-none transition focus:border-blue-500"
          />
        </TextArea>

        <TextArea
          title={localeStrings.labels.output}
          value={output}
          showColumns={showColumns}
          copyActionLabel={localeStrings.buttons.copy}
          copiedActionLabel={localeStrings.buttons.copied}
          minimizeLabel={localeStrings.buttons.minimize}
          expandLabel={localeStrings.buttons.expand}
        >
          <pre
            className={clsx([
              "flex-1 overflow-x-hidden text-wrap break-words rounded-md bg-gray-800 p-4 font-mono text-gray-100",
              {
                "whitespace-pre-wrap text-red-400": !!error,
                "overflow-auto": !error,
              },
            ])}
          >
            {error ? (
              <>
                <div className="mb-4 flex items-center gap-6">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-bold">{localeStrings.error}</span>
                </div>
                <span>{error}</span>
              </>
            ) : parsedData !== null ? (
              <JSONRenderer keyName="" data={parsedData} />
            ) : (
              ""
            )}
          </pre>
        </TextArea>
      </div>
    </div>
  );
}
