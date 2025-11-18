// components/Footer.tsx
import { FaLinkedin, FaGithub, FaStrava, FaSpotify, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export function Footer() {
  return (
    <footer className="w-full bg-bg-primary py-6 px-8">
      <div className="max-w-3xl mx-auto flex justify-between items-center text-text-secondary">
        <div className="text-sm">© 2025 Anna Mettifogo</div>
        <div className="flex items-center space-x-8 pr-4">
          <a href="https://www.linkedin.com/in/anna-mettifogo-a37751292/" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="LinkedIn" title="LinkedIn">
            <FaLinkedin size={22} />
          </a>
          <a href="https://github.com/MettiFire" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="GitHub" title="GitHub">
            <FaGithub size={22} />
          </a>
          <a href="mailto:anna.mettifogo@gmail.com" className="hover:text-link-hover" aria-label="Email" title="Email">
            <MdEmail size={22} />
          </a>
          <a href="https://www.strava.com/athletes/123671944" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="Strava" title="Strava">
            <FaStrava size={22} />
          </a>
          <a href="https://open.spotify.com/user/anna.mettifogo?si=d45fc5ca657747b6" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="Spotify" title="Spotify">
            <FaSpotify size={22} />
          </a>
          <a href="https://www.instagram.com/mettignis" target="_blank" rel="noopener noreferrer" className="hover:text-link-hover" aria-label="Instagram" title="Instagram">
            <FaInstagram size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
