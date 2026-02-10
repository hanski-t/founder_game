import { useState, useEffect } from 'react';
import type { SceneDefinition, SceneInteractable } from '../../types/scene';
import { ParallaxBackground } from './ParallaxBackground';
import { PlayerCharacter } from '../character/PlayerCharacter';
import { Interactable } from '../interactables/Interactable';
import { CollectibleLayer } from '../collectibles/CollectibleLayer';
import { ObstacleLayer } from '../obstacles/ObstacleLayer';
import { useScene } from '../../context/SceneContext';

interface SceneRendererProps {
  scene: SceneDefinition;
  onInteract: (interactable: SceneInteractable) => void;
  onObstacleCollision?: (direction: 'left' | 'right') => void;
}

export function SceneRenderer({ scene, onInteract, onObstacleCollision }: SceneRendererProps) {
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

  // Dismiss hint on first keypress
  useEffect(() => {
    if (!showHint) return;
    const dismissOnKey = () => setShowHint(false);
    window.addEventListener('keydown', dismissOnKey);
    return () => window.removeEventListener('keydown', dismissOnKey);
  }, [showHint]);

  // Find the first interactable to point the hint toward
  const firstNpc = scene.interactables[0];
  const hintDirection = firstNpc && firstNpc.x > sceneState.playerX ? 'right' : 'left';
  const hintArrow = hintDirection === 'right' ? '\u2192' : '\u2190';

  return (
    <div
      className={`scene-container ${sceneState.screenShake ? 'screen-shake' : ''}`}
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

      {scene.collectibles && scene.collectibles.length > 0 && (
        <CollectibleLayer collectibles={scene.collectibles} groundY={scene.groundY} />
      )}

      {scene.obstacles && scene.obstacles.length > 0 && onObstacleCollision && (
        <ObstacleLayer obstacles={scene.obstacles} groundY={scene.groundY} onCollision={onObstacleCollision} />
      )}

      <PlayerCharacter />

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
          Arrow keys to move, Space to jump {hintArrow} towards {firstNpc.label}
        </div>
      )}
    </div>
  );
}
