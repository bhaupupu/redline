import React from 'react';
import { RedlineLogo } from './RedlineLogo';

interface HeaderProps {
  isOpen?: boolean;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOpen = false, onToggleMenu }) => {
  return (
    <div className="header-bento-tile">
      <div className="audi-logo">
        <RedlineLogo height={24} />
      </div>

      <button 
        className={`nav-toggle-btn ${isOpen ? 'active-open' : ''}`} 
        onClick={onToggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg 
          className={`hamburger-morph-svg ${isOpen ? 'is-open' : ''}`} 
          viewBox="0 0 24 24" 
          width="20" 
          height="20" 
          stroke="#ffffff" 
          strokeWidth="2" 
          strokeLinecap="round"
        >
          <line className="line line-top" x1="5" y1="12" x2="19" y2="12" />
          <line className="line line-mid" x1="5" y1="12" x2="19" y2="12" />
          <line className="line line-bot" x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};
