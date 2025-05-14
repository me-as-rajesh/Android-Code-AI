import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar'; // Import Navbar
import Script from 'next/script'; // Import Script

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
  const adSenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script */}
        {adSenseClientId && adSenseClientId !== "YOUR_ADSENSE_CLIENT_ID_HERE" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
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
