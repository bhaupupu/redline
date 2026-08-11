# Silent Co-Driver — Python FastAPI Backend

FastAPI backend and AI pipeline for **Silent Co-Driver (REDLINE)**. Handles F1 driver radio audio processing, Speech-to-Text transcription via Hugging Face Whisper, segment-level emotion/tone classification (Calm / Stressed / Tired), lap time correlation with critical window detection, and Race Engineer insight generation via Hugging Face LLM models.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env` in the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
Add your Hugging Face Access Token to `.env`:
```env
HF_TOKEN=hf_your_huggingface_token_here
```

### 3. Run the Backend Server
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
or
```bash
python backend/main.py
```

The API will be live at `http://localhost:8000`.  
Interactive API Docs are available at `http://localhost:8000/docs`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check status |
| `POST` | `/api/v1/upload-audio` | Temporary storage & audio format validation |
| `POST` | `/api/v1/stt` | Hugging Face Whisper STT transcription |
| `POST` | `/api/v1/emotion-analysis` | Segment-level emotion classification (Calm, Stressed, Tired) |
| `POST` | `/api/v1/correlate-laps` | Lap time telemetry & Critical Window detection |
| `POST` | `/api/v1/race-engineer-insights` | Hugging Face LLM Race Engineer insight generation |
| `POST` | `/api/v1/analyze` | Combined main analysis endpoint (accepts audio + optional lap times) |

---

## 🧠 AI Pipeline Architecture

1. **Audio Ingestion**: Saves uploaded `.wav`, `.mp3`, or `.m4a` files temporarily.
2. **Speech-to-Text**: Uses `openai/whisper-large-v3` via Hugging Face Inference API to transcribe driver radio speech with timestamps.
3. **Segment Emotion Classification**: Slices audio into 4–8s segments, extracts acoustic features (pitch, RMS energy, ZCR), and maps states to **Calm**, **Stressed**, **Tired**.
4. **Lap Time Correlation**: Synchronizes emotion telemetry with lap and sector split times to flag **Critical Windows** where stress/fatigue caused pace drops.
5. **Race Engineer Insights**: Uses `Meta-Llama-3.1-8B-Instruct` to generate 2–3 concise, professional race strategy callouts.
