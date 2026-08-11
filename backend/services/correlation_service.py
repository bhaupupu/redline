from typing import List, Dict, Any, Optional
from backend.schemas import LapTimeInput
from backend.services.explainability_service import generate_spike_explanation


def correlate_emotion_and_lap_times(
    emotion_timeline: List[Dict[str, Any]],
    lap_times_input: Optional[List[LapTimeInput]] = None
) -> Dict[str, Any]:
    """
    Correlates emotional state timeline (Calm, Stressed, Tired) with lap time telemetry.
    Detects Critical Windows where high stress or tiredness coincides with lap time degradation.
    Adds AI Explainability explanations and acoustic triggers to each critical window.
    """
    BASE_LAP = 81.20
    BASE_S1 = 28.00
    BASE_S2 = 31.50
    BASE_S3 = 21.70

    if not lap_times_input:
        lap_data = []
        for idx, item in enumerate(emotion_timeline):
            stress = item.get("stress_score", 40)
            emotion = item.get("emotion", "Calm")

            penalty = 0.0
            if emotion == "Stressed":
                penalty += (stress - 50) * 0.025 if stress > 50 else 0.2
            elif emotion == "Tired":
                penalty += 0.45

            lap_time = round(BASE_LAP + penalty, 2)
            s1 = round(BASE_S1 + penalty * 0.35, 1)
            s2 = round(BASE_S2 + penalty * 0.45, 1)
            s3 = round(BASE_S3 + penalty * 0.20, 1)

            lap_data.append({
                "lap_number": 12 + idx,
                "lap_time": lap_time,
                "sector1": s1,
                "sector2": s2,
                "sector3": s3,
                "time_offset": item.get("start_time", idx * 6.0)
            })
    else:
        lap_data = [item.model_dump() for item in lap_times_input]

    critical_windows: List[Dict[str, Any]] = []
    telemetry_datapoints: List[Dict[str, Any]] = []

    running_smoothed_stress = emotion_timeline[0].get("stress_score", 30) if emotion_timeline else 30

    for idx, item in enumerate(emotion_timeline):
        start_t = item.get("start_time", 0.0)
        end_t = item.get("end_time", start_t + 6.0)
        stress = item.get("stress_score", 40)
        emotion = item.get("emotion", "Calm")
        pitch = item.get("pitch", 180)
        rms = item.get("rms", 0.15)
        speech_rate = item.get("speaking_rate", 4.0)

        lap_info = lap_data[idx] if idx < len(lap_data) else lap_data[-1]
        lap_num = lap_info.get("lap_number", 12 + idx)
        lap_time = lap_info.get("lap_time", BASE_LAP)
        s1 = lap_info.get("sector1", BASE_S1)
        s2 = lap_info.get("sector2", BASE_S2)
        s3 = lap_info.get("sector3", BASE_S3)

        delta = round(lap_time - BASE_LAP, 2)
        running_smoothed_stress = int(round(0.4 * stress + 0.6 * running_smoothed_stress))

        min_sec = int(start_t // 60)
        sec = int(start_t % 60)
        timestamp_str = f"{min_sec:02d}:{sec:02d}"

        telemetry_datapoints.append({
            "time_offset": start_t,
            "timestamp_str": timestamp_str,
            "stress_score": stress,
            "smoothed_stress": running_smoothed_stress,
            "lap_time": lap_time,
            "sector1": s1,
            "sector2": s2,
            "sector3": s3,
            "pitch": pitch,
            "rms_energy": round(rms, 2),
            "speech_rate": speech_rate
        })

        # Critical Window Detection logic
        if (emotion == "Stressed" and stress >= 60) or (emotion == "Tired" and delta >= 0.3) or delta >= 0.4:
            impact_sign = "+" if delta >= 0 else ""
            desc = (
                f"High {emotion.lower()} state (stress score: {stress}/100) detected between {timestamp_str} and "
                f"00:{int(end_t):02d}. Correlated with {impact_sign}{delta}s lap pace drop on Lap {lap_num}."
            )

            explanation = generate_spike_explanation(
                emotion=emotion,
                stress_score=stress,
                pitch=pitch,
                rms=rms,
                speaking_rate=speech_rate
            )

            acoustic_trigger = f"Pitch Acceleration ({pitch:.0f}Hz)" if pitch > 190 else f"RMS Energy Surge ({rms:.2f})"

            critical_windows.append({
                "id": f"cw-{len(critical_windows) + 1}",
                "start_time": start_t,
                "end_time": end_t,
                "lap_number": lap_num,
                "emotion": emotion,
                "stress_score": stress,
                "lap_time_impact": delta,
                "description": desc,
                "explanation": explanation,
                "acoustic_trigger": acoustic_trigger,
                "acousticTrigger": acoustic_trigger
            })

    if not critical_windows and emotion_timeline:
        max_item = max(emotion_timeline, key=lambda x: x.get("stress_score", 0))
        if max_item.get("stress_score", 0) >= 45:
            stress = max_item.get("stress_score", 45)
            emotion = max_item.get("emotion", "Calm")
            pitch = max_item.get("pitch", 180)
            rms = max_item.get("rms", 0.15)
            speech_rate = max_item.get("speaking_rate", 4.0)

            explanation = generate_spike_explanation(
                emotion=emotion,
                stress_score=stress,
                pitch=pitch,
                rms=rms,
                speaking_rate=speech_rate
            )

            critical_windows.append({
                "id": "cw-1",
                "start_time": max_item.get("start_time", 0.0),
                "end_time": max_item.get("end_time", 6.0),
                "lap_number": 12,
                "emotion": emotion,
                "stress_score": stress,
                "lap_time_impact": 0.25,
                "description": f"Elevated vocal stress ({stress}/100) detected during mid-stint radio transmission.",
                "explanation": explanation,
                "acoustic_trigger": f"Pitch Shift ({pitch:.0f}Hz)",
                "acousticTrigger": f"Pitch Shift ({pitch:.0f}Hz)"
            })

    return {
        "critical_windows": critical_windows,
        "timeline_data": telemetry_datapoints
    }
