import type { AppSettings, Prompt, PromptDraft } from "../types";

export async function getAllPrompts(): Promise<Prompt[]> {
  return chrome.runtime.sendMessage({ type: "DB_GET_ALL_PROMPTS" });
}

export async function getRecentPrompts(limit: number): Promise<Prompt[]> {
  return chrome.runtime.sendMessage({ type: "DB_GET_RECENT_PROMPTS", limit });
}

export async function savePrompt(data: PromptDraft): Promise<Prompt> {
  return chrome.runtime.sendMessage({ type: "DB_SAVE_PROMPT", data });
}

export async function updatePrompt(id: string, partial: Partial<Omit<Prompt, "id" | "createdAt">>): Promise<void> {
  return chrome.runtime.sendMessage({ type: "DB_UPDATE_PROMPT", id, partial });
}

export async function deletePrompt(id: string): Promise<void> {
  return chrome.runtime.sendMessage({ type: "DB_DELETE_PROMPT", id });
}

export async function incrementUseCount(id: string): Promise<void> {
  return chrome.runtime.sendMessage({ type: "DB_INCREMENT_USE_COUNT", id });
}

export async function getSettings(): Promise<AppSettings> {
  return chrome.runtime.sendMessage({ type: "DB_GET_SETTINGS" });
}

export async function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
  return chrome.runtime.sendMessage({ type: "DB_SET_SETTING", key, value });
}

export async function importPrompts(prompts: unknown[]): Promise<void> {
  return chrome.runtime.sendMessage({ type: "DB_IMPORT_PROMPTS", prompts });
}

export async function deleteAllPrompts(): Promise<void> {
  return chrome.runtime.sendMessage({ type: "DB_DELETE_ALL_PROMPTS" });
}
