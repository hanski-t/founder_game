import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import townBg from '@assets/backgrounds/town/background.png';
import townMid from '@assets/backgrounds/town/middleground.png';

export function StartScreen() {
  const { startGame } = useGame();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 400);
    const t2 = setTimeout(() => setShowButton(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Enter key to start game
  useEffect(() => {
    if (!showButton) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showButton, startGame]);

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
          background: 'linear-gradient(180deg, rgba(10,6,7,0.85) 0%, rgba(10,6,7,0.5) 40%, rgba(10,6,7,0.7) 70%, rgba(10,6,7,0.95) 100%)',
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
          padding: '2rem',
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
            margin: '2rem 0',
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
              opacity: 0.8,
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
            display: 'grid',
            gridTemplateColumns: 'repeat(4, auto)',
            gap: '1.5rem',
            marginTop: '2rem',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.6s',
          }}
        >
          {[
            { label: 'Time', value: '20 weeks', color: '#60a5fa', desc: 'Every choice costs weeks' },
            { label: 'Money', value: '$10,000', color: '#4ade80', desc: 'Runs out — game over' },
            { label: 'Energy', value: '100%', color: '#d4a853', desc: 'Burnout ends your journey' },
            { label: 'Network', value: '2', color: '#c084fc', desc: 'Contacts unlock new paths' },
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

        {/* Start Button */}
        <button
          onClick={startGame}
          style={{
            marginTop: '2.5rem',
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

        {/* Footer hint */}
        <div
          style={{
            marginTop: '1.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: '#e8d5b5',
            opacity: showButton ? 0.4 : 0,
            transition: 'opacity 0.5s ease-out 0.3s',
          }}
        >
          Use arrow keys to move &middot; Walk to characters to interact
        </div>
        <div
          style={{
            marginTop: '0.5rem',
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
