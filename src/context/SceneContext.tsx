import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { SceneState, SceneAction } from '../types/scene';

const initialSceneState: SceneState = {
  playerX: 20,
  playerY: 78,
  playerTargetX: null,
  playerFacing: 'right',
  playerAnimation: 'idle',
  isGrounded: true,
  knockbackActive: false,
  currentSceneId: 'town-square',
  isTransitioning: false,
  transitionTargetSceneId: null,
  hoveredInteractableId: null,
  pendingInteractableId: null,
  showDecisionPanel: false,
  showOutcomePanel: false,
  screenShake: false,
  phaseTitle: null,
  cameraX: 0,
  levelWidth: 100,
};

function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'SET_PLAYER_TARGET':
      return { ...state, playerTargetX: action.x };

    case 'UPDATE_PLAYER_POSITION':
      return { ...state, playerX: action.x };

    case 'SET_PLAYER_ANIMATION':
      return { ...state, playerAnimation: action.animation };

    case 'SET_PLAYER_FACING':
      return { ...state, playerFacing: action.facing };

    case 'HOVER_INTERACTABLE':
      return { ...state, hoveredInteractableId: action.id };

    case 'SET_PENDING_INTERACTABLE':
      return { ...state, pendingInteractableId: action.id };

    case 'SHOW_DECISION_PANEL':
      return { ...state, showDecisionPanel: true, pendingInteractableId: null };

    case 'HIDE_DECISION_PANEL':
      return { ...state, showDecisionPanel: false };

    case 'SHOW_OUTCOME_PANEL':
      return { ...state, showOutcomePanel: true, showDecisionPanel: false };

    case 'HIDE_OUTCOME_PANEL':
      return { ...state, showOutcomePanel: false };

    case 'START_SCENE_TRANSITION':
      return { ...state, isTransitioning: true, transitionTargetSceneId: action.targetSceneId };

    case 'COMPLETE_SCENE_TRANSITION':
      return {
        ...state,
        isTransitioning: false,
        currentSceneId: state.transitionTargetSceneId || state.currentSceneId,
        transitionTargetSceneId: null,
      };

    case 'TRIGGER_SCREEN_SHAKE':
      return { ...state, screenShake: true };

    case 'STOP_SCREEN_SHAKE':
      return { ...state, screenShake: false };

    case 'SHOW_PHASE_TITLE':
      return { ...state, phaseTitle: action.title };

    case 'HIDE_PHASE_TITLE':
      return { ...state, phaseTitle: null };

    case 'UPDATE_PLAYER_Y':
      return { ...state, playerY: action.y };

    case 'SET_GROUNDED':
      return { ...state, isGrounded: action.grounded };

    case 'TRIGGER_KNOCKBACK':
      return { ...state, knockbackActive: true };

    case 'CLEAR_KNOCKBACK':
      return { ...state, knockbackActive: false };

    case 'UPDATE_CAMERA':
      return { ...state, cameraX: action.cameraX };

    case 'RESET_SCENE':
      return {
        ...state,
        currentSceneId: action.sceneId,
        playerX: action.playerStartX,
        playerY: action.groundY,
        playerTargetX: null,
        playerAnimation: 'idle',
        playerFacing: 'right',
        isGrounded: true,
        knockbackActive: false,
        pendingInteractableId: null,
        hoveredInteractableId: null,
        showDecisionPanel: false,
        showOutcomePanel: false,
        isTransitioning: false,
        transitionTargetSceneId: null,
        levelWidth: action.levelWidth,
        cameraX: Math.max(0, Math.min(action.playerStartX - 50, action.levelWidth - 100)),
      };

    default:
      return state;
  }
}

interface SceneContextType {
  sceneState: SceneState;
  sceneDispatch: React.Dispatch<SceneAction>;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [sceneState, sceneDispatch] = useReducer(sceneReducer, initialSceneState);

  return (
    <SceneContext.Provider value={{ sceneState, sceneDispatch }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}
