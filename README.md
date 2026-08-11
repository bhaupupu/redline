# REDLINE — The Silent Co-Driver
### *AI-Powered Formula 1 Race Engineer & Driver Stress Telemetry System*

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging_Face-Inference_API-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)

---

## Executive Summary

Modern Formula 1 pit walls make data-driven decisions based on thousands of physical telemetry streams per second—tire degradation, brake temperatures, speed traps, and battery deployment. However, **driver cognitive load, stress, and emotional panic** remain an unquantified blind spot, evaluated manually by race engineers listening to team radio messages under extreme pressure.

**REDLINE (The Silent Co-Driver)** bridges this critical gap. It is a real-time, AI-powered telemetry and race engineering platform that continuously analyzes driver voice communications using multimodal AI (combining acoustic vocal features with natural language sentiment), calculates a real-time **Driver Stress Index (0–100)**, and overlays psychological stress telemetry directly against live lap performance and sector split timing via the **OpenF1 API**.

---

## Key Features & Capabilities

### 1. Dual Input Modes (Unified Backend Pipeline)
* **Simulated Live Mode (Primary Demo Mode)**: Streams pre-loaded F1 team radio transmissions in ~5-second audio chunks over WebSockets to emulate live session pit-to-car radio feeds. Features incremental transcription, real-time stress telemetry streaming, and dynamic UI updates.
* **Audio Upload Mode**: Allows race engineers to upload full session audio recordings (`.wav`, `.mp3`, `.m4a`). The backend executes chunked batch processing, returning end-to-end stress profile timelines and performance correlation analytics.

### 2. Multimodal AI Processing Pipeline
* **Speech-to-Text (STT)**: Powered by Hugging Face Inference API (`distil-whisper` with automatic fallback to `openai/whisper-large-v3`) for ultra-low latency transcription of noisy in-cockpit radio transmissions.
* **Acoustic Audio Analysis**: PyTorch and Librosa signal processing engine extracting:
  * RMS Energy & Intensity
  * Fundamental Frequency ($F_0$ Pitch) & Pitch Variance
  * Speaking Rate & Cadence (syllables/sec)
  * Spectral Centroid & Zero Crossing Rate (ZCR)
  * MFCCs (Mel-Frequency Cepstral Coefficients)
  * `wav2vec2` vocal emotion & arousal classification
* **Natural Language NLP Analysis**: Text analytics searching for urgency triggers, repeated words, clipped sentence structures, panic keywords, and aggressive team radio phrasing.
* **Multimodal Fusion Engine**: Synthesizes acoustic stress metrics (50% weight) and linguistic text sentiment (50% weight), applies exponential rolling window smoothing, computes statistical confidence, assigns mood labels (*Calm*, *Focused*, *Elevated*, *Frustrated*, *Panic*), and generates natural-language race engineer summaries.

### 3. High-Density F1 Race Engineer Dashboard
* **Header Telemetry Bar**: Active session status, driver profile cards (Hamilton, Verstappen, Leclerc), stream connection health, and mode toggles.
* **Animated Stress Gauge**: Dynamic circular SVG stress meter (0–100) with fluid color transitions:
  * **0–35 (Calm / Nominal)**
  * **36–60 (Elevated Focus)**
  * **61–80 (High Stress / Agitated)**
  * **81–100 (Critical Redline / Panic)**
* **Live Streaming Transcript Feed**: Auto-scrolling radio log featuring phrase stress highlighting, acoustic metrics, confidence badges, and timestamps.
* **Stress & Lap Performance Overlay Timeline**: Synchronized dual-axis Recharts timeline visualizing driver stress fluctuations alongside lap times and sector 1/2/3 split performance.
* **OpenF1 Telemetry Integration**: Live integration with the OpenF1 REST API, featuring a realistic mock telemetry fallback engine when no live F1 session is actively running.
* **AI Race Engineer Insights Panel**: Automated narrative generator explaining driver stress shifts (e.g., *"Stress spiked to 84 due to rapid pitch acceleration and repeated urgent phrases during Sector 2 push lap"*).

---

## System Architecture

```
                               ┌──────────────────────────────────────────┐
                               │            React 18 Frontend             │
                               │  (Vite + TypeScript + Tailwind + Recharts) │
                               └────────────────────┬─────────────────────┘
                                                    │
                                           HTTP / WebSockets
                                                    │
                               ┌────────────────────▼─────────────────────┐
                               │           FastAPI Backend API            │
                               │        (Async Python 3.11 / Uvicorn)      │
                               └─────────┬──────────────────────┬─────────┘
                                         │                      │
                   ┌─────────────────────▼──────┐        ┌──────▼─────────────────────┐
                   │  Multimodal AI Pipeline    │        │  OpenF1 Telemetry Engine   │
                   │                            │        │                            │
                   │ ┌────────────────────────┐ │        │ ┌────────────────────────┐ │
                   │ │   Hugging Face STT     │ │        │ │   OpenF1 REST API      │ │
                   │ │    (Distil-Whisper)    │ │        │ └───────────┬────────────┘ │
                   │ └───────────┬────────────┘ │        │             │              │
                   │             │              │        │ ┌───────────▼────────────┐ │
                   │ ┌───────────▼────────────┐ │        │ │ Mock Telemetry Fallback │ │
                   │ │ Acoustic Extractor     │ │        │ └────────────────────────┘ │
                   │ │  (Librosa / PyTorch)   │ │        └────────────────────────────┘
                   │ └───────────┬────────────┘ │
                   │             │              │
                   │ ┌───────────▼────────────┐ │
                   │ │   Text NLP Engine      │ │
                   │ └───────────┬────────────┘ │
                   │             │              │
                   │ ┌───────────▼────────────┐ │
                   │ │    Fusion Engine       │ │
                   │ │  (Stress Index 0-100)  │ │
                   │ └────────────────────────┘ │
                   └────────────────────────────┘
```

