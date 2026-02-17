import { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

interface Slide {
  id: string;
  name: string;
  description: string;
  correctPosition: number;
}

const SLIDES: Slide[] = [
  { id: 'problem', name: 'Problem', description: 'What pain point are you solving?', correctPosition: 0 },
  { id: 'solution', name: 'Solution', description: 'Your answer to the problem', correctPosition: 1 },
  { id: 'market', name: 'Market Size', description: 'TAM, SAM, SOM - how big is this?', correctPosition: 2 },
  { id: 'traction', name: 'Traction', description: 'Proof that people want this', correctPosition: 3 },
  { id: 'team', name: 'Team', description: 'Why you can execute', correctPosition: 4 },
  { id: 'business', name: 'Business Model', description: 'How you make money', correctPosition: 5 },
  { id: 'ask', name: 'The Ask', description: 'What you need from investors', correctPosition: 6 },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const goldColor = '#d4a853';
const textColor = '#e8d5b5';
const borderColor = '#5a3030';
const panelBg = 'rgba(26, 15, 16, 0.8)';
const successColor = '#4ade80';
const failColor = '#f87171';

/** Tiered rewards based on how many slides are in the correct position */
function getReward(score: number) {
  if (score === 7) return { money: 1000, momentum: 5, reputation: 25, label: 'Perfect', tier: 'perfect' as const };
  if (score >= 5) return { money: 500, momentum: 0, reputation: 15, label: 'Well Done', tier: 'success' as const };
  if (score >= 3) return { money: -500, momentum: -5, reputation: 0, label: 'Needs Work', tier: 'mediocre' as const };
  return { money: -1000, momentum: -10, reputation: -5, label: 'Disastrous', tier: 'fail' as const };
}

export function PitchDeckMiniGame() {
  const { completeMiniGame } = useGame();
  const [slides, setSlides] = useState(() => shuffleArray(SLIDES));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const calculateScore = useCallback(() => {
    let correct = 0;
    slides.forEach((slide, index) => {
      if (slide.correctPosition === index) {
        correct++;
      }
    });
    return correct;
  }, [slides]);

  const handleSubmit = useCallback(() => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
  }, [calculateScore]);

  const reward = isSubmitted ? getReward(score) : null;

  const handleComplete = useCallback(() => {
    if (!reward) return;
    const success = reward.tier === 'perfect' || reward.tier === 'success';

    const outcomeLines = [
      `[PITCH DECK: ${reward.label.toUpperCase()}]`,
      '',
      `Your deck scored ${score}/7 slides in optimal order.`,
      '',
      score === 7
        ? '"This is the most compelling pitch we\'ve ever seen." Investors are fighting to lead the round.'
        : score >= 5
        ? 'Investors nod approvingly. Your narrative flows well. You get invited to Demo Day.'
        : score >= 3
        ? 'The pitch is disjointed. Some slides are out of place. Investors are lukewarm.'
        : 'The pitch is a mess. Investors tune out halfway through. Back to the drawing board.',
    ];

    const changes: string[] = [];
    if (reward.money !== 0) changes.push(`${reward.money > 0 ? '+' : ''}$${reward.money}`);
    if (reward.momentum !== 0) changes.push(`${reward.momentum > 0 ? '+' : ''}${reward.momentum}% Momentum`);
    if (reward.reputation !== 0) changes.push(`${reward.reputation > 0 ? '+' : ''}${reward.reputation} Rep`);
    if (changes.length) outcomeLines.push('', changes.join(' / '));

    completeMiniGame(
      success,
      { money: reward.money, momentum: reward.momentum, reputation: reward.reputation },
      outcomeLines.join('\n'),
      'startup_cofounder'
    );
  }, [score, reward, completeMiniGame]);

  // Keep Enter for submit/continue
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isSubmitted) {
          handleComplete();
        } else {
          handleSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSubmitted, handleSubmit, handleComplete]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image semi-transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, e.currentTarget.offsetWidth / 2, 20);
    }
  };

  const handleDragEnter = (index: number) => {
    dragCounter.current++;
    if (dragIndex !== null && dragIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDropTargetIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    dragCounter.current = 0;
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDropTargetIndex(null);
      return;
    }
    // Move the dragged item to the target position (insert, not swap)
    const newSlides = [...slides];
    const [removed] = newSlides.splice(dragIndex, 1);
    newSlides.splice(targetIndex, 0, removed);
    setSlides(newSlides);
    setDragIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    dragCounter.current = 0;
    setDragIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${borderColor}`,
        paddingBottom: '8px',
        marginBottom: '8px',
        flexShrink: 0,
      }}>
        <h2 style={{
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
          fontWeight: 600,
          color: goldColor,
          margin: 0,
          textShadow: '0 0 15px rgba(212, 168, 83, 0.3)',
        }}>
          Pitch Deck Builder
        </h2>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)',
          color: textColor,
          opacity: 0.6,
          margin: '2px 0 0',
        }}>
          Arrange the slides in the optimal order for your pitch
        </p>
      </div>

      {/* Instructions */}
      {!isSubmitted && (
        <div style={{
          padding: '6px 10px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderLeft: `3px solid ${borderColor}`,
          marginBottom: '8px',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.55rem, 1.1vw, 0.75rem)',
            color: textColor,
            lineHeight: 1.5,
          }}>
            Drag and drop slides to reorder &middot; Enter to submit
            <br />
            <span style={{ opacity: 0.5 }}>Hint: Start with the problem, end with the ask.</span>
          </div>
        </div>
      )}

      {/* Slides */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
        minHeight: 0,
      }}>
        {slides.map((slide, index) => {
          const isCorrect = isSubmitted && slide.correctPosition === index;
          const isWrong = isSubmitted && slide.correctPosition !== index;
          const isDragging = dragIndex === index;
          const isDropTarget = dropTargetIndex === index;

          let cardBorder = borderColor;
          let cardBg = panelBg;
          let numColor = goldColor;

          if (isDropTarget && !isSubmitted) {
            cardBorder = goldColor;
            cardBg = 'rgba(212, 168, 83, 0.15)';
          } else if (isCorrect) {
            cardBorder = successColor;
            cardBg = 'rgba(74, 222, 128, 0.1)';
            numColor = successColor;
          } else if (isWrong) {
            cardBorder = failColor;
            cardBg = 'rgba(248, 113, 113, 0.1)';
            numColor = failColor;
          }

          return (
            <div
              key={slide.id}
              draggable={!isSubmitted}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                textAlign: 'left' as const,
                padding: 'clamp(4px, 1vh, 10px) 10px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                cursor: isSubmitted ? 'default' : 'grab',
                transition: 'all 0.15s ease',
                color: textColor,
                fontFamily: "'JetBrains Mono', monospace",
                opacity: isDragging ? 0.4 : 1,
                flex: 1,
                minHeight: 0,
                boxSizing: 'border-box' as const,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitted) {
                  e.currentTarget.style.borderColor = goldColor;
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 168, 83, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitted && !isDropTarget) {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Drag handle */}
              {!isSubmitted && (
                <span style={{
                  fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
                  color: goldColor,
                  opacity: 0.4,
                  cursor: 'grab',
                  userSelect: 'none',
                  flexShrink: 0,
                }}>
                  &#x2261;
                </span>
              )}
              <span style={{
                fontSize: 'clamp(0.7rem, 1.3vw, 1rem)',
                fontWeight: 700,
                color: numColor,
                minWidth: '20px',
                flexShrink: 0,
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 'clamp(0.65rem, 1.3vw, 0.88rem)',
                  color: isCorrect ? successColor : isWrong ? failColor : textColor,
                }}>
                  {slide.name}
                </div>
                <div style={{
                  fontSize: 'clamp(0.5rem, 1vw, 0.72rem)',
                  opacity: 0.5,
                  marginTop: '1px',
                }}>
                  {slide.description}
                </div>
              </div>
              {isSubmitted && (
                <span style={{
                  fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)',
                  fontWeight: 600,
                  color: isCorrect ? successColor : failColor,
                  flexShrink: 0,
                }}>
                  {isCorrect ? '\u2713' : `\u2192 ${slide.correctPosition + 1}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Score Display */}
      {isSubmitted && reward && (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(6px, 1.2vh, 14px)',
          marginTop: '6px',
          background: reward.tier === 'perfect' || reward.tier === 'success'
            ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)',
          border: `1px solid ${reward.tier === 'perfect' || reward.tier === 'success' ? successColor : failColor}`,
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 'clamp(0.85rem, 1.8vw, 1.3rem)',
            fontWeight: 700,
            color: reward.tier === 'perfect' ? goldColor
              : reward.tier === 'success' ? successColor : failColor,
            textShadow: reward.tier === 'perfect'
              ? '0 0 15px rgba(212, 168, 83, 0.4)'
              : `0 0 15px ${reward.tier === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
          }}>
            {reward.label} — {score}/7
          </div>
          {/* Resource changes */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.55rem, 1vw, 0.78rem)',
            marginTop: '4px',
          }}>
            {reward.money !== 0 && (
              <span style={{ color: reward.money > 0 ? successColor : failColor }}>
                {reward.money > 0 ? '+' : ''}${reward.money}
              </span>
            )}
            {reward.momentum !== 0 && (
              <span style={{ color: reward.momentum > 0 ? successColor : failColor }}>
                {reward.momentum > 0 ? '+' : ''}{reward.momentum}% Mom
              </span>
            )}
            {reward.reputation !== 0 && (
              <span style={{ color: reward.reputation > 0 ? successColor : failColor }}>
                {reward.reputation > 0 ? '+' : ''}{reward.reputation} Rep
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={isSubmitted ? handleComplete : handleSubmit}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: 'clamp(6px, 1.2vh, 12px)',
          background: 'linear-gradient(180deg, rgba(90, 48, 48, 0.6) 0%, rgba(26, 15, 16, 0.8) 100%)',
          border: `2px solid ${borderColor}`,
          color: goldColor,
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = goldColor;
          e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 168, 83, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = borderColor;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isSubmitted ? 'CONTINUE' : 'SUBMIT PITCH DECK'}{' '}
        <span style={{ fontSize: '0.7em', opacity: 0.4 }}>[Enter]</span>
      </button>
    </div>
  );
}
