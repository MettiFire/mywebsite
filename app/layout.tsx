// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Anna Mettifogo's Portfolio",
  description: 'Technology, design, and human behavior.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
            
      <body className={`${inter.className} antialiased`}>
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />
          <div className="relative min-h-screen flex flex-col">
            <main className="flex-1 pt-36 pb-40">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}