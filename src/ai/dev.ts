// 1) load env FIRST (critical)
import 'dotenv/config';
<<<<<<< HEAD

import { configureGenkit, runDevServer } from '@genkit-ai/core';
import { googleAI, configureGoogleGenai } from '@genkit-ai/google-genai';

// 2) verify key exists at startup
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error(
        'Missing GEMINI_API_KEY / GOOGLE_API_KEY in .env. Add it and restart.'
    );
=======

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
>>>>>>> bdab5914381c1c4522628d486289b26f95b27ed0
}

// 3) configure Google GenAI plugin
configureGoogleGenai({
<<<<<<< HEAD
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
=======
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
>>>>>>> bdab5914381c1c4522628d486289b26f95b27ed0
});

// 4) base Genkit config
configureGenkit({
<<<<<<< HEAD
    plugins: [
        googleAI()
    ],
    logLevel: 'info',
});

// 5) example simple flow (safe to remove/change)
import { defineFlow } from '@genkit-ai/flow';

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
=======
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
>>>>>>> bdab5914381c1c4522628d486289b26f95b27ed0
);

// 6) start dev server (Genkit UI at :4000)
runDevServer();
