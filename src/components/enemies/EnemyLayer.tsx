import { useEffect, useRef, useState } from 'react';
import { useScene } from '../../context/SceneContext';
import { useVariety } from '../../context/VarietyContext';
import { usePhaseConfig } from '../../hooks/usePhaseConfig';
import { checkPlayerCollision } from '../../utils/collision';
import { SpriteAnimator } from '../character/SpriteAnimator';
import type { EnemyDefinition } from '../../types/platformer';

import ghostSheet from '@assets/characters/enemies/ghost-spritesheet.png';
import skeletonImg from '@assets/characters/enemies/skeleton.png';
import batSheet from '@assets/characters/enemies/bat.png';
import thornBushImg from '@assets/objects/obstacles/bush.png';

const ENEMY_SPRITE_CONFIG: Record<string, { sheet: string; config: { frameWidth: number; frameHeight: number; frameCount: number; frameDuration: number }; scale?: number }> = {
  ghost: { sheet: ghostSheet, config: { frameWidth: 31, frameHeight: 44, frameCount: 4, frameDuration: 150 } },
  bat: { sheet: batSheet, config: { frameWidth: 12, frameHeight: 16, frameCount: 4, frameDuration: 120 }, scale: 3.5 },
};

const ENEMY_STATIC_IMG: Record<string, { src: string; width: number; height: number; scale: number }> = {
  skeleton: { src: skeletonImg, width: 44, height: 52, scale: 2 },
  'thorn-bush': { src: thornBushImg, width: 76, height: 65, scale: 2 },
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
  const phaseConfig = usePhaseConfig();
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
  const enemySpeedMultRef = useRef(phaseConfig.enemySpeedMultiplier);
  enemySpeedMultRef.current = phaseConfig.enemySpeedMultiplier;
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
        const speed = def.speed * delta * enemySpeedMultRef.current;
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
        const isStatic = def.type === 'thorn-bush';
        const isFlying = !isStatic && def.y < groundY - 3;
        const spriteData = ENEMY_SPRITE_CONFIG[def.type];
        const staticImg = ENEMY_STATIC_IMG[def.type];

        // Static enemies (thorn-bush) use percentage-based sizing like obstacles
        if (isStatic) {
          return (
            <div
              key={def.id}
              className="enemy"
              style={{
                position: 'absolute',
                left: `${def.patrolStart}%`,
                top: `${def.y}%`,
                width: `${def.width}%`,
                height: `${def.height}%`,
                transform: 'translateX(-50%) translateY(-100%)',
                zIndex: 5,
                userSelect: 'none',
              }}
            >
              {staticImg && (
                <img
                  src={staticImg.src}
                  alt={def.type}
                  style={{
                    width: '100%',
                    height: '100%',
                    imageRendering: 'pixelated',
                    filter: 'drop-shadow(0 0 6px rgba(200,50,50,0.7)) brightness(1.2) hue-rotate(-30deg)',
                  }}
                  draggable={false}
                />
              )}
            </div>
          );
        }

        return (
          <div
            key={def.id}
            className={`enemy${isFlying ? ' enemy-flying' : ''}`}
            style={{
              position: 'absolute',
              left: `${state.x}%`,
              top: `${def.y}%`,
              transform: `translateX(-50%) translateY(-100%)${state.direction === 'right' ? ' scaleX(-1)' : ''}`,
              zIndex: 5,
              userSelect: 'none',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
            }}
          >
            {spriteData ? (
              <SpriteAnimator
                sheet={spriteData.sheet}
                config={spriteData.config}
                scale={spriteData.scale ?? 2}
              />
            ) : staticImg ? (
              <img
                src={staticImg.src}
                alt={def.type}
                style={{
                  width: staticImg.width * staticImg.scale,
                  height: staticImg.height * staticImg.scale,
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
