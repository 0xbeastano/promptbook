import { ArrowLeft, Check, Pin } from "lucide-react";
import { useState } from "react";
import type { PromptColor, PromptDraft } from "../types";
import { COLOR_HEX, cx } from "../lib/utils";

const colors = Object.keys(COLOR_HEX) as PromptColor[];

interface NewPromptFormProps {
  onBack: () => void;
  onSave: (draft: PromptDraft) => Promise<void>;
}

export default function NewPromptForm({ onBack, onSave }: NewPromptFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState<PromptColor>("slate");
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const canSave = title.trim().length > 0 && body.trim().length > 0 && !saving;

  async function submit() {
    if (!canSave) return;
    setSaving(true);
    await onSave({
      title,
      body,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      color,
      pinned,
    });
    setSaving(false);
  }

  const labelClass = "text-[10px] font-medium text-zinc-500 uppercase tracking-wide mb-1 block";
  const inputClass = "h-9 w-full rounded-lg border border-zinc-700/50 bg-zinc-800/60 px-3 text-[12px] text-zinc-200 outline-none transition-colors duration-150 placeholder:text-zinc-600 focus:border-zinc-600";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 shrink-0">
        <button
          onClick={onBack}
          className="p-1 rounded-md text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors duration-150 focus-visible:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[13px] font-semibold text-zinc-100">New Prompt</span>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summarize transcript"
            className={inputClass}
            autoFocus
          />
        </div>

        {/* Body */}
        <div>
          <label className={labelClass}>Prompt</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder={"Write the prompt.\nUse {{variable}} for reusable fields."}
            className="min-h-[110px] w-full resize-none rounded-lg border border-zinc-700/50 bg-zinc-800/60 px-3 py-2 text-[12px] leading-6 text-zinc-200 outline-none transition-colors duration-150 placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="writing, coding, product"
            className={inputClass}
          />
          {tags.trim().length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 border border-zinc-700/40">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Color Accent */}
        <div>
          <label className={labelClass}>Color Accent</label>
          <div className="flex items-center gap-2 flex-wrap">
            {colors.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => setColor(candidate)}
                className={cx(
                  "flex w-6 h-6 items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-none",
                  color === candidate ? "ring-2 ring-zinc-400 ring-offset-2 ring-offset-zinc-900" : ""
                )}
                style={{ backgroundColor: COLOR_HEX[candidate] }}
                aria-label={candidate}
              >
                {color === candidate && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* Pin toggle */}
        <button
          type="button"
          onClick={() => setPinned((c) => !c)}
          className={cx(
            "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-none",
            pinned
              ? "border-violet-800/50 bg-violet-950/40 text-zinc-100"
              : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300"
          )}
        >
          <span>Pin to top</span>
          <Pin className={cx("w-3.5 h-3.5", pinned ? "text-violet-400" : "text-zinc-600")} fill={pinned ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800/80 shrink-0">
        <button
          onClick={submit}
          disabled={!canSave}
          className="w-full h-9 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none"
        >
          {saving ? "Saving..." : "Save Prompt"}
        </button>
      </div>
    </div>
  );
}
