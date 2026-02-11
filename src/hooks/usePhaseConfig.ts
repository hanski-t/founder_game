import { useGame } from '../context/GameContext';
import { PHASE_ATMOSPHERE } from '../data/phaseConfig';

export function usePhaseConfig() {
  const { state } = useGame();
  return PHASE_ATMOSPHERE[state.currentPhase];
}
