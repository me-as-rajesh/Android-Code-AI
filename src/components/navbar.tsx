
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { CodeXml, Lightbulb } from 'lucide-react'; // Using CodeXml for Android context, Lightbulb for Prompt
import { cn } from '@/lib/utils';

interface NavLinkProps extends ComponentProps<typeof Link> {
  activeClassName?: string;
  inactiveClassName?: string;
}

function NavLink({ href, children, activeClassName = "text-primary font-semibold", inactiveClassName = "text-muted-foreground hover:text-primary", className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn(isActive ? activeClassName : inactiveClassName, className, "transition-colors duration-150")} {...props}>
      {children}
    </Link>
  );
}


export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary transition-colors hover:text-primary/80">
          <CodeXml className="h-7 w-7" />
          <span>Android AI Studio</span>
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-3">
          <Button asChild variant={pathname === '/' ? 'default' : 'ghost'} size="sm" className="px-3 py-2 text-sm font-medium">
            <Link href="/">Code Generator</Link>
          </Button>
          <Button asChild variant={pathname === '/compare' ? 'default' : 'ghost'} size="sm" className="px-3 py-2 text-sm font-medium">
            <Link href="/compare">Code Compare</Link>
          </Button>
          <Button asChild variant={pathname === '/prompt-generator' ? 'default' : 'ghost'} size="sm" className="px-3 py-2 text-sm font-medium">
            <Link href="/prompt-generator" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-1 sm:mr-2" /> App Prompt
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
