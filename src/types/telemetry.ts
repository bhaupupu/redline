export interface Driver {
  id: string;
  name: string;
  number: number;
  team: string;
  code: string;
  avatar: string;
  color: string;
}

export interface AcousticFeatures {
  rmsEnergy: number; // dB
  pitch: number; // Hz
  pitchVariance: number; // Hz^2
  speakingRate: number; // Syllables / sec
  zeroCrossingRate: number; // ZCR
  spectralCentroid: number; // Hz
  emotion: 'Calm' | 'Focused' | 'Agitated' | 'Panicked' | 'Excited';
}

export interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime: number; // seconds
  speaker: string;
  text: string;
  phraseStressScore: number; // 0 - 100
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keywordsDetected: string[];
}

export interface TelemetryDataPoint {
  timeOffset: number; // seconds
  timestampStr: string; // e.g. "00:04"
  stressScore: number; // 0 - 100
  smoothedStress: number; // 0 - 100
  lapTime: number; // seconds e.g. 81.42
  sector1: number; // seconds
  sector2: number; // seconds
  sector3: number; // seconds
  pitch: number; // Hz
  rmsEnergy: number; // 0-1 normalized
  speechRate: number; // syllables / sec
}

export interface AnalysisResult {
  driver: Driver;
  audioFileName: string;
  duration: number; // seconds
  overallStressScore: number; // 0 - 100
  maxStressScore: number; // 0 - 100
  moodLabel: 'Nominal / Calm' | 'Focused' | 'Elevated' | 'Frustrated' | 'Critical Redline';
  confidence: number; // percentage e.g. 94.2%
  acousticFeatures: AcousticFeatures;
  textSummary: string;
  aiRaceEngineerInsight: string;
  timelineData: TelemetryDataPoint[];
  transcriptSegments: TranscriptSegment[];
}
