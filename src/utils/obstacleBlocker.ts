import type { ObstacleDefinition } from '../types/platformer';

// Shared module-level state so movement hooks can check obstacle collisions
// without needing to pass data through React context
let currentObstacles: ObstacleDefinition[] = [];
let currentGroundY = 78;

const PLAYER_HALF_W = 1.8; // must match collision.ts

/** Called by GothicGameScreen when the scene changes */
export function setCurrentObstacles(obstacles: ObstacleDefinition[], groundY: number) {
  currentObstacles = obstacles;
  currentGroundY = groundY;
}

/**
 * Check if moving to newX would overlap an obstacle at ground level.
 * Returns the clamped X position (pushed to obstacle edge if blocked).
 * If the player is airborne above the obstacle, movement is not blocked.
 */
export function getBlockedX(newX: number, playerY: number): number {
  for (const obs of currentObstacles) {
    // If player's feet are above the obstacle top, they can pass freely
    const obsTop = currentGroundY - obs.height;
    if (playerY < obsTop + 1) continue; // +1 tolerance

    const obsLeft = obs.x - obs.width / 2;
    const obsRight = obs.x + obs.width / 2;

    // Check if player would overlap this obstacle horizontally
    if (newX + PLAYER_HALF_W > obsLeft && newX - PLAYER_HALF_W < obsRight) {
      // Push to nearest edge
      if (newX < obs.x) {
        newX = obsLeft - PLAYER_HALF_W;
      } else {
        newX = obsRight + PLAYER_HALF_W;
      }
    }
  }
  return newX;
}
