import type { FilterTab } from "../types";
import { cx } from "../lib/utils";

const tabs: Array<{ id: FilterTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "pinned", label: "Pinned" },
  { id: "recent", label: "Recent" },
];

export default function TabSwitch({ value, onChange }: { value: FilterTab; onChange: (tab: FilterTab) => void }) {
  return (
    <div className="flex items-center px-4 pt-2.5 shrink-0">
      <div className="flex gap-0.5 bg-zinc-800/60 rounded-lg p-0.5 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              "flex-1 px-3 py-1 text-[11px] font-medium rounded-md transition-all duration-150 focus-visible:outline-none",
              value === tab.id
                ? "bg-zinc-700 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
