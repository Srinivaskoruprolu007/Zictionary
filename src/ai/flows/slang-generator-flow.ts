'use server';
/**
 * @fileOverview An AI agent that translates plain English sentences into Gen Z slang.
 *
 * - slangGenerator - A function that handles the translation process.
 * - SlangGeneratorInput - The input type for the slangGenerator function.
 * - SlangGeneratorOutput - The return type for the slangGenerator function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SlangGeneratorInputSchema = z.object({
  plainEnglishSentence: z.string().describe('The plain English sentence to translate into Gen Z slang.'),
});
export type SlangGeneratorInput = z.infer<typeof SlangGeneratorInputSchema>;

const SlangGeneratorOutputSchema = z.object({
  genZTranslation: z.string().describe('The Gen Z slang version of the input sentence.'),
});
export type SlangGeneratorOutput = z.infer<typeof SlangGeneratorOutputSchema>;

export async function slangGenerator(input: SlangGeneratorInput): Promise<SlangGeneratorOutput> {
  return slangGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'slangGeneratorPrompt',
  input: {
    schema: z.object({
      plainEnglishSentence: z.string().describe('The plain English sentence to translate into Gen Z slang.'),
    }),
  },
  output: {
    schema: z.object({
      genZTranslation: z.string().describe('The Gen Z slang version of the input sentence.'),
    }),
  },
  prompt: `You are an expert in Gen Z slang. Your task is to translate the given plain English sentence into how a Gen Z person might say it. Be creative, use relevant slang, and try to capture the typical tone and structure. Keep it relatively concise.

Plain English: {{{plainEnglishSentence}}}

Gen Z Slang Translation:
`,
});

const slangGeneratorFlow = ai.defineFlow<
  typeof SlangGeneratorInputSchema,
  typeof SlangGeneratorOutputSchema
>(
  {
    name: 'slangGeneratorFlow',
    inputSchema: SlangGeneratorInputSchema,
    outputSchema: SlangGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
