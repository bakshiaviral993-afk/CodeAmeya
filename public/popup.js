// popup.js
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
      const code = await generateCode(prompt);
      
      // Send to content script to insert into editor
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'insertCode',
          code: code
        });
      });

      showStatus('Code generated and inserted!', 'success');
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      loading.classList.remove('active');
    }
  });

  // Auto-correct selected code
  autoCorrectBtn.addEventListener('click', async () => {
    loading.classList.add('active');
    statusDiv.innerHTML = '';

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'getSelectedCode'
        }, async (response) => {
          if (response && response.code) {
            const correctedCode = await autoCorrectCode(response.code);
            
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'replaceCode',
              code: correctedCode
            });

            showStatus('Code auto-corrected!', 'success');
          } else {
            showStatus('No code selected', 'error');
          }
          loading.classList.remove('active');
        });
      });
    } catch (error) {
      showStatus(`Error: ${error.message}`, 'error');
      loading.classList.remove('active');
    }
  });

  // Generate code with AI fallback
  async function generateCode(prompt) {
    const keys = await chrome.storage.local.get(['geminiKey', 'huggingfaceKey']);

    // Try Gemini Flash
    try {
      return await generateWithGemini(prompt, 'gemini-1.5-flash', keys.geminiKey);
    } catch (err) {
      console.warn('Gemini Flash failed:', err);
    }

    // Try Gemini Pro
    try {
      return await generateWithGemini(prompt, 'gemini-1.5-pro', keys.geminiKey);
    } catch (err) {
      console.warn('Gemini Pro failed:', err);
    }

    // Try HuggingFace
    try {
      return await generateWithHuggingFace(prompt, keys.huggingfaceKey);
    } catch (err) {
      console.warn('HuggingFace failed:', err);
    }

    // Final fallback: Web search
    return await searchWebForCode(prompt);
  }

  async function autoCorrectCode(code) {
    const keys = await chrome.storage.local.get(['geminiKey', 'huggingfaceKey']);
    const prompt = `Fix any syntax errors, bugs, or issues in this code. Return ONLY the corrected code:\n\n${code}`;

    // Try AI models
    try {
      return await generateWithGemini(prompt, 'gemini-1.5-flash', keys.geminiKey);
    } catch (err) {
      console.warn('Gemini failed:', err);
    }

    try {
      return await generateWithHuggingFace(prompt, keys.huggingfaceKey);
    } catch (err) {
      console.warn('HuggingFace failed:', err);
    }

    throw new Error('All AI models failed. Please check your API keys.');
  }

  async function generateWithGemini(prompt, model, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey || ''
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate clean code for: ${prompt}. Return ONLY code, no explanations.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);

    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('No code generated');
  }

  async function generateWithHuggingFace(prompt, apiKey) {
    const res = await fetch('https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || ''}`
      },
      body: JSON.stringify({
        inputs: `Generate code: ${prompt}`,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7
        }
      })
    });

    if (!res.ok) throw new Error(`HuggingFace error: ${res.status}`);

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    throw new Error('No code generated');
  }

  async function searchWebForCode(prompt) {
    const query = encodeURIComponent(`${prompt} code example site:stackoverflow.com OR site:github.com`);
    return `// Search for: ${prompt}\n// Visit: https://stackoverflow.com/search?q=${query}\n// Or: https://github.com/search?q=${query}\n\n// Placeholder - implement your solution here`;
  }

  function showStatus(message, type) {
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    setTimeout(() => {
      statusDiv.innerHTML = '';
    }, 3000);
  }
});
