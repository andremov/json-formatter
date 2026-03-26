import {
  Check,
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Fragment, useState } from "react";
import LocaleStrings from "~/utils/types";

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
          className="inline-flex items-center rounded px-1 hover:bg-sand"
        >
          <ChevronRight className="mr-1 h-3 w-3" />
          <span>{`"${keyName || "root"}": `}</span>
          {"["}
          <span className="text-warm-gray">{data.length} items</span>
          {"]"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${
        depth === 0 ? "" : "ml-5"
      } my-1 rounded-xl border-l border-dashed border-sand`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="inline-flex items-center rounded px-1 hover:bg-sand"
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
  const keys = Object.keys(data).sort((a, b) => a.localeCompare(b));

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
          className="inline-flex items-center rounded px-1 hover:bg-sand"
        >
          <ChevronRight className="mr-1 h-3 w-3" />
          <span>{`"${keyName || "root"}": `}</span>
          {"{"}
          <span className="text-warm-gray">{keys.length} properties</span>
          {"}"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${
        depth === 0 ? "" : "ml-5"
      } my-1 rounded-xl border-l border-dashed border-sand`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="inline-flex items-center rounded px-1 hover:bg-sand"
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
      <span>{String(data)}</span>
    </div>
  );
}

interface OutputTextAreaProps {
  title: string;
  value: string;
  parsedData: unknown;
  error: string;
  buttonLabels: LocaleStrings["buttons"];
  errorLabel: string;
}

export function OutputTextArea({
  title,
  value,
  parsedData,
  error,
  buttonLabels,
  errorLabel,
}: OutputTextAreaProps) {
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
        <pre
          className={`flex-1 overflow-x-hidden text-wrap break-words rounded-md bg-cream px-6 py-4 font-mono text-walnut border-sand border ${
            error ? "whitespace-pre-wrap text-terracotta" : "overflow-auto"
          }`}
        >
          {error ? (
            <>
              <div className="mb-4 flex items-center gap-6">
                <AlertCircle className="h-5 w-5" />
                <span className="font-bold">{errorLabel}</span>
              </div>
              <span>{error}</span>
            </>
          ) : parsedData !== null ? (
            <JSONRenderer keyName="" data={parsedData} />
          ) : (
            ""
          )}
        </pre>
      </div>
    </div>
  );
}
