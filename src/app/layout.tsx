import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import name
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import './globals.css';
import { cn } from '@/lib/utils';

const geistSans = Geist({ // Use the variable name from import
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Use the variable name from import
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'CodeCalc - Scientific Calculator Code Generator',
  description: 'Generate Java and XML code for scientific calculator features.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
           geistSans.variable, // Apply font variables
           geistMono.variable
           )}>
        {children}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
