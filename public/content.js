// content.js - Runs on web pages with code editors

let currentEditor = null;
let suggestionBox = null;
let debounceTimer = null;

// Initialize
init();

function init() {
  createSuggestionBox();
  detectEditors();
  
  // Listen for messages from popup or background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertCode') {
      insertCodeIntoEditor(request.code);
      sendResponse({ success: true });
    } else if (request.action === 'getSelectedCode') {
      const code = getSelectedCode();
      sendResponse({ code: code });
    } else if (request.action === 'replaceCode') {
      replaceSelectedCode(request.code);
      sendResponse({ success: true });
    } else if (request.action === 'autoCorrect') {
      // Triggered by keyboard shortcut
      const selectedCode = getSelectedCode();
      if (selectedCode) {
        showNotification('Auto-correcting...', 'info');
        chrome.runtime.sendMessage({ action: 'autoCorrect', code: selectedCode }, (response) => {
            if (response && response.code) {
                replaceSelectedCode(response.code);
            } else {
                showNotification(response.error || 'Failed to auto-correct', 'error');
            }
        });
      } else {
        showNotification('Please select code to auto-correct', 'error');
      }
      sendResponse({ success: true });
    } else if (request.action === 'generateCode') {
       // Triggered by keyboard shortcut
      const prompt = window.prompt('Describe the code you want to generate:');
      if (prompt) {
        showNotification('Generating code...', 'info');
        chrome.runtime.sendMessage({ action: 'generate', prompt: prompt }, (response) => {
            if (response && response.code) {
                insertCodeIntoEditor(response.code);
            } else {
                showNotification(response.error || 'Failed to generate code', 'error');
            }
        });
      }
      sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
  });

}

function createSuggestionBox() {
  suggestionBox = document.createElement('div');
  suggestionBox.id = 'ai-code-suggestion-box';
  document.body.appendChild(suggestionBox);
}

function detectEditors() {
  // Function to attach listeners
  const attachToEditor = (editor) => {
    if (editor.dataset.aiAssistantAttached) return;
    editor.dataset.aiAssistantAttached = 'true';

    editor.addEventListener('focus', () => {
      currentEditor = editor;
    });

    editor.addEventListener('input', () => {
      currentEditor = editor;
      
      // Debounce suggestions
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        provideSuggestion(editor);
      }, 1000);
    });

    editor.addEventListener('blur', () => {
      setTimeout(() => {
        if (currentEditor === editor) {
          hideSuggestion();
        }
      }, 200);
    });
  };

  // Initial scan
  document.querySelectorAll('textarea, [contenteditable="true"]').forEach(attachToEditor);

  // Watch for dynamically added editors
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Check if it's an element
          if (node.matches('textarea, [contenteditable="true"]')) {
            attachToEditor(node);
          }
          node.querySelectorAll('textarea, [contenteditable="true"]').forEach(attachToEditor);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}


async function provideSuggestion(editor) {
  const code = getEditorValue(editor);
  if (!code || code.length < 10) {
    hideSuggestion();
    return;
  }

  // Check for incomplete code patterns
  const suggestions = analyzeCode(code);
  
  if (suggestions.length > 0) {
    showSuggestion(suggestions[0], editor);
  } else {
    hideSuggestion();
  }
}

function analyzeCode(code) {
  const suggestions = [];
  
  // Check for common issues
  if (code.includes('console.log') && !code.includes(';')) {
    suggestions.push('💡 Add semicolon at end of console.log statement');
  }
  
  if (code.includes('function') && !code.includes('{')) {
    suggestions.push('💡 Add opening brace { after function declaration');
  }
  
  if ((code.match(/{/g) || []).length > (code.match(/}/g) || []).length) {
    suggestions.push('⚠️ Missing closing brace }');
  }
  
  if ((code.match(/\(/g) || []).length > (code.match(/\)/g) || []).length) {
    suggestions.push('⚠️ Missing closing parenthesis )');
  }
  
  if (code.includes('if') && !code.includes('(')) {
    suggestions.push('💡 Add condition in parentheses after if');
  }
  
  if (code.includes('for') && !code.includes('(')) {
    suggestions.push('💡 Add loop parameters in parentheses');
  }

  return suggestions;
}

function showSuggestion(text, editor) {
  const rect = editor.getBoundingClientRect();
  suggestionBox.textContent = text;
  suggestionBox.style.display = 'block';
  suggestionBox.style.top = `${rect.bottom + window.scrollY + 5}px`;
  suggestionBox.style.left = `${rect.left + window.scrollX}px`;
}

function hideSuggestion() {
  if (suggestionBox) {
    suggestionBox.style.display = 'none';
  }
}

function getEditorValue(editor) {
  if (!editor) return '';
  if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
    return editor.value;
  } else if (editor.contentEditable === 'true') {
    return editor.textContent || editor.innerText;
  }
  return '';
}

function setEditorValue(editor, value) {
  if (!editor) return;
  if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
    editor.value = value;
  } else if (editor.contentEditable === 'true') {
    editor.textContent = value;
  }
  // Dispatch an input event to notify frameworks like React
  editor.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function getSelectedCode() {
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    return selection.toString();
  }
  
  if (document.activeElement) {
    const activeEl = document.activeElement;
    if (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT') {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      if (start !== end) {
        return activeEl.value.substring(start, end);
      }
    }
  }
  
  return '';
}

function replaceSelectedCode(newCode) {
  const activeEl = document.activeElement;
  if (!activeEl) {
    showNotification('No active editor found to replace code.', 'error');
    return;
  }

  if (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT') {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      const value = activeEl.value;
      
      activeEl.value = value.substring(0, start) + newCode + value.substring(end);
      
      // Move cursor to end of inserted text
      activeEl.selectionStart = activeEl.selectionEnd = start + newCode.length;

      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      showNotification('Code replaced!', 'success');
  } else if (activeEl.contentEditable === 'true') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(newCode));
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        showNotification('Code replaced!', 'success');
      }
  } else {
    showNotification('Could not replace code in the current element.', 'error');
  }
}

function insertCodeIntoEditor(code) {
  const editor = currentEditor || document.activeElement;
  if (editor && (editor.tagName === 'TEXTAREA' || editor.contentEditable === 'true')) {
    setEditorValue(editor, code);
    showNotification('Code inserted!', 'success');
  } else {
    // Fallback to finding any editor
    const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
    if (editors.length > 0) {
      setEditorValue(editors[0], code);
      showNotification('Code inserted into the first available editor.', 'success');
    } else {
      navigator.clipboard.writeText(code);
      showNotification('No editor found. Code copied to clipboard.', 'error');
    }
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `ai-code-assistant-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
