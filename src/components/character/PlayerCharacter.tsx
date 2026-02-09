import { SpriteAnimator } from './SpriteAnimator';
import { useScene } from '../../context/SceneContext';
import heroIdle from '@assets/characters/player/hero-idle.png';
import heroRun from '@assets/characters/player/hero-run.png';

const PLAYER_SPRITES = {
  idle: { sheet: heroIdle, frameWidth: 160, frameHeight: 90, frameCount: 4, frameDuration: 200 },
  walk: { sheet: heroRun, frameWidth: 160, frameHeight: 90, frameCount: 6, frameDuration: 120 },
};

interface PlayerCharacterProps {
  groundY: number; // percentage from top
}

export function PlayerCharacter({ groundY }: PlayerCharacterProps) {
  const { sceneState } = useScene();
  const { playerX, playerFacing, playerAnimation } = sceneState;
  const spriteData = PLAYER_SPRITES[playerAnimation];
  const scale = 1.5;

  return (
    <div
      className="player-character"
      style={{
        left: `${playerX}%`,
        top: `${groundY}%`,
        transform: `translateX(-50%) translateY(-100%) ${playerFacing === 'left' ? 'scaleX(-1)' : ''}`,
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
