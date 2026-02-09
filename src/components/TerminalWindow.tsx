import type { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({ title = 'FOUNDER.EXE v1.0', children, className = '' }: TerminalWindowProps) {
  return (
    <div className={`terminal-window min-w-0 overflow-hidden ${className}`}>
      <div className="terminal-header">
        <span className="text-neon-green text-xs font-bold tracking-wider truncate">{title}</span>
        <span className="shrink-0 text-text-dim text-xs tracking-tight">[&#x2500;][&#x25A1;][&#x00D7;]</span>
      </div>
      <div className="p-4 min-w-0">
        {children}
      </div>
    </div>
  );
}
