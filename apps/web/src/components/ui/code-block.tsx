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
    <div className="flex items-center justify-between gap-3 rounded-sm border border-line bg-ink py-2.5 pr-2.5 pl-3">
      <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-lilac">
        {code}
      </code>
      <button
        className="flex-none cursor-pointer rounded-full border border-line bg-velvet px-3 py-1 font-mono text-xs font-semibold text-ivory transition-colors duration-200 ease-out hover:border-cyan hover:text-cyan"
        type="button"
        onClick={() => void copy()}
        aria-label={`Copy ${code}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};
