// Load environment variables FIRST
import 'dotenv/config';

// Force dev mode for Genkit
process.env.GENKIT_ENV = 'dev';

// Import the main genkit instance. This initializes it and makes `ai` available.
import { ai } from './genkit';

// Use zod from genkit for schema definitions
import { z } from 'genkit';

// --- Test flow defined directly in the dev server entry point ---
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

// --- Import all other flows to register them on the SAME `ai` instance ---
import './flows/code-autocorrection';
import './flows/code-generation-from-prompt';
import './flows/realtime-code-suggestions';

console.log('✓ Genkit dev server started with all flows registered.');
