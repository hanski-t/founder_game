import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useScene } from '../context/SceneContext';
import { useVariety } from '../context/VarietyContext';
import { useCharacterMovement } from '../hooks/useCharacterMovement';
import { useKeyboardMovement } from '../hooks/useKeyboardMovement';
import { useJumpPhysics } from '../hooks/useJumpPhysics';
import { useCamera } from '../hooks/useCamera';
import { useMovingPlatforms } from '../hooks/useMovingPlatforms';
import { SceneRenderer } from '../components/scene/SceneRenderer';
import { GothicDecisionPanel } from '../components/overlay/GothicDecisionPanel';
import { GothicOutcomePanel } from '../components/overlay/GothicOutcomePanel';
import { ResourceHUD } from '../components/hud/ResourceHUD';
import { CollectionSidebar } from '../components/hud/CollectionSidebar';
import { SceneTransition } from '../components/transitions/SceneTransition';
import { PhaseTitle } from '../components/transitions/PhaseTitle';
import { PitchDeckMiniGame } from '../components/PitchDeckMiniGame';
import { ChallengeOverlay } from '../components/challenges/ChallengeOverlay';
import { FallNotification } from '../components/scene/FallNotification';
import { getNodeById } from '../data/decisions';
import { getSceneById, NODE_TO_SCENE_MAP, NODE_LEVEL_NUMBER, scenes } from '../data/scenes';
import { PHASE_ATMOSPHERE } from '../data/phaseConfig';
import { setCurrentObstacles } from '../utils/obstacleBlocker';

import type { Choice } from '../types/game';
import type { GamePhase } from '../types/game';
import { PHASES } from '../types/game';

