// Temi della pagina tasks: i colori veri stanno in tasks.css ([data-theme="…"]).
// paper/ink servono solo per l'anteprima nel menu.
export const THEMES = [
  { id: "light", label: "Light", paper: "#fff", ink: "#000" },
  { id: "dark", label: "Dark", paper: "#000", ink: "#fff" },
  { id: "sepia", label: "Sepia", paper: "#f4ecd8", ink: "#3b2f22" },
  { id: "midnight", label: "Midnight", paper: "#0f1626", ink: "#e6ebf5" },
] as const;
