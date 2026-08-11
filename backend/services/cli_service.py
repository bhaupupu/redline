import numpy as np
from typing import List, Dict, Any
from backend.schemas import CognitiveLoadIndex, CognitiveLoadComponent


def calculate_cognitive_load_index(
    emotion_timeline: List[Dict[str, Any]],
    acoustic_features: Dict[str, Any]
) -> CognitiveLoadIndex:
    """
    Proprietary Cognitive Load Index (CLI) Engine (0–100).
    Calculates driver mental workload by fusing:
    1. Emotion Intensity (Average & Peak Stress)
    2. Stress & Fatigue Duration Ratio
    3. Pitch Instability & Vocal Variance
    4. Energy Surges & Vocal Dynamics (RMS, Speaking Rate, ZCR)
    """
    if not emotion_timeline:
        # Default baseline if no timeline provided
        return CognitiveLoadIndex(
            score=35.0,
            severity="Moderate",
            trend="Stable",
            components=[
                CognitiveLoadComponent(
                    name="Emotion Intensity",
                    weight=0.35,
                    score=35.0,
                    description="Nominal emotional baseline."
                )
            ],
            interpretation="Cognitive load is within normal operating threshold. Driver displays steady vocal telemetry."
        )

    # 1. Emotion Intensity Score (Weight: 35%)
    stress_scores = [t.get("stress_score", 40) for t in emotion_timeline]
    avg_stress = float(np.mean(stress_scores))
    max_stress = float(np.max(stress_scores))
    intensity_score = float(np.clip(0.6 * avg_stress + 0.4 * max_stress, 0.0, 100.0))

    # 2. Stress & Fatigue Duration Ratio (Weight: 25%)
    high_stress_count = sum(1 for t in emotion_timeline if t.get("stress_score", 0) >= 60 or t.get("emotion") in ["Stressed", "Tired"])
    duration_ratio = high_stress_count / float(len(emotion_timeline))
    duration_score = float(np.clip(duration_ratio * 100.0, 0.0, 100.0))

    # 3. Pitch Instability (Weight: 20%)
    pitches = [t.get("pitch", 180) for t in emotion_timeline]
    pitch_var = float(np.var(pitches)) if len(pitches) > 1 else float(acoustic_features.get("pitchVariance", 50))
    # Standard human vocal pitch variance in racing radio is ~30-200 Hz^2
    pitch_instability_score = float(np.clip((pitch_var / 180.0) * 100.0, 0.0, 100.0))

    # 4. Energy Surges & Vocal Strain (Weight: 20%)
    rms_val = float(acoustic_features.get("rmsEnergy", 0.15))
    speaking_rate = float(acoustic_features.get("speakingRate", 4.5))
    # Normalized energy and rapid speech penalty
    energy_score = float(np.clip((rms_val / 0.35) * 50.0 + (speaking_rate / 8.0) * 50.0, 0.0, 100.0))

    # Weighted CLI Calculation
    weighted_score = (
        intensity_score * 0.35 +
        duration_score * 0.25 +
        pitch_instability_score * 0.20 +
        energy_score * 0.20
    )
    final_cli = float(round(np.clip(weighted_score, 0.0, 100.0), 1))

    # Determine Severity
    if final_cli >= 80.0:
        severity = "Critical"
    elif final_cli >= 60.0:
        severity = "High"
    elif final_cli >= 30.0:
        severity = "Moderate"
    else:
        severity = "Low"

    # Determine Trend across timeline
    if len(stress_scores) >= 2:
        first_half = np.mean(stress_scores[:len(stress_scores)//2])
        second_half = np.mean(stress_scores[len(stress_scores)//2:])
        diff = second_half - first_half
        if diff > 15:
            trend = "Spiking" if diff > 30 else "Increasing"
        elif diff < -15:
            trend = "Decreasing"
        else:
            trend = "Stable"
    else:
        trend = "Stable"

    # Structured Component Explanations
    components = [
        CognitiveLoadComponent(
            name="Emotion Intensity",
            weight=0.35,
            score=round(intensity_score, 1),
            description=f"Weighted blend of average ({avg_stress:.1f}) and peak stress ({max_stress:.1f})."
        ),
        CognitiveLoadComponent(
            name="Stress Window Duration",
            weight=0.25,
            score=round(duration_score, 1),
            description=f"{high_stress_count} of {len(emotion_timeline)} stint segments operated under elevated cognitive strain."
        ),
        CognitiveLoadComponent(
            name="Pitch Instability",
            weight=0.20,
            score=round(pitch_instability_score, 1),
            description=f"Pitch variance measured at {pitch_var:.1f} Hz² across radio transmissions."
        ),
        CognitiveLoadComponent(
            name="Vocal Strain & Energy",
            weight=0.20,
            score=round(energy_score, 1),
            description=f"RMS energy ({rms_val:.2f}) and speech velocity ({speaking_rate:.1f} syll/sec)."
        ),
    ]

    if severity == "Critical":
        interpretation = (
            f"CRITICAL MENTAL LOAD ({final_cli}/100): Driver is operating near cognitive redline. High risk of "
            f"braking misjudgments and delayed reaction times. Immediate workload reduction required."
        )
    elif severity == "High":
        interpretation = (
            f"HIGH MENTAL LOAD ({final_cli}/100): Elevated cognitive pressure detected. Driver showing vocal strain "
            f"and pitch variance during technical stint sectors."
        )
    elif severity == "Moderate":
        interpretation = (
            f"MODERATE MENTAL LOAD ({final_cli}/100): Controlled racing focus. Vocal metrics indicate manageable driver "
            f"effort with temporary stress peaks."
        )
    else:
        interpretation = (
            f"OPTIMAL / LOW MENTAL LOAD ({final_cli}/100): Driver is in peak flow state. High acoustic stability "
            f"and low vocal energy variance."
        )

    return CognitiveLoadIndex(
        score=final_cli,
        severity=severity,
        trend=trend,
        components=components,
        interpretation=interpretation
    )
