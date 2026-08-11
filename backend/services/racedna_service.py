import numpy as np
from typing import List, Dict, Any
from backend.schemas import RaceDNAProfile, StressTrigger


def generate_race_dna_profile(
    driver_id: str,
    driver_name: str,
    emotion_timeline: List[Dict[str, Any]],
    transcript_segments: List[Dict[str, Any]],
    acoustic_features: Dict[str, Any]
) -> RaceDNAProfile:
    """
    RaceDNA™ Cognitive Signature Engine.
    Analyzes driver telemetry patterns across stint to output:
    - Dominant emotional state
    - Cognitive Consistency Score & Adaptability Score
    - Recovery Behavior & Latency
    - Stress Triggers (Keywords, Technical sector events, Tire wear)
    - Driver Signature Trait & Custom Pit Wall Advice
    """
    if not emotion_timeline:
        return RaceDNAProfile(
            driver_id=driver_id or "hamilton",
            driver_name=driver_name or "Lewis Hamilton",
            dominant_state="Calm",
            cognitive_consistency=92.0,
            adaptability_score=88.0,
            recovery_behavior="Fast Recovery",
            recovery_latency_seconds=3.2,
            stress_triggers=[
                StressTrigger(
                    category="Tire Wear",
                    keyword_or_event="front left degradation",
                    frequency=1,
                    avg_stress_impact=55.0
                )
            ],
            signature_trait="Precision Flow Specialist",
            strategic_advice="Maintain current radio protocol; driver exhibits high baseline cognitive resilience."
        )

    # 1. Dominant Emotional State Determination
    stressed_count = sum(1 for t in emotion_timeline if t.get("emotion") == "Stressed")
    tired_count = sum(1 for t in emotion_timeline if t.get("emotion") == "Tired")
    calm_count = sum(1 for t in emotion_timeline if t.get("emotion") == "Calm")

    if stressed_count >= calm_count and stressed_count >= tired_count:
        dominant_state = "Stressed"
    elif tired_count >= calm_count and tired_count >= stressed_count:
        dominant_state = "Tired"
    else:
        dominant_state = "Calm"

    # 2. Cognitive Consistency & Adaptability
    stress_scores = [t.get("stress_score", 40) for t in emotion_timeline]
    std_dev = float(np.std(stress_scores)) if len(stress_scores) > 1 else 10.0
    cognitive_consistency = float(round(np.clip(100.0 - std_dev * 2.5, 30.0, 99.0), 1))

    confidences = [t.get("confidence", 90.0) for t in emotion_timeline]
    avg_confidence = float(np.mean(confidences))
    adaptability_score = float(round(np.clip((cognitive_consistency * 0.6) + (avg_confidence * 0.4), 40.0, 98.5), 1))

    # 3. Recovery Behavior & Recovery Latency Engine
    # Measure duration between a stress peak (>65) and return to baseline (<50)
    recovery_latencies = []
    in_stress = False
    stress_start_time = 0.0

    for t in emotion_timeline:
        score = t.get("stress_score", 40)
        start_t = t.get("start_time", 0.0)
        if score >= 65 and not in_stress:
            in_stress = True
            stress_start_time = start_t
        elif score < 50 and in_stress:
            in_stress = False
            recovery_latencies.append(start_t - stress_start_time)

    if recovery_latencies:
        avg_recovery_latency = float(round(np.mean(recovery_latencies), 1))
    else:
        avg_recovery_latency = 4.5 if dominant_state == "Stressed" else 2.8

    if avg_recovery_latency <= 3.5:
        recovery_behavior = "Fast Recovery"
    elif avg_recovery_latency <= 7.0:
        recovery_behavior = "Moderate Recovery"
    elif avg_recovery_latency <= 12.0:
        recovery_behavior = "Delayed Recovery"
    else:
        recovery_behavior = "High Vulnerability"

    # 4. Stress Triggers Extraction
    triggers: List[StressTrigger] = []
    keywords_seen: Dict[str, Dict[str, Any]] = {}

    for seg in transcript_segments:
        text = seg.get("text", "").lower()
        score = seg.get("phrase_stress_score", 45)
        keywords = seg.get("keywords_detected", [])

        for kw in keywords:
            if kw not in keywords_seen:
                keywords_seen[kw] = {"count": 0, "sum_score": 0}
            keywords_seen[kw]["count"] += 1
            keywords_seen[kw]["sum_score"] += score

    category_mapping = {
        "tire": "Tire Degradation",
        "delta": "Sector Delta Loss",
        "turn": "Apex Cornering",
        "engine": "Engine & Hybrid Override",
        "vibration": "Chassis Instability",
        "box": "Pit Window Pressure",
        "mode": "Power Unit Settings"
    }

    for kw, data in keywords_seen.items():
        cat = "Telemetry Warning"
        for key, value in category_mapping.items():
            if key in kw:
                cat = value
                break
        avg_impact = round(data["sum_score"] / data["count"], 1)
        triggers.append(StressTrigger(
            category=cat,
            keyword_or_event=kw,
            frequency=data["count"],
            avg_stress_impact=avg_impact
        ))

    if not triggers:
        triggers.append(StressTrigger(
            category="Tire Wear",
            keyword_or_event="Sector 2 thermal degradation",
            frequency=1,
            avg_stress_impact=62.0
        ))

    # Sort triggers by impact
    triggers.sort(key=lambda x: x.avgStressImpact, reverse=True)

    # 5. Signature Trait & Strategic Advice Determination
    if dominant_state == "Calm" and cognitive_consistency >= 85:
        signature_trait = "High-Pressure Ice-Man Specialist"
        strategic_advice = f"{driver_name} exhibits elite vocal poise under stint stress. Greenlight for long stint expansion and high-risk overtake calls."
    elif dominant_state == "Stressed" and recovery_behavior == "Fast Recovery":
        signature_trait = "Reactive Aggressive Competitor"
        strategic_advice = f"{driver_name} experiences short vocal stress spikes during battle, but recovers within {avg_recovery_latency}s. Maintain proactive pit wall updates."
    elif dominant_state == "Tired":
        signature_trait = "Fatigue-Sensitive Braking Profile"
        strategic_advice = f"{driver_name} showing signs of cognitive exhaustion. Simplify radio prompts to essential delta targets to prevent lap time drop-off."
    else:
        signature_trait = "Technical Precision Strategist"
        strategic_advice = f"Monitor Sector 2 pitch shifts. Driver responds best to clear, calm delta instructions from Chief Engineer."

    return RaceDNAProfile(
        driver_id=driver_id or "hamilton",
        driver_name=driver_name or "Lewis Hamilton",
        dominant_state=dominant_state,
        cognitive_consistency=cognitive_consistency,
        adaptability_score=adaptability_score,
        recovery_behavior=recovery_behavior,
        recovery_latency_seconds=avg_recovery_latency,
        stress_triggers=triggers[:4],
        signature_trait=signature_trait,
        strategic_advice=strategic_advice
    )
