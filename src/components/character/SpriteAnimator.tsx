import type { SpriteConfig } from '../../types/scene';

interface SpriteAnimatorProps {
  sheet: string;
  config: SpriteConfig;
  scale?: number;
  className?: string;
}

export function SpriteAnimator({ sheet, config, scale = 2, className = '' }: SpriteAnimatorProps) {
  const { frameWidth, frameHeight, frameCount, frameDuration } = config;
  const totalWidth = frameWidth * frameCount;
  const animDuration = (frameCount * frameDuration) / 1000;

  return (
    <div
      className={`sprite-animator ${className}`}
      style={{
        width: frameWidth * scale,
        height: frameHeight * scale,
        backgroundImage: `url(${sheet})`,
        backgroundSize: `${totalWidth * scale}px ${frameHeight * scale}px`,
        ['--sprite-end-x' as string]: `${-(totalWidth * scale)}px`,
        animation: `sprite-animate ${animDuration}s steps(${frameCount}) infinite`,
      }}
    />
  );
}
