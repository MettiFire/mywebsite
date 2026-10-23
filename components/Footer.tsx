// components/Footer.tsx
import { FaLinkedin, FaGithub, FaStrava, FaSpotify, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className="text-sm">© 2025{" "} 
          <a 
            href="/privacy"
          >
            Anna Mettifogo
          </a>
        </div>
        <div className={styles.links}>
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
