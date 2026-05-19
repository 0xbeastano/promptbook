export type PromptColor = "slate" | "blue" | "emerald" | "amber" | "rose" | "indigo" | "cyan" | "orange";

export interface Prompt {
  id: string;
  title: string;
  body: string;
  tags: string[];
  color: PromptColor;
  pinned: boolean;
  useCount: number;
  createdAt: number;
  updatedAt: number;
  lastUsed?: number;
}

export interface AppSettings {
  onboardingComplete: boolean;
  injectOnSelect?: boolean;
}

export interface SettingRecord<K extends keyof AppSettings = keyof AppSettings> {
  key: K;
  value: AppSettings[K];
}

export type PromptDraft = Pick<Prompt, "title" | "body" | "tags" | "color" | "pinned">;

export type FilterTab = "all" | "pinned" | "recent";

export interface InjectPromptMessage {
  type: "INJECT_PROMPT";
  text: string;
}

export interface GetRecentPromptsMessage {
  type: "GET_RECENT_PROMPTS";
  limit: number;
}

export type InjectionResponse =
  | { ok: true; method?: 'dom' | 'clipboard' }
  | { ok: false; error: string };

export type VariableState = Record<string, string>;

export type RuntimeMessage = InjectPromptMessage | GetRecentPromptsMessage;

export type ToastType = 'success' | 'error' | 'info';
