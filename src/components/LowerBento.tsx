import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Database, Activity } from 'lucide-react';

interface LowerBentoProps {
  onOpenTelemetryModal?: () => void;
  onOpenRecordsVault?: () => void;
}

export const LowerBento: React.FC<LowerBentoProps> = ({
  onOpenTelemetryModal,
  onOpenRecordsVault,
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
            FORMULA 1® AUSTRALIAN GRAND PRIX<br />
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

      {/* Tile 2: Real-time Telemetry System */}
      <div 
        className="bento-card latest-card"
        style={{ cursor: 'pointer' }}
        onClick={onOpenTelemetryModal}
      >
        <div>
          <span className="latest-tag">THE LATEST TELEMETRY</span>
          <h3 className="heading-extended latest-title">
            Discover real-time AI driver radio analysis & pit wall tactics
          </h3>
        </div>

        <div className="latest-footer">
          <span className="latest-link">LAUNCH REDLINE SYSTEM</span>
          <button 
            className="btn-circle-red"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenTelemetryModal) onOpenTelemetryModal();
            }}
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      {/* Tile 3: Stint Records Vault */}
      <div 
        className="bento-card tile-card"
        style={{ backgroundImage: `url('/assets/ontrack.png')`, minHeight: '280px', cursor: 'pointer' }}
        onClick={onOpenRecordsVault}
      >
        <div className="hero-overlay" />

        <div className="tile-top-bar">
          <span className="tile-tag">STINT RECORDS VAULT</span>
          <button 
            className="btn-circle-red"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenRecordsVault) onOpenRecordsVault();
            }}
          >
            <Database size={20} />
          </button>
        </div>

        <h3 className="heading-extended tile-bottom-title">
          Explore historical Grand Prix stint telemetry & records
        </h3>
      </div>
    </section>
  );
};
