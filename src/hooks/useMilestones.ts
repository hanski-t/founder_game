import { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { MILESTONES } from '../data/milestones';
import type { MilestoneDefinition } from '../data/milestones';

export type ActiveMilestone = MilestoneDefinition;

/**
 * Derives active milestones from the player's decision history.
 * Returns milestones in story order (same order as MILESTONES array).
 * Only one milestone per nodeId is returned (first match wins).
 */
export function useMilestones(): ActiveMilestone[] {
  const { state } = useGame();

  return useMemo(() => {
    const seenNodes = new Set<string>();
    const active: ActiveMilestone[] = [];

    for (const milestone of MILESTONES) {
      // Only one milestone per decision node
      if (seenNodes.has(milestone.nodeId)) continue;

      const match = state.decisionHistory.find(
        (d) =>
          d.nodeId === milestone.nodeId &&
          (milestone.choiceIds.length === 0 || milestone.choiceIds.includes(d.choiceId))
      );

      if (match) {
        seenNodes.add(milestone.nodeId);
        active.push(milestone);
      }
    }

    // Remove milestones that have been replaced by later ones
    // e.g. "Met Alex" is replaced by "Co-founder: Alex"
    const replacedIds = new Set(
      active.filter((m) => m.replacesId).map((m) => m.replacesId!)
    );
    return active.filter((m) => !replacedIds.has(m.id));
  }, [state.decisionHistory]);
}
