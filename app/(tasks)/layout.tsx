import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { THEMES } from "@/components/tasks/themes";
import "./tasks.css";

const font = localFont({
  src: [
    { path: "./fonts/SuisseIntlTrial-Book.otf", weight: "400", style: "normal" },
    { path: "./fonts/SuisseIntl-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-tasks",
  display: "swap",
});

const boldFont = localFont({
  src: "./fonts/SuisseIntl-Bold.ttf",
  weight: "700",
  style: "normal",
  variable: "--font-tasks-bold",
  display: "swap",
});

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
    <html lang="en" className={`${font.variable} ${boldFont.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-paper font-sans font-normal text-ink antialiased">
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
