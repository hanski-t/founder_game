import { useState, useEffect, useRef } from 'react';
import type { FallingCatchConfig } from '../../types/variety';
import { useVariety } from '../../context/VarietyContext';
import { useScene } from '../../context/SceneContext';

interface FallingCatchChallengeProps {
  config: FallingCatchConfig;
  onComplete: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  isGood: boolean;
  visual: string;
  label: string;
  caught: boolean;
  caughtAt: number; // timestamp when caught (0 = not caught)
}

interface FeedbackEvent {
  id: number;
  x: number;
  y: number;
  type: 'good' | 'bad' | 'miss';
  text: string;
  createdAt: number;
}

const CATCH_RANGE_X = 8;
const GROUND_Y = 78;
const FEEDBACK_DURATION = 800;
const CATCH_POP_DURATION = 350;

export function FallingCatchChallenge({ config, onComplete }: FallingCatchChallengeProps) {
  const { varietyDispatch } = useVariety();
  const { sceneState } = useScene();
  const [items, setItems] = useState<FallingItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackEvent[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Refs to avoid stale closures in RAF
  const playerXRef = useRef(sceneState.playerX);
  const nextIdRef = useRef(0);
  const feedbackIdRef = useRef(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const varietyDispatchRef = useRef(varietyDispatch);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);

  // Keep refs current
  playerXRef.current = sceneState.playerX;
  onCompleteRef.current = onComplete;
  varietyDispatchRef.current = varietyDispatch;

  // Helper to push a feedback event
  const pushFeedback = (x: number, y: number, type: FeedbackEvent['type'], text: string) => {
    const fb: FeedbackEvent = {
      id: feedbackIdRef.current++,
      x, y, type, text,
      createdAt: Date.now(),
    };
    setFeedbacks(prev => [...prev, fb]);
  };

  // Clean up expired feedbacks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFeedbacks(prev => prev.filter(f => now - f.createdAt < FEEDBACK_DURATION));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Single RAF loop
  useEffect(() => {
    startTimeRef.current = Date.now();
    lastSpawnRef.current = Date.now();
    completedRef.current = false;
    scoreRef.current = 0;
    streakRef.current = 0;

    const baseFallPerMs = GROUND_Y / config.fallDuration;

    function loop() {
      if (completedRef.current) return;

      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, config.duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        completedRef.current = true;
        onCompleteRef.current();
        return;
      }

      // Difficulty ramp: spawn interval decreases over time (down to 60% of original)
      const progress = elapsed / config.duration; // 0 → 1
      const rampFactor = 1 - progress * 0.4; // 1.0 → 0.6
      const currentSpawnInterval = config.spawnInterval * Math.max(0.6, rampFactor);

      // Fall speed also ramps slightly (up to 1.3x)
      const fallSpeedMultiplier = 1 + progress * 0.3;
      const fallPerMs = baseFallPerMs * fallSpeedMultiplier;

      // Spawn
      if (now - lastSpawnRef.current > currentSpawnInterval) {
        lastSpawnRef.current = now;
        const isGood = Math.random() < 0.6;
        const pool = isGood ? config.goodItems : config.badItems;
        const item = pool[Math.floor(Math.random() * pool.length)];

        // Track total good items spawned as possible score
        if (isGood) {
          varietyDispatchRef.current({ type: 'INCREMENT_TOTAL' });
        }

        setItems(prev => [...prev, {
          id: nextIdRef.current++,
          x: 10 + Math.random() * 80,
          y: 0,
          isGood,
          visual: item.visual,
          label: item.label,
          caught: false,
          caughtAt: 0,
        }]);
      }

      // Update positions & check catches
      const dt = 16;
      setItems(prev => {
        const px = playerXRef.current;
        const updated = prev.map(item => {
          if (item.caught) return item;
          const newY = item.y + fallPerMs * dt;

          // Check catch
          if (newY >= GROUND_Y - 5 && Math.abs(item.x - px) < CATCH_RANGE_X) {
            if (item.isGood) {
              varietyDispatchRef.current({ type: 'INCREMENT_SCORE' });
              scoreRef.current += 1;
              streakRef.current += 1;
              setScore(scoreRef.current);
              setStreak(streakRef.current);
              const streakText = streakRef.current >= 3 ? ` x${streakRef.current}!` : '';
              pushFeedback(item.x, newY, 'good', `+1${streakText}`);
            } else {
              varietyDispatchRef.current({ type: 'DECREMENT_SCORE' });
              scoreRef.current = Math.max(0, scoreRef.current - 1);
              streakRef.current = 0;
              setScore(scoreRef.current);
              setStreak(0);
              pushFeedback(item.x, newY, 'bad', '-1');
            }
            return { ...item, y: newY, caught: true, caughtAt: now };
          }

          // Check miss (good item fell past ground without being caught)
          if (newY > GROUND_Y + 2 && item.isGood) {
            streakRef.current = 0;
            setStreak(0);
            pushFeedback(item.x, GROUND_Y - 5, 'miss', 'Missed!');
            return { ...item, y: newY, caught: true, caughtAt: now }; // mark as caught to trigger removal
          }

          return { ...item, y: newY };
        });

        // Remove items that are caught (after pop animation) or fell way off screen
        return updated.filter(i => {
          if (i.caught && i.caughtAt > 0) {
            return now - i.caughtAt < CATCH_POP_DURATION;
          }
          return i.y < GROUND_Y + 15;
        });
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [config]); // Only re-run if config changes (it won't)

  const timerPercent = (timeLeft / config.duration) * 100;

  return (
    <div className="challenge-overlay challenge-falling-active">
      {/* HUD */}
      <div className="challenge-hud">
        <div className="challenge-title">Catch the good items!</div>
        <div className="challenge-legend">
          <span className="legend-good">&#x1F7E2; Catch</span>
          <span className="legend-bad">&#x1F534; Avoid</span>
        </div>
        <div className="challenge-timer-bar">
          <div className="challenge-timer-fill" style={{ width: `${timerPercent}%` }} />
        </div>
        <div className="challenge-score">
          Score: {score}
          {streak >= 2 && (
            <span className="streak-counter" key={streak}>
              {' '}{streak}x Streak!
            </span>
          )}
        </div>
      </div>

      {/* Catch zone indicator */}
      <div
        className="catch-zone-indicator"
        style={{ left: 0, right: 0, top: `${GROUND_Y}%` }}
      />

      {/* Falling items */}
      {items.map(item => {
        const caughtClass = item.caught
          ? (item.isGood ? 'caught-good' : 'caught-bad')
          : '';

        return (
          <div
            key={item.id}
            className={`falling-item ${caughtClass} ${item.isGood ? 'falling-good' : 'falling-bad'}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: item.caught ? undefined : 'translateX(-50%)',
            }}
          >
            <span className="falling-item-emoji">{item.visual}</span>
            <span className="falling-item-label">{item.label}</span>
          </div>
        );
      })}

      {/* Feedback popups (+1, -1, Missed!) */}
      {feedbacks.map(fb => (
        <div
          key={fb.id}
          className={`catch-feedback ${fb.type}`}
          style={{
            left: `${fb.x}%`,
            top: `${fb.y}%`,
          }}
        >
          {fb.text}
        </div>
      ))}
    </div>
  );
}
