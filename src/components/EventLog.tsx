interface EventLogProps {
  events: string[];
}

export function EventLog({ events }: EventLogProps) {
  const recentEvents = events.slice(-5);

  return (
    <div className="border-t border-terminal-border mt-4 pt-3">
      <div className="text-text-dim text-xs uppercase tracking-wider mb-2">
        Recent Events
      </div>
      <div className="space-y-1 h-20 overflow-hidden">
        {recentEvents.map((event, index) => (
          <div
            key={index}
            className={`text-xs font-mono truncate ${
              index === recentEvents.length - 1
                ? 'text-neon-green'
                : 'text-text-dim'
            }`}
          >
            {event}
          </div>
        ))}
        {recentEvents.length > 0 && (
          <span className="text-neon-green blink">_</span>
        )}
      </div>
    </div>
  );
}
