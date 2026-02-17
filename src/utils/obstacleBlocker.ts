import type { ObstacleDefinition } from '../types/platformer';
import type { GroundSegment } from '../types/scene';
import { getGroundYAtX } from './groundHeight';

// Shared module-level state so movement hooks can check obstacle collisions
// without needing to pass data through React context
let currentObstacles: ObstacleDefinition[] = [];
let currentGroundY = 78;
let currentGroundSegments: GroundSegment[] | undefined;

const PLAYER_HALF_W = 1.2; // must match collision.ts
const MAX_WALK_CLIMB = 1.5; // % — height rises larger than this require jumping

/** Called by GothicGameScreen when the scene changes */
export function setCurrentObstacles(obstacles: ObstacleDefinition[], groundY: number, groundSegments?: GroundSegment[]) {
  currentObstacles = obstacles;
  currentGroundY = groundY;
  currentGroundSegments = groundSegments;
}

/**
 * Check if moving to newX would overlap an obstacle at ground level.
 * Returns the clamped X position (pushed to obstacle edge if blocked).
 * If the player is airborne above the obstacle, movement is not blocked.
 */
export function getBlockedX(newX: number, playerY: number, oldX?: number): number {
  for (const obs of currentObstacles) {
    // If player's feet are above the obstacle top, they can pass freely
    const localGround = getGroundYAtX(obs.x, currentGroundY, currentGroundSegments);
    const obsTop = localGround - obs.height;
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

  // Ledge blocking: prevent walking up steep ground height changes (requires jumping)
  if (oldX !== undefined && currentGroundSegments && currentGroundSegments.length > 0) {
    const oldGroundHeight = getGroundYAtX(oldX, currentGroundY, currentGroundSegments);
    const newGroundHeight = getGroundYAtX(newX, currentGroundY, currentGroundSegments);
    // Only block when player is near ground level (not jumping over)
    // Lower groundY number = higher on screen = higher terrain
    if (playerY >= oldGroundHeight - 2 && newGroundHeight < oldGroundHeight - MAX_WALK_CLIMB) {
      newX = oldX;
    }
  }

  return newX;
}
