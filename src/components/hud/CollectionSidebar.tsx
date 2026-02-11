import { useMilestones } from '../../hooks/useMilestones';
import type { ActiveMilestone } from '../../hooks/useMilestones';

/** Shows first frame of an NPC sprite sheet as a small portrait. */
function SpriteThumb({ src, frameWidth, frameHeight }: {
  src: string;
  frameWidth: number;
  frameHeight: number;
}) {
  const targetHeight = 30;
  const scale = targetHeight / frameHeight;
  return (
    <div style={{
      width: Math.round(frameWidth * scale),
      height: targetHeight,
      backgroundImage: `url(${src})`,
      backgroundPosition: '0 0',
      backgroundSize: `auto ${targetHeight}px`,
      backgroundRepeat: 'no-repeat',
      imageRendering: 'pixelated',
      borderRadius: 2,
      border: '1px solid rgba(90, 48, 48, 0.5)',
      flexShrink: 0,
    }} />
  );
}

function MilestoneCard({ milestone, index }: { milestone: ActiveMilestone; index: number }) {
  return (
    <div style={{
      padding: '6px 8px',
      background: 'rgba(26, 15, 16, 0.8)',
      border: '1px solid rgba(90, 48, 48, 0.4)',
      borderRadius: 4,
      width: 145,
      flexShrink: 0,
      animation: `gothic-fade-in 0.5s ease-out ${index * 0.12}s both`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {milestone.sprite ? (
          <SpriteThumb
            src={milestone.sprite.src}
            frameWidth={milestone.sprite.frameWidth}
            frameHeight={milestone.sprite.frameHeight}
          />
        ) : (
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{milestone.icon}</span>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-gothic)',
            fontSize: '0.6rem',
            color: '#e8d5b5',
            fontWeight: 600,
            lineHeight: 1.2,
          }}>
            {milestone.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: '#e8d5b5',
            opacity: 0.45,
            lineHeight: 1.3,
            marginTop: 1,
          }}>
            {milestone.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionSidebar() {
  const milestones = useMilestones();

  // Hide when nothing to show yet
  if (milestones.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 6,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      width: '92vw',
      maxWidth: 960,
      pointerEvents: 'none',
    }}>
      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-gothic)',
        fontSize: '0.55rem',
        color: '#e8d5b5',
        letterSpacing: '0.15em',
        opacity: 0.5,
        textAlign: 'center',
      }}>
        JOURNEY LOG
      </div>

      {/* Cards row */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
      }}>
        {milestones.map((m, i) => (
          <MilestoneCard key={m.id} milestone={m} index={i} />
        ))}
      </div>
    </div>
  );
}
