import { Pin } from "lucide-react";
import { useMemo } from "react";
import InlineVariables from "./InlineVariables";
import type { Prompt } from "../types";
import { COLOR_HEX, cx, extractVariables, formatRelativeTime } from "../lib/utils";

interface PromptCardProps {
  prompt: Prompt;
  active: boolean;
  expanded: boolean;
  onPromptClick: (prompt: Prompt) => void;
  onTogglePin: (prompt: Prompt) => void;
  onInject: (prompt: Prompt, text: string) => void;
  onCancelVariables: () => void;
  animationDelay?: number;
}


export default function PromptCard({
  prompt,
  active,
  expanded,
  onPromptClick,
  onTogglePin,
  onInject,
  onCancelVariables,
  animationDelay = 0,
}: PromptCardProps) {
  const variables = useMemo(() => extractVariables(prompt.body), [prompt.body]);
  const preview = prompt.body.replace(/\{\{[^}]+\}\}/g, (m) => m).slice(0, 72);
  const accentColor = COLOR_HEX[prompt.color] ?? "#6366f1";

  return (
    <button
      onClick={() => onPromptClick(prompt)}
      style={{
        animationDelay: `${animationDelay}ms`,
        borderLeftColor: accentColor,
      }}
      className={cx(
        "w-full text-left border border-l-2 rounded-xl px-3 py-2.5 transition-all duration-150 focus-visible:outline-none prompt-card-enter",
        active
          ? "bg-zinc-800 border-zinc-700"
          : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800/70 hover:border-zinc-700/80"
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-semibold text-zinc-100 leading-snug line-clamp-1">
          {prompt.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(prompt);
          }}
          className={cx(
            "shrink-0 p-0.5 rounded transition-colors duration-150 focus-visible:outline-none mt-0.5",
            prompt.pinned ? "text-violet-400" : "text-zinc-700 hover:text-zinc-400"
          )}
          aria-label={prompt.pinned ? "Unpin" : "Pin"}
        >
          <Pin className="w-3 h-3" fill={prompt.pinned ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Body preview */}
      <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5 line-clamp-1">
        {preview || "Empty prompt"}
      </p>

      {/* Tags + meta row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 flex-wrap">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500"
            >
              {tag}
            </span>
          ))}
          {variables.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-950/50 text-violet-400 border border-violet-900/40">
              {variables.length} var{variables.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">
            {formatRelativeTime(prompt.updatedAt)}
          </span>
          <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
            {prompt.useCount}×
          </span>
        </div>
      </div>

      {/* Inline variable form */}
      {expanded && variables.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3 pt-3 border-t border-zinc-700/60 variables-expand"
        >
          <InlineVariables
            body={prompt.body}
            variables={variables}
            onInject={(text) => onInject(prompt, text)}
            onCancel={onCancelVariables}
          />
        </div>
      )}
    </button>
  );
}
