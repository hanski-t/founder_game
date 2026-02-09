import { useGame } from '../context/GameContext';
import { getNodeById } from '../data/decisions';

export function OutcomeScreen() {
  const { state, continueFromOutcome } = useGame();
  const currentNode = getNodeById(state.currentNodeId);
  const lastDecision = state.decisionHistory[state.decisionHistory.length - 1];

  // Find the choice that was made to get the nextNodeId
  const selectedChoice = currentNode?.choices.find(c => c.id === lastDecision?.choiceId);

  const handleContinue = () => {
    continueFromOutcome(selectedChoice?.nextNodeId);
  };

  return (
    <div className="space-y-6">
      {/* Outcome Header */}
      <div className="border-b border-terminal-border pb-3">
        <h2 className="text-xl font-bold text-neon-blue glow-blue">
          Outcome
        </h2>
        {state.miniGameResult && (
          <span className={`text-xs uppercase tracking-wider ${
            state.miniGameResult === 'success' ? 'text-neon-green' : 'text-neon-red'
          }`}>
            Mini-game {state.miniGameResult}
          </span>
        )}
      </div>

      {/* Outcome Text */}
      <div className="bg-terminal-bg/50 p-4 rounded border border-terminal-border">
        <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-relaxed">
          {state.pendingOutcome}
        </pre>
      </div>

      {/* Resource Changes Summary */}
      {lastDecision && Object.keys(lastDecision.resourceChanges).length > 0 && (
        <div className="border border-terminal-border rounded p-3">
          <div className="text-text-dim text-xs uppercase tracking-wider mb-2">
            Resource Changes Applied:
          </div>
          <div className="flex flex-wrap gap-2">
            {lastDecision.resourceChanges.time && (
              <span className={`text-xs px-2 py-1 rounded ${
                lastDecision.resourceChanges.time > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
              }`}>
                ⏰ {lastDecision.resourceChanges.time > 0 ? '+' : ''}{lastDecision.resourceChanges.time} weeks
              </span>
            )}
            {lastDecision.resourceChanges.money && (
              <span className={`text-xs px-2 py-1 rounded ${
                lastDecision.resourceChanges.money > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
              }`}>
                💰 {lastDecision.resourceChanges.money > 0 ? '+$' : '-$'}{Math.abs(lastDecision.resourceChanges.money).toLocaleString()}
              </span>
            )}
            {lastDecision.resourceChanges.energy && (
              <span className={`text-xs px-2 py-1 rounded ${
                lastDecision.resourceChanges.energy > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
              }`}>
                🔋 {lastDecision.resourceChanges.energy > 0 ? '+' : ''}{lastDecision.resourceChanges.energy}%
              </span>
            )}
            {lastDecision.resourceChanges.network && (
              <span className={`text-xs px-2 py-1 rounded ${
                lastDecision.resourceChanges.network > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
              }`}>
                🤝 {lastDecision.resourceChanges.network > 0 ? '+' : ''}{lastDecision.resourceChanges.network}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full choice-button group flex items-center justify-center gap-2"
      >
        <span className="text-neon-green group-hover:text-white transition-colors">
          [PRESS ENTER TO CONTINUE]
        </span>
        <span className="text-neon-green blink">▶</span>
      </button>
    </div>
  );
}
