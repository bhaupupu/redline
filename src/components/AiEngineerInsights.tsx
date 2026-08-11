import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AiEngineerInsightsProps {
  insight: string;
  summary: string;
  driverName: string;
  stressScore: number;
}

export const AiEngineerInsights: React.FC<AiEngineerInsightsProps> = ({
  insight,
  summary,
  driverName,
  stressScore,
}) => {
  if (!insight || insight.trim().length === 0) {
    return (
      <div className="ai-insights-card">
        <div className="card-header-bar">
          <div className="header-left-title">
            <Sparkles size={18} color="#e20613" />
            <span>AI RACE ENGINEER SYNTHESIS & INSIGHTS</span>
          </div>
          <span className="ai-engine-badge" style={{ opacity: 0.6 }}>IDLE // STANDBY</span>
        </div>

        <div style={{ padding: '36px 20px', textAlign: 'center', color: '#888' }}>
          <Sparkles size={32} color="#e20613" style={{ marginBottom: '10px', opacity: 0.6 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            NO AI RACE ENGINEER SYNTHESIS GENERATED YET
          </div>
          <div style={{ fontSize: '0.78rem', color: '#aaa' }}>
            Drop an audio file above or select a sample clip to trigger multimodal AI synthesis & strategy recommendations.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-insights-card">
      <div className="card-header-bar">
        <div className="header-left-title">
          <Sparkles size={18} color="#e20613" />
          <span>AI RACE ENGINEER SYNTHESIS & INSIGHTS</span>
        </div>
        <span className="ai-engine-badge">MULTIMODAL FUSION ONLINE</span>
      </div>

      <div className="insight-body">
        <div className="insight-hero-statement">
          <ArrowRight size={16} color="#e20613" />
          <span>{insight}</span>
        </div>

        {summary && (
          <div className="insight-summary-box">
            <div className="summary-title">ACOUSTIC & LINGUISTIC DETAILED SUMMARY</div>
            <p className="summary-p">{summary}</p>
          </div>
        )}

        <div className="insight-recommendations">
          <div className="rec-item">
            <span className="rec-dot" style={{ backgroundColor: stressScore > 75 ? '#e20613' : '#36b37e' }} />
            <span>
              {stressScore > 75
                ? `HIGH PIT WALL PRIORITY: Issue radio calming protocol for ${driverName}. Reduce pit stop call urgency to avoid cognitive lockup.`
                : `NOMINAL PIT WALL PRIORITY: Driver cognitive load is well balanced for ${driverName}. Maintain current pit strategy.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
