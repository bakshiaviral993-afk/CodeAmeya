import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Check API key
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or GOOGLE_API_KEY in .env');
}

// Configure and export Genkit instance
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'info',
  enableTracingAndMetrics: true,
  model: 'googleai/gemini-2.5-flash',
});
