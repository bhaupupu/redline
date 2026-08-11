import React, { useState } from 'react';
import { ArrowLeft, Cpu, Radio, ShieldAlert, Zap, Activity, Volume2, Database, HelpCircle, CheckCircle2, FileText, BarChart3, Lock } from 'lucide-react';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Footer } from './Footer';
import { SAMPLE_RADIO_DATASET_PRESETS, RadioDatasetPreset } from '../services/sampleClips';

interface HowItWorksPageProps {
  onBackToLanding: () => void;
  onLaunchTelemetry: (samplePreset?: RadioDatasetPreset) => void;
  onOpenRecordsVault: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onBackToLanding,
  onLaunchTelemetry,
  onOpenRecordsVault,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'diarization' | 'stress' | 'insights'>('pipeline');

  const handleToggleMenu = () => {
    if (isNavOpen) {
      triggerCloseWithFalling();
    } else {
      setIsFalling(false);
      setIsNavOpen(true);
    }
  };

  const triggerCloseWithFalling = () => {
    if (isFalling) return;
    setIsFalling(true);
    setTimeout(() => {
      setIsNavOpen(false);
      setIsFalling(false);
    }, 700);
  };

  return (
    <div className="how-it-works-container" style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      {/* Top Header Bar */}
      <div style={{ position: 'relative' }}>
        <Header 
          isOpen={isNavOpen} 
          onToggleMenu={handleToggleMenu} 
        />

        <NavDrawer
          isOpen={isNavOpen}
          isFalling={isFalling}
          onClose={triggerCloseWithFalling}
          onOpenTicketModal={() => onLaunchTelemetry()}
          onGoToLandingPage={onBackToLanding}
          onGoToRecordsVault={onOpenRecordsVault}
        />
      </div>

      {/* Navigation Sub-Bar */}
      <div className="telemetry-sub-bar" style={{ background: 'rgba(15, 15, 15, 0.95)', borderBottom: '1px solid rgba(226, 6, 19, 0.3)' }}>
        <div className="sub-bar-left">
          <div className="telemetry-page-title">
            <span className="title-redline" style={{ color: '#e20613' }}>HOW REDLINE WORKS</span>
            <span className="title-sub">SYSTEM ARCHITECTURE & MULTIMODAL AI PIPELINE</span>
          </div>
        </div>

        <div className="sub-bar-right" style={{ display: 'flex', gap: '10px' }}>
          <button className="back-landing-btn" onClick={onBackToLanding}>
            <ArrowLeft size={16} />
            <span>BACK TO LANDING</span>
          </button>

          <button 
            className="btn-pill-red" 
            style={{ padding: '8px 18px', fontSize: '0.8rem', fontWeight: 800 }}
            onClick={() => onLaunchTelemetry()}
          >
            <span>LAUNCH TELEMETRY ENGINE</span>
            <Zap size={14} style={{ marginLeft: '6px' }} />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px 60px' }}>
        
        {/* Hero System Architecture Banner */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(226, 6, 19, 0.15) 0%, rgba(10, 10, 10, 0.95) 100%)',
            border: '1px solid rgba(226, 6, 19, 0.4)',
            borderRadius: '16px',
            padding: '36px 32px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e20613', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '12px' }}>
            <Cpu size={18} />
            <span>THE SILENT CO-DRIVER // REDLINE TELEMETRY ARCHITECTURE</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '14px', lineHeight: 1.2 }}>
            Real-Time Acoustic Stress Analysis & Speaker Diarization
          </h1>

          <p style={{ fontSize: '1.02rem', color: '#ccc', maxWidth: '850px', lineHeight: 1.6, marginBottom: '24px' }}>
            REDLINE is a custom multimodal telemetry intelligence platform. It analyzes live driver team radio communications to extract vocal emotion, compute real-time phrase stress scores, differentiate Cockpit Driver speech from Pit Wall Race Engineer directives, and issue automated tactical recommendations to optimize stint performance.
          </p>

          {/* Quick Stat Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '16px 20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>HUGGING FACE DATASET</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e20613', marginTop: '4px' }}>14,681 Radio Calls</div>
              <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '2px' }}>2018–2025 F1 Grand Prix Races</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '16px 20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>STT INFERENCE CASCADE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00b8d9', marginTop: '4px' }}>Whisper V3 Large</div>
              <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '2px' }}>Sub-second Latency Pipeline</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '16px 20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>VOICE DIARIZATION</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#36b37e', marginTop: '4px' }}>Driver vs Engineer</div>
              <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '2px' }}>Acoustic + Phrase Profiling</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '16px 20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>COGNITIVE LOAD INDEX</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffab00', marginTop: '4px' }}>0 – 100 CLI Score</div>
              <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '2px' }}>Multi-Variable Stress Index</div>
            </div>
          </div>
        </div>

        {/* Interactive Navigation Tabs for Operational Pipeline */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', overflowX: 'auto' }}>
          {[
            { id: 'pipeline', label: '1. MULTIMODAL AI PIPELINE', icon: Cpu },
            { id: 'diarization', label: '2. SPEAKER DIARIZATION', icon: Radio },
            { id: 'stress', label: '3. ACOUSTIC STRESS FORMULA', icon: Activity },
            { id: 'insights', label: '4. AI STRATEGY INSIGHTS', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: isActive ? '#e20613' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#fff' : '#aaa',
                  border: `1px solid ${isActive ? '#e20613' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MULTIMODAL AI PIPELINE */}
        {activeTab === 'pipeline' && (
          <div style={{ background: 'rgba(15, 15, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu color="#e20613" /> End-to-End Multimodal Processing Pipeline
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              When a user uploads a team radio audio file (or selects a sample recording), REDLINE routes the clip through a high-performance 4-stage pipeline combining Python FastAPI backend microservices and client-side WebAudio DSP algorithms:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #e20613' }}>
                <div style={{ color: '#e20613', fontWeight: 900, fontSize: '0.8rem', marginBottom: '6px' }}>STAGE 1 // SIGNAL DECODING</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>Audio Signal Ingestion</h3>
                <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.5 }}>
                  Parses `.WAV`, `.MP3`, `.M4A`, `.OGG`, and `.FLAC` files up to 50MB. Calculates total duration, bitrate, framing rate, and normalizes audio buffers.
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #00b8d9' }}>
                <div style={{ color: '#00b8d9', fontWeight: 900, fontSize: '0.8rem', marginBottom: '6px' }}>STAGE 2 // SPEECH RECOGNITION</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>Hugging Face STT Cascade</h3>
                <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.5 }}>
                  Queries `openai/whisper-large-v3` with `distil-whisper` fallbacks to extract accurate timestamped phrases and F1 terminology.
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #36b37e' }}>
                <div style={{ color: '#36b37e', fontWeight: 900, fontSize: '0.8rem', marginBottom: '6px' }}>STAGE 3 // ACOUSTIC DSP</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>Acoustic Stress Profiling</h3>
                <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.5 }}>
                  Extracts vocal fundamental pitch ($F_0$ in Hz), RMS energy, Zero Crossing Rate (ZCR), speaking cadence (syllables/sec), and pitch variance ($Hz^2$).
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ffab00' }}>
                <div style={{ color: '#ffab00', fontWeight: 900, fontSize: '0.8rem', marginBottom: '6px' }}>STAGE 4 // TACTICAL SYNTHESIS</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>AI Race Engineer Insights</h3>
                <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.5 }}>
                  Synthesizes cognitive stress scores and lap delta impact into actionable pit wall strategy directives (Strat modes, brake bias, radio blackouts).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPEAKER DIARIZATION */}
        {activeTab === 'diarization' && (
          <div style={{ background: 'rgba(15, 15, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio color="#00b8d9" /> Driver vs. Race Engineer Voice Diarization
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              F1 Team Radio transmissions feature alternating dialogue between the cockpit driver and pit wall strategy engineers. REDLINE uses dual acoustic-linguistic heuristics to differentiate voices automatically:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
              {/* Cockpit Driver Column */}
              <div style={{ background: 'rgba(226, 6, 19, 0.08)', border: '1px solid rgba(226, 6, 19, 0.3)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e20613', fontWeight: 900, fontSize: '0.9rem', marginBottom: '12px' }}>
                  <ShieldAlert size={18} />
                  <span>COCKPIT DRIVER VOICE PROFILE</span>
                </div>
                <ul style={{ fontSize: '0.88rem', color: '#ccc', lineHeight: 1.8, paddingLeft: '20px' }}>
                  <li><strong>Acoustic Resonance:</strong> Cockpit helmet acoustic filtering, engine background rumble, rapid cadence changes under G-force load.</li>
                  <li><strong>Pitch Profile:</strong> Higher pitch variance (F0 &gt; 220 Hz up to 360 Hz during panic or excitement).</li>
                  <li><strong>Keyword Triggers:</strong> <em>"No grip", "Rear sliding", "Tires are dead", "Request override", "Brakes cooking", "What are you doing"</em>.</li>
                  <li><strong>Visual UI Tag:</strong> 🔴 <strong>COCKPIT DRIVER</strong> (Red/Yellow badge with car number e.g. <code>LEC #16</code>).</li>
                </ul>
              </div>

              {/* Pit Wall Engineer Column */}
              <div style={{ background: 'rgba(0, 184, 217, 0.08)', border: '1px solid rgba(0, 184, 217, 0.3)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00b8d9', fontWeight: 900, fontSize: '0.9rem', marginBottom: '12px' }}>
                  <Radio size={18} />
                  <span>PIT WALL RACE ENGINEER PROFILE</span>
                </div>
                <ul style={{ fontSize: '0.88rem', color: '#ccc', lineHeight: 1.8, paddingLeft: '20px' }}>
                  <li><strong>Acoustic Profile:</strong> Quiet pit wall control room headset environment, steady cadence, low background noise.</li>
                  <li><strong>Pitch Profile:</strong> Flat pitch envelope (F0 ~120 Hz - 165 Hz with low variance).</li>
                  <li><strong>Keyword Triggers:</strong> <em>"Copy that", "Radio check", "Box box", "Strat 3 override", "Delta is", "Pace target verified", "Gap behind"</em>.</li>
                  <li><strong>Visual UI Tag:</strong> 🔷 <strong>PIT WALL ENGINEER</strong> (Cyan/Blue badge e.g. <code>BRYAN BOZZI (Race Engineer)</code>).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACOUSTIC STRESS FORMULA */}
        {activeTab === 'stress' && (
          <div style={{ background: 'rgba(15, 15, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity color="#36b37e" /> Multi-Variable Phrase Stress Scoring Formula
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              The phrase stress score is computed per audio frame using pitch acceleration, volume envelope RMS energy, and linguistic keyword urgency multipliers:
            </p>

            {/* Formula Card */}
            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(54, 179, 126, 0.4)', borderRadius: '10px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', color: '#36b37e', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '8px' }}>CORE STRESS CALCULATION FORMULA</div>
              <div style={{ fontSize: '1.3rem', fontFamily: 'monospace', fontWeight: 800, color: '#fff' }}>
                Stress Score = (0.60 × Pitch Shift Score) + (0.40 × Volume RMS Energy) × Urgency Multiplier
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '18px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ background: 'rgba(54, 179, 126, 0.2)', color: '#36b37e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>0 - 30% STRESS</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '8px 0 4px', color: '#36b37e' }}>Nominal / Calm</h4>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Calculated stint execution, low pitch variance, clear voice cadence.</p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '18px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ background: 'rgba(0, 184, 217, 0.2)', color: '#00b8d9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>30 - 65% STRESS</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '8px 0 4px', color: '#00b8d9' }}>Focused / Elevated</h4>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>High cornering effort, active wheel-to-wheel battles, moderate pitch shifts.</p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '18px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ background: 'rgba(255, 171, 0, 0.2)', color: '#ffab00', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>65 - 80% STRESS</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '8px 0 4px', color: '#ffab00' }}>Frustrated</h4>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Tire degradation callouts, traffic interference, elevated vocal volume.</p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '18px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ background: 'rgba(226, 6, 19, 0.2)', color: '#e20613', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>80 - 100% STRESS</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '8px 0 4px', color: '#e20613' }}>Critical Redline</h4>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Extreme vocal pitch spikes, strategy panic, victory celebrations or safety alerts.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI STRATEGY INSIGHTS */}
        {activeTab === 'insights' && (
          <div style={{ background: 'rgba(15, 15, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap color="#ffab00" /> Automated Pit Wall Strategy & Recommendations
            </h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              REDLINE converts real-time acoustic telemetry into clear pit wall action directives:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e20613', fontWeight: 800, fontSize: '0.88rem', marginBottom: '8px' }}>
                  <ShieldAlert size={16} /> RADIO BLACKOUT DIRECTIVES
                </div>
                <p style={{ fontSize: '0.84rem', color: '#ccc', lineHeight: 1.5 }}>
                  When driver stress crosses 80% in heavy braking zones (e.g. Turn 4 Monza or Turn 10 Silverstone), REDLINE alerts engineers to delay radio callouts until straightaway exit.
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#36b37e', fontWeight: 800, fontSize: '0.88rem', marginBottom: '8px' }}>
                  <Activity size={16} /> ENGINE & STRAT OVERRIDES
                </div>
                <p style={{ fontSize: '0.84rem', color: '#ccc', lineHeight: 1.5 }}>
                  Correlates vocal urgency regarding rear tire slip or power drop with engine map overrides (e.g. Strat 3 override) to preserve stint longevity.
                </p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00b8d9', fontWeight: 800, fontSize: '0.88rem', marginBottom: '8px' }}>
                  <Database size={16} /> TELEMETRY RECAP VAULT
                </div>
                <p style={{ fontSize: '0.84rem', color: '#ccc', lineHeight: 1.5 }}>
                  Every processed stint clip is automatically stored in the dedicated F1 Telemetry Records Vault for post-race driver debriefs and lap correlation analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Try-It-Now Section with 5 Dataset Samples */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '36px', marginTop: '44px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
              TEST THE SYSTEM WITH AUTHENTIC F1 RADIO CALLS (2018–2025)
            </h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Click any sample radio call from the Hugging Face dataset below to launch live multimodal stress analysis:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {SAMPLE_RADIO_DATASET_PRESETS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => onLaunchTelemetry(sample)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e20613';
                  e.currentTarget.style.background = 'rgba(226, 6, 19, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>{sample.driverCode} #{sample.driverNumber}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: sample.overallStressScore > 75 ? '#e20613' : '#36b37e' }}>
                    {sample.grandPrix} • {sample.overallStressScore}% STRESS
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#ccc', fontStyle: 'italic', marginBottom: '8px' }}>
                  {sample.quote}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#e20613', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>LAUNCH ANALYSIS</span> →
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
