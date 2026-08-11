from typing import List, Dict, Any, Optional


def generate_spike_explanation(
    emotion: str,
    stress_score: int,
    pitch: float,
    rms: float,
    speaking_rate: float,
    transcript_text: str = "",
    keywords: Optional[List[str]] = None
) -> str:
    """
    Generates a clear, natural-language explanation combining acoustic features and transcript context for stress/tired spikes.
    Example style:
    "Stress spike (score 78/100) driven by sharp pitch increase (245Hz, +45Hz above baseline) and elevated vocal energy (RMS 0.72) following radio phrase: 'tyres are gone'."
    """
    kw_str = f" after key phrase: '{keywords[0]}'" if (keywords and len(keywords) > 0) else ""
    snippet = f" while stating '{transcript_text.strip()}'" if transcript_text.strip() else ""

    if emotion == "Stressed" or stress_score >= 60:
        pitch_desc = f"sharp pitch elevation ({int(pitch)}Hz)" if pitch > 190 else f"vocal pitch shift ({int(pitch)}Hz)"
        rms_desc = f"high vocal RMS energy ({rms:.2f})" if rms > 0.18 else f"elevated energy level ({rms:.2f})"

        explanation = (
            f"Stress spike (Score {stress_score}/100) driven by {pitch_desc} and {rms_desc}{kw_str or snippet}. "
            f"Acoustic telemetry reflects immediate cognitive urgency and racing strain."
        )
    elif emotion == "Tired":
        rate_desc = f"slowed speaking rate ({speaking_rate:.1f} syll/sec)" if speaking_rate < 3.8 else f"monotone pitch curve ({int(pitch)}Hz)"
        rms_desc = f"suppressed vocal power (RMS {rms:.2f})"

        explanation = (
            f"Fatigue window (Score {stress_score}/100) triggered by {rate_desc} and {rms_desc}{kw_str or snippet}. "
            f"Indicates physical exhaustion or delayed mental focus during stint."
        )
    else:
        explanation = (
            f"Nominal vocal window (Score {stress_score}/100) characterized by stable fundamental pitch ({int(pitch)}Hz) "
            f"and controlled RMS energy ({rms:.2f})."
        )

    return explanation


def enrich_critical_windows_with_explainability(
    critical_windows: List[Dict[str, Any]],
    emotion_timeline: List[Dict[str, Any]],
    transcript_segments: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Enriches critical window dictionaries with detailed AI Explainability text and dominant acoustic triggers.
    """
    enriched = []
    for cw in critical_windows:
        start_t = cw.get("start_time", 0.0)
        end_t = cw.get("end_time", 6.0)
        emotion = cw.get("emotion", "Stressed")
        stress_score = cw.get("stress_score", 65)

        # Match corresponding timeline segment & transcript segment
        matched_timeline = next(
            (t for t in emotion_timeline if abs(t.get("start_time", 0) - start_t) < 2.0),
            {}
        )
        matched_transcript = next(
            (s for s in transcript_segments if abs(s.get("start_time", 0) - start_t) < 3.0),
            {}
        )

        pitch = matched_timeline.get("pitch", 215.0 if emotion == "Stressed" else 155.0)
        rms = matched_timeline.get("rms", 0.28 if emotion == "Stressed" else 0.09)
        speaking_rate = matched_timeline.get("speaking_rate", 5.2 if emotion == "Stressed" else 3.1)

        text = matched_transcript.get("text", "")
        keywords = matched_transcript.get("keywords_detected", [])

        explanation = generate_spike_explanation(
            emotion=emotion,
            stress_score=stress_score,
            pitch=pitch,
            rms=rms,
            speaking_rate=speaking_rate,
            transcript_text=text,
            keywords=keywords
        )

        trigger = f"Pitch Acceleration (+{int(pitch-160)}Hz)" if pitch > 180 else f"RMS Energy Surge ({rms:.2f})"

        cw_copy = dict(cw)
        cw_copy["explanation"] = explanation
        cw_copy["acoustic_trigger"] = trigger
        cw_copy["acousticTrigger"] = trigger
        enriched.append(cw_copy)

    return enriched
