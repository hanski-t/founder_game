import type { GamePhase } from '../types/game';

export interface PhaseAtmosphere {
  cssClass: string;
  accentColor: string;
  accentColorRgb: string;
  defaultAmbientFilter: string;
  vignette: string;
  overlay: 'none' | 'dust' | 'embers' | 'rain' | 'snow' | 'fog';
  titleSubtext: string;
  playerSpeedMultiplier: number;
  gravityMultiplier: number;
  enemySpeedMultiplier: number;
}

export const PHASE_ATMOSPHERE: Record<GamePhase, PhaseAtmosphere> = {
  university: {
    cssClass: 'phase-university',
    accentColor: '#d4a853',
    accentColorRgb: '212, 168, 83',
    defaultAmbientFilter: 'brightness(1.05) saturate(1.1)',
    vignette: 'inset 0 0 60px rgba(0, 0, 0, 0.15)',
    overlay: 'dust',
    titleSubtext: 'Where it all begins...',
    playerSpeedMultiplier: 1.0,
    gravityMultiplier: 1.0,
    enemySpeedMultiplier: 1.0,
  },
  firstStartup: {
    cssClass: 'phase-first-startup',
    accentColor: '#e8943a',
    accentColorRgb: '232, 148, 58',
    defaultAmbientFilter: 'sepia(0.15) brightness(0.85) contrast(1.1)',
    vignette: 'inset 0 0 80px rgba(30, 10, 0, 0.25)',
    overlay: 'embers',
    titleSubtext: 'The grind begins...',
    playerSpeedMultiplier: 1.15,
    gravityMultiplier: 1.0,
    enemySpeedMultiplier: 1.2,
  },
  growth: {
    cssClass: 'phase-growth',
    accentColor: '#4ade80',
    accentColorRgb: '74, 222, 128',
    defaultAmbientFilter: 'brightness(0.75) saturate(0.8) hue-rotate(10deg)',
    vignette: 'inset 0 0 100px rgba(0, 20, 0, 0.3)',
    overlay: 'rain',
    titleSubtext: 'Scale or die...',
    playerSpeedMultiplier: 1.3,
    gravityMultiplier: 1.1,
    enemySpeedMultiplier: 1.4,
  },
  scaling: {
    cssClass: 'phase-scaling',
    accentColor: '#60a5fa',
    accentColorRgb: '96, 165, 250',
    defaultAmbientFilter: 'brightness(0.7) saturate(0.6) hue-rotate(30deg) contrast(1.15)',
    vignette: 'inset 0 0 120px rgba(0, 10, 30, 0.4)',
    overlay: 'snow',
    titleSubtext: 'The summit looms...',
    playerSpeedMultiplier: 1.4,
    gravityMultiplier: 1.15,
    enemySpeedMultiplier: 1.6,
  },
  exit: {
    cssClass: 'phase-exit',
    accentColor: '#c084fc',
    accentColorRgb: '192, 132, 252',
    defaultAmbientFilter: 'brightness(0.65) saturate(0.4) contrast(1.2)',
    vignette: 'inset 0 0 150px rgba(20, 0, 30, 0.5)',
    overlay: 'fog',
    titleSubtext: 'One final deal...',
    playerSpeedMultiplier: 1.5,
    gravityMultiplier: 1.2,
    enemySpeedMultiplier: 1.8,
  },
};
