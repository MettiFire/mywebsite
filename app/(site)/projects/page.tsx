import type { Metadata } from "next";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Anna's Projects",
  description: "A collection of things I build and experiment with.",
};

export default function ProjectsPage() {
  return (
    <section className={styles.page} aria-labelledby="projects-title">
      <h1
        id="projects-title"
        className={styles.title}
      >
        Projects
      </h1>
      <p className={styles.intro}>
        A collection of things I build and experiment with.
      </p>

      <div className={styles.list}>
        <article className={styles.project}>
          <div className={styles.projectHeader}>
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
    </section>
  );
}
