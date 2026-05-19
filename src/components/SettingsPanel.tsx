import { ArrowLeft, Download, Keyboard, Shield, Trash2, Upload } from "lucide-react";

interface SettingsPanelProps {
  onBack: () => void;
  onExport: () => void;
  onImport: () => void;
  onDeleteAll: () => void;
}

const rowClass = "flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors duration-150 hover:border-zinc-700 group";
const labelClass = "text-[12px] font-medium text-zinc-300";
const descClass = "text-[10px] text-zinc-600 mt-0.5";
const btnClass = "text-[11px] font-medium px-3 py-1 rounded-md transition-colors duration-150 focus-visible:outline-none";

export default function SettingsPanel({ onBack, onExport, onImport, onDeleteAll }: SettingsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 shrink-0">
        <button
          onClick={onBack}
          className="p-1 rounded-md text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors duration-150 focus-visible:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[13px] font-semibold text-zinc-100">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Shortcuts */}
        <section>
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">Shortcuts</p>
          <div className={rowClass}>
            <div>
              <div className="flex items-center gap-2">
                <Keyboard className="w-3.5 h-3.5 text-zinc-500" />
                <span className={labelClass}>Open PromptBook</span>
              </div>
              <p className={descClass + " ml-5"}>Summon popup from anywhere</p>
            </div>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
              Ctrl+Shift+P
            </kbd>
          </div>
        </section>

        {/* Data */}
        <section>
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">Data Management</p>
          <div className="flex flex-col gap-1.5">
            <button onClick={onExport} className={rowClass + " w-full text-left"}>
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                <span className={labelClass}>Export Library</span>
              </div>
              <span className={btnClass + " bg-zinc-800 text-zinc-400 hover:text-zinc-100"}>JSON</span>
            </button>
            <button onClick={onImport} className={rowClass + " w-full text-left"}>
              <div className="flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-zinc-500" />
                <span className={labelClass}>Import Library</span>
              </div>
              <span className={btnClass + " bg-zinc-800 text-zinc-400 hover:text-zinc-100"}>JSON</span>
            </button>
          </div>
        </section>

        {/* Danger */}
        <section>
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">Danger Zone</p>
          <button onClick={onDeleteAll} className={rowClass + " w-full text-left border-red-900/30 hover:border-red-800/50"}>
            <div className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[12px] font-medium text-red-500">Delete all prompts</span>
            </div>
            <span className="text-[10px] text-red-700">Permanent</span>
          </button>
        </section>

        {/* Privacy note */}
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 mt-auto">
          <Shield className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            All prompts stay in your browser's local storage. Nothing leaves your machine.
          </p>
        </div>
      </div>
    </div>
  );
}
