import { FilePlus2 } from "lucide-react";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14 px-8 text-center">
      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
        <FilePlus2 className="w-5 h-5 text-zinc-500" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-medium text-zinc-300">No prompts yet</p>
        <p className="text-[11px] text-zinc-600 max-w-[200px] leading-relaxed">
          Save prompts to inject them directly into ChatGPT or Claude.
        </p>
      </div>
      <button
        onClick={onCreate}
        className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors duration-150 focus-visible:outline-none"
      >
        Create first prompt
      </button>
      <p className="text-[10px] text-zinc-700">
        Or right-click any text → Save to PromptBook
      </p>
    </div>
  );
}
