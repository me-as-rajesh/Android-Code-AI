
'use client';

import * as React from 'react';
import { useState } from 'react';
import { generateAppPrompt } from '@/ai/flows/generate-app-prompt-flow';
import type { GenerateAppPromptOutput } from '@/ai/flows/generate-app-prompt-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CodeDisplay } from '@/components/code-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AdBanner from '@/components/ad-banner';

export default function PromptGeneratorPage() {
  const [userInput, setUserInput] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<GenerateAppPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdentifiers, setCopiedIdentifiers] = useState<Set<string>>(new Set());

  const handleGeneratePrompt = async () => {
    if (!userInput.trim()) {
      setError('Please enter some text or code to generate a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt(null);
    setCopiedIdentifiers(new Set());

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

  const handleCopySuccess = (identifier: string) => {
    setCopiedIdentifiers(prev => new Set(prev).add(identifier));
  };

  const renderOutputSection = (title: string, content: string | string[] | undefined, identifier: string, language: string = 'markdown') => {
    if (!content) return null;
    const codeToDisplay = Array.isArray(content) ? content.join('\n- ') : content;
    const displayTitle = Array.isArray(content) && content.length > 0 && !title.toLowerCase().includes('features') ? `${title} (List)` : title;
    
    return (
      <Card 
        className={`shadow-md transition-colors duration-300 ${copiedIdentifiers.has(identifier) ? 'bg-green-100 dark:bg-green-800/30 border-green-300 dark:border-green-700' : ''}`}
      >
        <CardHeader>
          <CardTitle>{displayTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeDisplay
            title="" // Title is handled by CardHeader
            code={codeToDisplay}
            language={language}
            onCopySuccess={() => handleCopySuccess(identifier)}
            placeholder={`// No content generated for ${title}`}
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>
    );
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
          <div className="space-y-6 mt-8">
            <h2 className="text-3xl font-semibold text-primary text-center mb-6">
              Generated App Prompt
            </h2>
            {renderOutputSection('App Blueprint', generatedPrompt.appBlueprint, 'appBlueprint')}
            {renderOutputSection('Key Features', generatedPrompt.keyFeatures && generatedPrompt.keyFeatures.length > 0 ? `- ${generatedPrompt.keyFeatures.join('\n- ')}` : "Not specified", 'keyFeatures')}
            {renderOutputSection('Target User Persona', generatedPrompt.targetUserPersona, 'targetUserPersona')}
            {renderOutputSection('Style Guidelines', generatedPrompt.styleGuideline, 'styleGuideline')}
            {renderOutputSection('Layout Description', generatedPrompt.layoutDescription, 'layoutDescription')}
            {renderOutputSection('Full App Description', generatedPrompt.fullAppDescription, 'fullAppDescription')}
          </div>
        )}
      </div>
    </div>
  );
}
