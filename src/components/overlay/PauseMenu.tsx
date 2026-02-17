import { useEffect, useState } from 'react';
import { soundManager } from '../../audio/SoundManager';
import { musicManager } from '../../audio/MusicManager';

interface PauseMenuProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseMenu({ onResume, onQuit }: PauseMenuProps) {
  const [sfxMuted, setSfxMuted] = useState(soundManager.muted);
  const [musicMuted, setMusicMuted] = useState(musicManager.muted);

  // Escape or Enter to resume
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onResume]);

  return (
    <div className="gothic-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="gothic-panel" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div className="gothic-panel-title" style={{ fontSize: '1.8rem', marginBottom: 24 }}>
          PAUSED
        </div>

        {/* Audio controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 24,
        }}>
          <button
            onClick={() => setSfxMuted(soundManager.toggleMute())}
            style={{
              background: 'rgba(26, 15, 16, 0.6)',
              border: '1px solid var(--color-gothic-border)',
              borderRadius: 4,
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: sfxMuted ? '#f87171' : 'var(--color-gothic-text)',
            }}
          >
            SFX: {sfxMuted ? 'OFF' : 'ON'}
          </button>
          <button
            onClick={() => setMusicMuted(musicManager.toggleMute())}
            style={{
              background: 'rgba(26, 15, 16, 0.6)',
              border: '1px solid var(--color-gothic-border)',
              borderRadius: 4,
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: musicMuted ? '#f87171' : 'var(--color-gothic-text)',
            }}
          >
            Music: {musicMuted ? 'OFF' : 'ON'}
          </button>
        </div>

        {/* Menu buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onResume}
            className="gothic-choice-card"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: '12px 20px',
              borderColor: 'var(--color-gothic-gold)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-gothic)',
              fontSize: '1rem',
              color: 'var(--color-gothic-gold)',
              letterSpacing: '0.1em',
            }}>
              RESUME
            </span>
          </button>

          <button
            onClick={onQuit}
            className="gothic-choice-card"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: '12px 20px',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-gothic)',
              fontSize: '1rem',
              color: '#f87171',
              letterSpacing: '0.1em',
            }}>
              RETURN TO MENU
            </span>
          </button>
        </div>

        <div style={{
          marginTop: 20,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--color-gothic-text)',
          opacity: 0.35,
        }}>
          Press Escape or Enter to resume
        </div>
      </div>
    </div>
  );
}
