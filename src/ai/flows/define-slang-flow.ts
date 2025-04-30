'use server';
/**
 * @fileOverview An AI agent that defines slang terms.
 *
 * - defineSlang - A function that handles the definition process.
 * - DefineSlangInput - The input type for the defineSlang function.
 * - DefineSlangOutput - The return type for the defineSlang function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import type { Tone, Category, Freshness } from '@/types/slang'; // Import types

const DefineSlangInputSchema = z.object({
  term: z.string().describe('The slang term to define.'),
});
export type DefineSlangInput = z.infer<typeof DefineSlangInputSchema>;

// Define stricter schemas for AI output based on existing types
const ToneSchema = z.enum(['sarcastic', 'sincere', 'ironic', 'playful', 'serious', 'neutral']);
const CategorySchema = z.enum(['emotions', 'social', 'fashion', 'gaming', 'internet', 'food', 'other']);
const FreshnessSchema = z.enum(['fresh', 'established', 'waning', 'cringe', 'dead']);

const DefineSlangOutputSchema = z.object({
  definition: z.string().describe('A concise and clear definition of the slang term.'),
  example: z.string().describe('A realistic example sentence using the slang term in context.'),
  tone: ToneSchema.describe('The typical tone associated with the slang term (e.g., playful, sarcastic).'),
  categories: z.array(CategorySchema).describe('Relevant categories the slang belongs to (e.g., social, internet, gaming). Choose the most relevant one(s), up to 3.'),
  freshness: FreshnessSchema.describe('An estimation of how current the slang term is (fresh, established, waning, cringe, dead).'),
});
export type DefineSlangOutput = z.infer<typeof DefineSlangOutputSchema>;

export async function defineSlang(input: DefineSlangInput): Promise<DefineSlangOutput> {
  return defineSlangFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defineSlangPrompt',
  input: {
    schema: DefineSlangInputSchema,
  },
  output: {
    schema: DefineSlangOutputSchema,
  },
  prompt: `You are a linguist specializing in modern internet slang and Gen Z terminology.
Your task is to define the given slang term accurately and concisely.

Provide the following details for the term "{{{term}}}":

1.  **Definition:** A clear and understandable definition.
2.  **Example:** A realistic sentence showing how the term is used naturally.
3.  **Tone:** The most common tone associated with the term (Choose one: ${ToneSchema.options.join(', ')}).
4.  **Categories:** One to three relevant categories (Choose from: ${CategorySchema.options.join(', ')}).
5.  **Freshness:** Your estimation of its current relevance (Choose one: ${FreshnessSchema.options.join(', ')}).

Term: {{{term}}}

Generate the definition details:
`,
});

const defineSlangFlow = ai.defineFlow<
  typeof DefineSlangInputSchema,
  typeof DefineSlangOutputSchema
>(
  {
    name: 'defineSlangFlow',
    inputSchema: DefineSlangInputSchema,
    outputSchema: DefineSlangOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error(`Failed to generate definition for term: ${input.term}`);
    }
    // Ensure categories array has max 3 items, even if AI provides more
    if (output.categories.length > 3) {
        output.categories = output.categories.slice(0, 3);
    }
    return output;
  }
);
