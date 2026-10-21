import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anna's Projects",
  description: "A collection of things I build and experiment with.",
};

export default function ProjectsPage() {
  return (
    <main className="max-w-[670px] mx-auto px-6 py-20" aria-labelledby="projects-title">
      <h1
        id="projects-title"
        className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100"
      >
        Projects
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
        A collection of things I build and experiment with.
      </p>

      <div>
        <article className="mb-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-3">
            <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              This website
            </h2>
            <a
              href="https://github.com/MettiFire/mywebsite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:underline underline-offset-4"
              aria-label="View this website's source on GitHub (opens in a new tab)"
            >
              GitHub ↗
            </a>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            My personal space for writing, music, books, and things I build.
          </p>
        </article>
      </div>
    </main>
  );
}
