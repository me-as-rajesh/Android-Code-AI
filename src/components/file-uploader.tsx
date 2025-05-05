
'use client';

import * as React from 'react';
import { useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  title: string;
  onFileRead: (file: File) => void;
  fileName: string | null;
  className?: string;
  acceptedFileTypes?: string; // e.g., ".java,.xml,text/plain"
}

export function FileUploader({
  title,
  onFileRead,
  fileName,
  className,
  acceptedFileTypes = "*/*", // Default to all file types
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileRead(file);
    }
    // Reset input value to allow uploading the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.match(acceptedFileTypes.replace(/\./g, '').replace(/,/g, '|'))) {
      onFileRead(file);
    }
    // Reset input value if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-muted-foreground/30 rounded-md p-8 min-h-[200px] cursor-pointer hover:border-primary transition-colors"
        onClick={handleButtonClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${title}`}
      >
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          aria-hidden="true"
        />
        {fileName ? (
          <>
            <FileText className="h-12 w-12 text-green-500" />
            <p className="text-sm font-medium text-foreground text-center">{fileName}</p>
            <Button variant="outline" size="sm">
              Change File
            </Button>
          </>
        ) : (
          <>
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Drag & drop a file here, or click to select
            </p>
            <Button variant="outline" size="sm" className="pointer-events-none">
              Select File
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
