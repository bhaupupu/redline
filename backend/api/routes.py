from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from typing import List, Optional, Dict, Any
import json
import os

from backend.schemas import (
    AnalysisResponse, SegmentEmotion, TelemetryDataPoint, TranscriptSegment,
    CriticalWindow, DriverInfo, AcousticFeatures, CognitiveLoadIndex,
    RaceDNAProfile, EnhancedRaceEngineerInsight, SessionSummary, LapTimeInput
)
from backend.services.audio_service import (
    save_temporary_audio, cleanup_temporary_file, parse_wav_features
)
from backend.services.stt_service import transcribe_audio_hf, get_race_engineer_name
from backend.services.emotion_service import analyze_audio_segment_emotions
from backend.services.cli_service import calculate_cognitive_load_index
from backend.services.racedna_service import generate_race_dna_profile
from backend.services.correlation_service import (
    correlate_emotion_and_lap_times, enrich_critical_windows_with_explainability
)
from backend.services.explainability_service import (
    generate_explainability_statement, generate_explainable_insights
)
from backend.services.llm_insight_service import generate_enhanced_race_engineer_insights
from backend.services.session_summary_service import generate_session_summary

router = APIRouter()

DRIVER_MAP = {
    "hamilton": {"code": "HAM", "number": 44, "name": "Lewis Hamilton", "avatar": "🏎️", "color": "#e20613"},
    "verstappen": {"code": "VER", "number": 1, "name": "Max Verstappen", "avatar": "⚡", "color": "#36b37e"},
    "leclerc": {"code": "LEC", "number": 16, "name": "Charles Leclerc", "avatar": "🔥", "color": "#ffab00"},
    "norris": {"code": "NOR", "number": 4, "name": "Lando Norris", "avatar": "🚀", "color": "#00b8d9"},
    "piastri": {"code": "PIA", "number": 81, "name": "Oscar Piastri", "avatar": "🎯", "color": "#ff8000"},
    "sainz": {"code": "SAI", "number": 55, "name": "Carlos Sainz", "avatar": "🌶️", "color": "#e00000"},
    "russell": {"code": "RUS", "number": 63, "name": "George Russell", "avatar": "💎", "color": "#00d2be"},
    "alonso": {"code": "ALO", "number": 14, "name": "Fernando Alonso", "avatar": "👑", "color": "#006f62"},
    "perez": {"code": "PER", "number": 11, "name": "Sergio Perez", "avatar": "🇲🇽", "color": "#0600ef"},
    "gasly": {"code": "GAS", "number": 10, "name": "Pierre Gasly", "avatar": "🇫🇷", "color": "#ff1801"},
}


def resolve_driver_metadata(driver_id: str, driver_name: str, filename: str) -> dict:
    fn_lower = filename.lower() if filename else ""
    if "leclerc" in fn_lower or "charles" in fn_lower or "lec" in fn_lower:
        return DRIVER_MAP["leclerc"]
    if "verstappen" in fn_lower or "max" in fn_lower or "ver" in fn_lower:
        return DRIVER_MAP["verstappen"]
    if "norris" in fn_lower or "lando" in fn_lower or "nor" in fn_lower:
        return DRIVER_MAP["norris"]
    if "piastri" in fn_lower or "oscar" in fn_lower or "pia" in fn_lower:
        return DRIVER_MAP["piastri"]
    if "sainz" in fn_lower or "carlos" in fn_lower or "sai" in fn_lower:
        return DRIVER_MAP["sainz"]
    if "russell" in fn_lower or "george" in fn_lower or "rus" in fn_lower:
        return DRIVER_MAP["russell"]
    if "alonso" in fn_lower or "fernando" in fn_lower or "alo" in fn_lower:
        return DRIVER_MAP["alonso"]
    if "perez" in fn_lower or "sergio" in fn_lower or "per" in fn_lower:
        return DRIVER_MAP["perez"]
    if "gasly" in fn_lower or "pierre" in fn_lower or "gas" in fn_lower:
        return DRIVER_MAP["gasly"]
    if "hamilton" in fn_lower or "lewis" in fn_lower or "ham" in fn_lower:
        return DRIVER_MAP["hamilton"]

    d_id = (driver_id or "").lower()
    if d_id in DRIVER_MAP:
        return DRIVER_MAP[d_id]
    
    return {
        "code": (driver_id or "HAM")[:3].upper(),
        "number": 44,
        "name": driver_name or "Lewis Hamilton",
        "avatar": "🏎️",
        "color": "#e20613"
    }