export function GothicGameScreen() {
  const { state, dispatch, makeChoice, startMiniGame, continueFromOutcome } = useGame();
  const { sceneState, sceneDispatch } = useScene();
  const { varietyState, isChallengeCompleted, startChallenge } = useVariety();
  const prevNodeIdRef = useRef(state.currentNodeId);
  const prevPhaseRef = useRef<GamePhase>(state.currentPhase);
  const [showFallNotification, setShowFallNotification] = useState(false);

  // Set phase accent CSS custom properties on :root for global UI theming
  useEffect(() => {
    const phaseConfig = PHASE_ATMOSPHERE[state.currentPhase];
    document.documentElement.style.setProperty('--phase-accent', phaseConfig.accentColor);
    document.documentElement.style.setProperty('--phase-accent-rgb', phaseConfig.accentColorRgb);
  }, [state.currentPhase]);

  // Get current scene
  const currentScene = getSceneById(sceneState.currentSceneId);

  // Sync obstacle data for the movement blocker (module-level shared state).
  // Called during render (not just useEffect) so it survives HMR reloads.
  // Include thorn-bush enemies as blocking obstacles so the player can't walk through them.
  if (currentScene) {
    const thornBushObstacles = (currentScene.enemies ?? [])
      .filter(e => e.type === 'thorn-bush')
      .map(e => ({ id: e.id, type: 'bush' as const, x: e.patrolStart, width: e.width, height: e.height }));
    setCurrentObstacles([...(currentScene.obstacles ?? []), ...thornBushObstacles], currentScene.groundY, currentScene.groundSegments);
  }

  // Animate moving platforms (returns resolved positions + deltas)
  const { resolvedPlatforms, platformDeltas } = useMovingPlatforms(currentScene?.platforms ?? []);

  // Merge resolved platforms with obstacle tops so player can stand on obstacles
  const allPlatforms = useMemo(() => {
    if (!currentScene) return undefined;
    const obstaclePlatforms = (currentScene.obstacles ?? []).map((obs) => ({
      id: `obs-plat-${obs.id}`,
      x: obs.x - obs.width / 2,
      y: currentScene.groundY - obs.height,
      width: obs.width,
      visual: 'stone' as const,
    }));
    return [...resolvedPlatforms, ...obstaclePlatforms];
  }, [currentScene, resolvedPlatforms]);

  // Handle falling into a ground hole: lose 5% momentum, respawn at start
  const handleFallInHole = useCallback(() => {
    if (!currentScene) return;
    dispatch({ type: 'APPLY_BONUS', resourceChanges: { momentum: -5 } });
    sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: currentScene.playerStartX });
    sceneDispatch({ type: 'UPDATE_PLAYER_Y', y: currentScene.groundY });
    sceneDispatch({ type: 'SET_GROUNDED', grounded: true });
    sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
    sceneDispatch({ type: 'TRIGGER_SCREEN_SHAKE' });
    setTimeout(() => sceneDispatch({ type: 'STOP_SCREEN_SHAKE' }), 300);
    setShowFallNotification(true);
  }, [currentScene, dispatch, sceneDispatch]);

  // Activate movement hooks
  useCharacterMovement();
  useKeyboardMovement();
  useCamera();
  const { triggerKnockback } = useJumpPhysics(
    currentScene?.groundY ?? 78,
    allPlatforms,
    platformDeltas,
    currentScene?.groundHoles,
    handleFallInHole,
    currentScene?.groundSegments,
  );

  // Wrap knockback so enemy hits cost money (bat=$500, others=$100)
  const handleEnemyHit = useCallback((direction: 'left' | 'right', enemyType: string) => {
    triggerKnockback(direction);
    const penalty = enemyType === 'bat' ? -500 : -100;
    dispatch({ type: 'APPLY_BONUS', resourceChanges: { money: penalty } });
  }, [triggerKnockback, dispatch]);

  // DEV MODE: sync scene on mount when starting at a non-default level
  useEffect(() => {
    const targetSceneId = NODE_TO_SCENE_MAP[state.currentNodeId];
    if (targetSceneId && targetSceneId !== 'CURRENT_SCENE' && targetSceneId !== sceneState.currentSceneId) {
      const scene = getSceneById(targetSceneId);
      if (scene) {
        sceneDispatch({ type: 'RESET_SCENE', sceneId: targetSceneId, playerStartX: scene.playerStartX, groundY: scene.groundY, levelWidth: scene.levelWidth });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Auto-proximity detection: trigger interaction when touching an interactable
  // Checks both X and Y distance so player can jump over NPCs without triggering
  useEffect(() => {
    if (!currentScene) return;
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;
    // Block NPC interaction while a challenge is active
    if (challengeActive) return;

    for (const interactable of currentScene.interactables) {
      const distX = Math.abs(sceneState.playerX - interactable.x);
      // Player must be near ground level (within 5% of NPC's Y) to trigger
      const distY = Math.abs(sceneState.playerY - interactable.y);
      if (distX < interactable.proximityRange && distY < 5) {
        sceneDispatch({ type: 'SET_PENDING_INTERACTABLE', id: null });
        if (interactable.interactionType === 'decision' && interactable.triggerNodeId) {
          sceneDispatch({ type: 'SHOW_DECISION_PANEL' });
        } else if (interactable.interactionType === 'transition' && interactable.triggerSceneId) {
          sceneDispatch({ type: 'START_SCENE_TRANSITION', targetSceneId: interactable.triggerSceneId });
        }
        return;
      }
    }
  }, [sceneState.playerX, sceneState.playerY, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, challengeActive]); // eslint-disable-line react-hooks/exhaustive-deps


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
    const lastHistoryEntry = state.decisionHistory[state.decisionHistory.length - 1];
    const nextNodeId = lastHistoryEntry && node
      ? node.choices.find(c => c.id === lastHistoryEntry.choiceId)?.nextNodeId
      : undefined;

    continueFromOutcome(nextNodeId);
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
          groundY: targetScene.groundY,
          levelWidth: targetScene.levelWidth,
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
      <SceneRenderer scene={currentScene} onObstacleCollision={handleEnemyHit} challengeActive={varietyState.challengePhase === 'active'} resolvedPlatforms={resolvedPlatforms} />

      {/* Resource HUD */}
      <ResourceHUD resources={state.resources} currentPhase={state.currentPhase} levelNumber={NODE_LEVEL_NUMBER[state.currentNodeId] ?? 1} />

      {/* Collection Sidebar */}
      <CollectionSidebar />

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

      {/* Fall notification */}
      {showFallNotification && (
        <FallNotification onComplete={() => setShowFallNotification(false)} />
      )}

      {/* Mini-game */}
      {state.screen === 'minigame' && (
        <div className="gothic-overlay">
          <div className="gothic-panel" style={{ maxWidth: 900, height: 'calc(100vh - 76px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
          phase={state.currentPhase}
          onComplete={handlePhaseTitleComplete}
        />
      )}
    </>
  );
}
