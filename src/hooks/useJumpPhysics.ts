import { useEffect, useRef, useCallback } from 'react';
import { useScene } from '../context/SceneContext';
import { useVariety } from '../context/VarietyContext';
import type { PlatformDefinition } from '../types/platformer';

// Physics constants (all in percentage units)
const GRAVITY = 120; // % per second squared
const JUMP_VELOCITY = -65; // % per second (negative = upward)
const KNOCKBACK_IMPULSE = 35; // % per second horizontal push (stronger for clear separation)
const KNOCKBACK_DECAY = 8; // exponential decay rate
const KNOCKBACK_THRESHOLD = 0.5; // stop knockback when velocity below this
const INVINCIBILITY_DURATION = 500; // ms after knockback before next hit
const KNOCKBACK_TELEPORT = 5; // % instant displacement to clear obstacle on hit

export function useJumpPhysics(groundY: number, platforms?: PlatformDefinition[]) {
  const { sceneState, sceneDispatch } = useScene();
  const { varietyState } = useVariety();

  // Refs to avoid stale closures in RAF loop
  const playerYRef = useRef(sceneState.playerY);
  const playerXRef = useRef(sceneState.playerX);
  const velocityYRef = useRef(0);
  const isGroundedRef = useRef(true);
  const knockbackVXRef = useRef(0);
  const invincibleUntilRef = useRef(0);
  const animFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const jumpRequestedRef = useRef(false);
  const challengeActiveRef = useRef(varietyState.challengePhase !== 'not-started');

  // Keep refs in sync with state
  playerYRef.current = sceneState.playerY;
  playerXRef.current = sceneState.playerX;
  isGroundedRef.current = sceneState.isGrounded;
  challengeActiveRef.current = varietyState.challengePhase !== 'not-started';

  // Jump input handler
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Freeze jumping during challenges
      if (challengeActiveRef.current) return;

      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        // Only jump when grounded
        if (isGroundedRef.current) {
          e.preventDefault();
          jumpRequestedRef.current = true;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning]);

  // Physics RAF loop
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    lastTimeRef.current = 0;

    const update = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(update);
        return;
      }

      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap at 50ms
      lastTimeRef.current = timestamp;

      let yChanged = false;
      let xChanged = false;

      // Handle jump request (blocked during challenges)
      if (jumpRequestedRef.current && isGroundedRef.current && !challengeActiveRef.current) {
        velocityYRef.current = JUMP_VELOCITY;
        isGroundedRef.current = false;
        sceneDispatch({ type: 'SET_GROUNDED', grounded: false });
        sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'jump' });
        jumpRequestedRef.current = false;
      }

      // Apply gravity when airborne
      if (!isGroundedRef.current) {
        velocityYRef.current += GRAVITY * delta;
        const newY = playerYRef.current + velocityYRef.current * delta;

        // Check platform landings (only when falling)
        let landed = false;
        if (velocityYRef.current > 0 && platforms) {
          for (const plat of platforms) {
            // Player must be above platform and falling through it
            const onPlatformX = playerXRef.current >= plat.x && playerXRef.current <= plat.x + plat.width;
            const crossingPlatform = playerYRef.current <= plat.y && newY >= plat.y;
            if (onPlatformX && crossingPlatform) {
              playerYRef.current = plat.y;
              velocityYRef.current = 0;
              isGroundedRef.current = true;
              sceneDispatch({ type: 'SET_GROUNDED', grounded: true });
              sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
              landed = true;
              break;
            }
          }
        }

        if (!landed) {
          if (newY >= groundY) {
            // Land on ground
            playerYRef.current = groundY;
            velocityYRef.current = 0;
            isGroundedRef.current = true;
            sceneDispatch({ type: 'SET_GROUNDED', grounded: true });
            sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
          } else {
            playerYRef.current = newY;
          }
        }
        yChanged = true;
      } else if (isGroundedRef.current && playerYRef.current < groundY && platforms) {
        // Check if player walked off a platform edge
        const onAnyPlatform = platforms.some(
          (plat) =>
            playerXRef.current >= plat.x &&
            playerXRef.current <= plat.x + plat.width &&
            Math.abs(playerYRef.current - plat.y) < 1,
        );
        if (!onAnyPlatform) {
          // Walked off edge — start falling
          isGroundedRef.current = false;
          velocityYRef.current = 0;
          sceneDispatch({ type: 'SET_GROUNDED', grounded: false });
          sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'jump' });
        }
      }

      // Apply knockback
      if (Math.abs(knockbackVXRef.current) > KNOCKBACK_THRESHOLD) {
        const newX = playerXRef.current + knockbackVXRef.current * delta;
        playerXRef.current = Math.max(2, Math.min(98, newX));
        knockbackVXRef.current *= Math.exp(-KNOCKBACK_DECAY * delta);
        xChanged = true;

        if (Math.abs(knockbackVXRef.current) <= KNOCKBACK_THRESHOLD) {
          knockbackVXRef.current = 0;
          sceneDispatch({ type: 'CLEAR_KNOCKBACK' });
        }
      }

      // Dispatch position updates
      if (yChanged) {
        sceneDispatch({ type: 'UPDATE_PLAYER_Y', y: playerYRef.current });
      }
      if (xChanged) {
        sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: playerXRef.current });
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [groundY, platforms, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, sceneDispatch]);

  // Trigger knockback from obstacle/enemy collision
  const triggerKnockback = useCallback((direction: 'left' | 'right') => {
    const now = performance.now();
    if (now < invincibleUntilRef.current) return; // still invincible

    invincibleUntilRef.current = now + INVINCIBILITY_DURATION;

    // Instant teleport away from obstacle to prevent overlapping
    const teleportDir = direction === 'left' ? -KNOCKBACK_TELEPORT : KNOCKBACK_TELEPORT;
    playerXRef.current = Math.max(2, Math.min(98, playerXRef.current + teleportDir));
    sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: playerXRef.current });

    // Then apply velocity-based knockback on top
    knockbackVXRef.current = direction === 'right' ? KNOCKBACK_IMPULSE : -KNOCKBACK_IMPULSE;
    sceneDispatch({ type: 'TRIGGER_KNOCKBACK', velocityX: knockbackVXRef.current });
    sceneDispatch({ type: 'TRIGGER_SCREEN_SHAKE' });

    // Auto-clear screen shake
    setTimeout(() => {
      sceneDispatch({ type: 'STOP_SCREEN_SHAKE' });
    }, 200);
  }, [sceneDispatch]);

  return { triggerKnockback, invincibleUntilRef };
}
