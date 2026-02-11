import { useEffect, useRef } from 'react';
import { useScene } from '../../context/SceneContext';
import { checkPlayerCollision } from '../../utils/collision';
import type { ObstacleDefinition } from '../../types/platformer';

import barrelImg from '@assets/objects/obstacles/barrel.png';
import crateImg from '@assets/objects/obstacles/crate.png';
import stoneImg from '@assets/objects/obstacles/stone.png';
import bushImg from '@assets/objects/obstacles/bush.png';
import graveImg from '@assets/objects/obstacles/grave.png';

// Map obstacle types to sprite images and display sizes (px)
const OBSTACLE_SPRITES: Record<string, { src: string; displayW: number; displayH: number }> = {
  barrel: { src: barrelImg, displayW: 24 * 2, displayH: 30 * 2 },
  crate: { src: crateImg, displayW: 39 * 2, displayH: 35 * 2 },
  rock: { src: stoneImg, displayW: 27 * 2, displayH: 39 * 2 },
  bush: { src: bushImg, displayW: 76 * 1.2, displayH: 65 * 1.2 },
  grave: { src: graveImg, displayW: 63 * 1.2, displayH: 75 * 1.2 },
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
      {obstacles.map((obs) => {
        const sprite = OBSTACLE_SPRITES[obs.type];
        return (
          <div
            key={obs.id}
            className="obstacle"
            style={{
              position: 'absolute',
              left: `${obs.x}%`,
              top: `${groundY}%`,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 4,
              userSelect: 'none',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          >
            {sprite ? (
              <img
                src={sprite.src}
                alt={obs.type}
                style={{
                  width: sprite.displayW,
                  height: sprite.displayH,
                  imageRendering: 'pixelated',
                }}
                draggable={false}
              />
            ) : (
              <span style={{ fontSize: '2rem' }}>?</span>
            )}
          </div>
        );
      })}
    </>
  );
}
