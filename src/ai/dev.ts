// Load environment variables FIRST
import 'dotenv/config';

import { configureGenkit, runDevServer } from '@genkit-ai/core';
import { googleAI, configureGoogleGenai } from '@genkit-ai/google-genai';
import { defineFlow } from '@genkit-ai/flow';

import '@/ai/flows/code-generation-from-prompt.ts';
import '@/ai/flows/code-autocorrection.ts';
import '@/ai/flows/realtime-code-suggestions.ts';


// --- Check API key exists ---
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or GOOGLE_API_KEY in .env');
}

// --- Configure Google GenAI ---
configureGoogleGenai({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

// --- Configure Genkit core ---
configureGenkit({
  plugins: [googleAI()],
  logLevel: 'info',
});

// --- Example test flow (you can change/remove) ---
export const helloFlow = defineFlow(
  {
    name: 'helloFlow',
    inputSchema: {
      name: 'string',
    },
    outputSchema: {
      message: 'string',
    },
  },
  async (input) => {
    return {
      message: `Hello ${input.name}!`,
    };
  }
);

// --- Start the dev server (Genkit UI at :4000) ---
runDevServer();
