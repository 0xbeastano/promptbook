import { ArrowLeft, ArrowRight, BookMarked, MousePointerClick, Tags } from "lucide-react";
import { useState } from "react";
import { cx } from "../lib/utils";

const steps = [
  { title: "Launch fast", text: "Open with Ctrl+Shift+P from any tab.", icon: BookMarked },
  { title: "Keep prompts tidy", text: "Save with tags and color accents for quick filtering.", icon: Tags },
  { title: "Inject in place", text: "Click any prompt to send it straight into ChatGPT or Claude.", icon: MousePointerClick },
];

export default function OnboardingModal({ onComplete }: { onComplete: () => Promise<void> }) {
  const [step, setStep] = useState(0);
  const last = step === steps.length - 1;
  const CurrentIcon = steps[step].icon;

  return (
    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-72 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center gap-5 shadow-2xl onboard-enter">
        <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center">
          <CurrentIcon className="w-5 h-5 text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-zinc-100 mb-1">{steps[step].title}</p>
          <p className="text-[12px] text-zinc-500 leading-relaxed">{steps[step].text}</p>
        </div>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cx(
                "w-1.5 h-1.5 rounded-full transition-all duration-200",
                i === step ? "bg-violet-400 w-4" : "bg-zinc-700"
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => setStep((c) => Math.max(0, c - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors duration-150 focus-visible:outline-none disabled:opacity-0"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
          <button
            onClick={() => (last ? onComplete() : setStep((c) => c + 1))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-[11px] font-medium text-white transition-colors duration-150 hover:bg-violet-500 focus-visible:outline-none"
          >
            {last ? "Get started" : "Next"} {!last && <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}
