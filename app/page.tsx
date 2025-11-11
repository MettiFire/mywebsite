// app/page.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  FaLinkedin,
  FaGithub,
  FaStrava,
  FaSpotify,
  FaInstagram,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Home() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'home' },
    { href: '/blog', label: 'blog' },
    { href: '/projects', label: 'projects' },
    { href: '/cv_giacomo_maggiore.pdf', label: 'cv', isExternal: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header full-width: nav in alto */}
      <header className="w-full px-6 pt-6">
        {/* wrapper flex per distribuire nav a sx e switcher a dx */}
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Nav: uso space-x per avere spazio consistente tra link */}
          <nav className="flex items-center space-x-8 text-sm" aria-label="Main navigation">
            {links.map(({ href, label, isExternal }) => (
              <Link
                key={href}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`underline-offset-4 hover:text-link-hover transition ${
                  pathname === href ? 'text-text-primary underline' : 'text-text-secondary'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Theme switcher a destra */}
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Contenuto principale: colonna centrata */}
      <main className="flex-1">
        <div className="max-w-[650px] mx-auto px-6 py-16">
          <h1 className="text-2xl font-bold mb-8 text-text-primary">Anna Mettifogo</h1>

          <p className="text-lg text-text-primary">
            Born and raised in Italy 🇮🇹 — though half French 🇫🇷 — I’ve always loved{' '}
            <strong>understanding how things work behind the scenes</strong>. Curiosity and creativity
            drive most of what I do.
          </p>

          <p className="text-lg text-text-primary">
            🎓 I live in <strong>Brescia</strong> and study <strong>Computer Science and Engineering</strong>{' '}
            at <a href="https://www.polimi.it/" target="_blank" rel="noopener noreferrer">Politecnico di Milano</a>.
            I’m finishing my <strong>Bachelor’s</strong> while starting my <strong>Master’s (English track)</strong>.
          </p>

          <p className="text-lg text-text-primary">
            💡 I’m passionate about <strong>UI/UX design</strong>, <strong>visual communication</strong>, and how
            design choices shape perception. Recently I discovered a strong curiosity for <strong>cybersecurity</strong>.
          </p>

          <hr className="border-t border-gray-300 dark:border-gray-700 my-10" />

          <section>
            <h3 className="text-xl font-semibold mb-4 text-text-primary">🥋 Outside the academic bubble</h3>
            <p className="text-lg text-text-primary mb-4">
              I’m a <strong>black belt in karate</strong> (10+ years). I train for a <strong>half marathon</strong> and
              aim for a full marathon and an Ironman.
            </p>

            <ul className="list-disc list-inside space-y-2 text-lg text-text-primary">
              <li>📚 reading</li>
              <li>🏔️ hiking</li>
              <li>💻 side projects & design experiments</li>
            </ul>
          </section>

          <hr className="border-t border-gray-300 dark:border-gray-700 my-10" />

          <p className="text-lg text-text-primary">
            🌱 I’m fascinated by the intersection between <strong>technology, design, and human behavior</strong>.
          </p>
        </div>
      </main>

      {/* Footer con Link Social (icone aumentate) */}
      <footer className="w-full">
        <div className="max-w-3xl mx-auto px-6 py-8 flex justify-between items-center text-text-secondary">
          <div className="text-sm">{new Date().getFullYear()} © Anna Mettifogo</div>
          <div className="flex items-center space-x-5">
            {/* ho aumentato le icone e aggiunto aria-label e title */}
            <a href="https://www.linkedin.com/in/anna-mettifogo/" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="LinkedIn" title="LinkedIn">
              <FaLinkedin size={20} />
            </a>
            <a href="mailto:tua.email@example.com" className="hover:text-link-hover" aria-label="Email" title="Email">
              <MdEmail size={20} />
            </a>
            <a href="https://www.strava.com/athletes/tuo-profilo" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="Strava" title="Strava">
              <FaStrava size={20} />
            </a>
            {/* opzione: Spotify / Instagram se vuoi */}
            <a href="https://open.spotify.com/user" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="Spotify" title="Spotify">
              <FaSpotify size={20} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="Instagram" title="Instagram">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
