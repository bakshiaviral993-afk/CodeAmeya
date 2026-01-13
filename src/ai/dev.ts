// This file is used to run the Genkit developer server.
// It imports the main `ai` instance from genkit.ts and all the flows.
// This ensures everything is registered before the server starts.

// Force dev mode for Genkit
process.env.GENKIT_ENV = 'dev';

// Import the configured `ai` instance
import { ai } from './genkit';

// Import all flows to register them
import './flows/code-autocorrection';
import './flows/code-generation-from-prompt';
import './flows/realtime-code-suggestions';

console.log('Genkit dev server starting with all flows registered...');
// The dev server is started automatically by the `genkit start` command.
// No need to call runDevServer() here.
