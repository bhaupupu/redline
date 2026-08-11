import React, { useState } from 'react';
import { X, Activity, RefreshCw } from 'lucide-react';
import { RedlineLogo } from './RedlineLogo';
import { Driver, AnalysisResult } from '../types/telemetry';
import { DRIVERS, PRESET_ANALYSES } from '../services/sampleClips';
import { analyzeAudioFile } from '../services/aiProcessingEngine';
import { AudioUploader } from './AudioUploader';
import { StressGauge } from './StressGauge';
import { TelemetryChart } from './TelemetryChart';
import { AcousticMetricsGrid } from './AcousticMetricsGrid';
import { TranscriptFeed } from './TranscriptFeed';
import { AiEngineerInsights } from './AiEngineerInsights';

interface RedlineTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedlineTelemetryModal: React.FC<RedlineTelemetryModalProps> = ({ isOpen, onClose }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver>(DRIVERS[0]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(PRESET_ANALYSES.hamilton);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFileName, setActiveFileName] = useState('HAM_Radio_Silverstone_S2_Tires.mp3');

  if (!isOpen) return null;

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    const preset = PRESET_ANALYSES[driver.id] || PRESET_ANALYSES.hamilton;
    setAnalysisResult(preset);
    setActiveFileName(preset.audioFileName);
  };

  const handleSelectPreset = (driverId: string) => {
    const driver = DRIVERS.find((d) => d.id === driverId) || DRIVERS[0];
    setSelectedDriver(driver);
    const preset = PRESET_ANALYSES[driverId] || PRESET_ANALYSES.hamilton;
    setAnalysisResult(preset);
    setActiveFileName(preset.audioFileName);
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setActiveFileName(file.name);
    try {
      const result = await analyzeAudioFile(file, selectedDriver.id);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error processing audio file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="telemetry-modal-overlay" onClick={onClose}>
      <div className="telemetry-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div className="telemetry-modal-header">
          <div className="header-brand-group">
            <div className="brand-logo">
              <RedlineLogo height={24} />
            </div>

            <div className="brand-titles">
              <div className="brand-main">REDLINE TELEMETRY SYSTEM</div>
              <div className="brand-sub">AI RACE ENGINEER & DRIVER STRESS ANALYZER</div>
            </div>
          </div>

          <div className="header-right-actions">
            <div className="header-driver-selector">
              {DRIVERS.map((d) => (
                <button
                  key={d.id}
                  className={`header-driver-btn ${selectedDriver.id === d.id ? 'active' : ''}`}
                  onClick={() => handleSelectDriver(d)}
                >
                  <span>{d.code}</span>
                  <span className="num">#{d.number}</span>
                </button>
              ))}
            </div>

            <div className="status-live-badge">
              <Activity size={12} className="pulse-red" />
              <span>AUDIO ENGINE ONLINE</span>
            </div>

            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={22} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="telemetry-modal-body">
          {/* Audio Uploader & Sample Clips Selector */}
          <AudioUploader
            selectedDriver={selectedDriver}
            onSelectDriver={handleSelectDriver}
            onFileUpload={handleFileUpload}
            onSelectPreset={handleSelectPreset}
            isProcessing={isProcessing}
            activeFileName={activeFileName}
          />

          {/* Main Dashboard Grid */}
          <div className="redline-dashboard-grid">
            {/* Left Column: Stress Gauge & Acoustic Telemetry Cards */}
            <div className="dashboard-column col-left">
              <StressGauge
                score={analysisResult.overallStressScore}
                maxScore={analysisResult.maxStressScore}
                moodLabel={analysisResult.moodLabel}
                confidence={analysisResult.confidence}
              />

              <AcousticMetricsGrid features={analysisResult.acousticFeatures} />
            </div>

            {/* Right Column: Telemetry Chart & AI Insights */}
            <div className="dashboard-column col-right">
              <TelemetryChart
                data={analysisResult.timelineData}
                driverName={analysisResult.driver.name}
              />

              <AiEngineerInsights
                insight={analysisResult.aiRaceEngineerInsight}
                summary={analysisResult.textSummary}
                driverName={analysisResult.driver.name}
                stressScore={analysisResult.overallStressScore}
              />
            </div>
          </div>

          {/* Full-Width Interactive Radio Transcript Feed */}
          <TranscriptFeed segments={analysisResult.transcriptSegments} />
        </div>
      </div>
    </div>
  );
};
