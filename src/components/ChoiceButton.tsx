import type { ResourceChange } from '../types/game';
import { ResourceChangeDisplay } from './ResourceBar';

interface ChoiceButtonProps {
  text: string;
  resourceChanges: ResourceChange;
  onClick: () => void;
  index: number;
  isMiniGame?: boolean;
}

export function ChoiceButton({ text, resourceChanges, onClick, index, isMiniGame }: ChoiceButtonProps) {
  const letter = String.fromCharCode(65 + index); // A, B, C, etc.

  return (
    <button
      onClick={onClick}
      className="choice-button w-full text-left group"
    >
      <div className="flex items-start gap-3">
        <span className="text-neon-blue font-bold text-lg group-hover:text-neon-green transition-colors">
          [{letter}]
        </span>
        <div className="flex-1">
          <div className="text-text-primary group-hover:text-white transition-colors">
            {text}
            {isMiniGame && (
              <span className="ml-2 text-neon-yellow text-xs">[MINI-GAME]</span>
            )}
          </div>
          <ResourceChangeDisplay changes={resourceChanges} />
        </div>
      </div>
    </button>
  );
}
