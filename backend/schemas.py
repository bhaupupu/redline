from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class DriverInfo(BaseModel):
    id: str = "hamilton"
    name: str = "Lewis Hamilton"
    number: int = 44
    team: str = "Mercedes-AMG Petronas F1"
    code: str = "HAM"
    avatar: str = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=200&q=80"
    color: str = "#00D2BE"


class AcousticFeatures(BaseModel):
    rmsEnergy: float = Field(..., description="Root Mean Square energy in dB or normalized float")
    pitch: int = Field(..., description="Vocal pitch / F0 in Hz")
    pitchVariance: int = Field(..., description="Pitch variance in Hz^2")
    speakingRate: float = Field(..., description="Syllables per second")
    zeroCrossingRate: float = Field(..., description="Zero crossing rate ratio")
    spectralCentroid: int = Field(..., description="Spectral centroid in Hz")
    emotion: Literal["Calm", "Stressed", "Tired"] = Field(..., description="Dominant acoustic emotion category")


class SegmentEmotion(BaseModel):
    id: str
    startTime: float = Field(..., alias="start_time")
    endTime: float = Field(..., alias="end_time")
    emotion: Literal["Calm", "Stressed", "Tired"]
    stressScore: int = Field(..., alias="stress_score", ge=0, le=100)
    confidence: float = Field(..., ge=0.0, le=100.0)

    class Config:
        populate_by_name = True


class TranscriptSegment(BaseModel):
    id: str
    startTime: float = Field(..., alias="start_time")
    endTime: float = Field(..., alias="end_time")
    speaker: str
    text: str
    phraseStressScore: int = Field(..., alias="phrase_stress_score", ge=0, le=100)
    urgencyLevel: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = Field(..., alias="urgency_level")
    keywordsDetected: List[str] = Field(default_factory=list, alias="keywords_detected")

    class Config:
        populate_by_name = True


class TelemetryDataPoint(BaseModel):
    timeOffset: float = Field(..., alias="time_offset")
    timestampStr: str = Field(..., alias="timestamp_str")
    stressScore: int = Field(..., alias="stress_score")
    smoothedStress: int = Field(..., alias="smoothed_stress")
    lapTime: float = Field(..., alias="lap_time")
    sector1: float
    sector2: float
    sector3: float
    pitch: int
    rmsEnergy: float = Field(..., alias="rms_energy")
    speechRate: float = Field(..., alias="speech_rate")

    class Config:
        populate_by_name = True


class CriticalWindow(BaseModel):
    id: str
    startTime: float = Field(..., alias="start_time")
    endTime: float = Field(..., alias="end_time")
    lapNumber: Optional[int] = Field(None, alias="lap_number")
    emotion: Literal["Calm", "Stressed", "Tired"]
    stressScore: int = Field(..., alias="stress_score")
    lapTimeImpact: float = Field(..., alias="lap_time_impact", description="Delta in lap time in seconds e.g. +0.45s")
    description: str
    explanation: Optional[str] = Field(None, description="Acoustic + transcript context explanation for AI Explainability")
    acousticTrigger: Optional[str] = Field(None, alias="acoustic_trigger", description="Dominant acoustic feature trigger")

    class Config:
        populate_by_name = True


class LapTimeInput(BaseModel):
    lap_number: int
    lap_time: float
    sector1: Optional[float] = None
    sector2: Optional[float] = None
    sector3: Optional[float] = None
    time_offset: Optional[float] = 0.0


# --- Differentiated Feature Schemas ---

class CognitiveLoadComponent(BaseModel):
    name: str
    weight: float
    score: float
    description: str


class CognitiveLoadIndex(BaseModel):
    score: float = Field(..., ge=0.0, le=100.0, description="Overall Cognitive Load Index (0-100)")
    severity: Literal["Low", "Moderate", "High", "Critical"] = Field(..., description="Load severity level")
    trend: Literal["Decreasing", "Stable", "Increasing", "Spiking"] = Field(default="Stable")
    components: List[CognitiveLoadComponent] = Field(default_factory=list)
    interpretation: str = Field(..., description="High-level cognitive load summary")

    class Config:
        populate_by_name = True


