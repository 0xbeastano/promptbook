// FILE: src/background/index.ts
import type { InjectionResponse } from "../types";
import * as db from "../lib/dbServer";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-selection-to-promptbook",
    title: "Save selection to PromptBook",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "save-selection-to-promptbook" || !info.selectionText) return;
  const body = info.selectionText.replace(/<[^>]*>/g, "").trim().slice(0, 5000);
  if (!body) return;
  
  chrome.storage.local.set({ 
    pendingSelection: body,
    pendingSource: info.pageUrl 
  }, () => {
    console.info("PromptBook selection captured. Open popup to save.");
    void chrome.action.openPopup?.();
  });
});

async function sendToActiveTab(text: string): Promise<InjectionResponse> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { ok: false, error: "No active tab found." };
  
  const url = tab.url ?? "";
  const isSupported = url.includes("chatgpt.com") || url.includes("chat.openai.com") || url.includes("claude.ai") || url.includes("perplexity.ai");
  
  if (!isSupported) {
    return { ok: false, error: "Open ChatGPT or Claude first." };
  }

  try {
    return await chrome.tabs.sendMessage(tab.id, { type: "INJECT_PROMPT", text }) as InjectionResponse;
  } catch {
    await chrome.scripting.executeScript({ 
      target: { tabId: tab.id }, 
      files: ["content.js"] 
    });
    // Wait for content script to initialise its listener
    await new Promise((r) => setTimeout(r, 300));
    try {
      return await chrome.tabs.sendMessage(tab.id, { type: "INJECT_PROMPT", text }) as InjectionResponse;
    } catch {
      return { ok: false, error: "Content script not ready. Copy to clipboard instead." };
    }
  }
}

chrome.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
  if (message.type === "INJECT_PROMPT") {
    void sendToActiveTab(message.text).then(sendResponse);
    return true;
  }
  
  if (message.type === "DB_GET_ALL_PROMPTS") {
    db.getAllPrompts()
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_GET_ALL_PROMPTS error:", err);
        sendResponse([]);
      });
    return true;
  }
  
  if (message.type === "DB_GET_RECENT_PROMPTS") {
    db.getRecentPrompts(message.limit)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_GET_RECENT_PROMPTS error:", err);
        sendResponse([]);
      });
    return true;
  }
  
  if (message.type === "DB_SAVE_PROMPT") {
    db.savePrompt(message.data)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_SAVE_PROMPT error:", err);
        sendResponse(null);
      });
    return true;
  }
  
  if (message.type === "DB_UPDATE_PROMPT") {
    db.updatePrompt(message.id, message.partial)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_UPDATE_PROMPT error:", err);
        sendResponse(undefined);
      });
    return true;
  }
  
  if (message.type === "DB_DELETE_PROMPT") {
    db.deletePrompt(message.id)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_DELETE_PROMPT error:", err);
        sendResponse(undefined);
      });
    return true;
  }
  
  if (message.type === "DB_INCREMENT_USE_COUNT") {
    db.incrementUseCount(message.id)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_INCREMENT_USE_COUNT error:", err);
        sendResponse(undefined);
      });
    return true;
  }
  
  if (message.type === "DB_GET_SETTINGS") {
    db.getSettings()
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_GET_SETTINGS error:", err);
        sendResponse({ onboardingComplete: true });
      });
    return true;
  }
  
  if (message.type === "DB_SET_SETTING") {
    db.setSetting(message.key, message.value)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_SET_SETTING error:", err);
        sendResponse(undefined);
      });
    return true;
  }
  
  if (message.type === "DB_IMPORT_PROMPTS") {
    db.importPrompts(message.prompts)
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_IMPORT_PROMPTS error:", err);
        sendResponse(undefined);
      });
    return true;
  }
  
  if (message.type === "DB_DELETE_ALL_PROMPTS") {
    db.deleteAllPrompts()
      .then(sendResponse)
      .catch((err) => {
        console.error("DB_DELETE_ALL_PROMPTS error:", err);
        sendResponse(undefined);
      });
    return true;
  }

  return false;
});
