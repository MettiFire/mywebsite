// Id colore usati dall'API Tweek → tinte nostre.
export const COLORS: { id: string; bg: string; fg: string; label: string }[] = [
  { id: "yellowish", bg: "#ffec5c", fg: "#000", label: "yellow" },
  { id: "greenish", bg: "#5ff0b4", fg: "#000", label: "green" },
  { id: "cornflower", bg: "#a9b6ff", fg: "#000", label: "blue" },
  { id: "lilac", bg: "#d6b9ff", fg: "#000", label: "lilac" },
  { id: "pink", bg: "#ffb0c8", fg: "#000", label: "pink" },
  { id: "mango", bg: "#ffc58c", fg: "#000", label: "orange" },
  { id: "grey", bg: "#dcdcdc", fg: "#000", label: "grey" },
  { id: "black", bg: "#141414", fg: "#fff", label: "black" },
];

export function colorOf(id: string | null | undefined) {
  if (!id || id === "blank") return null;
  const c = COLORS.find((x) => x.id === id);
  if (c) return c;
  if (/^#[0-9a-f]{3,8}$/i.test(id)) return { id, bg: id, fg: "#000", label: id };
  return { id, bg: "#dcdcdc", fg: "#000", label: id }; // colore personalizzato di Tweek: non ne conosciamo la tinta
}
