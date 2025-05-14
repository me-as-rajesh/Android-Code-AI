
'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { UploadCloud, FileText, TextIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  title: string;
  onContentSet: (content: string, sourceName: string) => void;
  contentName: string | null;
  className?: string;
  acceptedFileTypes?: string; // e.g., ".java,.xml,text/plain"
}

export function FileUploader({
  title,
  onContentSet,
  contentName,
  className,
  acceptedFileTypes = "*/*", // Default to all file types
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      readFileContent(file);
    }
    // Reset input value to allow uploading the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentSet(content, file.name);
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      // Optionally, handle error in UI: toast.error(`Error reading file ${file.name}`);
      onContentSet("", file.name); // Clear content on error
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];

    if (file) {
      let isAccepted = false;
      if (acceptedFileTypes === '*/*') {
        isAccepted = true;
      } else {
        const typesArray = acceptedFileTypes.split(',').map(t => {
          const trimmedType = t.trim().toLowerCase();
          if (!trimmedType.includes('/') && !trimmedType.startsWith('.') && trimmedType !== '*') {
            return '.' + trimmedType;
          }
          return trimmedType;
        });

        for (const accType of typesArray) {
          if (accType.startsWith('.')) { // File extension check
            if (file.name.toLowerCase().endsWith(accType)) {
              isAccepted = true;
              break;
            }
          } else if (accType.endsWith('/*')) { // MIME type with wildcard subtype (e.g., image/*)
            if (file.type && file.type.toLowerCase().startsWith(accType.slice(0, -1))) {
              isAccepted = true;
              break;
            }
          } else if (accType.includes('/')) { // Specific MIME type (e.g., text/plain)
            if (file.type && file.type.toLowerCase() === accType) {
              isAccepted = true;
              break;
            }
          }
        }
      }

      if (isAccepted) {
        readFileContent(file);
      }
      // Optionally: add a toast or user feedback if the file type is not accepted
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUsePastedText = () => {
    if (pastedText.trim()) {
      onContentSet(pastedText, "Pasted Text");
    }
  };

  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload File
            </TabsTrigger>
            <TabsTrigger value="paste">
              <TextIcon className="mr-2 h-4 w-4" /> Paste Text
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div
              className={cn(
                "flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-muted-foreground/30 rounded-md p-8 min-h-[200px] cursor-pointer hover:border-primary transition-colors",
                {"bg-green-50 dark:bg-green-900/20 border-green-500": !!contentName && activeTab === 'upload'}
              )}
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
              {contentName && activeTab === 'upload' ? (
                <>
                  <FileText className="h-12 w-12 text-green-500" />
                  <p className="text-sm font-medium text-foreground text-center">{contentName}</p>
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
            </div>
          </TabsContent>
          <TabsContent value="paste">
            <div className="space-y-3">
              <Textarea
                placeholder={`Paste ${title.toLowerCase()} code here...`}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={8}
                className="resize-none"
                aria-label={`Paste ${title} text input`}
              />
              <Button onClick={handleUsePastedText} disabled={!pastedText.trim()} className="w-full">
                Use Pasted Text
              </Button>
               {contentName && activeTab === 'paste' && (
                 <div className="flex items-center justify-center text-sm text-green-600 dark:text-green-400 pt-2">
                    <FileText className="h-5 w-5 mr-2" />
                    Currently using: {contentName}
                 </div>
               )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
