import React, { useRef, useState } from 'react';
import { Upload, Music, CheckCircle2, Volume2, Radio } from 'lucide-react';
import { Driver } from '../types/telemetry';
import { SAMPLE_RADIO_DATASET_PRESETS, RadioDatasetPreset } from '../services/sampleClips';

interface AudioUploaderProps {
  selectedDriver: Driver;
  onFileUpload: (file: File) => void;
  onSelectDatasetSample?: (sample: RadioDatasetPreset) => void;
  isProcessing: boolean;
  activeFileName: string;
  audioUrl?: string | null;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFileUpload,
  onSelectDatasetSample,
  isProcessing,
  activeFileName,
  audioUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('audio') || file.name.match(/\.(wav|mp3|m4a|ogg|flac)$/i)) {
        onFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="audio-uploader-card">
      <div className="card-header-bar">
        <div className="header-left-title">
          <Upload size={18} className="title-icon" />
          <span>AUDIO CLIP UPLOADER & TELEMETRY ENGINE</span>
        </div>
        <span className="mode-badge">AUDIO FILE ANALYSIS MODE</span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`dropzone-box ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*,.wav,.mp3,.m4a,.ogg,.flac"
          style={{ display: 'none' }}
        />

        <div className="dropzone-icon-circle">
          <Upload size={24} color="#e20613" />
        </div>

        <div className="dropzone-text">
          {isProcessing ? (
            <span className="processing-text">
              <span className="spinner-dot" /> RUNNING MULTIMODAL AI STRESS ANALYSIS & SPEECH-TO-TEXT...
            </span>
          ) : (
            <>
              <span className="dropzone-main">DROP AUDIO FILE HERE OR CLICK TO UPLOAD</span>
              <span className="dropzone-sub">SUPPORTED FORMATS: .WAV, .MP3, .M4A, .OGG, .FLAC (MAX 50MB)</span>
            </>
          )}
        </div>

        {activeFileName && (
          <div className="active-file-indicator">
            <Music size={14} />
            <span>{activeFileName}</span>
            <CheckCircle2 size={14} color="#36b37e" />
          </div>
        )}
      </div>

      {/* Interactive Audio Player for Active Audio Clips */}
      {audioUrl && (
        <div style={{ marginTop: '16px', background: 'rgba(0, 0, 0, 0.6)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(226, 6, 19, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <Volume2 size={20} color="#e20613" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700, letterSpacing: '0.05em' }}>AUDIO PLAYER // LISTEN TO ACTIVE CLIP</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                {activeFileName}
              </div>
            </div>
          </div>

          <audio controls src={audioUrl} style={{ height: '36px', outline: 'none', borderRadius: '4px' }} />
        </div>
      )}

      {/* 5 HuggingFace Dataset F1 Team Radio Sample Call Presets */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#e20613', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.05em' }}>
          <Radio size={14} />
          <span>F1 RADIO DATASET SAMPLE CALLS (2018–2025)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          {SAMPLE_RADIO_DATASET_PRESETS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectDatasetSample?.(sample)}
              style={{
                background: activeFileName === sample.audioFileName ? 'rgba(226, 6, 19, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${activeFileName === sample.audioFileName ? '#e20613' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '8px',
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fff' }}>{sample.driverCode} #{sample.driverNumber}</span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: sample.overallStressScore > 75 ? '#e20613' : '#36b37e' }}>
                  {sample.grandPrix} • {sample.overallStressScore}% STRESS
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#aaa', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sample.quote}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
