// Id colore usati dall'API Tweek → tinte nostre.
export const COLORS: { id: string; bg: string; fg: string; label: string }[] = [
  { id: "yellowish", bg: "#ffec5c", fg: "#000", label: "giallo" },
  { id: "greenish", bg: "#5ff0b4", fg: "#000", label: "verde" },
  { id: "cornflower", bg: "#a9b6ff", fg: "#000", label: "blu" },
  { id: "lilac", bg: "#d6b9ff", fg: "#000", label: "lilla" },
  { id: "pink", bg: "#ffb0c8", fg: "#000", label: "rosa" },
  { id: "mango", bg: "#ffc58c", fg: "#000", label: "arancio" },
  { id: "grey", bg: "#dcdcdc", fg: "#000", label: "grigio" },
  { id: "black", bg: "#141414", fg: "#fff", label: "nero" },
];

export function colorOf(id: string | null | undefined) {
  if (!id || id === "blank") return null;
  const c = COLORS.find((x) => x.id === id);
  if (c) return c;
  if (/^#[0-9a-f]{3,8}$/i.test(id)) return { id, bg: id, fg: "#000", label: id };
  return { id, bg: "#dcdcdc", fg: "#000", label: id }; // colore personalizzato di Tweek: non ne conosciamo la tinta
}
