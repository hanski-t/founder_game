import { useEffect, useRef, useCallback } from 'react';
import { useScene } from '../context/SceneContext';

const KEYBOARD_STEP = 3; // percentage per keypress update
const UPDATE_INTERVAL = 50; // ms between updates while key held

export function useKeyboardMovement() {
  const { sceneState, sceneDispatch } = useScene();
  const keysRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<number>(0);

  const updatePosition = useCallback(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel) return;

    let dx = 0;
    if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) dx -= KEYBOARD_STEP;
    if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) dx += KEYBOARD_STEP;

    if (dx !== 0) {
      const newX = Math.max(2, Math.min(98, sceneState.playerX + dx));
      sceneDispatch({ type: 'SET_PLAYER_FACING', facing: dx > 0 ? 'right' : 'left' });
      sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'walk' });
      sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: newX });
      sceneDispatch({ type: 'SET_PLAYER_TARGET', x: newX });
    }
  }, [sceneState.playerX, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneDispatch]);

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
        sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
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
