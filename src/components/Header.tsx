import React from 'react';

interface HeaderProps {
  isOpen?: boolean;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOpen = false, onToggleMenu }) => {
  return (
    <div className="header-bento-tile">
      <div className="audi-logo">
        <svg 
          className="audi-rings-svg" 
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
