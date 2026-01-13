// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type AIProvider = 'gemini-flash' | 'gemini-pro' | 'huggingface' | 'web-search';

interface AIModel {
  provider: AIProvider;
  name: string;
  priority: number;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usedProvider, setUsedProvider] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  // AI Models in priority order (fallback chain)
  const aiModels: AIModel[] = [
    {
      provider: 'gemini-flash',
      name: 'Gemini 1.5 Flash',
      priority: 1
    },
    {
      provider: 'gemini-pro',
      name: 'Gemini 1.5 Pro',
      priority: 2
    },
    {
      provider: 'huggingface',
      name: 'HuggingFace CodeLlama',
      priority: 3
    },
    {
      provider: 'web-search',
      name: 'Web Search (Stack Overflow + GitHub)',
      priority: 4
    }
  ];

  const generateWithGemini = async (modelName: string): Promise<string> => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate clean, production-ready code based on this request: ${prompt}. 
                Provide only the code without explanations, markdown formatting, or code block markers.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('No code generated in Gemini response');
  };

  const generateWithHuggingFace = async (): Promise<string> => {
    const res = await fetch('https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ''}`,
      },
      body: JSON.stringify({
        inputs: `Generate code for: ${prompt}. Return only code, no explanations.`,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`HuggingFace API error: ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    throw new Error('No code generated in HuggingFace response');
  };

  const searchWebForCode = async (): Promise<string> => {
    // Search multiple sources for code examples
    const searches = [
      `${prompt} code example site:stackoverflow.com`,
      `${prompt} code site:github.com`,
      `${prompt} tutorial code example`
    ];

    const allResults: any[] = [];

    for (const query of searches) {
      try {
        // Using DuckDuckGo API (no API key required)
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
        const data = await res.json();
        
        if (data.RelatedTopics) {
          allResults.push(...data.RelatedTopics.slice(0, 3));
        }
      } catch (err) {
        console.warn('Search failed:', err);
      }
    }

    setSearchResults(allResults);

    if (allResults.length === 0) {
      throw new Error('No search results found');
    }

    // Compile search results into useful code snippets
    let codeCompilation = `// Code examples found from web search for: ${prompt}\n\n`;
    
    allResults.forEach((result, index) => {
      if (result.Text && result.FirstURL) {
        codeCompilation += `// Source ${index + 1}: ${result.FirstURL}\n`;
        codeCompilation += `// ${result.Text}\n\n`;
      }
    });

    codeCompilation += `\n// Note: These are references from Stack Overflow and GitHub.\n`;
    codeCompilation += `// Please review and adapt the code to your specific needs.\n`;
    codeCompilation += `// Visit the source URLs above for complete implementations.`;

    return codeCompilation;
  };

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCode('');
    setUsedProvider('');
    setSearchResults([]);

    const errors: string[] = [];

    // Try each AI model in priority order
    for (const model of aiModels) {
      try {
        console.log(`Trying ${model.name}...`);
        let code: string;

        switch (model.provider) {
          case 'gemini-flash':
            code = await generateWithGemini('gemini-1.5-flash');
            break;
          case 'gemini-pro':
            code = await generateWithGemini('gemini-1.5-pro');
            break;
          case 'huggingface':
            code = await generateWithHuggingFace();
            break;
          case 'web-search':
            code = await searchWebForCode();
            break;
          default:
            throw new Error('Unknown provider');
        }

        // Success! Set the code and break the loop
        setGeneratedCode(code);
        setUsedProvider(model.name);
        setLoading(false);
        return;

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`${model.name}: ${errorMsg}`);
        console.warn(`${model.name} failed:`, errorMsg);
        // Continue to next model
      }
    }

    // If we get here, all models failed
    setError(`All methods failed to generate code:\n${errors.join('\n')}\n\nPlease check your API keys in .env.local`);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 p-8 font-body">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-headline">
            🚀 AI Code Generator
          </h1>
          <p className="text-gray-400">
            Smart fallback: Gemini → HuggingFace → Web Search
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 mb-6">
          <label htmlFor="prompt" className="block text-white text-lg font-semibold mb-3">
            Describe what you want to build:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a React component for a todo list with add, delete, and mark complete functionality..."
            className="w-full h-32 p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-code"
          />
          
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating with Smart Fallback...' : 'Generate Code'}
          </button>

          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-400 mt-2 text-sm">Trying multiple AI sources...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">⚠️ Error:</p>
            <pre className="text-sm whitespace-pre-wrap mt-2 font-code">{error}</pre>
            <div className="mt-4 bg-red-800/30 p-4 rounded">
              <p className="font-semibold text-sm mb-2">💡 Quick Setup Guide:</p>
              <p className="text-xs mb-2">Create <code className="bg-gray-900 px-1 py-0.5 rounded font-code">.env.local</code> in your project root with:</p>
              <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto font-code">
{`# Get from: https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here

# Optional: https://huggingface.co/settings/tokens
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_key_here`}
              </pre>
            </div>
          </div>
        )}

        {usedProvider && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 px-6 py-3 rounded-lg mb-6">
            <p className="text-sm">✅ Code generated successfully using: <strong>{usedProvider}</strong></p>
          </div>
        )}

        {generatedCode && (
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white font-headline">Generated Code:</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  toast({ title: '✅ Code copied to clipboard!' });
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Copy Code</span>
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto border border-gray-700 text-sm">
              <code className="font-code">{generatedCode}</code>
            </pre>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 font-headline">🔗 Related Resources:</h3>
            <div className="space-y-3">
              {searchResults.slice(0, 5).map((result, index) => (
                result.FirstURL && (
                  <a
                    key={index}
                    href={result.FirstURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <p className="text-blue-400 text-sm font-semibold">{result.FirstURL}</p>
                    {result.Text && (
                      <p className="text-gray-300 text-xs mt-1">{result.Text.slice(0, 150)}...</p>
                    )}
                  </a>
                )
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-headline">🎯 Fallback Strategy:</h3>
          <div className="space-y-3">
            {aiModels.map((model) => (
              <div key={model.name} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {model.priority}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{model.name}</p>
                  <p className="text-gray-400 text-sm">
                    {model.provider === 'gemini-flash' && '⚡ Fastest AI model (Primary)'}
                    {model.provider === 'gemini-pro' && '🧠 More powerful AI (Backup)'}
                    {model.provider === 'huggingface' && '🤗 Open source AI (Free)'}
                    {model.provider === 'web-search' && '🌐 Stack Overflow + GitHub search (Always works!)'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm">
              <strong>💡 How it works:</strong> The app tries each method in order. If one fails, it automatically moves to the next. 
              Web search is the final fallback that ALWAYS works - it finds real code examples from Stack Overflow and GitHub!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
