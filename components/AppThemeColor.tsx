"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function AppThemeColor() {
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const color = getComputedStyle(document.body).backgroundColor;
      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute("content", color);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [theme, resolvedTheme]);
  return null;
}
