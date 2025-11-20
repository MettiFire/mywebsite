"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher({ current }: { current: "it" | "en" }) {
  const pathname = usePathname();

  // genera automaticamente lo switch del percorso
  const switchTo = current === "it" ? "en" : "it";
  const newPath =
    current === "it"
      ? pathname.replace("/it", "")
      : `/it${pathname}`;

  return (
    <div className="text-xs">
      <span className={current === "it" ? "text-neutral-700 dark:text-neutral-300 underline underline-offset-4" : "text-neutral-400 dark:text-neutral-500"}>IT</span>
      <span className="text-neutral-400 dark:text-neutral-500"> / </span>
      <Link
        href={newPath}
        className="hover:underline underline-offset-4"
      >
        <span className={current === "en" ? "text-neutral-700 dark:text-neutral-300 underline underline-offset-4" : "text-neutral-400 dark:text-neutral-500"}>EN</span>
      </Link>
    </div>
  );
}
