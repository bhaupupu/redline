import React, { useState } from 'react';
import { X, CheckCircle2, Ticket } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passesCount: '2',
    suiteTier: 'Paddock Club Trackside',
  });
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = 'AUDI-F1-2027-' + Math.floor(100000 + Math.random() * 900000);
    setRefCode(randomCode);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      passesCount: '2',
      suiteTier: 'Paddock Club Trackside',
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn-close" 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px' }}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <h2 className="heading-extended modal-title">
              AUDI TRACKSIDE SUITE 2027
            </h2>
            <p className="modal-sub">
              Register now for priority seat allocation at the Formula 1® Australian Grand Prix in Melbourne.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Harrison"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">PASSES REQUESTED</label>
                  <select
                    className="form-select"
                    value={formData.passesCount}
                    onChange={(e) => setFormData({ ...formData, passesCount: e.target.value })}
                  >
                    <option value="1">1 VIP Pass</option>
                    <option value="2">2 VIP Passes</option>
                    <option value="4">4 VIP Passes</option>
                    <option value="8">8 Corporate Passes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">SUITE PACKAGE</label>
                  <select
                    className="form-select"
                    value={formData.suiteTier}
                    onChange={(e) => setFormData({ ...formData, suiteTier: e.target.value })}
                  >
                    <option value="Paddock Club Trackside">Paddock Club Trackside</option>
                    <option value="Apex Lounge VIP">Apex Lounge VIP</option>
                    <option value="Pit Lane Suite">Pit Lane Suite</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-pill-red"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
              >
                CONFIRM PRIORITY REGISTRATION
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={56} color="var(--audi-red)" style={{ marginBottom: '16px' }} />
            <h2 className="heading-extended" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
              REGISTRATION CONFIRMED
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
              Thank you, <strong>{formData.fullName}</strong>. Your priority interest for the <strong>{formData.suiteTier}</strong> has been received for the 2027 Australian Grand Prix in Melbourne.
            </p>

            <div 
              style={{ 
                background: '#1a1a1a', 
                border: '1px solid var(--border-dark)', 
                borderRadius: '12px', 
                padding: '16px', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              <Ticket color="var(--audi-red)" size={24} />
              <span style={{ fontFamily: 'var(--font-sub)', fontWeight: '700', letterSpacing: '0.1em' }}>
                PRIORITY REF: {refCode}
              </span>
            </div>

            <button className="btn-pill-red" onClick={handleReset}>
              DONE & CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
