import { useEffect, useRef, useState } from 'react';
import type { PlatformDefinition } from '../types/platformer';

export interface MovingPlatformState {
  resolvedPlatforms: PlatformDefinition[];
  platformDeltas: Map<string, { dx: number; dy: number }>;
}

export function useMovingPlatforms(platforms: PlatformDefinition[]): MovingPlatformState {
  const [resolved, setResolved] = useState<PlatformDefinition[]>(platforms);
  const deltasRef = useRef<Map<string, { dx: number; dy: number }>>(new Map());
  const prevPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const animFrameRef = useRef(0);
  const startTimeRef = useRef(0);

  // Check if any platforms are actually moving
  const hasMovingPlatforms = platforms.some(p => p.moveAxis);

  useEffect(() => {
    // If no moving platforms, just pass through the static definitions
    if (!hasMovingPlatforms) {
      setResolved(platforms);
      deltasRef.current = new Map();
      return;
    }

    // Initialize previous positions
    const initPositions = new Map<string, { x: number; y: number }>();
    for (const p of platforms) {
      initPositions.set(p.id, { x: p.x, y: p.y });
    }
    prevPositionsRef.current = initPositions;
    startTimeRef.current = 0;

    const update = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const newDeltas = new Map<string, { dx: number; dy: number }>();

      const newResolved = platforms.map(p => {
        if (!p.moveAxis || !p.moveRange || !p.moveSpeed) {
          newDeltas.set(p.id, { dx: 0, dy: 0 });
          return p;
        }

        // Sinusoidal oscillation
        const offset = Math.sin(elapsed * p.moveSpeed * Math.PI * 2) * p.moveRange;

        let newX = p.x;
        let newY = p.y;

        if (p.moveAxis === 'horizontal') {
          newX = p.x + offset;
        } else {
          newY = p.y + offset;
        }

        // Calculate delta from previous frame
        const prev = prevPositionsRef.current.get(p.id) || { x: p.x, y: p.y };
        newDeltas.set(p.id, { dx: newX - prev.x, dy: newY - prev.y });
        prevPositionsRef.current.set(p.id, { x: newX, y: newY });

        return { ...p, x: newX, y: newY };
      });

      deltasRef.current = newDeltas;
      setResolved(newResolved);

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [platforms, hasMovingPlatforms]);

  return { resolvedPlatforms: resolved, platformDeltas: deltasRef.current };
}
