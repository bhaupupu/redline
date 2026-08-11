import { RaceDnaProfile } from '../types/raceDna';
import { DRIVERS } from './sampleClips';

/**
 * Driver-specific canonical RaceDNA mock data.
 * Used as fallback when API is offline or backend does not have data.
 */
const CANONICAL_RACEDNA_PROFILES: Record<string, RaceDnaProfile> = {
  verstappen: {
    driverId: 'verstappen',
    driverName: 'Max Verstappen',
    driverNumber: 1,
    driverCode: 'VER',
    signatureClassification: 'AGGRESSIVE OPTIMIZER',
    signatureDescription: 'High aggression under competitive pressure, elite recovery speed after stress spikes, and direct, unfiltered communication during high-load battles.',
    metrics: {
      aggression: 92,
      composure: 78,
      recoverySpeed: 94,
      communicationClarity: 82,
      pressureHandling: 96,
      consistency: 91,
    },
    cognitiveLoadIndex: {
      currentCli: 74,
      state: 'HIGH LOAD',
      trend: '↑ +12%',
      peakCli: 91,
      averageCli: 58,
      recoveryTimeSec: 18,
    },
    cognitiveEvolution: [
      { lap: 1, state: 'FOCUSED', cli: 38, radioQuote: 'Lights out. Clean launch through Turn 1.', performanceImpact: 'Nominal delta' },
      { lap: 8, state: 'ELEVATED', cli: 62, radioQuote: 'Tires warming up. Closing gap on Sector 2.', performanceImpact: '-0.12s lap delta' },
      { lap: 14, state: 'HIGH LOAD', cli: 78, radioQuote: 'Traffic ahead in Turn 4, request overtake mode!', performanceImpact: 'Thermal spike observed' },
      { lap: 17, state: 'REDLINE', cli: 91, radioQuote: 'He is moving under braking! Check the delta now!', performanceImpact: '+0.34s sector 2 loss' },
      { lap: 19, state: 'RECOVERING', cli: 64, radioQuote: 'Copy GP. Switching to Strat 3 override.', performanceImpact: 'Cooling envelope active' },
      { lap: 24, state: 'FOCUSED', cli: 45, radioQuote: 'Gap ahead is 2.4s. Mode 7 engaged.', performanceImpact: 'Target stint pace reset' },
    ],
    aiDriverInsights: [
      {
        numberStr: '01',
        title: 'PRESSURE RESPONSE',
        subtitle: 'Vocal Acceleration Under Attack',
        text: 'Driver maintains communication clarity during moderate stress but shows increased vocal intensity and pitch acceleration during sustained high-load periods.',
      },
      {
        numberStr: '02',
        title: 'RECOVERY BEHAVIOR',
        subtitle: 'Rapid Cognitive Reset',
        text: 'Driver typically returns toward baseline within approximately 18–20 seconds after a stress spike, enabling immediate lap time recovery.',
      },
      {
        numberStr: '03',
        title: 'PERFORMANCE CORRELATION',
        subtitle: 'Sector 2 Correlation',
        text: 'Elevated cognitive load coincided with performance degradation in Sector 2 during multiple observed windows.',
      },
    ],
    comparison: {
      driverA: {
        name: 'Max Verstappen',
        aggression: 'Very High (92)',
        recovery: 'Ultra Fast (18s)',
        communication: 'Direct & Intense',
        keyTrait: 'Thrives on high-stress attack phase',
      },
      driverB: {
        name: 'Lewis Hamilton',
        aggression: 'Moderate (76)',
        recovery: 'Controlled (21s)',
        communication: 'Calibrated & Smooth',
        keyTrait: 'Conserves cognitive energy for late stint',
      },
      conceptualUsp: 'THE REDLINE IS DIFFERENT FOR EVERY DRIVER.',
    },
    aiExplanation: {
      title: 'WHY DID COGNITIVE LOAD INCREASE?',
      evidence: [
        'Pitch variance increased (+42%)',
        'Vocal intensity increased (+3.8 dB)',
        'Speech cadence accelerated',
        'Urgency phrases detected ("moving under braking")',
        'Sector 2 performance delta +0.34s',
      ],
      confidence: 92,
    },
  },

  hamilton: {
    driverId: 'hamilton',
    driverName: 'Lewis Hamilton',
    driverNumber: 44,
    driverCode: 'HAM',
    signatureClassification: 'TACTICAL ADAPTIVE METHODIST',
    signatureDescription: 'Extremely high composure and pressure handling, gradual stress accumulation, and precise vocal calibration during tire management windows.',
    metrics: {
      aggression: 76,
      composure: 94,
      recoverySpeed: 88,
      communicationClarity: 90,
      pressureHandling: 95,
      consistency: 93,
    },
    cognitiveLoadIndex: {
      currentCli: 58,
      state: 'FOCUSED',
      trend: '↓ -5%',
      peakCli: 82,
      averageCli: 50,
      recoveryTimeSec: 21,
    },
    cognitiveEvolution: [
      { lap: 1, state: 'FOCUSED', cli: 34, radioQuote: 'Grip level is good. Managing rear thermal.', performanceImpact: 'Pace on target' },
      { lap: 6, state: 'ELEVATED', cli: 54, radioQuote: 'Bono, front left is beginning to grain.', performanceImpact: 'Brake bias adjusted' },
      { lap: 12, state: 'HIGH LOAD', cli: 75, radioQuote: 'Pace is dropping off! How many laps left on this set?', performanceImpact: '-0.18s tire degradation' },
      { lap: 16, state: 'REDLINE', cli: 82, radioQuote: 'I cannot keep the car behind with these tires!', performanceImpact: 'Defensive line engaged' },
      { lap: 18, state: 'RECOVERING', cli: 60, radioQuote: 'Copy. Box box. Pushing now in Sector 3.', performanceImpact: 'In-lap push window' },
      { lap: 22, state: 'FOCUSED', cli: 40, radioQuote: 'Fresh rubber feels solid. Gap to car ahead?', performanceImpact: 'Fastest lap sector 1' },
    ],
    aiDriverInsights: [
      {
        numberStr: '01',
        title: 'PRESSURE RESPONSE',
        subtitle: 'Controlled Vocal Modulation',
        text: 'Driver maintains high conversational clarity during peak stress, using measured feedback to coordinate pit strategy with race engineer.',
      },
      {
        numberStr: '02',
        title: 'RECOVERY BEHAVIOR',
        subtitle: 'Calculated Stint Pacing',
        text: 'Stress levels taper down gradually post-pit stop as driver establishes rhythm on fresh tires.',
      },
      {
        numberStr: '03',
        title: 'PERFORMANCE CORRELATION',
        subtitle: 'Tire Thermal Sensitivity',
        text: 'Stress spikes correlate directly with front-left thermal degradation windows rather than traffic pressure.',
      },
    ],
    comparison: {
      driverA: {
        name: 'Lewis Hamilton',
        aggression: 'Controlled (76)',
        recovery: 'Calculated (21s)',
        communication: 'Analytical & Clear',
        keyTrait: 'Methodical tire & energy management',
      },
      driverB: {
        name: 'Charles Leclerc',
        aggression: 'High (88)',
        recovery: 'Emotion-Driven (24s)',
        communication: 'High Dynamic Range',
        keyTrait: 'Explosive single-lap peak commitment',
      },
      conceptualUsp: 'THE REDLINE IS DIFFERENT FOR EVERY DRIVER.',
    },
    aiExplanation: {
      title: 'WHY DID COGNITIVE LOAD INCREASE?',
      evidence: [
        'Vocal pitch modulation shift (+28%)',
        'Keyword urgency detected ("grain", "drop off")',
        'RMS audio energy increased during Sector 3',
        'Lap time delta degraded +0.22s',
      ],
      confidence: 94,
    },
  },

  leclerc: {
    driverId: 'leclerc',
    driverName: 'Charles Leclerc',
    driverNumber: 16,
    driverCode: 'LEC',
    signatureClassification: 'HIGH-INTENSITY QUALIFYING PURSUER',
    signatureDescription: 'Peak vocal acceleration during turn-entry stress, rapid emotion-driven focus shifts, and exceptional one-lap pace execution under pressure.',
    metrics: {
      aggression: 88,
      composure: 72,
      recoverySpeed: 85,
      communicationClarity: 78,
      pressureHandling: 84,
      consistency: 82,
    },
    cognitiveLoadIndex: {
      currentCli: 81,
      state: 'HIGH LOAD',
      trend: '↑ +18%',
      peakCli: 94,
      averageCli: 62,
      recoveryTimeSec: 24,
    },
    cognitiveEvolution: [
      { lap: 1, state: 'FOCUSED', cli: 42, radioQuote: 'Radio check Bryan. Car balance feels okay.', performanceImpact: 'Nominal stint start' },
      { lap: 5, state: 'ELEVATED', cli: 65, radioQuote: 'Turn 4 snap on entry! Rear is sliding!', performanceImpact: '+0.15s apex delay' },
      { lap: 10, state: 'HIGH LOAD', cli: 81, radioQuote: 'We are losing too much time in Sector 2! What is the delta?', performanceImpact: 'Aggressive kerb usage' },
      { lap: 15, state: 'REDLINE', cli: 94, radioQuote: 'No power out of Turn 7! Check telemetry immediately!', performanceImpact: 'Power unit warning flag' },
      { lap: 18, state: 'RECOVERING', cli: 68, radioQuote: 'Copy. Default 0-3 mode set. Power is back.', performanceImpact: 'Pace stabilizing' },
      { lap: 22, state: 'FOCUSED', cli: 48, radioQuote: 'Pushing now. Gap to car ahead is 1.8s.', performanceImpact: 'Purple sector 1' },
    ],
    aiDriverInsights: [
      {
        numberStr: '01',
        title: 'PRESSURE RESPONSE',
        subtitle: 'High Vocal Pitch Spikes',
        text: 'Vocal pitch accelerates rapidly when car balance degrades unexpectedly, signaling immediate driver feedback needs.',
      },
      {
        numberStr: '02',
        title: 'RECOVERY BEHAVIOR',
        subtitle: 'Fast Turn-around Post Directive',
        text: 'Driver returns to focused state rapidly once clear technical instructions (e.g. Default modes) are provided by pit wall.',
      },
      {
        numberStr: '03',
        title: 'PERFORMANCE CORRELATION',
        subtitle: 'Apex Speed Impact',
        text: 'Peak stress windows align with high-speed apex snaps in Sector 2.',
      },
    ],
    comparison: {
      driverA: {
        name: 'Charles Leclerc',
        aggression: 'High (88)',
        recovery: 'Fast (24s)',
        communication: 'Expressive & Immediate',
        keyTrait: 'Maximum commitment in high-speed turns',
      },
      driverB: {
        name: 'Carlos Sainz',
        aggression: 'Moderate (75)',
        recovery: 'Steady (22s)',
        communication: 'Tactical & Structured',
        keyTrait: 'Continuous strategy evaluation',
      },
      conceptualUsp: 'THE REDLINE IS DIFFERENT FOR EVERY DRIVER.',
    },
    aiExplanation: {
      title: 'WHY DID COGNITIVE LOAD INCREASE?',
      evidence: [
        'Fundamental frequency pitch spike (+54 Hz)',
        'Keyword urgency detected ("snap on entry", "losing time")',
        'RMS energy burst during turn 7 acceleration',
        'Telemetry confirmed snap oversteer event',
      ],
      confidence: 91,
    },
  },
};

