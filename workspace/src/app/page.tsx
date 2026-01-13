'use client';

import { useEffect, useState } from 'react';
import { Bot, Code, Moon, Sparkles, Sun, Wand2 } from 'lucide-react';

export default function PopupPage() {
  const [theme, setTheme] = useState('dark');
  const [enabled, setEnabled] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleEnableToggle = (checked: boolean) => {
    setEnabled(checked);
  };

  const handleLangChange = (value: string) => {
    setLanguage(value);
  };

  const handleAutocorrect = async () => {
    const sampleCode = "fuction add(a,b) { return a+b; }";
    try {
      const response = await fetch('/api/autocorrect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sampleCode, language }),
      });
      if (!response.ok) throw new Error('API call failed');
      const data = await response.json();
      alert(`Corrected Code:\n${data.correctedCode}`);
    } catch (error) {
      console.error('Error during auto-correct:', error);
      alert('Failed to auto-correct code.');
    }
  };

  const languages = [
    'JavaScript',
    'Python',
    'TypeScript',
    'Java',
    'C++',
    'SQL',
    'C# (.NET)',
  ];

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-gray-100 font-sans w-[350px] min-h-[520px] p-4 mx-auto mt-10 rounded-lg shadow-lg">
      <div className="space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-500" />
            <h1 className="text-2xl font-bold">Code Assistant</h1>
          </div>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </header>

        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-xs rounded-lg p-3 text-center">
          <b>Internal Testing Only – Not for Production</b>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6 shadow-inner">
          <div className="flex items-center justify-between">
            <label htmlFor="enable-suggestions" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>Enable Suggestions</span>
            </label>
            {/* Basic HTML switch for simplicity */}
            <input type="checkbox" id="enable-suggestions" checked={enabled} onChange={(e) => handleEnableToggle(e.target.checked)} />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="language-select" className="flex items-center gap-2 text-sm font-medium">
              <Code className="w-5 h-5" />
              <span>Language</span>
            </label>
            <select id="language-select" value={language} onChange={(e) => handleLangChange(e.target.value)} className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          
          <button onClick={handleAutocorrect} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Wand2 className="w-5 h-5" />
            Test Auto-Correct
          </button>
        </div>
      </div>
    </div>
  );
}
