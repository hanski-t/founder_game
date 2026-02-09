import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

const WALK_SPEED = 18; // percentage per second

export function useCharacterMovement() {
  const { sceneState, sceneDispatch } = useScene();
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const currentXRef = useRef(sceneState.playerX);

  // Keep ref in sync with state
  currentXRef.current = sceneState.playerX;

  useEffect(() => {
    if (sceneState.playerTargetX === null) return;
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel) return;

    const target = sceneState.playerTargetX;

    if (Math.abs(currentXRef.current - target) < 1) {
      sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
      return;
    }

    const direction = target > currentXRef.current ? 'right' : 'left';
    sceneDispatch({ type: 'SET_PLAYER_FACING', facing: direction });
    sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'walk' });

    lastTimeRef.current = 0;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const step = WALK_SPEED * delta;
      const currentX = currentXRef.current;
      const remaining = Math.abs(target - currentX);

      if (remaining < step || remaining < 0.5) {
        currentXRef.current = target;
        sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: target });
        sceneDispatch({ type: 'SET_PLAYER_ANIMATION', animation: 'idle' });
        return;
      }

      const dir = target > currentX ? 1 : -1;
      const newX = Math.max(2, Math.min(98, currentX + step * dir));
      currentXRef.current = newX;
      sceneDispatch({ type: 'UPDATE_PLAYER_POSITION', x: newX });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [sceneState.playerTargetX, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneDispatch]);
}
