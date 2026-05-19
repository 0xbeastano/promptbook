import Dexie, { type Table } from "dexie";
import type { AppSettings, Prompt, PromptDraft, SettingRecord } from "../types";

class PromptBookDB extends Dexie {
  prompts!: Table<Prompt, string>;
  settings!: Table<SettingRecord, string>;

  constructor() {
    super("PromptBookDB");
    this.version(1).stores({
      prompts: "id, title, *tags, color, pinned, useCount, createdAt, updatedAt",
      settings: "key"
    });
  }
}

export const db = new PromptBookDB();

const DEFAULT_SETTINGS: AppSettings = { onboardingComplete: false };

export async function getAllPrompts(): Promise<Prompt[]> {
  return db.prompts.orderBy("updatedAt").reverse().toArray();
}

export async function getRecentPrompts(limit: number): Promise<Prompt[]> {
  return db.prompts.orderBy("updatedAt").reverse().limit(limit).toArray();
}

export async function savePrompt(data: PromptDraft): Promise<Prompt> {
  const now = Date.now();
  const prompt: Prompt = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    body: data.body,
    tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
    color: data.color,
    pinned: data.pinned,
    useCount: 0,
    createdAt: now,
    updatedAt: now
  };
  await db.prompts.add(prompt);
  return prompt;
}

export async function updatePrompt(id: string, partial: Partial<Omit<Prompt, "id" | "createdAt">>): Promise<void> {
  await db.prompts.update(id, { ...partial, updatedAt: Date.now() });
}

export async function deletePrompt(id: string): Promise<void> {
  await db.prompts.delete(id);
}

export async function incrementUseCount(id: string): Promise<void> {
  await db.transaction("rw", db.prompts, async () => {
    const prompt = await db.prompts.get(id);
    if (!prompt) return;
    await db.prompts.update(id, {
      useCount: prompt.useCount + 1,
      lastUsed: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.settings.toArray();
  return rows.reduce<AppSettings>((settings, row) => ({ ...settings, [row.key]: row.value }), DEFAULT_SETTINGS);
}

export async function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
  await db.settings.put({ key, value } as SettingRecord<K>);
}

function isValidPrompt(p: unknown): p is Prompt {
  if (typeof p !== "object" || p === null) return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.body === "string" &&
    Array.isArray(o.tags)
  );
}

export async function importPrompts(prompts: unknown[]): Promise<void> {
  const valid = prompts.filter(isValidPrompt);
  if (valid.length > 0) await db.prompts.bulkPut(valid);
}

export async function deleteAllPrompts(): Promise<void> {
  await db.prompts.clear();
}
