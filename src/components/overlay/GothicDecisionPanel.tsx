import { useState, useEffect } from 'react';
import type { DecisionNode, Choice, ResourceChange } from '../../types/game';
import type { Resources } from '../../types/game';
import { RESOURCE_ICON_MAP } from '../hud/ResourceIcons';

interface GothicDecisionPanelProps {
  node: DecisionNode;
  resources: Resources;
  onChoice: (choice: Choice) => void;
  onClose?: () => void;
  isFirstDecision?: boolean;
  miniGamePlayed?: boolean;
}

function ResourceChangeChip({ resource, value }: { resource: string; value: number }) {
  const mapping = RESOURCE_ICON_MAP[resource as keyof typeof RESOURCE_ICON_MAP];
  if (!mapping) return null;

  const { Icon, color } = mapping;
  const isPositive = value > 0;
  const displayColor = isPositive ? 'var(--color-gothic-positive)' : 'var(--color-gothic-negative)';

  // Human-readable labels with units
  const labels: Record<string, { pos: string; neg: string }> = {
    momentum: { pos: `+${value}% momentum`, neg: `${value}% momentum` },
    money: { pos: `+$${Math.abs(value).toLocaleString()}`, neg: `-$${Math.abs(value).toLocaleString()}` },
    energy: { pos: `+${value}% stamina`, neg: `${value}% stamina` },
    reputation: { pos: `+${value} rep`, neg: `${value} rep` },
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

  if (changes.momentum && changes.momentum < 0) parts.push(`loses ${Math.abs(changes.momentum)}% momentum`);
  if (changes.money && changes.money < 0) parts.push(`costs $${Math.abs(changes.money).toLocaleString()}`);
  if (changes.energy && changes.energy < 0) parts.push(`drains ${Math.abs(changes.energy)}% stamina`);
  if (changes.money && changes.money > 0) parts.push(`earns $${changes.money.toLocaleString()}`);
  if (changes.energy && changes.energy > 0) parts.push(`restores ${changes.energy}% stamina`);
  if (changes.reputation && changes.reputation > 0) parts.push(`gains ${changes.reputation} rep`);
  if (changes.reputation && changes.reputation < 0) parts.push(`loses ${Math.abs(changes.reputation)} rep`);
  if (changes.momentum && changes.momentum > 0) parts.push(`gains ${changes.momentum}% momentum`);

  if (parts.length === 0) return '';
  // Capitalize first letter
  const sentence = parts.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function GothicDecisionPanel({ node, onChoice, isFirstDecision, miniGamePlayed }: GothicDecisionPanelProps) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Filter out mini-game choices if already played
  const visibleChoices = miniGamePlayed
    ? node.choices.filter(c => !c.triggersMiniGame)
    : node.choices;

  // Keyboard navigation for choices
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const choiceCount = visibleChoices.length;

      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % choiceCount);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setHighlightedIndex(i => (i - 1 + choiceCount) % choiceCount);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onChoice(visibleChoices[highlightedIndex]);
      } else {
        // A/B/C highlight (not select) — Enter confirms
        const letterIndex = e.key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2
        if (letterIndex >= 0 && letterIndex < choiceCount) {
          e.preventDefault();
          setHighlightedIndex(letterIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visibleChoices, highlightedIndex, onChoice]);

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
            {(['momentum', 'money', 'energy', 'reputation'] as const).map((key) => {
              const { Icon, color } = RESOURCE_ICON_MAP[key];
              const hint = {
                momentum: '0% = game over',
                money: '$0 = game over',
                energy: '0% = burnout',
                reputation: 'your score',
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
        <div style={{
          marginBottom: 10,
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-gothic-text)',
          opacity: 0.35,
          textAlign: 'center',
        }}>
          &uarr;&darr; to browse &middot; Enter to select &middot; or press A/B/C
        </div>

        {visibleChoices.map((choice, index) => {
          const summary = choiceSummary(choice.resourceChanges);
          const hasChanges = Object.values(choice.resourceChanges).some(v => v !== undefined && v !== 0);

          return (
            <div
              key={choice.id}
              className="gothic-choice-card"
              onClick={() => onChoice(choice)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={index === highlightedIndex ? {
                borderColor: 'var(--phase-accent, var(--color-gothic-gold))',
                boxShadow: '0 0 15px rgba(var(--phase-accent-rgb, 212, 168, 83), 0.2), inset 0 0 20px rgba(var(--phase-accent-rgb, 212, 168, 83), 0.05)',
                background: 'rgba(40, 25, 26, 0.9)',
              } : undefined}
            >
              <div className="gothic-choice-text">
                <span style={{ color: 'var(--phase-accent, var(--color-gothic-gold))', marginRight: 8 }}>
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
                    {choice.resourceChanges.momentum && (
                      <ResourceChangeChip resource="momentum" value={choice.resourceChanges.momentum} />
                    )}
                    {choice.resourceChanges.money && (
                      <ResourceChangeChip resource="money" value={choice.resourceChanges.money} />
                    )}
                    {choice.resourceChanges.energy && (
                      <ResourceChangeChip resource="energy" value={choice.resourceChanges.energy} />
                    )}
                    {choice.resourceChanges.reputation && (
                      <ResourceChangeChip resource="reputation" value={choice.resourceChanges.reputation} />
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
