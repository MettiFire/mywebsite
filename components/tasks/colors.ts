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

export type TweekColor = { id: string; bg: string; fg: string };

// Colori personalizzati creati nell'app Tweek (arrivano da /api/tasks).
let tweekColors: TweekColor[] = [];
export const setTweekColors = (l: TweekColor[]) => { tweekColors = l; };

// Testo nero o bianco a seconda della luminosità dello sfondo.
export function textOn(hex: string) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#000" : "#fff";
}

export function colorOf(id: string | null | undefined) {
  if (!id || id === "blank") return null;
  const c = COLORS.find((x) => x.id === id);
  if (c) return c;
  if (/^#[0-9a-f]{3,8}$/i.test(id)) return { id, bg: id, fg: textOn(id), label: id };
  const t = tweekColors.find((x) => x.id === id);
  if (t) return { id, bg: t.bg, fg: t.fg, label: t.bg };
  return { id, bg: "#dcdcdc", fg: "#000", label: id }; // colore di Tweek che non conosciamo
}
