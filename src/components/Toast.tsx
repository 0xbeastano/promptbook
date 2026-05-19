import type { ToastState } from "../hooks/useToast";
import { cx } from "../lib/utils";

export default function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  return (
    <div
      className={cx(
        "absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium shadow-lg border toast-enter z-50",
        toast.type === "success"
          ? "bg-zinc-900 border-zinc-700 text-zinc-100"
          : "bg-zinc-900 border-red-900/60 text-red-400"
      )}
    >
      <span
        className={cx(
          "w-1.5 h-1.5 rounded-full shrink-0",
          toast.type === "success" ? "bg-emerald-400" : "bg-red-400"
        )}
      />
      {toast.message}
    </div>
  );
}
