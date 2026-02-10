import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import {
  INITIAL_RESOURCES,
  RESOURCE_LIMITS,
} from '../types/game';
import type {
  GameState,
  Resources,
  ResourceChange,
  DecisionHistoryEntry,
  GamePhase,
} from '../types/game';
import { getNodeById, getRandomEvent } from '../data/decisions';

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'MAKE_CHOICE'; nodeId: string; choiceId: string; nodeTitle: string; choiceText: string; resourceChanges: ResourceChange; outcome: string; nextNodeId?: string }
  | { type: 'SHOW_OUTCOME'; outcome: string }
  | { type: 'CONTINUE_FROM_OUTCOME'; nextNodeId?: string }
  | { type: 'START_MINIGAME' }
  | { type: 'COMPLETE_MINIGAME'; success: boolean; resourceChanges: ResourceChange; outcome: string; nextNodeId?: string }
  | { type: 'TRIGGER_RANDOM_EVENT'; eventId: string }
  | { type: 'END_GAME'; reason: 'momentum' | 'money' | 'success' }
  | { type: 'RESTART_GAME' }
  | { type: 'ADD_EVENT_LOG'; message: string }
  | { type: 'APPLY_BONUS'; resourceChanges: ResourceChange };

const initialState: GameState = {
  screen: 'start',
  resources: { ...INITIAL_RESOURCES },
  currentPhase: 'university',
  currentNodeId: 'uni_intro',
  decisionHistory: [],
  pendingOutcome: null,
  miniGameResult: null,
  endReason: null,
  eventLog: [],
  returnToNodeId: null,
};

function clampResource(value: number, resource: keyof Resources): number {
  const limits = RESOURCE_LIMITS[resource];
  return Math.max(limits.min, Math.min(limits.max, value));
}

function applyResourceChanges(resources: Resources, changes: ResourceChange): Resources {
  return {
    momentum: clampResource(resources.momentum + (changes.momentum || 0), 'momentum'),
    money: clampResource(resources.money + (changes.money || 0), 'money'),
    energy: clampResource(resources.energy + (changes.energy || 0), 'energy'),
    reputation: clampResource(resources.reputation + (changes.reputation || 0), 'reputation'),
  };
}

function checkGameEnd(resources: Resources): 'momentum' | 'money' | null {
  if (resources.momentum <= 0) return 'momentum';
  if (resources.money <= 0) return 'money';
  return null;
}

