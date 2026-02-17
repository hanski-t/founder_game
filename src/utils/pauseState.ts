// Shared pause state — module-level ref readable by any hook or component.
// Set by GothicGameScreen, read by movement hooks to freeze input.
let _paused = false;

export function setGamePaused(paused: boolean) {
  _paused = paused;
}

export function isGamePaused(): boolean {
  return _paused;
}
