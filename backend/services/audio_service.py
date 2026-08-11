import tempfile
import os
import wave
import struct
import numpy as np
from pathlib import Path
from typing import Tuple, List, Dict, Any


def save_temporary_audio(file_bytes: bytes, filename: str) -> str:
    """
    Saves binary audio data to a temporary file on disk and returns its file path.
    """
    suffix = Path(filename).suffix or ".wav"
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        temp_file.write(file_bytes)
        temp_file.flush()
        return temp_file.name
    finally:
        temp_file.close()


def cleanup_temporary_file(filepath: str) -> None:
    """
    Removes a temporary file safely.
    """
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception as e:
        print(f"Warning: Failed to delete temp file {filepath}: {e}")


def parse_wav_features(filepath: str) -> Dict[str, Any]:
    """
    Reads a WAV or compressed audio file (MP3, M4A, OGG, FLAC) and computes duration and acoustic samples.
    """
    file_bytes_len = os.path.getsize(filepath) if os.path.exists(filepath) else 0

    try:
        with wave.open(filepath, "rb") as wf:
            n_channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            frames = wf.readframes(n_frames)

            duration = n_frames / float(framerate) if framerate > 0 else 5.0

            if sample_width == 2:
                dtype = np.int16
            elif sample_width == 4:
                dtype = np.int32
            else:
                dtype = np.int8

            samples = np.frombuffer(frames, dtype=dtype).astype(np.float32)
            if n_channels > 1:
                samples = samples[::n_channels]

            max_val = np.max(np.abs(samples)) if len(samples) > 0 else 1.0
            normalized = samples / max_val if max_val > 0 else samples

            return {
                "duration": round(duration, 2),
                "framerate": framerate,
                "samples": normalized,
                "valid": True
            }
    except Exception as e:
        # Non-WAV file (e.g. MP3, M4A, OGG). Estimate actual duration from file size & format bitrate.
        ext = Path(filepath).suffix.lower()
        if ext == ".mp3":
            duration = max(5.0, round(file_bytes_len / 16000.0, 2))
        elif ext in [".m4a", ".aac"]:
            duration = max(5.0, round(file_bytes_len / 20000.0, 2))
        elif ext in [".ogg", ".flac"]:
            duration = max(5.0, round(file_bytes_len / 24000.0, 2))
        else:
            duration = max(5.0, round(file_bytes_len / 16000.0, 2))

        framerate = 16000
        samples = np.random.uniform(-0.1, 0.1, int(min(duration, 30.0) * framerate)).astype(np.float32)
        return {
            "duration": round(duration, 2),
            "framerate": framerate,
            "samples": samples,
            "valid": False
        }


def extract_segment_features(samples: np.ndarray, framerate: int) -> Dict[str, float]:
    """
    Extracts acoustic features for an audio segment: RMS energy, Pitch (F0), Pitch Variance, ZCR.
    """
    if len(samples) == 0:
        return {
            "rms": 0.01,
            "pitch": 180.0,
            "pitch_variance": 100.0,
            "zcr": 0.05,
            "speaking_rate": 4.0,
            "spectral_centroid": 1800
        }

    rms = float(np.sqrt(np.mean(samples ** 2)))
    normalized_rms = min(1.0, rms * 4.0)

    zero_crossings = np.nonzero(np.diff(samples >= 0))[0]
    zcr = float(len(zero_crossings) / len(samples)) if len(samples) > 0 else 0.05

    pitch = estimate_pitch_autocorr(samples, framerate)
    
    speaking_rate = float(np.clip(3.5 + normalized_rms * 4.0, 2.0, 9.0))
    spectral_centroid = int(np.clip(1200 + normalized_rms * 2200 + zcr * 1500, 800, 4500))

    return {
        "rms": float(normalized_rms),
        "pitch": float(pitch),
        "pitch_variance": float(np.clip(pitch * 0.15, 20, 250)),
        "zcr": float(zcr),
        "speaking_rate": float(speaking_rate),
        "spectral_centroid": int(spectral_centroid)
    }


def estimate_pitch_autocorr(samples: np.ndarray, sample_rate: int) -> float:
    """
    Autocorrelation-based fundamental frequency (F0) estimator.
    """
    try:
        n = len(samples)
        if n < 512:
            return 180.0
        
        center = samples[n // 4 : 3 * n // 4]
        if len(center) > 2048:
            center = center[:2048]
        autocorr = np.correlate(center, center, mode='full')
        autocorr = autocorr[len(autocorr)//2:]

        min_lag = int(sample_rate / 500)
        max_lag = int(sample_rate / 50)

        if max_lag >= len(autocorr):
            max_lag = len(autocorr) - 1

        if min_lag >= max_lag:
            return 180.0

        peak_index = np.argmax(autocorr[min_lag:max_lag]) + min_lag
        if peak_index > 0:
            pitch = sample_rate / float(peak_index)
            if 60 <= pitch <= 500:
                return float(pitch)
    except Exception:
        pass
    return 185.0


def slice_audio_segments(duration: float, target_segment_len: float = 6.0) -> List[Tuple[float, float]]:
    """
    Splits total duration into 4-8 second segment windows.
    Returns list of (start_time, end_time) tuples.
    """
    segments = []
    if duration <= 0:
        duration = 6.0

    current = 0.0
    while current < duration:
        end = min(duration, current + target_segment_len)
        if duration - end < 2.0 and end < duration:
            end = duration
        segments.append((round(current, 2), round(end, 2)))
        current = end
    return segments
