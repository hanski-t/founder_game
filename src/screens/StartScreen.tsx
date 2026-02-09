import { useGame } from '../context/GameContext';
import { TerminalWindow } from '../components/TerminalWindow';

export function StartScreen() {
  const { startGame } = useGame();

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <TerminalWindow title="FOUNDER.EXE v1.0" className="max-w-2xl w-full">
        {/* ASCII Art Title */}
        <div className="text-center mb-6">
          <pre className="text-neon-green glow-green text-xs sm:text-sm font-mono leading-tight">
{`
 ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ ███████╗██████╗
 ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
 █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
 ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
 ██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║
 ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
`}
          </pre>
          <div className="text-neon-blue text-lg tracking-widest mt-2">
            A STARTUP SIMULATOR
          </div>
          <div className="text-text-dim text-xs mt-1">
            v1.0 PROTOTYPE
          </div>
        </div>

        {/* Boot Sequence */}
        <div className="bg-terminal-bg/50 p-4 rounded border border-terminal-border mb-6">
          <pre className="text-neon-green text-xs font-mono leading-relaxed">
{`> SYSTEM CHECK...
> Memory: OK
> Ambition levels: DANGEROUSLY HIGH
> Risk tolerance: CALCULATING...
> Coffee reserves: LOW (refill recommended)
> Student loans: [REDACTED]
>
> BOOT SEQUENCE COMPLETE
>
> Welcome, aspiring founder.
>
> You are a university student with a dream:
> to build something that matters.
>
> The path ahead is uncertain.
> Your resources are limited.
> Failure is likely.
>
> But that's never stopped a founder before.
>
> Your journey begins now.`}
          </pre>
        </div>

        {/* Resource Preview */}
        <div className="border border-terminal-border rounded p-3 mb-6">
          <div className="text-text-dim text-xs uppercase tracking-wider mb-2">
            Starting Resources:
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>⏰</span>
              <span className="text-neon-blue">20 weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span className="text-neon-green">$10,000</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔋</span>
              <span className="text-neon-yellow">100% energy</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🤝</span>
              <span className="text-neon-blue">2 connections</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startGame}
          className="w-full choice-button group flex items-center justify-center gap-2 py-4"
        >
          <span className="text-neon-green glow-green text-lg group-hover:text-white transition-colors">
            [ START YOUR JOURNEY ]
          </span>
          <span className="text-neon-green blink">▶</span>
        </button>

        {/* Footer */}
        <div className="text-center mt-4 text-text-dim text-xs">
          <div>Press START to begin | Use mouse to make choices</div>
          <div className="mt-1">Every playthrough is different</div>
        </div>
      </TerminalWindow>
    </div>
  );
}
