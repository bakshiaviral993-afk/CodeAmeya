// Load environment variables FIRST
import 'dotenv/config';

import { configureGenkit, runDevServer } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';
import { defineFlow } from 'genkit';
import { z } from 'zod';

// --- Check API key exists ---
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  throw new Error(
    'Missing GEMINI_API_KEY or GOOGLE_API_KEY in .env. Add it and restart.'
  );
}

// --- Configure Genkit core ---
configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'info',
  enableTracingAndMetrics: true,
});

// --- Example test flow (you can change/remove) ---
export const helloFlow = defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.object({ name: z.string() }),
    outputSchema: z.object({ message: z.string() }),
  },
  async (input) => {
    return {
      message: `Hello ${input.name}!`,
    };
  }
);

// --- Start the dev server (Genkit UI at :4000) ---
runDevServer();
