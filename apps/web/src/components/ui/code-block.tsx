import { useEffect, useRef, useState } from "react";

const RESET_MS = 1600;

export const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-line bg-ink/70 py-2 pr-2 pl-4">
      <code className="min-w-0 flex-1 whitespace-pre-wrap py-1 font-mono text-xs leading-relaxed text-lilac wrap-anywhere">
        {code}
      </code>
      <button
        className="inline-flex min-h-9 min-w-24 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full border border-line bg-velvet px-4 font-mono pointer-coarse:min-h-11 text-xs font-semibold text-ivory transition-[color,border-color,transform] duration-200 ease-out hover:border-muted hover:text-ivory active:scale-[0.96] active:duration-150"
        type="button"
        onClick={() => void copy()}
        aria-label={`Copy ${code}`}
      >
        <span
          className="inline-flex animate-swap items-center gap-1.5"
          key={copied ? "copied" : "copy"}
        >
          {copied ? (
            <svg
              aria-hidden="true"
              className="size-3.5 text-laser"
              fill="none"
              shapeRendering="crispEdges"
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M4 12l5 5L20 6" />
            </svg>
          ) : null}
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
};
