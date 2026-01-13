'use server';

/**
 * @fileOverview AI-powered code auto-correction flow.
 *
 * - autoCorrectCode - A function that corrects the input code.
 * - autoCorrectCodeFlow - The Genkit flow definition.
 * - AutoCorrectCodeInput - The input type for the autoCorrectCode function.
 * - AutoCorrectCodeOutput - The return type for the autoCorrectCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCorrectCodeInputSchema = z.object({
  code: z.string().describe('The code to be corrected.'),
  language: z.string().describe('The programming language of the code.'),
});

export type AutoCorrectCodeInput = z.infer<typeof AutoCorrectCodeInputSchema>;

const AutoCorrectCodeOutputSchema = z.object({
  correctedCode: z.string().describe('The corrected code snippet.'),
});

export type AutoCorrectCodeOutput = z.infer<typeof AutoCorrectCodeOutputSchema>;

const prompt = ai.definePrompt({
  name: 'autoCorrectCodePrompt',
  input: {schema: AutoCorrectCodeInputSchema},
  output: {schema: AutoCorrectCodeOutputSchema},
  prompt: `You are an AI code assistant that helps correct code snippets.

  Correct the following code snippet, ensuring it is syntactically correct and follows best practices for the specified language. If the code is correct, return it as is.

  Language: {{language}}
  Code: {{code}}
  `,
});

export const autoCorrectCodeFlow = ai.defineFlow(
  {
    name: 'autoCorrectCodeFlow',
    inputSchema: AutoCorrectCodeInputSchema,
    outputSchema: AutoCorrectCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      correctedCode: output!.correctedCode,
    };
  }
);

export async function autoCorrectCode(input: AutoCorrectCodeInput): Promise<AutoCorrectCodeOutput> {
  return autoCorrectCodeFlow(input);
}
