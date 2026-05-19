import { BookMarked, Settings, X } from "lucide-react";

interface HeaderProps {
  count: number;
  onSettings: () => void;
  onClose: () => void;
}

export default function Header({ count, onSettings, onClose }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 shrink-0">
      <div className="flex items-center gap-2">
        <BookMarked className="w-4 h-4 text-violet-400" />
        <span className="text-[13px] font-semibold text-zinc-100 tracking-tight">PromptBook</span>
        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md">
          {count} {count === 1 ? "prompt" : "prompts"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onSettings}
          className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors duration-150 focus-visible:outline-none"
          aria-label="Settings"
        >
          <Settings className="w-[15px] h-[15px]" />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors duration-150 focus-visible:outline-none"
          aria-label="Close"
        >
          <X className="w-[15px] h-[15px]" />
        </button>
      </div>
    </div>
  );
}
