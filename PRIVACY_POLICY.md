# Privacy Policy for PromptBook

**Effective Date:** May 20, 2026

PromptBook is a local-first, privacy-focused Chrome Extension. We respect your privacy and are committed to protecting it. This Privacy Policy explains how data is handled when you use the PromptBook Chrome Extension.

---

## 1. Zero Data Collection & Transmission
PromptBook does **NOT** collect, transmit, store, or share any of your personal data, browser history, search terms, or prompt contents with external servers.
- **Local-Only Storage**: All prompts, tags, settings, and configurations are stored locally on your device using IndexedDB (via Dexie) and `chrome.storage.local`. 
- **No Analytics**: We do not use third-party analytics trackers, cookies, or remote logging libraries.
- **No Accounts**: You do not need to sign in or create an account to use any of the features in PromptBook.

---

## 2. Explanation of Requested Permissions
PromptBook requires specific permissions inside Chrome's Manifest V3 to perform its core offline features. Here is how each permission is used:

| Permission | Purpose |
| :--- | :--- |
| `storage` | Saves settings such as onboarding status. |
| `contextMenus` | Enables the "Save selection to PromptBook" right-click action on websites. |
| `clipboardWrite` | Provides a fallback mechanism to copy prompt text to your clipboard if direct page injection is blocked. |
| `activeTab` | Allows the extension to safely focus and interact with the active chat box when triggered. |
| `scripting` | Programmatically injects the content script into supported LLM interfaces to enable prompt insertion. |

---

## 3. Host Permissions (Scope of Operation)
PromptBook is allowed to execute content scripts only on the following supported LLM interface domains:
- `https://chatgpt.com/*` & `https://chat.openai.com/*`
- `https://claude.ai/*`
- `https://www.perplexity.ai/*`
- `https://gemini.google.com/*`

We do not execute scripts, track pages, or interact with DOM elements on any other websites.

---

## 4. User Rights & Data Portability
Since your data belongs completely to you, you have full control over it at all times via the **Settings** panel:
- **Export**: You can export your entire prompt library as a single `.json` file at any time.
- **Import**: You can load previously backed-up prompt JSON files into PromptBook.
- **Deletion**: You can purge the local database completely using the "Delete all prompts" action. Once clicked, this action is permanent and cannot be undone.

---

## 5. Changes to This Policy
We may update our Privacy Policy from time to time. Since the extension is open source, any changes to how permissions are utilized will be visible in the public source code repository.

---

## Contact
If you have any questions or feedback, please open an issue on our GitHub repository:  
👉 **[https://github.com/0xbeastano/promptbook](https://github.com/0xbeastano/promptbook)**
