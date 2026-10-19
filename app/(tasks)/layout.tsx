import { Inter_Tight } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { THEMES } from "@/components/tasks/themes";
import "./tasks.css";

const font = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-tasks" });

export const metadata = {
  title: "Tasks",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <ThemeProvider
          attribute="data-theme"
          storageKey="tasks-theme"
          themes={THEMES.map((t) => t.id)}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
