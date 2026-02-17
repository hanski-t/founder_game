import { sfxr } from 'jsfxr';

// Sound definitions using jsfxr presets and custom params
// Presets: pickupCoin, laserShoot, explosion, powerUp, hitHurt, jump, blipSelect, synth, tone, click, random
type SoundName =
  | 'jump'
  | 'enemyHit'
  | 'collectible'
  | 'decisionMade'
  | 'challengeStart'
  | 'qteSuccess'
  | 'qteFail'
  | 'catchGood'
  | 'catchBad'
  | 'fallInHole'
  | 'sceneTransition'
  | 'gameStart'
  | 'uiClick'
  | 'npcInteract'
  | 'phaseStart';

// Each entry: [preset, volume multiplier]
// We generate from presets for simplicity; custom params can be added via sfxr.me
const SOUND_PRESETS: Record<SoundName, { preset: string; volume: number }> = {
  jump:            { preset: 'jump',       volume: 0.15 },
  enemyHit:        { preset: 'hitHurt',    volume: 0.4 },
  collectible:     { preset: 'pickupCoin', volume: 0.3 },
  decisionMade:    { preset: 'blipSelect', volume: 0.25 },
  challengeStart:  { preset: 'powerUp',    volume: 0.3 },
  qteSuccess:      { preset: 'powerUp',    volume: 0.35 },
  qteFail:         { preset: 'explosion',  volume: 0.2 },
  catchGood:       { preset: 'pickupCoin', volume: 0.3 },
  catchBad:        { preset: 'hitHurt',    volume: 0.25 },
  fallInHole:      { preset: 'explosion',  volume: 0.3 },
  sceneTransition: { preset: 'synth',      volume: 0.15 },
  gameStart:       { preset: 'powerUp',    volume: 0.3 },
  uiClick:         { preset: 'click',      volume: 0.12 },
  npcInteract:     { preset: 'blipSelect', volume: 0.2 },
  phaseStart:      { preset: 'synth',      volume: 0.25 },
};

class SoundManager {
  private cache: Map<SoundName, ReturnType<typeof sfxr.generate>> = new Map();
  private _muted = false;
  private _volume = 0.7;
  private _initialized = false;

  init() {
    if (this._initialized) return;
    // Pre-generate all sounds from presets
    for (const [name, config] of Object.entries(SOUND_PRESETS)) {
      const sound = sfxr.generate(config.preset);
      this.cache.set(name as SoundName, sound);
    }
    this._initialized = true;
  }

  play(name: SoundName) {
    if (this._muted) return;
    if (!this._initialized) this.init();

    const sound = this.cache.get(name);
    if (!sound) return;

    try {
      const config = SOUND_PRESETS[name];
      const audio = sfxr.toAudio(sound);
      audio.volume = Math.min(1, this._volume * config.volume);
      audio.play().catch(() => {});
    } catch {
      // Silently ignore audio errors (e.g. browser restrictions)
    }
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    return this._muted;
  }

  get muted() { return this._muted; }
  get volume() { return this._volume; }
  get initialized() { return this._initialized; }
}

export const soundManager = new SoundManager();
