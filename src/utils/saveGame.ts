import type { GameState, Resources, GamePhase, DecisionHistoryEntry } from '../types/game';
import { NODE_TO_SCENE_MAP } from '../data/scenes';

const SAVE_KEY = 'founders-journey-save';

interface SaveData {
  version: 1;
  timestamp: string;
  gameState: {
    resources: Resources;
    currentPhase: GamePhase;
    currentNodeId: string;
    decisionHistory: DecisionHistoryEntry[];
    pendingOutcome: string | null;
    eventLog: string[];
  };
  varietyState: {
    collectedIds: string[];
    completedChallengeIds: string[];
  };
}

export function saveGame(
  gameState: GameState,
  collectedIds: string[],
  completedChallengeIds: string[],
): void {
  // Don't save if the game has ended
  if (gameState.endReason !== null) return;
  // Don't save if we're on the start screen
  if (gameState.screen === 'start') return;

  const data: SaveData = {
    version: 1,
    timestamp: new Date().toISOString(),
    gameState: {
      resources: gameState.resources,
      currentPhase: gameState.currentPhase,
      currentNodeId: gameState.currentNodeId,
      decisionHistory: gameState.decisionHistory,
      pendingOutcome: gameState.pendingOutcome,
      eventLog: gameState.eventLog,
    },
    varietyState: {
      collectedIds,
      completedChallengeIds,
    },
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage errors
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data?.version !== 1) return null;
    // Basic validation — reject corrupted or outdated saves instead of loading a broken game
    const gs = data.gameState;
    if (!gs?.currentNodeId || !NODE_TO_SCENE_MAP[gs.currentNodeId]) return null;
    if (!gs.resources || typeof gs.resources !== 'object') return null;
    if (!Array.isArray(gs.decisionHistory) || !Array.isArray(gs.eventLog)) return null;
    if (!Array.isArray(data.varietyState?.collectedIds) || !Array.isArray(data.varietyState?.completedChallengeIds)) return null;
    return data;
  } catch {
    return null;
  }
}

// localStorage can throw when storage is blocked (privacy settings, some private modes)
export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Silently ignore storage errors
  }
}

export function hasSave(): boolean {
  return loadGame() !== null;
}
