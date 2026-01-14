// This file is no longer used for the extension popup.
// The main UI is now in /public/popup.html.
// This page can be used as a landing or documentation page for the extension.

<<<<<<< HEAD
import { FileText, Github, Download, Package } from 'lucide-react';
=======
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
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function PopupPage() {
  const { theme, toggleTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

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
    } else {
      toast({
        title: 'Info',
        description: 'Sign-in is only available within the Chrome extension.',
      });
    }
  };

  const handleAutocorrect = () => {
    // This function will now call our new API route
    // For demonstration, we'll use a hardcoded incorrect code snippet.
    const sampleCode = "fuction add(a,b) { return a+b; }";

    fetch('/api/autocorrect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: sampleCode, language }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        toast({
          title: 'Code Auto-corrected!',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{data.correctedCode}</code>
            </pre>
          ),
        });
      })
      .catch(error => {
        console.error('Error during auto-correct:', error);
        toast({
          title: 'Error',
          description: 'Failed to auto-correct code. See console for details.',
          variant: 'destructive',
        });
      });
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
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf

export default function Home() {
  return (
<<<<<<< HEAD
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            🚀 AI Code Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your personal AI coding partner, right in your browser. Install the Chrome Extension to get started.
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
            Download Your Project
          </h2>
          <div className="space-y-4">
             <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To download your project, click the <span className="font-bold">main menu icon (☰)</span> in the top-left corner of the Firebase Studio interface, and then select the <span className="font-bold">"Download workspace"</span> option.
              </p>
               <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 text-sm rounded-lg p-4 flex items-center gap-3">
                  <Package className="w-6 h-6 shrink-0"/>
                  <span>This will download a .zip file of your entire project, including all the Chrome Extension files in the `public` directory.</span>
              </div>
            </div>
             <div>
              <h3 className="text-xl font-semibold mb-2 mt-6">Sync with Git</h3>
               <p className="text-gray-700 dark:text-gray-300">
                Alternatively, you can use the step-by-step commands in the <a href="/GIT_COMMANDS.md" target="_blank" className="text-blue-500 hover:underline">Git Commands Guide</a> to push your code to a GitHub repository and pull it to your local machine.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-12">
          <h2 className="text-3xl font-bold mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
            Installation & Setup
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Load the Extension in Chrome</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This project is a Chrome Extension. The files are located in the `public` directory.
              </p>
              <ul className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                <li>Unzip the downloaded file.</li>
                <li>Open Chrome and navigate to <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-md text-sm">chrome://extensions</code>.</li>
                <li>Enable "Developer mode" using the toggle in the top-right corner.</li>
                <li>Click the "Load unpacked" button.</li>
                <li>Select the `public` folder from your project directory.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Configure API Keys</h3>
               <p className="text-gray-700 dark:text-gray-300">
                Click the newly added extension icon in your Chrome toolbar to open the popup. Inside the popup, find the "API Settings" section and enter your API keys for Gemini and/or HuggingFace.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 text-gray-500">
          <p>Built with ❤️ for developers.</p>
        </footer>
      </div>
    </main>
=======
    <>
      <Toaster />
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
    </>
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf
  );
}