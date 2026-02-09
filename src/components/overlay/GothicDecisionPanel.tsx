import type { DecisionNode, Choice, ResourceChange } from '../../types/game';
import type { Resources } from '../../types/game';
import { RESOURCE_ICON_MAP } from '../hud/ResourceIcons';

interface GothicDecisionPanelProps {
  node: DecisionNode;
  resources: Resources;
  onChoice: (choice: Choice) => void;
  onClose?: () => void;
  isFirstDecision?: boolean;
}

function ResourceChangeChip({ resource, value }: { resource: string; value: number }) {
  const mapping = RESOURCE_ICON_MAP[resource as keyof typeof RESOURCE_ICON_MAP];
  if (!mapping) return null;

  const { Icon, color } = mapping;
  const isPositive = value > 0;
  const displayColor = isPositive ? 'var(--color-gothic-positive)' : 'var(--color-gothic-negative)';

  // Human-readable labels with units
  const labels: Record<string, { pos: string; neg: string }> = {
    time: { pos: `+${value} weeks`, neg: `${value} weeks` },
    money: { pos: `+$${Math.abs(value).toLocaleString()}`, neg: `-$${Math.abs(value).toLocaleString()}` },
    energy: { pos: `+${value}% stamina`, neg: `${value}% stamina` },
    network: { pos: `+${value} contacts`, neg: `${value} contacts` },
  };

  const label = isPositive ? labels[resource]?.pos : labels[resource]?.neg;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: displayColor,
      fontSize: '0.7rem',
      padding: '2px 6px',
      background: isPositive ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)',
      borderRadius: 3,
      border: `1px solid ${isPositive ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`,
    }}>
      <Icon color={color} size={11} />
      {label}
    </span>
  );
}

// Generate a brief plain-language summary of what a choice costs/gives
function choiceSummary(changes: ResourceChange): string {
  const parts: string[] = [];

  if (changes.time && changes.time < 0) parts.push(`takes ${Math.abs(changes.time)} weeks`);
  if (changes.money && changes.money < 0) parts.push(`costs $${Math.abs(changes.money).toLocaleString()}`);
  if (changes.energy && changes.energy < 0) parts.push(`drains ${Math.abs(changes.energy)}% stamina`);
  if (changes.money && changes.money > 0) parts.push(`earns $${changes.money.toLocaleString()}`);
  if (changes.energy && changes.energy > 0) parts.push(`restores ${changes.energy}% stamina`);
  if (changes.network && changes.network > 0) parts.push(`gains ${changes.network} contacts`);
  if (changes.network && changes.network < 0) parts.push(`loses ${Math.abs(changes.network)} contacts`);
  if (changes.time && changes.time > 0) parts.push(`saves ${changes.time} weeks`);

  if (parts.length === 0) return '';
  // Capitalize first letter
  const sentence = parts.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function GothicDecisionPanel({ node, onChoice, isFirstDecision }: GothicDecisionPanelProps) {
  return (
    <div className="gothic-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="gothic-panel">
        {/* Title */}
        <div className="gothic-panel-title">
          {node.isRandomEvent && (
            <span style={{ color: '#ffd700', fontSize: '0.8rem', marginRight: 8 }}>RANDOM EVENT</span>
          )}
          {node.title}
        </div>

        {/* Description */}
        <div className="gothic-panel-description">
          {node.description}
        </div>

        {/* Resource legend - only on first decision to teach the player */}
        {isFirstDecision && (
          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 14,
            fontSize: '0.6rem',
            opacity: 0.45,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gothic-text)',
            flexWrap: 'wrap',
          }}>
            {(['time', 'money', 'energy', 'network'] as const).map((key) => {
              const { Icon, color } = RESOURCE_ICON_MAP[key];
              const hint = {
                time: '0 = game over',
                money: '$0 = game over',
                energy: '0% = burnout',
                network: 'more = more options',
              }[key];
              return (
                <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <Icon color={color} size={10} />
                  {hint}
                </span>
              );
            })}
          </div>
        )}

        {/* Choices */}
        {node.choices.map((choice, index) => {
          const summary = choiceSummary(choice.resourceChanges);
          const hasChanges = Object.values(choice.resourceChanges).some(v => v !== undefined && v !== 0);

          return (
            <div
              key={choice.id}
              className="gothic-choice-card"
              onClick={() => onChoice(choice)}
            >
              <div className="gothic-choice-text">
                <span style={{ color: 'var(--color-gothic-gold)', marginRight: 8 }}>
                  [{String.fromCharCode(65 + index)}]
                </span>
                {choice.text}
                {choice.triggersMiniGame && (
                  <span style={{
                    marginLeft: 8,
                    color: 'var(--color-gothic-highlight)',
                    fontSize: '0.75rem',
                  }}>
                    [MINI-GAME]
                  </span>
                )}
              </div>

              {hasChanges && (
                <>
                  {/* Resource change chips */}
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 8,
                    flexWrap: 'wrap',
                  }}>
                    {choice.resourceChanges.time && (
                      <ResourceChangeChip resource="time" value={choice.resourceChanges.time} />
                    )}
                    {choice.resourceChanges.money && (
                      <ResourceChangeChip resource="money" value={choice.resourceChanges.money} />
                    )}
                    {choice.resourceChanges.energy && (
                      <ResourceChangeChip resource="energy" value={choice.resourceChanges.energy} />
                    )}
                    {choice.resourceChanges.network && (
                      <ResourceChangeChip resource="network" value={choice.resourceChanges.network} />
                    )}
                  </div>

                  {/* Plain-language summary - only on first decision */}
                  {isFirstDecision && summary && (
                    <div style={{
                      marginTop: 5,
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-gothic-text)',
                      opacity: 0.45,
                      fontStyle: 'italic',
                    }}>
                      {summary}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
