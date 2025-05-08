
'use server';
/**
 * @fileOverview An AI agent for merging two code snippets.
 *
 * - mergeCode - A function that merges two code snippets intelligently.
 * - MergeCodeInput - The input type for the mergeCode function.
 * - MergeCodeOutput - The return type for the mergeCode function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const MergeCodeInputSchema = z.object({
  originalCode: z.string().describe('The original code snippet.'),
  duplicateCode: z.string().describe('The duplicate or modified code snippet.'),
});
export type MergeCodeInput = z.infer<typeof MergeCodeInputSchema>;

const MergeCodeOutputSchema = z.object({
  mergedCode: z.string().describe('The intelligently merged code snippet.'),
  explanation: z.string().describe('An explanation of the merge decisions.'),
});
export type MergeCodeOutput = z.infer<typeof MergeCodeOutputSchema>;

export async function mergeCode(input: MergeCodeInput): Promise<MergeCodeOutput> {
  return mergeCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mergeCodePrompt',
  input: {
    schema: MergeCodeInputSchema, // Use the internal schema
  },
  output: {
    schema: MergeCodeOutputSchema, // Use the internal schema
  },
  prompt: `You are an expert software engineer specializing in code merging and conflict resolution.
You will be given two versions of a code snippet: an "original" version and a "duplicate" (potentially modified) version.
Your task is to intelligently merge these two snippets into a single, coherent piece of code.

Analyze the differences between the two versions.
- If the duplicate introduces improvements or necessary changes, incorporate them.
- If the duplicate introduces errors or illogical changes compared to the original, prefer the original logic or fix the duplicate's approach.
- If there are conflicting changes, make the best decision based on common programming practices and the likely intent.
- Preserve comments and formatting as much as possible, ensuring the final code is readable.

Provide the final merged code and a brief explanation of the key decisions you made during the merge process, especially regarding conflict resolution or choosing one version's logic over the other.

Original Code:
\`\`\`
{{{originalCode}}}
\`\`\`

Duplicate Code:
\`\`\`
{{{duplicateCode}}}
\`\`\`

Generate the merged code and the explanation.
`,
});

const mergeCodeFlow = ai.defineFlow<
  typeof MergeCodeInputSchema,
  typeof MergeCodeOutputSchema
>(
  {
    name: 'mergeCodeFlow',
    inputSchema: MergeCodeInputSchema,
    outputSchema: MergeCodeOutputSchema,
  },
  async (input) => {
    // Basic check for identical content to potentially skip LLM call
    if (input.originalCode === input.duplicateCode) {
        return {
            mergedCode: input.originalCode,
            explanation: "Both code snippets were identical. No merge needed."
        };
    }

    const { output } = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate merged code.");
    }
    return output;
  }
);
