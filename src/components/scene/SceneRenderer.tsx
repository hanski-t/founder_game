import { useState, useEffect } from 'react';
import type { SceneDefinition } from '../../types/scene';
import type { PlatformDefinition } from '../../types/platformer';
import { ParallaxBackground } from './ParallaxBackground';
import { PlayerCharacter } from '../character/PlayerCharacter';
import { Interactable } from '../interactables/Interactable';
import { CollectibleLayer } from '../collectibles/CollectibleLayer';
import { PickupAnimation } from '../collectibles/PickupAnimation';
import { ObstacleLayer } from '../obstacles/ObstacleLayer';
import { EnemyLayer } from '../enemies/EnemyLayer';
import { PlatformLayer } from '../platforms/PlatformLayer';
import { AtmosphericOverlay } from './AtmosphericOverlay';
import { GroundLayer } from './GroundLayer';
import { useScene } from '../../context/SceneContext';
import { useVariety } from '../../context/VarietyContext';
import { usePhaseConfig } from '../../hooks/usePhaseConfig';

interface SceneRendererProps {
  scene: SceneDefinition;
  onObstacleCollision?: (direction: 'left' | 'right', enemyType: string) => void;
  challengeActive?: boolean;
  resolvedPlatforms?: PlatformDefinition[];
}

export function SceneRenderer({ scene, onObstacleCollision, challengeActive, resolvedPlatforms }: SceneRendererProps) {
  const { sceneDispatch, sceneState } = useScene();
  const { varietyState, varietyDispatch } = useVariety();
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
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          transform: `translateX(${-sceneState.cameraX}vw)`,
          willChange: 'transform',
          zIndex: 3,
        }}
      >
        {/* Ground surface layer — always visible, scrolls with world */}
        {scene.groundBiome && (
          <GroundLayer
            groundY={scene.groundY}
            groundBiome={scene.groundBiome}
            levelWidth={scene.levelWidth}
            groundHoles={challengeActive ? undefined : scene.groundHoles}
            groundSegments={scene.groundSegments}
          />
        )}

        {!challengeActive && (
          <>
            {scene.interactables.map((obj) => (
              <Interactable
                key={obj.id}
                interactable={obj}
              />
            ))}

            {scene.collectibles && scene.collectibles.length > 0 && (
              <CollectibleLayer collectibles={scene.collectibles} groundY={scene.groundY} />
            )}

            {(resolvedPlatforms || scene.platforms) && (resolvedPlatforms || scene.platforms)!.length > 0 && (
              <PlatformLayer platforms={resolvedPlatforms || scene.platforms!} />
            )}

            {scene.obstacles && scene.obstacles.length > 0 && (
              <ObstacleLayer obstacles={scene.obstacles} groundY={scene.groundY} groundSegments={scene.groundSegments} />
            )}

            {scene.enemies && scene.enemies.length > 0 && onObstacleCollision && (
              <EnemyLayer enemies={scene.enemies} groundY={scene.groundY} onCollision={onObstacleCollision} />
            )}
          </>
        )}

        <PlayerCharacter />
      </div>

      {/* Pickup animation: rendered outside scene-world so it's always on top */}
      {varietyState.activePickup && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50,
            transform: `translateX(${-sceneState.cameraX}vw)`,
          }}
        >
          <PickupAnimation
            x={varietyState.activePickup.x}
            y={varietyState.activePickup.y}
            label={varietyState.activePickup.label}
            flavorText={varietyState.activePickup.flavorText}
            onComplete={() => varietyDispatch({ type: 'CLEAR_PICKUP' })}
          />
        </div>
      )}

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
