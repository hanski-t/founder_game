import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  VarietyState,
  VarietyAction,
  CollectibleDefinition,
  ChallengePhase,
} from '../types/variety';
import { useGame } from './GameContext';

const initialState: VarietyState = {
  collectedIds: [],
  activePickup: null,
  completedChallengeIds: [],
  challengePhase: 'not-started',
  challengeScore: 0,
  challengeSuccessThreshold: 0,
};

function varietyReducer(state: VarietyState, action: VarietyAction): VarietyState {
  switch (action.type) {
    case 'COLLECT_ITEM':
      if (state.collectedIds.includes(action.item.id)) return state;
      return {
        ...state,
        collectedIds: [...state.collectedIds, action.item.id],
        activePickup: {
          id: action.item.id,
          x: action.item.x,
          label: action.item.label,
          resourceBonus: action.item.resourceBonus,
          flavorText: action.item.flavorText,
        },
      };

    case 'CLEAR_PICKUP':
      return { ...state, activePickup: null };

    case 'START_CHALLENGE':
      return {
        ...state,
        challengePhase: 'intro',
        challengeScore: 0,
        challengeSuccessThreshold: action.successThreshold,
      };

    case 'SET_CHALLENGE_PHASE':
      return { ...state, challengePhase: action.phase };

    case 'INCREMENT_SCORE':
      return { ...state, challengeScore: state.challengeScore + 1 };

    case 'DECREMENT_SCORE':
      return { ...state, challengeScore: Math.max(0, state.challengeScore - 1) };

    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        completedChallengeIds: [...state.completedChallengeIds, action.challengeId],
        challengePhase: 'not-started',
        challengeScore: 0,
      };

    case 'RESET_VARIETY':
      return initialState;

    default:
      return state;
  }
}

interface VarietyContextType {
  varietyState: VarietyState;
  varietyDispatch: React.Dispatch<VarietyAction>;
  collectItem: (item: CollectibleDefinition) => void;
  isCollected: (id: string) => boolean;
  isChallengeCompleted: (id: string) => boolean;
  startChallenge: (successThreshold: number) => void;
  setChallengePhase: (phase: ChallengePhase) => void;
  completeChallenge: (challengeId: string) => void;
}

const VarietyContext = createContext<VarietyContextType | undefined>(undefined);

export function VarietyProvider({ children }: { children: ReactNode }) {
  const [varietyState, varietyDispatch] = useReducer(varietyReducer, initialState);
  const { dispatch: gameDispatch } = useGame();

  const collectItem = useCallback((item: CollectibleDefinition) => {
    varietyDispatch({ type: 'COLLECT_ITEM', item });
    // Apply resource bonus to actual game state
    if (item.resourceBonus) {
      gameDispatch({ type: 'APPLY_BONUS', resourceChanges: item.resourceBonus });
    }
  }, [gameDispatch]);

  const isCollected = useCallback(
    (id: string) => varietyState.collectedIds.includes(id),
    [varietyState.collectedIds]
  );

  const isChallengeCompleted = useCallback(
    (id: string) => varietyState.completedChallengeIds.includes(id),
    [varietyState.completedChallengeIds]
  );

  const startChallenge = useCallback((successThreshold: number) => {
    varietyDispatch({ type: 'START_CHALLENGE', successThreshold });
  }, []);

  const setChallengePhase = useCallback((phase: ChallengePhase) => {
    varietyDispatch({ type: 'SET_CHALLENGE_PHASE', phase });
  }, []);

  const completeChallenge = useCallback((challengeId: string) => {
    varietyDispatch({ type: 'COMPLETE_CHALLENGE', challengeId });
  }, []);

  return (
    <VarietyContext.Provider
      value={{
        varietyState,
        varietyDispatch,
        collectItem,
        isCollected,
        isChallengeCompleted,
        startChallenge,
        setChallengePhase,
        completeChallenge,
      }}
    >
      {children}
    </VarietyContext.Provider>
  );
}

export function useVariety() {
  const context = useContext(VarietyContext);
  if (context === undefined) {
    throw new Error('useVariety must be used within a VarietyProvider');
  }
  return context;
}
