// Player hitbox size in percentage coordinates (tight — collision feels fair)
const PLAYER_HALF_W = 1.2; // half-width
const PLAYER_H = 7; // full height

/**
 * Check if the player overlaps a rectangular target.
 * All values are percentages of viewport (0-100).
 * Player position is bottom-center (feet), target position is bottom-center.
 */
export function checkPlayerCollision(
  playerX: number,
  playerY: number, // feet Y (e.g. 78 = ground)
  targetX: number,
  targetY: number, // feet Y of target
  targetW: number, // full width
  targetH: number, // full height
): boolean {
  // Horizontal overlap
  const overlapX = Math.abs(playerX - targetX) < (PLAYER_HALF_W + targetW / 2);
  // Vertical overlap: compare top edges
  // Player top = playerY - PLAYER_H, target top = targetY - targetH
  const playerTop = playerY - PLAYER_H;
  const targetTop = targetY - targetH;
  const overlapY = playerY > targetTop && playerTop < targetY;
  return overlapX && overlapY;
}
