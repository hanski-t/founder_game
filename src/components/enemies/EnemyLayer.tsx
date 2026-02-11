import { useEffect, useRef, useState } from 'react';
import { useScene } from '../../context/SceneContext';
import { useVariety } from '../../context/VarietyContext';
import { checkPlayerCollision } from '../../utils/collision';
import { SpriteAnimator } from '../character/SpriteAnimator';
import type { EnemyDefinition } from '../../types/platformer';

import ghostSheet from '@assets/characters/enemies/ghost-spritesheet.png';
import skeletonImg from '@assets/characters/enemies/skeleton.png';

const ENEMY_SPRITE_CONFIG: Record<string, { sheet: string; config: { frameWidth: number; frameHeight: number; frameCount: number; frameDuration: number } }> = {
  ghost: { sheet: ghostSheet, config: { frameWidth: 31, frameHeight: 44, frameCount: 4, frameDuration: 150 } },
};

const ENEMY_STATIC_IMG: Record<string, string> = {
  skeleton: skeletonImg,
};

interface EnemyState {
  x: number;
  direction: 'left' | 'right';
}

interface EnemyLayerProps {
  enemies: EnemyDefinition[];
  groundY: number;
  onCollision: (direction: 'left' | 'right') => void;
}

export function EnemyLayer({ enemies, groundY, onCollision }: EnemyLayerProps) {
  const { sceneState } = useScene();
  const { varietyState } = useVariety();
  const challengeActive = varietyState.challengePhase !== 'not-started';

  // Track each enemy's position and direction
  const [enemyStates, setEnemyStates] = useState<EnemyState[]>(() =>
    enemies.map((e) => ({
      x: e.patrolStart,
      direction: 'right' as const,
    }))
  );

  // Refs for RAF loop
  const enemyStatesRef = useRef(enemyStates);
  enemyStatesRef.current = enemyStates;
  const playerXRef = useRef(sceneState.playerX);
  const playerYRef = useRef(sceneState.playerY);
  playerXRef.current = sceneState.playerX;
  playerYRef.current = sceneState.playerY;
  const challengeActiveRef = useRef(challengeActive);
  challengeActiveRef.current = challengeActive;
  const animFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastCollisionRef = useRef<string | null>(null);

  // Reset enemy states when enemies array changes (scene change)
  useEffect(() => {
    setEnemyStates(enemies.map((e) => ({
      x: e.patrolStart,
      direction: 'right' as const,
    })));
  }, [enemies]);

  // Patrol movement RAF loop
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    lastTimeRef.current = 0;

    const update = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(update);
        return;
      }

      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      const currentStates = enemyStatesRef.current;
      let hasCollision = false;
      let collisionDir: 'left' | 'right' = 'left';
      let collisionId: string | null = null;

      const newStates = currentStates.map((state, i) => {
        const def = enemies[i];
        if (!def) return state;

        // Move enemy
        const speed = def.speed * delta;
        let newX = state.x + (state.direction === 'right' ? speed : -speed);
        let newDir = state.direction;

        // Reverse at patrol bounds
        if (newX >= def.patrolEnd) {
          newX = def.patrolEnd;
          newDir = 'left';
        } else if (newX <= def.patrolStart) {
          newX = def.patrolStart;
          newDir = 'right';
        }

        // Check collision with player (skip during knockback or active challenge)
        if (!sceneState.knockbackActive && !challengeActiveRef.current && !hasCollision) {
          const hit = checkPlayerCollision(
            playerXRef.current,
            playerYRef.current,
            newX,
            def.y,
            def.width,
            def.height,
          );

          if (hit && lastCollisionRef.current !== def.id) {
            hasCollision = true;
            collisionId = def.id;
            collisionDir = playerXRef.current < newX ? 'left' : 'right';
          }
        }

        return { x: newX, direction: newDir };
      });

      setEnemyStates(newStates);

      if (hasCollision && collisionId) {
        lastCollisionRef.current = collisionId;
        onCollision(collisionDir);
        // Clear collision ID after invincibility window
        setTimeout(() => {
          lastCollisionRef.current = null;
        }, 600);
      } else if (!hasCollision) {
        // Check if player has moved away from last collided enemy
        if (lastCollisionRef.current) {
          const lastIdx = enemies.findIndex(e => e.id === lastCollisionRef.current);
          if (lastIdx >= 0) {
            const dist = Math.abs(playerXRef.current - newStates[lastIdx].x);
            if (dist > enemies[lastIdx].width + 3) {
              lastCollisionRef.current = null;
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enemies, groundY, onCollision, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, sceneState.knockbackActive]);

  return (
    <>
      {enemies.map((def, i) => {
        const state = enemyStates[i];
        if (!state) return null;
        const isFlying = def.y < groundY - 3;
        const spriteData = ENEMY_SPRITE_CONFIG[def.type];
        const staticImg = ENEMY_STATIC_IMG[def.type];

        return (
          <div
            key={def.id}
            className={`enemy${isFlying ? ' enemy-flying' : ''}`}
            style={{
              position: 'absolute',
              left: `${state.x}%`,
              top: `${def.y}%`,
              transform: `translateX(-50%) translateY(-100%) ${state.direction === 'left' ? 'scaleX(-1)' : ''}`,
              zIndex: 5,
              userSelect: 'none',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
            }}
          >
            {spriteData ? (
              <SpriteAnimator
                sheet={spriteData.sheet}
                config={spriteData.config}
                scale={2}
              />
            ) : staticImg ? (
              <img
                src={staticImg}
                alt={def.type}
                style={{
                  width: 44 * 2,
                  height: 52 * 2,
                  imageRendering: 'pixelated',
                }}
                draggable={false}
              />
            ) : (
              <span style={{ fontSize: `${Math.max(def.height * 0.5, 1.8)}rem` }}>
                {def.visual}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}
