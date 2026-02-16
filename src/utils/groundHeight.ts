import type { GroundSegment } from '../types/scene';

/** Returns the ground Y at a given X position, checking segments first, falling back to default */
export function getGroundYAtX(
  x: number,
  defaultGroundY: number,
  segments?: GroundSegment[],
): number {
  if (!segments || segments.length === 0) return defaultGroundY;
  for (const seg of segments) {
    if (x >= seg.startX && x <= seg.endX) return seg.groundY;
  }
  return defaultGroundY;
}
