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

  const accentColor = isSuccess ? '#d4a853' : '#f87171';
  const borderDark = isSuccess ? '#d4a853' : '#5a3030';

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
          padding: '2.5vh 3vw 2vh',
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
            fontWeight: 700,
            color: accentColor,
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
            fontSize: '0.7rem',
            color: '#e8d5b5',
            opacity: 0.6,
            letterSpacing: '0.2em',
            marginTop: '0.3rem',
          }}
        >
          {isSuccess ? 'PROTOTYPE COMPLETE' : 'SIMULATION TERMINATED'}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '160px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${borderDark}, transparent)`,
            margin: '1rem 0',
          }}
        />

        {/* Two-column body: message left, stats+journey+button right */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            flex: 1,
            width: '100%',
            maxWidth: '900px',
            minHeight: 0,
            animation: 'gothic-fade-in 0.8s ease-out 0.2s both',
          }}
        >
          {/* Left column: Message */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderLeft: `3px solid ${borderDark}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)',
                  color: '#e8d5b5',
                  lineHeight: 1.65,
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}
              >
                {getEndingMessage()}
              </p>
            </div>

            <div
              style={{
                marginTop: '1rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#e8d5b5',
                opacity: 0.35,
              }}
            >
              Every playthrough is different. Make new choices, discover new outcomes.
            </div>
          </div>

          {/* Right column: Stats + Journey + Button */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: 'center',
                    padding: '8px 6px',
                    background: 'rgba(26, 15, 16, 0.7)',
                    border: '1px solid rgba(90, 48, 48, 0.4)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                      fontWeight: 600,
                      color: isSuccess ? '#d4a853' : '#60a5fa',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      fontSize: '0.55rem',
                      color: '#e8d5b5',
                      opacity: 0.5,
                      letterSpacing: '0.05em',
                      marginTop: '3px',
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
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel', Georgia, serif",
                    fontSize: '0.65rem',
                    color: '#d4a853',
                    letterSpacing: '0.15em',
                    marginBottom: '6px',
                    opacity: 0.7,
                    flexShrink: 0,
                  }}
                >
                  YOUR JOURNEY
                </div>
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden',
                    padding: '6px 10px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(90, 48, 48, 0.3)',
                  }}
                >
                  {state.decisionHistory.map((decision, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '6px',
                        fontSize: '0.68rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: '2px',
                        lineHeight: 1.35,
                      }}
                    >
                      <span style={{ color: '#5a3030', fontWeight: 600, flexShrink: 0 }}>
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <span
                        style={{
                          color: '#e8d5b5',
                          opacity: 0.7,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ opacity: 0.6 }}>{decision.nodeTitle}:</span>{' '}
                        {decision.choiceText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restart Button */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <button
                onClick={restartGame}
                style={{
                  width: '100%',
                  padding: '10px 32px',
                  background: 'linear-gradient(180deg, rgba(90, 48, 48, 0.6) 0%, rgba(26, 15, 16, 0.8) 100%)',
                  border: '2px solid #5a3030',
                  color: '#d4a853',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: 'gothic-fade-in 0.8s ease-out 0.6s both',
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
                  marginTop: '0.3rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: '#e8d5b5',
                  opacity: 0.35,
                }}
              >
                press Enter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
