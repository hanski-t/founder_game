import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import cemeteryBg from '@assets/backgrounds/cemetery/background.png';
import cemeteryMountains from '@assets/backgrounds/cemetery/mountains.png';
import townBg from '@assets/backgrounds/town/background.png';

export function EndScreen() {
  const { state, restartGame } = useGame();

  // Enter key to restart
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        restartGame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [restartGame]);

  const isSuccess = state.endReason === 'success';
  const isMomentumOut = state.endReason === 'momentum';
  const isMoneyOut = state.endReason === 'money';

  const bgImage = isSuccess ? townBg : cemeteryBg;
  const bgImage2 = isSuccess ? undefined : cemeteryMountains;

  const getEndingTitle = () => {
    if (isSuccess) return 'QUEST COMPLETE';
    if (isMomentumOut) return 'MOMENTUM LOST';
    if (isMoneyOut) return 'FUNDS DEPLETED';
    return 'JOURNEY ENDED';
  };

  const getEndingMessage = () => {
    if (isSuccess) {
      return `Against all odds, you have completed the first two phases of your founder journey. From university student to startup survivor, you have proven you have what it takes.\n\nThis is just the beginning. The real challenges lie ahead: scaling, funding rounds, hiring, product-market fit...\n\nBut that is a story for another day.`;
    }
    if (isMomentumOut) {
      return `Your startup stalled. Too many pivots, too much deliberation, not enough shipping.\n\nMomentum is everything in the early days. While you were overthinking, competitors were launching.\n\nLesson learned: Keep moving. Ship fast, learn faster.`;
    }
    if (isMoneyOut) {
      return `Your runway hit zero. The bank account is empty. The dream is not dead — just this iteration of it.\n\nMany successful founders failed first. They learned from it, got back up, and tried again with hard-won wisdom.\n\nWill you?`;
    }
    return 'Your journey has come to an end.';
  };

  const stats = [
    { label: 'Decisions Made', value: state.decisionHistory.length },
    { label: 'Final Momentum', value: `${state.resources.momentum}%` },
    { label: 'Final Balance', value: `$${state.resources.money.toLocaleString()}` },
    { label: 'Final Energy', value: `${state.resources.energy}%` },
    { label: 'Reputation', value: state.resources.reputation },
    { label: 'Phase Reached', value: state.currentPhase === 'university' ? 'University' : 'First Startup' },
  ];

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
      {/* Background */}
      <img
        src={bgImage}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          opacity: isSuccess ? 0.35 : 0.25,
        }}
      />
      {bgImage2 && (
        <img
          src={bgImage2}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
            opacity: 0.2,
          }}
        />
      )}

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isSuccess
            ? 'linear-gradient(180deg, rgba(10,6,7,0.7) 0%, rgba(20,15,5,0.6) 50%, rgba(10,6,7,0.9) 100%)'
            : 'linear-gradient(180deg, rgba(10,6,7,0.8) 0%, rgba(30,5,5,0.5) 50%, rgba(10,6,7,0.95) 100%)',
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
          height: '100%',
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        {/* Spacer */}
        <div style={{ flex: '0 0 8vh' }} />

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700,
            color: isSuccess ? '#d4a853' : '#f87171',
            textShadow: isSuccess
              ? '0 0 30px rgba(212, 168, 83, 0.5)'
              : '0 0 30px rgba(248, 113, 113, 0.4)',
            letterSpacing: '0.15em',
            margin: 0,
            textAlign: 'center',
            animation: 'gothic-fade-in 0.8s ease-out',
          }}
        >
          {getEndingTitle()}
        </h1>

        <div
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '0.8rem',
            color: '#e8d5b5',
            opacity: 0.6,
            letterSpacing: '0.2em',
            marginTop: '0.5rem',
          }}
        >
          {isSuccess ? 'PROTOTYPE COMPLETE' : 'SIMULATION TERMINATED'}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '160px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${isSuccess ? '#d4a853' : '#5a3030'}, transparent)`,
            margin: '1.5rem 0',
          }}
        />

        {/* Message */}
        <div
          style={{
            maxWidth: '550px',
            padding: '16px 24px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderLeft: `3px solid ${isSuccess ? '#d4a853' : '#5a3030'}`,
            animation: 'gothic-fade-in 0.8s ease-out 0.2s both',
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.82rem',
              color: '#e8d5b5',
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: 'pre-line',
            }}
          >
            {getEndingMessage()}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '1.5rem',
            maxWidth: '480px',
            width: '100%',
            animation: 'gothic-fade-in 0.8s ease-out 0.4s both',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '10px 8px',
                background: 'rgba(26, 15, 16, 0.7)',
                border: '1px solid rgba(90, 48, 48, 0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isSuccess ? '#d4a853' : '#60a5fa',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.6rem',
                  color: '#e8d5b5',
                  opacity: 0.5,
                  letterSpacing: '0.05em',
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Journey Recap */}
        {state.decisionHistory.length > 0 && (
          <div
            style={{
              marginTop: '1.5rem',
              maxWidth: '480px',
              width: '100%',
              animation: 'gothic-fade-in 0.8s ease-out 0.6s both',
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.7rem',
                color: '#d4a853',
                letterSpacing: '0.15em',
                marginBottom: '8px',
                opacity: 0.7,
              }}
            >
              YOUR JOURNEY
            </div>
            <div
              style={{
                maxHeight: '140px',
                overflowY: 'auto',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(90, 48, 48, 0.3)',
              }}
            >
              {state.decisionHistory.map((decision, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: '#5a3030', fontWeight: 600, flexShrink: 0 }}>
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span style={{ color: '#e8d5b5', opacity: 0.5, flexShrink: 0 }}>
                    {decision.nodeTitle}:
                  </span>
                  <span style={{ color: '#e8d5b5', opacity: 0.8 }}>
                    {decision.choiceText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={restartGame}
          style={{
            marginTop: '2rem',
            padding: '12px 40px',
            background: 'linear-gradient(180deg, rgba(90, 48, 48, 0.6) 0%, rgba(26, 15, 16, 0.8) 100%)',
            border: '2px solid #5a3030',
            color: '#d4a853',
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'gothic-fade-in 0.8s ease-out 0.8s both',
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
          TRY AGAIN?
        </button>
        <div
          style={{
            marginTop: '0.4rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#e8d5b5',
            opacity: 0.35,
          }}
        >
          press Enter
        </div>

        <div
          style={{
            marginTop: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: '#e8d5b5',
            opacity: 0.35,
            textAlign: 'center',
          }}
        >
          Every playthrough is different. Make new choices, discover new outcomes.
        </div>

        {/* Bottom spacer */}
        <div style={{ flex: '0 0 4vh' }} />
      </div>
    </div>
  );
}
