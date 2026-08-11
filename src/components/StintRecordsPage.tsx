import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Search, Trash2, ChevronRight, Activity, Flame, ShieldAlert, Zap, Filter, Play } from 'lucide-react';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Driver, AnalysisResult } from '../types/telemetry';
import { DRIVERS, PRESET_ANALYSES } from '../services/sampleClips';
import { Footer } from './Footer';

interface StintRecordsPageProps {
  onBackToLanding: () => void;
  onOpenTelemetryForRecord: (record: AnalysisResult) => void;
  onOpenTelemetry?: () => void;
  onOpenHowItWorks?: () => void;
}

export const StintRecordsPage: React.FC<StintRecordsPageProps> = ({
  onBackToLanding,
  onOpenTelemetryForRecord,
  onOpenTelemetry,
  onOpenHowItWorks,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'CRITICAL' | 'ELEVATED' | 'FOCUSED' | 'UPLOADS'>('ALL');

  // Load preset canonical records + user uploads from localStorage
  const [records, setRecords] = useState<AnalysisResult[]>(() => {
    const canonical = Object.values(PRESET_ANALYSES);
    try {
      const saved = localStorage.getItem('redline_stint_history');
      const userUploads: AnalysisResult[] = saved ? JSON.parse(saved) : [];
      // Combine user uploads on top, then canonical
      const combined = [...userUploads];
      canonical.forEach((c) => {
        if (!combined.some((item) => item.audioFileName === c.audioFileName)) {
          combined.push(c);
        }
      });
      return combined;
    } catch {
      return canonical;
    }
  });

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

  const handleDeleteRecord = (audioFileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = records.filter((r) => r.audioFileName !== audioFileName);
    setRecords(updated);
    try {
      const userOnly = updated.filter((r) => !Object.values(PRESET_ANALYSES).some((c) => c.audioFileName === r.audioFileName));
      localStorage.setItem('redline_stint_history', JSON.stringify(userOnly));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.audioFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driver.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.moodLabel.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'CRITICAL') return r.overallStressScore >= 75 || r.moodLabel.includes('Redline') || r.moodLabel.includes('Frustrated');
    if (filterCategory === 'ELEVATED') return r.overallStressScore >= 45 && r.overallStressScore < 75;
    if (filterCategory === 'FOCUSED') return r.overallStressScore < 45;
    if (filterCategory === 'UPLOADS') return !Object.values(PRESET_ANALYSES).some((c) => c.audioFileName === r.audioFileName);

    return true;
  });

  // Calculate analytics stats
  const totalCount = records.length;
  const peakStress = records.reduce((max, r) => Math.max(max, r.maxStressScore), 0);
  const avgStress = Math.round(records.reduce((sum, r) => sum + r.overallStressScore, 0) / (totalCount || 1));
  const criticalCount = records.filter((r) => r.overallStressScore >= 75).length;

  return (
    <div className="telemetry-page-container">
      {/* Navigation Header */}
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
          onGoToRecordsVault={() => setIsNavOpen(false)}
          onGoToHowItWorks={() => {
            setIsNavOpen(false);
            if (onGoToHowItWorks) onGoToHowItWorks();
            else onBackToLanding();
          }}
        />
      </div>

      {/* Sub Header Title Bar */}
      <div className="telemetry-sub-bar">
        <div className="sub-bar-left">
          <div className="telemetry-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={24} color="#e20613" />
            <div>
              <span className="title-redline">F1 TELEMETRY RECORDS VAULT</span>
              <span className="title-sub">DEDICATED HISTORICAL RACING TELEMETRY & COGNITIVE STINT ARCHIVE</span>
            </div>
          </div>
        </div>

        <div className="sub-bar-right">
          <div className="status-live-badge">
            <Activity size={12} className="pulse-red" />
            <span>VAULT ENGINE ACTIVE ({totalCount} RECORDS)</span>
          </div>

          <button className="back-landing-btn" onClick={onBackToLanding}>
            <ArrowLeft size={16} />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      </div>

      {/* Main Records Body Layout */}
      <main className="telemetry-page-body" style={{ paddingBottom: '40px' }}>
        {/* Top Summary Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div className="bento-card" style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <span>TOTAL STINTS LOGGED</span>
              <Database size={16} color="#e20613" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>{totalCount}</div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '4px' }}>Canonical presets & user uploads</div>
          </div>

          <div className="bento-card" style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(226, 6, 19, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <span>PEAK FLEET STRESS</span>
              <Flame size={16} color="#e20613" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e20613', marginTop: '6px' }}>{peakStress}%</div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '4px' }}>Highest recorded vocal stress peak</div>
          </div>

          <div className="bento-card" style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <span>AVG COGNITIVE LOAD</span>
              <Zap size={16} color="#ffab00" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffab00', marginTop: '6px' }}>{avgStress}/100</div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '4px' }}>Mean driver mental workload</div>
          </div>

          <div className="bento-card" style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <span>CRITICAL REDLINE ALERTS</span>
              <ShieldAlert size={16} color="#e20613" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>{criticalCount}</div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '4px' }}>Stints exceeding 75% stress index</div>
          </div>
        </div>

        {/* Search & Filtering Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justify: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '8px 12px', borderRadius: '6px', minWidth: '260px', flex: 1 }}>
            <Search size={16} color="#888" />
            <input
              type="text"
              placeholder="Search by file, driver name, code, or mood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                width: '100%',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} /> FILTER:
            </span>
            {(['ALL', 'CRITICAL', 'ELEVATED', 'FOCUSED', 'UPLOADS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  background: filterCategory === cat ? '#e20613' : 'rgba(255, 255, 255, 0.05)',
                  color: filterCategory === cat ? '#fff' : '#aaa',
                  border: filterCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {cat === 'ALL' ? 'ALL STINTS' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stint Records List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filteredRecords.map((r, idx) => {
            const isUserUpload = !Object.values(PRESET_ANALYSES).some((c) => c.audioFileName === r.audioFileName);
            const isRedline = r.overallStressScore >= 75;

            return (
              <div
                key={idx}
                className="bento-card"
                onClick={() => onOpenTelemetryForRecord(r)}
                style={{
                  padding: '20px',
                  background: isRedline ? 'linear-gradient(145deg, rgba(226, 6, 19, 0.12), rgba(0, 0, 0, 0.8))' : 'rgba(255, 255, 255, 0.03)',
                  border: isRedline ? '1px solid rgba(226, 6, 19, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* Header Tag Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{r.driver.avatar}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: r.driver.color || '#fff' }}>
                      {r.driver.code} #{r.driver.number}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{r.driver.name}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isUserUpload ? 'rgba(0, 184, 217, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: isUserUpload ? '#00b8d9' : '#888',
                      border: isUserUpload ? '1px solid rgba(0, 184, 217, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {isUserUpload ? 'USER UPLOAD' : 'CANONICAL RECORD'}
                  </span>
                </div>

                {/* File Title */}
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '14px', wordBreak: 'break-word' }}>
                  {r.audioFileName}
                </div>

                {/* Stress Score Bar & Mood Tag */}
                <div style={{ marginBottom: '14px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span style={{ color: '#aaa', fontWeight: 700 }}>OVERALL STRESS SCORE:</span>
                    <span style={{ color: isRedline ? '#e20613' : '#ffab00', fontWeight: 900 }}>
                      {r.overallStressScore}% ({r.moodLabel})
                    </span>
                  </div>

                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${r.overallStressScore}%`,
                        background: isRedline ? 'linear-gradient(90deg, #ffab00, #e20613)' : 'linear-gradient(90deg, #36b37e, #ffab00)',
                      }}
                    />
                  </div>
                </div>

                {/* Acoustic Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.7rem', color: '#888', marginBottom: '14px' }}>
                  <div>
                    <div>VOCAL PITCH</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{r.acousticFeatures.pitch} Hz</div>
                  </div>

                  <div>
                    <div>DURATION</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{Math.round(r.duration)}s</div>
                  </div>

                  <div>
                    <div>CONFIDENCE</div>
                    <div style={{ color: '#36b37e', fontWeight: 700 }}>{r.confidence}%</div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    className="btn-pill-red"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTelemetryForRecord(r);
                    }}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    <span>INSPECT TELEMETRY</span>
                    <ChevronRight size={14} />
                  </button>

                  {isUserUpload && (
                    <button
                      onClick={(e) => handleDeleteRecord(r.audioFileName, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.7rem',
                      }}
                      title="Delete Stint Record"
                    >
                      <Trash2 size={12} />
                      <span>DELETE</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecords.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
            <Database size={40} color="#e20613" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>NO STINT RECORDS FOUND</div>
            <div style={{ fontSize: '0.8rem' }}>No telemetry logs matched your active search or filter parameters.</div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
