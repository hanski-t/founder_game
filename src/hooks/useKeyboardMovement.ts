import { useEffect, useRef, useCallback } from 'react';
import { useScene } from '../context/SceneContext';
import { useVariety } from '../context/VarietyContext';
import { usePhaseConfig } from './usePhaseConfig';
import { getBlockedX } from '../utils/obstacleBlocker';
import { isGamePaused } from '../utils/pauseState';

const GROUND_STEP = 1.5; // percentage per keypress update on ground
const AIR_STEP = 0.5; // percentage per keypress update while airborne (much slower)
const UPDATE_INTERVAL = 50; // ms between updates while key held

export function useKeyboardMovement() {
  const { sceneState, sceneDispatch } = useScene();
  const { varietyState } = useVariety();
  const phaseConfig = usePhaseConfig();
  const keysRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<number>(0);
  const speedMultiplierRef = useRef(phaseConfig.playerSpeedMultiplier);
  const levelWidthRef = useRef(sceneState.levelWidth);

  // Use refs for values that change frequently during gameplay
  // This prevents the callback from recreating and killing the interval mid-jump
  const playerXRef = useRef(sceneState.playerX);
  const playerYRef = useRef(sceneState.playerY);
  const isGroundedRef = useRef(sceneState.isGrounded);
  const showDecisionRef = useRef(sceneState.showDecisionPanel);
  const showOutcomeRef = useRef(sceneState.showOutcomePanel);
  const challengeModalRef = useRef(varietyState.challengePhase === 'intro' || varietyState.challengePhase === 'result');
  const challengeGameplayRef = useRef(varietyState.challengePhase === 'active');

  // Keep refs in sync with state every render
  playerXRef.current = sceneState.playerX;
  playerYRef.current = sceneState.playerY;
  isGroundedRef.current = sceneState.isGrounded;
  showDecisionRef.current = sceneState.showDecisionPanel;
  showOutcomeRef.current = sceneState.showOutcomePanel;
  challengeModalRef.current = varietyState.challengePhase === 'intro' || varietyState.challengePhase === 'result';
  challengeGameplayRef.current = varietyState.challengePhase === 'active';
  speedMultiplierRef.current = phaseConfig.playerSpeedMultiplier;
  levelWidthRef.current = sceneState.levelWidth;

  // Stable callback — only depends on sceneDispatch (which is stable from useReducer)
  const updatePosition = useCallback(() => {
    if (showDecisionRef.current || showOutcomeRef.current) return;
    if (challengeModalRef.current) return; // freeze during challenge intro/result modals
    if (isGamePaused()) return;

    const baseStep = isGroundedRef.current ? GROUND_STEP : AIR_STEP;
    const step = baseStep * speedMultiplierRef.current;

    let dx = 0;
    if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) dx -= step;
    if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) dx += step;

    if (dx !== 0) {
      // During a falling-catch challenge, clamp the player to the viewport range
      // (items spawn at 10-90% viewport, camera is at 0) so catching works.
      const minX = challengeGameplayRef.current ? 5 : 2;
      const maxX = challengeGameplayRef.current ? 95 : levelWidthRef.current - 2;
      const oldX = playerXRef.current;
      let newX = Math.max(minX, Math.min(maxX, oldX + dx));
      // Block movement into obstacles and ledges (only when at ground level, skip during minigame)
      if (!challengeGameplayRef.current) {
        newX = getBlockedX(newX, playerYRef.current, oldX);
      }
      newX = Math.max(minX, Math.min(maxX, newX));

      playerXRef.current = newX; // update ref immediately for next interval tick
      sceneDispatch({ type: 'SET_PLAYER_FACING', facing: dx > 0 ? 'right' : 'left' });
      sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'walk' });
      sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: newX });
    }
  }, [sceneDispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() === 'a' ? 'a' : e.key.toLowerCase() === 'd' ? 'd' : e.key;
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
        if (!intervalRef.current) {
          updatePosition();
          intervalRef.current = window.setInterval(updatePosition, UPDATE_INTERVAL);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase() === 'a' ? 'a' : e.key.toLowerCase() === 'd' ? 'd' : e.key;
      keysRef.current.delete(key);
      if (keysRef.current.size === 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = 0;
        }
        sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: isGroundedRef.current ? 'idle' : 'jump' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updatePosition, sceneDispatch]);
}
