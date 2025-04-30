'use server';
/**
 * @fileOverview A Gen Z to plain English translator AI agent.
 *
 * - boomerTranslator - A function that handles the translation process.
 * - BoomerTranslatorInput - The input type for the boomerTranslator function.
 * - BoomerTranslatorOutput - The return type for the boomerTranslator function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const BoomerTranslatorInputSchema = z.object({
  genZSlang: z.string().describe('The Gen Z slang to translate to plain English.'),
});
export type BoomerTranslatorInput = z.infer<typeof BoomerTranslatorInputSchema>;

const BoomerTranslatorOutputSchema = z.object({
  plainEnglish: z.string().describe('The plain English translation of the Gen Z slang.'),
});
export type BoomerTranslatorOutput = z.infer<typeof BoomerTranslatorOutputSchema>;

export async function boomerTranslator(input: BoomerTranslatorInput): Promise<BoomerTranslatorOutput> {
  return boomerTranslatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'boomerTranslatorPrompt',
  input: {
    schema: z.object({
      genZSlang: z.string().describe('The Gen Z slang to translate to plain English.'),
    }),
  },
  output: {
    schema: z.object({
      plainEnglish: z.string().describe('The plain English translation of the Gen Z slang.'),
    }),
  },
  prompt: `You are a translator that translates Gen Z slang to plain English.

Gen Z Slang: {{{genZSlang}}}

Translate the above slang to plain English:
`,
});

const boomerTranslatorFlow = ai.defineFlow<
  typeof BoomerTranslatorInputSchema,
  typeof BoomerTranslatorOutputSchema
>(
  {
    name: 'boomerTranslatorFlow',
    inputSchema: BoomerTranslatorInputSchema,
    outputSchema: BoomerTranslatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
