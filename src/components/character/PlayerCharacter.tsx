import { SpriteAnimator } from './SpriteAnimator';
import { useScene } from '../../context/SceneContext';
import heroIdle from '@assets/characters/player/hero-idle.png';
import heroRun from '@assets/characters/player/hero-run.png';

const PLAYER_SPRITES = {
  idle: { sheet: heroIdle, frameWidth: 160, frameHeight: 90, frameCount: 4, frameDuration: 200 },
  walk: { sheet: heroRun, frameWidth: 160, frameHeight: 90, frameCount: 6, frameDuration: 120 },
  // Jump uses idle sprite with CSS rotation for visual feedback
  jump: { sheet: heroIdle, frameWidth: 160, frameHeight: 90, frameCount: 4, frameDuration: 200 },
};

export function PlayerCharacter() {
  const { sceneState } = useScene();
  const { playerX, playerY, playerFacing, playerAnimation, knockbackActive } = sceneState;
  const spriteData = PLAYER_SPRITES[playerAnimation];
  const scale = 1.5;
  const isJumping = playerAnimation === 'jump';

  return (
    <div
      className={`player-character${knockbackActive ? ' knockback' : ''}`}
      style={{
        left: `${playerX}%`,
        top: `${playerY}%`,
        transform: `translateX(-50%) translateY(-100%) ${playerFacing === 'left' ? 'scaleX(-1)' : ''} ${isJumping ? 'rotate(-5deg) scale(1.05)' : ''}`,
        transition: knockbackActive ? 'none' : undefined,
      }}
    >
      <SpriteAnimator
        sheet={spriteData.sheet}
        config={spriteData}
        scale={scale}
      />
    </div>
  );
}
