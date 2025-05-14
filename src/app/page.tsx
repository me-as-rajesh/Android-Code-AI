
"use client";

import * as React from "react";
import { useState } from "react";
import { generateCalculatorCode } from "@/ai/flows/generate-calculator-code";
import type { GenerateCalculatorCodeOutput } from "@/ai/flows/generate-calculator-code";
import { generateFullProject } from "@/ai/flows/generate-full-project-flow";
import type { GenerateFullProjectOutput } from "@/ai/flows/generate-full-project-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeDisplay } from "@/components/code-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdBanner from "@/components/ad-banner"; // Import AdBanner

export default function Home() {
  const [featureDescription, setFeatureDescription] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<GenerateCalculatorCodeOutput | null>(null);
  const [fullProjectOutput, setFullProjectOutput] = useState<GenerateFullProjectOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullProject, setIsFullProject] = useState<boolean>(false);
  const [copiedIdentifiers, setCopiedIdentifiers] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);
    setFullProjectOutput(null);
    setCopiedIdentifiers(new Set()); // Reset copied states

    try {
      if (isFullProject) {
        const result = await generateFullProject({ featureDescription });
        setFullProjectOutput(result);
      } else {
        // This flow is still named generateCalculatorCode but will receive generic Android prompts.
        // The LLM should adapt based on the input.
        const result = await generateCalculatorCode({ featureDescription });
        setGeneratedCode(result);
      }
    } catch (err: any) {
      console.error("Error generating code:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySuccess = (identifier: string) => {
    setCopiedIdentifiers(prev => new Set(prev).add(identifier));
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 md:p-12 lg:p-24 bg-secondary/30"> {/* Adjusted min-h */}
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            Android App Code Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate Java/XML code snippets or full Android projects.
          </p>
        </header>

        {/* Example Ad Placement */}
        <AdBanner adSlot="YOUR_AD_SLOT_ID_HERE" />


        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Describe Android Feature or Project</CardTitle>
            <CardDescription>
              Enter a description for an Android feature or app (e.g., "user login screen", "display a list of items", or "simple image gallery app" for a full project if checked below).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your Android feature or app..."
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              rows={4}
              className="resize-none"
              aria-label="Feature Description Input"
            />
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !featureDescription.trim()}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Code"
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full-project-checkbox"
                  checked={isFullProject}
                  onCheckedChange={(checked) => {
                    setIsFullProject(Boolean(checked));
                    setGeneratedCode(null);
                    setFullProjectOutput(null);
                    setCopiedIdentifiers(new Set());
                  }}
                  aria-labelledby="full-project-label"
                />
                <Label htmlFor="full-project-checkbox" id="full-project-label" className="text-sm font-medium cursor-pointer">
                  Full Project
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isFullProject && fullProjectOutput && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary text-center my-4">
              Project: {fullProjectOutput.projectName}
            </h2>
            {fullProjectOutput.sections.map((section, index) => (
              <Card 
                key={`${section.fileName}-${index}`} 
                className={`shadow-md transition-colors duration-300 ${copiedIdentifiers.has(section.fileName) ? 'bg-green-100 dark:bg-green-800/30 border-green-300 dark:border-green-700' : ''}`}
              >
                <CardHeader>
                  <CardTitle>{section.fileName}</CardTitle>
                  {section.explanation && (
                    <CardDescription className="pt-2">{section.explanation}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <CodeDisplay
                    title={`Code`}
                    code={section.code}
                    language={section.language}
                    onCopySuccess={() => handleCopySuccess(section.fileName)}
                    placeholder={`// No code provided for ${section.fileName}`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isFullProject && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
           <CodeDisplay
              title="Java Code"
              code={generatedCode?.javaCode ?? null}
              language="java"
              onCopySuccess={() => handleCopySuccess("javaCode")}
              className={copiedIdentifiers.has("javaCode") ? 'bg-green-100 dark:bg-green-800/30 border-green-300 dark:border-green-700' : ''}
              aria-live="polite"
            />
           <CodeDisplay
              title="XML Layout Code"
              code={generatedCode?.xmlCode ?? null}
              language="xml"
              onCopySuccess={() => handleCopySuccess("xmlCode")}
              className={copiedIdentifiers.has("xmlCode") ? 'bg-green-100 dark:bg-green-800/30 border-green-300 dark:border-green-700' : ''}
              aria-live="polite"
            />
          </div>
        )}
      </div>
    </div>
  );
}
