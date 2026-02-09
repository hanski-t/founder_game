import { useCallback } from 'react';
import type { ChallengeDefinition } from '../../types/variety';
import { useVariety } from '../../context/VarietyContext';
import { QuickTimeChallenge } from './QuickTimeChallenge';
import { FallingCatchChallenge } from './FallingCatchChallenge';

interface ChallengeOverlayProps {
  challenge: ChallengeDefinition;
}

export function ChallengeOverlay({ challenge }: ChallengeOverlayProps) {
  const { varietyState, setChallengePhase, completeChallenge } = useVariety();
  const { challengePhase, challengeScore } = varietyState;

  const handleStart = useCallback(() => {
    setChallengePhase('active');
  }, [setChallengePhase]);

  const handleComplete = useCallback(() => {
    setChallengePhase('result');
  }, [setChallengePhase]);

  const handleDismiss = useCallback(() => {
    completeChallenge(challenge.id);
  }, [completeChallenge, challenge.id]);

  const succeeded = challengeScore >= challenge.successThreshold;

  // Intro screen
  if (challengePhase === 'intro') {
    return (
      <div className="challenge-intro" onClick={handleStart}>
        <div style={{
          background: 'linear-gradient(180deg, #1a0f10 0%, #120a0b 100%)',
          border: '2px solid var(--color-gothic-border)',
          borderRadius: 8,
          padding: '32px 48px',
          textAlign: 'center',
          maxWidth: 400,
          boxShadow: '0 0 40px rgba(90, 48, 48, 0.4)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-gothic)',
            color: 'var(--color-gothic-gold)',
            fontSize: '1.4rem',
            marginBottom: 12,
            textShadow: '0 0 15px rgba(212, 168, 83, 0.3)',
          }}>
            {challenge.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gothic-text)',
            fontSize: '0.85rem',
            marginBottom: 20,
            lineHeight: 1.6,
          }}>
            {challenge.description}
          </p>
          <div style={{
            fontFamily: 'var(--font-gothic)',
            color: 'var(--color-gothic-gold)',
            fontSize: '0.9rem',
            opacity: 0.7,
            animation: 'collectible-bob 2s ease-in-out infinite',
          }}>
            Click to begin
          </div>
        </div>
      </div>
    );
  }

  // Active challenge
  if (challengePhase === 'active') {
    if (challenge.type === 'quick-time' && challenge.quickTimeConfig) {
      return (
        <QuickTimeChallenge
          config={challenge.quickTimeConfig}
          onComplete={handleComplete}
        />
      );
    }
    if (challenge.type === 'falling-catch' && challenge.fallingCatchConfig) {
      return (
        <FallingCatchChallenge
          config={challenge.fallingCatchConfig}
          onComplete={handleComplete}
        />
      );
    }
  }

  // Result screen
  if (challengePhase === 'result') {
    return (
      <div className="challenge-result" onClick={handleDismiss}>
        <div style={{
          background: 'linear-gradient(180deg, #1a0f10 0%, #120a0b 100%)',
          border: `2px solid ${succeeded ? 'var(--color-gothic-positive)' : 'var(--color-gothic-border)'}`,
          borderRadius: 8,
          padding: '32px 48px',
          textAlign: 'center',
          maxWidth: 400,
          boxShadow: `0 0 40px ${succeeded ? 'rgba(74, 222, 128, 0.3)' : 'rgba(90, 48, 48, 0.4)'}`,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-gothic)',
            color: succeeded ? 'var(--color-gothic-positive)' : 'var(--color-gothic-gold)',
            fontSize: '1.4rem',
            marginBottom: 12,
          }}>
            {succeeded ? 'Well Done!' : 'Nice Try!'}
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gothic-text)',
            fontSize: '0.85rem',
            marginBottom: 8,
          }}>
            Score: {challengeScore} / {challenge.successThreshold}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gothic-text)',
            fontSize: '0.8rem',
            opacity: 0.7,
            marginBottom: 20,
          }}>
            {succeeded
              ? 'You proved your mettle. Onward!'
              : 'The journey continues regardless.'}
          </p>
          <div style={{
            fontFamily: 'var(--font-gothic)',
            color: 'var(--color-gothic-gold)',
            fontSize: '0.9rem',
            opacity: 0.7,
          }}>
            Click to continue
          </div>
        </div>
      </div>
    );
  }

  return null;
}
