import React from 'react';

interface StressGaugeProps {
  score: number; // 0 - 100
  maxScore: number;
  moodLabel: string;
  confidence: number;
}

export const StressGauge: React.FC<StressGaugeProps> = ({
  score,
  maxScore,
  moodLabel,
  confidence,
}) => {
  // SVG Circle parameters
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine stress tier colors
  let strokeColor = '#36b37e'; // Green (Calm)
  let badgeBg = 'rgba(54, 179, 126, 0.15)';
  let badgeBorder = 'rgba(54, 179, 126, 0.4)';

  if (score >= 80) {
    strokeColor = '#e20613'; // Critical Redline Red
    badgeBg = 'rgba(226, 6, 19, 0.15)';
    badgeBorder = 'rgba(226, 6, 19, 0.4)';
  } else if (score >= 60) {
    strokeColor = '#ffab00'; // Orange (Elevated)
    badgeBg = 'rgba(255, 171, 0, 0.15)';
    badgeBorder = 'rgba(255, 171, 0, 0.4)';
  } else if (score >= 35) {
    strokeColor = '#00b8d9'; // Cyan / Yellow (Focused)
    badgeBg = 'rgba(0, 184, 217, 0.15)';
    badgeBorder = 'rgba(0, 184, 217, 0.4)';
  }

  return (
    <div className="stress-gauge-card">
      <div className="gauge-header">
        <span className="gauge-title">DRIVER STRESS INDEX</span>
        <span className="gauge-confidence">AI CONFIDENCE: {confidence}%</span>
      </div>

      <div className="gauge-svg-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>

        {/* Center Readout */}
        <div className="gauge-readout">
          <div className="gauge-score-number" style={{ color: strokeColor }}>
            {score}
          </div>
          <div className="gauge-score-label">/ 100</div>
          <div
            className="gauge-mood-badge"
            style={{
              backgroundColor: badgeBg,
              borderColor: badgeBorder,
              color: strokeColor,
            }}
          >
            {moodLabel}
          </div>
        </div>
      </div>

      <div className="gauge-footer-meta">
        <span>PEAK STRESS: <strong style={{ color: '#fff' }}>{maxScore} / 100</strong></span>
        <span>ZONE: <strong style={{ color: strokeColor }}>{score >= 80 ? 'REDLINE' : score >= 60 ? 'HIGH' : score >= 35 ? 'ELEVATED' : 'NOMINAL'}</strong></span>
      </div>
    </div>
  );
};
