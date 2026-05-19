import { Search } from "lucide-react";
import { forwardRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ value, onChange }, ref) => (
  <div className="relative px-4 pt-3 pb-0 shrink-0">
    <Search className="absolute left-7 top-1/2 mt-1.5 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search prompts..."
      className="h-9 w-full rounded-lg border border-zinc-700/50 bg-zinc-800/60 pl-8 pr-3 text-[13px] text-zinc-200 outline-none transition-colors duration-150 placeholder:text-zinc-600 focus:border-zinc-600"
    />
  </div>
));

SearchBar.displayName = "SearchBar";

export default SearchBar;
