export type Project = {
  id: string;
  title: string;
  context: string;
  description: string;
  languages: { name: string; bytes: number; color: string }[];
  logo?: string;
  repository: string;
  demo?: { label: string; href: string };
};

// Language byte counts from GitHub’s Languages API, checked 2026-10-26.
// Classifications (including notebooks) match GitHub; minor languages are grouped in the UI.
// Keep this local so visiting Projects never makes requests to GitHub.
export const projects: Project[] = [
  {
    id: "tomodachitv",
    title: "Tomodachi TV",
    context: "Web application",
    description:
      "A personal watchlist for films and series, with episode tracking, ratings and viewing stats.",
    languages: [
      { name: "TypeScript", bytes: 847020, color: "#3178c6" },
      { name: "PLpgSQL", bytes: 19118, color: "#336790" },
      { name: "CSS", bytes: 4025, color: "#663399" },
      { name: "JavaScript", bytes: 1250, color: "#f1e05a" },
    ],
    logo: "/images/projects/tomodachitv.svg",
    repository: "https://github.com/MettiFire/tomodachitv",
    demo: { label: "Try it", href: "https://tomodachitv.lovable.app" },
  },
  {
    id: "silvae",
    title: "Silvae",
    context: "Web application",
    description:
      "A reading companion to organize your library, track progress and share books with other readers.",
    languages: [
      { name: "TypeScript", bytes: 1190975, color: "#3178c6" },
      { name: "JavaScript", bytes: 202795, color: "#f1e05a" },
      { name: "PLpgSQL", bytes: 79280, color: "#336790" },
      { name: "Python", bytes: 49848, color: "#3572A5" },
      { name: "CSS", bytes: 32595, color: "#663399" },
      { name: "HTML", bytes: 999, color: "#e34c26" },
    ],
    logo: "/images/projects/silvae.svg",
    repository: "https://github.com/MettiFire/silvae",
    demo: { label: "My library", href: "https://silvae.lovable.app/u/mettignis" },
  },
  {
    id: "dropwheel",
    logo: "/images/projects/dropwheel.png",
    title: "Dropwheel",
    context: "macOS application",
    description:
      "A macOS menu-bar app for converting files through a drag-and-drop radial menu. Everything runs locally.",
    languages: [
      { name: "Swift", bytes: 41094, color: "#F05138" },
      { name: "Python", bytes: 9973, color: "#3572A5" },
      { name: "Shell", bytes: 1763, color: "#89e051" },
    ],
    repository: "https://github.com/MettiFire/dropwheel",
  },
  {
    id: "gesture-puzzle",
    title: "Gesture Puzzle",
    context: "Computer vision experiment",
    description:
      "A webcam puzzle controlled by hand gestures: frame, capture and rearrange tiles with your fingers.",
    languages: [
      { name: "Python", bytes: 17540, color: "#3572A5" },
    ],
    repository: "https://github.com/MettiFire/gesture-puzzle",
  },
  {
    id: "elden-mail-banner",
    logo: "/images/projects/elden-email.png",
    title: "Elden Email",
    context: "Browser extension",
    description:
      "An Elden Ring–inspired banner and sound effect to celebrate sending an email.",
    languages: [
      { name: "JavaScript", bytes: 7722, color: "#f1e05a" },
      { name: "CSS", bytes: 2086, color: "#663399" },
      { name: "HTML", bytes: 974, color: "#e34c26" },
    ],
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
      "Comparing federated learning methods for sleep-quality prediction, balancing accuracy, training time and communication costs.",
    languages: [
      { name: "Python", bytes: 2441717, color: "#3572A5" },
      { name: "Jupyter Notebook", bytes: 1520031, color: "#DA5B0B" },
      { name: "HTML", bytes: 471762, color: "#e34c26" },
      { name: "Shell", bytes: 5025, color: "#89e051" },
    ],
    repository: "https://github.com/MettiFire/necstlab-fl-research",
  },
  {
    id: "sleep-quality-fl",
    title: "Sleep Quality Prediction",
    context: "Course project · Politecnico di Milano, 2025–26",
    description:
      "Predicting sleep quality from wearable data while keeping raw measurements on each client.",
    languages: [
      { name: "Python", bytes: 215877, color: "#3572A5" },
    ],
    repository: "https://github.com/MettiFire/csi-sleep-quality-fl-2025-26",
  },
  {
    id: "easyboard",
    logo: "/images/projects/easyboard.png",
    title: "EasyBoard",
    context: "Group coursework · Human–Computer Interaction, 2024–25",
    description:
      "A group design project exploring how crowding information could make train and metro journeys more comfortable.",
    languages: [
      { name: "Astro", bytes: 29559, color: "#ff5a03" },
      { name: "JavaScript", bytes: 4794, color: "#f1e05a" },
      { name: "MDX", bytes: 4297, color: "#fcb32c" },
      { name: "HTML", bytes: 4095, color: "#e34c26" },
    ],
    repository: "https://github.com/MettiFire/Human-Computer-Interaction",
    demo: { label: "Project site", href: "https://weridfire.github.io/Human-Computer-Interaction/" },
  },
  {
    id: "mywebsite",
    logo: "/logo-light.svg",
    title: "This website",
    context: "Personal portfolio",
    description:
      "My space for writing, music, books and projects, with light and dark themes and articles in Italian and English.",
    languages: [
      { name: "TypeScript", bytes: 175967, color: "#3178c6" },
      { name: "JavaScript", bytes: 31009, color: "#f1e05a" },
      { name: "HTML", bytes: 30727, color: "#e34c26" },
      { name: "CSS", bytes: 29738, color: "#663399" },
    ],
    repository: "https://github.com/MettiFire/mywebsite",
  },
];
