import { useEffect, useRef, useState } from 'react';
import { useScene } from '../../context/SceneContext';
import { checkPlayerCollision } from '../../utils/collision';
import type { EnemyDefinition } from '../../types/platformer';

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

        // Check collision with player (only if not already in knockback)
        if (!sceneState.knockbackActive && !hasCollision) {
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

        return (
          <div
            key={def.id}
            className={`enemy${isFlying ? ' enemy-flying' : ''}`}
            style={{
              position: 'absolute',
              left: `${state.x}%`,
              top: `${def.y}%`,
              transform: `translateX(-50%) translateY(-100%) ${state.direction === 'left' ? 'scaleX(-1)' : ''}`,
              fontSize: `${Math.max(def.height * 0.5, 1.8)}rem`,
              zIndex: 5,
              userSelect: 'none',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
              transition: 'left 0.05s linear',
            }}
          >
            {def.visual}
          </div>
        );
      })}
    </>
  );
}