@router.post("/cognitive-load", response_model=CognitiveLoadIndex)
async def cognitive_load_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")

    temp_path = save_temporary_audio(contents, file.filename or "audio.wav")
    try:
        audio_info = parse_wav_features(temp_path)
        emotion_data = analyze_audio_segment_emotions(audio_info["samples"], audio_info["framerate"], audio_info["duration"])
        cli = calculate_cognitive_load_index(emotion_data["emotion_timeline"], emotion_data["acoustic_features"])
        return cli
    finally:
        cleanup_temporary_file(temp_path)


@router.post("/race-dna", response_model=RaceDNAProfile)
async def race_dna_endpoint(
    driver_id: str = Form("hamilton"),
    driver_name: str = Form("Lewis Hamilton"),
    file: UploadFile = File(...)
):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")

    temp_path = save_temporary_audio(contents, file.filename or "audio.wav")
    try:
        audio_info = parse_wav_features(temp_path)
        duration = audio_info["duration"]
        meta = resolve_driver_metadata(driver_id, driver_name, file.filename or "")
        stt_result = transcribe_audio_hf(temp_path, duration=duration, driver_code=meta["code"], driver_name=meta["name"])
        emotion_data = analyze_audio_segment_emotions(audio_info["samples"], audio_info["framerate"], duration)

        profile = generate_race_dna_profile(
            driver_id=driver_id,
            driver_name=meta["name"],
            emotion_timeline=emotion_data["emotion_timeline"],
            transcript_segments=stt_result.get("segments", []),
            acoustic_features=emotion_data["acoustic_features"]
        )
        return profile
    finally:
        cleanup_temporary_file(temp_path)


@router.post("/explainability", response_model=List[Dict[str, Any]])
async def explainability_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")

    temp_path = save_temporary_audio(contents, file.filename or "audio.wav")
    try:
        audio_info = parse_wav_features(temp_path)
        duration = audio_info["duration"]
        stt_result = transcribe_audio_hf(temp_path, duration=duration)
        emotion_data = analyze_audio_segment_emotions(audio_info["samples"], audio_info["framerate"], duration)
        corr_result = correlate_emotion_and_lap_times(emotion_data["emotion_timeline"])

        enriched = enrich_critical_windows_with_explainability(
            corr_result["critical_windows"],
            emotion_data["emotion_timeline"],
            stt_result.get("segments", [])
        )
        return enriched
    finally:
        cleanup_temporary_file(temp_path)


@router.post("/session-summary", response_model=SessionSummary)
async def session_summary_endpoint(
    driver_id: str = Form("hamilton"),
    driver_name: str = Form("Lewis Hamilton"),
    file: UploadFile = File(...)
):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")

    temp_path = save_temporary_audio(contents, file.filename or "audio.wav")
    try:
        audio_info = parse_wav_features(temp_path)
        duration = audio_info["duration"]
        meta = resolve_driver_metadata(driver_id, driver_name, file.filename or "")
        stt_result = transcribe_audio_hf(temp_path, duration=duration, driver_code=meta["code"], driver_name=meta["name"])
        emotion_data = analyze_audio_segment_emotions(audio_info["samples"], audio_info["framerate"], duration)
        corr_result = correlate_emotion_and_lap_times(emotion_data["emotion_timeline"])
        critical_windows = enrich_critical_windows_with_explainability(
            corr_result["critical_windows"],
            emotion_data["emotion_timeline"],
            stt_result.get("segments", [])
        )

        enhanced_insights, _ = generate_enhanced_race_engineer_insights(
            driver_name=meta["name"],
            overall_mood=emotion_data["overall_mood"],
            overall_stress=emotion_data["overall_stress_score"],
            max_stress=emotion_data["max_stress_score"],
            emotion_timeline=emotion_data["emotion_timeline"],
            critical_windows=critical_windows,
            transcript_text=stt_result.get("text", "")
        )

        cli = calculate_cognitive_load_index(emotion_data["emotion_timeline"], emotion_data["acoustic_features"])
        race_dna = generate_race_dna_profile(
            driver_id=driver_id,
            driver_name=meta["name"],
            emotion_timeline=emotion_data["emotion_timeline"],
            transcript_segments=stt_result.get("segments", []),
            acoustic_features=emotion_data["acoustic_features"]
        )

        summary = generate_session_summary(
            driver_name=meta["name"],
            duration=duration,
            cognitive_load=cli,
            race_dna=race_dna,
            critical_windows=critical_windows,
            engineer_recommendations=enhanced_insights
        )
        return summary
    finally:
        cleanup_temporary_file(temp_path)


