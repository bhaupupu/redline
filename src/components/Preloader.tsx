import React, { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, autoStart = true }) => {
  // litCount: 0 = none lit, 1..5 = number of red lights turned on
  const [litCount, setLitCount] = useState<number>(0);
  const [isGreen, setIsGreen] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const startAnimation = () => {
    // Reset state
    setLitCount(0);
    setIsGreen(false);
    setIsFading(false);
    setIsDone(false);

    // Sequence timings (in ms)
    const t1 = setTimeout(() => setLitCount(1), 400);
    const t2 = setTimeout(() => setLitCount(2), 800);
    const t3 = setTimeout(() => setLitCount(3), 1200);
    const t4 = setTimeout(() => setLitCount(4), 1600);
    const t5 = setTimeout(() => setLitCount(5), 2000);

    // T = 2700ms: ALL GREEN (GO!)
    const tGreen = setTimeout(() => {
      setIsGreen(true);
    }, 2700);

    // T = 3500ms: Start Fading overlay
    const tFade = setTimeout(() => {
      setIsFading(true);
    }, 3500);

    // T = 4300ms: Complete and unmount overlay
    const tEnd = setTimeout(() => {
      setIsDone(true);
      if (onComplete) {
        onComplete();
      }
    }, 4300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tGreen);
      clearTimeout(tFade);
      clearTimeout(tEnd);
    };
  };

  useEffect(() => {
    if (autoStart) {
      const cleanup = startAnimation();
      return cleanup;
    }
  }, [autoStart]);

  if (isDone) return null;

  // Calculate ambient glow center offset based on lit circles
  let auraClass = '';
  if (isGreen || litCount === 5) {
    auraClass = isGreen ? 'aura-green aura-active-5' : 'aura-red aura-active-5';
  } else if (litCount === 1) {
    auraClass = 'aura-red aura-active-1';
  } else if (litCount === 2) {
    auraClass = 'aura-red aura-active-2';
  } else if (litCount === 3) {
    auraClass = 'aura-red aura-active-3';
  } else if (litCount === 4) {
    auraClass = 'aura-red aura-active-4';
  }

  return (
    <div 
      className={`preloader-overlay ${isFading ? 'preloader-fade-out' : ''} ${isGreen ? 'state-green' : ''}`}
      aria-label="Website Loading Animation"
    >
      {/* Background carbon pattern & vignette */}
      <div className="preloader-bg-vignette" />

      {/* Ambient Large Radial Glow Aura */}
      <div className={`ambient-aura ${auraClass}`} />

      {/* Centered Audi/F1 5-Ring Start Gantry */}
      <div className="preloader-center-content">
        <div className="rings-container">
          {[1, 2, 3, 4, 5].map((index) => {
            const isLit = isGreen || index <= litCount;
            return (
              <div
                key={index}
                className={`ring-wrapper ${isLit ? 'ring-lit' : 'ring-unlit'} ${
                  isGreen ? 'ring-green' : 'ring-red'
                }`}
              >
                {/* Outer concentric thin border ring */}
                <div className="ring-outer-border" />

                {/* Inner solid circle glow element */}
                <div className="ring-inner-circle" />

                {/* Pulse wave ring on activation */}
                {isLit && <div className="ring-pulse-wave" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
