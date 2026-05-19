import type { Prompt, PromptColor } from "../types";

export const COLORS: Record<PromptColor, string> = {
  slate:   "bg-slate-500",
  blue:    "bg-blue-500",
  emerald: "bg-emerald-500",
  amber:   "bg-amber-400",
  rose:    "bg-rose-500",
  indigo:  "bg-indigo-500",
  cyan:    "bg-cyan-500",
  orange:  "bg-orange-500"
};

export const COLOR_HEX: Record<PromptColor, string> = {
  slate:   "#64748b",
  blue:    "#3b82f6",
  emerald: "#10b981",
  amber:   "#f59e0b",
  rose:    "#f43f5e",
  indigo:  "#6366f1",
  cyan:    "#06b6d4",
  orange:  "#f97316"
};

export function generateId(): string {
  return crypto.randomUUID();
}

export function extractVariables(body: string): string[] {
  const found = body.matchAll(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g);
  return Array.from(new Set(Array.from(found, (match) => match[1])));
}

export function renderTemplate(body: string, values: Record<string, string>): string {
  return body.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_match, key: string) => values[key] ?? "");
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.max(1, Math.floor(diff / 60000));
  if (min < 60) return `${min}m ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function sortPinnedFirst(prompts: Prompt[]): Prompt[] {
  return [...prompts].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
}

export function uniqueTags(prompts: Prompt[]): string[] {
  return Array.from(new Set(prompts.flatMap((prompt) => prompt.tags))).sort((a, b) => a.localeCompare(b));
}

export function timeAgo(timestamp: number): string {
  return formatRelativeTime(timestamp);
}
