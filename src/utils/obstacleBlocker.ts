import type { ObstacleDefinition } from '../types/platformer';

// Shared module-level state so movement hooks can check obstacle collisions
// without needing to pass data through React context
let currentObstacles: ObstacleDefinition[] = [];
let currentGroundY = 78;

const PLAYER_HALF_W = 1.2; // must match collision.ts

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
export function getBlockedX(newX: number, playerY: number, oldX?: number): number {
  for (const obs of currentObstacles) {
    // If player's feet are above the obstacle top, they can pass freely
    const obsTop = currentGroundY - obs.height;
    if (playerY < obsTop + 1) continue; // +1 tolerance

    const obsLeft = obs.x - obs.width / 2;
    const obsRight = obs.x + obs.width / 2;

    // Check if player would overlap this obstacle horizontally
    if (newX + PLAYER_HALF_W > obsLeft && newX - PLAYER_HALF_W < obsRight) {
      // Use previous position to determine which side to push back to
      const refX = oldX !== undefined ? oldX : newX;
      if (refX < obs.x) {
        newX = obsLeft - PLAYER_HALF_W;
      } else {
        newX = obsRight + PLAYER_HALF_W;
      }
    } else if (oldX !== undefined) {
      // Check if the player teleported completely THROUGH the obstacle
      // (start was on one side, end is on the other, but no overlap at destination)
      const wasLeft = oldX + PLAYER_HALF_W <= obsLeft;
      const wasRight = oldX - PLAYER_HALF_W >= obsRight;
      const nowRight = newX - PLAYER_HALF_W >= obsRight;
      const nowLeft = newX + PLAYER_HALF_W <= obsLeft;

      if ((wasLeft && nowRight) || (wasRight && nowLeft)) {
        // Crossed through — push back to original side
        if (wasLeft) {
          newX = obsLeft - PLAYER_HALF_W;
        } else {
          newX = obsRight + PLAYER_HALF_W;
        }
      }
    }
  }
  return newX;
}
