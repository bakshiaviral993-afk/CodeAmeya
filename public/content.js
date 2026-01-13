// content.js - Runs on web pages with code editors

// Detect code editors (textarea, contenteditable, Monaco, CodeMirror, etc.)
let currentEditor = null;
let suggestionBox = null;
let debounceTimer = null;

// Initialize
init();

function init() {
  createSuggestionBox();
  detectEditors();
  
  // Listen for messages from popup
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
    }
    return true;
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+F: Auto-correct
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      autoCorrectSelection();
    }
    
    // Ctrl+Shift+G: Generate code
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      openGenerateDialog();
    }
  });
}

function createSuggestionBox() {
  suggestionBox = document.createElement('div');
  suggestionBox.id = 'ai-code-suggestion-box';
  suggestionBox.style.cssText = `
    position: fixed;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    display: none;
    max-width: 400px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 13px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  `;
  document.body.appendChild(suggestionBox);
}

function detectEditors() {
  // Detect textareas
  document.querySelectorAll('textarea').forEach(textarea => {
    attachToEditor(textarea);
  });

  // Detect contenteditable elements
  document.querySelectorAll('[contenteditable="true"]').forEach(element => {
    attachToEditor(element);
  });

  // Watch for dynamically added editors
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.tagName === 'TEXTAREA' || node.contentEditable === 'true') {
            attachToEditor(node);
          }
          // Check children
          node.querySelectorAll?.('textarea, [contenteditable="true"]').forEach(attachToEditor);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function attachToEditor(editor) {
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
  suggestionBox.style.display = 'none';
}

function getEditorValue(editor) {
  if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
    return editor.value;
  } else if (editor.contentEditable === 'true') {
    return editor.textContent || editor.innerText;
  }
  return '';
}

function setEditorValue(editor, value) {
  if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
    editor.value = value;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (editor.contentEditable === 'true') {
    editor.textContent = value;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function getSelectedCode() {
  const selection = window.getSelection();
  if (selection.toString()) {
    return selection.toString();
  }
  
  if (currentEditor) {
    if (currentEditor.tagName === 'TEXTAREA') {
      const start = currentEditor.selectionStart;
      const end = currentEditor.selectionEnd;
      if (start !== end) {
        return currentEditor.value.substring(start, end);
      }
      return currentEditor.value;
    }
  }
  
  return '';
}

function replaceSelectedCode(newCode) {
  if (currentEditor) {
    if (currentEditor.tagName === 'TEXTAREA') {
      const start = currentEditor.selectionStart;
      const end = currentEditor.selectionEnd;
      const value = currentEditor.value;
      
      if (start !== end) {
        currentEditor.value = value.substring(0, start) + newCode + value.substring(end);
      } else {
        currentEditor.value = newCode;
      }
      
      currentEditor.dispatchEvent(new Event('input', { bubbles: true }));
      showNotification('Code replaced!', 'success');
    } else if (currentEditor.contentEditable === 'true') {
      currentEditor.textContent = newCode;
      currentEditor.dispatchEvent(new Event('input', { bubbles: true }));
      showNotification('Code replaced!', 'success');
    }
  }
}

function insertCodeIntoEditor(code) {
  if (currentEditor) {
    setEditorValue(currentEditor, code);
    showNotification('Code inserted!', 'success');
  } else {
    // Try to find any code editor
    const editors = document.querySelectorAll('textarea, [contenteditable="true"]');
    if (editors.length > 0) {
      setEditorValue(editors[0], code);
      showNotification('Code inserted!', 'success');
    } else {
      showNotification('No editor found. Copy this code manually.', 'error');
      navigator.clipboard.writeText(code);
    }
  }
}

function autoCorrectSelection() {
  const code = getSelectedCode();
  if (code) {
    showNotification('Auto-correcting...', 'info');
    // Trigger via popup
    chrome.runtime.sendMessage({ action: 'autoCorrect', code: code });
  } else {
    showNotification('Please select code first', 'error');
  }
}

function openGenerateDialog() {
  const prompt = window.prompt('Describe the code you want to generate:');
  if (prompt) {
    chrome.runtime.sendMessage({ action: 'generate', prompt: prompt });
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 9999999;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
