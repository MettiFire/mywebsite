// app/layout.tsx
import './globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider'; // Importa il provider
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Anna Mettifogo's Portfolio",
  description: 'Technology, design, and human behavior.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 'suppressHydrationWarning' è necessario per next-themes
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* Avvolgiamo tutto nel provider del tema */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
            <Header />
            <div className="pb-28">{children}</div>
            <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}