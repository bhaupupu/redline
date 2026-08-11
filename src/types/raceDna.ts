export interface RaceDnaMetrics {
  aggression: number;
  composure: number;
  recoverySpeed: number;
  communicationClarity: number;
  pressureHandling: number;
  consistency: number;
}

export interface CognitiveEvolutionEvent {
  lap: number;
  state: 'FOCUSED' | 'ELEVATED' | 'HIGH LOAD' | 'REDLINE' | 'RECOVERING';
  cli: number;
  radioQuote: string;
  performanceImpact?: string;
}

export interface CognitiveLoadIndex {
  currentCli: number;
  state: 'FOCUSED' | 'ELEVATED' | 'HIGH LOAD' | 'REDLINE' | 'RECOVERING';
  trend: string;
  peakCli: number;
  averageCli: number;
  recoveryTimeSec: number;
}

export interface DriverBehaviorInsight {
  numberStr: string;
  title: string;
  subtitle: string;
  text: string;
}

export interface DriverComparisonTrait {
  name: string;
  aggression: string;
  recovery: string;
  communication: string;
  keyTrait: string;
}

export interface DriverComparison {
  driverA: DriverComparisonTrait;
  driverB: DriverComparisonTrait;
  conceptualUsp: string;
}

export interface AiExplanation {
  title: string;
  evidence: string[];
  confidence: number;
}

export interface RaceDnaProfile {
  driverId: string;
  driverName: string;
  driverNumber: number;
  driverCode: string;
  signatureClassification: string;
  signatureDescription: string;
  metrics: RaceDnaMetrics;
  cognitiveEvolution: CognitiveEvolutionEvent[];
  cognitiveLoadIndex: CognitiveLoadIndex;
  aiDriverInsights: DriverBehaviorInsight[];
  comparison: DriverComparison;
  aiExplanation: AiExplanation;
}
