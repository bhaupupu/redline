import React from 'react';
import { Facebook, Youtube, Instagram } from 'lucide-react';
import { RedlineLogo } from './RedlineLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <div className="footer-logo">
          <RedlineLogo height={22} />
        </div>

        <nav className="footer-links" aria-label="Footer Navigation">
          <a href="#" className="footer-link">TERMS AND CONDITIONS</a>
          <a href="#" className="footer-link">PRIVACY POLICY</a>
          <a href="#" className="footer-link">SYSTEM ARCHITECTURE</a>
          <a href="#" className="footer-link">REDLINE AI TELEMETRY</a>
          <a href="#" className="footer-link">PIT WALL DOCS</a>
        </nav>
      </div>

      <div className="footer-right">
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-box" aria-label="Facebook">
            <Facebook size={14} color="#ffffff" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-box" aria-label="YouTube">
            <Youtube size={14} color="#ffffff" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-box" aria-label="Instagram">
            <Instagram size={14} color="#ffffff" />
          </a>
        </div>

        <span className="copyright-text">
          ©2026 REDLINE TELEMETRY INTELLIGENCE PLATFORM. ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  );
};
