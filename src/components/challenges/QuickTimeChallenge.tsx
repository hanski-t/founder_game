import { useState, useEffect, useCallback, useRef } from 'react';
import type { QuickTimeConfig } from '../../types/variety';
import { useVariety } from '../../context/VarietyContext';

interface QuickTimeChallengeProps {
  config: QuickTimeConfig;
  onComplete: () => void;
}

type PromptStatus = 'waiting' | 'success' | 'fail';

export function QuickTimeChallenge({ config, onComplete }: QuickTimeChallengeProps) {
  const { varietyDispatch } = useVariety();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promptStatus, setPromptStatus] = useState<PromptStatus>('waiting');
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);

  // Set total possible score = number of prompts
  useEffect(() => {
    varietyDispatch({ type: 'SET_CHALLENGE_TOTAL', total: config.prompts.length });
  }, [config.prompts.length, varietyDispatch]);

  const currentPrompt = config.prompts[currentIndex];
  const isLastPrompt = currentIndex >= config.prompts.length - 1;

  const advanceOrComplete = useCallback(() => {
    if (completedRef.current) return;

    if (isLastPrompt) {
      completedRef.current = true;
      setTimeout(onComplete, 600);
    } else {
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setPromptStatus('waiting');
        setShowFeedback(false);
      }, 600);
    }
  }, [isLastPrompt, onComplete]);

  // Timer for current prompt — miss if not pressed in time
  useEffect(() => {
    if (promptStatus !== 'waiting') return;

    timerRef.current = setTimeout(() => {
      setPromptStatus('fail');
      setShowFeedback(true);
      advanceOrComplete();
    }, config.timePerPrompt);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, promptStatus, config.timePerPrompt, advanceOrComplete]);

  // Keyboard listener
  useEffect(() => {
    if (promptStatus !== 'waiting') return;

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (timerRef.current) clearTimeout(timerRef.current);

      const pressedKey = e.key.toLowerCase();
      const expectedKey = currentPrompt.key.toLowerCase();

      if (pressedKey === expectedKey) {
        varietyDispatch({ type: 'INCREMENT_SCORE' });
        setPromptStatus('success');
      } else {
        setPromptStatus('fail');
      }
      setShowFeedback(true);
      advanceOrComplete();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, promptStatus, currentPrompt, varietyDispatch, advanceOrComplete]);

  if (!currentPrompt) return null;

  return (
    <div className="challenge-overlay">
      {/* HUD */}
      <div className="challenge-hud">
        <div className="challenge-title">
          Press the Key!
        </div>
        <div className="challenge-score">
          {currentIndex + 1} / {config.prompts.length}
        </div>
      </div>

      {/* Key prompt */}
      <div className="qte-prompt">
        <div className={`qte-key ${showFeedback ? promptStatus : ''}`}>
          {currentPrompt.displayKey}
        </div>
        {promptStatus === 'waiting' && (
          <div
            className="qte-ring"
            style={{ '--qte-duration': `${config.timePerPrompt}ms` } as React.CSSProperties}
            key={currentIndex}
          />
        )}
      </div>
    </div>
  );
}
