import Fuse from "fuse.js";
import type { Prompt } from "../types";

export function buildPromptIndex(prompts: Prompt[]): Fuse<Prompt> {
  return new Fuse(prompts, {
    keys: ["title", "body", "tags"],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true
  });
}

export function searchPrompts(prompts: Prompt[], query: string): Prompt[] {
  const trimmed = query.trim();
  if (!trimmed) return prompts;
  return buildPromptIndex(prompts).search(trimmed).map((result) => result.item);
}

export function createSearchIndex(prompts: Prompt[]): Fuse<Prompt> {
  return buildPromptIndex(prompts);
}
