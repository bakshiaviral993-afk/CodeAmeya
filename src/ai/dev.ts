import 'dotenv/config';

// Force dev mode for Genkit
process.env.GENKIT_ENV = 'dev';

<<<<<<< HEAD
// Import the main genkit instance. This initializes it and makes `ai` available.
import { ai } from './genkit';

// Use zod from genkit for schema definitions
import { z } from 'genkit';

// --- Test flow defined directly in the dev server entry point ---
=======
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
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf
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

<<<<<<< HEAD
// --- Import all other flows to register them on the SAME `ai` instance ---
=======
// Import all your code generation flows
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf
import './flows/code-autocorrection';
import './flows/code-generation-from-prompt';
import './flows/realtime-code-suggestions';

<<<<<<< HEAD
console.log('✓ Genkit dev server started with all flows registered.');
=======
console.log('Genkit configured with helloFlow and all code generation flows');
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf
