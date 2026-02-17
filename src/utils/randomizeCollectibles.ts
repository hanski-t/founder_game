import type { CollectibleDefinition } from '../types/variety';
import type { GroundHole } from '../types/scene';

/**
 * Returns a copy of the collectibles array with randomized x positions.
 * Each collectible shifts ±5-8% from its original position, clamped to
 * level bounds and avoiding ground holes.
 */
export function randomizeCollectibles(
  collectibles: CollectibleDefinition[],
  levelWidth: number,
  groundHoles?: GroundHole[],
): CollectibleDefinition[] {
  return collectibles.map(c => {
    const maxOffset = Math.min(8, levelWidth * 0.05);
    const offsetX = (Math.random() - 0.5) * 2 * maxOffset;
    let newX = c.x + offsetX;

    // Clamp to level bounds (keep away from edges)
    newX = Math.max(5, Math.min(levelWidth - 5, newX));

    // Avoid placing on ground holes
    if (groundHoles) {
      for (const hole of groundHoles) {
        if (newX >= hole.startX - 2 && newX <= hole.endX + 2) {
          newX = c.x; // fallback to original position
          break;
        }
      }
    }

    return { ...c, x: Math.round(newX * 10) / 10 };
  });
}
