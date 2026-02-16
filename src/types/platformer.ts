// Obstacle types for Phase 1
export type ObstacleVisual = 'rock' | 'crate' | 'grave' | 'bush' | 'barrel';

export interface ObstacleDefinition {
  id: string;
  type: ObstacleVisual;
  x: number; // percentage (0-100)
  width: number; // percentage of viewport width
  height: number; // percentage of viewport height
}

// Enemy types for Phase 2
export interface EnemyDefinition {
  id: string;
  type: 'ghost' | 'skeleton' | 'bat' | 'rat' | 'thorn-bush';
  visual: string; // emoji
  patrolStart: number; // X percentage
  patrolEnd: number; // X percentage
  y: number; // Y percentage (ground-based or flying)
  speed: number; // percentage per second
  width: number; // hitbox width percentage
  height: number; // hitbox height percentage
}

// Platform types for Phase 3
export interface PlatformDefinition {
  id: string;
  x: number; // left edge, percentage
  y: number; // top edge, percentage
  width: number; // percentage
  visual: 'wood' | 'stone' | 'metal';
  // Moving platform fields (optional — static if omitted)
  moveAxis?: 'horizontal' | 'vertical';
  moveRange?: number; // max displacement from base position in %
  moveSpeed?: number; // oscillation speed in cycles per second (e.g., 0.4)
}
