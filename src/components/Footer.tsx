import React from 'react';
import { Facebook, Youtube, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <div className="footer-logo">
          <svg 
            className="footer-rings-svg" 
            viewBox="0 0 180 50" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="3.5" 
            style={{ height: '22px', width: 'auto', display: 'block' }}
            aria-label="Audi 5-Rings Logo"
          >
            <circle cx="26" cy="25" r="17" />
            <circle cx="57" cy="25" r="17" />
            <circle cx="88" cy="25" r="17" />
            <circle cx="119" cy="25" r="17" />
            <circle cx="150" cy="25" r="17" />
          </svg>
        </div>

        <nav className="footer-links" aria-label="Footer Navigation">
          <a href="#" className="footer-link">TERMS AND CONDITIONS</a>
          <a href="#" className="footer-link">PRIVACY POLICY</a>
          <a href="#" className="footer-link">EVENT CONDITIONS</a>
          <a href="#" className="footer-link">AUDI REVOLUT F1 TEAM</a>
          <a href="#" className="footer-link">CONTACT US</a>
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
          ©2026 AUDI AG. ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  );
};
