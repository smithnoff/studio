'use server';

/**
 * @fileOverview AI-powered store name generator.
 *
 * - generateStoreName - A function that generates a store name based on a description.
 * - GenerateStoreNameInput - The input type for the generateStoreName function.
 * - GenerateStoreNameOutput - The return type for the generateStoreName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoreNameInputSchema = z.object({
  description: z.string().describe('A brief description of the store.'),
});

export type GenerateStoreNameInput = z.infer<typeof GenerateStoreNameInputSchema>;

const GenerateStoreNameOutputSchema = z.object({
  storeName: z.string().describe('The generated name of the store.'),
});

export type GenerateStoreNameOutput = z.infer<typeof GenerateStoreNameOutputSchema>;

export async function generateStoreName(input: GenerateStoreNameInput): Promise<GenerateStoreNameOutput> {
  return generateStoreNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoreNamePrompt',
  input: {schema: GenerateStoreNameInputSchema},
  output: {schema: GenerateStoreNameOutputSchema},
  prompt: `You are a creative marketing expert specializing in generating catchy names for new businesses.

  Generate a creative and relevant name for a store based on the provided description.

  Description: {{{description}}}
  `,
});

const generateStoreNameFlow = ai.defineFlow(
  {
    name: 'generateStoreNameFlow',
    inputSchema: GenerateStoreNameInputSchema,
    outputSchema: GenerateStoreNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
