function findChatGPTInput(): HTMLElement | null {
  // If the user is currently focused on something, that's our best target
  if (document.activeElement instanceof HTMLElement && 
     (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.getAttribute('contenteditable') === 'true')) {
    return document.activeElement;
  }

  return document.querySelector<HTMLElement>('textarea[data-id="root"]') ||
    document.querySelector<HTMLElement>('div[contenteditable="true"][data-testid]') ||
    document.querySelector<HTMLElement>('.ProseMirror[contenteditable="true"]') ||
    document.querySelector<HTMLElement>('textarea[placeholder*="Message"]') ||
    document.querySelector<HTMLElement>('textarea');
}

export function injectIntoChatGPT(text: string): boolean {
  const input = findChatGPTInput();
  if (!input) return false;

  // Focus only if not already focused
  if (document.activeElement !== input) {
    input.focus();
  }

  // 1. Try execCommand (Immediate, no freeze)
  try {
    if (document.queryCommandEnabled('insertText')) {
      const success = document.execCommand('insertText', false, text);
      if (success) return true;
    }
  } catch (e) {
    console.debug("[PromptBook] ChatGPT execCommand failed", e);
  }

  // 2. Fallback for standard Textarea
  if (input instanceof HTMLTextAreaElement) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.substring(0, start) + text + val.substring(end);
    input.selectionStart = input.selectionEnd = start + text.length;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  // 3. Fallback for contenteditable — append at cursor, don't overwrite
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
  input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  return true;
}
