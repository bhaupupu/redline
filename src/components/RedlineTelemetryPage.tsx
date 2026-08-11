import React, { useState } from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Driver, AnalysisResult } from '../types/telemetry';
import { DRIVERS, RadioDatasetPreset } from '../services/sampleClips';
import { analyzeAudioFile, detectDriverFromFilename } from '../services/aiProcessingEngine';
import { AudioUploader } from './AudioUploader';
import { StressGauge } from './StressGauge';
import { TelemetryChart } from './TelemetryChart';
import { AcousticMetricsGrid } from './AcousticMetricsGrid';
import { TranscriptFeed } from './TranscriptFeed';
import { AiEngineerInsights } from './AiEngineerInsights';
import { Footer } from './Footer';

interface RedlineTelemetryPageProps {
  onBackToLanding: () => void;
  initialRecord?: AnalysisResult | null;
}

const IDLE_ANALYSIS: AnalysisResult = {
  driver: DRIVERS[0],
  audioFileName: '',
  duration: 0,
  overallStressScore: 0,
  maxStressScore: 0,
  moodLabel: 'Nominal / Calm',
  confidence: 0,
  acousticFeatures: {
    rmsEnergy: 0,
    pitch: 0,
    pitchVariance: 0,
    speakingRate: 0,
    zeroCrossingRate: 0,
    spectralCentroid: 0,
    emotion: 'Calm',
  },
  textSummary: '',
  aiRaceEngineerInsight: '',
  timelineData: [],
  transcriptSegments: [],
};

export const RedlineTelemetryPage: React.FC<RedlineTelemetryPageProps> = ({
  onBackToLanding,
  initialRecord,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver>(initialRecord?.driver || DRIVERS[0]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(initialRecord || IDLE_ANALYSIS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFileName, setActiveFileName] = useState(initialRecord?.audioFileName || '');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleToggleMenu = () => {
    if (isNavOpen) {
      triggerCloseWithFalling();
    } else {
      setIsFalling(false);
      setIsNavOpen(true);
    }
  };

  const triggerCloseWithFalling = () => {
    if (isFalling) return;
    setIsFalling(true);
    setTimeout(() => {
      setIsNavOpen(false);
      setIsFalling(false);
    }, 700);
  };

  const handleSelectDatasetSample = (sample: RadioDatasetPreset) => {
    setSelectedDriver(sample.analysis.driver);
    setAnalysisResult(sample.analysis);
    setActiveFileName(sample.audioFileName);
    setAudioUrl(sample.audioUrl);
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setActiveFileName(file.name);

    // Auto-detect driver from filename if present
    const detected = detectDriverFromFilename(file.name);
    const targetDriver = detected || selectedDriver;
    setSelectedDriver(targetDriver);

    // Create playable audio URL for HTML5 audio player
    try {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } catch (e) {
      console.warn('ObjectURL error:', e);
    }

    try {
      const result = await analyzeAudioFile(file, targetDriver.id);
      setSelectedDriver(result.driver);
      setAnalysisResult(result);

      // Save to localStorage history for the dedicated F1 Telemetry Records Vault page
      try {
        const saved = localStorage.getItem('redline_stint_history');
        const prev: AnalysisResult[] = saved ? JSON.parse(saved) : [];
        const filtered = prev.filter((item) => item.audioFileName !== result.audioFileName);
        const updated = [result, ...filtered].slice(0, 10);
        localStorage.setItem('redline_stint_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    } catch (err) {
      console.error('Error processing audio file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="telemetry-page-container">
      {/* Telemetry Page Top Header */}
      <div style={{ position: 'relative' }}>
        <Header 
          isOpen={isNavOpen} 
          onToggleMenu={handleToggleMenu} 
        />

        <NavDrawer
          isOpen={isNavOpen}
          isFalling={isFalling}
          onClose={triggerCloseWithFalling}
          onOpenTicketModal={onBackToLanding}
          onGoToLandingPage={onBackToLanding}
        />
      </div>

      {/* Navigation Controls Sub-Header Bar */}
      <div className="telemetry-sub-bar">
        <div className="sub-bar-left">
          <div className="telemetry-page-title">
            <span className="title-redline">REDLINE</span>
            <span className="title-sub">THE SILENT CO-DRIVER // AI RACE ENGINEER</span>
          </div>
        </div>

        <div className="sub-bar-right">
          <div className="status-live-badge">
            <Activity size={12} className="pulse-red" />
            <span>AUDIO ENGINE ONLINE</span>
          </div>

          <button className="back-landing-btn" onClick={onBackToLanding}>
            <ArrowLeft size={16} />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      </div>

      {/* Main Telemetry Body Grid */}
      <main className="telemetry-page-body">
        {/* Audio Uploader with Playable Audio Player & 5 Dataset Sample Presets */}
        <AudioUploader
          selectedDriver={selectedDriver}
          onFileUpload={handleFileUpload}
          onSelectDatasetSample={handleSelectDatasetSample}
          isProcessing={isProcessing}
          activeFileName={activeFileName}
          audioUrl={audioUrl}
        />

        {/* Dashboard Main Grid Layout */}
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
      </main>

      {/* Footer Bar */}
      <Footer />
    </div>
  );
};
