import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Dna, Database, Calendar, MapPin, Clock } from 'lucide-react';

interface LowerBentoProps {
  onOpenTelemetryModal?: () => void;
  onOpenRecordsVault?: () => void;
  onOpenRaceDna?: () => void;
}

interface RaceEvent {
  id: string;
  name: string;
  dateStr: string;
  track: string;
  targetDateStr: string;
}

const UPCOMING_RACES: RaceEvent[] = [
  {
    id: 'belgian',
    name: 'BELGIAN GP',
    dateStr: 'Sun, 02 Aug, 6:30 pm',
    track: 'Circuit de Spa-Francorchamps',
    targetDateStr: '2026-08-02T18:30:00+05:30',
  },
  {
    id: 'hungarian',
    name: 'HUNGARIAN GP',
    dateStr: 'Sun, 09 Aug, 6:30 pm',
    track: 'Hungaroring',
    targetDateStr: '2026-08-09T18:30:00+05:30',
  },
  {
    id: 'dutch',
    name: 'DUTCH GP',
    dateStr: 'Sun, 23 Aug, 6:30 pm',
    track: 'MASCOT Circuit Zandvoort',
    targetDateStr: '2026-08-23T18:30:00+05:30',
  },
  {
    id: 'italian',
    name: 'ITALIAN GP',
    dateStr: 'Sun, 06 Sep, 6:30 pm',
    track: 'Autodromo Nazionale Monza',
    targetDateStr: '2026-09-06T18:30:00+05:30',
  },
];

export const LowerBento: React.FC<LowerBentoProps> = ({
  onOpenTelemetryModal,
  onOpenRecordsVault,
  onOpenRaceDna,
}) => {
  const [timeStr, setTimeStr] = useState({
    date: '07 AUGUST 2026',
    time: '11:40:44 AM',
  });

  const [selectedRaceId, setSelectedRaceId] = useState<string>('dutch');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Live Pit Wall Time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
      ];
      const month = monthNames[now.getMonth()];
      const year = '2026';

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

  // Race Countdown Timer
  useEffect(() => {
    const race = UPCOMING_RACES.find(r => r.id === selectedRaceId) || UPCOMING_RACES[2];
    const targetDate = new Date(race.targetDateStr);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedRaceId]);

  const activeRace = UPCOMING_RACES.find(r => r.id === selectedRaceId) || UPCOMING_RACES[2];

  return (
    <section className="lower-bento-grid">
      {/* Tile 1: Live Status & F1 Race Details + Countdown Timer */}
      <div className="bento-card info-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top Clock Header */}
        <div className="clock-header">
          <div>PIT WALL FEED:</div>
          <div className="clock-val">{timeStr.date}</div>
          <div className="clock-val">{timeStr.time}</div>
        </div>

        {/* F1 Header Bar with Red F1 Icon */}
        <div style={{ marginTop: '14px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.05em' }}>
            <span style={{ background: '#e20613', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.08em' }}>F1®</span>
            <span>Formula 1</span>
          </div>

          {/* Race Tab Switcher (BELGIAN GP | HUNGARIAN GP | DUTCH GP | ITALIAN GP) */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '6px', overflowX: 'auto' }}>
            {UPCOMING_RACES.map(race => (
              <button
                key={race.id}
                onClick={() => setSelectedRaceId(race.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: selectedRaceId === race.id ? '#ffffff' : '#888',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  paddingBottom: '6px',
                  borderBottom: selectedRaceId === race.id ? '2px solid #e20613' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {race.name}
              </button>
            ))}
          </div>
        </div>

        {/* Race Details Card Block */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            Race details
          </div>
          <div style={{ fontSize: '0.8rem', color: '#36b37e', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} /> Date: <span style={{ color: '#ffffff' }}>{activeRace.dateStr}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#00b8d9', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} /> Track: <span style={{ color: '#ffffff' }}>{activeRace.track}</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888', fontStyle: 'italic' }}>
            All times are in India Standard Time
          </div>
        </div>

        {/* LIVE RACE COUNTDOWN TIMER GAUGE */}
        <div style={{ background: 'linear-gradient(135deg, rgba(226,6,19,0.15) 0%, rgba(10,10,10,0.8) 100%)', border: '1px solid rgba(226, 6, 19, 0.35)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#e20613', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Clock size={12} className="pulse-red" /> RACE START COUNTDOWN
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 4px', borderRadius: '6px', border: '1px solid rgba(226,6,19,0.3)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{String(countdown.days).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#888', marginTop: '2px' }}>DAYS</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 4px', borderRadius: '6px', border: '1px solid rgba(226,6,19,0.3)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{String(countdown.hours).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#888', marginTop: '2px' }}>HRS</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 4px', borderRadius: '6px', border: '1px solid rgba(226,6,19,0.3)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{String(countdown.minutes).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#888', marginTop: '2px' }}>MINS</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 4px', borderRadius: '6px', border: '1px solid rgba(226,6,19,0.3)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#e20613', lineHeight: 1 }}>{String(countdown.seconds).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#e20613', marginTop: '2px' }}>SECS</div>
            </div>
          </div>
        </div>

        {/* Telemetry Active Status Bar */}
        <div>
          <div className="gp-title heading-sub" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
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
