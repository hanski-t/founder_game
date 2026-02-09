import { Analytics } from '@vercel/analytics/react';
import { GameProvider, useGame } from './context/GameContext';
import { StartScreen } from './screens/StartScreen';
import { GameScreen } from './screens/GameScreen';
import { EndScreen } from './screens/EndScreen';

function GameRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'start':
      return <StartScreen />;
    case 'game':
    case 'outcome':
    case 'minigame':
      return <GameScreen />;
    case 'end':
      return <EndScreen />;
    default:
      return <StartScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
      <Analytics />
    </GameProvider>
  );
}

export default App;
