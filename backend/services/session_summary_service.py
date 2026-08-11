import datetime
from typing import List, Dict, Any
from backend.schemas import (
    SessionSummary,
    CognitiveLoadIndex,
    RaceDNAProfile,
    EnhancedRaceEngineerInsight
)


def generate_session_summary(
    driver_name: str,
    duration: float,
    cognitive_load: CognitiveLoadIndex,
    race_dna: RaceDNAProfile,
    critical_windows: List[Dict[str, Any]],
    engineer_recommendations: List[EnhancedRaceEngineerInsight]
) -> SessionSummary:
    """
    Session Summary Generator.
    Produces a polished end-of-session race engineering report combining:
    - Stint metadata & duration
    - Cognitive Load Index summary
    - RaceDNA™ snapshot
    - Critical Windows highlights
    - Pit Wall recommendations
    - Final Executive Stint Verdict
    """
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    session_id = f"SES-F1-{driver_name[:3].upper()}-{int(duration)}S"

    # Summarize critical windows
    cw_summaries = []
    for idx, cw in enumerate(critical_windows):
        lap = cw.get("lap_number", "N/A")
        impact = cw.get("lap_time_impact", 0.0)
        emotion = cw.get("emotion", "Stressed")
        desc = cw.get("description", "")
        cw_summaries.append(f"Window #{idx+1} (Lap {lap}): {emotion} state (+{impact}s lap time loss). {desc}")

    if not cw_summaries:
        cw_summaries.append("No critical cognitive overload windows observed during stint.")

    # Synthesize executive stint verdict
    cli_score = cognitive_load.score
    cli_severity = cognitive_load.severity
    dominant_state = race_dna.dominantState
    signature = race_dna.signatureTrait

    if cli_severity in ["Critical", "High"]:
        verdict = (
            f"HIGH STRESS STINT: Driver {driver_name} operated under high cognitive pressure (CLI: {cli_score}/100, {cli_severity}). "
            f"Cognitive DNA identifies driver as '{signature}'. Vocal telemetry indicates accumulated stress in technical stint sectors. "
            f"Executing recommended pit wall radio blackout and engine mode overrides will recover estimated 0.3-0.5s per lap."
        )
    elif dominant_state == "Tired":
        verdict = (
            f"FATIGUE-LIMITED STINT: Driver {driver_name} exhibited vocal fatigue metrics (CLI: {cli_score}/100). "
            f"Acoustic features reveal slowed speech velocity and suppressed spectral centroid. Immediate pit window call recommended "
            f"to prevent further tire and lap pace degradation."
        )
    else:
        verdict = (
            f"OPTIMAL PERFORMANCE STINT: Driver {driver_name} delivered a clean, focused stint (CLI: {cli_score}/100, {cli_severity}). "
            f"RaceDNA™ consistency score ({race_dna.cognitiveConsistency}%) confirms high emotional composure. Pit wall strategy cleared for aggressive push laps."
        )

    return SessionSummary(
        session_id=session_id,
        timestamp=now_str,
        total_duration_seconds=round(duration, 2),
        overall_cognitive_load=cognitive_load,
        race_dna_snapshot=race_dna,
        total_critical_windows=len(critical_windows),
        critical_windows_summary=cw_summaries,
        engineer_recommendations=engineer_recommendations,
        stintVerdict=verdict
    )
