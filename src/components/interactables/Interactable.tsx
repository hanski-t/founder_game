import type { SceneInteractable } from '../../types/scene';
import { SpriteAnimator } from '../character/SpriteAnimator';

interface InteractableProps {
  interactable: SceneInteractable;
}

export function Interactable({ interactable }: InteractableProps) {
  const { x, y, width, height, spriteSheet, spriteConfig, staticImage, label } = interactable;

  return (
    <div
      className="interactable"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        ...(spriteSheet ? {} : { width, height }),
        transform: 'translateX(-50%) translateY(-100%)',
        pointerEvents: 'none',
      }}
    >
      <div className="interactable-label">{label}</div>
      {spriteSheet && spriteConfig ? (
        <SpriteAnimator sheet={spriteSheet} config={spriteConfig} scale={2} />
      ) : staticImage ? (
        <img
          src={staticImage}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
            objectFit: 'contain',
          }}
          draggable={false}
        />
      ) : null}
    </div>
  );
}
