import type { GamePhase } from './game';
import type { CollectibleDefinition, ChallengeDefinition } from './variety';
import type { ObstacleDefinition, EnemyDefinition, PlatformDefinition } from './platformer';

export interface SpriteConfig {
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number; // ms per frame
}

export interface SceneBackgroundLayer {
  src: string;
  scrollFactor: number; // 0 = fixed, 0.5 = half-speed parallax, 1 = full
}

export interface SceneInteractable {
  id: string;
  type: 'npc' | 'door' | 'object';
  x: number; // percentage of scene width (0-100)
  y: number; // percentage of scene height (0-100)
  width: number;
  height: number;
  spriteSheet?: string;
  spriteConfig?: SpriteConfig;
  staticImage?: string;
  label: string;
  triggerNodeId?: string;
  triggerSceneId?: string;
  proximityRange: number; // percentage of scene width
  interactionType: 'decision' | 'transition' | 'info';
}

export interface SceneDefinition {
  id: string;
  name: string;
  phase: GamePhase;
  backgroundLayers: SceneBackgroundLayer[];
  groundY: number; // percentage from top (e.g., 75 = 75% down)
  sceneWidth: number; // logical width in pixels for movement
  playerStartX: number; // percentage of scene width
  interactables: SceneInteractable[];
  ambientColor?: string;
  collectibles?: CollectibleDefinition[];
  challenge?: ChallengeDefinition;
  obstacles?: ObstacleDefinition[];
  enemies?: EnemyDefinition[];
  platforms?: PlatformDefinition[];
}

export interface SceneState {
  playerX: number; // percentage of scene width (0-100)
  playerY: number; // percentage from top (78 = ground)
  playerTargetX: number | null;
  playerFacing: 'left' | 'right';
  playerAnimation: 'idle' | 'walk' | 'jump';
  isGrounded: boolean;
  knockbackActive: boolean;
  currentSceneId: string;
  isTransitioning: boolean;
  transitionTargetSceneId: string | null;
  hoveredInteractableId: string | null;
  pendingInteractableId: string | null; // walking toward this interactable
  showDecisionPanel: boolean;
  showOutcomePanel: boolean;
  screenShake: boolean;
  phaseTitle: string | null; // shown during phase transitions
}

export type SceneAction =
  | { type: 'SET_PLAYER_TARGET'; x: number }
  | { type: 'UPDATE_PLAYER_POSITION'; x: number }
  | { type: 'SET_PLAYER_ANIMATION'; animation: 'idle' | 'walk' | 'jump' }
  | { type: 'SET_PLAYER_FACING'; facing: 'left' | 'right' }
  | { type: 'HOVER_INTERACTABLE'; id: string | null }
  | { type: 'SET_PENDING_INTERACTABLE'; id: string | null }
  | { type: 'SHOW_DECISION_PANEL' }
  | { type: 'HIDE_DECISION_PANEL' }
  | { type: 'SHOW_OUTCOME_PANEL' }
  | { type: 'HIDE_OUTCOME_PANEL' }
  | { type: 'START_SCENE_TRANSITION'; targetSceneId: string }
  | { type: 'COMPLETE_SCENE_TRANSITION' }
  | { type: 'TRIGGER_SCREEN_SHAKE' }
  | { type: 'STOP_SCREEN_SHAKE' }
  | { type: 'SHOW_PHASE_TITLE'; title: string }
  | { type: 'HIDE_PHASE_TITLE' }
  | { type: 'UPDATE_PLAYER_Y'; y: number }
  | { type: 'SET_GROUNDED'; grounded: boolean }
  | { type: 'TRIGGER_KNOCKBACK'; velocityX: number }
  | { type: 'CLEAR_KNOCKBACK' }
  | { type: 'RESET_SCENE'; sceneId: string; playerStartX: number; groundY: number };
