'use server';

/**
 * @fileOverview A real-time code suggestion AI agent.
 *
 * - suggestCode - A function that suggests code in real time.
 * - SuggestCodeInput - The input type for the suggestCode function.
 * - SuggestCodeOutput - The return type for the suggestCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeInputSchema = z.object({
  partial: z.string().describe('The partial code snippet to generate suggestions for.'),
  language: z.string().describe('The programming language of the code snippet.'),
});
export type SuggestCodeInput = z.infer<typeof SuggestCodeInputSchema>;

const SuggestCodeOutputSchema = z.object({
  suggestion: z.string().describe('The generated code suggestion.'),
});
export type SuggestCodeOutput = z.infer<typeof SuggestCodeOutputSchema>;

export async function suggestCode(input: SuggestCodeInput): Promise<SuggestCodeOutput> {
  return suggestCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodePrompt',
  input: {schema: SuggestCodeInputSchema},
  output: {schema: SuggestCodeOutputSchema},
  prompt: `You are an expert AI code assistant. You will generate code suggestions based on the partial code snippet and the programming language provided.

Partial Code Snippet:
{{partial}}

Programming Language:
{{language}}

Suggestion:`,
});

const suggestCodeFlow = ai.defineFlow(
  {
    name: 'suggestCodeFlow',
    inputSchema: SuggestCodeInputSchema,
    outputSchema: SuggestCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
