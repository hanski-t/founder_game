export interface Resources {
  momentum: number;   // 0-100 percentage, startup speed
  money: number;      // Dollars
  energy: number;     // 0-100 percentage
  reputation: number; // Social capital / credibility
}

export interface ResourceChange {
  momentum?: number;
  money?: number;
  energy?: number;
  reputation?: number;
}

export interface Choice {
  id: string;
  text: string;
  resourceChanges: ResourceChange;
  outcome: string;
  nextNodeId?: string;
  triggersMiniGame?: 'pitchDeck';
}

export interface DecisionNode {
  id: string;
  phase: GamePhase;
  type: 'decision' | 'event' | 'minigame';
  title: string;
  description: string;
  choices: Choice[];
  isRandomEvent?: boolean;
}

export type GamePhase = 'university' | 'firstStartup' | 'growth' | 'scaling' | 'exit';

export interface PhaseInfo {
  id: GamePhase;
  name: string;
  displayName: string;
}

export const PHASES: PhaseInfo[] = [
  { id: 'university', name: 'university', displayName: 'PHASE 1: UNIVERSITY' },
  { id: 'firstStartup', name: 'firstStartup', displayName: 'PHASE 2: FIRST STARTUP' },
  { id: 'growth', name: 'growth', displayName: 'PHASE 3: GROWTH' },
  { id: 'scaling', name: 'scaling', displayName: 'PHASE 4: SCALING' },
  { id: 'exit', name: 'exit', displayName: 'PHASE 5: EXIT' },
];

export interface DecisionHistoryEntry {
  nodeId: string;
  nodeTitle: string;
  choiceId: string;
  choiceText: string;
  resourceChanges: ResourceChange;
  timestamp: number;
}

export interface GameState {
  screen: 'start' | 'game' | 'minigame' | 'outcome' | 'end';
  resources: Resources;
  currentPhase: GamePhase;
  currentNodeId: string;
  decisionHistory: DecisionHistoryEntry[];
  pendingOutcome: string | null;
  miniGameResult: 'success' | 'failure' | null;
  endReason: 'momentum' | 'money' | 'success' | null;
  eventLog: string[];
  returnToNodeId: string | null; // For returning after random events
}

export const INITIAL_RESOURCES: Resources = {
  momentum: 70,
  money: 10000,
  energy: 100,
  reputation: 0,
};

export const RESOURCE_LIMITS = {
  momentum: { min: 0, max: 100 },
  money: { min: 0, max: 1000000 },
  energy: { min: 0, max: 100 },
  reputation: { min: 0, max: 500 },
};
