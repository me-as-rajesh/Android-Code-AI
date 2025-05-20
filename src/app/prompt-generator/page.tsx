
'use client';

import * as React from 'react';
import { useState } from 'react';
import { generateAppPrompt } from '@/ai/flows/generate-app-prompt-flow';
import type { GenerateAppPromptOutput } from '@/ai/flows/generate-app-prompt-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CodeDisplay } from '@/components/code-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';

export default function PromptGeneratorPage() {
  const [userInput, setUserInput] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<GenerateAppPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGeneratePrompt = async () => {
    if (!userInput.trim()) {
      setError('Please enter some text or code to generate a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt(null);
    setIsCopied(false);

    try {
      const result = await generateAppPrompt({ userInput });
      setGeneratedPrompt(result);
    } catch (err: any) {
      console.error('Error generating app prompt:', err);
      setError(err.message || 'An unexpected error occurred while generating the prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatGeneratedPrompt = (prompt: GenerateAppPromptOutput | null): string => {
    if (!prompt) return "";
    
    let formattedString = `## App Blueprint\n${prompt.appBlueprint || 'Not specified'}\n\n`;
    formattedString += `## Key Features\n${prompt.keyFeatures && prompt.keyFeatures.length > 0 ? prompt.keyFeatures.map(f => `- ${f}`).join('\n') : 'Not specified'}\n\n`;
    formattedString += `## Target User Persona\n${prompt.targetUserPersona || 'Not specified'}\n\n`;
    formattedString += `## Style Guidelines\n${prompt.styleGuideline || 'Not specified'}\n\n`;
    formattedString += `## Layout Description\n${prompt.layoutDescription || 'Not specified'}\n\n`;
    formattedString += `## Full App Description\n${prompt.fullAppDescription || 'Not specified'}`;
    
    return formattedString;
  };

  const handleCopyFullPrompt = async () => {
    if (!generatedPrompt) return;
    const fullPromptText = formatGeneratedPrompt(generatedPrompt);
    try {
      await navigator.clipboard.writeText(fullPromptText);
      toast({
        title: "Copied to clipboard!",
        description: "The full app prompt has been copied.",
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 md:p-12 lg:p-24 bg-secondary/30">
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            App Prompt Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your app idea, features, or existing code to generate a detailed app prompt.
          </p>
        </header>

        <AdBanner adSlot="YOUR_AD_SLOT_ID_PROMPT_PAGE" /> {/* Replace with a relevant Ad Slot ID */}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Input</CardTitle>
            <CardDescription>
              Describe your app idea, paste some code, or list desired features. The more detail you provide, the better the generated prompt will be.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., A mobile app for tracking personal book reading habits and sharing reviews with friends..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={6}
              className="resize-none"
              aria-label="User input for app prompt generation"
            />
            <Button
              onClick={handleGeneratePrompt}
              disabled={isLoading || !userInput.trim()}
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Generate App Prompt
                </>
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

        {generatedPrompt && (
          <Card 
            className={`shadow-lg mt-8 transition-colors duration-300 ${isCopied ? 'bg-green-100 dark:bg-green-800/30 border-green-300 dark:border-green-700' : ''}`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Generated App Prompt</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyFullPrompt}
                aria-label="Copy full generated prompt"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <CodeDisplay
                title="" // Title is handled by CardHeader now
                code={formatGeneratedPrompt(generatedPrompt)}
                language="markdown"
                placeholder="// Prompt details will appear here..."
                className="min-h-[300px] max-h-[60vh]" // Ensure scrollability within a max height
                onCopySuccess={() => { /* Can be removed or adapted if CodeDisplay's internal copy isn't used for the main button */}}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
