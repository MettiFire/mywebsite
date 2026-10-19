const pad = (n: number) => String(n).padStart(2, "0");

export const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mondayOf = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return addDays(x, -((x.getDay() + 6) % 7));
};

// Settimana ISO 8601: quella che contiene il giovedì.
export function isoWeek(d: Date) {
  const t = addDays(mondayOf(d), 3);
  const jan4 = new Date(t.getFullYear(), 0, 4);
  return 1 + Math.round((t.getTime() - mondayOf(jan4).getTime()) / (7 * 86400000));
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const dayLabel = (d: Date) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
export const longLabel = (d: Date) =>
  `${WD[(d.getDay() + 6) % 7]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
