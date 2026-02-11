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
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      maxHeight: '70vh',
      overflow: 'hidden',
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
        marginBottom: 2,
      }}>
        JOURNEY LOG
      </div>

      {milestones.map((m, i) => (
        <MilestoneCard key={m.id} milestone={m} index={i} />
      ))}
    </div>
  );
}
