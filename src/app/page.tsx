// This file is no longer used for the extension popup.
// The main UI is now in /public/popup.html.
// This page can be used as a landing or documentation page for the extension.

import { FileText, Github, LifeBuoy } from 'lucide-react';

export default function Home() {
  return (
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
            Installation & Setup
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Load the Extension in Chrome</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This project is now a Chrome Extension. The files are located in the `public` directory.
              </p>
              <ul className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-2">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <a href="#" className="block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <FileText className="w-8 h-8 text-blue-500 mb-3"/>
              <h3 className="text-xl font-bold mb-2">Read the Docs</h3>
              <p className="text-gray-600 dark:text-gray-400">Check the README.md file in the project for full documentation on features and usage.</p>
            </a>
            <a href="#" className="block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <Github className="w-8 h-8 mb-3"/>
              <h3 className="text-xl font-bold mb-2">View on GitHub</h3>
              <p className="text-gray-600 dark:text-gray-400">Explore the source code, report issues, or contribute to the project.</p>
            </a>
        </div>

        <footer className="text-center mt-16 text-gray-500">
          <p>Built with ❤️ for developers.</p>
        </footer>
      </div>
    </main>
  );
}
