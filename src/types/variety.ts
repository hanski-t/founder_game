import type { ResourceChange } from './game';

// ============ COLLECTIBLES ============

export type CollectibleVisual = 'coin' | 'document' | 'coffee' | 'usb' | 'scroll' | 'gem';

export interface CollectibleDefinition {
  id: string;
  visual: CollectibleVisual;
  x: number; // percentage position (0-100)
  y?: number; // percentage from top (defaults to groundY if omitted)
  label: string; // floating text when collected ("+$500", "Startup Tip")
  resourceBonus?: ResourceChange;
  flavorText?: string; // optional lore/tip shown briefly
}

// ============ MINI-CHALLENGES ============

export type ChallengeType = 'quick-time' | 'falling-catch';

export interface QuickTimeConfig {
  prompts: { key: string; displayKey: string }[];
  timePerPrompt: number; // ms
}

export interface FallingCatchConfig {
  duration: number; // ms
  spawnInterval: number; // ms between falling items
  goodItems: { visual: string; label: string }[];
  badItems: { visual: string; label: string }[];
  fallDuration: number; // ms for item to fall from top to ground
}

export interface ChallengeDefinition {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  successThreshold: number; // score needed to "succeed"
  gateX: number; // X position that triggers the challenge
  quickTimeConfig?: QuickTimeConfig;
  fallingCatchConfig?: FallingCatchConfig;
}

export type ChallengePhase = 'not-started' | 'intro' | 'active' | 'result';

// ============ VARIETY STATE ============

export interface VarietyState {
  // Collectibles
  collectedIds: string[];
  activePickup: {
    id: string;
    x: number;
    label: string;
    resourceBonus?: ResourceChange;
    flavorText?: string;
  } | null;

  // Challenges
  completedChallengeIds: string[];
  challengePhase: ChallengePhase;
  challengeScore: number;
  challengeTotal: number;
  challengeSuccessThreshold: number;
}

export type VarietyAction =
  | { type: 'COLLECT_ITEM'; item: CollectibleDefinition }
  | { type: 'CLEAR_PICKUP' }
  | { type: 'START_CHALLENGE'; successThreshold: number }
  | { type: 'SET_CHALLENGE_PHASE'; phase: ChallengePhase }
  | { type: 'INCREMENT_SCORE' }
  | { type: 'DECREMENT_SCORE' }
  | { type: 'SET_CHALLENGE_TOTAL'; total: number }
  | { type: 'INCREMENT_TOTAL' }
  | { type: 'COMPLETE_CHALLENGE'; challengeId: string }
  | { type: 'RESET_VARIETY' };