/**
 * Normalizes backend response supporting both camelCase and snake_case properties.
 */
export function normalizeRaceDnaResponse(data: any, driverId: string): RaceDnaProfile {
  const driverObj = DRIVERS.find(d => d.id === driverId) || DRIVERS[0];
  const fallback = CANONICAL_RACEDNA_PROFILES[driverId] || CANONICAL_RACEDNA_PROFILES.verstappen;

  if (!data) return fallback;

  // Extract raw metrics with snake_case and camelCase fallbacks
  const rawMetrics = data.metrics || {};
  const metrics = {
    aggression: rawMetrics.aggression ?? fallback.metrics.aggression,
    composure: rawMetrics.composure ?? fallback.metrics.composure,
    recoverySpeed: rawMetrics.recovery_speed ?? rawMetrics.recoverySpeed ?? fallback.metrics.recoverySpeed,
    communicationClarity: rawMetrics.communication_clarity ?? rawMetrics.communicationClarity ?? fallback.metrics.communicationClarity,
    pressureHandling: rawMetrics.pressure_handling ?? rawMetrics.pressureHandling ?? fallback.metrics.pressureHandling,
    consistency: rawMetrics.consistency ?? fallback.metrics.consistency,
  };

  // Extract CLI
  const rawCli = data.cognitive_load_index || data.cognitiveLoadIndex || {};
  const cognitiveLoadIndex = {
    currentCli: rawCli.current_cli ?? rawCli.currentCli ?? fallback.cognitiveLoadIndex.currentCli,
    state: rawCli.state || fallback.cognitiveLoadIndex.state,
    trend: rawCli.trend || fallback.cognitiveLoadIndex.trend,
    peakCli: rawCli.peak_cli ?? rawCli.peakCli ?? fallback.cognitiveLoadIndex.peakCli,
    averageCli: rawCli.average_cli ?? rawCli.averageCli ?? fallback.cognitiveLoadIndex.averageCli,
    recoveryTimeSec: rawCli.recovery_time_sec ?? rawCli.recoveryTimeSec ?? fallback.cognitiveLoadIndex.recoveryTimeSec,
  };

  // Extract Evolution Timeline
  const rawEv = data.cognitive_evolution || data.cognitiveEvolution || [];
  const cognitiveEvolution = Array.isArray(rawEv) && rawEv.length > 0
    ? rawEv.map((ev: any) => ({
        lap: ev.lap ?? 1,
        state: ev.state || 'FOCUSED',
        cli: ev.cli ?? 50,
        radioQuote: ev.radio_quote || ev.radioQuote || 'Radio communication active.',
        performanceImpact: ev.performance_impact || ev.performanceImpact || 'Pace nominal',
      }))
    : fallback.cognitiveEvolution;

  // Extract Driver Insights
  const rawIns = data.ai_driver_insights || data.aiDriverInsights || [];
  const aiDriverInsights = Array.isArray(rawIns) && rawIns.length > 0
    ? rawIns.map((ins: any, idx: number) => ({
        numberStr: `0${idx + 1}`,
        title: ins.title || 'DRIVER INSIGHT',
        subtitle: ins.subtitle || 'Cognitive Analysis',
        text: ins.text || ins.insight || 'Analysis complete.',
      }))
    : fallback.aiDriverInsights;

  // Extract AI Explanation
  const rawExp = data.ai_explanation || data.aiExplanation || {};
  const aiExplanation = {
    title: rawExp.title || fallback.aiExplanation.title,
    evidence: Array.isArray(rawExp.evidence) ? rawExp.evidence : fallback.aiExplanation.evidence,
    confidence: rawExp.confidence ?? fallback.aiExplanation.confidence,
  };

  return {
    driverId: driverObj.id,
    driverName: data.driver_name || data.driverName || driverObj.name,
    driverNumber: data.driver_number || data.driverNumber || driverObj.number,
    driverCode: data.driver_code || data.driverCode || driverObj.code,
    signatureClassification: data.signature_classification || data.signatureClassification || fallback.signatureClassification,
    signatureDescription: data.signature_description || data.signatureDescription || fallback.signatureDescription,
    metrics,
    cognitiveLoadIndex,
    cognitiveEvolution,
    aiDriverInsights,
    comparison: data.comparison || fallback.comparison,
    aiExplanation,
  };
}

/**
 * Fetches live RaceDNA profile from backend /api/v1/race-dna with robust fallback.
 */
export async function fetchRaceDnaProfile(driverId: string, audioFile?: File): Promise<RaceDnaProfile> {
  const fallback = CANONICAL_RACEDNA_PROFILES[driverId] || CANONICAL_RACEDNA_PROFILES.verstappen;

  try {
    const apiBase = typeof window !== 'undefined' ? window.location.origin : '';
    
    let res: Response;
    if (audioFile) {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('driver_id', driverId);
      res = await fetch(`${apiBase}/api/v1/race-dna`, {
        method: 'POST',
        body: formData,
      });
    } else {
      res = await fetch(`${apiBase}/api/v1/race-dna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driverId }),
      });
    }

    if (res.ok) {
      const data = await res.json();
      return normalizeRaceDnaResponse(data, driverId);
    }
  } catch (err) {
    console.warn('Backend /api/v1/race-dna API note, using canonical RaceDNA profile:', err);
  }

  return fallback;
}
