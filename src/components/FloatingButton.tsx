import { Sparkles } from "lucide-react";

interface FloatingButtonProps {
  onClick: () => void;
  pulse?: boolean;
}

export default function FloatingButton({ onClick, pulse = false }: FloatingButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className={`fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 px-3 py-2 text-[11px] font-semibold text-white shadow-lg shadow-violet-900/40 transition-all duration-150 focus-visible:outline-none ${pulse ? "animate-pulse" : ""}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        PromptBook
      </button>
    </>
  );
}
