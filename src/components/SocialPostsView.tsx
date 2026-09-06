import React, { useState } from "react";
import { SocialMediaResult } from "../types";
import { Check, Copy } from "lucide-react";

interface SocialPostsViewProps {
  data: SocialMediaResult;
}

export const SocialPostsView: React.FC<SocialPostsViewProps> = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyPost = async (index: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy post:", err);
    }
  };

  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="font-mono-code text-xs text-zinc-500 italic py-6 text-center">
        // NO SOCIAL POSTS GENERATED YET
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {data.posts.map((post, index) => {
        const singlePostCopy = `${post.hook}\n\n${post.caption}\n\n${post.callToAction}\n\n${post.hashtags.join(" ")}`;

        return (
          <div
            key={index}
            id={`social-post-item-${index}`}
            className="p-3.5 rounded bg-[#222226] border border-zinc-800/90 hover:border-zinc-700 transition-colors relative group"
          >
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-zinc-800/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono-code text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/70 px-1.5 py-0.5 rounded">
                  {post.platform || "POST"}
                </span>
                {post.theme && (
                  <span className="font-mono-code text-[10px] text-zinc-400 truncate">
                    // {post.theme}
                  </span>
                )}
              </div>

              {/* Quick copy single post */}
              <button
                type="button"
                id={`copy-single-post-${index}`}
                onClick={() => handleCopyPost(index, singlePostCopy)}
                title="Copy single post"
                className="font-mono-code text-[11px] text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label={`Copy post ${index + 1}`}
              >
                {copiedIndex === index ? (
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    COPIED
                  </span>
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400" />
                )}
              </button>
            </div>

            {/* Hook */}
            {post.hook && (
              <p className="font-mono-code text-xs font-bold text-zinc-100 mb-1 leading-snug">
                {post.hook}
              </p>
            )}

            {/* Caption */}
            <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed mb-2.5 font-sans">
              {post.caption}
            </p>

            {/* CTA */}
            {post.callToAction && (
              <div className="font-mono-code text-[11px] text-blue-300 bg-blue-950/40 border border-blue-900/60 rounded px-2.5 py-1.5 mb-2">
                <span className="text-blue-400 font-bold uppercase tracking-wider">CTA:</span>{" "}
                {post.callToAction}
              </div>
            )}

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.hashtags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="font-mono-code text-[10px] text-zinc-400 bg-[#18181b] border border-zinc-800 px-1.5 py-0.5 rounded"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