class StressTrigger(BaseModel):
    category: str = Field(..., description="Category e.g. Sector Degradation, Traffic, Tire Wear")
    keywordOrEvent: str = Field(..., alias="keyword_or_event")
    frequency: int = Field(default=1)
    avgStressImpact: float = Field(..., alias="avg_stress_impact")

    class Config:
        populate_by_name = True


class RaceDNAProfile(BaseModel):
    driverId: str = Field(..., alias="driver_id")
    driverName: str = Field(..., alias="driver_name")
    dominantState: Literal["Calm", "Stressed", "Tired"] = Field(..., alias="dominant_state")
    cognitiveConsistency: float = Field(..., alias="cognitive_consistency", ge=0.0, le=100.0)
    adaptabilityScore: float = Field(..., alias="adaptability_score", ge=0.0, le=100.0)
    recoveryBehavior: Literal["Fast Recovery", "Moderate Recovery", "Delayed Recovery", "High Vulnerability"] = Field(..., alias="recovery_behavior")
    recoveryLatencySeconds: float = Field(..., alias="recovery_latency_seconds")
    stressTriggers: List[StressTrigger] = Field(default_factory=list, alias="stress_triggers")
    signatureTrait: str = Field(..., alias="signature_trait")
    strategicAdvice: str = Field(..., alias="strategic_advice")

    class Config:
        populate_by_name = True


class EnhancedRaceEngineerInsight(BaseModel):
    id: str
    title: str
    category: Literal["Tire & Delta Management", "Radio Protocol", "Sector Strategy", "Pacing & Focus", "Pit Strategy"]
    recommendation: str
    rootCause: str = Field(..., alias="root_cause")
    expectedPerformanceImpact: str = Field(..., alias="expected_performance_impact")
    confidenceScore: float = Field(..., alias="confidence_score", ge=0.0, le=100.0)
    urgency: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    class Config:
        populate_by_name = True


class SessionSummary(BaseModel):
    sessionId: str = Field(..., alias="session_id")
    timestamp: str
    totalDurationSeconds: float = Field(..., alias="total_duration_seconds")
    overallCognitiveLoad: CognitiveLoadIndex = Field(..., alias="overall_cognitive_load")
    raceDnaSnapshot: RaceDNAProfile = Field(..., alias="race_dna_snapshot")
    totalCriticalWindows: int = Field(..., alias="total_critical_windows")
    criticalWindowsSummary: List[str] = Field(default_factory=list, alias="critical_windows_summary")
    engineerRecommendations: List[EnhancedRaceEngineerInsight] = Field(default_factory=list, alias="engineer_recommendations")
    stintVerdict: str = Field(..., alias="stint_verdict")

    class Config:
        populate_by_name = True


class AnalysisResponse(BaseModel):
    driver: DriverInfo
    audioFileName: str = Field(..., alias="audio_file_name")
    duration: float
    overallStressScore: int = Field(..., alias="overall_stress_score")
    maxStressScore: int = Field(..., alias="max_stress_score")
    moodLabel: Literal["Calm", "Stressed", "Tired", "Nominal / Calm", "Focused", "Elevated", "Frustrated", "Critical Redline"] = Field(..., alias="mood_label")
    confidence: float
    acousticFeatures: AcousticFeatures = Field(..., alias="acoustic_features")
    textSummary: str = Field(..., alias="text_summary")
    aiRaceEngineerInsight: List[str] = Field(..., alias="race_engineer_insights")
    timelineData: List[TelemetryDataPoint] = Field(..., alias="timeline_data")
    transcriptSegments: List[TranscriptSegment] = Field(..., alias="transcript_segments")
    emotionTimeline: List[SegmentEmotion] = Field(..., alias="emotion_timeline")
    criticalWindows: List[CriticalWindow] = Field(..., alias="critical_windows")

    # Enriched backend fields
    cognitiveLoadIndex: Optional[CognitiveLoadIndex] = Field(None, alias="cognitive_load_index")
    raceDNA: Optional[RaceDNAProfile] = Field(None, alias="race_dna")
    enhancedRaceEngineerInsights: Optional[List[EnhancedRaceEngineerInsight]] = Field(None, alias="enhanced_race_engineer_insights")
    sessionSummary: Optional[SessionSummary] = Field(None, alias="session_summary")

    class Config:
        populate_by_name = True
