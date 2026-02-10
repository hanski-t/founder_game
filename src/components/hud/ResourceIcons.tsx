// Pixel-art-styled SVG icons for resource display.
// Used by both the HUD bar and the decision panel.

interface IconProps {
  color: string;
  size?: number;
}

export function HourglassIcon({ color, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="1" width="10" height="2" fill={color} />
      <rect x="4" y="3" width="6" height="1" fill={color} opacity="0.7" />
      <rect x="5" y="4" width="4" height="1" fill={color} opacity="0.5" />
      <rect x="6" y="5" width="2" height="2" fill={color} />
      <rect x="5" y="7" width="4" height="1" fill={color} opacity="0.5" />
      <rect x="4" y="8" width="6" height="1" fill={color} opacity="0.7" />
      <rect x="3" y="9" width="8" height="1" fill={color} opacity="0.85" />
      <rect x="2" y="10" width="10" height="2" fill={color} />
    </svg>
  );
}

export function CoinIcon({ color, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="1" width="6" height="1" fill={color} />
      <rect x="3" y="2" width="1" height="1" fill={color} />
      <rect x="10" y="2" width="1" height="1" fill={color} />
      <rect x="2" y="3" width="1" height="7" fill={color} />
      <rect x="11" y="3" width="1" height="7" fill={color} />
      <rect x="3" y="10" width="1" height="1" fill={color} />
      <rect x="10" y="10" width="1" height="1" fill={color} />
      <rect x="4" y="11" width="6" height="1" fill={color} />
      <rect x="3" y="3" width="8" height="7" fill={color} opacity="0.3" />
      <rect x="7" y="3" width="1" height="1" fill={color} opacity="0.9" />
      <rect x="5" y="4" width="4" height="1" fill={color} opacity="0.9" />
      <rect x="5" y="5" width="2" height="1" fill={color} opacity="0.9" />
      <rect x="6" y="6" width="2" height="1" fill={color} opacity="0.9" />
      <rect x="7" y="7" width="2" height="1" fill={color} opacity="0.9" />
      <rect x="5" y="8" width="4" height="1" fill={color} opacity="0.9" />
      <rect x="6" y="9" width="1" height="1" fill={color} opacity="0.9" />
    </svg>
  );
}

export function FlameIcon({ color, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
      <rect x="7" y="1" width="1" height="1" fill={color} />
      <rect x="6" y="2" width="2" height="1" fill={color} />
      <rect x="6" y="3" width="3" height="1" fill={color} />
      <rect x="5" y="4" width="4" height="1" fill={color} />
      <rect x="4" y="5" width="6" height="1" fill={color} />
      <rect x="4" y="6" width="6" height="1" fill={color} opacity="0.9" />
      <rect x="4" y="7" width="7" height="1" fill={color} opacity="0.85" />
      <rect x="3" y="8" width="7" height="1" fill={color} opacity="0.8" />
      <rect x="6" y="5" width="2" height="2" fill="#fff" opacity="0.35" />
      <rect x="4" y="9" width="6" height="1" fill={color} opacity="0.7" />
      <rect x="5" y="10" width="5" height="1" fill={color} opacity="0.5" />
      <rect x="5" y="11" width="4" height="1" fill={color} opacity="0.3" />
    </svg>
  );
}

export function PeopleIcon({ color, size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="3" height="3" rx="1" fill={color} opacity="0.8" />
      <rect x="1" y="6" width="5" height="1" fill={color} opacity="0.7" />
      <rect x="2" y="7" width="3" height="3" fill={color} opacity="0.5" />
      <rect x="9" y="2" width="3" height="3" rx="1" fill={color} />
      <rect x="8" y="6" width="5" height="1" fill={color} opacity="0.85" />
      <rect x="9" y="7" width="3" height="3" fill={color} opacity="0.65" />
      <rect x="5" y="4" width="4" height="1" fill={color} opacity="0.4" />
    </svg>
  );
}

// Map resource keys to their icon component and color
export const RESOURCE_ICON_MAP = {
  momentum: { Icon: HourglassIcon, color: '#60a5fa' },
  money: { Icon: CoinIcon, color: '#4ade80' },
  energy: { Icon: FlameIcon, color: '#fbbf24' },
  reputation: { Icon: PeopleIcon, color: '#a78bfa' },
} as const;
