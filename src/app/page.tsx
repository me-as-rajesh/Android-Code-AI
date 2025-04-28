"use client";

import * as React from "react";
import { useState } from "react";
import { generateCalculatorCode } from "@/ai/flows/generate-calculator-code";
import type { GenerateCalculatorCodeOutput } from "@/ai/flows/generate-calculator-code";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeDisplay } from "@/components/code-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [featureDescription, setFeatureDescription] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<GenerateCalculatorCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedCode(null); // Clear previous results
    try {
      const result = await generateCalculatorCode({ featureDescription });
      setGeneratedCode(result);
    } catch (err: any) {
      console.error("Error generating code:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24 bg-secondary/30">
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            CodeCalc
          </h1>
          <p className="text-lg text-muted-foreground">
            Scientific Calculator Code Generator
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Describe Calculator Feature</CardTitle>
            <CardDescription>
              Enter a description of the scientific calculator feature you want to generate code for (e.g., "add a button for calculating sine", "implement factorial function").
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter feature description here..."
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              rows={4}
              className="resize-none"
              aria-label="Feature Description Input"
            />
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !featureDescription.trim()}
              className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
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
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
           <CodeDisplay
            title="Java Code"
            code={generatedCode?.javaCode ?? null}
            language="java"
            aria-live="polite"
          />
           <CodeDisplay
            title="XML Layout Code"
            code={generatedCode?.xmlCode ?? null}
            language="xml"
            aria-live="polite"
          />
        </div>
      </div>
    </main>
  );
}
