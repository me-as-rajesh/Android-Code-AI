
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

interface FileState {
  name: string | null;
  content: string | null;
}

export default function ComparePage() {
  const [originalFile, setOriginalFile] = useState<FileState>({ name: null, content: null });
  const [duplicateFile, setDuplicateFile] = useState<FileState>({ name: null, content: null });
  const [diffResult, setDiffResult] = useState<Change[] | null>(null);
  const [mergedCode, setMergedCode] = useState<MergeCodeOutput | null>(null);
  const [isLoadingMerge, setIsLoadingMerge] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileRead = (fileType: 'original' | 'duplicate') => (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (fileType === 'original') {
        setOriginalFile({ name: file.name, content });
        if (duplicateFile.content) {
          setDiffResult(diffChars(content, duplicateFile.content));
        }
      } else {
        setDuplicateFile({ name: file.name, content });
        if (originalFile.content) {
          setDiffResult(diffChars(originalFile.content, content));
        }
      }
      setError(null); // Clear error on new file upload
      setMergedCode(null); // Clear merge result on new file upload
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      setError(`Error reading file ${file.name}`);
      if (fileType === 'original') setOriginalFile({ name: file.name, content: null });
      else setDuplicateFile({ name: file.name, content: null });
      setDiffResult(null);
    };
    reader.readAsText(file);
  };

  const handleMagicMerge = async () => {
    if (!originalFile.content || !duplicateFile.content) {
      setError("Please upload both original and duplicate files first.");
      return;
    }
    setIsLoadingMerge(true);
    setError(null);
    setMergedCode(null);
    try {
      const result = await mergeCode({
        originalCode: originalFile.content,
        duplicateCode: duplicateFile.content,
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
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24 bg-secondary/30">
      <div className="container mx-auto max-w-7xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            Code Compare & Merge
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload two code files, view differences, and merge them magically.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploader
            title="Original File"
            onFileRead={handleFileRead('original')}
            fileName={originalFile.name}
          />
          <FileUploader
            title="Duplicate File"
            onFileRead={handleFileRead('duplicate')}
            fileName={duplicateFile.name}
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
                  disabled={isLoadingMerge || !originalFile.content || !duplicateFile.content}
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
          <CodeDisplay
            title="Merged Code"
            code={mergedCode.mergedCode}
            language="auto" // Let highlighting library guess
            className="min-h-[300px]"
            aria-live="polite"
          />
        )}
      </div>
    </main>
  );
}
