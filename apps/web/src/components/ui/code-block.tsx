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
    <div className="flex items-start justify-between gap-3 rounded-sm border border-line bg-ink/70 py-3 pr-3 pl-4">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs leading-relaxed text-lilac">
        {code}
      </code>
      <button
        className="flex-none cursor-pointer rounded-full border border-line bg-velvet px-3 py-1 font-mono text-xs font-semibold text-ivory transition-[color,border-color,transform] duration-200 ease-out hover:border-muted hover:text-ivory active:scale-[0.96] active:duration-150"
        type="button"
        onClick={() => void copy()}
        aria-label={`Copy ${code}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};
