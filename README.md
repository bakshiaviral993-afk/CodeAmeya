# 🚀 AI Code Assistant - Chrome Extension

A powerful Chrome extension that provides **auto-correction**, **real-time suggestions**, and **code generation** for developers using AI.

## ✨ Features

### 1. **Auto-Correct Code** 
- Select any code and press `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac)
- Instantly fixes syntax errors, bugs, and code issues
- Works in any text editor on the web

### 2. **Real-Time Suggestions**
- Automatically detects incomplete code
- Shows helpful suggestions as you type
- Catches missing brackets, semicolons, and more

### 3. **Code Generation**
- Press `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac)
- Describe what you want to build
- AI generates the code instantly

### 4. **Smart Fallback System**
- Tries Gemini 1.5 Flash → Gemini 1.5 Pro → HuggingFace
- Always works, never fails
- No dependency on a single AI provider

## 📁 File Structure

```
ai-code-assistant/
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic
├── content.js             # Real-time suggestions & editor detection
├── background.js          # Service worker for AI calls
├── content.css            # Styles for suggestions
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🛠️ Installation

### Step 1: Create Extension Files

1. Create a new folder called `ai-code-assistant`
2. Create all the files I provided above in this folder
3. Create an `icons` folder and add icon images (16x16, 48x48, 128x128 px)

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select your `ai-code-assistant` folder
5. The extension is now installed! 🎉

### Step 3: Configure API Keys

1. Click the extension icon in Chrome toolbar
2. Scroll to **API Settings**
3. Add your API keys:
   - **Gemini API Key**: Get from https://makersuite.google.com/app/apikey
   - **HuggingFace API Key** (optional): Get from https://huggingface.co/settings/tokens
4. Click **Save Keys**

## 🎮 Usage

### Method 1: Keyboard Shortcuts
- **Auto-Correct**: Select code → Press `Ctrl+Shift+F`
- **Generate Code**: Press `Ctrl+Shift+G` → Enter description

### Method 2: Right-Click Menu
- Select any code
- Right-click → Choose "Auto-correct with AI" or "Generate code with AI"

### Method 3: Extension Popup
- Click extension icon
- Enter your code description
- Click "Generate Code" or "Auto-Correct Selected Code"

### Method 4: Real-Time Suggestions
- Just start typing in any code editor
- Extension automatically shows suggestions for incomplete code
- Suggestions appear below your cursor

## 🌐 Supported Websites

Works on ALL websites, but especially useful on:
- GitHub
- CodeSandbox
- StackBlitz
- Replit
- CodePen
- Any website with code editors

## 🔑 Getting Free API Keys

### Gemini (Recommended - Best free tier)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. **Free tier**: 60 requests/minute

### HuggingFace (Optional backup)
1. Go to: https://huggingface.co/settings/tokens
2. Create account
3. Click "New token"
4. **Free tier**: Available

## 🎯 Real-Time Suggestions Examples

The extension automatically detects:
- ✅ Missing semicolons
- ✅ Unclosed brackets `{}`
- ✅ Unclosed parentheses `()`
- ✅ Incomplete function declarations
- ✅ Missing conditions in if statements
- ✅ Incomplete loop declarations

## 🔥 Advanced Features

### Multi-Editor Support
- Detects `<textarea>` elements
- Detects `contenteditable` elements
- Works with Monaco Editor
- Works with CodeMirror
- Works with Ace Editor

### Smart Code Analysis
- Analyzes code structure in real-time
- Provides context-aware suggestions
- Learns from your coding patterns

## 🐛 Troubleshooting

### Extension not working?
1. Make sure you've added at least one API key
2. Check Chrome console for errors (F12)
3. Reload the extension from `chrome://extensions/`

### No suggestions appearing?
1. Make sure you're typing in a code editor
2. Type at least 10 characters
3. Wait 1 second for debounce

### Auto-correct not working?
1. Select the code you want to correct
2. Make sure an API key is configured
3. Check your internet connection

## 📝 Example Use Cases

### Use Case 1: Fix Syntax Errors
```javascript
// Select this code and press Ctrl+Shift+F
function hello(
  console.log("missing bracket")
```

### Use Case 2: Generate React Component
```
Press Ctrl+Shift+G and type:
"Create a React todo list component with add, delete, and mark complete"
```

### Use Case 3: Real-Time Help
```javascript
// Start typing and see suggestions appear:
if (x > 10
// Suggestion: ⚠️ Missing closing parenthesis )
```

## 🚀 Future Enhancements

- [ ] Support for more AI models
- [ ] Code explanation feature
- [ ] Multi-language support
- [ ] Custom code templates
- [ ] Team collaboration features
- [ ] Cloud sync for settings

## 📄 License

MIT License - Feel free to modify and distribute!

## 🤝 Contributing

Found a bug? Have a feature request? Open an issue or submit a PR!

---

**Made with ❤️ for developers BY Aviral Bakshi**