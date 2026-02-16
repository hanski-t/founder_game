import { useEffect, useRef, useState } from 'react';
import { GROUND_TILESETS } from '../../data/groundConfig';
import type { GroundHole } from '../../types/scene';

interface GroundLayerProps {
  groundY: number;
  groundBiome: string;
  levelWidth: number;
  groundHoles?: GroundHole[];
}

export function GroundLayer({ groundY, groundBiome, levelWidth, groundHoles }: GroundLayerProps) {
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const config = GROUND_TILESETS[groundBiome];

  // Extract ground tile region from spritesheet → data URL for CSS repeat (tileset mode only)
  useEffect(() => {
    if (!config || config.type !== 'tileset') return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = config.src;
    imgRef.current = img;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = config.sourceWidth;
      canvas.height = config.sourceHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        config.sourceX, config.sourceY,
        config.sourceWidth, config.sourceHeight,
        0, 0,
        config.sourceWidth, config.sourceHeight,
      );

      setTileUrl(canvas.toDataURL('image/png'));
    };

    return () => {
      imgRef.current = null;
    };
  }, [config]);

  if (!config) return null;

  // Build ground segments between holes
  const segments = getGroundSegments(0, levelWidth, groundHoles);

  // Compute background styles based on config type
  const bgStyles = config.type === 'css'
    ? {
        backgroundImage: config.backgroundImage,
        backgroundSize: config.backgroundSize,
        backgroundRepeat: 'repeat' as const,
      }
    : {
        backgroundImage: tileUrl ? `url(${tileUrl})` : undefined,
        backgroundRepeat: 'repeat-x' as const,
        backgroundSize: `${config.sourceWidth * config.scale}px ${config.sourceHeight * config.scale}px`,
      };

  return (
    <>
      {segments.map((seg, i) => (
        <div
          key={i}
          className="ground-layer"
          style={{
            position: 'absolute',
            left: `${seg.startX}%`,
            top: `${groundY}%`,
            width: `${seg.endX - seg.startX}%`,
            height: `${100 - groundY}%`,
            backgroundColor: config.fillColor,
            ...bgStyles,
            backgroundPosition: config.type === 'tileset' ? `${-seg.startX * 2}px 0` : undefined,
            zIndex: 2,
            overflow: 'hidden',
          }}
        />
      ))}
    </>
  );
}

/** Split the full level width into solid ground segments, excluding holes */
function getGroundSegments(
  levelStart: number,
  levelEnd: number,
  holes?: GroundHole[],
): { startX: number; endX: number }[] {
  if (!holes || holes.length === 0) {
    return [{ startX: levelStart, endX: levelEnd }];
  }

  const sorted = [...holes].sort((a, b) => a.startX - b.startX);
  const segments: { startX: number; endX: number }[] = [];
  let cursor = levelStart;

  for (const hole of sorted) {
    if (hole.startX > cursor) {
      segments.push({ startX: cursor, endX: hole.startX });
    }
    cursor = hole.endX;
  }

  if (cursor < levelEnd) {
    segments.push({ startX: cursor, endX: levelEnd });
  }

  return segments;
}
