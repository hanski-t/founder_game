import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { useVariety } from '../context/VarietyContext';
import { soundManager } from '../audio/SoundManager';
import { musicManager } from '../audio/MusicManager';
import { getHighScores } from '../utils/highScores';
import { loadGame, hasSave } from '../utils/saveGame';
import gameplayMusic from '@assets/audio/Gothamlicious.mp3';
import townBg from '@assets/backgrounds/town/background.png';
import townMid from '@assets/backgrounds/town/middleground.png';

function getPhaseName(phase: string): string {
  const names: Record<string, string> = {
    university: 'University',
    firstStartup: 'Startup',
    growth: 'Growth',
    scaling: 'Scaling',
    exit: 'Exit',
  };
  return names[phase] || phase;
}

export function StartScreen() {
  const { startGame, dispatch } = useGame();
  const { varietyDispatch } = useVariety();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const savedGame = useMemo(() => hasSave(), []);
  const highScores = useMemo(() => getHighScores(), []);

  // Initialize audio on first user gesture, then start game
  const handleStartGame = useCallback(() => {
    soundManager.init();
    soundManager.play('gameStart');
    musicManager.play(gameplayMusic);
    startGame();
  }, [startGame]);

  // Continue from saved game
  const handleContinue = useCallback(() => {
    const save = loadGame();
    if (!save) return;
    soundManager.init();
    soundManager.play('gameStart');
    musicManager.play(gameplayMusic);
    dispatch({ type: 'LOAD_GAME', state: save.gameState });
    varietyDispatch({
      type: 'LOAD_VARIETY',
      collectedIds: save.varietyState.collectedIds,
      completedChallengeIds: save.varietyState.completedChallengeIds,
    });
  }, [dispatch, varietyDispatch]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 400);
    const t2 = setTimeout(() => setShowButton(true), 1200);
    // Resume music on start screen if audio was already initialized (e.g., after restart)
    if (soundManager.initialized && !musicManager.playing) {
      musicManager.play(gameplayMusic);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Enter key to start game
  useEffect(() => {
    if (!showButton) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStartGame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showButton, handleStartGame]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0607',
      }}
    >
      {/* Background layers */}
      <img
        src={townBg}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          opacity: 0.4,
        }}
      />
      <img
        src={townMid}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          opacity: 0.3,
        }}
      />

      {/* Dark overlay gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,6,7,0.9) 0%, rgba(10,6,7,0.65) 40%, rgba(10,6,7,0.75) 70%, rgba(10,6,7,0.95) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 'clamp(1rem, 3vh, 2rem) 2rem',
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: 'center',
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <h1
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#d4a853',
              textShadow: '0 0 30px rgba(212, 168, 83, 0.4), 0 0 60px rgba(212, 168, 83, 0.2)',
              letterSpacing: '0.15em',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            FOUNDER'S JOURNEY
          </h1>
          <div
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              color: '#e8d5b5',
              letterSpacing: '0.3em',
              marginTop: '0.5rem',
              opacity: 0.7,
            }}
          >
            A GOTHIC STARTUP ADVENTURE
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '200px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #5a3030, #d4a853, #5a3030, transparent)',
            margin: 'clamp(1rem, 3vh, 2rem) 0',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 1s ease-out 0.3s',
          }}
        />

        {/* Description */}
        <div
          style={{
            maxWidth: '500px',
            textAlign: 'center',
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s',
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              color: '#e8d5b5',
              lineHeight: 1.8,
              margin: 0,
              opacity: 0.6,
            }}
          >
            You are a university student with a dream:
            to build something that matters.
            The path ahead is uncertain. Your resources are limited.
            Failure is likely.
          </p>
          <p
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '0.9rem',
              color: '#d4a853',
              marginTop: '1rem',
              opacity: 0.9,
            }}
          >
            But that has never stopped a founder before.
          </p>
        </div>

        {/* Starting Resources */}
        <div
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '0.7rem',
            color: '#e8d5b5',
            opacity: showContent ? 0.5 : 0,
            letterSpacing: '0.2em',
            marginTop: 'clamp(1rem, 3vh, 2.5rem)',
            transition: 'opacity 0.8s ease-out 0.6s',
          }}
        >
          YOUR STARTING RESOURCES
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, auto)',
            gap: '1.5rem',
            marginTop: '0.75rem',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.6s',
          }}
        >
          {[
            { label: 'Momentum', value: '70%', color: '#60a5fa', desc: 'Stall and it\'s game over' },
            { label: 'Money', value: '$10,000', color: '#4ade80', desc: 'Runs out — game over' },
            { label: 'Energy', value: '100%', color: '#d4a853', desc: 'Burnout ends your journey' },
            { label: 'Reputation', value: '0', color: '#c084fc', desc: 'Your credibility and social proof' },
          ].map((res) => (
            <div key={res.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1rem',
                fontWeight: 600,
                color: res.color,
              }}>
                {res.value}
              </div>
              <div style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.65rem',
                color: '#e8d5b5',
                opacity: 0.6,
                letterSpacing: '0.1em',
                marginTop: '2px',
              }}>
                {res.label}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: '#e8d5b5',
                opacity: 0.35,
                marginTop: '4px',
                lineHeight: 1.3,
              }}>
                {res.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button (only if save exists) */}
        {savedGame && (
          <button
            onClick={handleContinue}
            style={{
              marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
              padding: '12px 40px',
              background: 'linear-gradient(180deg, rgba(74, 100, 48, 0.6) 0%, rgba(26, 30, 16, 0.8) 100%)',
              border: '2px solid #4a6430',
              color: '#4ade80',
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: showButton ? 1 : 0,
              transform: showButton ? 'translateY(0)' : 'translateY(10px)',
              textShadow: '0 0 15px rgba(74, 222, 128, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4ade80';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.3), inset 0 0 20px rgba(74, 222, 128, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#4a6430';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            CONTINUE
          </button>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          style={{
            marginTop: 'clamp(1rem, 3vh, 2.5rem)',
            padding: '14px 48px',
            background: 'linear-gradient(180deg, rgba(90, 48, 48, 0.6) 0%, rgba(26, 15, 16, 0.8) 100%)',
            border: '2px solid #5a3030',
            color: '#d4a853',
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(10px)',
            textShadow: '0 0 15px rgba(212, 168, 83, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d4a853';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 168, 83, 0.3), inset 0 0 20px rgba(212, 168, 83, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#5a3030';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          BEGIN YOUR QUEST
        </button>
        <div
          style={{
            marginTop: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#e8d5b5',
            opacity: showButton ? 0.35 : 0,
            transition: 'opacity 0.5s ease-out 0.3s',
          }}
        >
          press Enter
        </div>

        {/* High Scores */}
        {highScores.length > 0 && (
          <div
            style={{
              marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
              opacity: showButton ? 0.7 : 0,
              transition: 'opacity 0.8s ease-out 0.6s',
              textAlign: 'center',
            }}
          >
            <div style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '0.6rem',
              color: '#e8d5b5',
              opacity: 0.5,
              letterSpacing: '0.2em',
              marginBottom: '6px',
            }}>
              YOUR BEST RUNS
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {highScores.slice(0, 3).map((entry, i) => (
                <div key={i} style={{
                  padding: '4px 12px',
                  background: 'rgba(26, 15, 16, 0.6)',
                  border: '1px solid rgba(90, 48, 48, 0.4)',
                  minWidth: '80px',
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: i === 0 ? '#d4a853' : '#e8d5b5',
                  }}>
                    {entry.score.toLocaleString()}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.5rem',
                    color: '#e8d5b5',
                    opacity: 0.5,
                  }}>
                    {entry.archetype} · {getPhaseName(entry.phase)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div
          style={{
            marginTop: 'clamp(0.5rem, 2vh, 1.5rem)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#e8d5b5',
            opacity: showButton ? 0.3 : 0,
            transition: 'opacity 0.5s ease-out 0.5s',
          }}
        >
          Best played on desktop with a keyboard
        </div>
      </div>
    </div>
  );
}
