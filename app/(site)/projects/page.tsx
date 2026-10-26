import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import styles from "./projects.module.css";
import { projects, type Project } from "@/data/projectsData";

export const metadata: Metadata = {
  title: "Anna's Projects",
  description: "Apps, experiments and research projects by Anna Mettifogo, with source code and live demos.",
};

const accents = ["#8b7cf6", "#5aa6cf", "#58ad91", "#d29a58", "#c77bab"];

function Languages({ languages }: { languages: Project["languages"] }) {
  const total = languages.reduce((sum, language) => sum + language.bytes, 0);
  const main = languages.filter((language) => language.bytes / total >= 0.01);
  const otherBytes = total - main.reduce((sum, language) => sum + language.bytes, 0);
  const segments = otherBytes > 0
    ? [...main, { name: "Other", bytes: otherBytes, color: "#8b949e" }]
    : main;

  return (
    <div className={styles.languages}>
      <div className={styles.languageBar} aria-hidden="true">
        {segments.map((language) => (
          <span key={language.name} style={{ width: `${language.bytes / total * 100}%`, "--language-color": language.color } as CSSProperties} />
        ))}
      </div>
      <ul className={styles.languageLegend} aria-label="Repository languages by code size, from GitHub">
        {segments.map((language) => (
          <li key={language.name}>
            <span className={styles.languageDot} style={{ "--language-color": language.color } as CSSProperties} aria-hidden="true" />
            <span>{language.name}</span>
            <span className={styles.percentage}>{(language.bytes / total * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <main className="projects-page max-w-[670px] mx-auto px-6 py-20" aria-labelledby="projects-title">
      <h1
        id="projects-title"
        className="font-semibold text-2xl mb-8 tracking-tighter text-neutral-900 dark:text-neutral-100"
      >
        Projects
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
        Things I build and experiment with, from everyday tools to computer vision
        and federated learning. A few things I’ve been working on.
      </p>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-10">
        Browse the source on{" "}
        <a
          href="https://github.com/MettiFire?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          GitHub ↗
        </a>
      </p>

      <div className={styles.list}>
        {projects.map((project, index) => (
          <article key={project.id} id={project.id} className={styles.card} style={{ "--project-accent": accents[index % accents.length] } as CSSProperties} aria-labelledby={`${project.id}-title`}>
            <div className={styles.heading}>
              {project.logo ? (
                <Image src={project.logo} alt="" width={32} height={32} className={`${styles.logo} ${project.id === "mywebsite" ? styles.siteLogo : ""}`} />
              ) : (
                <span className={styles.dot} aria-hidden="true" />
              )}
              <h2 id={`${project.id}-title`} className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
              {project.title}
              </h2>
            </div>
            <p className="text-sm italic text-neutral-600 dark:text-neutral-400 opacity-70 mb-4">
              {project.context}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              {project.description}
            </p>
            <Languages languages={project.languages} />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <a href={project.repository} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: source code on GitHub`} className="underline underline-offset-4">
                GitHub ↗
              </a>
              {project.demo && (
                <>
                  {" · "}
                  <a href={project.demo.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    {project.demo.label} ↗
                  </a>
                </>
              )}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
