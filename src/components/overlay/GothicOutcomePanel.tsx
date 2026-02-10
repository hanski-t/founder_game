import { useEffect } from 'react';

interface GothicOutcomePanelProps {
  outcomeText: string;
  onContinue: () => void;
}

export function GothicOutcomePanel({ outcomeText, onContinue }: GothicOutcomePanelProps) {
  // Enter key to continue
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onContinue]);
  return (
    <div className="gothic-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="gothic-panel">
        <div className="gothic-panel-title">
          Outcome
        </div>

        <div className="gothic-panel-description">
          {outcomeText}
        </div>

        <div
          className="gothic-choice-card"
          onClick={onContinue}
          style={{ textAlign: 'center' }}
        >
          <div className="gothic-choice-text" style={{
            fontFamily: 'var(--font-gothic)',
            color: 'var(--color-gothic-gold)',
          }}>
            Continue your journey... <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>[Enter]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
