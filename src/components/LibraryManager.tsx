import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilePlus2 } from "lucide-react";

import Header from "./Header";
import SearchBar from "./SearchBar";
import TabSwitch from "./TabSwitch";
import TagFilter from "./TagFilter";
import PromptList from "./PromptList";
import NewPromptForm from "./NewPromptForm";
import SettingsPanel from "./SettingsPanel";
import OnboardingModal from "./OnboardingModal";
import EmptyState from "./EmptyState";
import Toast from "./Toast";

import { useToast } from "../hooks/useToast";
import {
  getAllPrompts,
  getSettings,
  incrementUseCount,
  savePrompt,
  setSetting,
  updatePrompt,
  deleteAllPrompts,
  importPrompts,
} from "../lib/db";
import { searchPrompts } from "../lib/search";
import { extractVariables, sortPinnedFirst, uniqueTags } from "../lib/utils";
import type { AppSettings, FilterTab, InjectionResponse, Prompt, PromptDraft } from "../types";

type Screen = "home" | "new" | "settings";

interface LibraryManagerProps {
  onClose?: () => void;
  onInject?: (text: string) => void;
  isFloating?: boolean;
}

export default function LibraryManager({ onClose, onInject, isFloating = false }: LibraryManagerProps) {
  const [screen, setScreen] = useState<Screen>("home");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ onboardingComplete: true });
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast, showToast } = useToast();

  const refresh = useCallback(async () => setPrompts(await getAllPrompts()), []);

  useEffect(() => {
    void Promise.all([refresh(), getSettings().then(setSettings)]);
  }, [refresh]);

  const filteredPrompts = useMemo(() => {
    let list = prompts;
    if (tab === "pinned") list = list.filter((p) => p.pinned);
    if (tab === "recent") list = [...list].sort((a, b) => (b.lastUsed ?? 0) - (a.lastUsed ?? 0) || b.useCount - a.useCount);
    if (selectedTag) list = list.filter((p) => p.tags.includes(selectedTag));
    list = searchPrompts(list, query);
    return sortPinnedFirst(list);
  }, [prompts, query, selectedTag, tab]);

  const allTags = useMemo(() => uniqueTags(prompts), [prompts]);
  const activePrompt = filteredPrompts[activeIndex] ?? null;

  useEffect(() => {
    setActiveIndex(0);
    setExpandedId(null);
  }, [query, selectedTag, tab]);

  const injectText = useCallback(
    async (prompt: Prompt, text: string) => {
      try {
        if (onInject) {
          onInject(text);
          await incrementUseCount(prompt.id);
          await refresh();
          showToast("Injected into chat.", "success");
          if (isFloating && onClose) setTimeout(() => onClose(), 800);
          return;
        }
        const response = await chrome.runtime.sendMessage({ type: "INJECT_PROMPT", text }) as InjectionResponse;
        if (!response.ok) throw new Error(response.error ?? "Could not inject prompt.");
        await incrementUseCount(prompt.id);
        await refresh();
        showToast(response.method === "clipboard" ? "Copied to clipboard." : "Injected into chat.", "success");
        if (!isFloating) setTimeout(() => window.close(), 1200);
        else if (onClose) setTimeout(() => onClose(), 1200);
      } catch (error) {
        await navigator.clipboard.writeText(text);
        await incrementUseCount(prompt.id);
        await refresh();
        showToast(error instanceof Error ? `${error.message} Copied instead.` : "Copied prompt instead.", "error");
      }
    },
    [refresh, showToast, onInject, isFloating, onClose]
  );

  const choosePrompt = useCallback(
    (prompt: Prompt) => {
      const variables = extractVariables(prompt.body);
      if (variables.length > 0) {
        setExpandedId((cur) => (cur === prompt.id ? null : prompt.id));
        setActiveIndex(Math.max(0, filteredPrompts.findIndex((p) => p.id === prompt.id)));
        return;
      }
      void injectText(prompt, prompt.body);
    },
    [filteredPrompts, injectText]
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key.toLowerCase() === "n") { event.preventDefault(); setScreen("new"); }
      if (event.ctrlKey && event.key.toLowerCase() === "f") { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === "ArrowDown" && screen === "home") { event.preventDefault(); setActiveIndex((c) => Math.min(filteredPrompts.length - 1, c + 1)); }
      if (event.key === "ArrowUp" && screen === "home") { event.preventDefault(); setActiveIndex((c) => Math.max(0, c - 1)); }
      if (event.key === "Enter" && screen === "home" && activePrompt) { event.preventDefault(); choosePrompt(activePrompt); }
      if (event.key === "Escape") {
        if (expandedId) setExpandedId(null);
        else if (screen !== "home") setScreen("home");
        else if (onClose) onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePrompt, choosePrompt, expandedId, filteredPrompts.length, screen, onClose]);

  async function createPrompt(draft: PromptDraft) {
    await savePrompt(draft);
    await refresh();
    setScreen("home");
    showToast("Prompt saved.", "success");
  }

  async function togglePin(prompt: Prompt) {
    await updatePrompt(prompt.id, { pinned: !prompt.pinned });
    await refresh();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `promptbook-export-${new Date().toISOString().split("T")[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File) {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const incoming = Array.isArray(parsed) ? parsed : [];
      await importPrompts(incoming);
      await refresh();
      showToast(`Imported ${incoming.length} prompts.`, "success");
    } catch {
      showToast("Invalid JSON file.", "error");
    }
  }

  async function confirmDeleteAll() {
    if (!confirm("Delete all PromptBook prompts? This cannot be undone.")) return;
    await deleteAllPrompts();
    await refresh();
    showToast("All prompts deleted.", "success");
  }

  if (screen === "new") return <NewPromptForm onBack={() => setScreen("home")} onSave={createPrompt} />;
  if (screen === "settings") return <SettingsPanel onBack={() => setScreen("home")} onExport={exportJson} onImport={() => fileRef.current?.click()} onDeleteAll={confirmDeleteAll} />;

  return (
    <div className="flex flex-col h-full bg-[#09090b] relative overflow-hidden popup-enter">
      {/* Hidden file input for import */}
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImport(f); e.target.value = ""; }}
      />

      {/* Onboarding */}
      {!settings.onboardingComplete && (
        <OnboardingModal onComplete={async () => { await setSetting("onboardingComplete", true); setSettings((s) => ({ ...s, onboardingComplete: true })); }} />
      )}

      {/* Header */}
      <Header count={prompts.length} onSettings={() => setScreen("settings")} onClose={() => onClose?.()} />

      {/* Search */}
      <SearchBar ref={searchRef} value={query} onChange={setQuery} />

      {/* Tabs */}
      <TabSwitch value={tab} onChange={(t) => setTab(t)} />

      {/* Tags */}
      <TagFilter tags={allTags} selected={selectedTag} onSelect={setSelectedTag} />

      {/* Divider */}
      <div className="h-px bg-zinc-800/60 mx-4 mt-2.5" />

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <EmptyState onCreate={() => setScreen("new")} />
        ) : (
          <PromptList
            prompts={filteredPrompts}
            activeId={activePrompt?.id ?? null}
            expandedId={expandedId}
            onPromptClick={choosePrompt}
            onTogglePin={togglePin}
            onInject={injectText}
            onCancelVariables={() => setExpandedId(null)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800/80 shrink-0">
        <button
          onClick={() => setScreen("new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold transition-colors duration-150 focus-visible:outline-none"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          New Prompt
        </button>
        <span className="text-[10px] text-zinc-700 font-mono border border-zinc-800 px-2 py-0.5 rounded-md">
          Local · Secure
        </span>
      </div>

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
}