---

## Project Structure

```
redline/
├── backend/
│   ├── api/
│   │   ├── routes_upload.py        # REST Endpoint for audio file processing
│   │   ├── routes_telemetry.py     # OpenF1 & timing telemetry endpoints
│   │   └── websocket_live.py       # Live audio chunking WebSocket server
│   ├── processors/
│   │   ├── audio_features.py       # Pitch, RMS, speaking rate, MFCC extraction
│   │   ├── text_analysis.py        # Transcript sentiment, urgency & panic phrases
│   │   └── stt_service.py          # Hugging Face Inference API (Distil-Whisper)
│   ├── fusion/
│   │   └── fusion_engine.py        # Stress calculation, rolling average & AI insights
│   ├── services/
│   │   ├── openf1_client.py        # OpenF1 API client with mock timing generator
│   │   └── sample_audio_service.py # Bundled F1 radio clips loader
│   ├── samples/                    # Pre-loaded F1 radio audio clips (.wav/.mp3)
│   ├── main.py                     # FastAPI application entrypoint
│   └── requirements.txt            # Python dependencies
├── src/
│   ├── assets/                     # F1 audio samples, team logos, and visual assets
│   ├── components/
│   │   ├── layout/                 # Header, Sidebar, Container layout wrappers
│   │   ├── dashboard/              # Stress Gauge, Live Feed, Audio Metrics, AI Insights
│   │   ├── charts/                 # Synchronized Stress vs. Lap Performance timeline
│   │   └── ui/                     # Cards, badges, buttons, redline indicators
│   ├── hooks/                      # Custom React hooks (WebSocket, Audio, Telemetry)
│   ├── services/                   # Frontend API client for Backend & OpenF1
│   ├── store/                      # Zustand store for session state & live telemetry
│   ├── types/                      # TypeScript definitions for telemetry & AI outputs
│   ├── App.tsx                     # Main layout shell & view router
│   └── main.tsx                    # React application entrypoint
├── .env.example                    # Environment variable configuration template
├── package.json                    # Frontend Node.js dependencies
├── tailwind.config.js              # Custom Tailwind theme tokens (F1 Red, Off-White)
├── TASK.md                         # Detailed project specification & execution plan
└── README.md                       # Comprehensive system documentation
```

---

## Technology Stack

| Layer | Technologies & Libraries |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **State & Data Fetching** | Zustand, Custom React Hooks, WebSockets Client |
| **Styling & Animation** | Tailwind CSS v3.4, Framer Motion, Lucide React Icons |
| **Data Visualization** | Recharts (Dual-axis time series charts), Custom SVG Components |
| **Backend API** | Python 3.11+, FastAPI, Asyncio, Pydantic v2, Uvicorn |
| **Signal & Audio Processing** | PyTorch, Librosa, SoundFile, NumPy, SciPy |
| **AI / Machine Learning** | Hugging Face Inference API (`distil-whisper`, `whisper-large-v3`, `wav2vec2-emotion`) |
| **External Telemetry API** | OpenF1 API (Live/historical driver timing, lap sector data) |
| **Design Aesthetic** | Premium Off-White Motorsport Interface (Cream `#F9F9FB`, Slate `#1E293B`, F1 Red `#E10600`) |

---

## Quick Start & Installation

### Prerequisites
* **Python**: 3.11 or higher
* **Node.js**: v18.0 or higher
* **npm** or **pnpm** / **yarn**
* **Hugging Face API Token** *(Optional, for live STT & emotion inference)*

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to add your `HF_API_KEY` (Hugging Face API key).*

5. Launch the FastAPI development server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   *The API server will run at `http://localhost:8000`. Interactive API documentation is available at `http://localhost:8000/docs`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the project root:
   ```bash
   cd redline
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Demo Walkthrough & Usage

### Simulated Live Mode
1. Ensure the backend server is running on `port 8000`.
2. On the dashboard header, set the **Mode** toggle to **Simulated Live**.
3. Select an active driver profile (e.g., *Lewis Hamilton*, *Max Verstappen*, or *Charles Leclerc*).
4. Click **Start Radio Stream**.
5. Watch the dashboard stream ~5s radio audio chunks live:
   * Real-time transcription appends to the **Transcript Feed**.
   * Voice pitch, RMS energy, and speech cadence populate the **Acoustic Telemetry Cards**.
   * The **Stress Gauge** sweeps to display the real-time stress index (0–100).
   * Stress telemetry plot points stream onto the **Synchronized Lap Time Overlay Chart**.
   * The **AI Race Engineer** outputs live contextual feedback explaining stress spikes.

### Audio Upload Mode
1. Set the **Mode** toggle to **Audio Upload**.
2. Drag and drop or browse to select an audio file (`.wav`, `.mp3`, `.m4a`).
3. Click **Process Session Telemetry**.
4. The system executes chunked audio analysis, outputting complete session telemetry timeline graphs and stress summary reports.

---

## UI/UX Design System

REDLINE features a bespoke **Motorsport Control Room** design:
* **Background**: Clean Off-White / Light Cream (`#F9F9FB`) providing optimal contrast for telemetry readability.
* **Typography**: Crisp Slate Blue (`#0F172A`) for primary headers with tabular monospaced alignment for timing numbers.
* **Brand Accent**: Official F1 Racing Red (`#E10600`) for redline warnings, critical stress triggers, and active stream status indicators.
* **Micro-Animations**: Fluid CSS gauge sweeps, autoscrolling transcripts, hover-card elevations, and reactive chart tooltips.

---

## License

Private / Internal Project — All Rights Reserved.
