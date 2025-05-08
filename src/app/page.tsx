
"use client";

import * as React from "react";
import { useState } from "react";
import Link from 'next/link';
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
import { Loader2, GitCompareArrows } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24 bg-secondary/30">
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="text-center relative">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            CodeCalc & Compare
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate & Compare Scientific Calculator Code
          </p>
          <div className="absolute top-0 right-0 mt-2 mr-2">
             <Link href="/compare" passHref legacyBehavior>
               <Button variant="outline" size="icon" aria-label="Compare Code">
                 <GitCompareArrows className="h-5 w-5" />
               </Button>
             </Link>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Describe Calculator Feature or Project</CardTitle>
            <CardDescription>
              Enter a description (e.g., "add a button for calculating sine", "implement factorial function", or "simple calculator" for a full project if checked below).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter feature or project description here..."
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
                    // Clear previous results when toggling
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
    </main>
  );
}
