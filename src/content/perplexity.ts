export function injectIntoPerplexity(text: string): boolean {
  const input = document.querySelector<HTMLTextAreaElement | HTMLElement>('textarea[placeholder*="Ask"], textarea, [contenteditable="true"]');
  if (!input) return false;

  input.focus();
  
  try {
    // Try execCommand first as it's the most reliable for complex editors
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      document.execCommand('insertText', false, text);
      return true;
    }
  } catch (e) {
    console.error("[PromptBook] execCommand failed", e);
  }

  if (input instanceof HTMLTextAreaElement) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.substring(0, start) + text + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + text.length;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    // Append at cursor, don't overwrite
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
  }

  return true;
}