@router.post("/analyze", response_model=AnalysisResponse)
async def main_analysis_endpoint(
    file: UploadFile = File(...),
    driver_id: Optional[str] = Form("hamilton"),
    driver_name: Optional[str] = Form("Lewis Hamilton"),
    lap_times_json: Optional[str] = Form(None)
):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Audio file required")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file uploaded")

    temp_path = save_temporary_audio(contents, file.filename)

    try:
        audio_info = parse_wav_features(temp_path)
        samples = audio_info["samples"]
        framerate = audio_info["framerate"]
        duration = round(max(4.0, audio_info["duration"]), 2)

        meta = resolve_driver_metadata(driver_id or "hamilton", driver_name or "Lewis Hamilton", file.filename)
        driver_code = meta["code"]
        driver_car_number = meta["number"]
        resolved_driver_name = meta["name"]

        # 1. Speech-to-Text with Speaker Diarization (Driver vs Race Engineer)
        stt_result = transcribe_audio_hf(
            temp_path,
            duration=duration,
            driver_code=driver_code,
            driver_name=resolved_driver_name
        )
        full_transcript = stt_result.get("text", "")
        raw_transcript_segments = stt_result.get("segments", [])

        # Format Transcript Segments preserving diarized speaker tags
        transcript_segments = []
        for s in raw_transcript_segments:
            transcript_segments.append(TranscriptSegment(
                id=str(s.get("id", "1")),
                start_time=s.get("start_time", 0.0),
                end_time=s.get("end_time", duration),
                speaker=s.get("speaker") or f"{driver_code} (Driver #{driver_car_number})",
                text=s.get("text", ""),
                phrase_stress_score=s.get("phrase_stress_score", 45),
                urgency_level=s.get("urgency_level", "MEDIUM"),
                keywords_detected=s.get("keywords_detected", [])
            ))

        # 2. Segment Emotion Analysis
        emotion_data = analyze_audio_segment_emotions(samples, framerate, duration)
        raw_timeline = emotion_data["emotion_timeline"]
        overall_stress = emotion_data["overall_stress_score"]
        max_stress = emotion_data["max_stress_score"]
        overall_mood = emotion_data["overall_mood"]
        ac_features_dict = emotion_data["acoustic_features"]
        confidence_val = emotion_data.get("confidence", 94.5)

        emotion_timeline = []
        for t in raw_timeline:
            emotion_timeline.append(SegmentEmotion(
                id=t["id"],
                start_time=t["start_time"],
                end_time=t["end_time"],
                emotion=t["emotion"],
                stress_score=t["stress_score"],
                confidence=t["confidence"]
            ))

        # Parse Lap Times Input if provided
        lap_times_input = None
        if lap_times_json:
            try:
                parsed = json.loads(lap_times_json)
                if isinstance(parsed, list):
                    lap_times_input = [LapTimeInput(**item) for item in parsed]
            except Exception as e:
                print(f"Note: lap_times_json parsing warning: {e}")

        # 3. Lap Correlation & AI Explainability Critical Windows
        corr_result = correlate_emotion_and_lap_times(raw_timeline, lap_times_input)
        raw_critical = corr_result["critical_windows"]
        raw_telemetry = corr_result["timeline_data"]

        enriched_critical = enrich_critical_windows_with_explainability(
            raw_critical,
            raw_timeline,
            raw_transcript_segments
        )

        critical_windows = []
        for cw in enriched_critical:
            critical_windows.append(CriticalWindow(
                id=cw["id"],
                start_time=cw["start_time"],
                end_time=cw["end_time"],
                lap_number=cw.get("lap_number"),
                emotion=cw["emotion"],
                stress_score=cw["stress_score"],
                lap_time_impact=cw["lap_time_impact"],
                description=cw["description"],
                explanation=cw.get("explanation"),
                acoustic_trigger=cw.get("acoustic_trigger")
            ))

        timeline_data = []
        for dp in raw_telemetry:
            timeline_data.append(TelemetryDataPoint(
                time_offset=dp["time_offset"],
                timestamp_str=dp["timestamp_str"],
                stress_score=dp["stress_score"],
                smoothed_stress=dp["smoothed_stress"],
                lap_time=dp["lap_time"],
                sector1=dp["sector1"],
                sector2=dp["sector2"],
                sector3=dp["sector3"],
                pitch=dp["pitch"],
                rms_energy=dp["rms_energy"],
                speech_rate=dp["speech_rate"]
            ))

        # 4. Cognitive Load Index
        cognitive_load = calculate_cognitive_load_index(raw_timeline, ac_features_dict)

        # 5. RaceDNA™ Profile
        race_dna = generate_race_dna_profile(
            driver_id=driver_code.lower(),
            driver_name=resolved_driver_name,
            emotion_timeline=raw_timeline,
            transcript_segments=raw_transcript_segments,
            acoustic_features=ac_features_dict
        )

        # 6. Enhanced AI Race Engineer Insights
        enhanced_insights, legacy_insights = generate_enhanced_race_engineer_insights(
            driver_name=resolved_driver_name,
            overall_mood=overall_mood,
            overall_stress=overall_stress,
            max_stress=max_stress,
            emotion_timeline=raw_timeline,
            critical_windows=enriched_critical,
            transcript_text=full_transcript
        )

        # 7. Session Summary
        session_summary = generate_session_summary(
            driver_name=resolved_driver_name,
            duration=duration,
            cognitive_load=cognitive_load,
            race_dna=race_dna,
            critical_windows=enriched_critical,
            engineer_recommendations=enhanced_insights
        )

        driver_info = DriverInfo(
            id=driver_code.lower(),
            name=resolved_driver_name,
            number=driver_car_number,
            team="Audi F1 Team",
            code=driver_code,
            avatar=meta["avatar"],
            color=meta["color"]
        )

        acoustic_features = AcousticFeatures(
            rmsEnergy=ac_features_dict["rmsEnergy"],
            pitch=ac_features_dict["pitch"],
            pitchVariance=ac_features_dict["pitchVariance"],
            speakingRate=ac_features_dict["speakingRate"],
            zeroCrossingRate=ac_features_dict["zeroCrossingRate"],
            spectralCentroid=ac_features_dict["spectralCentroid"],
            emotion=overall_mood
        )

        if overall_stress >= 80:
            mood_label = "Critical Redline"
        elif overall_stress >= 65:
            mood_label = "Frustrated"
        elif overall_stress >= 45:
            mood_label = "Elevated"
        elif overall_stress >= 30:
            mood_label = "Focused"
        else:
            mood_label = "Nominal / Calm"

        return AnalysisResponse(
            driver=driver_info,
            audio_file_name=file.filename,
            duration=duration,
            overall_stress_score=overall_stress,
            max_stress_score=max_stress,
            mood_label=mood_label,
            confidence=round(confidence_val, 1),
            acoustic_features=acoustic_features,
            text_summary=f"Transcribed {duration}s radio telemetry for {resolved_driver_name} ({file.filename}). CLI: {cognitive_load.score}/100 ({cognitive_load.severity}). Dominant State: {race_dna.dominantState}.",
            race_engineer_insights=legacy_insights,
            timeline_data=timeline_data,
            transcript_segments=transcript_segments,
            emotion_timeline=emotion_timeline,
            critical_windows=critical_windows,
            cognitive_load_index=cognitive_load,
            race_dna=race_dna,
            enhanced_race_engineer_insights=enhanced_insights,
            session_summary=session_summary
        )

    finally:
        cleanup_temporary_file(temp_path)
