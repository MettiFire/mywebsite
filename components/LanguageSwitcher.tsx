"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher({ current }: { current: "it" | "en" }) {
  const pathname = usePathname();

  // genera automaticamente lo switch del percorso
  let newPath = pathname;
  
  if (current === "it") {
    // Da IT a EN
    if (pathname.includes("/it/")) {
      newPath = pathname.replace("/it/", "/en/");
    } else if (pathname === "/blog" || pathname === "/music") {
      newPath = pathname + "/en";
    }
  } else {
    // Da EN a IT
    if (pathname.includes("/en/")) {
      newPath = pathname.replace("/en/", "/it/");
    } else if (pathname.endsWith("/en")) {
      newPath = pathname.replace("/en", "");
    }
  }

  return (
    <div className="text-[14px] opacity-70">
      <span className={current === "it" ? "underline underline-offset-4" : "text-neutral-400 dark:text-neutral-500"}>IT</span>
      <span className="text-neutral-400 dark:text-neutral-500"> / </span>
      <Link
        href={newPath}
        className="hover:underline underline-offset-4"
      >
        <span className={current === "en" ? "underline underline-offset-4" : "text-neutral-400 dark:text-neutral-500"}>EN</span>
      </Link>
    </div>
  );
}
