import type { CollectibleDefinition, CollectibleVisual } from '../../types/variety';

const VISUAL_MAP: Record<CollectibleVisual, { icon: string; color: string }> = {
  coin: { icon: '$', color: '#4ade80' },
  document: { icon: '\u2709', color: '#60a5fa' },
  coffee: { icon: '\u2615', color: '#f59e0b' },
  usb: { icon: '\u25AE', color: '#a78bfa' },
  scroll: { icon: '\u2620', color: '#d4a853' },
  gem: { icon: '\u25C6', color: '#f472b6' },
};

interface CollectibleProps {
  collectible: CollectibleDefinition;
  groundY: number;
}

export function Collectible({ collectible, groundY }: CollectibleProps) {
  const visual = VISUAL_MAP[collectible.visual];

  return (
    <div
      className="collectible"
      style={{
        left: `${collectible.x}%`,
        top: `${collectible.y ?? groundY}%`,
      }}
    >
      <div
        className="collectible-icon"
        style={{ color: visual.color }}
      >
        {visual.icon}
      </div>
      <div className="collectible-glow" style={{ backgroundColor: visual.color }} />
    </div>
  );
}
