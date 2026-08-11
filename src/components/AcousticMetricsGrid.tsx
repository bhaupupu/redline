import React from 'react';
import { AcousticFeatures } from '../types/telemetry';
import { Activity, Zap, Mic, Volume2 } from 'lucide-react';

interface AcousticMetricsGridProps {
  features: AcousticFeatures;
}

export const AcousticMetricsGrid: React.FC<AcousticMetricsGridProps> = ({ features }) => {
  return (
    <div className="acoustic-metrics-grid">
      <div className="metric-card">
        <div className="metric-icon-wrap">
          <Activity size={18} color="#e20613" />
        </div>
        <div className="metric-info">
          <span className="metric-label">PITCH F0 & VARIANCE</span>
          <div className="metric-value-group">
            <span className="metric-main-val">{features.pitch} <small>Hz</small></span>
            <span className="metric-sub-val">±{features.pitchVariance} Hz²</span>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon-wrap">
          <Volume2 size={18} color="#00b8d9" />
        </div>
        <div className="metric-info">
          <span className="metric-label">RMS ENERGY INTENSITY</span>
          <div className="metric-value-group">
            <span className="metric-main-val">{features.rmsEnergy} <small>dB</small></span>
            <span className="metric-sub-val">ZCR: {features.zeroCrossingRate}</span>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon-wrap">
          <Mic size={18} color="#ffab00" />
        </div>
        <div className="metric-info">
          <span className="metric-label">SPEAKING RATE</span>
          <div className="metric-value-group">
            <span className="metric-main-val">{features.speakingRate} <small>syll/s</small></span>
            <span className="metric-sub-val">Cadence High</span>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon-wrap">
          <Zap size={18} color="#36b37e" />
        </div>
        <div className="metric-info">
          <span className="metric-label">VOCAL EMOTION & AROUSAL</span>
          <div className="metric-value-group">
            <span className="metric-main-val">{features.emotion.toUpperCase()}</span>
            <span className="metric-sub-val">Spectral: {features.spectralCentroid}Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
};
