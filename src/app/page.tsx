'use client';

import { useEffect, useState } from 'react';
import { Bot, Code, Moon, Sparkles, Sun, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/app/context/theme-context';
import { GoogleIcon } from '@/components/icons';

export default function PopupPage() {
  const { theme, toggleTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Gracefully handle chrome API not being available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['enabled', 'language'], (result) => {
        if (result.enabled !== undefined) {
          setEnabled(result.enabled);
        }
        if (result.language) {
          setLanguage(result.language);
        }
      });
    }
  }, []);

  const handleEnableToggle = (checked: boolean) => {
    setEnabled(checked);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ enabled: checked });
    }
  };

  const handleLangChange = (value: string) => {
    setLanguage(value);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ language: value });
    }
  };

  const handleSignIn = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'SIGN_IN' });
    }
  };

  const handleAutocorrect = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'TRIGGER_AUTOCORRECT' });
        }
      });
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
    <div className="bg-background text-foreground font-body w-[350px] min-h-[520px]">
      <div className="p-4 space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-headline font-bold">Code Gemini</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
        </header>

        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-xs rounded-lg p-3 text-center">
          <b>Internal Testing Only – Not for Production</b>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Button onClick={handleSignIn} className="w-full">
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-suggestions" className="flex items-center gap-2 cursor-pointer">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>Enable Suggestions</span>
              </Label>
              <Switch id="enable-suggestions" checked={enabled} onCheckedChange={handleEnableToggle} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language-select" className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                <span>Language</span>
              </Label>
              <Select value={language} onValueChange={handleLangChange}>
                <SelectTrigger id="language-select" className="w-full font-code">
                  <SelectValue placeholder="Select language..." />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="font-code">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAutocorrect} variant="secondary" className="w-full">
              <Wand2 className="mr-2" />
              Auto-Correct Current Field
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
