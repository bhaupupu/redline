import React from 'react';

export const InfoSection: React.FC = () => {
  return (
    <section className="narrative-banner">
      <div>
        <h2 className="heading-extended narrative-headline">
          REAL-TIME TELEMETRY INTELLIGENCE.
        </h2>
        <p className="narrative-sub">
          AI Multimodal Driver Radio & Tactical Engine.
        </p>
      </div>

      <div className="narrative-text-box">
        <p>
          REDLINE processes live driver team radio communications across <strong>FORMULA 1® GRAND PRIX RACES</strong>, delivering high-frequency acoustic DSP stress analysis and speech classification directly to the pit wall.
        </p>
        <p>
          Engineered for high-intensity race environments, REDLINE correlates acoustic stress markers, volume acceleration, and phrase keyword urgency to empower race engineers with automated tactical recommendations from lights out to the final lap.
        </p>
      </div>
    </section>
  );
};
