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
}

const CATCH_RANGE_X = 8;
const GROUND_Y = 78;

export function FallingCatchChallenge({ config, onComplete }: FallingCatchChallengeProps) {
  const { varietyDispatch } = useVariety();
  const { sceneState } = useScene();
  const [items, setItems] = useState<FallingItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.duration);

  // Refs to avoid stale closures in RAF
  const playerXRef = useRef(sceneState.playerX);
  const nextIdRef = useRef(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const varietyDispatchRef = useRef(varietyDispatch);

  // Keep refs current
  playerXRef.current = sceneState.playerX;
  onCompleteRef.current = onComplete;
  varietyDispatchRef.current = varietyDispatch;

  // Single RAF loop — no useCallback dependency issues
  useEffect(() => {
    startTimeRef.current = Date.now();
    lastSpawnRef.current = Date.now();
    completedRef.current = false;

    const fallPerMs = GROUND_Y / config.fallDuration;

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

      // Spawn
      if (now - lastSpawnRef.current > config.spawnInterval) {
        lastSpawnRef.current = now;
        const isGood = Math.random() < 0.6;
        const pool = isGood ? config.goodItems : config.badItems;
        const item = pool[Math.floor(Math.random() * pool.length)];

        // Track total good items spawned as the possible score
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
        }]);
      }

      // Update positions & check catches
      const dt = 16;
      setItems(prev => {
        const px = playerXRef.current;
        const updated = prev.map(item => {
          if (item.caught) return item;
          const newY = item.y + fallPerMs * dt;

          if (newY >= GROUND_Y - 5 && Math.abs(item.x - px) < CATCH_RANGE_X) {
            if (item.isGood) {
              varietyDispatchRef.current({ type: 'INCREMENT_SCORE' });
            } else {
              varietyDispatchRef.current({ type: 'DECREMENT_SCORE' });
            }
            return { ...item, y: newY, caught: true };
          }

          return { ...item, y: newY };
        });

        return updated.filter(i => i.y < GROUND_Y + 10 && !i.caught);
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [config]); // Only re-run if config changes (it won't)

  const timerPercent = (timeLeft / config.duration) * 100;

  return (
    <div className="challenge-overlay">
      <div className="challenge-hud">
        <div className="challenge-title">Catch the good items!</div>
        <div className="challenge-timer-bar">
          <div className="challenge-timer-fill" style={{ width: `${timerPercent}%` }} />
        </div>
      </div>

      {items.map(item => (
        <div
          key={item.id}
          className="falling-item"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: 'translateX(-50%)',
            opacity: item.caught ? 0 : 1,
            color: item.isGood ? 'var(--color-gothic-positive)' : 'var(--color-gothic-negative)',
          }}
        >
          {item.visual}
        </div>
      ))}
    </div>
  );
}
