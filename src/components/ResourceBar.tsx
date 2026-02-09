import { useEffect, useState } from 'react';
import type { ResourceChange } from '../types/game';

interface ResourceBarProps {
  icon: string;
  label: string;
  value: number;
  maxValue: number;
  color: 'green' | 'yellow' | 'blue' | 'red';
  format?: 'number' | 'currency' | 'percentage';
}

const colorClasses = {
  green: 'bg-neon-green',
  yellow: 'bg-neon-yellow',
  blue: 'bg-neon-blue',
  red: 'bg-neon-red',
};

export function ResourceBar({ icon, label, value, maxValue, color, format = 'number' }: ResourceBarProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const percentage = Math.max(0, Math.min(100, (displayValue / maxValue) * 100));

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toString();
    }
  };

  const isLow = percentage < 25;
  const barColor = isLow ? 'bg-neon-red' : colorClasses[color];

  const textColorClass = isAnimating
    ? 'text-neon-yellow'
    : color === 'green' ? 'text-neon-green'
    : color === 'yellow' ? 'text-neon-yellow'
    : color === 'blue' ? 'text-neon-blue'
    : 'text-neon-red';

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-base shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-1 mb-0.5">
          <span className={`text-[10px] uppercase tracking-wide truncate ${isLow ? 'text-neon-red glow-red' : 'text-text-dim'}`}>
            {label}
          </span>
          <span className={`text-xs font-bold shrink-0 ${textColorClass} ${isLow ? 'glow-red animate-pulse' : ''}`}>
            {formatValue(displayValue)}
          </span>
        </div>
        <div className="resource-bar">
          <div
            className={`resource-bar-fill ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface ResourceDisplayProps {
  resources: {
    time: number;
    money: number;
    energy: number;
    network: number;
  };
}

export function ResourceDisplay({ resources }: ResourceDisplayProps) {
  return (
    <div className="space-y-2">
      <ResourceBar
        icon="⏰"
        label="Time"
        value={resources.time}
        maxValue={52}
        color="blue"
        format="number"
      />
      <ResourceBar
        icon="💰"
        label="Money"
        value={resources.money}
        maxValue={100000}
        color="green"
        format="currency"
      />
      <ResourceBar
        icon="🔋"
        label="Energy"
        value={resources.energy}
        maxValue={100}
        color="yellow"
        format="percentage"
      />
      <ResourceBar
        icon="🤝"
        label="Network"
        value={resources.network}
        maxValue={50}
        color="blue"
        format="number"
      />
    </div>
  );
}

interface ResourceChangeDisplayProps {
  changes: ResourceChange;
}

export function ResourceChangeDisplay({ changes }: ResourceChangeDisplayProps) {
  const items = [];

  if (changes.time) {
    items.push({
      icon: '⏰',
      value: changes.time,
      label: changes.time > 0 ? `+${changes.time} weeks` : `${changes.time} weeks`,
    });
  }
  if (changes.money) {
    const formatted = changes.money > 0 ? `+$${changes.money.toLocaleString()}` : `-$${Math.abs(changes.money).toLocaleString()}`;
    items.push({
      icon: '💰',
      value: changes.money,
      label: formatted,
    });
  }
  if (changes.energy) {
    items.push({
      icon: '🔋',
      value: changes.energy,
      label: changes.energy > 0 ? `+${changes.energy}%` : `${changes.energy}%`,
    });
  }
  if (changes.network) {
    items.push({
      icon: '🤝',
      value: changes.network,
      label: changes.network > 0 ? `+${changes.network}` : `${changes.network}`,
    });
  }

  if (items.length === 0) {
    return <span className="text-text-dim text-xs">No resource changes</span>;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, index) => (
        <span
          key={index}
          className={`text-xs px-2 py-1 rounded border ${
            item.value > 0
              ? 'border-neon-green/50 text-neon-green bg-neon-green/10'
              : 'border-neon-red/50 text-neon-red bg-neon-red/10'
          }`}
        >
          {item.icon} {item.label}
        </span>
      ))}
    </div>
  );
}
