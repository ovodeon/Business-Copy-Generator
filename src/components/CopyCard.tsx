import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCardProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeBorderColor?: string;
  badgeTextColor?: string;
  copyText: string;
  children: React.ReactNode;
}

export const CopyCard: React.FC<CopyCardProps> = ({
  id,
  title,
  subtitle,
  badge,
  badgeBorderColor = "border-emerald-500/80",
  badgeTextColor = "text-emerald-400",
  copyText,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div
      id={id}
      className="flex flex-col h-full bg-[#18181b] border border-zinc-800/90 rounded-lg overflow-hidden transition-all duration-150 hover:border-zinc-700"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-start justify-between gap-3 bg-[#151518]">
        <div className="flex flex-col gap-1.5 min-w-0">
          {badge && (
            <div
              className={`font-mono-code text-[10px] border ${badgeBorderColor} ${badgeTextColor} px-1.5 py-0.5 rounded w-fit uppercase font-semibold tracking-wider`}
            >
              {badge}
            </div>
          )}
          <h3 className="text-sm font-syne font-bold text-zinc-100 uppercase tracking-wide truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="font-mono-code text-[11px] text-zinc-400 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Copy to Clipboard Button */}
        <button
          id={`${id}-copy-btn`}
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${title} to clipboard`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono-code text-[11px] font-medium rounded border transition-all duration-150 flex-shrink-0 cursor-pointer ${
            copied
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-600"
              : "bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white active:scale-95"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
