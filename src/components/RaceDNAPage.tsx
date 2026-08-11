import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Dna, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  Flame, 
  User, 
  TrendingUp, 
  Clock, 
  Gauge, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Footer } from './Footer';
import { DRIVERS } from '../services/sampleClips';
import { RaceDnaProfile } from '../types/raceDna';
import { fetchRaceDnaProfile } from '../services/raceDnaService';

interface RaceDNAPageProps {
  onBackToLanding: () => void;
  onOpenTelemetry?: () => void;
  onOpenRecordsVault?: () => void;
  onOpenHowItWorks?: () => void;
}

export const RaceDNAPage: React.FC<RaceDNAPageProps> = ({
  onBackToLanding,
  onOpenTelemetry,
  onOpenRecordsVault,
  onOpenHowItWorks,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  const [selectedDriverId, setSelectedDriverId] = useState<string>('verstappen');
  const [profile, setProfile] = useState<RaceDnaProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Interactive evolution timeline selected lap
  const [selectedLapIndex, setSelectedLapIndex] = useState<number>(3); // Default to lap 17 (REDLINE)
  
  // Expandable AI Explanation toggle state
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(false);

  // Load RaceDNA profile when driver changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchRaceDnaProfile(selectedDriverId).then((res) => {
      if (isMounted) {
        setProfile(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedDriverId]);

  const triggerCloseWithFalling = () => {
    if (isFalling) return;
    setIsFalling(true);
    setTimeout(() => {
      setIsNavOpen(false);
      setIsFalling(false);
    }, 700);
  };

  const handleToggleMenu = () => {
    if (isNavOpen) {
      triggerCloseWithFalling();
    } else {
      setIsFalling(false);
      setIsNavOpen(true);
    }
  };

  const currentDriver = DRIVERS.find(d => d.id === selectedDriverId) || DRIVERS[0];

  // Calculate polygon points for 6-axis SVG Radar Chart
  const getRadarPolygonPoints = (metrics: RaceDnaProfile['metrics'] | undefined) => {
    if (!metrics) return '';
    const center = 100;
    const radius = 70;
    
    // Axis angles (in radians, starting from top -90deg)
    const axes = [
      metrics.aggression,
      metrics.composure,
      metrics.recoverySpeed,
      metrics.communicationClarity,
      metrics.pressureHandling,
      metrics.consistency,
    ];

    const points = axes.map((val, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const r = (val / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return points.join(' ');
  };

  return (
    <div className="telemetry-page-container" style={{ background: '#050505', color: '#ffffff', minHeight: '100vh' }}>
      {/* Top Header Bar */}
      <div style={{ position: 'relative' }}>
        <Header isOpen={isNavOpen} onToggleMenu={handleToggleMenu} />
        <NavDrawer
          isOpen={isNavOpen}
          isFalling={isFalling}
          onClose={triggerCloseWithFalling}
          onOpenTicketModal={() => {
            setIsNavOpen(false);
            if (onOpenTelemetry) onOpenTelemetry();
            else onBackToLanding();
          }}
          onGoToLandingPage={onBackToLanding}
          onGoToRecordsVault={() => {
            setIsNavOpen(false);
            if (onOpenRecordsVault) onOpenRecordsVault();
            else onBackToLanding();
          }}
          onGoToHowItWorks={() => {
            setIsNavOpen(false);
            if (onOpenHowItWorks) onOpenHowItWorks();
            else onBackToLanding();
          }}
        />
      </div>

      {/* Sub Header Title Bar */}
      <div className="telemetry-sub-bar" style={{ background: 'rgba(12, 12, 12, 0.95)', borderBottom: '1px solid rgba(226, 6, 19, 0.3)' }}>
        <div className="sub-bar-left">
          <div className="telemetry-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Dna size={22} color="#e20613" />
            <div>
              <span className="title-redline" style={{ color: '#e20613', letterSpacing: '0.1em' }}>RACEDNA™ ENGINE</span>
              <span className="title-sub">THE COGNITIVE SIGNATURE OF A DRIVER</span>
            </div>
          </div>
        </div>

        <div className="sub-bar-right">
          <div className="status-live-badge" style={{ background: 'rgba(226, 6, 19, 0.15)', border: '1px solid #e20613', color: '#ffffff' }}>
            <Activity size={12} color="#e20613" className="pulse-red" />
            <span>COGNITIVE MODEL ONLINE</span>
          </div>

          <button className="back-landing-btn" onClick={onBackToLanding}>
            <ArrowLeft size={16} />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      </div>

      {/* Main RaceDNA Body Layout */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
        
        {/* SECTION 2: Hero Statement & Driver Selector Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ 
            background: 'linear-gradient(180deg, rgba(18, 18, 18, 0.9) 0%, rgba(8, 8, 8, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e20613', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Sparkles size={14} /> AI-DERIVED RACE-PERFORMANCE & COMMUNICATION PROFILING
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px 0', lineHeight: 1.15 }}>
            RACEDNA™
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#eee', maxWidth: '780px', lineHeight: 1.5, margin: '0 0 20px 0', fontWeight: 500 }}>
            "Every driver responds differently under pressure. <span style={{ color: '#e20613', fontWeight: 700 }}>REDLINE learns those patterns.</span>"
          </p>

          <p style={{ fontSize: '0.86rem', color: '#888', maxWidth: '820px', lineHeight: 1.6, margin: 0 }}>
            Formula 1 measures every sensor on the car. REDLINE measures the driver's cognitive state. RaceDNA synthesizes live driver team radio communications, acoustic stress acceleration, recovery behavior, and lap performance into an individualized cognitive signature.
          </p>

          {/* Driver Selector Pills */}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', letterSpacing: '0.1em', marginRight: '6px' }}>SELECT DRIVER:</span>
            {DRIVERS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDriverId(d.id)}
                style={{
                  background: selectedDriverId === d.id ? '#e20613' : 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: `1px solid ${selectedDriverId === d.id ? '#e20613' : 'rgba(255, 255, 255, 0.15)'}`,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{d.avatar}</span>
                <span>{d.code}</span>
                <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>#{d.number}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {loading || !profile ? (
          /* Loading State */
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <Activity className="spin-icon" size={36} color="#e20613" style={{ marginBottom: '12px' }} />
            <div style={{ fontFamily: 'var(--font-sub)', fontWeight: 700, letterSpacing: '0.1em' }}>SYNTHESIZING RACEDNA™ COGNITIVE PROFILE...</div>
          </div>
        ) : (
          <>
            {/* SECTION 3: Driver Profile Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(226, 6, 19, 0.35)',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              {/* Subtle Animated Background Waveform */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 120" preserveAspectRatio="none">
                  <path d="M0 60 Q150 10 300 60 T600 60 T900 60" fill="none" stroke="#e20613" strokeWidth="3" />
                  <path d="M0 60 Q200 100 400 60 T800 60" fill="none" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>

              {/* Driver Avatar Circle with Pulsing Cognitive Rings */}
              <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#e20613" strokeWidth="2" fill="none" strokeDasharray="6 4" />
                  <circle cx="50" cy="50" r="38" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" fill="none" />
                </svg>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  background: 'radial-gradient(circle, rgba(226,6,19,0.3) 0%, rgba(20,20,20,1) 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 0 20px rgba(226, 6, 19, 0.4)',
                }}>
                  {currentDriver.avatar}
                </div>
              </div>

              {/* Driver Info & Signature Classification */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', letterSpacing: '0.12em' }}>DRIVER PROFILE</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#e20613', background: 'rgba(226,6,19,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    #{profile.driverNumber} // {profile.driverCode}
                  </span>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.01em', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                  {profile.driverName}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '1rem', 
                    fontWeight: 900, 
                    color: '#ffffff', 
                    background: '#e20613', 
                    padding: '4px 12px', 
                    borderRadius: '4px',
                    letterSpacing: '0.08em',
                  }}>
                    {profile.signatureClassification}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#ccc', lineHeight: 1.5, margin: '8px 0 0 0', maxWidth: '680px' }}>
                  {profile.signatureDescription}
                </p>
              </div>

              {/* Status Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>STATUS</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#36b37e', background: 'rgba(54,179,126,0.12)', border: '1px solid rgba(54,179,126,0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                  <CheckCircle2 size={14} /> ANALYSIS COMPLETE
                </div>
              </div>
            </motion.div>

            {/* SECTION 4 & 7: Core Metrics + Radar Chart + Cognitive Load Index (2-Column Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              
              {/* Radar Chart & 6 Core Metrics */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} color="#e20613" /> RACEDNA™ COGNITIVE METRICS
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700 }}>6-AXIS DISSECTION</span>
                </div>

                {/* SVG Radar Spider Chart */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', margin: '10px 0 20px 0' }}>
                  <svg width="220" height="220" viewBox="0 0 200 200">
                    {/* Concentric grid circles */}
                    {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                      <circle 
                        key={i} 
                        cx="100" 
                        cy="100" 
                        r={70 * level} 
                        fill="none" 
                        stroke="rgba(255, 255, 255, 0.08)" 
                        strokeDasharray={i % 2 === 1 ? '2 2' : 'none'} 
                      />
                    ))}

                    {/* 6 Radial spokes */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const angle = (Math.PI / 3) * i - Math.PI / 2;
                      const x = 100 + 70 * Math.cos(angle);
                      const y = 100 + 70 * Math.sin(angle);
                      return (
                        <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                      );
                    })}

                    {/* Polygon Value Fill */}
                    <polygon 
                      points={getRadarPolygonPoints(profile.metrics)} 
                      fill="rgba(226, 6, 19, 0.35)" 
                      stroke="#e20613" 
                      strokeWidth="2.5" 
                    />
                  </svg>
                </div>

                {/* 6 Metrics Grid Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>AGGRESSION</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{profile.metrics.aggression} <span style={{ fontSize: '0.7rem', color: '#e20613' }}>/ 100</span></div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>COMPOSURE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{profile.metrics.composure} <span style={{ fontSize: '0.7rem', color: '#e20613' }}>/ 100</span></div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>RECOVERY SPEED</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{profile.metrics.recoverySpeed} <span style={{ fontSize: '0.7rem', color: '#e20613' }}>/ 100</span></div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>COMMUNICATION</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{profile.metrics.communicationClarity} <span style={{ fontSize: '0.7rem', color: '#e20613' }}>/ 100</span></div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>PRESSURE HANDLING</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{profile.metrics.pressureHandling} <span style={{ fontSize: '0.7rem', color: '#e20613' }}>/ 100</span></div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>CONSISTENCY</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{profile.metrics.consistency} <span style={{ fontSize: '0.7rem', color: '#e20613' }}>/ 100</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Cognitive Load Index (CLI) Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Gauge size={16} color="#e20613" /> COGNITIVE LOAD INDEX (CLI)
                    </div>
                    {profile.cognitiveLoadIndex.currentCli > 70 && (
                      <span style={{ 
                        background: 'rgba(226, 6, 19, 0.25)', 
                        border: '1px solid #e20613', 
                        color: '#ffffff', 
                        fontSize: '0.72rem', 
                        fontWeight: 900, 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Flame size={12} color="#e20613" /> REDLINE EVENT DETECTED
                      </span>
                    )}
                  </div>

                  {/* Main CLI Gauge Big Number */}
                  <div style={{ textAlign: 'center', padding: '20px 0', background: 'rgba(226,6,19,0.06)', borderRadius: '12px', border: '1px solid rgba(226,6,19,0.2)', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 800, letterSpacing: '0.1em' }}>CURRENT CLI</div>
                    <div style={{ fontSize: '3.6rem', fontWeight: 900, color: profile.cognitiveLoadIndex.currentCli > 75 ? '#e20613' : '#ffffff', lineHeight: 1, margin: '6px 0' }}>
                      {profile.cognitiveLoadIndex.currentCli}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e20613', letterSpacing: '0.08em' }}>
                      {profile.cognitiveLoadIndex.state} ({profile.cognitiveLoadIndex.trend})
                    </div>
                  </div>
                </div>

                {/* Sub Telemetry Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>PEAK CLI</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e20613', marginTop: '2px' }}>{profile.cognitiveLoadIndex.peakCli}</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>AVERAGE CLI</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{profile.cognitiveLoadIndex.averageCli}</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 800 }}>RECOVERY TIME</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#36b37e', marginTop: '2px' }}>{profile.cognitiveLoadIndex.recoveryTimeSec}s</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* SECTION 6: Cognitive Evolution Interactive Horizontal Timeline */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} color="#e20613" /> COGNITIVE EVOLUTION TIMELINE
                </div>
                <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700 }}>HOVER OR CLICK LAP NODES TO INSPECT</span>
              </div>

              {/* Horizontal Lap Step Node Sequence */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '16px 0', overflowX: 'auto' }}>
                {/* Connecting track line */}
                <div style={{ position: 'absolute', top: '50%', left: '40px', right: '40px', height: '2px', background: 'rgba(255, 255, 255, 0.15)', zIndex: 1 }} />

                {profile.cognitiveEvolution.map((ev, idx) => {
                  const isSelected = selectedLapIndex === idx;
                  const isRedline = ev.state === 'REDLINE';
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedLapIndex(idx)}
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '90px',
                      }}
                    >
                      <div 
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: isSelected ? '#ffffff' : '#888',
                          marginBottom: '8px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        LAP {ev.lap}
                      </div>

                      {/* Node Circle */}
                      <div 
                        style={{
                          width: isSelected ? '32px' : '22px',
                          height: isSelected ? '32px' : '22px',
                          borderRadius: '50%',
                          background: isRedline ? '#e20613' : (isSelected ? '#ffffff' : '#1a1a1a'),
                          border: `2px solid ${isRedline ? '#e20613' : (isSelected ? '#e20613' : 'rgba(255,255,255,0.3)')}`,
                          boxShadow: isSelected ? '0 0 16px #e20613' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isRedline && <Flame size={12} color="#ffffff" />}
                      </div>

                      <div 
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: isRedline ? '#e20613' : (isSelected ? '#ffffff' : '#aaa'),
                          marginTop: '8px',
                        }}
                      >
                        {ev.state}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Lap Deep Dive Card */}
              {profile.cognitiveEvolution[selectedLapIndex] && (
                <div style={{ background: 'rgba(226,6,19,0.08)', border: '1px solid rgba(226,6,19,0.3)', borderRadius: '12px', padding: '16px 20px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e20613', letterSpacing: '0.08em' }}>
                      LAP {profile.cognitiveEvolution[selectedLapIndex].lap} TELEMETRY DEBRIEF // STATE: {profile.cognitiveEvolution[selectedLapIndex].state}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ffffff' }}>
                      CLI {profile.cognitiveEvolution[selectedLapIndex].cli}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#ffffff', italic: true, margin: '4px 0 8px 0', fontFamily: 'var(--font-sub)' }}>
                    "{profile.cognitiveEvolution[selectedLapIndex].radioQuote}"
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#aaa' }}>
                    <strong style={{ color: '#ccc' }}>PERFORMANCE IMPACT:</strong> {profile.cognitiveEvolution[selectedLapIndex].performanceImpact}
                  </div>
                </div>
              )}
            </motion.div>

            {/* SECTION 8: AI-Derived Driver Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              style={{ marginBottom: '24px' }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="#e20613" /> AI-DERIVED DRIVER INSIGHTS
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {profile.aiDriverInsights.map((ins, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#0a0a0a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e20613', letterSpacing: '0.1em', marginBottom: '4px' }}>
                      {ins.numberStr} // {ins.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      {ins.subtitle}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: 1.5, margin: 0 }}>
                      "{ins.text}"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SECTION 9: "Why This Driver Is Different" Comparison */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                background: 'linear-gradient(180deg, rgba(226,6,19,0.12) 0%, rgba(10,10,10,0.95) 100%)',
                border: '1px solid rgba(226, 6, 19, 0.4)',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e20613', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                CORE CONCEPTUAL USP
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.01em', margin: '0 0 20px 0' }}>
                {profile.comparison.conceptualUsp}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Driver A */}
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(226,6,19,0.3)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '10px' }}>
                    {profile.comparison.driverA.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong>Aggression Pattern:</strong> {profile.comparison.driverA.aggression}</div>
                    <div><strong>Recovery Trajectory:</strong> {profile.comparison.driverA.recovery}</div>
                    <div><strong>Radio Style:</strong> {profile.comparison.driverA.communication}</div>
                    <div style={{ color: '#e20613', fontWeight: 800, marginTop: '4px' }}>★ {profile.comparison.driverA.keyTrait}</div>
                  </div>
                </div>

                {/* Driver B */}
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '10px' }}>
                    {profile.comparison.driverB.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong>Aggression Pattern:</strong> {profile.comparison.driverB.aggression}</div>
                    <div><strong>Recovery Trajectory:</strong> {profile.comparison.driverB.recovery}</div>
                    <div><strong>Radio Style:</strong> {profile.comparison.driverB.communication}</div>
                    <div style={{ color: '#aaa', fontWeight: 800, marginTop: '4px' }}>★ {profile.comparison.driverB.keyTrait}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SECTION 10: Expandable AI Explanation ("WHY?") */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px 24px',
              }}
            >
              <button
                onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HelpCircle size={18} color="#e20613" />
                  <span>{profile.aiExplanation.title}</span>
                </div>
                {isWhyExpanded ? <ChevronUp size={20} color="#e20613" /> : <ChevronDown size={20} color="#888" />}
              </button>

              <AnimatePresence>
                {isWhyExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#888', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      EVIDENCE & SIGNAL CORRELATION (CONFIDENCE: {profile.aiExplanation.confidence}%):
                    </div>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#ccc', lineHeight: 1.6 }}>
                      {profile.aiExplanation.evidence.map((ev, i) => (
                        <li key={i} style={{ marginBottom: '6px' }}>✓ {ev}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
