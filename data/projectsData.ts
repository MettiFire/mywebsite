export type Project = {
  id: string;
  title: string;
  context: string;
  description: string;
  implementation: string;
  technologies: string[];
  repository: string;
  demo?: { label: string; href: string };
};

// Editorial summaries checked against the public repositories and their source.
// Keep this local so visiting Projects never makes requests to GitHub.
export const projects: Project[] = [
  {
    id: "tomodachitv",
    title: "Tomodachi TV",
    context: "Web application",
    description:
      "A place to keep track of films and series: what you want to watch, what you’re watching, and what you’ve finished. Includes episode tracking, personal ratings, lists, and viewing statistics.",
    implementation:
      "Built with React and TanStack Start, with Supabase for accounts and persistent data. Server functions retrieve film and series information from TMDB, while dedicated routes handle libraries, profiles, recommendations, and the release calendar.",
    technologies: ["TypeScript", "React", "TanStack Start", "Supabase", "TMDB"],
    repository: "https://github.com/MettiFire/tomodachitv",
    demo: { label: "Try it", href: "https://tomodachitv.lovable.app" },
  },
  {
    id: "silvae",
    title: "Silvae",
    context: "Web application",
    description:
      "A reading companion for keeping a personal library, tracking progress, and sharing books with other readers. Organize books by reading status, record ratings, build lists, and follow reading challenges.",
    implementation:
      "Built with React, TypeScript, and TanStack Start, with Supabase for accounts and persistent library data. Book search and metadata use Open Library and Google Books integrations, while dedicated routes provide reading statistics, challenges, lists, and public reader profiles.",
    technologies: ["TypeScript", "React", "TanStack Start", "Supabase", "Open Library", "Google Books"],
    repository: "https://github.com/MettiFire/silvae",
    demo: { label: "My library", href: "https://silvae.lovable.app/u/mettignis" },
  },
  {
    id: "dropwheel",
    title: "Dropwheel",
    context: "macOS application",
    description:
      "A file converter that stays in the macOS menu bar. Drag a file, press a modifier key, and drop it onto a radial menu to convert it, apply a tool, or run a file action. Processing stays on your computer.",
    implementation:
      "A Swift menu-bar agent monitors file drags and modifier keys, then opens a floating wheel beneath the cursor. A Python engine dispatches conversion jobs to tools such as FFmpeg, ImageMagick, Pandoc, and Calibre, saving the output beside the original.",
    technologies: ["Swift", "Python", "FFmpeg", "ImageMagick", "Pandoc"],
    repository: "https://github.com/MettiFire/dropwheel",
  },
  {
    id: "gesture-puzzle",
    title: "Gesture Puzzle",
    context: "Computer vision experiment",
    description:
      "Turn a webcam image into a puzzle using your hands. Choose the grid size by raising your fingers, frame an area with both index fingers, and pinch to capture it. Then reconstruct the image by dragging and swapping tiles.",
    implementation:
      "OpenCV handles the camera feed and interface, while MediaPipe tracks hand landmarks. Geometric finger-count and pinch tests control selection; NumPy slices the captured region into tiles and reconstructs the shuffled grid.",
    technologies: ["Python", "OpenCV", "MediaPipe Hands", "NumPy"],
    repository: "https://github.com/MettiFire/gesture-puzzle",
  },
  {
    id: "elden-mail-banner",
    title: "Elden Email",
    context: "Browser extension",
    description:
      "An Elden Ring–inspired celebration for sending an email: a dramatic banner and sound effect appear when you hit Send. Supports several webmail services, translated send buttons, and keyboard shortcuts.",
    implementation:
      "JavaScript content scripts detect send actions and display the animated overlay. The extension includes a settings popup, local preference storage, and separate Chrome and Firefox manifests.",
    technologies: ["JavaScript", "HTML", "CSS", "WebExtensions"],
    repository: "https://github.com/MettiFire/elden_mail_banner",
    demo: {
      label: "Chrome Web Store",
      href: "https://chromewebstore.google.com/detail/elden-email/bjaildeadgclghcjhocdbginfpjihmgm",
    },
  },
  {
    id: "necstlab-fl-research",
    title: "Federated Learning Benchmark",
    context: "Research · NECSTLab, Politecnico di Milano",
    description:
      "A research codebase comparing federated learning approaches for sleep-quality prediction from wearable data. The focus is the trade-off between predictive accuracy, training time, and communication overhead.",
    implementation:
      "Python benchmark pipelines explore Flower bagging, cyclic training, and histogram-based federated XGBoost with NVIDIA FLARE. Shared configurations and analysis scripts support comparisons of training, communication, and aggregation, alongside experiments with hybrid approaches.",
    technologies: ["Python", "Flower", "NVIDIA FLARE", "XGBoost"],
    repository: "https://github.com/MettiFire/necstlab-fl-research",
  },
  {
    id: "sleep-quality-fl",
    title: "Sleep Quality Prediction",
    context: "Course project · Politecnico di Milano, 2025–26",
    description:
      "Predicting sleep quality from wearable biometrics under federated learning constraints. Raw measurements remain with each client, making limited data and differences between users central challenges.",
    implementation:
      "Statistical features summarize heart-rate, respiration, and stress time series. Per-client data augmentation is combined with ensembles of Random Forest, LightGBM, and XGBoost models, with experiments comparing augmentation and model diversity.",
    technologies: ["Python", "Federated learning", "Random Forest", "LightGBM", "XGBoost"],
    repository: "https://github.com/MettiFire/csi-sleep-quality-fl-2025-26",
  },
  {
    id: "easyboard",
    title: "EasyBoard",
    context: "Group coursework · Human–Computer Interaction, 2024–25",
    description:
      "A group design project addressing overcrowding on trains and metro services. EasyBoard explores how crowding information, passenger reports, and travel preferences could help people choose a more comfortable journey.",
    implementation:
      "The repository documents the design process through research deliverables and prototypes. An Astro website with React components, MDX assignment pages, and an embedded Figma prototype presents the concept and its development. This repository is a fork of the group project.",
    technologies: ["Astro", "React", "TypeScript", "MDX", "Figma"],
    repository: "https://github.com/MettiFire/Human-Computer-Interaction",
    demo: { label: "Project site", href: "https://weridfire.github.io/Human-Computer-Interaction/" },
  },
  {
    id: "mywebsite",
    title: "This website",
    context: "Personal portfolio",
    description:
      "My personal space for writing, music, books, and the things I build. A simple portfolio with light and dark themes and articles available in Italian and English.",
    implementation:
      "Built with Next.js, React, and TypeScript, using file-based routes and shared components for navigation and layout. Tailwind CSS and CSS modules provide styling, Supabase supports page-view counts, and Vercel handles deployment.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
    repository: "https://github.com/MettiFire/mywebsite",
  },
];
