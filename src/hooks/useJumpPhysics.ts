import { useEffect, useRef, useCallback } from 'react';
import { useScene } from '../context/SceneContext';
import { useVariety } from '../context/VarietyContext';
import { usePhaseConfig } from './usePhaseConfig';
import type { PlatformDefinition } from '../types/platformer';
import type { GroundHole, GroundSegment } from '../types/scene';
import { getBlockedX } from '../utils/obstacleBlocker';
import { getGroundYAtX } from '../utils/groundHeight';
import { soundManager } from '../audio/SoundManager';

// Physics constants (all in percentage units)
const GRAVITY = 120; // % per second squared
const JUMP_VELOCITY = -65; // % per second (negative = upward)
const KNOCKBACK_IMPULSE = 35; // % per second horizontal push (stronger for clear separation)
const KNOCKBACK_DECAY = 8; // exponential decay rate
const KNOCKBACK_THRESHOLD = 0.5; // stop knockback when velocity below this
const INVINCIBILITY_DURATION = 500; // ms after knockback before next hit
const KNOCKBACK_TELEPORT = 5; // % instant displacement to clear obstacle on hit
const FALL_DEATH_THRESHOLD = 25; // % below groundY before triggering respawn

function isOverHole(x: number, holes?: GroundHole[]): boolean {
  if (!holes || holes.length === 0) return false;
  return holes.some(h => x >= h.startX && x <= h.endX);
}

