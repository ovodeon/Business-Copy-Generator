import React from "react";
import { GoogleBusinessProfileResult } from "../types";
import { MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface GoogleProfileViewProps {
  data: GoogleBusinessProfileResult;
  businessName?: string;
  location?: string;
}

export const GoogleProfileView: React.FC<GoogleProfileViewProps> = ({
  data,
  businessName,
  location,
}) => {
  if (!data?.headline && !data?.updateBody) {
    return (
      <div className="font-mono-code text-xs text-zinc-500 italic py-6 text-center">
        // NO GOOGLE BUSINESS PROFILE UPDATE GENERATED YET
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* GBP Terminal Representation */}
      <div className="p-3.5 rounded bg-[#222226] border border-zinc-800/90 space-y-3">
        {/* Profile Header representation */}
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-800/60">
          <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase font-syne">
            {businessName ? businessName.charAt(0) : "G"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-syne text-xs font-bold text-zinc-100 truncate uppercase">
                {businessName || "Your Business"}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 font-mono-code text-[10px] text-zinc-400">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="truncate">{location || "Verified Region"}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">GBP POST</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h4 className="font-syne text-xs font-bold text-zinc-100 leading-snug uppercase">
            {data.headline}
          </h4>
        </div>

        {/* Body */}
        <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-sans">
          {data.updateBody}
        </p>

        {/* Suggested Action & Button */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-zinc-800/60 flex-wrap">
          <div className="font-mono-code text-[11px] text-zinc-400">
            <span className="text-blue-400 font-bold uppercase">ACTION:</span>{" "}
            {data.callToAction}
          </div>

          {data.suggestedButtonType && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono-code text-[11px] font-bold uppercase transition-colors">
              <span>{data.suggestedButtonType}</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Helpful console tip */}
      <div className="font-mono-code text-[11px] text-zinc-400 bg-[#18181b] border border-zinc-800/90 rounded p-2.5 leading-relaxed">
        <span className="text-blue-400 font-bold">// LOCAL_SEO_TIP:</span> Regular weekly updates on Google Business Profile enhance map pack visibility and trigger higher click-through actions.
      </div>
    </div>
  );
};
