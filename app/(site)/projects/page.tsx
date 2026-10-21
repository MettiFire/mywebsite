import type { Metadata } from "next";
import type { CSSProperties } from "react";
import styles from "./projects.module.css";
import { projects } from "@/data/projectsData";

export const metadata: Metadata = {
  title: "Anna's Projects",
  description: "Apps, experiments, and research projects by Anna Mettifogo, with implementation notes and source code.",
};

const accents = ["#8b7cf6", "#5aa6cf", "#58ad91", "#d29a58", "#c77bab"];

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
        and federated learning. Here’s what each project does and how it’s built.
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
              <span className={styles.dot} aria-hidden="true" />
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
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              <strong>Implementation.</strong> {project.implementation}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 opacity-70 mb-4">
              {project.technologies.join(" · ")}
            </p>
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
