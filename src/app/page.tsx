
'use client';

import { useEffect, useState } from 'react';
import { Bot, Code, Moon, Sparkles, Sun, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Textarea } from '@/components/ui/textarea';

export default function PopupPage() {
  const { theme, toggleTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [isClient, setIsClient] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
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
    } else {
       toast({
          title: 'Info',
          description: 'Sign-in is only available within the Chrome extension.',
        });
    }
  };

  const handleAutocorrect = async () => {
    const sampleCode = "fuction add(a,b) { return a+b; }";

    try {
      const res = await fetch('/api/autocorrect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sampleCode, language }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'An unknown error occurred.' }));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      
      if (data.correctedCode && data.correctedCode.trim() !== '') {
        toast({
          title: 'Code Auto-corrected!',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto max-h-60">
              <code className="text-white text-sm">{data.correctedCode}</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: 'Auto-Correction Result',
          description: 'There is no code to present.',
        });
      }
    } catch (error: any) {
      console.error('Auto-correct failed:', error);
      toast({
        title: 'Auto-correct Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please enter a description for the code you want.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'An unknown error occurred.' }));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      toast({
        title: 'Code Generated!',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto max-h-80">
            <code className="text-white text-sm whitespace-pre-wrap">{data.code || 'No code returned'}</code>
          </pre>
        ),
      });
    } catch (error: any) {
      console.error('Code generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
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
    return null; 
  }

  return (
    <>
      <Toaster />
      <div className="bg-background text-foreground font-body w-[350px] min-h-[520px] p-4 space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code-prompt">Code Generation Prompt</Label>
              <Textarea 
                id="code-prompt"
                placeholder="e.g., A React component for a login form"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="font-code"
              />
            </div>
            <Button onClick={handleGenerateCode} className="w-full" disabled={isGenerating}>
              <Wand2 className="mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Code'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
             <Button onClick={handleAutocorrect} variant="secondary" className="w-full">
                <Wand2 className="mr-2" />
                Test Auto-Correct
              </Button>
          </CardContent>
        </Card>
        
      </div>
    </>
  );
}
