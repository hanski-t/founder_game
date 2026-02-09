import { useGame } from '../context/GameContext';
import { TerminalWindow } from '../components/TerminalWindow';
import { ResourceDisplay } from '../components/ResourceBar';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { EventLog } from '../components/EventLog';
import { DecisionScreen } from '../components/DecisionScreen';
import { OutcomeScreen } from '../components/OutcomeScreen';
import { PitchDeckMiniGame } from '../components/PitchDeckMiniGame';

export function GameScreen() {
  const { state } = useGame();

  const renderContent = () => {
    switch (state.screen) {
      case 'game':
        return <DecisionScreen />;
      case 'outcome':
        return <OutcomeScreen />;
      case 'minigame':
        return <PitchDeckMiniGame />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Content Area - 3 columns on large screens */}
          <div className="lg:col-span-3">
            <TerminalWindow title="FOUNDER.EXE v1.0">
              {renderContent()}
            </TerminalWindow>
          </div>

          {/* Sidebar - 1 column on large screens */}
          <div className="lg:col-span-1 min-w-0 space-y-4">
            {/* Resources Panel */}
            <TerminalWindow title="RESOURCES">
              <ResourceDisplay resources={state.resources} />
              <PhaseIndicator currentPhase={state.currentPhase} />
            </TerminalWindow>

            {/* Event Log */}
            <TerminalWindow title="SYSTEM LOG">
              <EventLog events={state.eventLog} />
            </TerminalWindow>

            {/* Quick Stats */}
            <TerminalWindow title="STATS">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-dim">Decisions made:</span>
                  <span className="text-neon-blue">{state.decisionHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Current phase:</span>
                  <span className="text-neon-green">{state.currentPhase === 'university' ? '1' : '2'}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Status:</span>
                  <span className={`${
                    state.resources.energy > 50 ? 'text-neon-green' :
                    state.resources.energy > 25 ? 'text-neon-yellow' : 'text-neon-red'
                  }`}>
                    {state.resources.energy > 50 ? 'Energized' :
                     state.resources.energy > 25 ? 'Tired' : 'Burnout risk!'}
                  </span>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>
      </div>
    </div>
  );
}
