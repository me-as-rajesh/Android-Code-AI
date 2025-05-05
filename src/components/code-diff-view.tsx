
'use client';

import * as React from 'react';
import type { Change } from 'diff';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeDiffViewProps {
  diff: Change[] | null;
  className?: string;
}

export function CodeDiffView({ diff, className }: CodeDiffViewProps) {
  if (!diff) {
    return (
      <div className={cn("p-4 text-muted-foreground", className)}>
        Upload files to see the comparison.
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[400px] w-full rounded-md border bg-muted/20 p-4", className)}>
      <pre className="text-sm whitespace-pre-wrap break-words">
        {diff.map((part, index) => {
          const style = part.added
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : part.removed
            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through'
            : 'text-foreground/80';
          // Use span for inline display, ensure spaces are preserved
          return (
            <span key={index} className={cn(style, 'px-0.5 rounded-sm')}>
              {part.value.replace(/ /g, '\u00A0')}
            </span>
          );
        })}
      </pre>
    </ScrollArea>
  );
}
