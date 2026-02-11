import { useEffect, useState } from 'react';
import type { GamePhase } from '../../types/game';
import { PHASE_ATMOSPHERE } from '../../data/phaseConfig';

interface PhaseTitleProps {
  title: string;
  phase: GamePhase;
  onComplete: () => void;
}

export function PhaseTitle({ title, phase, onComplete }: PhaseTitleProps) {
  const [opacity, setOpacity] = useState(0);
  const phaseConfig = PHASE_ATMOSPHERE[phase];

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => setOpacity(1), 50);
    // Hold then fade out
    const fadeOutTimer = setTimeout(() => setOpacity(0), 2000);
    // Complete
    const completeTimer = setTimeout(onComplete, 2500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="phase-title-card"
      style={{
        opacity,
        transition: 'opacity 0.5s ease',
        background: `radial-gradient(ellipse at center, rgba(${phaseConfig.accentColorRgb}, 0.06) 0%, var(--color-gothic-bg) 70%)`,
      }}
    >
      <div className="phase-title-text" style={{ color: phaseConfig.accentColor, textShadow: `0 0 30px rgba(${phaseConfig.accentColorRgb}, 0.4)` }}>
        {title}
      </div>
      <div style={{
        color: 'var(--color-gothic-text)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        marginTop: 16,
        opacity: 0.5,
      }}>
        {phaseConfig.titleSubtext}
      </div>
    </div>
  );
}
