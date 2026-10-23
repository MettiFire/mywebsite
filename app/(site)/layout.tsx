import { AppThemeColor } from "@/components/AppThemeColor";
// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '../globals.css'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Anna Mettifogo's Portfolio",
  description: 'Technology, design, and human behavior.',
};

export const viewport = {
  viewportFit: "cover",
  width: 'device-width',
  initialScale: 1.0,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f0ed' },
    { media: '(prefers-color-scheme: dark)', color: '#141414' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>

        {/* 1) Il provider del tema */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>

            <AppThemeColor />
            {/* 2) Header sticky */}
            <Header />

            <div className="site-shell relative min-h-screen flex flex-col">

              {/* 3) Contenuto principale */}
              <main className="site-content flex-1 pt-36 pb-40">
                {children}
              </main>

              {/* 4) Footer sticky */}
              <Footer />

            </div>

        </ThemeProvider>

      </body>
    </html>
  );
}
