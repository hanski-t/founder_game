import type { ObstacleDefinition } from '../../types/platformer';

import barrelImg from '@assets/objects/obstacles/barrel.png';
import crateImg from '@assets/objects/obstacles/crate.png';
import stoneImg from '@assets/objects/obstacles/stone.png';

// Map obstacle types to sprite images
const OBSTACLE_SPRITES: Record<string, string> = {
  barrel: barrelImg,
  crate: crateImg,
  rock: stoneImg,
};

interface ObstacleLayerProps {
  obstacles: ObstacleDefinition[];
  groundY: number;
}

export function ObstacleLayer({ obstacles, groundY }: ObstacleLayerProps) {
  return (
    <>
      {obstacles.map((obs) => {
        const spriteSrc = OBSTACLE_SPRITES[obs.type];
        return (
          <div
            key={obs.id}
            className="obstacle"
            style={{
              position: 'absolute',
              left: `${obs.x}%`,
              top: `${groundY}%`,
              height: `${obs.height}%`,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 4,
              userSelect: 'none',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          >
            {spriteSrc ? (
              <img
                src={spriteSrc}
                alt={obs.type}
                style={{
                  height: '100%',
                  width: 'auto',
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
