import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
}

export default function SectionHeader({ icon, label, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
      <span className="text-zinc-600 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>
      <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] font-mono text-zinc-700">{count}</span>
      )}
    </div>
  );
}
