import { useEffect, useState } from 'react';

interface PhaseTitleProps {
  title: string;
  onComplete: () => void;
}

export function PhaseTitle({ title, onComplete }: PhaseTitleProps) {
  const [opacity, setOpacity] = useState(0);

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
    <div className="phase-title-card" style={{ opacity, transition: 'opacity 0.5s ease' }}>
      <div className="phase-title-text">{title}</div>
      <div style={{
        color: 'var(--color-gothic-text)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        marginTop: 16,
        opacity: 0.5,
      }}>
        A new chapter begins...
      </div>
    </div>
  );
}
