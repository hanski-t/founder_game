import type { SceneInteractable } from '../../types/scene';
import { SpriteAnimator } from '../character/SpriteAnimator';
import { useScene } from '../../context/SceneContext';

interface InteractableProps {
  interactable: SceneInteractable;
  onInteract: (interactable: SceneInteractable) => void;
}

export function Interactable({ interactable, onInteract }: InteractableProps) {
  const { sceneDispatch } = useScene();
  const { x, y, width, height, spriteSheet, spriteConfig, staticImage, label } = interactable;

  return (
    <div
      className="interactable"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        ...(spriteSheet ? {} : { width, height }),
        transform: 'translateX(-50%) translateY(-100%)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onInteract(interactable);
      }}
      onMouseEnter={() => sceneDispatch({ type: 'HOVER_INTERACTABLE', id: interactable.id })}
      onMouseLeave={() => sceneDispatch({ type: 'HOVER_INTERACTABLE', id: null })}
    >
      <div className="interactable-marker">!</div>
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
