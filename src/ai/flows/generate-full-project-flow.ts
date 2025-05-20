
'use server';
/**
 * @fileOverview An AI agent for generating a full project structure based on a feature description.
 *
 * - generateFullProject - A function that generates multiple code files and explanations for a complete project.
 * - GenerateFullProjectInput - The input type for the generateFullProject function.
 * - GenerateFullProjectOutput - The return type for the generateFullProject function.
 * - ProjectSection - The type for an individual section/file within the project.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateFullProjectInputSchema = z.object({
  featureDescription: z
    .string()
    .describe('The description of the project or main feature to generate code for (e.g., "simple calculator", "to-do list app").'),
});
export type GenerateFullProjectInput = z.infer<typeof GenerateFullProjectInputSchema>;

const ProjectSectionSchema = z.object({
  fileName: z.string().describe("The suggested file name for this code block (e.g., 'MainActivity.java', 'activity_main.xml', 'styles.xml', 'AndroidManifest.xml', 'build.gradle'). Must be unique within the project."),
  language: z.string().describe("The programming language or type of the code (e.g., 'java', 'xml', 'kotlin', 'gradle', 'pro'). Ensure this matches common file extensions."),
  code: z.string().describe("The generated code snippet for this file/section."),
  explanation: z.string().describe("A brief explanation of the purpose and content of this code file/section. This explanation should be displayed to the user before the code block."),
});
export type ProjectSection = z.infer<typeof ProjectSectionSchema>;

const GenerateFullProjectOutputSchema = z.object({
  projectName: z.string().describe("A suitable name for the project based on the feature description."),
  projectTree: z.string().describe("A textual representation of the project's file and folder structure. For example: \nmy-app/\n├── src/\n│   ├── MainActivity.java\n│   └── ...\n├── res/\n│   └── ...\n└── AndroidManifest.xml"),
  sections: z
    .array(ProjectSectionSchema)
    .describe(
      "An array of project sections. Each section represents a file or a significant part of the project, containing its fileName, language, code, and an explanation of its purpose. Common files for an Android project include Java/Kotlin activities, XML layouts, AndroidManifest.xml, build.gradle, and dimens/strings/colors XML files."
    ),
});
export type GenerateFullProjectOutput = z.infer<typeof GenerateFullProjectOutputSchema>;

export async function generateFullProject(input: GenerateFullProjectInput): Promise<GenerateFullProjectOutput> {
  return generateFullProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFullProjectPrompt',
  input: { schema: GenerateFullProjectInputSchema },
  output: { schema: GenerateFullProjectOutputSchema },
  prompt: `You are an expert software engineer tasked with generating the complete source code for a project based on a user's description.
The output must be structured as a project with multiple files/sections.
For the feature description: "{{featureDescription}}", generate all necessary files.

First, you MUST provide a 'projectName' for the overall project.
Next, you MUST provide a 'projectTree'. This should be a textual representation of the complete file and folder structure of the generated project.
Use indentation and symbols like '├──' and '└──' to represent the hierarchy clearly. For example:
my-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/app/
│   │   │       └── MainActivity.java
│   │   └── res/
│   │       ├── layout/
│   │       │   └── activity_main.xml
│   │       └── values/
│   │           └── strings.xml
├── build.gradle
└── AndroidManifest.xml

Then, for each file or significant code section in the project (as detailed in your projectTree), you MUST provide an object in the 'sections' array.
**CRITICAL INSTRUCTION: Every single object within the 'sections' array MUST contain all four of the following fields: 'fileName', 'language', 'code', and 'explanation'.**
1.  'fileName' (e.g., 'MainActivity.java', 'activity_main.xml', 'styles.xml', 'AndroidManifest.xml', 'build.gradle'). This MUST be unique for each section and MUST NOT be empty.
2.  'language' (e.g., 'java', 'xml', 'gradle', 'json', 'kotlin'). This MUST be provided and MUST NOT be empty.
3.  'code' for that file/section. This MUST be the complete code and MUST NOT be truncated or empty.
4.  'explanation' of what this file/section does. This MUST be a concise but complete explanation and MUST NOT be empty.

Structure your entire response according to the 'GenerateFullProjectOutputSchema'. The 'projectName', 'projectTree', and 'sections' (an array of file/section objects) are required.
Ensure **EVERY SINGLE OBJECT** within the 'sections' array strictly adheres to this structure and includes all four fields: \`fileName\`, \`language\`, \`code\`, and \`explanation\`.
**Missing fields or incomplete sections (e.g., missing 'fileName', truncated 'code', or empty 'explanation') for ANY item in the 'sections' array will cause critical errors and render the output unusable. Pay meticulous attention to this requirement for every file generated.**
Ensure the generated code is functional, well-structured, and includes common best practices for the type of project requested.

If the request is for an Android application (Java/Kotlin), ensure your 'sections' array includes AT MINIMUM:
- Java or Kotlin files for Activities/Logic (e.g., MainActivity.java or MainActivity.kt).
- XML files for layouts (e.g., activity_main.xml).
- An AndroidManifest.xml file.
- App-level build.gradle (or build.gradle.kts) file.
- Project-level build.gradle (or build.gradle.kts) file.
- Resource files like strings.xml, colors.xml. Potentially dimens.xml or themes.xml.

The list of sections should cover all essential parts of a basic, runnable application for the given description.
Do not generate overly complex projects unless specifically asked. Focus on a minimal, working example.
`,
});

const generateFullProjectFlow = ai.defineFlow(
  {
    name: 'generateFullProjectFlow',
    inputSchema: GenerateFullProjectInputSchema,
    outputSchema: GenerateFullProjectOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate the full project structure.");
    }
    // Basic check for fileName uniqueness, though schema validation handles missing fields.
    const fileNames = new Set<string>();
    output.sections.forEach(section => {
        // The error indicates a missing fileName, which Zod/Genkit will catch before this.
        // This check is more for ensuring fileName uniqueness if all sections are valid.
        if (section.fileName && fileNames.has(section.fileName)) {
            console.warn(`Duplicate fileName detected from LLM: ${section.fileName}. This might cause issues with UI state if not handled, though Zod validation for the overall structure should pass if individual items are okay.`);
        }
        if (section.fileName) {
          fileNames.add(section.fileName);
        }
    });
    return output;
  }
);

