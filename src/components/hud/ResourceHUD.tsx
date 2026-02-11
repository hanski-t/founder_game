import type { ReactNode } from 'react';
import type { Resources, GamePhase } from '../../types/game';
import { RESOURCE_LIMITS } from '../../types/game';
import { PHASE_ATMOSPHERE } from '../../data/phaseConfig';
import { HourglassIcon, CoinIcon, FlameIcon, PeopleIcon } from './ResourceIcons';

interface ResourceHUDProps {
  resources: Resources;
  currentPhase: string;
}

interface ResourceItemProps {
  icon: ReactNode;
  label: string;
  value: number;
  maxValue: number;
  color: string;
  format?: (v: number) => string;
}

function ResourceItem({ icon, label, value, maxValue, color, format }: ResourceItemProps) {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const displayValue = format ? format(value) : String(value);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: '5px 10px',
      background: 'rgba(26, 15, 16, 0.6)',
      border: '1px solid rgba(90, 48, 48, 0.4)',
      borderRadius: 3,
      minWidth: 110,
    }}>
      {/* Top row: icon + label + value */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}>
        {icon}
        <span style={{
          fontFamily: 'var(--font-gothic)',
          fontSize: '0.6rem',
          color: '#e8d5b5',
          opacity: 0.7,
          letterSpacing: '0.08em',
          flex: 1,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color,
        }}>
          {displayValue}
        </span>
      </div>

      {/* Bar spanning full width */}
      <div className="gothic-resource-bar" style={{ width: '100%' }}>
        <div
          className="gothic-resource-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function ResourceHUD({ resources, currentPhase }: ResourceHUDProps) {
  const phaseConfig = PHASE_ATMOSPHERE[currentPhase as GamePhase];
  const phaseLabel =
    currentPhase === 'university' ? 'Phase 1' :
    currentPhase === 'firstStartup' ? 'Phase 2' :
    currentPhase === 'growth' ? 'Phase 3' :
    currentPhase === 'scaling' ? 'Phase 4' : 'Phase 5';

  const energyColor = resources.energy > 25 ? '#fbbf24' : '#f87171';

  return (
    <div className="resource-hud">
      <div style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '6px 10px',
        background: 'rgba(10, 6, 7, 0.9)',
        border: `1px solid ${phaseConfig.accentColor}40`,
        borderTop: 'none',
        borderRadius: '0 0 6px 6px',
        pointerEvents: 'auto',
      }}>
        <ResourceItem
          icon={<HourglassIcon color="#60a5fa" />}
          label="MOMENTUM"
          value={resources.momentum}
          maxValue={RESOURCE_LIMITS.momentum.max}
          color="#60a5fa"
          format={(v) => `${v}%`}
        />
        <ResourceItem
          icon={<CoinIcon color="#4ade80" />}
          label="MONEY"
          value={resources.money}
          maxValue={RESOURCE_LIMITS.money.max}
          color="#4ade80"
          format={(v) => {
            if (v >= 1000) {
              const k = v / 1000;
              return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
            }
            return `$${v}`;
          }}
        />
        <ResourceItem
          icon={<FlameIcon color={energyColor} />}
          label="ENERGY"
          value={resources.energy}
          maxValue={RESOURCE_LIMITS.energy.max}
          color={energyColor}
          format={(v) => `${v}%`}
        />
        <ResourceItem
          icon={<PeopleIcon color="#a78bfa" />}
          label="REPUTATION"
          value={resources.reputation}
          maxValue={RESOURCE_LIMITS.reputation.max}
          color="#a78bfa"
          format={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
        />

        {/* Phase indicator */}
        <div style={{
          fontFamily: 'var(--font-gothic)',
          fontSize: '0.6rem',
          color: phaseConfig.accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.7,
          marginLeft: 4,
          whiteSpace: 'nowrap',
        }}>
          {phaseLabel}
        </div>
      </div>
    </div>
  );
}
