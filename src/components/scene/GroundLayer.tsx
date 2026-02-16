import { useEffect, useRef, useState } from 'react';
import { GROUND_TILESETS } from '../../data/groundConfig';
import type { GroundHole, GroundSegment } from '../../types/scene';

interface GroundLayerProps {
  groundY: number;
  groundBiome: string;
  levelWidth: number;
  groundHoles?: GroundHole[];
  groundSegments?: GroundSegment[];
}

export function GroundLayer({ groundY, groundBiome, levelWidth, groundHoles, groundSegments }: GroundLayerProps) {
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

  // Build render segments: split by holes, then by height variations
  const segments = buildRenderSegments(0, levelWidth, groundY, groundHoles, groundSegments);

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
            top: `${seg.groundY}%`,
            width: `${seg.endX - seg.startX}%`,
            height: `${100 - seg.groundY}%`,
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

interface RenderSegment {
  startX: number;
  endX: number;
  groundY: number;
}

/** Build final render segments: remove holes, then split by height variations */
function buildRenderSegments(
  levelStart: number,
  levelEnd: number,
  defaultGroundY: number,
  holes?: GroundHole[],
  heightSegments?: GroundSegment[],
): RenderSegment[] {
  // Step 1: split by holes
  const solidPieces = getSolidSegments(levelStart, levelEnd, holes);

  // Step 2: if no height segments, return with default groundY
  if (!heightSegments || heightSegments.length === 0) {
    return solidPieces.map(s => ({ ...s, groundY: defaultGroundY }));
  }

  // Step 3: split each solid piece by height segment boundaries
  const result: RenderSegment[] = [];
  const sortedHeights = [...heightSegments].sort((a, b) => a.startX - b.startX);

  for (const piece of solidPieces) {
    // Collect all split points within this piece from height segment boundaries
    const splits: number[] = [piece.startX];
    for (const hs of sortedHeights) {
      if (hs.startX > piece.startX && hs.startX < piece.endX) splits.push(hs.startX);
      if (hs.endX > piece.startX && hs.endX < piece.endX) splits.push(hs.endX);
    }
    splits.push(piece.endX);

    // Deduplicate and sort
    const uniqueSplits = [...new Set(splits)].sort((a, b) => a - b);

    // Create sub-segments
    for (let i = 0; i < uniqueSplits.length - 1; i++) {
      const sx = uniqueSplits[i];
      const ex = uniqueSplits[i + 1];
      const midX = (sx + ex) / 2;

      // Find which height segment this midpoint falls in
      const hs = sortedHeights.find(h => midX >= h.startX && midX <= h.endX);
      result.push({
        startX: sx,
        endX: ex,
        groundY: hs ? hs.groundY : defaultGroundY,
      });
    }
  }

  return result;
}

/** Split the full level width into solid ground segments, excluding holes */
function getSolidSegments(
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
