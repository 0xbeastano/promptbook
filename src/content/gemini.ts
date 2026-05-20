function findGeminiInput(): HTMLElement | null {
  // If the user is currently focused on a valid textbox, use that
  if (document.activeElement instanceof HTMLElement && 
     (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.getAttribute('contenteditable') === 'true')) {
    return document.activeElement;
  }

  return document.querySelector<HTMLElement>('div[contenteditable="true"][role="textbox"]') ||
    document.querySelector<HTMLElement>('.input-area-container div[contenteditable="true"]') ||
    document.querySelector<HTMLElement>('div[contenteditable="true"]') ||
    document.querySelector<HTMLElement>('textarea');
}

export function injectIntoGemini(text: string): boolean {
  const input = findGeminiInput();
  if (!input) return false;

  // Focus only if not already focused
  if (document.activeElement !== input) {
    input.focus();
  }

  // 1. Try execCommand (most reliable for rich editors like Gemini)
  try {
    if (document.queryCommandEnabled('insertText')) {
      const success = document.execCommand('insertText', false, text);
      if (success) return true;
    }
  } catch (e) {
    console.debug("[PromptBook] Gemini execCommand failed", e);
  }

  // 2. Fallback for contenteditable — append at cursor
  const textNode = document.createTextNode(text);
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    input.appendChild(textNode);
  }
  
  // Trigger standard events to notify editor framework
  input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  return true;
}
