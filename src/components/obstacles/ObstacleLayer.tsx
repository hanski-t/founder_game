import type { ObstacleDefinition } from '../../types/platformer';
import type { GroundSegment } from '../../types/scene';
import { getGroundYAtX } from '../../utils/groundHeight';

import barrelImg from '@assets/objects/obstacles/barrel.png';
import crateImg from '@assets/objects/obstacles/crate.png';
import stoneImg from '@assets/objects/obstacles/stone.png';
import bushImg from '@assets/objects/obstacles/bush.png';
import graveImg from '@assets/objects/obstacles/grave.png';

// Map obstacle types to sprite images
const OBSTACLE_SPRITES: Record<string, string> = {
  barrel: barrelImg,
  crate: crateImg,
  rock: stoneImg,
  bush: bushImg,
  grave: graveImg,
};

interface ObstacleLayerProps {
  obstacles: ObstacleDefinition[];
  groundY: number;
  groundSegments?: GroundSegment[];
}

export function ObstacleLayer({ obstacles, groundY, groundSegments }: ObstacleLayerProps) {
  return (
    <>
      {obstacles.map((obs) => {
        const spriteSrc = OBSTACLE_SPRITES[obs.type];
        const localGroundY = getGroundYAtX(obs.x, groundY, groundSegments);
        return (
          <div
            key={obs.id}
            style={{
              position: 'absolute',
              left: `${obs.x}%`,
              top: `${localGroundY}%`,
              width: `${obs.width}%`,
              height: `${obs.height}%`,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 4,
              userSelect: 'none',
            }}
          >
            <img
              src={spriteSrc}
              alt={obs.type}
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              }}
              draggable={false}
            />
          </div>
        );
      })}
    </>
  );
}
