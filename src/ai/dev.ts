// Load environment variables FIRST
import 'dotenv/config';

// Force dev mode for Genkit
process.env.GENKIT_ENV = 'dev';

// Import the main genkit instance (this initializes it)
import './genkit';

// Import all flows to register them with Genkit
import './flows/code-autocorrection';
import './flows/code-generation-from-prompt';
import './flows/realtime-code-suggestions';

console.log('✓ Genkit dev server started with all flows registered');
