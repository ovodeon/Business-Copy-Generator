import React, { useState } from "react";
import { SeoKeywordsResult } from "../types";
import { Check, Copy } from "lucide-react";

interface SeoKeywordsViewProps {
  data: SeoKeywordsResult;
}

export const SeoKeywordsView: React.FC<SeoKeywordsViewProps> = ({ data }) => {
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const handleCopySingleKeyword = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedWord(keyword);
      setTimeout(() => setCopiedWord(null), 1800);
    } catch (err) {
      console.error("Failed to copy keyword:", err);
    }
  };

  const renderKeywordList = (
    title: string,
    prefix: string,
    keywords: string[],
    badgeColor: string,
    borderAccent: string
  ) => {
    if (!keywords || keywords.length === 0) return null;

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 font-mono-code text-[11px] text-zinc-300 font-semibold uppercase">
          <span className="text-zinc-500">//</span>
          <span>{title}</span>
          <span className="text-zinc-500 font-normal">[{keywords.length}]</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleCopySingleKeyword(kw)}
              title="Click to copy keyword"
              className={`inline-flex items-center gap-1.5 font-mono-code text-[11px] px-2 py-1 rounded border transition-all cursor-pointer ${
                copiedWord === kw
                  ? "bg-emerald-950/70 text-emerald-400 border-emerald-500"
                  : `${badgeColor} ${borderAccent} hover:border-zinc-500 active:scale-95`
              }`}
            >
              <span>{kw}</span>
              {copiedWord === kw ? (
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-zinc-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const totalCount =
    (data?.primaryLocalKeywords?.length || 0) +
    (data?.highIntentKeywords?.length || 0) +
    (data?.longTailQueries?.length || 0);

  if (totalCount === 0) {
    return (
      <div className="font-mono-code text-xs text-zinc-500 italic py-6 text-center">
        // NO SEO KEYWORDS GENERATED YET
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Local Keywords */}
      {renderKeywordList(
        "Primary Local Keywords",
        "LOCAL",
        data.primaryLocalKeywords,
        "bg-blue-950/40 text-blue-300",
        "border-blue-800/60"
      )}

      {/* High Intent Keywords */}
      {renderKeywordList(
        "High-Intent Commercial",
        "COMMERCIAL",
        data.highIntentKeywords,
        "bg-emerald-950/40 text-emerald-300",
        "border-emerald-800/60"
      )}

      {/* Long-Tail Queries */}
      {renderKeywordList(
        "Long-Tail Search Queries",
        "LONG_TAIL",
        data.longTailQueries,
        "bg-amber-950/40 text-amber-300",
        "border-amber-800/60"
      )}

      {/* Console Strategy Tip */}
      <div className="font-mono-code text-[11px] text-zinc-400 bg-[#18181b] border border-zinc-800/90 rounded p-2.5 leading-relaxed">
        <span className="text-amber-400 font-bold">// SEO_STRATEGY:</span> Integrate primary local terms in H1 / titles, and deploy long-tail queries as headings in service pages or FAQs.
      </div>
    </div>
  );
};
