import 'dotenv/config';

// Force dev mode for Genkit
process.env.GENKIT_ENV = 'dev';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

// Check API key
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or GOOGLE_API_KEY in .env');
}

// Configure Genkit
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'info',
  enableTracingAndMetrics: true,
});

// Test flow
export const helloFlow = ai.defineFlow(
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

// Import all your code generation flows
import './flows/code-autocorrection';
import './flows/code-generation-from-prompt';
import './flows/realtime-code-suggestions';

console.log('Genkit configured with helloFlow and all code generation flows');