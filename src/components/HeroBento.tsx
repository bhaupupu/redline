import React, { useState } from 'react';
import { ArrowUpRight, Database, HelpCircle, Dna } from 'lucide-react';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';

interface HeroBentoProps {
  isNavOpen: boolean;
  onCloseMenu: () => void;
  onOpenMenu: () => void;
  onOpenTelemetryModal: () => void;
  onOpenRecordsVault: () => void;
  onOpenHowItWorks?: () => void;
  onOpenRaceDna?: () => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({ 
  isNavOpen,
  onCloseMenu,
  onOpenMenu,
  onOpenTelemetryModal,
  onOpenRecordsVault,
  onOpenHowItWorks,
  onOpenRaceDna,
}) => {
  const [isFalling, setIsFalling] = useState(false);

  const handleToggleMenu = () => {
    if (isNavOpen) {
      triggerCloseWithFalling();
    } else {
      setIsFalling(false);
      onOpenMenu();
    }
  };

  const triggerCloseWithFalling = () => {
    if (isFalling) return;
    setIsFalling(true);
    setTimeout(() => {
      onCloseMenu();
      setIsFalling(false);
    }, 700);
  };

  return (
    <section className="bento-grid">
      {/* Main Large Hero Bento Card (Left Column) */}
      <div 
        className="bento-card hero-card"
        style={{ backgroundImage: `url('/assets/hero.png')` }}
      >
        <div className="hero-overlay" />

        <div className="hero-content-top">
          <div className="hero-badge">
            FORMULA 1® TEAM RADIO TELEMETRY
          </div>
          <h1 className="heading-extended hero-title">
            REAL-TIME ACOUSTIC STRESS ANALYSIS FOR F1 DRIVERS.
          </h1>
        </div>

        <div className="hero-content-bottom">
          <button className="btn-pill-red" onClick={onOpenTelemetryModal}>
            <span>LAUNCH REDLINE TELEMETRY SYSTEM</span>
            <div className="btn-icon-circle">
              <ArrowUpRight size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Right Column with Header Box + Inline Expanding Nav Panel */}
      <div className="bento-column" style={{ position: 'relative' }}>
        {/* Top Header Tile */}
        <Header 
          isOpen={isNavOpen} 
          onToggleMenu={handleToggleMenu} 
        />

        {/* Inline Menu Panel expanding directly below top header bar */}
        <NavDrawer
          isOpen={isNavOpen}
          isFalling={isFalling}
          onClose={triggerCloseWithFalling}
          onOpenTicketModal={onOpenTelemetryModal}
          onGoToRecordsVault={onOpenRecordsVault}
          onGoToHowItWorks={onOpenHowItWorks}
          onGoToRaceDna={onOpenRaceDna}
        />

        {/* Upper Tile: How REDLINE Works */}
        <div 
          className="bento-card tile-card"
          style={{ backgroundImage: `url('/assets/suite.png')`, cursor: 'pointer' }}
          onClick={() => {
            if (onOpenHowItWorks) onOpenHowItWorks();
            else onOpenTelemetryModal();
          }}
        >
          <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(10,10,10,0.85) 100%)' }} />

          <div className="tile-top-bar">
            <span className="tile-tag" style={{ background: 'rgba(226, 6, 19, 0.9)', color: '#fff', fontWeight: 800 }}>
              SYSTEM ARCHITECTURE GUIDE
            </span>
            <button className="btn-circle-red" onClick={() => {
              if (onOpenHowItWorks) onOpenHowItWorks();
              else onOpenTelemetryModal();
            }}>
              <HelpCircle size={20} color="#fff" />
            </button>
          </div>

          <h2 className="heading-extended tile-bottom-title" style={{ color: '#fff' }}>
            How REDLINE Works
          </h2>
        </div>

        {/* Lower Tile: RaceDNA™ Engine */}
        <div 
          className="bento-card tile-card racedna-tile"
          style={{ 
            backgroundImage: `url('/assets/melbourne.png')`,
            border: '1px solid rgba(226, 6, 19, 0.4)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => {
            if (onOpenRaceDna) onOpenRaceDna();
            else onOpenRecordsVault();
          }}
        >
          <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.85) 0%, rgba(226,6,19,0.3) 100%)' }} />

          {/* Futuristic RaceDNA Radar/Fingerprint Overlay */}
          <div className="racedna-viz-container" style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.45, zIndex: 2, pointerEvents: 'none' }}>
            <svg className="racedna-svg-radar" viewBox="0 0 160 160" width="160" height="160" fill="none">
              <circle cx="80" cy="80" r="70" stroke="#e20613" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="80" cy="80" r="50" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              <circle cx="80" cy="80" r="30" stroke="#e20613" strokeWidth="1.5" opacity="0.6" />
              <polygon points="80,25 125,60 110,125 50,125 35,60" stroke="#e20613" strokeWidth="2" fill="rgba(226, 6, 19, 0.25)" />
            </svg>
          </div>

          <div className="tile-top-bar" style={{ position: 'relative', zIndex: 3 }}>
            <span className="tile-tag" style={{ background: '#e20613', color: '#fff', fontWeight: 800, letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Dna size={13} /> RACEDNA™ ENGINE
            </span>
            <button 
              className="btn-circle-red" 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenRaceDna) onOpenRaceDna();
                else onOpenRecordsVault();
              }}
            >
              <ArrowUpRight size={20} />
            </button>
          </div>

          <div style={{ position: 'relative', zIndex: 3, marginTop: 'auto', paddingTop: '12px' }}>
            <h2 className="heading-extended tile-bottom-title" style={{ color: '#fff', fontSize: '1.3rem', lineHeight: 1.15, marginBottom: '6px' }}>
              EVERY DRIVER HAS A DIFFERENT REDLINE.
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: 1.35, margin: 0 }}>
              Build a live cognitive signature from driver communication and race performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
