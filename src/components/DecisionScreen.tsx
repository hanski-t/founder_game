import { useGame } from '../context/GameContext';
import { getNodeById } from '../data/decisions';
import { ChoiceButton } from './ChoiceButton';

export function DecisionScreen() {
  const { state, makeChoice, startMiniGame } = useGame();
  const node = getNodeById(state.currentNodeId);

  if (!node) {
    return (
      <div className="text-neon-red">
        Error: Decision node not found ({state.currentNodeId})
      </div>
    );
  }

  const handleChoice = (choice: typeof node.choices[0]) => {
    if (choice.triggersMiniGame) {
      startMiniGame();
    } else {
      makeChoice(
        node.id,
        choice.id,
        node.title,
        choice.text,
        choice.resourceChanges,
        choice.outcome,
        choice.nextNodeId
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-terminal-border pb-3">
        <h2 className={`text-xl font-bold ${node.isRandomEvent ? 'text-neon-yellow glow-yellow' : 'text-neon-green glow-green'}`}>
          {node.title}
        </h2>
        {node.isRandomEvent && (
          <span className="text-neon-yellow text-xs uppercase tracking-wider">
            Random Event
          </span>
        )}
      </div>

      {/* Description */}
      <div className="bg-terminal-bg/50 p-4 rounded border border-terminal-border">
        <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-relaxed">
          {node.description}
        </pre>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        <div className="text-text-dim text-xs uppercase tracking-wider">
          Choose your action:
        </div>
        {node.choices.map((choice, index) => (
          <ChoiceButton
            key={choice.id}
            text={choice.text}
            resourceChanges={choice.resourceChanges}
            onClick={() => handleChoice(choice)}
            index={index}
            isMiniGame={!!choice.triggersMiniGame}
          />
        ))}
      </div>
    </div>
  );
}
