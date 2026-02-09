import { useState, useEffect } from 'react';
import type { SceneDefinition, SceneInteractable } from '../../types/scene';
import { ParallaxBackground } from './ParallaxBackground';
import { PlayerCharacter } from '../character/PlayerCharacter';
import { Interactable } from '../interactables/Interactable';
import { useScene } from '../../context/SceneContext';

interface SceneRendererProps {
  scene: SceneDefinition;
  onInteract: (interactable: SceneInteractable) => void;
}

export function SceneRenderer({ scene, onInteract }: SceneRendererProps) {
  const { sceneDispatch, sceneState } = useScene();
  const isFirstScene = scene.id === 'town-square';
  const [showHint, setShowHint] = useState(isFirstScene);

  // Show hint only on first scene load
  useEffect(() => {
    if (!isFirstScene) return;
    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, [isFirstScene]);

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    sceneDispatch({ type: 'SET_PENDING_INTERACTABLE', id: null });
    sceneDispatch({ type: 'SET_PLAYER_TARGET', x: Math.max(2, Math.min(98, clickX)) });
    setShowHint(false);
  };

  // Find the first interactable to point the hint toward
  const firstNpc = scene.interactables[0];
  const hintDirection = firstNpc && firstNpc.x > sceneState.playerX ? 'right' : 'left';
  const hintArrow = hintDirection === 'right' ? '\u2192' : '\u2190';

  return (
    <div
      className={`scene-container ${sceneState.screenShake ? 'screen-shake' : ''}`}
      onClick={handleSceneClick}
      onAnimationEnd={() => {
        if (sceneState.screenShake) {
          sceneDispatch({ type: 'STOP_SCREEN_SHAKE' });
        }
      }}
    >
      <ParallaxBackground
        layers={scene.backgroundLayers}
        ambientColor={scene.ambientColor}
      />

      {scene.interactables.map((obj) => (
        <Interactable
          key={obj.id}
          interactable={obj}
          onInteract={onInteract}
        />
      ))}

      <PlayerCharacter groundY={scene.groundY} />

      {/* Hint for new players */}
      {showHint && !sceneState.showDecisionPanel && !sceneState.showOutcomePanel && firstNpc && (
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '15%',
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#d4a853',
            fontFamily: 'var(--font-gothic)',
            fontSize: '14px',
            border: '1px solid #5a3030',
            whiteSpace: 'nowrap',
            zIndex: 15,
            animation: 'hint-fade 4s ease-in-out forwards',
            pointerEvents: 'none',
          }}
        >
          Walk towards {firstNpc.label} {hintArrow}
        </div>
      )}
    </div>
  );
}
