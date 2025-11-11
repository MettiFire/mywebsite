"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export function Header() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'home' },
    { href: '/blog', label: 'blog' },
    { href: '/projects', label: 'projects' },
    { href: '/cv_en.pdf', label: 'cv', isExternal: true },
  ];

  return (
    <header className="mb-16">
      <div className="max-w-[650px] mx-auto px-6 flex items-center justify-between">
        {/* Keep nav spacing stable by using gap on the container and avoiding per-link margins
            Use whitespace-nowrap so items never wrap to the next line and increase gap/padding
            so labels stay visually separated and don't shift between pages. */}
        <nav className="flex items-center gap-20 md:gap-28 text-sm whitespace-nowrap" aria-label="Main navigation">
          {links.map((link) => {
            const { href, label, isExternal } = link as any;
            return (
              <Link
                key={href}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`inline-block no-underline hover:text-link-hover transition px-3 py-1 ${
                  pathname === href ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
