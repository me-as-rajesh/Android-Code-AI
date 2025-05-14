
'use client';

import * as React from 'react';
import { useState } from 'react';
import { diffChars } from 'diff';
import type { Change } from 'diff';
import { FileUploader } from '@/components/file-uploader';
import { CodeDiffView } from '@/components/code-diff-view';
import { CodeDisplay } from '@/components/code-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mergeCode } from '@/ai/flows/merge-code-flow';
import type { MergeCodeOutput } from '@/ai/flows/merge-code-flow';

interface ContentState {
  name: string | null;
  content: string | null;
}

export default function ComparePage() {
  const [originalContent, setOriginalContent] = useState<ContentState>({ name: null, content: null });
  const [duplicateContent, setDuplicateContent] = useState<ContentState>({ name: null, content: null });
  const [diffResult, setDiffResult] = useState<Change[] | null>(null);
  const [mergedCode, setMergedCode] = useState<MergeCodeOutput | null>(null);
  const [isLoadingMerge, setIsLoadingMerge] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleContentSet = (contentType: 'original' | 'duplicate') => (content: string, sourceName: string) => {
    if (contentType === 'original') {
      setOriginalContent({ name: sourceName, content });
      if (duplicateContent.content) {
        setDiffResult(diffChars(content, duplicateContent.content));
      }
    } else {
      setDuplicateContent({ name: sourceName, content });
      if (originalContent.content) {
        setDiffResult(diffChars(originalContent.content, content));
      }
    }
    setError(null); 
    setMergedCode(null); 
  };

  const handleMagicMerge = async () => {
    if (!originalContent.content || !duplicateContent.content) {
      setError("Please provide content for both original and duplicate sources first.");
      return;
    }
    setIsLoadingMerge(true);
    setError(null);
    setMergedCode(null);
    try {
      const result = await mergeCode({
        originalCode: originalContent.content,
        duplicateCode: duplicateContent.content,
      });
      setMergedCode(result);
    } catch (err: any) {
      console.error("Error merging code:", err);
      setError(err.message || "An unexpected error occurred during merge.");
    } finally {
      setIsLoadingMerge(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 md:p-12 lg:p-24 bg-secondary/30"> {/* Adjusted min-h */}
      <div className="container mx-auto max-w-7xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            Compare & Merge
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload or paste two Code view differences, and merge them.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploader
            title="Original Code"
            onContentSet={handleContentSet('original')}
            contentName={originalContent.name}
            acceptedFileTypes=".java,.xml,text/plain"
          />
          <FileUploader
            title="Duplicate Code"
            onContentSet={handleContentSet('duplicate')}
            contentName={duplicateContent.name}
            acceptedFileTypes=".java,.xml,text/plain"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diffResult && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Code Comparison</CardTitle>
              <CardDescription>Differences are highlighted below (character-level).</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeDiffView diff={diffResult} />
              <div className="mt-6 text-center">
                <Button
                  onClick={handleMagicMerge}
                  disabled={isLoadingMerge || !originalContent.content || !duplicateContent.content}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  {isLoadingMerge ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Magic Merge
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {mergedCode && (
          <Card className="shadow-lg mt-6">
            <CardHeader>
                <CardTitle>Merged Code</CardTitle>
                {mergedCode.explanation && (
                    <CardDescription className="pt-2">{mergedCode.explanation}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <CodeDisplay
                    title="Result"
                    code={mergedCode.mergedCode}
                    language="auto" 
                    className="min-h-[300px]"
                    aria-live="polite"
                 />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
