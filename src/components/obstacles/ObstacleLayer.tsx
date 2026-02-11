import type { ObstacleDefinition } from '../../types/platformer';

import barrelImg from '@assets/objects/obstacles/barrel.png';
import crateImg from '@assets/objects/obstacles/crate.png';
import stoneImg from '@assets/objects/obstacles/stone.png';

// Map obstacle types to sprite images and display sizes (px)
const OBSTACLE_SPRITES: Record<string, { src: string; displayW: number; displayH: number }> = {
  barrel: { src: barrelImg, displayW: 24 * 2, displayH: 30 * 2 },
  crate: { src: crateImg, displayW: 39 * 2, displayH: 35 * 2 },
  rock: { src: stoneImg, displayW: 27 * 2, displayH: 39 * 2 },
};

interface ObstacleLayerProps {
  obstacles: ObstacleDefinition[];
  groundY: number;
}

export function ObstacleLayer({ obstacles, groundY }: ObstacleLayerProps) {
  return (
    <>
      {obstacles.map((obs) => {
        const sprite = OBSTACLE_SPRITES[obs.type];
        return (
          <div
            key={obs.id}
            className="obstacle"
            style={{
              position: 'absolute',
              left: `${obs.x}%`,
              top: `${groundY}%`,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 4,
              userSelect: 'none',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          >
            {sprite ? (
              <img
                src={sprite.src}
                alt={obs.type}
                style={{
                  width: sprite.displayW,
                  height: sprite.displayH,
                  imageRendering: 'pixelated',
                }}
                draggable={false}
              />
            ) : (
              <span style={{ fontSize: '2rem' }}>?</span>
            )}
          </div>
        );
      })}
    </>
  );
}
