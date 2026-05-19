import type { Prompt } from "../types";
import PromptCard from "./PromptCard";

interface PromptListProps {
  prompts: Prompt[];
  activeId: string | null;
  expandedId: string | null;
  onPromptClick: (prompt: Prompt) => void;
  onTogglePin: (prompt: Prompt) => void;
  onInject: (prompt: Prompt, text: string) => void;
  onCancelVariables: () => void;
}

export default function PromptList({
  prompts,
  activeId,
  expandedId,
  onPromptClick,
  onTogglePin,
  onInject,
  onCancelVariables,
}: PromptListProps) {
  return (
    <div className="flex flex-col gap-1.5 px-4 py-3">
      {prompts.map((prompt, index) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          active={prompt.id === activeId}
          expanded={prompt.id === expandedId}
          onPromptClick={onPromptClick}
          onTogglePin={onTogglePin}
          onInject={onInject}
          onCancelVariables={onCancelVariables}
          animationDelay={index * 35}
        />
      ))}
    </div>
  );
}
