# Android AI Studio

Welcome to the Android AI Studio! This Next.js application leverages generative AI to assist with various aspects of Android application development.

## Features

This application provides a suite of tools to streamline your Android development workflow:

### 1. Code Generator (`/`)

- **Generate Code Snippets**: Describe an Android feature (e.g., "user login screen with a logo"), and the AI will generate the corresponding Java and XML layout code.
- **Full Project Generation**: Describe a full application idea (e.g., "simple to-do list app"), and check the "Full Project" box. The AI will generate a complete, multi-file project structure, including activities, layouts, manifest files, and build scripts.

### 2. Code Compare (`/compare`)

- **Compare & Merge**: Upload or paste two different code snippets (e.g., an original version and a modified one) to see a visual diff.
- **Magic Merge**: Use the AI-powered "Magic Merge" to intelligently combine the two snippets, resolving conflicts and consolidating changes into a single, clean file.

### 3. App Prompt Generator (`/prompt-generator`)

- **Idea to Blueprint**: Input a raw idea, a feature list, or even a code snippet. The AI will generate a comprehensive app development prompt, including:
    - **App Blueprint**: A high-level concept.
    - **Key Features**: A primary feature list.
    - **Target User Persona**: A description of the ideal user.
    - **Style Guidelines**: Suggestions for colors, fonts, and aesthetics.
    - **Layout Description**: Ideas for UI organization.
    - **Full App Description**: A cohesive summary suitable for project briefs.

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: React, ShadCN UI, Tailwind CSS
- **Generative AI**: Google Gemini via Genkit
- **Language**: TypeScript

## Getting Started

To get started, simply navigate to the desired feature using the navbar.

- For code generation, go to the **Code Generator** page.
- To compare files, use the **Code Compare** page.
- To brainstorm and structure an app idea, visit the **App Prompt** page.
