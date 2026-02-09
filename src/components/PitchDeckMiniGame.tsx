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
      // Swap slides
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
    const success = score >= 5; // 5 out of 7 for success

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
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border pb-3">
        <h2 className="text-xl font-bold text-neon-yellow glow-yellow">
          MINI-GAME: Pitch Deck Builder
        </h2>
        <p className="text-text-dim text-sm mt-1">
          Arrange the slides in the optimal order for your pitch
        </p>
      </div>

      {/* Instructions */}
      {!isSubmitted && (
        <div className="bg-terminal-bg/50 p-3 rounded border border-terminal-border">
          <div className="text-neon-blue text-sm">
            <span className="font-bold">&gt; INSTRUCTIONS:</span>
            <br />
            Click a slide to select it, then click another to swap positions.
            <br />
            Arrange all 7 slides in the order that tells the best story.
            <br />
            <span className="text-text-dim">Hint: Start with the problem, end with the ask.</span>
          </div>
        </div>
      )}

      {/* Slides */}
      <div className="space-y-2">
        {slides.map((slide, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = isSubmitted && slide.correctPosition === index;
          const isWrong = isSubmitted && slide.correctPosition !== index;

          return (
            <button
              key={slide.id}
              onClick={() => handleSlideClick(index)}
              disabled={isSubmitted}
              className={`w-full text-left p-3 rounded border transition-all ${
                isSelected
                  ? 'border-neon-yellow bg-neon-yellow/20'
                  : isCorrect
                  ? 'border-neon-green bg-neon-green/20'
                  : isWrong
                  ? 'border-neon-red bg-neon-red/20'
                  : 'border-terminal-border bg-terminal-dark hover:border-neon-blue'
              } ${!isSubmitted && 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${
                  isSelected ? 'text-neon-yellow' : isCorrect ? 'text-neon-green' : isWrong ? 'text-neon-red' : 'text-neon-blue'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className={`font-bold ${
                    isSelected ? 'text-neon-yellow' : isCorrect ? 'text-neon-green' : isWrong ? 'text-neon-red' : 'text-text-primary'
                  }`}>
                    {slide.name}
                  </div>
                  <div className="text-text-dim text-xs">{slide.description}</div>
                </div>
                {isSubmitted && (
                  <span className={`text-sm ${isCorrect ? 'text-neon-green' : 'text-neon-red'}`}>
                    {isCorrect ? '✓' : `→ ${slide.correctPosition + 1}`}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Score Display */}
      {isSubmitted && (
        <div className={`text-center p-4 rounded border ${
          score >= 5 ? 'border-neon-green bg-neon-green/10' : 'border-neon-red bg-neon-red/10'
        }`}>
          <div className={`text-2xl font-bold ${score >= 5 ? 'text-neon-green glow-green' : 'text-neon-red glow-red'}`}>
            Score: {score}/7
          </div>
          <div className="text-text-dim text-sm mt-1">
            {score >= 5 ? 'SUCCESS! Your pitch is compelling.' : 'The pitch needs work...'}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          className="w-full choice-button group flex items-center justify-center gap-2"
        >
          <span className="text-neon-green group-hover:text-white transition-colors">
            [SUBMIT PITCH DECK]
          </span>
        </button>
      ) : (
        <button
          onClick={handleComplete}
          className="w-full choice-button group flex items-center justify-center gap-2"
        >
          <span className="text-neon-green group-hover:text-white transition-colors">
            [CONTINUE]
          </span>
          <span className="text-neon-green blink">▶</span>
        </button>
      )}
    </div>
  );
}
