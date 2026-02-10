import { useEffect, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useScene } from '../context/SceneContext';
import { useVariety } from '../context/VarietyContext';
import { useCharacterMovement } from '../hooks/useCharacterMovement';
import { useKeyboardMovement } from '../hooks/useKeyboardMovement';
import { SceneRenderer } from '../components/scene/SceneRenderer';
import { GothicDecisionPanel } from '../components/overlay/GothicDecisionPanel';
import { GothicOutcomePanel } from '../components/overlay/GothicOutcomePanel';
import { ResourceHUD } from '../components/hud/ResourceHUD';
import { SceneTransition } from '../components/transitions/SceneTransition';
import { PhaseTitle } from '../components/transitions/PhaseTitle';
import { PitchDeckMiniGame } from '../components/PitchDeckMiniGame';
import { ChallengeOverlay } from '../components/challenges/ChallengeOverlay';
import { getNodeById } from '../data/decisions';
import { getSceneById, NODE_TO_SCENE_MAP, scenes } from '../data/scenes';
import type { SceneInteractable } from '../types/scene';
import type { Choice } from '../types/game';
import type { GamePhase } from '../types/game';
import { PHASES } from '../types/game';

export function GothicGameScreen() {
  const { state, makeChoice, startMiniGame, continueFromOutcome } = useGame();
  const { sceneState, sceneDispatch } = useScene();
  const { varietyState, isChallengeCompleted, startChallenge } = useVariety();
  const prevNodeIdRef = useRef(state.currentNodeId);
  const prevPhaseRef = useRef<GamePhase>(state.currentPhase);

  // Activate movement hooks
  useCharacterMovement();
  useKeyboardMovement();

  // Get current scene
  const currentScene = getSceneById(sceneState.currentSceneId);

  // Watch for node changes -> trigger scene transitions
  useEffect(() => {
    const newNodeId = state.currentNodeId;
    if (newNodeId === prevNodeIdRef.current) return;

    const oldPhase = prevPhaseRef.current;
    const newPhase = state.currentPhase;
    prevNodeIdRef.current = newNodeId;
    prevPhaseRef.current = newPhase;

    const targetSceneId = NODE_TO_SCENE_MAP[newNodeId];
    if (!targetSceneId || targetSceneId === 'CURRENT_SCENE') {
      // Random event - show decision panel in current scene
      if (state.screen === 'game') {
        sceneDispatch({ type: 'SHOW_DECISION_PANEL' });
      }
      return;
    }

    if (targetSceneId === sceneState.currentSceneId) {
      // Same scene, just show the decision
      if (state.screen === 'game') {
        sceneDispatch({ type: 'SHOW_DECISION_PANEL' });
      }
      return;
    }

    // Phase change - show title card first
    if (oldPhase !== newPhase) {
      const phaseInfo = PHASES.find(p => p.id === newPhase);
      if (phaseInfo) {
        sceneDispatch({ type: 'SHOW_PHASE_TITLE', title: phaseInfo.displayName });
        // Scene transition will happen after phase title
        sceneDispatch({ type: 'START_SCENE_TRANSITION', targetSceneId });
        return;
      }
    }

    // Normal scene transition
    sceneDispatch({ type: 'START_SCENE_TRANSITION', targetSceneId });
  }, [state.currentNodeId, state.currentPhase, state.screen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync game screen state with scene context
  useEffect(() => {
    if (state.screen === 'game' && !sceneState.showDecisionPanel && !sceneState.isTransitioning && !sceneState.phaseTitle) {
      // Check if we should auto-show the decision panel (after a scene transition)
      // Small delay to let player see the scene first
    }
    if (state.screen === 'outcome') {
      sceneDispatch({ type: 'SHOW_OUTCOME_PANEL' });
    }
  }, [state.screen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Challenge gating: trigger challenge when player passes the gate position
  const challengeActive = varietyState.challengePhase !== 'not-started';
  useEffect(() => {
    if (!currentScene?.challenge) return;
    if (challengeActive) return;
    if (isChallengeCompleted(currentScene.challenge.id)) return;
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    if (sceneState.playerX >= currentScene.challenge.gateX) {
      startChallenge(currentScene.challenge.successThreshold);
    }
  }, [sceneState.playerX, currentScene, challengeActive, isChallengeCompleted, startChallenge, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning]);

  // Auto-proximity detection: trigger interaction when walking near ANY interactable
  useEffect(() => {
    if (!currentScene) return;
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;
    // Block NPC interaction while a challenge is active
    if (challengeActive) return;

    for (const interactable of currentScene.interactables) {
      const distance = Math.abs(sceneState.playerX - interactable.x);
      if (distance < interactable.proximityRange) {
        sceneDispatch({ type: 'SET_PENDING_INTERACTABLE', id: null });
        if (interactable.interactionType === 'decision' && interactable.triggerNodeId) {
          sceneDispatch({ type: 'SHOW_DECISION_PANEL' });
        } else if (interactable.interactionType === 'transition' && interactable.triggerSceneId) {
          sceneDispatch({ type: 'START_SCENE_TRANSITION', targetSceneId: interactable.triggerSceneId });
        }
        return;
      }
    }
  }, [sceneState.playerX, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, challengeActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle interactable click: walk to it first
  const handleInteract = useCallback((interactable: SceneInteractable) => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel) return;

    const distance = Math.abs(sceneState.playerX - interactable.x);
    if (distance < interactable.proximityRange) {
      // Already close enough - trigger immediately
      if (interactable.interactionType === 'decision' && interactable.triggerNodeId) {
        sceneDispatch({ type: 'SHOW_DECISION_PANEL' });
      } else if (interactable.interactionType === 'transition' && interactable.triggerSceneId) {
        sceneDispatch({ type: 'START_SCENE_TRANSITION', targetSceneId: interactable.triggerSceneId });
      }
    } else {
      // Walk to interactable first
      sceneDispatch({ type: 'SET_PENDING_INTERACTABLE', id: interactable.id });
      sceneDispatch({ type: 'SET_PLAYER_TARGET', x: interactable.x });
    }
  }, [sceneState.playerX, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneDispatch]);

  // Handle choice selection
  const handleChoice = useCallback((choice: Choice) => {
    const node = getNodeById(state.currentNodeId);
    if (!node) return;

    if (choice.triggersMiniGame) {
      sceneDispatch({ type: 'HIDE_DECISION_PANEL' });
      startMiniGame();
    } else {
      sceneDispatch({ type: 'HIDE_DECISION_PANEL' });
      makeChoice(
        node.id,
        choice.id,
        node.title,
        choice.text,
        choice.resourceChanges,
        choice.outcome,
        choice.nextNodeId
      );
    }
  }, [state.currentNodeId, makeChoice, startMiniGame, sceneDispatch]);

  // Handle continue from outcome
  const handleContinue = useCallback(() => {
    sceneDispatch({ type: 'HIDE_OUTCOME_PANEL' });
    const node = getNodeById(state.currentNodeId);
    // Find the choice that was just made to get nextNodeId
    const lastHistoryEntry = state.decisionHistory[state.decisionHistory.length - 1];
    if (lastHistoryEntry && node) {
      const choice = node.choices.find(c => c.id === lastHistoryEntry.choiceId);
      continueFromOutcome(choice?.nextNodeId);
    } else {
      continueFromOutcome();
    }
  }, [state.currentNodeId, state.decisionHistory, continueFromOutcome, sceneDispatch]);

  // Scene transition midpoint: swap the scene
  const handleTransitionMidpoint = useCallback(() => {
    if (sceneState.transitionTargetSceneId) {
      const targetScene = scenes[sceneState.transitionTargetSceneId];
      if (targetScene) {
        sceneDispatch({
          type: 'RESET_SCENE',
          sceneId: sceneState.transitionTargetSceneId,
          playerStartX: targetScene.playerStartX,
        });
      }
    }
  }, [sceneState.transitionTargetSceneId, sceneDispatch]);

  // Scene transition complete
  const handleTransitionComplete = useCallback(() => {
    sceneDispatch({ type: 'COMPLETE_SCENE_TRANSITION' });
    // Show decision panel for the new scene after transition
    if (state.screen === 'game') {
      // Don't auto-show - let player walk to NPC
    }
  }, [state.screen, sceneDispatch]);

  // Phase title complete
  const handlePhaseTitleComplete = useCallback(() => {
    sceneDispatch({ type: 'HIDE_PHASE_TITLE' });
  }, [sceneDispatch]);

  if (!currentScene) {
    return <div style={{ color: 'red', padding: 20 }}>Scene not found: {sceneState.currentSceneId}</div>;
  }

  const currentNode = getNodeById(state.currentNodeId);

  return (
    <>
      {/* Scene */}
      <SceneRenderer scene={currentScene} onInteract={handleInteract} />

      {/* Resource HUD */}
      <ResourceHUD resources={state.resources} currentPhase={state.currentPhase} />

      {/* Decision Panel */}
      {sceneState.showDecisionPanel && currentNode && state.screen === 'game' && (
        <GothicDecisionPanel
          node={currentNode}
          resources={state.resources}
          onChoice={handleChoice}
          isFirstDecision={state.decisionHistory.length === 0}
          miniGamePlayed={state.miniGameResult !== null}
        />
      )}

      {/* Outcome Panel */}
      {sceneState.showOutcomePanel && state.pendingOutcome && state.screen === 'outcome' && (
        <GothicOutcomePanel
          outcomeText={state.pendingOutcome}
          onContinue={handleContinue}
        />
      )}

      {/* Mini-challenge */}
      {challengeActive && currentScene.challenge && (
        <ChallengeOverlay challenge={currentScene.challenge} />
      )}

      {/* Mini-game */}
      {state.screen === 'minigame' && (
        <div className="gothic-overlay">
          <div className="gothic-panel" style={{ maxWidth: 900, maxHeight: '90vh' }}>
            <PitchDeckMiniGame />
          </div>
        </div>
      )}

      {/* Scene Transition */}
      <SceneTransition
        isActive={sceneState.isTransitioning}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
      />

      {/* Phase Title Card */}
      {sceneState.phaseTitle && (
        <PhaseTitle
          title={sceneState.phaseTitle}
          onComplete={handlePhaseTitleComplete}
        />
      )}
    </>
  );
}
