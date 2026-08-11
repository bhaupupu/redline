import React from 'react';

interface RedlineLogoProps {
  height?: number;
  showText?: boolean;
  className?: string;
}

export const RedlineLogo: React.FC<RedlineLogoProps> = ({ 
  height = 24, 
  showText = true,
  className = '' 
}) => {
  return (
    <div className={`redline-logo-brand ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      {/* High-Tech REDLINE Pulse & Telemetry Waveform SVG Icon */}
      <svg 
        viewBox="0 0 40 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto', display: 'block' }}
        aria-label="REDLINE Telemetry Logo"
      >
        <path d="M2 24 L10 24 L15 6 L21 30 L27 16 L31 24 L38 24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 4 L38 4" stroke="#e20613" strokeWidth="3" strokeLinecap="round" />
        <circle cx="21" cy="30" r="2.5" fill="#e20613" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ 
            fontFamily: 'var(--font-heading, sans-serif)', 
            fontWeight: 900, 
            fontSize: `${height * 0.72}px`, 
            letterSpacing: '0.12em', 
            color: '#ffffff',
            textTransform: 'uppercase'
          }}>
            RED<span style={{ color: '#e20613' }}>LINE</span>
          </span>
          <span style={{ 
            fontFamily: 'var(--font-sub, monospace)', 
            fontSize: `${height * 0.3}px`, 
            letterSpacing: '0.22em', 
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}>
            TELEMETRY
          </span>
        </div>
      )}
    </div>
  );
};
