interface GothicOutcomePanelProps {
  outcomeText: string;
  onContinue: () => void;
}

export function GothicOutcomePanel({ outcomeText, onContinue }: GothicOutcomePanelProps) {
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
            Continue your journey...
          </div>
        </div>
      </div>
    </div>
  );
}
