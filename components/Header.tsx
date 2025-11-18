"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "home" },
    { href: "/blog", label: "blog" },
    { href: "/books", label: "books" },
    { href: "/cv_en.pdf", label: "cv", isExternal: true },
  ];

  return (
  <header className="fixed top-0 z-50 w-full bg-bg-primary/80 backdrop-blur-md mb-16">
      <div className="w-full px-8 flex items-center justify-between">
        {/* NAV a sinistra */}
        <nav
          className="flex items-center gap-10 md:gap-16 text-sm whitespace-nowrap"
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const { href, label, isExternal } = link as any;
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
                className={`relative group flex items-center transition px-2 py-1 overflow-hidden ${
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-link-hover'
                }`}
              >
                <span className="relative z-10">{label}</span>
                <span
                  className={`absolute left-0 bottom-0 h-[2px] transition-all duration-300 ease-out 
                    ${isActive
                      ? 'w-full bg-text-primary opacity-100'
                      : 'w-0 bg-link-hover opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* THEME SWITCHER a destra con classe personalizzata */}
        <div className="theme-switcher-container pr-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
