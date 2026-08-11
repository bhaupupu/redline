import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Dna, Database } from 'lucide-react';

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

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '4px' }}>
              UPCOMING FORMULA 1® RACE
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              DUTCH GRAND PRIX
              <span style={{ fontSize: '0.65rem', background: '#e20613', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 800 }}>
                DUTCH GP
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: '#888', fontWeight: 700 }}>RACE DATE</span>
              <span style={{ fontSize: '0.82rem', color: '#36b37e', fontWeight: 800 }}>Sun, 23 Aug • 6:30 PM IST</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#888', fontWeight: 700 }}>TRACK / CIRCUIT</span>
              <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 800 }}>Circuit Zandvoort</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tile 2: Stint Records Vault */}
      <div 
        className="bento-card tile-card"
        style={{ 
          position: 'relative', 
          minHeight: '280px', 
          cursor: 'pointer',
          overflow: 'hidden',
          backgroundImage: `url('/assets/ontrack.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => {
          if (onOpenRecordsVault) onOpenRecordsVault();
          else if (onOpenTelemetryModal) onOpenTelemetryModal();
        }}
      >
        <div className="hero-overlay" />

        <div className="tile-top-bar">
          <span className="tile-tag" style={{ background: '#e20613', color: '#fff', fontWeight: 800, letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} /> STINT RECORDS VAULT
          </span>
          <button 
            className="btn-circle-red"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenRecordsVault) onOpenRecordsVault();
              else if (onOpenTelemetryModal) onOpenTelemetryModal();
            }}
          >
            <ArrowRight size={20} />
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '16px', position: 'relative', zIndex: 3 }}>
          <h3 className="heading-extended tile-bottom-title" style={{ fontSize: '1.45rem', marginBottom: '8px', lineHeight: 1.15 }}>
            EXPLORE HISTORICAL GRAND PRIX STINT TELEMETRY & RECORDS
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#ccc', lineHeight: 1.45, marginBottom: '14px', maxWidth: '85%' }}>
            Access full session logs, driver radio transcripts, acoustic DSP stress profiles, and lap deltas.
          </p>
          <div className="racedna-cta-link" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#e20613', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            OPEN RECORDS VAULT <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </section>
  );
};
