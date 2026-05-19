function findClaudeInput(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[contenteditable="true"].ProseMirror') ||
    document.querySelector<HTMLElement>('[contenteditable="true"][data-testid*="chat"]') ||
    document.querySelector<HTMLElement>('div[contenteditable="true"]');
}

export function injectIntoClaude(text: string): boolean {
  const input = findClaudeInput();
  if (!input) return false;

  input.focus();

  // 1. Try execCommand
  try {
    if (document.queryCommandEnabled('insertText')) {
      document.execCommand('insertText', false, text);
      return true;
    }
  } catch (e) {
    console.debug("[PromptBook] Claude execCommand failed", e);
  }

  // 2. Fallback — append at cursor, don't overwrite
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
