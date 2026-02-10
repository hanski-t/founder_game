import { useEffect, useRef } from 'react';
import { useScene } from '../../context/SceneContext';
import { checkPlayerCollision } from '../../utils/collision';
import type { ObstacleDefinition } from '../../types/platformer';

const OBSTACLE_EMOJI: Record<string, string> = {
  rock: '\u{1FAA8}',    // 🪨
  crate: '\u{1F4E6}',   // 📦
  grave: '\u{1FAA6}',   // 🪦
  bush: '\u{1F33F}',    // 🌿
  barrel: '\u{1F6E2}',  // 🛢️
};

interface ObstacleLayerProps {
  obstacles: ObstacleDefinition[];
  groundY: number;
  onCollision: (direction: 'left' | 'right') => void;
}

export function ObstacleLayer({ obstacles, groundY, onCollision }: ObstacleLayerProps) {
  const { sceneState } = useScene();
  const lastCollisionRef = useRef<string | null>(null);

  // Collision detection
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;
    if (sceneState.knockbackActive) return; // don't re-trigger during knockback

    for (const obs of obstacles) {
      const obstacleY = groundY; // obstacles sit on the ground
      const hit = checkPlayerCollision(
        sceneState.playerX,
        sceneState.playerY,
        obs.x,
        obstacleY,
        obs.width,
        obs.height,
      );

      if (hit) {
        // Only trigger if this is a new collision (not the same obstacle we just hit)
        if (lastCollisionRef.current === obs.id) continue;
        lastCollisionRef.current = obs.id;

        // Push player away from obstacle
        const direction = sceneState.playerX < obs.x ? 'left' : 'right';
        onCollision(direction);
        return;
      }
    }

    // Clear last collision when no longer touching any obstacle
    lastCollisionRef.current = null;
  }, [sceneState.playerX, sceneState.playerY, sceneState.knockbackActive, obstacles, groundY, onCollision, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning]);

  return (
    <>
      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className="obstacle"
          style={{
            position: 'absolute',
            left: `${obs.x}%`,
            top: `${groundY}%`,
            transform: 'translateX(-50%) translateY(-100%)',
            fontSize: `${Math.max(obs.height * 0.5, 1.5)}rem`,
            zIndex: 4,
            userSelect: 'none',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        >
          {OBSTACLE_EMOJI[obs.type] || OBSTACLE_EMOJI.rock}
        </div>
      ))}
    </>
  );
}
