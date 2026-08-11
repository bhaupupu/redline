import io
import wave
import struct
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def generate_dummy_wav_bytes(duration_sec=6, sample_rate=16000):
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        num_samples = int(duration_sec * sample_rate)
        samples = [int(10000 * (i % 36 / 36.0)) for i in range(num_samples)]
        raw_data = struct.pack(f'<{len(samples)}h', *samples)
        wf.writeframes(raw_data)
    buf.seek(0)
    return buf.read()


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "2.0.0"
    print("SUCCESS: /api/v1/health passed")


def test_upload_audio_endpoint():
    wav_data = generate_dummy_wav_bytes(3)
    response = client.post(
        "/api/v1/upload-audio",
        files={"file": ("test.wav", wav_data, "audio/wav")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "uploaded"
    assert data["duration_seconds"] > 0
    print("SUCCESS: /api/v1/upload-audio passed")


def test_cognitive_load_endpoint():
    wav_data = generate_dummy_wav_bytes(6)
    response = client.post(
        "/api/v1/cognitive-load",
        files={"file": ("test_cli.wav", wav_data, "audio/wav")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "severity" in data
    assert data["severity"] in ["Low", "Moderate", "High", "Critical"]
    assert len(data["components"]) > 0
    print("SUCCESS: /api/v1/cognitive-load passed")


def test_race_dna_endpoint():
    wav_data = generate_dummy_wav_bytes(6)
    response = client.post(
        "/api/v1/race-dna",
        files={"file": ("test_dna.wav", wav_data, "audio/wav")},
        data={"driver_id": "hamilton", "driver_name": "Lewis Hamilton"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "dominantState" in data or "dominant_state" in data
    assert "cognitiveConsistency" in data or "cognitive_consistency" in data
    assert "signatureTrait" in data or "signature_trait" in data
    print("SUCCESS: /api/v1/race-dna passed")


def test_explainability_endpoint():
    response = client.post(
        "/api/v1/explainability",
        data={
            "emotion": "Stressed",
            "stress_score": "80",
            "pitch": "240.0",
            "rms": "0.32",
            "transcript_text": "tyres are gone"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "explanation" in data
    assert "Stress spike" in data["explanation"]
    print("SUCCESS: /api/v1/explainability passed")


def test_session_summary_endpoint():
    wav_data = generate_dummy_wav_bytes(6)
    response = client.post(
        "/api/v1/session-summary",
        files={"file": ("test_session.wav", wav_data, "audio/wav")},
        data={"driver_name": "Lewis Hamilton"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "sessionId" in data or "session_id" in data
    assert "overallCognitiveLoad" in data or "overall_cognitive_load" in data
    assert "stintVerdict" in data or "stint_verdict" in data
    print("SUCCESS: /api/v1/session-summary passed")


def test_main_analyze_endpoint():
    wav_data = generate_dummy_wav_bytes(6)
    response = client.post(
        "/api/v1/analyze",
        files={"file": ("radio_test.wav", wav_data, "audio/wav")},
        data={"driver_id": "hamilton", "driver_name": "Lewis Hamilton"}
    )
    assert response.status_code == 200
    data = response.json()

    # Verify legacy keys
    assert "overallStressScore" in data or "overall_stress_score" in data
    assert len(data.get("emotionTimeline", data.get("emotion_timeline", []))) > 0
    assert len(data.get("aiRaceEngineerInsight", data.get("race_engineer_insights", []))) > 0

    # Verify mandatory feature keys
    assert "cognitiveLoadIndex" in data or "cognitive_load_index" in data
    assert "raceDNA" in data or "race_dna" in data
    assert "enhancedRaceEngineerInsights" in data or "enhanced_race_engineer_insights" in data
    assert "sessionSummary" in data or "session_summary" in data

    # Verify Critical Windows explainability fields
    cw = data.get("criticalWindows", data.get("critical_windows", []))[0]
    assert "explanation" in cw or "description" in cw
    print("SUCCESS: /api/v1/analyze passed with all mandatory new features")


if __name__ == "__main__":
    test_health_endpoint()
    test_upload_audio_endpoint()
    test_cognitive_load_endpoint()
    test_race_dna_endpoint()
    test_explainability_endpoint()
    test_session_summary_endpoint()
    test_main_analyze_endpoint()
    print("\n[ALL TESTS PASSED SUCCESSFULLY!]")
