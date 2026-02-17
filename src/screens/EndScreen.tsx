import { useEffect, useState, useRef, useCallback, useMemo, type ReactNode } from 'react';
import { useGame } from '../context/GameContext';
import { SwordIcon, HourglassIcon, CoinIcon, FlameIcon, PeopleIcon, CastleIcon } from '../components/hud/ResourceIcons';
import cemeteryBg from '@assets/backgrounds/cemetery/background.png';
import cemeteryMountains from '@assets/backgrounds/cemetery/mountains.png';
import townBg from '@assets/backgrounds/town/background.png';
import type { DecisionHistoryEntry } from '../types/game';

/* ── Founder archetype based on decisions ── */
interface Archetype {
  title: string;
  description: string;
}

function getFounderArchetype(history: DecisionHistoryEntry[]): Archetype {
  const choices = new Set(history.map(h => h.choiceId));

  // Score traits based on actual choices
  let risk = 0;
  let social = 0;
  let hustle = 0;
  let caution = 0;

  // Phase 1: University
  if (choices.has('cs'))          hustle += 1;
  if (choices.has('business'))    social += 1;
  if (choices.has('engineering')) caution += 1;
  if (choices.has('entrepreneur_club')) social += 1;
  if (choices.has('hackathon_team'))    hustle += 1;
  if (choices.has('skip_clubs'))        caution += 1;
  if (choices.has('deep_dive'))      risk += 1;
  if (choices.has('exchange_info'))   social += 1;
  if (choices.has('polite_decline'))  caution += 1;
  if (choices.has('side_project'))    risk += 2;
  if (choices.has('alumni_network'))  social += 2;
  if (choices.has('grades'))          caution += 2;

  // Phase 2: First Startup
  if (choices.has('build_mvp'))          risk += 2;
  if (choices.has('customer_discovery')) caution += 1;
  if (choices.has('pitch_deck'))         social += 1;
  if (choices.has('full_time'))         risk += 1;
  if (choices.has('part_time'))         caution += 1;
  if (choices.has('decline_cofounder')) hustle += 1;
  if (choices.has('bootstrap'))    hustle += 2;
  if (choices.has('raise'))        social += 2;
  if (choices.has('accelerator'))  { social += 1; risk += 1; }

  // Phase 3: Growth
  if (choices.has('hire_senior'))     caution += 1;
  if (choices.has('hire_junior'))     risk += 1;
  if (choices.has('hire_contractor')) hustle += 1;
  if (choices.has('build_customer_feature')) social += 1;
  if (choices.has('stay_on_vision'))        hustle += 1;
  if (choices.has('build_both'))            risk += 1;
  if (choices.has('full_press'))    risk += 1;
  if (choices.has('delay_press'))   caution += 1;
  if (choices.has('stealth_mode'))  caution += 1;
  if (choices.has('aggressive_spend')) risk += 1;
  if (choices.has('organic_growth'))   caution += 1;
  if (choices.has('product_led'))      hustle += 1;

  // Phase 4: Scaling
  if (choices.has('delegate_product')) social += 1;
  if (choices.has('delegate_ops'))     caution += 1;
  if (choices.has('keep_control'))     hustle += 1;
  if (choices.has('go_international')) risk += 1;
  if (choices.has('domestic_focus'))   caution += 1;
  if (choices.has('remote_first'))     hustle += 1;
  if (choices.has('compromise_hybrid')) social += 1;
  if (choices.has('assert_vision'))     hustle += 1;
  if (choices.has('let_alex_lead'))     social += 1;

  // Phase 5: Exit
  if (choices.has('negotiate_higher')) hustle += 1;
  if (choices.has('decline_offer'))    risk += 2;
  if (choices.has('explore_options'))  caution += 1;
  if (choices.has('generous_packages')) social += 2;
  if (choices.has('standard_terms'))    caution += 1;
  if (choices.has('fight_for_team'))    social += 1;
  if (choices.has('sell_and_rest'))   caution += 1;
  if (choices.has('keep_building'))   risk += 2;
  if (choices.has('start_again'))     { risk += 1; hustle += 1; }

  // Pick dominant trait
  const scores = { risk, social, hustle, caution };
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  switch (top) {
    case 'risk':
      return {
        title: 'The Risk-Taker',
        description: 'You bet big, move fast, and trust your gut over spreadsheets.',
      };
    case 'social':
      return {
        title: 'The Networker',
        description: 'Your strength is people — you build bridges before you build products.',
      };
    case 'hustle':
      return {
        title: 'The Bootstrapper',
        description: 'You keep your head down, ship relentlessly, and let the work speak for itself.',
      };
    case 'caution':
    default:
      return {
        title: 'The Strategist',
        description: 'You measure twice and cut once — calculated moves over blind leaps.',
      };
  }
}

