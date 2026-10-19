import type { SVGProps } from "react";

const base = {
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
} as const;
type P = SVGProps<SVGSVGElement>;

export const ChevronLeft = (p: P) => <svg {...base} {...p}><path d="M14.5 6 8.5 12l6 6" /></svg>;
export const ChevronRight = (p: P) => <svg {...base} {...p}><path d="m9.5 6 6 6-6 6" /></svg>;
export const Sync = (p: P) => (
  <svg {...base} {...p}><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" /><path d="M20 20v-4h-4" /></svg>
);
export const User = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="8.5" r="3.5" /><path d="M5.5 19.5c1.2-3.2 3.6-4.8 6.5-4.8s5.3 1.6 6.5 4.8" /></svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.4 2.3 4.6-4.8" /></svg>
);
export const CheckFilled = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9.3" fill="currentColor" stroke="none" />
    <path d="m8.5 12.2 2.4 2.3 4.6-4.8" stroke="var(--tk-paper)" />
  </svg>
);
export const Calendar = (p: P) => (
  <svg {...base} {...p}><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" /></svg>
);
export const Close = (p: P) => <svg {...base} {...p}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></svg>;
export const Trash = (p: P) => (
  <svg {...base} {...p}><path d="M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7" /></svg>
);
export const Subtasks = (p: P) => (
  <svg {...base} {...p}><circle cx="6" cy="7" r="2" /><circle cx="6" cy="17" r="2" /><path d="M11 7h9M11 17h9" /></svg>
);
export const Palette = (p: P) => <svg {...base} {...p}><circle cx="12" cy="12" r="8" /></svg>;
export const Repeat = (p: P) => (
  <svg {...base} {...p}><path d="M17 3.5 20 6.5l-3 3" /><path d="M4 11.5v-1a4 4 0 0 1 4-4h12" /><path d="M7 20.5 4 17.5l3-3" /><path d="M20 12.5v1a4 4 0 0 1-4 4H4" /></svg>
);
export const Note = (p: P) => <svg {...base} {...p}><path d="M5 7h14M5 12h14M5 17h9" /></svg>;
export const Clock = (p: P) => <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
