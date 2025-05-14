import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar'; // Import Navbar

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'Android App Code Generator',
  description: 'Generate and compare Android app code (Java/XML).',
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
           geistSans.variable,
           geistMono.variable
           )}>
        <Navbar /> {/* Add Navbar component here */}
        <main className="pt-4"> {/* Add some padding top for content below sticky navbar */}
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