export function useJumpPhysics(
  groundY: number,
  platforms?: PlatformDefinition[],
  platformDeltas?: Map<string, { dx: number; dy: number }>,
  groundHoles?: GroundHole[],
  onFallInHole?: () => void,
  groundSegments?: GroundSegment[],
) {
  const { sceneState, sceneDispatch } = useScene();
  const { varietyState } = useVariety();
  const phaseConfig = usePhaseConfig();

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
  const gravityMultiplierRef = useRef(phaseConfig.gravityMultiplier);
  const challengeActiveRef = useRef(varietyState.challengePhase !== 'not-started');
  const levelWidthRef = useRef(sceneState.levelWidth);
  const onPlatformIdRef = useRef<string | null>(null);
  const platformsRef = useRef(platforms);
  const platformDeltasRef = useRef(platformDeltas);
  const groundHolesRef = useRef(groundHoles);
  const onFallInHoleRef = useRef(onFallInHole);
  const fallingInHoleRef = useRef(false);
  const groundSegmentsRef = useRef(groundSegments);

  // Keep refs in sync with state — these are read inside the RAF loop
  // IMPORTANT: playerY and isGrounded are managed authoritatively by the
  // RAF loop — NOT synced from React state on every render, to prevent
  // stale state from overwriting in-flight physics values.
  // playerX IS synced because keyboard movement (useKeyboardMovement)
  // updates X through React dispatch, and this hook needs to see those changes.
  playerXRef.current = sceneState.playerX;
  gravityMultiplierRef.current = phaseConfig.gravityMultiplier;
  challengeActiveRef.current = varietyState.challengePhase !== 'not-started';
  levelWidthRef.current = sceneState.levelWidth;
  platformsRef.current = platforms;
  platformDeltasRef.current = platformDeltas;
  groundHolesRef.current = groundHoles;
  groundSegmentsRef.current = groundSegments;
  onFallInHoleRef.current = onFallInHole;

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
  // IMPORTANT: platforms/groundHoles use refs (not deps) so moving platforms
  // don't restart this effect every frame, which would break physics state.
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    // Sync physics refs from React state when effect (re)starts (scene changes)
    playerYRef.current = sceneState.playerY;
    playerXRef.current = sceneState.playerX;
    isGroundedRef.current = sceneState.isGrounded;
    velocityYRef.current = 0;
    knockbackVXRef.current = 0;
    onPlatformIdRef.current = null;
    lastTimeRef.current = 0;
    fallingInHoleRef.current = false;

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

      const gMult = gravityMultiplierRef.current;
      const curPlatforms = platformsRef.current;

      // Compute the ground height at the player's current X position
      const localGroundY = getGroundYAtX(playerXRef.current, groundY, groundSegmentsRef.current);

      // Handle jump request (blocked during challenges)
      if (jumpRequestedRef.current && isGroundedRef.current && !challengeActiveRef.current) {
        // Scale jump velocity with sqrt of gravity multiplier to keep jump height similar
        velocityYRef.current = JUMP_VELOCITY * Math.sqrt(gMult);
        isGroundedRef.current = false;
        sceneDispatch({ type: 'SET_GROUNDED', grounded: false });
        sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'jump' });
        jumpRequestedRef.current = false;
        soundManager.play('jump');
      }

      // Apply gravity when airborne (scaled by phase multiplier)
      if (!isGroundedRef.current) {
        velocityYRef.current += GRAVITY * gMult * delta;
        const newY = playerYRef.current + velocityYRef.current * delta;

        // Check if player fell into a hole and passed the death threshold
        if (newY > groundY + FALL_DEATH_THRESHOLD && !fallingInHoleRef.current) {
          fallingInHoleRef.current = true;
          soundManager.play('fallInHole');
          onFallInHoleRef.current?.();
          animFrameRef.current = requestAnimationFrame(update);
          return;
        }

        // Check platform landings (only when falling)
        let landed = false;
        if (velocityYRef.current > 0 && curPlatforms) {
          for (const plat of curPlatforms) {
            // Player must be above platform and falling through it
            const onPlatformX = playerXRef.current >= plat.x && playerXRef.current <= plat.x + plat.width;
            const crossingPlatform = playerYRef.current <= plat.y && newY >= plat.y;
            if (onPlatformX && crossingPlatform) {
              playerYRef.current = plat.y;
              velocityYRef.current = 0;
              isGroundedRef.current = true;
              onPlatformIdRef.current = plat.id;
              sceneDispatch({ type: 'SET_GROUNDED', grounded: true });
              sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
              landed = true;
              break;
            }
          }
        }

        if (!landed) {
          // Check if over a ground hole — if so, fall through instead of landing (skip during challenges)
          const overHole = !challengeActiveRef.current && isOverHole(playerXRef.current, groundHolesRef.current);
          if (newY >= localGroundY && !overHole) {
            // Land on solid ground (at local height)
            playerYRef.current = localGroundY;
            velocityYRef.current = 0;
            isGroundedRef.current = true;
            sceneDispatch({ type: 'SET_GROUNDED', grounded: true });
            sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
          } else {
            playerYRef.current = newY;
          }
        }
        yChanged = true;
      } else if (isGroundedRef.current && onPlatformIdRef.current && curPlatforms) {
        // Check if player walked off a platform edge
        const onAnyPlatform = curPlatforms.some(
          (plat) =>
            playerXRef.current >= plat.x &&
            playerXRef.current <= plat.x + plat.width &&
            Math.abs(playerYRef.current - plat.y) < 1,
        );
        if (!onAnyPlatform) {
          // Walked off edge — start falling
          isGroundedRef.current = false;
          velocityYRef.current = 0;
          onPlatformIdRef.current = null;
          sceneDispatch({ type: 'SET_GROUNDED', grounded: false });
          sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'jump' });
        }
      } else if (isGroundedRef.current && !onPlatformIdRef.current) {
        // Walking on ground — check holes and terrain height changes
        const overHole = !challengeActiveRef.current && isOverHole(playerXRef.current, groundHolesRef.current);
        if (overHole) {
          isGroundedRef.current = false;
          velocityYRef.current = 0;
          onPlatformIdRef.current = null;
          sceneDispatch({ type: 'SET_GROUNDED', grounded: false });
          sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'jump' });
          yChanged = true;
        } else if (localGroundY < playerYRef.current - 0.5) {
          // Ground rose (uphill) — only snap up for gentle slopes (≤1.5%)
          // Steeper ledges require jumping (X movement is blocked by obstacleBlocker)
          const rise = playerYRef.current - localGroundY;
          if (rise <= 1.5) {
            playerYRef.current = localGroundY;
            yChanged = true;
          }
        } else if (localGroundY > playerYRef.current + 1) {
          // Ground dropped (downhill) — start falling
          isGroundedRef.current = false;
          velocityYRef.current = 0;
          onPlatformIdRef.current = null;
          sceneDispatch({ type: 'SET_GROUNDED', grounded: false });
          sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'jump' });
          yChanged = true;
        }
      }

      // Ride moving platforms: carry player with platform movement
      if (isGroundedRef.current && onPlatformIdRef.current && platformDeltasRef.current) {
        const delta = platformDeltasRef.current.get(onPlatformIdRef.current);
        if (delta && (Math.abs(delta.dx) > 0.001 || Math.abs(delta.dy) > 0.001)) {
          const maxX = levelWidthRef.current - 2;
          playerXRef.current = Math.max(2, Math.min(maxX, playerXRef.current + delta.dx));
          playerYRef.current += delta.dy;
          xChanged = true;
          yChanged = true;
        }
      }

      // Clear platform tracking when on ground
      if (isGroundedRef.current && playerYRef.current >= groundY - 0.5) {
        onPlatformIdRef.current = null;
      }

      // Reset hole-fall flag once safely grounded (allows falling again after respawn)
      if (isGroundedRef.current && fallingInHoleRef.current) {
        fallingInHoleRef.current = false;
      }

      // Apply knockback
      if (Math.abs(knockbackVXRef.current) > KNOCKBACK_THRESHOLD) {
        const oldX = playerXRef.current;
        const rawX = playerXRef.current + knockbackVXRef.current * delta;
        const clampedX = Math.max(2, Math.min(levelWidthRef.current - 2, rawX));
        const blockedX = getBlockedX(clampedX, playerYRef.current, oldX);
        playerXRef.current = blockedX;
        xChanged = true;

        // If obstacle blocked the knockback, stop it immediately
        if (blockedX !== clampedX) {
          knockbackVXRef.current = 0;
          sceneDispatch({ type: 'CLEAR_KNOCKBACK' });
        } else {
          knockbackVXRef.current *= Math.exp(-KNOCKBACK_DECAY * delta);
          if (Math.abs(knockbackVXRef.current) <= KNOCKBACK_THRESHOLD) {
            knockbackVXRef.current = 0;
            sceneDispatch({ type: 'CLEAR_KNOCKBACK' });
          }
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
  // platforms and groundHoles are accessed via refs, not as direct deps,
  // so moving platforms don't restart the physics loop every frame
  }, [groundY, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, sceneDispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger knockback from obstacle/enemy collision
  const triggerKnockback = useCallback((direction: 'left' | 'right') => {
    const now = performance.now();
    if (now < invincibleUntilRef.current) return; // still invincible

    invincibleUntilRef.current = now + INVINCIBILITY_DURATION;

    // Instant teleport away from obstacle to prevent overlapping
    const oldX = playerXRef.current;
    const teleportDir = direction === 'left' ? -KNOCKBACK_TELEPORT : KNOCKBACK_TELEPORT;
    let teleportX = Math.max(2, Math.min(levelWidthRef.current - 2, playerXRef.current + teleportDir));
    teleportX = getBlockedX(teleportX, playerYRef.current, oldX);
    playerXRef.current = teleportX;
    sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: playerXRef.current });

    // Then apply velocity-based knockback on top
    knockbackVXRef.current = direction === 'right' ? KNOCKBACK_IMPULSE : -KNOCKBACK_IMPULSE;
    sceneDispatch({ type: 'TRIGGER_KNOCKBACK', velocityX: knockbackVXRef.current });
    sceneDispatch({ type: 'TRIGGER_SCREEN_SHAKE' });
    soundManager.play('enemyHit');

    // Auto-clear screen shake
    setTimeout(() => {
      sceneDispatch({ type: 'STOP_SCREEN_SHAKE' });
    }, 200);
  }, [sceneDispatch]);

  return { triggerKnockback, invincibleUntilRef };
}
