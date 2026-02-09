import { useEffect, useCallback } from 'react';
import type { CollectibleDefinition } from '../../types/variety';
import { useScene } from '../../context/SceneContext';
import { useVariety } from '../../context/VarietyContext';
import { Collectible } from './Collectible';
import { PickupAnimation } from './PickupAnimation';

const PICKUP_RANGE = 5; // percentage of scene width

interface CollectibleLayerProps {
  collectibles: CollectibleDefinition[];
  groundY: number;
}

export function CollectibleLayer({ collectibles, groundY }: CollectibleLayerProps) {
  const { sceneState } = useScene();
  const { varietyState, collectItem, isCollected, varietyDispatch } = useVariety();

  // Proximity detection for collectibles
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    for (const item of collectibles) {
      if (isCollected(item.id)) continue;
      const distance = Math.abs(sceneState.playerX - item.x);
      if (distance < PICKUP_RANGE) {
        collectItem(item);
        return; // collect one at a time
      }
    }
  }, [sceneState.playerX, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, collectibles, isCollected, collectItem]);

  const handlePickupComplete = useCallback(() => {
    varietyDispatch({ type: 'CLEAR_PICKUP' });
  }, [varietyDispatch]);

  const visibleCollectibles = collectibles.filter(c => !isCollected(c.id));

  return (
    <>
      {visibleCollectibles.map(item => (
        <Collectible key={item.id} collectible={item} groundY={groundY} />
      ))}

      {varietyState.activePickup && (
        <PickupAnimation
          x={varietyState.activePickup.x}
          groundY={groundY}
          label={varietyState.activePickup.label}
          flavorText={varietyState.activePickup.flavorText}
          onComplete={handlePickupComplete}
        />
      )}
    </>
  );
}
