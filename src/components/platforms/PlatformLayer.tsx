import type { PlatformDefinition } from '../../types/platformer';

const PLATFORM_STYLES: Record<string, { bg: string; border: string; shadow: string }> = {
  wood: {
    bg: 'linear-gradient(180deg, #8B6914 0%, #6B4F14 100%)',
    border: '2px solid #4a3510',
    shadow: '0 3px 6px rgba(0,0,0,0.4)',
  },
  stone: {
    bg: 'linear-gradient(180deg, #6B6B6B 0%, #4a4a4a 100%)',
    border: '2px solid #333',
    shadow: '0 3px 6px rgba(0,0,0,0.5)',
  },
  metal: {
    bg: 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)',
    border: '2px solid #4B5563',
    shadow: '0 3px 8px rgba(0,0,0,0.4)',
  },
};

const PLATFORM_HEIGHT = 1.2; // percentage height (thin ledge)

interface PlatformLayerProps {
  platforms: PlatformDefinition[];
}

export function PlatformLayer({ platforms }: PlatformLayerProps) {
  return (
    <>
      {platforms.map((plat) => {
        const style = PLATFORM_STYLES[plat.visual] || PLATFORM_STYLES.stone;
        return (
          <div
            key={plat.id}
            className="platform"
            style={{
              position: 'absolute',
              left: `${plat.x}%`,
              top: `${plat.y}%`,
              width: `${plat.width}%`,
              height: `${PLATFORM_HEIGHT}vh`,
              background: style.bg,
              border: style.border,
              borderRadius: '3px',
              boxShadow: style.shadow,
              zIndex: 3,
            }}
          />
        );
      })}
    </>
  );
}
