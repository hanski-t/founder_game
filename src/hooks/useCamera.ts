import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';
import { useVariety } from '../context/VarietyContext';

export function useCamera() {
  const { sceneState, sceneDispatch } = useScene();
  const { varietyState } = useVariety();
  const challengeActive = varietyState.challengePhase === 'active';

  const playerXRef = useRef(sceneState.playerX);
  const levelWidthRef = useRef(sceneState.levelWidth);
  const lastCameraXRef = useRef(sceneState.cameraX);
  const animFrameRef = useRef(0);
  const challengeActiveRef = useRef(challengeActive);

  playerXRef.current = sceneState.playerX;
  levelWidthRef.current = sceneState.levelWidth;
  challengeActiveRef.current = challengeActive;

  useEffect(() => {
    const LERP_SPEED = 0.08; // Smooth follow (0 = frozen, 1 = instant snap)

    const update = () => {
      // Freeze camera at 0 during a falling-catch challenge.
      // ChallengeOverlay centres the player at x=50, so camera target = 0.
      // Player movement is clamped to 5-95 (viewport range) during the challenge,
      // so camera = 0 keeps everything aligned with the falling items (10-90%).
      if (challengeActiveRef.current) {
        if (Math.abs(lastCameraXRef.current) > 0.5) {
          lastCameraXRef.current = 0;
          sceneDispatch({ type: 'UPDATE_CAMERA', cameraX: 0 });
        }
        animFrameRef.current = requestAnimationFrame(update);
        return;
      }

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

      // Smoothly interpolate toward target (lerp)
      const current = lastCameraXRef.current;
      const diff = targetCameraX - current;
      const smoothed = Math.abs(diff) < 0.05 ? targetCameraX : current + diff * LERP_SPEED;

      // Only dispatch if changed meaningfully (avoid unnecessary re-renders)
      if (Math.abs(smoothed - lastCameraXRef.current) > 0.01) {
        lastCameraXRef.current = smoothed;
        sceneDispatch({ type: 'UPDATE_CAMERA', cameraX: smoothed });
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
