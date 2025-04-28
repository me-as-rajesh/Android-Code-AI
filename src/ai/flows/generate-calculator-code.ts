'use server';
/**
 * @fileOverview A code generation AI agent for creating Java and XML code for a scientific calculator.
 *
 * - generateCalculatorCode - A function that generates Java and XML code snippets for a scientific calculator feature.
 * - GenerateCalculatorCodeInput - The input type for the generateCalculatorCode function.
 * - GenerateCalculatorCodeOutput - The return type for the generateCalculatorCode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateCalculatorCodeInputSchema = z.object({
  featureDescription: z
    .string()
    .describe('The description of the scientific calculator feature to generate code for.'),
});
export type GenerateCalculatorCodeInput = z.infer<typeof GenerateCalculatorCodeInputSchema>;

const GenerateCalculatorCodeOutputSchema = z.object({
  javaCode: z.string().describe('The generated Java code snippet.'),
  xmlCode: z.string().describe('The generated XML code snippet.'),
});
export type GenerateCalculatorCodeOutput = z.infer<typeof GenerateCalculatorCodeOutputSchema>;

export async function generateCalculatorCode(input: GenerateCalculatorCodeInput): Promise<GenerateCalculatorCodeOutput> {
  return generateCalculatorCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCalculatorCodePrompt',
  input: {
    schema: z.object({
      featureDescription: z
        .string()
        .describe('The description of the scientific calculator feature to generate code for.'),
    }),
  },
  output: {
    schema: z.object({
      javaCode: z.string().describe('The generated Java code snippet.'),
      xmlCode: z.string().describe('The generated XML code snippet.'),
    }),
  },
  prompt: `You are an expert software engineer specializing in creating scientific calculators in Java and XML.

You will generate Java and XML code snippets for a given scientific calculator feature.

Feature Description: {{{featureDescription}}}

Provide the Java code and XML layout code in a format that is easy to copy and paste. Ensure the generated code is functional and well-documented.

`,
});

const generateCalculatorCodeFlow = ai.defineFlow<
  typeof GenerateCalculatorCodeInputSchema,
  typeof GenerateCalculatorCodeOutputSchema
>(
  {
    name: 'generateCalculatorCodeFlow',
    inputSchema: GenerateCalculatorCodeInputSchema,
    outputSchema: GenerateCalculatorCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
