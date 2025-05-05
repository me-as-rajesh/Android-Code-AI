
"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CodeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  code: string | null;
  language?: string; // e.g., 'java', 'xml', 'auto' or leave undefined
  placeholder?: string;
}

export function CodeDisplay({
  title,
  code,
  language,
  placeholder = "// Code will appear here...",
  className,
  ...props
}: CodeDisplayProps) {
  const { toast } = useToast();
  const displayLanguage = language === 'auto' || !language ? '' : `language-${language}`;

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied to clipboard!",
        description: `${title} code has been copied.`,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the code to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={cn("flex flex-col h-full shadow-md", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          disabled={!code}
          aria-label={`Copy ${title} code`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <pre className="p-4 text-sm overflow-x-auto bg-muted/20">
            {code ? (
              <code className={displayLanguage}>
                {code}
              </code>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
