import React from 'react';
import { Home, HelpCircle, ExternalLink, Database } from 'lucide-react';

interface NavDrawerProps {
  isOpen: boolean;
  isFalling: boolean;
  onClose: () => void;
  onOpenTicketModal: () => void;
  onGoToLandingPage?: () => void;
  onGoToRecordsVault?: () => void;
  onGoToHowItWorks?: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  isOpen,
  isFalling,
  onClose,
  onOpenTicketModal,
  onGoToLandingPage,
  onGoToRecordsVault,
  onGoToHowItWorks,
}) => {
  if (!isOpen) return null;

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    if (onGoToLandingPage) {
      onGoToLandingPage();
    }
  };

  return (
    <>
      {/* Darkened Gaussian Backdrop Blur covering page */}
      <div 
        className={`panel-backdrop ${isFalling ? 'backdrop-fade-out' : ''}`} 
        onClick={onClose} 
      />

      {/* Navigation Panel expanding cleanly below the top Header tile */}
      <div 
        className="inline-nav-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Full-Width White Card: DASHBOARD (Returns to main landing page) */}
        <div 
          className={`drawer-dashboard-bar ${isFalling ? 'item-falling-1' : ''}`}
          onClick={handleDashboardClick}
        >
          <span className="dashboard-label">DASHBOARD</span>
          <button 
            className="dashboard-icon-btn"
            onClick={handleDashboardClick}
          >
            <Home size={18} color="#ffffff" />
          </button>
        </div>

        {/* 2x2 White Cards Grid */}
        <div className="drawer-cards-grid">
          {/* Card 1: How REDLINE Works */}
          <div 
            className={`white-nav-card ${isFalling ? 'item-falling-2' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onClose();
              if (onGoToHowItWorks) onGoToHowItWorks();
              else onOpenTicketModal();
            }}
          >
            <div>
              <div className="nav-card-title" style={{ color: '#e20613' }}>How REDLINE Works</div>
              <div className="nav-card-sub">System architecture & AI guide</div>
            </div>
            <button className="nav-card-btn" style={{ background: '#e20613' }}>
              <HelpCircle size={18} color="#ffffff" />
            </button>
          </div>

          {/* Card 2: Dedicated Records Vault */}
          <div 
            className={`white-nav-card ${isFalling ? 'item-falling-3' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onClose();
              if (onGoToRecordsVault) onGoToRecordsVault();
              else onOpenTicketModal();
            }}
          >
            <div>
              <div className="nav-card-title" style={{ color: '#e20613' }}>Stint Records Vault</div>
              <div className="nav-card-sub">Dedicated telemetry history</div>
            </div>
            <button className="nav-card-btn" style={{ background: '#e20613' }}>
              <Database size={16} color="#ffffff" />
            </button>
          </div>

          {/* Card 3: Telemetry System */}
          <div 
            className={`white-nav-card ${isFalling ? 'item-falling-4' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onClose();
              onOpenTicketModal();
            }}
          >
            <div>
              <div className="nav-card-title" style={{ color: '#e20613' }}>Telemetry System</div>
              <div className="nav-card-sub">Real-time radio audio DSP</div>
            </div>
            <button className="nav-card-btn" style={{ background: '#e20613' }}>
              <Database size={16} color="#ffffff" />
            </button>
          </div>

          {/* Card 4: Pit Wall Strategy */}
          <div 
            className={`white-nav-card ${isFalling ? 'item-falling-5' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onClose();
              if (onGoToHowItWorks) onGoToHowItWorks();
              else onOpenTicketModal();
            }}
          >
            <div>
              <div className="nav-card-title" style={{ color: '#e20613' }}>Pit Wall Strategy</div>
              <div className="nav-card-sub">Automated AI recommendations</div>
            </div>
            <button className="nav-card-btn" style={{ background: '#e20613' }}>
              <HelpCircle size={16} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* Full-Width Red CTA Card at Bottom */}
        <div 
          className={`drawer-red-banner ${isFalling ? 'item-falling-6' : ''}`}
          onClick={() => {
            onClose();
            onOpenTicketModal();
          }}
        >
          <div className="drawer-red-title">
            Launch REDLINE AI Multimodal Telemetry System
          </div>
          <div className="red-card-circle-btn">
            <HelpCircle size={20} color="#ffffff" />
          </div>
        </div>
      </div>
    </>
  );
};
