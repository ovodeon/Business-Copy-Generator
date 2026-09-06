import React, { useState, useRef } from "react";
import { CopyFormData, GeneratedCopyResponse } from "./types";
import { InputForm } from "./components/InputForm";
import { CopyCard } from "./components/CopyCard";
import { SocialPostsView } from "./components/SocialPostsView";
import { GoogleProfileView } from "./components/GoogleProfileView";
import { SeoKeywordsView } from "./components/SeoKeywordsView";
import { Check, Copy, Loader2 } from "lucide-react";

export default function App() {
  const [formData, setFormData] = useState<CopyFormData>({
    businessName: "",
    location: "",
    mainProductService: "",
    targetAudience: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedCopyResponse | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateCopy = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || `Server responded with status ${response.status}`
        );
      }

      const data: GeneratedCopyResponse = await response.json();
      setResults(data);

      // Scroll smoothly to results if on mobile/smaller screens
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err: any) {
      console.error("Copy generation failed:", err);
      setError(
        err.message || "An unexpected error occurred while generating copy."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = async () => {
    if (!results) return;

    const fullBundle = `=== BUSINESS COPY BUNDLE ===
Business Name: ${formData.businessName}
Location: ${formData.location || "N/A"}
Main Product/Service: ${formData.mainProductService}
Target Audience: ${formData.targetAudience || "N/A"}

----------------------------------------
1. SOCIAL MEDIA POSTS
----------------------------------------
${results.socialMedia.copyableText}

----------------------------------------
2. GOOGLE BUSINESS PROFILE UPDATE
----------------------------------------
${results.googleBusinessProfile.copyableText}

----------------------------------------
3. SEO KEYWORDS
----------------------------------------
${results.seoKeywords.copyableText}
`;

    try {
      await navigator.clipboard.writeText(fullBundle);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    } catch (err) {
      console.error("Failed to copy bundle:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#e4e4e7] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header
        id="app-header"
        className="h-16 bg-[#18181b] border-b border-[rgba(228,228,231,0.1)] flex items-center justify-between px-6 z-10 shrink-0"
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <svg
            className="w-5 h-5 text-[#3b82f6] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
          </svg>
          <h1 className="font-syne font-extrabold text-sm sm:text-base tracking-wider uppercase text-zinc-100">
            Business Copy Generator
          </h1>
        </div>

        {/* Right Header Status & Actions */}
        <div className="flex items-center gap-3">
          {results && (
            <button
              type="button"
              id="copy-all-assets-btn"
              onClick={handleCopyAll}
              className={`hidden sm:inline-flex items-center gap-1.5 font-mono-code text-xs px-3 py-1.5 rounded border transition-all cursor-pointer ${
                copiedAll
                  ? "bg-emerald-950/70 border-emerald-500 text-emerald-400"
                  : "bg-zinc-800/90 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ALL ASSETS COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>COPY ALL ASSETS</span>
                </>
              )}
            </button>
          )}

          {/* Status Indicator */}
          <div className="font-mono-code text-[11px] text-zinc-300 flex items-center gap-2 bg-[#121215] border border-zinc-800 px-3 py-1.5 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden xs:inline">GEMINI 3 FLASH 0.1</span>
            <span className="xs:hidden">GEMINI 3</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Sidebar: Form & Parameters */}
        <aside
          id="sidebar-panel"
          className="w-full lg:w-[350px] shrink-0 bg-[#18181b] border-b lg:border-b-0 lg:border-r border-[rgba(228,228,231,0.1)] p-5 sm:p-6 overflow-y-auto"
        >
          <InputForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={handleGenerateCopy}
            isLoading={isLoading}
            error={error}
          />
        </aside>

        {/* Right Main Stage: Content Output */}
        <main
          id="main-stage"
          ref={resultsRef}
          className="flex-1 bg-[#0e0e10] p-5 sm:p-7 lg:p-8 overflow-y-auto flex flex-col justify-between"
        >
          <div>
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[rgba(228,228,231,0.08)]">
              <div>
                <h2 className="font-syne font-extrabold text-lg sm:text-xl text-zinc-100 uppercase tracking-wide">
                  Generated Marketing Assets
                </h2>
                <p className="font-mono-code text-xs text-zinc-400 mt-1">
                  {results
                    ? `Ready for deployment • ${formData.businessName || "Custom Brand"}${formData.location ? ` [${formData.location}]` : ""}`
                    : "Terminal ready for deployment. Assets will appear below."}
                </p>
              </div>

              {results && (
                <button
                  type="button"
                  id="mobile-copy-all-btn"
                  onClick={handleCopyAll}
                  className="sm:hidden self-start inline-flex items-center gap-1.5 font-mono-code text-xs px-3 py-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-200 cursor-pointer"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ALL COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>COPY ALL ASSETS</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Stage Body */}
            {isLoading ? (
              /* Loading Terminal State */
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-3.5 rounded-full bg-[#18181b] border border-blue-500/40 shadow-lg shadow-blue-500/5">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                </div>
                <div className="space-y-1">
                  <div className="font-syne font-bold text-sm text-zinc-200 uppercase tracking-wide">
                    Orchestrating Gemini 3 Flash Pipeline
                  </div>
                  <p className="font-mono-code text-xs text-zinc-500">
                    &gt;&gt; Synthesizing social hooks, local GBP update, and high-intent keywords...
                  </p>
                </div>
              </div>
            ) : results ? (
              /* 3 Output Result Cards */
              <div
                id="results-grid"
                className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-6 items-stretch"
              >
                {/* 1. Social Media Posts */}
                <CopyCard
                  id="card-social-posts"
                  title="Social Media Posts"
                  subtitle="3 multi-platform hooks & captions"
                  badge="MODULE // SOCIAL"
                  badgeBorderColor="border-emerald-500/80"
                  badgeTextColor="text-emerald-400"
                  copyText={results.socialMedia.copyableText}
                >
                  <SocialPostsView data={results.socialMedia} />
                </CopyCard>

                {/* 2. Google Business Profile */}
                <CopyCard
                  id="card-google-business"
                  title="Google Business Profile"
                  subtitle="Local pack announcement & CTA"
                  badge="MODULE // GBP"
                  badgeBorderColor="border-blue-500/80"
                  badgeTextColor="text-blue-400"
                  copyText={results.googleBusinessProfile.copyableText}
                >
                  <GoogleProfileView
                    data={results.googleBusinessProfile}
                    businessName={formData.businessName}
                    location={formData.location}
                  />
                </CopyCard>

                {/* 3. SEO Keywords */}
                <CopyCard
                  id="card-seo-keywords"
                  title="SEO Keywords"
                  subtitle="Primary local, high-intent & long-tail"
                  badge="MODULE // SEO"
                  badgeBorderColor="border-amber-500/80"
                  badgeTextColor="text-amber-400"
                  copyText={results.seoKeywords.copyableText}
                >
                  <SeoKeywordsView data={results.seoKeywords} />
                </CopyCard>
              </div>
            ) : (
              /* Empty Preview Cards from Design Variation 3 */
              <div className="pt-6 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Module Social */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 flex flex-col gap-2.5 transition-all hover:border-zinc-700">
                    <div className="font-mono-code text-[10px] border border-emerald-500/80 text-emerald-400 px-2 py-0.5 rounded w-fit uppercase font-semibold">
                      MODULE // SOCIAL
                    </div>
                    <h3 className="font-syne text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      Social Media Posts
                    </h3>
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                      3 ready-to-share promotional and engaging posts with hashtags. Built for maximum engagement velocity.
                    </p>
                  </div>

                  {/* Module GBP */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 flex flex-col gap-2.5 transition-all hover:border-zinc-700">
                    <div className="font-mono-code text-[10px] border border-blue-500/80 text-blue-400 px-2 py-0.5 rounded w-fit uppercase font-semibold">
                      MODULE // GBP
                    </div>
                    <h3 className="font-syne text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      Google Business Profile
                    </h3>
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                      A local search-optimized announcement with action CTA. Designed for conversion and map pack dominance.
                    </p>
                  </div>

                  {/* Module SEO */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 flex flex-col gap-2.5 transition-all hover:border-zinc-700">
                    <div className="font-mono-code text-[10px] border border-amber-500/80 text-amber-400 px-2 py-0.5 rounded w-fit uppercase font-semibold">
                      MODULE // SEO
                    </div>
                    <h3 className="font-syne text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      SEO Keywords
                    </h3>
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                      High-intent local and long-tail terms for search visibility. Optimized for modern LLM-based search results.
                    </p>
                  </div>
                </div>

                {/* Waiting Indicator */}
                <div className="font-mono-code text-xs text-zinc-600 text-center tracking-widest uppercase pt-6">
                  &gt;&gt;&gt; WAITING FOR INPUT_PARAMS...
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer bar */}
      <footer
        id="app-footer"
        className="h-10 bg-[#18181b] border-t border-[rgba(228,228,231,0.1)] px-6 text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider flex items-center justify-between shrink-0"
      >
        <div>CORE: GEMINI 3 FLASH</div>
        <div className="hidden sm:block">INSTANT_MARKETING_ENGINE_V1</div>
        <div>PORT_3000: ACTIVE</div>
      </footer>
    </div>
  );
}
