import { cx } from "../lib/utils";

interface TagFilterProps {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selected, onSelect }: TagFilterProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 px-4 pt-2 pb-0 overflow-x-auto shrink-0 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={cx(
          "shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors duration-100 focus-visible:outline-none border",
          selected === null
            ? "bg-violet-950/70 text-violet-300 border-violet-800/50"
            : "bg-zinc-800 text-zinc-500 border-zinc-700/40 hover:text-zinc-300"
        )}
      >
        All tags
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(selected === tag ? null : tag)}
          className={cx(
            "shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors duration-100 focus-visible:outline-none border",
            selected === tag
              ? "bg-violet-950/70 text-violet-300 border-violet-800/50"
              : "bg-zinc-800 text-zinc-500 border-zinc-700/40 hover:text-zinc-300"
          )}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
