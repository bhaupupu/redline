import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Dna } from 'lucide-react';

interface LowerBentoProps {
  onOpenTelemetryModal?: () => void;
  onOpenRecordsVault?: () => void;
  onOpenRaceDna?: () => void;
}

export const LowerBento: React.FC<LowerBentoProps> = ({
  onOpenTelemetryModal,
  onOpenRecordsVault,
  onOpenRaceDna,
}) => {
  const [timeStr, setTimeStr] = useState({
    date: '07 AUGUST 2026',
    time: '11:40:44 AM',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to match 07 AUGUST 2026
      const day = String(now.getDate()).padStart(2, '0');
      const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
      ];
      const month = monthNames[now.getMonth()];
      const year = '2026'; // Match Grand Prix 2026 context or current year

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedHours = String(hours).padStart(2, '0');

      setTimeStr({
        date: `${day} ${month} ${year}`,
        time: `${formattedHours}:${minutes}:${seconds} ${ampm}`,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = () => {
    if (onOpenRaceDna) {
      onOpenRaceDna();
    } else if (onOpenRecordsVault) {
      onOpenRecordsVault();
    }
  };

  return (
    <section className="lower-bento-grid">
      {/* Tile 1: Live Status & Telemetry Highlights */}
      <div className="bento-card info-card">
        <div className="clock-header">
          <div>PIT WALL FEED:</div>
          <div className="clock-val">{timeStr.date}</div>
          <div className="clock-val">{timeStr.time}</div>
        </div>

        <div>
          <div className="gp-title heading-sub">
            UPCOMING FORMULA 1® RACE<br />
            <span style={{ color: 'var(--audi-red)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} /> LIVE TELEMETRY ACTIVE
            </span>
          </div>

          <div className="heritage-list">
            <div className="heritage-item">
              <span className="square-bullet" />
              <span>MULTIMODAL AI DRIVER RADIO DISSECTION</span>
            </div>
            <div className="heritage-item">
              <span className="square-bullet" />
              <span>HIGH-FREQUENCY ACOUSTIC DSP STRESS ENGINE</span>
            </div>
            <div className="heritage-item">
              <span className="square-bullet" />
              <span>AUTOMATED PIT WALL TACTICAL RECOMMENDATIONS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tile 2: RaceDNA Engine Feature Card */}
      <div 
        className="bento-card tile-card racedna-tile"
        style={{ 
          position: 'relative', 
          minHeight: '280px', 
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid rgba(226, 6, 19, 0.4)',
        }}
        onClick={handleTileClick}
      >
        <div 
          className="racedna-bg-image" 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundImage: `url('/assets/ontrack.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.5s ease',
          }} 
        />
        <div 
          className="hero-overlay" 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(135deg, rgba(8,8,8,0.92) 0%, rgba(15,15,15,0.85) 50%, rgba(226,6,19,0.3) 100%)',
            zIndex: 1,
          }} 
        />

        {/* Futuristic RaceDNA Radar/Fingerprint Overlay */}
        <div className="racedna-viz-container" style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.45, zIndex: 2, pointerEvents: 'none' }}>
          <svg className="racedna-svg-radar" viewBox="0 0 160 160" width="180" height="180" fill="none">
            <circle cx="80" cy="80" r="70" stroke="#e20613" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="80" cy="80" r="50" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
            <circle cx="80" cy="80" r="30" stroke="#e20613" strokeWidth="1.5" opacity="0.6" />
            <polygon points="80,25 125,60 110,125 50,125 35,60" stroke="#e20613" strokeWidth="2" fill="rgba(226, 6, 19, 0.25)" />
            <circle cx="80" cy="25" r="3.5" fill="#ffffff" />
            <circle cx="125" cy="60" r="3.5" fill="#e20613" />
            <circle cx="110" cy="125" r="3.5" fill="#ffffff" />
            <circle cx="50" cy="125" r="3.5" fill="#e20613" />
            <circle cx="35" cy="60" r="3.5" fill="#ffffff" />
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
              handleTileClick();
            }}
          >
            <ArrowRight size={20} />
          </button>
        </div>

        <div style={{ position: 'relative', zIndex: 3, marginTop: 'auto', paddingTop: '16px' }}>
          <h3 className="heading-extended tile-bottom-title" style={{ fontSize: '1.45rem', marginBottom: '8px', lineHeight: 1.15 }}>
            EVERY DRIVER HAS A DIFFERENT REDLINE.
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#ccc', lineHeight: 1.45, marginBottom: '14px', maxWidth: '85%' }}>
            Build a live cognitive signature from communication, stress response, recovery behavior and race performance.
          </p>
          <div className="racedna-cta-link" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#e20613', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            EXPLORE DRIVER PROFILE <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </section>
  );
};
