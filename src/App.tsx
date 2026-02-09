import { Analytics } from '@vercel/analytics/react';
import { GameProvider, useGame } from './context/GameContext';
import { SceneProvider } from './context/SceneContext';
import { StartScreen } from './screens/StartScreen';
import { GothicGameScreen } from './screens/GothicGameScreen';
import { EndScreen } from './screens/EndScreen';

function GameRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'start':
      return <StartScreen />;
    case 'game':
    case 'outcome':
    case 'minigame':
      return <GothicGameScreen />;
    case 'end':
      return <EndScreen />;
    default:
      return <StartScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <SceneProvider>
        <GameRouter />
      </SceneProvider>
      <Analytics />
    </GameProvider>
  );
}

export default App;
