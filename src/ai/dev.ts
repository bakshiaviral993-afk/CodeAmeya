// Load environment variables FIRST
import 'dotenv/config';

// Force dev mode for Genkit
process.env.GENKIT_ENV = 'dev';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Check API key
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or GOOGLE_API_KEY in .env');
}

// Configure Genkit
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'info',
  enableTracingAndMetrics: true,
});

// Import all flows to register them
import './flows/code-autocorrection';
import './flows/code-generation-from-prompt';
import './flows/realtime-code-suggestions';

console.log('Genkit configured with all flows');
