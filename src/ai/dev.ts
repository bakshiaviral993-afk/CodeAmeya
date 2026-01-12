import { config } from 'dotenv';
config();

import '@/ai/flows/code-generation-from-prompt.ts';
import '@/ai/flows/code-autocorrection.ts';
import '@/ai/flows/realtime-code-suggestions.ts';