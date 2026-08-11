import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export const LowerBento: React.FC = () => {
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
      {/* Tile 1: Live Status & Heritage */}
      <div className="bento-card info-card">
        <div className="clock-header">
          <div>NOW:</div>
          <div className="clock-val">{timeStr.date}</div>
          <div className="clock-val">{timeStr.time}</div>
        </div>

        <div>
          <div className="gp-title heading-sub">
            FORMULA 1® AUSTRALIAN GRAND PRIX<br />
            <span style={{ color: 'var(--audi-red)' }}>COMING SOON</span>
          </div>

          <div className="heritage-list">
            <div className="heritage-item">
              <span className="square-bullet" />
              <span>OVER 100 YEARS OF RACING HERITAGE</span>
            </div>
            <div className="heritage-item">
              <span className="square-bullet" />
              <span>PRECISION-BUILT IN GERMANY</span>
            </div>
            <div className="heritage-item">
              <span className="square-bullet" />
              <span>DEBUTED IN MELBOURNE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tile 2: The Latest News */}
      <div className="bento-card latest-card">
        <div>
          <span className="latest-tag">THE LATEST</span>
          <h3 className="heading-extended latest-title">
            Discover the latest from the Audi Revolut F1® Team
          </h3>
        </div>

        <div className="latest-footer">
          <span className="latest-link">VISIT AUDIF1.COM</span>
          <a 
            href="https://www.audif1.com" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-circle-red"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>

      {/* Tile 3: Audi Australia Destination */}
      <div 
        className="bento-card tile-card"
        style={{ backgroundImage: `url('/assets/ontrack.png')`, minHeight: '280px' }}
      >
        <div className="hero-overlay" />

        <div className="tile-top-bar">
          <span className="tile-tag">AUDI AUSTRALIA</span>
          <a 
            href="https://www.audi.com.au" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-circle-red"
          >
            <ExternalLink size={20} />
          </a>
        </div>

        <h3 className="heading-extended tile-bottom-title">
          Our Australian F1® destination
        </h3>
      </div>
    </section>
  );
};
