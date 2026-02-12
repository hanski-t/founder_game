import { useState, useEffect } from 'react';
import type { SceneDefinition, SceneInteractable } from '../../types/scene';
import type { PlatformDefinition } from '../../types/platformer';
import { ParallaxBackground } from './ParallaxBackground';
import { PlayerCharacter } from '../character/PlayerCharacter';
import { Interactable } from '../interactables/Interactable';
import { CollectibleLayer } from '../collectibles/CollectibleLayer';
import { ObstacleLayer } from '../obstacles/ObstacleLayer';
import { EnemyLayer } from '../enemies/EnemyLayer';
import { PlatformLayer } from '../platforms/PlatformLayer';
import { AtmosphericOverlay } from './AtmosphericOverlay';
import { useScene } from '../../context/SceneContext';
import { usePhaseConfig } from '../../hooks/usePhaseConfig';

interface SceneRendererProps {
  scene: SceneDefinition;
  onInteract: (interactable: SceneInteractable) => void;
  onObstacleCollision?: (direction: 'left' | 'right') => void;
  challengeActive?: boolean;
  resolvedPlatforms?: PlatformDefinition[];
}

export function SceneRenderer({ scene, onInteract, onObstacleCollision, challengeActive, resolvedPlatforms }: SceneRendererProps) {
  const { sceneDispatch, sceneState } = useScene();
  const phaseConfig = usePhaseConfig();
  const isFirstScene = scene.id === 'town-square';
  const [showHint, setShowHint] = useState(isFirstScene);

  // Show hint only on first scene load (dismissed by keypress, not timer)
  useEffect(() => {
    if (!isFirstScene) return;
    setShowHint(true);
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
      className={`scene-container ${phaseConfig.cssClass} ${sceneState.screenShake ? 'screen-shake' : ''} ${challengeActive ? 'challenge-mode' : ''}`}
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

      <AtmosphericOverlay />

      {/* Camera-offset world wrapper: all game elements scroll together */}
      <div
        className="scene-world"
        style={{
          position: 'absolute',
          left: `${-sceneState.cameraX}%`,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        {!challengeActive && (
          <>
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

            {(resolvedPlatforms || scene.platforms) && (resolvedPlatforms || scene.platforms)!.length > 0 && (
              <PlatformLayer platforms={resolvedPlatforms || scene.platforms!} />
            )}

            {scene.obstacles && scene.obstacles.length > 0 && (
              <ObstacleLayer obstacles={scene.obstacles} groundY={scene.groundY} />
            )}

            {scene.enemies && scene.enemies.length > 0 && onObstacleCollision && (
              <EnemyLayer enemies={scene.enemies} groundY={scene.groundY} onCollision={onObstacleCollision} />
            )}
          </>
        )}

        <PlayerCharacter />
      </div>

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
            animation: 'hint-pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        >
          Arrow keys to move, Space to jump {hintArrow} towards {firstNpc.label}
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: 4 }}>Press any key to dismiss</div>
        </div>
      )}
    </div>
  );
}
