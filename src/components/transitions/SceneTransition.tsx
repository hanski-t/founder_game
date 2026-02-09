import { useEffect, useState } from 'react';

interface SceneTransitionProps {
  isActive: boolean;
  onMidpoint: () => void;
  onComplete: () => void;
}

export function SceneTransition({ isActive, onMidpoint, onComplete }: SceneTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'fade-in' | 'hold' | 'fade-out'>('idle');

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('fade-in');
    }
  }, [isActive, phase]);

  useEffect(() => {
    if (phase === 'fade-in') {
      const timer = setTimeout(() => {
        onMidpoint();
        setPhase('hold');
      }, 350);
      return () => clearTimeout(timer);
    }
    if (phase === 'hold') {
      const timer = setTimeout(() => {
        setPhase('fade-out');
      }, 200);
      return () => clearTimeout(timer);
    }
    if (phase === 'fade-out') {
      const timer = setTimeout(() => {
        setPhase('idle');
        onComplete();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [phase, onMidpoint, onComplete]);

  if (phase === 'idle') return null;

  let opacity = 0;
  if (phase === 'fade-in') opacity = 1;
  if (phase === 'hold') opacity = 1;
  if (phase === 'fade-out') opacity = 0;

  return (
    <div
      className="scene-transition-overlay"
      style={{
        opacity,
        transition: `opacity ${phase === 'hold' ? '0' : '350'}ms ease`,
      }}
    />
  );
}
