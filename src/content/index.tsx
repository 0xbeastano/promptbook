import { createRoot } from "react-dom/client";
import FloatingUI from "./FloatingUI";
import { injectIntoChatGPT } from "./chatgpt";
import { injectIntoClaude } from "./claude";
import { injectIntoPerplexity } from "./perplexity";
import "./styles.css";

function init() {
  console.log("[PromptBook] Initializing floating UI...");
  let lastFocusedInput: HTMLElement | null = null;
  
  const container = document.createElement("div");
  container.id = "promptbook-floating-root";
  container.style.position = "fixed";
  container.style.left = "0";
  container.style.top = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.zIndex = "2147483647";
  container.style.pointerEvents = "none";
  
  // Prevent host pages (like Claude) from stealing focus when typing in our UI
  container.addEventListener("keydown", (e) => e.stopPropagation());
  container.addEventListener("keyup", (e) => e.stopPropagation());
  container.addEventListener("keypress", (e) => e.stopPropagation());
  
  const shadow = container.attachShadow({ mode: "open" });
  const rootElement = document.createElement("div");
  shadow.appendChild(rootElement);

  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = chrome.runtime.getURL("content.css");
  shadow.appendChild(styleLink);

  document.body.appendChild(container);

  const handleInject = (text: string) => {
    const host = window.location.hostname;
    if (host.includes("claude.ai")) {
      injectIntoClaude(text);
    } else if (host.includes("perplexity.ai")) {
      injectIntoPerplexity(text);
    } else {
      injectIntoChatGPT(text);
    }
  };

  const handleToggle = () => {
    // Left for potential future customization
  };

  const root = createRoot(rootElement);
  
  const render = () => {
    root.render(
      <FloatingUI 
        activeInput={lastFocusedInput} 
        onInject={handleInject} 
        onToggle={handleToggle} 
      />
    );
  };

  const isSupportedInput = (el: Element | null): el is HTMLElement => {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    const isTextarea = tag === 'textarea';
    const isContentEditable = el.getAttribute('contenteditable') === 'true';
    const isProseMirror = el.classList.contains('ProseMirror');
    return isTextarea || isContentEditable || isProseMirror;
  };

  // Event listener to track focus like Grammarly
  document.addEventListener("focusin", (e) => {
    const target = e.target as HTMLElement;
    if (isSupportedInput(target)) {
      lastFocusedInput = target;
      render();
    }
  }, true);

  // Fallback check to find the initial input on startup
  const initialCheck = () => {
    const input = document.activeElement;
    if (isSupportedInput(input)) {
      lastFocusedInput = input as HTMLElement;
    }
    render();
  };

  initialCheck();

  // Periodically check if the tracked input is still in the document
  setInterval(() => {
    if (lastFocusedInput && !document.body.contains(lastFocusedInput)) {
      lastFocusedInput = null;
      render();
    }
  }, 1000);
}

// Runtime message listener
chrome.runtime.onMessage.addListener((message: { type: string; text?: string }, _sender, sendResponse) => {
  if (message.type !== "INJECT_PROMPT" || typeof message.text !== "string") return false;
  try {
    const host = window.location.hostname;
    let ok = false;
    if (host.includes("claude.ai")) {
      ok = injectIntoClaude(message.text);
    } else if (host.includes("perplexity.ai")) {
      ok = injectIntoPerplexity(message.text);
    } else {
      ok = injectIntoChatGPT(message.text);
    }
    sendResponse(ok ? { ok: true } : { ok: false, error: "Prompt input not found." });
  } catch (error) {
    sendResponse({ ok: false, error: error instanceof Error ? error.message : "Injection failed." });
  }
  return true;
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
