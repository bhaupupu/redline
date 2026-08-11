import { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { HeroBento } from './components/HeroBento';
import { InfoSection } from './components/InfoSection';
import { LowerBento } from './components/LowerBento';
import { Footer } from './components/Footer';
import { RedlineTelemetryPage } from './components/RedlineTelemetryPage';
import { StintRecordsPage } from './components/StintRecordsPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { RaceDNAPage } from './components/RaceDNAPage';
import { AnalysisResult } from './types/telemetry';
import { RadioDatasetPreset } from './services/sampleClips';

export function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePage, setActivePage] = useState<'landing' | 'telemetry' | 'records' | 'how-it-works' | 'racedna'>('landing');
  const [selectedRecordForTelemetry, setSelectedRecordForTelemetry] = useState<AnalysisResult | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Safety fallback to guarantee site content displays even if preloader is skipped
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoaded(true);
  };

  const handleOpenTelemetry = (preset?: RadioDatasetPreset) => {
    if (isFading) return;
    setIsNavOpen(false);
    if (preset) {
      setSelectedRecordForTelemetry(preset.analysis);
    } else {
      setSelectedRecordForTelemetry(null);
    }
    setIsFading(true);

    setTimeout(() => {
      setActivePage('telemetry');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 280);
  };

  const handleOpenRecordsVault = () => {
    if (isFading) return;
    setIsNavOpen(false);
    setIsFading(true);

    setTimeout(() => {
      setActivePage('records');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 280);
  };

  const handleOpenHowItWorks = () => {
    if (isFading) return;
    setIsNavOpen(false);
    setIsFading(true);

    setTimeout(() => {
      setActivePage('how-it-works');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 280);
  };

  const handleOpenRaceDna = () => {
    if (isFading) return;
    setIsNavOpen(false);
    setIsFading(true);

    setTimeout(() => {
      setActivePage('racedna');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 280);
  };

  const handleOpenTelemetryForRecord = (record: AnalysisResult) => {
    if (isFading) return;
    setSelectedRecordForTelemetry(record);
    setIsFading(true);

    setTimeout(() => {
      setActivePage('telemetry');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 280);
  };

  const handleBackToLanding = () => {
    if (isFading) return;
    setIsFading(true);

    setTimeout(() => {
      setActivePage('landing');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 280);
  };

  return (
    <>
      {/* 5-Ring F1 Start Light Loading Animation */}
      <Preloader onComplete={handlePreloaderComplete} />

      <div className={`app-container ${isLoaded ? 'page-loaded' : 'page-loading'}`}>
        <div className={`page-fade-wrapper ${isFading ? 'is-fading' : ''}`}>
          {activePage === 'landing' ? (
            <>
              {/* Main Bento Landing Page */}
              <HeroBento 
                isNavOpen={isNavOpen}
                onCloseMenu={() => setIsNavOpen(false)}
                onOpenMenu={() => setIsNavOpen(true)}
                onOpenTelemetryModal={() => handleOpenTelemetry()}
                onOpenRecordsVault={handleOpenRecordsVault}
                onOpenHowItWorks={handleOpenHowItWorks}
                onOpenRaceDna={handleOpenRaceDna}
              />

              {/* Narrative Info Banner Section */}
              <InfoSection />

              {/* Lower Bento Grid Section */}
              <LowerBento 
                onOpenTelemetryModal={() => handleOpenTelemetry()}
                onOpenRecordsVault={handleOpenRecordsVault}
                onOpenRaceDna={handleOpenRaceDna}
              />

              {/* Footer Bar */}
              <Footer />
            </>
          ) : activePage === 'records' ? (
            /* Dedicated F1 Telemetry Stint Records Vault Page */
            <StintRecordsPage 
              onBackToLanding={handleBackToLanding}
              onOpenTelemetryForRecord={handleOpenTelemetryForRecord}
              onOpenTelemetry={handleOpenTelemetry}
              onOpenHowItWorks={handleOpenHowItWorks}
              onOpenRaceDna={handleOpenRaceDna}
            />
          ) : activePage === 'how-it-works' ? (
            /* Dedicated How REDLINE Works Page */
            <HowItWorksPage
              onBackToLanding={handleBackToLanding}
              onLaunchTelemetry={handleOpenTelemetry}
              onOpenRecordsVault={handleOpenRecordsVault}
              onOpenRaceDna={handleOpenRaceDna}
            />
          ) : activePage === 'racedna' ? (
            /* Dedicated RaceDNA Engine Page */
            <RaceDNAPage
              onBackToLanding={handleBackToLanding}
              onOpenTelemetry={handleOpenTelemetry}
              onOpenRecordsVault={handleOpenRecordsVault}
              onOpenHowItWorks={handleOpenHowItWorks}
            />
          ) : (
            /* Dedicated REDLINE Telemetry System Full Page */
            <RedlineTelemetryPage 
              onBackToLanding={handleBackToLanding} 
              initialRecord={selectedRecordForTelemetry}
              onOpenRecordsVault={handleOpenRecordsVault}
              onOpenHowItWorks={handleOpenHowItWorks}
              onOpenRaceDna={handleOpenRaceDna}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
