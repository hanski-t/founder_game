import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

export function useCamera() {
  const { sceneState, sceneDispatch } = useScene();

  const playerXRef = useRef(sceneState.playerX);
  const levelWidthRef = useRef(sceneState.levelWidth);
  const lastCameraXRef = useRef(sceneState.cameraX);
  const animFrameRef = useRef(0);

  playerXRef.current = sceneState.playerX;
  levelWidthRef.current = sceneState.levelWidth;

  useEffect(() => {
    const update = () => {
      const playerX = playerXRef.current;
      const levelWidth = levelWidthRef.current;

      // For single-screen levels, camera stays at 0
      if (levelWidth <= 100) {
        if (lastCameraXRef.current !== 0) {
          lastCameraXRef.current = 0;
          sceneDispatch({ type: 'UPDATE_CAMERA', cameraX: 0 });
        }
        animFrameRef.current = requestAnimationFrame(update);
        return;
      }

      // Center camera on player, clamped to level bounds
      const targetCameraX = Math.max(0, Math.min(playerX - 50, levelWidth - 100));

      // Only dispatch if changed meaningfully (avoid unnecessary re-renders)
      if (Math.abs(targetCameraX - lastCameraXRef.current) > 0.1) {
        lastCameraXRef.current = targetCameraX;
        sceneDispatch({ type: 'UPDATE_CAMERA', cameraX: targetCameraX });
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [sceneDispatch]);
}
