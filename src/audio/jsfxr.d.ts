declare module 'jsfxr' {
  interface SfxrSound {
    [key: string]: unknown;
  }

  export const sfxr: {
    generate(preset: string): SfxrSound;
    toAudio(sound: SfxrSound | string): HTMLAudioElement;
    play(sound: SfxrSound): void;
    toWave(sound: SfxrSound): { dataURI: string };
    toBuffer(sound: SfxrSound): Float32Array;
    b58encode(sound: SfxrSound): string;
    b58decode(encoded: string): SfxrSound;
  };
}
