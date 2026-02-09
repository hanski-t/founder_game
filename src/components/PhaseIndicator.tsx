import { PHASES } from '../types/game';
import type { GamePhase } from '../types/game';

interface PhaseIndicatorProps {
  currentPhase: GamePhase;
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const phaseInfo = PHASES.find(p => p.id === currentPhase);
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="border-t border-terminal-border pt-3 mt-3">
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-neon-blue glow-blue text-xs font-bold tracking-wider truncate">
          {phaseInfo?.displayName || 'UNKNOWN PHASE'}
        </span>
        <span className="text-text-dim text-xs shrink-0">
          [{currentIndex + 1}/{PHASES.length}]
        </span>
      </div>
      <div className="flex gap-1">
        {PHASES.map((phase, index) => (
          <div
            key={phase.id}
            className={`h-1 flex-1 rounded-sm ${
              index < currentIndex
                ? 'bg-neon-green'
                : index === currentIndex
                ? 'bg-neon-blue'
                : 'bg-terminal-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
