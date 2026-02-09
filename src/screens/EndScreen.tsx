import { useGame } from '../context/GameContext';
import { TerminalWindow } from '../components/TerminalWindow';

export function EndScreen() {
  const { state, restartGame } = useGame();

  const isSuccess = state.endReason === 'success';
  const isTimeOut = state.endReason === 'time';
  const isMoneyOut = state.endReason === 'money';

  const getEndingTitle = () => {
    if (isSuccess) return 'MISSION COMPLETE';
    if (isTimeOut) return 'TIME EXPIRED';
    if (isMoneyOut) return 'FUNDS DEPLETED';
    return 'GAME OVER';
  };

  const getEndingMessage = () => {
    if (isSuccess) {
      return `Congratulations, founder.

Against all odds, you've completed the first two phases of your
founder journey. From university student to startup survivor,
you've proven you have what it takes.

This is just the beginning. The real challenges lie ahead:
scaling, funding rounds, hiring, product-market fit...

But that's a story for another day.

Thank you for playing the FOUNDER.EXE prototype!`;
    }
    if (isTimeOut) {
      return `Time ran out.

You spent too long deliberating, preparing, perfecting.
While you were planning, others were shipping.

The startup world moves fast. Sometimes good enough today
beats perfect tomorrow.

Lesson learned: Move faster next time.`;
    }
    if (isMoneyOut) {
      return `Your runway hit zero.

The bank account is empty. The dream isn't dead - just
this iteration of it.

Many successful founders failed first. They learned from it,
got back up, and tried again with hard-won wisdom.

Will you?`;
    }
    return 'Game over.';
  };

  const getFinalStats = () => {
    const stats = [
      { label: 'Decisions Made', value: state.decisionHistory.length },
      { label: 'Final Week', value: state.resources.time },
      { label: 'Final Balance', value: `$${state.resources.money.toLocaleString()}` },
      { label: 'Final Energy', value: `${state.resources.energy}%` },
      { label: 'Network Size', value: state.resources.network },
      { label: 'Phase Reached', value: state.currentPhase === 'university' ? 'University' : 'First Startup' },
    ];
    return stats;
  };

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <TerminalWindow title="FOUNDER.EXE - SESSION ENDED" className="max-w-3xl w-full">
        {/* Status Header */}
        <div className="text-center mb-6">
          <div className={`text-3xl font-bold mb-2 ${
            isSuccess ? 'text-neon-green glow-green' : 'text-neon-red glow-red'
          }`}>
            {getEndingTitle()}
          </div>
          <div className="text-text-dim text-sm">
            {isSuccess ? '[ PROTOTYPE COMPLETE ]' : '[ SIMULATION TERMINATED ]'}
          </div>
        </div>

        {/* Ending Message */}
        <div className="bg-terminal-bg/50 p-4 rounded border border-terminal-border mb-6">
          <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-relaxed">
            {getEndingMessage()}
          </pre>
        </div>

        {/* Final Stats */}
        <div className="border border-terminal-border rounded p-4 mb-6">
          <div className="text-text-dim text-xs uppercase tracking-wider mb-3">
            Final Statistics:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getFinalStats().map((stat, index) => (
              <div key={index} className="text-center p-2 bg-terminal-dark rounded">
                <div className="text-neon-blue text-lg font-bold">{stat.value}</div>
                <div className="text-text-dim text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Recap */}
        {state.decisionHistory.length > 0 && (
          <div className="border border-terminal-border rounded p-4 mb-6">
            <div className="text-text-dim text-xs uppercase tracking-wider mb-3">
              Your Journey:
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {state.decisionHistory.map((decision, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-neon-blue font-bold">{String(index + 1).padStart(2, '0')}.</span>
                  <span className="text-text-dim">{decision.nodeTitle}:</span>
                  <span className="text-text-primary">{decision.choiceText}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={restartGame}
            className="w-full choice-button group flex items-center justify-center gap-2 py-4"
          >
            <span className="text-neon-green glow-green text-lg group-hover:text-white transition-colors">
              [ TRY AGAIN? ]
            </span>
            <span className="text-neon-green blink">▶</span>
          </button>

          <div className="text-center text-text-dim text-xs">
            Every playthrough is different. Make new choices, discover new outcomes.
          </div>
        </div>

        {/* Credits */}
        <div className="text-center mt-6 pt-4 border-t border-terminal-border">
          <div className="text-text-dim text-xs">
            FOUNDER.EXE v1.0 PROTOTYPE
          </div>
          <div className="text-neon-blue text-xs mt-1">
            More phases coming soon...
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
