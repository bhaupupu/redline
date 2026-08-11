import React from 'react';
import { TranscriptSegment } from '../types/telemetry';
import { Radio, AlertTriangle, MessageSquareOff, UserCheck, ShieldAlert } from 'lucide-react';

interface TranscriptFeedProps {
  segments: TranscriptSegment[];
  currentTime?: number;
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({ segments, currentTime }) => {
  if (!segments || segments.length === 0) {
    return (
      <div className="transcript-feed-card">
        <div className="card-header-bar">
          <div className="header-left-title">
            <Radio size={18} className="title-icon pulse-red" />
            <span>TEAM RADIO TRANSCRIPT LOG & VOICE DIARIZATION</span>
          </div>
          <span className="count-badge">0 PHRASES ANALYZED</span>
        </div>

        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888', background: 'rgba(0, 0, 0, 0.2)' }}>
          <MessageSquareOff size={36} color="#e20613" style={{ marginBottom: '12px', opacity: 0.7 }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            NO TRANSCRIPT RECORDED YET
          </div>
          <div style={{ fontSize: '0.8rem', maxWidth: '480px', margin: '0 auto', color: '#aaa' }}>
            Upload an audio clip to run AI Speech-to-Text and differentiate between Driver and Race Engineer voices.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-feed-card">
      <div className="card-header-bar">
        <div className="header-left-title">
          <Radio size={18} className="title-icon pulse-red" />
          <span>TEAM RADIO TRANSCRIPT LOG & SPEAKER DIARIZATION (DRIVER VS. ENGINEER)</span>
        </div>
        <span className="count-badge">{segments.length} DIARIZED PHRASES</span>
      </div>

      <div className="transcript-list">
        {segments.map((seg) => {
          let badgeClass = 'urgency-low';
          if (seg.urgencyLevel === 'CRITICAL') badgeClass = 'urgency-critical';
          else if (seg.urgencyLevel === 'HIGH') badgeClass = 'urgency-high';
          else if (seg.urgencyLevel === 'MEDIUM') badgeClass = 'urgency-medium';

          const isEngineer = seg.speaker.includes('Race Engineer') || seg.speaker.includes('PIT WALL');
          const isActive = currentTime !== undefined && currentTime >= seg.startTime && currentTime <= seg.endTime;

          return (
            <div 
              key={seg.id} 
              className={`transcript-item ${badgeClass}`}
              style={{
                transition: 'all 0.3s ease',
                borderLeft: isActive ? '4px solid #e20613' : undefined,
                background: isActive ? 'rgba(226, 6, 19, 0.18)' : undefined,
                boxShadow: isActive ? '0 0 15px rgba(226, 6, 19, 0.3)' : undefined,
              }}
            >
              <div className="item-header" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isEngineer ? (
                    <UserCheck size={14} color="#00b8d9" />
                  ) : (
                    <ShieldAlert size={14} color="#e20613" />
                  )}
                  <span className="speaker-tag" style={{ color: isEngineer ? '#00b8d9' : '#fff' }}>
                    {seg.speaker}
                  </span>
                  <span
                    style={{
                      background: isEngineer ? 'rgba(0, 184, 217, 0.15)' : 'rgba(226, 6, 19, 0.15)',
                      color: isEngineer ? '#00b8d9' : '#e20613',
                      border: `1px solid ${isEngineer ? 'rgba(0, 184, 217, 0.3)' : 'rgba(226, 6, 19, 0.3)'}`,
                      padding: '1px 7px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isEngineer ? 'PIT WALL ENGINEER' : 'COCKPIT DRIVER'}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        background: '#e20613',
                        color: '#fff',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        fontSize: '0.64rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        animation: 'pulse 1.2s infinite',
                      }}
                    >
                      LIVE SPEAKING
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                  <span className="timestamp-tag">
                    00:{seg.startTime.toString().padStart(2, '0')} - 00:{seg.endTime.toString().padStart(2, '0')}
                  </span>
                  <span className={`urgency-badge ${badgeClass}`}>
                    {seg.urgencyLevel === 'CRITICAL' && <AlertTriangle size={12} />}
                    {seg.urgencyLevel} (STRESS: {seg.phraseStressScore})
                  </span>
                </div>
              </div>

              <div className="item-body-text">
                "{seg.text}"
              </div>

              {seg.keywordsDetected && seg.keywordsDetected.length > 0 && (
                <div className="keywords-tags">
                  <span className="kw-label">TRIGGERS:</span>
                  {seg.keywordsDetected.map((kw, i) => (
                    <span key={i} className="kw-pill">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
