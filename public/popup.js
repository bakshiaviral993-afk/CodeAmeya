document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('promptInput');
  const generateBtn = document.getElementById('generateBtn');
  const autoCorrectBtn = document.getElementById('autoCorrectBtn');
  const loading = document.getElementById('loading');
  const statusDiv = document.getElementById('status');
  const geminiKeyInput = document.getElementById('geminiKey');
  const huggingfaceKeyInput = document.getElementById('huggingfaceKey');
  const saveKeysBtn = document.getElementById('saveKeys');

  // Load saved API keys
  chrome.storage.local.get(['geminiKey', 'huggingfaceKey'], (result) => {
    if (result.geminiKey) geminiKeyInput.value = result.geminiKey;
    if (result.huggingfaceKey) huggingfaceKeyInput.value = result.huggingfaceKey;
  });

  // Save API keys
  saveKeysBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      geminiKey: geminiKeyInput.value,
      huggingfaceKey: huggingfaceKeyInput.value
    }, () => {
      showStatus('Keys saved successfully!', 'success');
    });
  });

  // Generate code
  generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      showStatus('Please enter a description', 'error');
      return;
    }

    loading.classList.add('active');
    statusDiv.innerHTML = '';

    try {
      // Use the background script to handle generation
      chrome.runtime.sendMessage({ action: 'generate', prompt: prompt }, (response) => {
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError.message);
        }
        if (response && response.code) {
           chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'insertCode',
                code: response.code
              });
            });
            showStatus('Code generated and inserted!', 'success');
        } else {
            throw new Error(response.error || 'Failed to generate code.');
        }
        loading.classList.remove('active');
      });
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error');
      loading.classList.remove('active');
    }
  });

  // Auto-correct selected code
  autoCorrectBtn.addEventListener('click', () => {
    loading.classList.add('active');
    statusDiv.innerHTML = '';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getSelectedCode'
      }, (response) => {
        if (chrome.runtime.lastError) {
            showStatus(`Error: ${chrome.runtime.lastError.message}`, 'error');
            loading.classList.remove('active');
            return;
        }

        if (response && response.code) {
          // Send to background for processing
          chrome.runtime.sendMessage({ action: 'autoCorrect', code: response.code }, (corrResponse) => {
            if (chrome.runtime.lastError) {
                showStatus(`Error: ${chrome.runtime.lastError.message}`, 'error');
            } else if (corrResponse && corrResponse.code) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: 'replaceCode',
                  code: corrResponse.code
                });
                showStatus('Code auto-corrected!', 'success');
            } else {
                showStatus(corrResponse.error || 'Failed to correct code.', 'error');
            }
            loading.classList.remove('active');
          });
        } else {
          showStatus('No code selected or could not get code.', 'error');
          loading.classList.remove('active');
        }
      });
    });
  });

  function showStatus(message, type) {
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    setTimeout(() => {
      if (statusDiv.innerHTML.includes(message)) {
          statusDiv.innerHTML = '';
      }
    }, 5000);
  }
});