function getReputationTitle(rep: number): string {
  if (rep >= 400) return 'Legendary';
  if (rep >= 300) return 'Industry Leader';
  if (rep >= 200) return 'Influential';
  if (rep >= 100) return 'Recognized';
  if (rep >= 50) return 'Emerging';
  return 'Unknown';
}

function getPhaseName(phase: string): string {
  const names: Record<string, string> = {
    university: 'University',
    firstStartup: 'Startup',
    growth: 'Growth',
    scaling: 'Scaling',
    exit: 'Exit',
  };
  return names[phase] || 'Unknown';
}

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
  const [phase, setPhase] = useState(0); // 0=black, 1=bg, 2=title, 3=stats, 4=message, 5=cta

  // Phased reveal timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),    // bg reveals
      setTimeout(() => setPhase(2), 1200),   // title entrance
      setTimeout(() => setPhase(3), 2400),   // stats slam in
      setTimeout(() => setPhase(4), 3600),   // message paragraphs
      setTimeout(() => setPhase(5), 5200),   // cta button
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Enter key to restart (only after CTA visible)
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && phase >= 5) {
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
  const isEnergyOut = state.endReason === 'energy';

  const bgImage = isSuccess ? townBg : cemeteryBg;
  const bgImage2 = isSuccess ? undefined : cemeteryMountains;
  const accentColor = isSuccess ? '#d4a853' : '#f87171';
  const particleColor = isSuccess ? 'rgba(212, 168, 83, 0.8)' : 'rgba(248, 113, 113, 0.6)';
  const glowAnim = isSuccess ? 'end-title-glow' : 'end-title-glow-red';

  const getEndingTitle = () => {
    if (isSuccess) return 'QUEST COMPLETE';
    if (isMomentumOut) return 'MOMENTUM LOST';
    if (isMoneyOut) return 'FUNDS DEPLETED';
    if (isEnergyOut) return 'BURNOUT';
    return 'JOURNEY ENDED';
  };

  const getEndingSubtitle = () => {
    if (isSuccess) return 'YOUR LEGEND BEGINS';
    return 'THE DARKNESS CLAIMS ANOTHER';
  };

  const getEndingLines = (): { text: string; emphasis?: boolean }[] => {
    if (isSuccess) {
      return [
        { text: 'From university dreamer to startup founder — you did it.' },
        { text: 'Hiring. Scaling. The exit. Every phase tested you differently.', emphasis: true },
        { text: 'Not everyone makes it this far. You shaped a company, a team, and yourself.' },
        { text: 'Your founder\'s journey is complete.', emphasis: true },
      ];
    }
    if (isMomentumOut) {
      return [
        { text: 'Your startup stalled. Too many pivots, not enough shipping.' },
        { text: 'Momentum is everything in the early days.', emphasis: true },
        { text: 'While you deliberated, competitors launched.' },
        { text: 'Ship fast. Learn faster.', emphasis: true },
      ];
    }
    if (isMoneyOut) {
      return [
        { text: 'Runway hit zero. The bank account is empty.' },
        { text: 'The dream isn\'t dead — just this iteration.', emphasis: true },
        { text: 'Many legendary founders failed first.' },
        { text: 'Will you rise again?', emphasis: true },
      ];
    }
    if (isEnergyOut) {
      return [
        { text: 'Your body gave out before your ambition did.' },
        { text: 'Burnout is the silent killer of startups.', emphasis: true },
        { text: 'Rest is not weakness — it\'s strategy.' },
        { text: 'Come back stronger.', emphasis: true },
      ];
    }
    return [{ text: 'Your journey has come to an end.' }];
  };

  // Stats with animated counters
  const decisionCount = useCountUp(state.decisionHistory.length, 800, 2500);
  const momentum = useCountUp(state.resources.momentum, 800, 2700);
  const money = useCountUp(state.resources.money, 1000, 2900);
  const energy = useCountUp(state.resources.energy, 800, 3100);


  const archetype = useMemo(() => getFounderArchetype(state.decisionHistory), [state.decisionHistory]);

  const iconSize = 20;
  const stats: { label: string; value: string; icon: ReactNode }[] = [
    { label: 'DECISIONS', value: `${decisionCount}`, icon: <SwordIcon color="#d4a853" size={iconSize} /> },
    { label: 'MOMENTUM', value: `${momentum}%`, icon: <HourglassIcon color="#60a5fa" size={iconSize} /> },
    { label: 'BALANCE', value: `$${money.toLocaleString()}`, icon: <CoinIcon color="#4ade80" size={iconSize} /> },
    { label: 'ENERGY', value: `${energy}%`, icon: <FlameIcon color="#fbbf24" size={iconSize} /> },
    { label: 'REPUTATION', value: getReputationTitle(state.resources.reputation), icon: <PeopleIcon color="#a78bfa" size={iconSize} /> },
    {
      label: 'PHASE',
      value: getPhaseName(state.currentPhase),
      icon: <CastleIcon color="#d4a853" size={iconSize} />,
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
          justifyContent: 'space-between',
          height: '100%',
          padding: '3vh 3vw 2vh',
          overflow: 'hidden',
        }}
      >
        {/* ── TITLE ── */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
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
              margin: '0.5vh 0',
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
              marginBottom: '1vh',
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
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{stat.icon}</div>
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

        {/* ── ARCHETYPE CARD ── */}
        {phase >= 3 && (
          <div
            style={{
              textAlign: 'center',
              padding: 'clamp(8px, 1.2vh, 14px) clamp(20px, 3vw, 40px)',
              background: 'rgba(26, 15, 16, 0.7)',
              border: `1px solid rgba(90, 48, 48, 0.5)`,
              marginBottom: '1vh',
              maxWidth: '420px',
              animation: 'end-stat-slam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both',
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.55rem',
                color: '#e8d5b5',
                opacity: 0.5,
                letterSpacing: '0.12em',
                marginBottom: '4px',
              }}
            >
              YOUR FOUNDER ARCHETYPE
            </div>
            <div
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                fontWeight: 700,
                color: accentColor,
                animation: `end-stat-value-glow 2s ease-in-out 1.5s infinite`,
              }}
            >
              {archetype.title}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(0.6rem, 0.9vw, 0.72rem)',
                color: '#e8d5b5',
                opacity: 0.7,
                marginTop: '6px',
                lineHeight: 1.5,
              }}
            >
              {archetype.description}
            </div>
          </div>
        )}

        {/* ── MESSAGE LINES ── */}
        {phase >= 4 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(0.3rem, 1vh, 0.7rem)',
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            {getEndingLines().map((line, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontFamily: line.emphasis ? "'Cinzel', Georgia, serif" : "'JetBrains Mono', monospace",
                  fontSize: line.emphasis ? 'clamp(0.85rem, 1.4vw, 1.05rem)' : 'clamp(0.7rem, 1.1vw, 0.82rem)',
                  fontWeight: line.emphasis ? 600 : 400,
                  color: line.emphasis ? accentColor : '#e8d5b5',
                  lineHeight: 1.6,
                  opacity: 0,
                  textShadow: line.emphasis
                    ? `0 0 20px ${isSuccess ? 'rgba(212, 168, 83, 0.3)' : 'rgba(248, 113, 113, 0.25)'}`
                    : 'none',
                  animation: `end-message-reveal 0.8s ease-out ${i * 0.5}s forwards`,
                }}
              >
                {line.text}
              </p>
            ))}

            {/* Tagline */}
            <div
              style={{
                marginTop: '0.5vh',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: 0,
                animation: `end-message-reveal 0.8s ease-out ${getEndingLines().length * 0.5}s forwards`,
              }}
            >
              <div style={{ width: '30px', height: '1px', background: `linear-gradient(90deg, transparent, ${accentColor})` }} />
              <span
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.6rem',
                  color: '#e8d5b5',
                  opacity: 0.4,
                  letterSpacing: '0.15em',
                }}
              >
                EVERY PATH IS DIFFERENT
              </span>
              <div style={{ width: '30px', height: '1px', background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
            </div>
          </div>
        )}

        {/* ── CTA BUTTON ── */}
        {phase >= 5 && (
          <div
            style={{
              flexShrink: 0,
              textAlign: 'center',
              marginTop: '1vh',
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
            <div
              style={{
                marginTop: '1vh',
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.6rem',
                color: '#e8d5b5',
                opacity: 0.35,
                letterSpacing: '0.08em',
                lineHeight: 1.6,
              }}
            >
              Every choice shaped your story. Try again for a different path.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
