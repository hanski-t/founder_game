import { useEffect, useState, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import cemeteryBg from '@assets/backgrounds/cemetery/background.png';
import cemeteryMountains from '@assets/backgrounds/cemetery/mountains.png';
import townBg from '@assets/backgrounds/town/background.png';

/* ── Animated counter hook ── */
function useCountUp(target: number, duration: number, startDelay: number) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [target, duration, startDelay]);

  return value;
}

/* ── Particle system ── */
function Particles({ color, count }: { color: string; count: number }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6,
      size: 1.5 + Math.random() * 3,
      floatX: -30 + Math.random() * 60,
      floatY: -(100 + Math.random() * 300),
    }))
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            animation: `end-particle-float ${p.duration}s ease-out ${p.delay}s infinite`,
            '--end-float-x': `${p.floatX}px`,
            '--end-float-y': `${p.floatY}px`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── Light rays behind title ── */
function LightRays({ color }: { color: string }) {
  return (
    <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 4 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-50vh',
            left: '50%',
            width: '2px',
            height: '120vh',
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            transform: `translateX(-50%) rotate(${-30 + i * 15}deg)`,
            transformOrigin: 'center center',
            opacity: 0.04,
            animation: `end-light-ray ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function EndScreen() {
  const { state, restartGame } = useGame();
  const [phase, setPhase] = useState(0); // 0=black, 1=bg, 2=title, 3=stats, 4=journey, 5=message, 6=cta

  // Phased reveal timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),    // bg reveals
      setTimeout(() => setPhase(2), 1200),   // title entrance
      setTimeout(() => setPhase(3), 2400),   // stats slam in
      setTimeout(() => setPhase(4), 3800),   // journey lines
      setTimeout(() => setPhase(5), 4600),   // message
      setTimeout(() => setPhase(6), 5600),   // cta button
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Enter key to restart (only after CTA visible)
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && phase >= 6) {
        e.preventDefault();
        restartGame();
      }
    },
    [phase, restartGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const isSuccess = state.endReason === 'success';
  const isMomentumOut = state.endReason === 'momentum';
  const isMoneyOut = state.endReason === 'money';

  const bgImage = isSuccess ? townBg : cemeteryBg;
  const bgImage2 = isSuccess ? undefined : cemeteryMountains;
  const accentColor = isSuccess ? '#d4a853' : '#f87171';
  const particleColor = isSuccess ? 'rgba(212, 168, 83, 0.8)' : 'rgba(248, 113, 113, 0.6)';
  const glowAnim = isSuccess ? 'end-title-glow' : 'end-title-glow-red';

  const getEndingTitle = () => {
    if (isSuccess) return 'QUEST COMPLETE';
    if (isMomentumOut) return 'MOMENTUM LOST';
    if (isMoneyOut) return 'FUNDS DEPLETED';
    return 'JOURNEY ENDED';
  };

  const getEndingSubtitle = () => {
    if (isSuccess) return 'YOUR LEGEND BEGINS';
    return 'THE DARKNESS CLAIMS ANOTHER';
  };

  const getEndingMessage = () => {
    if (isSuccess) {
      return `Against all odds, you carved your path from student to startup survivor.\n\nThe real challenges lie ahead — scaling, funding rounds, hiring, product-market fit...\n\nBut that is a story for another day.`;
    }
    if (isMomentumOut) {
      return `Your startup stalled. Too many pivots, not enough shipping.\n\nMomentum is everything. While you deliberated, competitors launched.\n\nShip fast. Learn faster.`;
    }
    if (isMoneyOut) {
      return `Runway hit zero. The dream isn't dead — just this iteration.\n\nMany legendary founders failed first. They got back up with hard-won wisdom.\n\nWill you?`;
    }
    return 'Your journey has come to an end.';
  };

  // Stats with animated counters
  const decisionCount = useCountUp(state.decisionHistory.length, 800, 2500);
  const momentum = useCountUp(state.resources.momentum, 800, 2700);
  const money = useCountUp(state.resources.money, 1000, 2900);
  const energy = useCountUp(state.resources.energy, 800, 3100);
  const reputation = useCountUp(state.resources.reputation, 800, 3300);

  const stats = [
    { label: 'DECISIONS', value: `${decisionCount}`, icon: '⚔' },
    { label: 'MOMENTUM', value: `${momentum}%`, icon: '⚡' },
    { label: 'BALANCE', value: `$${money.toLocaleString()}`, icon: '💰' },
    { label: 'ENERGY', value: `${energy}%`, icon: '🔥' },
    { label: 'REPUTATION', value: `${reputation}`, icon: '👑' },
    {
      label: 'PHASE',
      value: state.currentPhase === 'university' ? 'University' : 'Startup',
      icon: '🏰',
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* ── Background reveal ── */}
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
          opacity: phase >= 1 ? (isSuccess ? 0.4 : 0.25) : 0,
          animation: phase >= 1 ? 'end-bg-reveal 2s ease-out forwards' : 'none',
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
            opacity: phase >= 1 ? 0.15 : 0,
            transition: 'opacity 2s ease-out',
          }}
        />
      )}

      {/* ── Vignette overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)`,
          zIndex: 3,
          animation: 'end-vignette-pulse 6s ease-in-out infinite',
        }}
      />

      {/* ── Color overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isSuccess
            ? 'linear-gradient(180deg, rgba(10,6,7,0.6) 0%, rgba(30,20,5,0.4) 40%, rgba(10,6,7,0.85) 100%)'
            : 'linear-gradient(180deg, rgba(10,6,7,0.7) 0%, rgba(40,5,5,0.35) 40%, rgba(10,6,7,0.9) 100%)',
          zIndex: 3,
        }}
      />

      {/* ── Particles ── */}
      <Particles color={particleColor} count={40} />

      {/* ── Light rays ── */}
      {phase >= 2 && <LightRays color={accentColor} />}

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          padding: '4vh 3vw 2vh',
        }}
      >
        {/* ── TITLE ── */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          {phase >= 2 && (
            <>
              <h1
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  color: accentColor,
                  margin: 0,
                  animation: `end-title-entrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, ${glowAnim} 4s ease-in-out 1.5s infinite`,
                }}
              >
                {getEndingTitle()}
              </h1>
              <div
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: 'clamp(0.6rem, 1vw, 0.8rem)',
                  color: '#e8d5b5',
                  letterSpacing: '0.3em',
                  marginTop: '0.5rem',
                  animation: 'end-subtitle-reveal 0.8s ease-out 0.6s both',
                }}
              >
                {getEndingSubtitle()}
              </div>
            </>
          )}
        </div>

        {/* ── DIVIDER ── */}
        {phase >= 2 && (
          <div
            style={{
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              margin: '0.8rem 0',
              animation: 'end-divider-expand 0.8s ease-out 1s both',
            }}
          />
        )}

        {/* ── STATS ROW ── */}
        {phase >= 3 && (
          <div
            style={{
              display: 'flex',
              gap: 'clamp(6px, 1.2vw, 16px)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '1rem',
              maxWidth: '750px',
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  textAlign: 'center',
                  padding: 'clamp(6px, 1vh, 10px) clamp(10px, 1.5vw, 18px)',
                  background: 'rgba(26, 15, 16, 0.7)',
                  border: `1px solid rgba(90, 48, 48, 0.5)`,
                  minWidth: '100px',
                  animation: `end-stat-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s both`,
                }}
              >
                <div style={{ fontSize: '1rem', marginBottom: '2px' }}>{stat.icon}</div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
                    fontWeight: 700,
                    color: accentColor,
                    animation: `end-stat-value-glow 2s ease-in-out ${1 + i * 0.2}s infinite`,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Cinzel', Georgia, serif",
                    fontSize: '0.5rem',
                    color: '#e8d5b5',
                    opacity: 0.5,
                    letterSpacing: '0.08em',
                    marginTop: '2px',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TWO-COLUMN: Journey + Message ── */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(1rem, 2.5vw, 2.5rem)',
            flex: 1,
            width: '100%',
            maxWidth: '850px',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* ── MESSAGE ── */}
          {phase >= 5 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0,
                animation: 'end-message-reveal 1s ease-out forwards',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  borderLeft: `3px solid ${accentColor}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)',
                    color: '#e8d5b5',
                    lineHeight: 1.7,
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {getEndingMessage()}
                </p>
              </div>
              <div
                style={{
                  marginTop: '0.8rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: '#e8d5b5',
                  opacity: 0.3,
                  fontStyle: 'italic',
                }}
              >
                Every playthrough is different. Make new choices, discover new outcomes.
              </div>
            </div>
          )}

          {/* ── JOURNEY TIMELINE ── */}
          {phase >= 4 && state.decisionHistory.length > 0 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.6rem',
                  color: accentColor,
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                  opacity: 0.8,
                  animation: 'gothic-fade-in 0.5s ease-out both',
                }}
              >
                YOUR JOURNEY
              </div>
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                  padding: '8px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(90, 48, 48, 0.3)',
                  borderLeft: `2px solid ${isSuccess ? 'rgba(212, 168, 83, 0.3)' : 'rgba(248, 113, 113, 0.2)'}`,
                }}
              >
                {state.decisionHistory.map((decision, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '0.65rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: '3px',
                      lineHeight: 1.4,
                      animation: `end-journey-line 0.4s ease-out ${index * 0.08}s both`,
                    }}
                  >
                    <span
                      style={{
                        color: accentColor,
                        fontWeight: 700,
                        flexShrink: 0,
                        opacity: 0.7,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        color: '#e8d5b5',
                        opacity: 0.75,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>{decision.nodeTitle}:</span>{' '}
                      {decision.choiceText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── CTA BUTTON ── */}
        {phase >= 6 && (
          <div
            style={{
              flexShrink: 0,
              textAlign: 'center',
              marginTop: '1rem',
              animation: 'end-cta-enter 0.8s ease-out forwards',
            }}
          >
            <button
              onClick={restartGame}
              style={{
                padding: '12px 48px',
                background: 'linear-gradient(180deg, rgba(90, 48, 48, 0.5) 0%, rgba(26, 15, 16, 0.7) 100%)',
                border: '2px solid #5a3030',
                color: '#d4a853',
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                fontWeight: 600,
                letterSpacing: '0.2em',
                cursor: 'pointer',
                animation: 'end-cta-breathe 3s ease-in-out infinite',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isSuccess ? 'PLAY AGAIN' : 'TRY AGAIN'}
            </button>
            <div
              style={{
                marginTop: '0.5rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: '#e8d5b5',
                opacity: 0.3,
              }}
            >
              press Enter
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
