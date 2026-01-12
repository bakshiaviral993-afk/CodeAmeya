// 1) load env FIRST (critical)
import 'dotenv/config';

import { configureGenkit, runDevServer } from '@genkit-ai/core';
import { googleAI, configureGoogleGenai } from '@genkit-ai/google-genai';
import { defineFlow } from '@genkit-ai/flow';

import '@/ai/flows/code-generation-from-prompt.ts';
import '@/ai/flows/code-autocorrection.ts';
import '@/ai/flows/realtime-code-suggestions.ts';


// 2) verify key exists at startup
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  throw new Error(
    'Missing GEMINI_API_KEY / GOOGLE_API_KEY in .env. Add it and restart.'
  );
}

// 3) configure Google GenAI plugin
configureGoogleGenai({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

// 4) base Genkit config
configureGenkit({
  plugins: [
    googleAI()
  ],
  logLevel: 'info',
});

// 5) example simple flow (safe to remove/change)
export const helloFlow = defineFlow(
  {
    name: 'helloFlow',
    inputSchema: { name: 'string' },
    outputSchema: { message: 'string' },
  },
  async (input) => {
    return {
      message: `Hello ${input.name}!`,
    };
  }
);

// 6) start dev server (Genkit UI at :4000)
runDevServer();
