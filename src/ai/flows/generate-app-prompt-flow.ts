
'use server';
/**
 * @fileOverview An AI agent for generating comprehensive app prompts.
 *
 * - generateAppPrompt - A function that generates various sections of an app prompt based on user input.
 * - GenerateAppPromptInput - The input type for the generateAppPrompt function.
 * - GenerateAppPromptOutput - The return type for the generateAppPrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateAppPromptInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user-provided code snippet, feature idea, or general concept to generate an app prompt from.'),
});
export type GenerateAppPromptInput = z.infer<typeof GenerateAppPromptInputSchema>;

const GenerateAppPromptOutputSchema = z.object({
  appBlueprint: z.string().describe('A high-level blueprint or conceptual overview of the app based on the input.'),
  keyFeatures: z.array(z.string()).describe('A list of 3-5 primary features for the app.'),
  targetUserPersona: z.string().describe('A brief description of the ideal user persona for this app.'),
  styleGuideline: z.string().describe('Suggested style guidelines, including color palettes, typography, and overall visual aesthetic.'),
  layoutDescription: z.string().describe('A description of the proposed app layout, including screen organization and key UI elements.'),
  fullAppDescription: z.string().describe('A comprehensive description of the app, combining blueprint, style, and layout into a cohesive narrative suitable for an app store listing or project brief.'),
});
export type GenerateAppPromptOutput = z.infer<typeof GenerateAppPromptOutputSchema>;

export async function generateAppPrompt(input: GenerateAppPromptInput): Promise<GenerateAppPromptOutput> {
  return generateAppPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppPromptPrompt',
  input: {schema: GenerateAppPromptInputSchema},
  output: {schema: GenerateAppPromptOutputSchema},
  prompt: `You are an expert app designer and product manager.
Based on the following user input, generate a detailed app prompt.
The user input could be a code snippet, a feature idea, a general concept, or a mix of these.
Your goal is to structure this into a coherent plan for an application.

The generated prompt MUST include the following sections:
1.  **App Blueprint**: Provide a high-level conceptual overview and the core idea of the app.
2.  **Key Features**: List 3-5 primary, actionable features that the app should have.
3.  **Target User Persona**: Describe the ideal user for this app. Who are they? What are their needs that this app addresses?
4.  **Style Guidelines**: Suggest a visual style. Include ideas for color palettes (mention primary, secondary, accent colors), typography (font styles or families), and the overall aesthetic (e.g., modern, minimalist, playful, professional).
5.  **Layout Description**: Describe how the app's main screens and UI elements could be organized. Think about navigation, common screen patterns, and key interactive components.
6.  **Full App Description**: Write a comprehensive summary of the app. This should be a cohesive narrative that could be used for an app store listing, a project brief, or to explain the app to a stakeholder. It should integrate the blueprint, features, and target user.

User Input:
\`\`\`
{{{userInput}}}
\`\`\`

Generate the response strictly according to the 'GenerateAppPromptOutputSchema' JSON format.
Ensure each field is populated with relevant, detailed, and creative information derived from the user's input.
If the user input is very brief, try to extrapolate reasonably to provide a useful starting point.
`,
});

const generateAppPromptFlow = ai.defineFlow(
  {
    name: 'generateAppPromptFlow',
    inputSchema: GenerateAppPromptInputSchema,
    outputSchema: GenerateAppPromptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate the app prompt.");
    }
    return output;
  }
);
