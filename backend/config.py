import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env if present
env_path = Path(__file__).resolve().parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN") or os.getenv("HF_API_KEY") or ""
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

# Default Hugging Face Models
HF_STT_MODEL = os.getenv("HF_STT_MODEL", "openai/whisper-large-v3")
HF_EMOTION_MODEL = os.getenv("HF_EMOTION_MODEL", "bhadresh-ps/wav2vec2-lg-xlsr-en-speech-emotion-recognition")
HF_LLM_MODEL = os.getenv("HF_LLM_MODEL", "meta-llama/Meta-Llama-3.1-8B-Instruct")
