import React, { useState } from 'react';
import { ArrowUpRight, Database, HelpCircle } from 'lucide-react';
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
            FORMULA 1® AUSTRALIAN GRAND PRIX 2026
          </div>
          <h1 className="heading-extended hero-title">
            ALBERT PARK WAS OUR FIRST CHAPTER.
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
        {/* Top Header Tile (Audi 5-Rings + Hamburger / X Toggle Button) */}
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

        {/* Lower Tile: Dedicated Telemetry Records Vault Page */}
        <div 
          className="bento-card tile-card"
          style={{ 
            backgroundImage: `url('/assets/melbourne.png')`,
            border: '1px solid rgba(226, 6, 19, 0.4)',
            cursor: 'pointer'
          }}
          onClick={onOpenRecordsVault}
        >
          <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(226,6,19,0.35) 100%)' }} />

          <div className="tile-top-bar">
            <span className="tile-tag" style={{ background: '#e20613', color: '#fff', fontWeight: 800 }}>
              DEDICATED STINT RECORDS PAGE
            </span>
            <button className="btn-circle-red" onClick={onOpenRecordsVault}>
              <Database size={20} />
            </button>
          </div>

          <h2 className="heading-extended tile-bottom-title" style={{ color: '#fff' }}>
            F1 Telemetry Records Vault
          </h2>
        </div>
      </div>
    </section>
  );
};
