// components/ThemeProvider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Avoid importing internal type paths from next-themes which can break when
// package layout changes. We'll declare a minimal local prop type instead.
type LocalThemeProviderProps = {
  children: React.ReactNode;
  attribute?: 'class' | 'data-theme' | undefined;
  defaultTheme?: string | undefined;
  enableSystem?: boolean | undefined;
};

export function ThemeProvider({ children, ...props }: LocalThemeProviderProps) {
  return <NextThemesProvider {...(props as any)}>{children}</NextThemesProvider>;
}