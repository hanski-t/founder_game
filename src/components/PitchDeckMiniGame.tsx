import { useState, useCallback } from 'react';
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

export function PitchDeckMiniGame() {
  const { completeMiniGame } = useGame();
  const [slides, setSlides] = useState(() => shuffleArray(SLIDES));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSlideClick = useCallback((index: number) => {
    if (isSubmitted) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      const newSlides = [...slides];
      [newSlides[selectedIndex], newSlides[index]] = [newSlides[index], newSlides[selectedIndex]];
      setSlides(newSlides);
      setSelectedIndex(null);
    }
  }, [selectedIndex, slides, isSubmitted]);

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

  const handleComplete = useCallback(() => {
    const success = score >= 5;

    if (success) {
      completeMiniGame(
        true,
        { money: -500, time: -1, network: 2 },
        `[PITCH DECK: EXCELLENT]

Your deck scored ${score}/7 slides in optimal order!

Investors are impressed. Your narrative flows logically from problem
to solution to market opportunity. The ask at the end feels earned.

"This is one of the most organized pitches we've seen," says one VC.

You get invited to pitch at Demo Day.

+$0 (but saved from wasting money on bad pitch)
-1 week (prep time)
+2 Network (investor interest)`,
        'startup_competitor'
      );
    } else {
      completeMiniGame(
        false,
        { money: -1500, time: -2, energy: -15 },
        `[PITCH DECK: NEEDS WORK]

Your deck scored ${score}/7 slides in optimal order.

The pitch is confusing. You start with the team before explaining
the problem. The market size comes after the ask. Investors tune out.

"Come back when you have a clearer story," one says, not unkindly.

Back to the drawing board...

-$1,500 (wasted on pitch prep)
-2 weeks (rebuilding deck)
-15% Energy (demoralized)`,
        'startup_competitor'
      );
    }
  }, [score, completeMiniGame]);

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${borderColor}`,
        paddingBottom: '12px',
        marginBottom: '16px',
      }}>
        <h2 style={{
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: '1.3rem',
          fontWeight: 600,
          color: goldColor,
          margin: 0,
          textShadow: '0 0 15px rgba(212, 168, 83, 0.3)',
        }}>
          Pitch Deck Builder
        </h2>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: textColor,
          opacity: 0.6,
          margin: '4px 0 0',
        }}>
          Arrange the slides in the optimal order for your pitch
        </p>
      </div>

      {/* Instructions */}
      {!isSubmitted && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderLeft: `3px solid ${borderColor}`,
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.78rem',
            color: textColor,
            lineHeight: 1.6,
          }}>
            Click a slide to select it, then click another to swap positions.
            <br />
            Arrange all 7 slides in the order that tells the best story.
            <br />
            <span style={{ opacity: 0.5 }}>Hint: Start with the problem, end with the ask.</span>
          </div>
        </div>
      )}

      {/* Slides */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {slides.map((slide, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = isSubmitted && slide.correctPosition === index;
          const isWrong = isSubmitted && slide.correctPosition !== index;

          let cardBorder = borderColor;
          let cardBg = panelBg;
          let numColor = goldColor;

          if (isSelected) {
            cardBorder = goldColor;
            cardBg = 'rgba(212, 168, 83, 0.15)';
            numColor = goldColor;
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
            <button
              key={slide.id}
              onClick={() => handleSlideClick(index)}
              disabled={isSubmitted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                color: textColor,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitted && !isSelected) {
                  e.currentTarget.style.borderColor = goldColor;
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 168, 83, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitted && !isSelected) {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: numColor,
                minWidth: '24px',
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: isSelected ? goldColor : isCorrect ? successColor : isWrong ? failColor : textColor,
                }}>
                  {slide.name}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  opacity: 0.5,
                  marginTop: '2px',
                }}>
                  {slide.description}
                </div>
              </div>
              {isSubmitted && (
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: isCorrect ? successColor : failColor,
                }}>
                  {isCorrect ? '\u2713' : `\u2192 ${slide.correctPosition + 1}`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Score Display */}
      {isSubmitted && (
        <div style={{
          textAlign: 'center',
          padding: '16px',
          marginTop: '16px',
          background: score >= 5 ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)',
          border: `1px solid ${score >= 5 ? successColor : failColor}`,
        }}>
          <div style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: score >= 5 ? successColor : failColor,
            textShadow: `0 0 15px ${score >= 5 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
          }}>
            Score: {score}/7
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.78rem',
            color: textColor,
            opacity: 0.6,
            marginTop: '4px',
          }}>
            {score >= 5 ? 'Your pitch is compelling.' : 'The pitch needs work...'}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={isSubmitted ? handleComplete : handleSubmit}
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '12px',
          background: 'linear-gradient(180deg, rgba(90, 48, 48, 0.6) 0%, rgba(26, 15, 16, 0.8) 100%)',
          border: `2px solid ${borderColor}`,
          color: goldColor,
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: '0.95rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
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
        {isSubmitted ? 'CONTINUE' : 'SUBMIT PITCH DECK'}
      </button>
    </div>
  );
}
