class MusicManager {
  private audio: HTMLAudioElement | null = null;
  private _volume = 0.25;
  private _muted = false;
  private currentSrc = '';

  play(src: string) {
    // Don't restart if already playing the same track
    if (this.audio && this.currentSrc === src && !this.audio.paused) return;

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = this._muted ? 0 : this._volume;
    this.currentSrc = src;
    this.audio.play().catch(() => {
      // Silently ignore autoplay failures
    });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
      this.currentSrc = '';
    }
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.audio && !this._muted) {
      this.audio.volume = this._volume;
    }
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    if (this.audio) {
      this.audio.volume = this._muted ? 0 : this._volume;
    }
    return this._muted;
  }

  get muted() { return this._muted; }
  get volume() { return this._volume; }
  get playing() { return this.audio !== null && !this.audio.paused; }
}

export const musicManager = new MusicManager();
