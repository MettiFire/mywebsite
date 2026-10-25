"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links: { href: string; label: string; isExternal?: boolean }[] = [
    { href: "/", label: "home" },
    { href: "/projects", label: "projects" },
    { href: "/blog", label: "blog" },
    { href: "https://silvae.lovable.app/u/mettignis", label: "books", isExternal: true },
    { href: "/music", label: "music" },
    { href: "/cv_en.pdf", label: "cv", isExternal: true },
  ];

  return (
  <header className={styles.header}>
      <div className={styles.inner}>
        {/* LOGO a sinistra */}
        <Link 
          href="/" 
          className={styles.logo}
          aria-label="Home"
        >
          {mounted && (
            <img 
              src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Anna Mettifogo"
              className="w-6 h-6" 
            />
          )}
        </Link>

        {/* NAV allineata al contenuto */}
        <div className={styles.navigation}>
          <nav
            className="flex items-center gap-4 md:gap-10 text-sm whitespace-nowrap overflow-x-auto"
            aria-label="Main navigation"
          >
          {links.map((link) => {
            const { href, label, isExternal } = link;
            // consider a route active when pathname equals href, or when the pathname starts with
            // the href for non-root routes (so /projects/123 still highlights /projects)
            const isActive =
              href === '/'
                ? pathname === href
                : pathname?.startsWith(href ?? '') ?? false;

            return (
              <Link
                key={href}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={styles.link}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        </div>

        {/* THEME SWITCHER a destra con classe personalizzata */}
        <div className={styles.theme}>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
