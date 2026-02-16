import { useEffect, useRef } from 'react';

interface PickupAnimationProps {
  x: number;
  y: number;
  label: string;
  flavorText?: string;
  onComplete: () => void;
}

export function PickupAnimation({ x, y, label, flavorText, onComplete }: PickupAnimationProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Fire once on mount — useRef avoids resetting the timer on every render
  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current(), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Resource/label text floating up above the collectible */}
      <div
        className="pickup-text"
        style={{
          left: `${x}%`,
          top: `${y - 8}%`,
        }}
      >
        {label}
      </div>

      {/* Optional flavor text below the label */}
      {flavorText && (
        <div
          className="pickup-flavor"
          style={{
            left: `${x}%`,
            top: `${y - 4}%`,
          }}
        >
          {flavorText}
        </div>
      )}
    </>
  );
}
