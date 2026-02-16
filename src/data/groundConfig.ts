import cemeteryTileset from '@assets/tilesets/cemetery-tileset.png';
import swampTileset from '@assets/tilesets/swamp-tileset.png';
import churchTileset from '@assets/tilesets/church-tileset.png';
import townTileset from '@assets/tilesets/town-tileset.png';

interface TilesetSource {
  type: 'tileset';
  src: string;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  scale: number;
}

interface CssPatternSource {
  type: 'css';
  backgroundImage: string;
  backgroundSize: string;
}

export type GroundTilesetConfig = {
  fillColor: string;
} & (TilesetSource | CssPatternSource);

// CSS cobblestone pattern for town levels — warm stone bricks with mortar lines
const TOWN_COBBLESTONE: CssPatternSource = {
  type: 'css',
  backgroundImage: [
    // Horizontal mortar lines (offset every other row for brick pattern)
    'repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(0,0,0,0.25) 15px, rgba(0,0,0,0.25) 16px)',
    // Vertical mortar lines (even rows)
    'repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(0,0,0,0.2) 23px, rgba(0,0,0,0.2) 24px)',
    // Subtle warm highlight on top edge of each brick
    'repeating-linear-gradient(0deg, rgba(180,140,100,0.08) 0px, transparent 3px, transparent 16px)',
    // Very subtle noise-like variation
    'radial-gradient(ellipse 20px 12px at 12px 8px, rgba(140,100,70,0.1), transparent)',
    'radial-gradient(ellipse 16px 10px at 36px 24px, rgba(100,70,50,0.08), transparent)',
  ].join(', '),
  backgroundSize: '24px 16px, 24px 32px, 24px 16px, 48px 32px, 48px 32px',
};

export const GROUND_TILESETS: Record<string, GroundTilesetConfig> = {
  cemetery: {
    type: 'tileset',
    src: cemeteryTileset,
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 224,
    sourceHeight: 48,
    scale: 3,
    fillColor: '#1e110a',
  },
  swamp: {
    type: 'tileset',
    src: swampTileset,
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 336,
    sourceHeight: 56,
    scale: 3,
    fillColor: '#1a2010',
  },
  town: {
    ...TOWN_COBBLESTONE,
    fillColor: '#2a1e18',
  },
  church: {
    type: 'tileset',
    src: churchTileset,
    sourceX: 0,
    sourceY: 32,
    sourceWidth: 128,
    sourceHeight: 32,
    scale: 3,
    fillColor: '#0e0e1a',
  },
  hall: {
    type: 'tileset',
    src: townTileset,
    sourceX: 0,
    sourceY: 128,
    sourceWidth: 144,
    sourceHeight: 48,
    scale: 3,
    fillColor: '#1a1215',
  },
};

export type GroundBiome = keyof typeof GROUND_TILESETS;
