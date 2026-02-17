import type { GameState, GamePhase } from '../types/game';

const STORAGE_KEY = 'founders-journey-high-scores';
const MAX_SCORES = 5;

export interface HighScoreEntry {
  score: number;
  phase: GamePhase;
  endReason: string;
  archetype: string;
  decisionsCount: number;
  date: string;
}

const PHASE_MULTIPLIER: Record<string, number> = {
  university: 1,
  firstStartup: 2,
  growth: 3,
  scaling: 4,
  exit: 5,
};

export function calculateScore(state: GameState): number {
  const phaseScore = (PHASE_MULTIPLIER[state.currentPhase] ?? 1) * 1000;
  const decisionBonus = state.decisionHistory.length * 100;
  const moneyBonus = Math.floor(Math.max(0, state.resources.money) / 100);
  const momentumBonus = Math.max(0, state.resources.momentum) * 10;
  const energyBonus = Math.max(0, state.resources.energy) * 5;
  const reputationBonus = Math.max(0, state.resources.reputation) * 2;
  const successBonus = state.endReason === 'success' ? 5000 : 0;

  return phaseScore + decisionBonus + moneyBonus + momentumBonus + energyBonus + reputationBonus + successBonus;
}

export function getHighScores(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HighScoreEntry[];
  } catch {
    return [];
  }
}

export function saveHighScore(entry: HighScoreEntry): boolean {
  const scores = getHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, MAX_SCORES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  // Return true if this entry made it into the top scores
  return trimmed.some(s => s.score === entry.score && s.date === entry.date);
}
