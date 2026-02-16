import { useEffect } from 'react';
import type { CollectibleDefinition } from '../../types/variety';
import { useScene } from '../../context/SceneContext';
import { useVariety } from '../../context/VarietyContext';
import { Collectible } from './Collectible';

const PICKUP_RANGE = 5; // percentage of scene width

interface CollectibleLayerProps {
  collectibles: CollectibleDefinition[];
  groundY: number;
}

export function CollectibleLayer({ collectibles, groundY }: CollectibleLayerProps) {
  const { sceneState } = useScene();
  const { collectItem, isCollected } = useVariety();

  // Proximity detection for collectibles
  useEffect(() => {
    if (sceneState.showDecisionPanel || sceneState.showOutcomePanel || sceneState.isTransitioning) return;

    for (const item of collectibles) {
      if (isCollected(item.id)) continue;
      const distanceX = Math.abs(sceneState.playerX - item.x);
      // For elevated collectibles, also check Y proximity
      const itemY = item.y ?? groundY;
      const distanceY = Math.abs(sceneState.playerY - itemY);
      if (distanceX < PICKUP_RANGE && distanceY < PICKUP_RANGE) {
        collectItem({ ...item, y: itemY });
        return; // collect one at a time
      }
    }
  }, [sceneState.playerX, sceneState.playerY, sceneState.showDecisionPanel, sceneState.showOutcomePanel, sceneState.isTransitioning, collectibles, groundY, isCollected, collectItem]);

  const visibleCollectibles = collectibles.filter(c => !isCollected(c.id));

  return (
    <>
      {visibleCollectibles.map(item => (
        <Collectible key={item.id} collectible={item} groundY={groundY} />
      ))}
    </>
  );
}