function getPhaseFromNodeId(nodeId: string): GamePhase {
  const node = getNodeById(nodeId);
  return node?.phase || 'university';
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        screen: 'game',
        eventLog: ['> FOUNDER.EXE initialized', '> Starting Phase 1: University...'],
      };

    case 'MAKE_CHOICE': {
      const newResources = applyResourceChanges(state.resources, action.resourceChanges);
      const endReason = checkGameEnd(newResources);

      const historyEntry: DecisionHistoryEntry = {
        nodeId: action.nodeId,
        nodeTitle: action.nodeTitle,
        choiceId: action.choiceId,
        choiceText: action.choiceText,
        resourceChanges: action.resourceChanges,
        timestamp: Date.now(),
      };

      if (endReason) {
        return {
          ...state,
          resources: newResources,
          decisionHistory: [...state.decisionHistory, historyEntry],
          screen: 'end',
          endReason,
          eventLog: [...state.eventLog, `> Choice made: ${action.choiceText}`, `> GAME OVER: ${endReason === 'momentum' ? 'Lost all momentum!' : 'Out of money!'}`],
        };
      }

      return {
        ...state,
        resources: newResources,
        decisionHistory: [...state.decisionHistory, historyEntry],
        screen: 'outcome',
        pendingOutcome: action.outcome,
        eventLog: [...state.eventLog, `> Choice made: ${action.choiceText}`],
      };
    }

    case 'CONTINUE_FROM_OUTCOME': {
      let nextNodeId = action.nextNodeId;

      // Handle return from random event
      if (nextNodeId === 'RETURN_TO_STORY') {
        nextNodeId = state.returnToNodeId || state.currentNodeId;
        return {
          ...state,
          screen: 'game',
          currentNodeId: nextNodeId,
          currentPhase: getPhaseFromNodeId(nextNodeId),
          pendingOutcome: null,
          returnToNodeId: null,
          eventLog: [...state.eventLog, '> Returning to main story...'],
        };
      }

      if (nextNodeId === 'end') {
        return {
          ...state,
          screen: 'end',
          endReason: 'success',
          eventLog: [...state.eventLog, '> CONGRATULATIONS: Prototype complete!'],
        };
      }

      // 20% chance of random event (only in firstStartup phase, and not when we just came from one)
      const shouldTriggerEvent = Math.random() < 0.2;
      const currentPhase = getPhaseFromNodeId(nextNodeId || state.currentNodeId);

      if (shouldTriggerEvent && currentPhase === 'firstStartup' && !state.returnToNodeId) {
        const randomEvent = getRandomEvent(currentPhase);
        if (randomEvent) {
          return {
            ...state,
            screen: 'game',
            currentNodeId: randomEvent.id,
            currentPhase,
            pendingOutcome: null,
            returnToNodeId: nextNodeId || state.currentNodeId, // Store where to return
            eventLog: [...state.eventLog, '> ALERT: Random event triggered!'],
          };
        }
      }

      return {
        ...state,
        screen: 'game',
        currentNodeId: nextNodeId || state.currentNodeId,
        currentPhase,
        pendingOutcome: null,
        returnToNodeId: null,
        eventLog: [...state.eventLog, `> Proceeding to next decision...`],
      };
    }

    case 'START_MINIGAME':
      return {
        ...state,
        screen: 'minigame',
        eventLog: [...state.eventLog, '> MINI-GAME: Pitch Deck Builder'],
      };

    case 'COMPLETE_MINIGAME': {
      const newResources = applyResourceChanges(state.resources, action.resourceChanges);
      const endReason = checkGameEnd(newResources);

      if (endReason) {
        return {
          ...state,
          resources: newResources,
          screen: 'end',
          endReason,
          miniGameResult: action.success ? 'success' : 'failure',
          eventLog: [...state.eventLog,
            `> Mini-game ${action.success ? 'SUCCESS' : 'FAILURE'}`,
            `> GAME OVER: ${endReason === 'momentum' ? 'Lost all momentum!' : 'Out of money!'}`
          ],
        };
      }

      return {
        ...state,
        resources: newResources,
        screen: 'outcome',
        pendingOutcome: action.outcome,
        miniGameResult: action.success ? 'success' : 'failure',
        eventLog: [...state.eventLog, `> Mini-game ${action.success ? 'SUCCESS' : 'FAILURE'}`],
      };
    }

    case 'END_GAME':
      return {
        ...state,
        screen: 'end',
        endReason: action.reason,
      };

    case 'RESTART_GAME':
      return {
        ...initialState,
        screen: 'start',
      };

    case 'ADD_EVENT_LOG':
      return {
        ...state,
        eventLog: [...state.eventLog, action.message].slice(-10),
      };

    case 'APPLY_BONUS': {
      const bonusResources = applyResourceChanges(state.resources, action.resourceChanges);
      return { ...state, resources: bonusResources };
    }

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: () => void;
  makeChoice: (nodeId: string, choiceId: string, nodeTitle: string, choiceText: string, resourceChanges: ResourceChange, outcome: string, nextNodeId?: string) => void;
  continueFromOutcome: (nextNodeId?: string) => void;
  startMiniGame: () => void;
  completeMiniGame: (success: boolean, resourceChanges: ResourceChange, outcome: string, nextNodeId?: string) => void;
  restartGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = () => dispatch({ type: 'START_GAME' });

  const makeChoice = (
    nodeId: string,
    choiceId: string,
    nodeTitle: string,
    choiceText: string,
    resourceChanges: ResourceChange,
    outcome: string,
    nextNodeId?: string
  ) => {
    dispatch({
      type: 'MAKE_CHOICE',
      nodeId,
      choiceId,
      nodeTitle,
      choiceText,
      resourceChanges,
      outcome,
      nextNodeId,
    });
  };

  const continueFromOutcome = (nextNodeId?: string) => {
    dispatch({ type: 'CONTINUE_FROM_OUTCOME', nextNodeId });
  };

  const startMiniGame = () => dispatch({ type: 'START_MINIGAME' });

  const completeMiniGame = (
    success: boolean,
    resourceChanges: ResourceChange,
    outcome: string,
    nextNodeId?: string
  ) => {
    dispatch({ type: 'COMPLETE_MINIGAME', success, resourceChanges, outcome, nextNodeId });
  };

  const restartGame = () => dispatch({ type: 'RESTART_GAME' });

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        startGame,
        makeChoice,
        continueFromOutcome,
        startMiniGame,
        completeMiniGame,
        restartGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
