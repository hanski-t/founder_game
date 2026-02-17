import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ChallengeDefinition } from '../../types/variety';
import { useVariety } from '../../context/VarietyContext';
import { useScene } from '../../context/SceneContext';
import { useGame } from '../../context/GameContext';
import { QuickTimeChallenge } from './QuickTimeChallenge';
import { FallingCatchChallenge } from './FallingCatchChallenge';
import { soundManager } from '../../audio/SoundManager';

interface ChallengeOverlayProps {
  challenge: ChallengeDefinition;
}

/** Calculate money reward/penalty based on challenge performance */
function getChallengeReward(score: number, total: number, threshold: number): number {
  if (total > 0 && score >= total) return 1000;   // Perfect
  if (score >= threshold) return 500;               // Success
  return -200;                                      // Failure
}

/** Unique result messages per challenge */
const RESULT_MESSAGES: Record<string, { perfect: string; success: string; fail: string }> = {
  'qte-social-gathering': {
    perfect: 'A masterful display of charm! They adore you.',
    success: 'You proved your mettle. Onward!',
    fail: 'An awkward start, but the journey continues.',
  },
  'falling-market-noise': {
    perfect: 'Every signal caught, every distraction dodged!',
    success: 'You cut through the noise like a pro.',
    fail: 'The market is unforgiving, but so are you.',
  },
  'qte-investor-pitch': {
    perfect: 'The investor is speechless. Legendary pitch!',
    success: 'A compelling pitch. The investor nods approvingly.',
    fail: 'Not every pitch lands, but persistence pays off.',
  },
};

const DEFAULT_MESSAGES = {
  perfect: 'Flawless performance! Maximum reward.',
  success: 'You proved your mettle. Onward!',
  fail: 'The journey continues regardless.',
};

function getResultMessage(challengeId: string, score: number, total: number, threshold: number): string {
  const msgs = RESULT_MESSAGES[challengeId] ?? DEFAULT_MESSAGES;
  if (total > 0 && score >= total) return msgs.perfect;
  if (score >= threshold) return msgs.success;
  return msgs.fail;
}

export function ChallengeOverlay({ challenge }: ChallengeOverlayProps) {
  const { varietyState, setChallengePhase, completeChallenge } = useVariety();
  const { sceneState, sceneDispatch } = useScene();
  const { dispatch: gameDispatch } = useGame();
  const { challengePhase, challengeScore, challengeTotal } = varietyState;
  const savedPlayerXRef = useRef(sceneState.playerX);

  // Calculate reward when result is shown (score is finalized)
  const reward = useMemo(
    () => getChallengeReward(challengeScore, challengeTotal, challenge.successThreshold),
    [challengeScore, challengeTotal, challenge.successThreshold],
  );

  const handleStart = useCallback(() => {
    savedPlayerXRef.current = sceneState.playerX;
    // Center player for the minigame
    sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: 50 });
    sceneDispatch({ type: 'SET_PLAYER_TARGET', x: 50 });
    setChallengePhase('active');
    soundManager.play('challengeStart');
  }, [setChallengePhase, sceneState.playerX, sceneDispatch]);

  const handleComplete = useCallback(() => {
    setChallengePhase('result');
  }, [setChallengePhase]);

  const handleDismiss = useCallback(() => {
    // Apply resource reward/penalty before completing
    gameDispatch({ type: 'APPLY_BONUS', resourceChanges: { money: reward } });
    // Restore player to pre-challenge position
    sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: savedPlayerXRef.current });
    sceneDispatch({ type: 'SET_PLAYER_TARGET', x: savedPlayerXRef.current });
    completeChallenge(challenge.id);
  }, [completeChallenge, challenge.id, sceneDispatch, gameDispatch, reward]);

  // Enter key for intro/result screens
  useEffect(() => {
    if (challengePhase !== 'intro' && challengePhase !== 'result') return;

    const handler = challengePhase === 'intro' ? handleStart : handleDismiss;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [challengePhase, handleStart, handleDismiss]);

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
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            {challenge.description}
          </p>
          <div style={{
            borderTop: '1px solid var(--color-gothic-border)',
            paddingTop: 20,
            fontFamily: 'var(--font-gothic)',
            color: 'var(--color-gothic-gold)',
            fontSize: '1.2rem',
            textShadow: '0 0 12px rgba(212, 168, 83, 0.4)',
            animation: 'text-bob 2s ease-in-out infinite',
          }}>
            Press Enter to begin
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
            {challengeTotal > 0 && challengeScore >= challengeTotal
              ? 'Perfect!'
              : succeeded ? 'Well Done!' : 'Nice Try!'}
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gothic-text)',
            fontSize: '0.85rem',
            marginBottom: 8,
          }}>
            Score: {challengeScore} / {challengeTotal}
          </p>
          <p style={{
            fontFamily: 'var(--font-gothic)',
            color: reward > 0 ? 'var(--color-gothic-positive)' : '#e57373',
            fontSize: '1.1rem',
            marginBottom: 8,
            textShadow: reward > 0
              ? '0 0 10px rgba(74, 222, 128, 0.4)'
              : '0 0 10px rgba(229, 115, 115, 0.4)',
          }}>
            {reward > 0 ? `+$${reward}` : `-$${Math.abs(reward)}`}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gothic-text)',
            fontSize: '0.8rem',
            opacity: 0.7,
          }}>
            {getResultMessage(challenge.id, challengeScore, challengeTotal, challenge.successThreshold)}
          </p>
          <div style={{
            borderTop: '1px solid var(--color-gothic-border)',
            marginTop: 20,
            paddingTop: 20,
            fontFamily: 'var(--font-gothic)',
            color: 'var(--color-gothic-gold)',
            fontSize: '1.2rem',
            textShadow: '0 0 12px rgba(212, 168, 83, 0.4)',
            animation: 'text-bob 2s ease-in-out infinite',
          }}>
            Press Enter to continue
          </div>
        </div>
      </div>
    );
  }

  return null;
}
