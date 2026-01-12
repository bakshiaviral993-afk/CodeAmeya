chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TRIGGER_AUTOCORRECT") {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable || activeEl.tagName === 'INPUT')) {
      const code = activeEl.value || activeEl.textContent;
      if (!code) {
        sendResponse({ ok: false, error: "No active element with content found." });
        return;
      }

      chrome.storage.sync.get(['language'], (result) => {
        const language = result.language || 'JavaScript';
        chrome.runtime.sendMessage(
          { type: "AUTO_CORRECT", code: code, language: language },
          (resp) => {
            if (resp && resp.corrected) {
              if (activeEl.value !== undefined) {
                activeEl.value = resp.corrected;
              } else if (activeEl.textContent !== undefined) {
                activeEl.textContent = resp.corrected;
              }
              sendResponse({ ok: true });
            } else {
              sendResponse({ ok: false, error: "Auto-correct failed." });
            }
          }
        );
      });
    } else {
        sendResponse({ ok: false, error: "No active editable element found." });
    }
    return true; // Indicates async response
  }
});

let suggestionDebounceTimeout;
const handleInput = (e) => {
  chrome.storage.sync.get(['enabled', 'language'], (result) => {
    if (!result.enabled) return;

    clearTimeout(suggestionDebounceTimeout);
    suggestionDebounceTimeout = setTimeout(() => {
      const el = e.target;
      const partial = el.value || el.textContent;
      const language = result.language || 'JavaScript';

      if (partial && partial.length > 10) { // Only suggest for non-trivial input
        chrome.runtime.sendMessage(
          { type: "REALTIME_SUGGEST", content: partial, language: language },
          (resp) => {
            if (resp && resp.suggestion) {
              // For demonstration, we'll log the suggestion.
              // A real implementation would display this in the UI.
              console.log('Code Gemini Suggestion:', resp.suggestion);
            }
          }
        );
      }
    }, 500); // 500ms debounce
  });
};

// Listen for input events on the document to capture typing in various elements.
document.addEventListener('input', handleInput, true);
