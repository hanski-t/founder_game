import { useEffect } from 'react';

interface PickupAnimationProps {
  x: number;
  groundY: number;
  label: string;
  flavorText?: string;
  onComplete: () => void;
}

export function PickupAnimation({ x, groundY, label, flavorText, onComplete }: PickupAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      {/* Resource/label text floating up */}
      <div
        className="pickup-text"
        style={{
          left: `${x}%`,
          top: `${groundY - 5}%`,
        }}
      >
        {label}
      </div>

      {/* Optional flavor text below */}
      {flavorText && (
        <div
          className="pickup-flavor"
          style={{
            left: `${x}%`,
            top: `${groundY - 1}%`,
          }}
        >
          {flavorText}
        </div>
      )}
    </>
  );
}
