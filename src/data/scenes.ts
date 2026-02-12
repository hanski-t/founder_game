import type { SceneDefinition } from '../types/scene';

// Background imports
import townBg from '@assets/backgrounds/town/background.png';
import townMid from '@assets/backgrounds/town/middleground.png';
import cemeteryBg from '@assets/backgrounds/cemetery/background.png';
import cemeteryMountains from '@assets/backgrounds/cemetery/mountains.png';
import cemeteryGraveyard from '@assets/backgrounds/cemetery/graveyard.png';
import swampBg from '@assets/backgrounds/swamp/background.png';
import swampMid1 from '@assets/backgrounds/swamp/mid-layer-01.png';
import swampMid2 from '@assets/backgrounds/swamp/mid-layer-02.png';
import churchBg from '@assets/backgrounds/church/back.png';

// NPC sprite imports
import oldmanIdle from '@assets/characters/npcs/oldman-idle.png';
import beardedIdle from '@assets/characters/npcs/bearded-idle.png';
import womanIdle from '@assets/characters/npcs/woman-idle.png';
import hatManIdle from '@assets/characters/npcs/hat-man-idle.png';

// Object imports
import signImg from '@assets/objects/town/sign.png';

const NPC_SPRITE_CONFIG = {
  oldman: { frameWidth: 34, frameHeight: 42, frameCount: 8, frameDuration: 150 },
  bearded: { frameWidth: 40, frameHeight: 47, frameCount: 5, frameDuration: 180 },
  woman: { frameWidth: 37, frameHeight: 46, frameCount: 7, frameDuration: 150 },
  hatMan: { frameWidth: 39, frameHeight: 52, frameCount: 4, frameDuration: 200 },
};

export const scenes: Record<string, SceneDefinition> = {

  // ============================================================
  // LEVEL 1: University Courtyard — Tutorial (~10 seconds)
  // Single screen. Teaches movement, jumping, and platforming.
  // NPC visible from start as a clear goal.
  // ============================================================
  'town-square': {
    id: 'town-square',
    name: 'University Courtyard',
    phase: 'university',
    backgroundLayers: [
      { src: townBg, scrollFactor: 0 },
      { src: townMid, scrollFactor: 0.3 },
    ],
    groundY: 78,
    levelWidth: 100,
    playerStartX: 10,
    interactables: [
      {
        id: 'advisor-npc',
        type: 'npc',
        x: 85,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: oldmanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.oldman,
        label: 'Academic Advisor',
        triggerNodeId: 'uni_intro',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'ts-coin-1', visual: 'coin', x: 42, y: 62, label: '+$500', resourceBonus: { money: 500 } },
      { id: 'ts-scroll-1', visual: 'scroll', x: 60, label: 'Startup Tip', flavorText: '"The best time to start is yesterday."' },
    ],
    obstacles: [
      { id: 'ts-barrel-1', type: 'barrel', x: 40, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'ts-plat-1', x: 35, y: 65, width: 14, visual: 'wood' },
    ],
  },

  // ============================================================
  // LEVEL 2: Campus Activities — First Enemy (1.5 screens, ~15-20s)
  // Introduces scrolling, a ghost enemy, and platform as alternate path.
  // NPC is off-screen to the right, teaching the player to explore.
  // ============================================================
  'town-clubs': {
    id: 'town-clubs',
    name: 'Campus Activities',
    phase: 'university',
    backgroundLayers: [
      { src: townBg, scrollFactor: 0 },
      { src: townMid, scrollFactor: 0.3 },
    ],
    groundY: 78,
    levelWidth: 150,
    playerStartX: 8,
    interactables: [
      {
        id: 'clubs-npc',
        type: 'npc',
        x: 120,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: womanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.woman,
        label: 'Student Activities Lead',
        triggerNodeId: 'uni_clubs',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'tc-coffee-1', visual: 'coffee', x: 58, y: 61, label: '+5 Energy', resourceBonus: { energy: 5 } },
      { id: 'tc-doc-1', visual: 'document', x: 140, label: 'Club Flyer', flavorText: '"Join the Entrepreneur Club!"' },
    ],
    obstacles: [
      { id: 'tc-rock-1', type: 'rock', x: 35, width: 6, height: 9 },
      { id: 'tc-crate-1', type: 'crate', x: 85, width: 6, height: 11 },
    ],
    enemies: [
      { id: 'tc-ghost-1', type: 'ghost', visual: '', patrolStart: 45, patrolEnd: 70, y: 78, speed: 8, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'tc-plat-1', x: 50, y: 64, width: 16, visual: 'stone' },
    ],
  },

  // ============================================================
  // LEVEL 3: The Social Gathering — Multi-Platform + QTE (~20s)
  // Platform staircase to reach a high gem. QTE challenge midway.
  // No enemies — the challenge is the main test. NPC past the QTE.
  // ============================================================
  'dark-castle-interior': {
    id: 'dark-castle-interior',
    name: 'The Social Gathering',
    phase: 'university',
    backgroundLayers: [
      { src: churchBg, scrollFactor: 0 },
    ],
    groundY: 78,
    levelWidth: 150,
    playerStartX: 8,
    interactables: [
      {
        id: 'cofounder-npc',
        type: 'npc',
        x: 115,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: beardedIdle,
        spriteConfig: NPC_SPRITE_CONFIG.bearded,
        label: 'Interesting Stranger',
        triggerNodeId: 'uni_event_cofounder',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'dci-gem-1', visual: 'gem', x: 39, y: 57, label: '+$1000', resourceBonus: { money: 1000 } },
      { id: 'dci-coin-1', visual: 'coin', x: 85, label: '+$200', resourceBonus: { money: 200 } },
    ],
    platforms: [
      { id: 'dci-plat-1', x: 20, y: 68, width: 12, visual: 'wood' },
      { id: 'dci-plat-2', x: 32, y: 60, width: 14, visual: 'stone' },
    ],
    obstacles: [
      { id: 'dci-barrel-1', type: 'barrel', x: 55, width: 6, height: 11 },
      { id: 'dci-crate-1', type: 'crate', x: 90, width: 5, height: 10 },
    ],
    challenge: {
      id: 'qte-social-gathering',
      type: 'quick-time',
      title: 'Social Reflexes',
      description: 'Quick! Match the prompts to make a good first impression.',
      successThreshold: 2,
      gateX: 65,
      quickTimeConfig: {
        prompts: [
          { key: 'f', displayKey: 'F' },
          { key: 'j', displayKey: 'J' },
          { key: ' ', displayKey: 'SPACE' },
          { key: 'k', displayKey: 'K' },
          { key: 'e', displayKey: 'E' },
        ],
        timePerPrompt: 1500,
      },
    },
  },

  // ============================================================
  // LEVEL 4: Graduation Hall — Multiple Enemies + Elevated NPC (2 screens, ~25s)
  // Two enemies with distinct patrol zones. Platform bridge leads to
  // an elevated NPC — player must jump to reach the Career Advisor.
  // ============================================================
  'castle-gate': {
    id: 'castle-gate',
    name: 'Graduation Hall',
    phase: 'university',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryMountains, scrollFactor: 0.2 },
      { src: cemeteryGraveyard, scrollFactor: 0.3 },
    ],
    groundY: 78,
    levelWidth: 200,
    playerStartX: 8,
    interactables: [
      {
        id: 'final-advisor-npc',
        type: 'npc',
        x: 170,
        y: 68,
        width: 64,
        height: 64,
        spriteSheet: oldmanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.oldman,
        label: 'Career Advisor',
        triggerNodeId: 'uni_final',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'cg-doc-1', visual: 'document', x: 22, label: 'Resume Draft', flavorText: '"Skills: Leadership, Problem-Solving"' },
      { id: 'cg-gem-plat', visual: 'gem', x: 74, y: 55, label: '+$1000', resourceBonus: { money: 1000 } },
      { id: 'cg-doc-2', visual: 'document', x: 190, label: '+10 Rep', resourceBonus: { reputation: 10 } },
    ],
    obstacles: [
      { id: 'cg-crate-1', type: 'crate', x: 30, width: 6, height: 11 },
      { id: 'cg-rock-1', type: 'rock', x: 100, width: 6, height: 9 },
    ],
    enemies: [
      { id: 'cg-skeleton-1', type: 'skeleton', visual: '', patrolStart: 40, patrolEnd: 70, y: 78, speed: 9, width: 4, height: 7 },
      { id: 'cg-ghost-1', type: 'ghost', visual: '', patrolStart: 110, patrolEnd: 145, y: 78, speed: 10, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'cg-plat-1', x: 50, y: 65, width: 15, visual: 'stone' },
      { id: 'cg-plat-2', x: 68, y: 58, width: 14, visual: 'stone' },
      { id: 'cg-plat-3', x: 120, y: 72, width: 12, visual: 'wood' },
      { id: 'cg-plat-4', x: 150, y: 68, width: 14, visual: 'stone' },
    ],
  },

  // ============================================================
  // LEVEL 5: The Garage — New Phase + First Moving Platform (2 screens, ~25-30s)
  // Phase transition to firstStartup. Denser obstacles, faster skeleton.
  // Introduces a moving platform that requires timing to ride.
  // ============================================================
  'swamp-garage': {
    id: 'swamp-garage',
    name: 'The Garage',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: swampBg, scrollFactor: 0 },
      { src: swampMid1, scrollFactor: 0.3 },
      { src: swampMid2, scrollFactor: 0.5 },
    ],
    groundY: 78,
    levelWidth: 200,
    playerStartX: 8,
    interactables: [
      {
        id: 'idea-sign',
        type: 'object',
        x: 160,
        y: 78,
        width: 48,
        height: 48,
        staticImage: signImg,
        label: 'Business Plan Board',
        triggerNodeId: 'startup_idea',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'sg-usb-1', visual: 'usb', x: 58, y: 59, label: '+10 Rep', resourceBonus: { reputation: 10 } },
      { id: 'sg-coffee-1', visual: 'coffee', x: 180, label: '+5 Energy', resourceBonus: { energy: 5 } },
    ],
    obstacles: [
      { id: 'sg-barrel-1', type: 'barrel', x: 25, width: 5, height: 10 },
      { id: 'sg-crate-1', type: 'crate', x: 45, width: 6, height: 11 },
      { id: 'sg-rock-1', type: 'rock', x: 65, width: 6, height: 9 },
      { id: 'sg-crate-2', type: 'crate', x: 120, width: 6, height: 11 },
    ],
    enemies: [
      { id: 'sg-skeleton-1', type: 'skeleton', visual: '', patrolStart: 30, patrolEnd: 58, y: 78, speed: 12, width: 4, height: 7 },
    ],
    platforms: [
      { id: 'sg-plat-1', x: 50, y: 62, width: 16, visual: 'wood' },
      { id: 'sg-plat-move', x: 80, y: 65, width: 12, visual: 'metal', moveAxis: 'horizontal', moveRange: 15, moveSpeed: 0.4 },
    ],
  },

  // ============================================================
  // LEVEL 6: Competitive Landscape — First Flying Enemy + Falling-Catch (2.5 screens, ~30-35s)
  // Introduces the bat enemy flying above. Falling-catch challenge in the middle.
  // NPC far to the right with a bonus gem past them for explorers.
  // ============================================================
  'swamp-deep': {
    id: 'swamp-deep',
    name: 'Competitive Landscape',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: swampBg, scrollFactor: 0 },
      { src: swampMid1, scrollFactor: 0.2 },
      { src: swampMid2, scrollFactor: 0.4 },
    ],
    groundY: 78,
    levelWidth: 250,
    playerStartX: 8,
    ambientColor: 'sepia(0.2) brightness(0.8)',
    interactables: [
      {
        id: 'competitor-npc',
        type: 'npc',
        x: 200,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: hatManIdle,
        spriteConfig: NPC_SPRITE_CONFIG.hatMan,
        label: 'Market Analyst',
        triggerNodeId: 'startup_competitor',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'sd-coin-1', visual: 'coin', x: 55, y: 62, label: '+$300', resourceBonus: { money: 300 } },
      { id: 'sd-gem-1', visual: 'gem', x: 235, label: '+$500', resourceBonus: { money: 500 } },
    ],
    obstacles: [
      { id: 'sd-barrel-1', type: 'barrel', x: 30, width: 5, height: 10 },
      { id: 'sd-rock-1', type: 'rock', x: 140, width: 6, height: 9 },
      { id: 'sd-bush-1', type: 'bush', x: 170, width: 5, height: 8 },
    ],
    enemies: [
      { id: 'sd-ghost-1', type: 'ghost', visual: '', patrolStart: 40, patrolEnd: 70, y: 78, speed: 10, width: 5, height: 10 },
      { id: 'sd-bat-1', type: 'bat', visual: '', patrolStart: 60, patrolEnd: 100, y: 60, speed: 14, width: 4, height: 5 },
    ],
    platforms: [
      { id: 'sd-plat-1', x: 48, y: 65, width: 14, visual: 'wood' },
      { id: 'sd-plat-2', x: 150, y: 68, width: 12, visual: 'stone' },
    ],
    challenge: {
      id: 'falling-market-noise',
      type: 'falling-catch',
      title: 'Navigate the Market Noise',
      description: 'Startup life is full of distractions! Move left/right to catch revenue and customers (green glow). Dodge the parties and doomscrolling (red glow)!',
      successThreshold: 8,
      gateX: 110,
      fallingCatchConfig: {
        duration: 24000,
        spawnInterval: 900,
        goodItems: [
          { visual: '\u{1F4B0}', label: 'Revenue' },
          { visual: '\u{1F464}', label: 'Customer' },
          { visual: '\u{1F4C8}', label: 'Traction' },
          { visual: '\u{2B50}', label: 'Review' },
        ],
        badItems: [
          { visual: '\u{1F389}', label: 'Party' },
          { visual: '\u{1F378}', label: 'Networking' },
          { visual: '\u{1F4F1}', label: 'Doomscroll' },
          { visual: '\u{1F5DE}', label: 'Hype Article' },
          { visual: '\u{1F4AC}', label: 'Drama' },
        ],
        fallDuration: 2500,
      },
    },
  },

  // ============================================================
  // LEVEL 7: The Meeting Room — Multiple Moving Platforms + Mixed Enemies (2.5 screens, ~35s)
  // Two moving platforms create timing challenges. Ghost, skeleton, and bat all present.
  // New obstacle types (grave, bush) appear for visual variety.
  // ============================================================
  'church-meeting': {
    id: 'church-meeting',
    name: 'The Meeting Room',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: churchBg, scrollFactor: 0 },
    ],
    groundY: 78,
    levelWidth: 250,
    playerStartX: 8,
    interactables: [
      {
        id: 'alex-npc',
        type: 'npc',
        x: 215,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: beardedIdle,
        spriteConfig: NPC_SPRITE_CONFIG.bearded,
        label: 'Alex (Co-Founder)',
        triggerNodeId: 'startup_cofounder',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'cm-coin-1', visual: 'coin', x: 44, y: 58, label: '+$500', resourceBonus: { money: 500 } },
      { id: 'cm-coffee-1', visual: 'coffee', x: 110, y: 60, label: '+5 Energy', resourceBonus: { energy: 5 } },
      { id: 'cm-coin-2', visual: 'coin', x: 240, label: '+$300', resourceBonus: { money: 300 } },
    ],
    obstacles: [
      { id: 'cm-crate-1', type: 'crate', x: 25, width: 6, height: 11 },
      { id: 'cm-grave-1', type: 'grave', x: 75, width: 5, height: 10 },
      { id: 'cm-bush-1', type: 'bush', x: 150, width: 5, height: 8 },
    ],
    enemies: [
      { id: 'cm-ghost-1', type: 'ghost', visual: '', patrolStart: 30, patrolEnd: 60, y: 78, speed: 8, width: 5, height: 10 },
      { id: 'cm-skeleton-1', type: 'skeleton', visual: '', patrolStart: 80, patrolEnd: 120, y: 78, speed: 12, width: 4, height: 7 },
      { id: 'cm-bat-1', type: 'bat', visual: '', patrolStart: 140, patrolEnd: 185, y: 62, speed: 12, width: 4, height: 5 },
    ],
    platforms: [
      { id: 'cm-plat-move1', x: 38, y: 65, width: 14, visual: 'wood', moveAxis: 'vertical', moveRange: 8, moveSpeed: 0.35 },
      { id: 'cm-plat-move2', x: 100, y: 63, width: 12, visual: 'stone', moveAxis: 'horizontal', moveRange: 20, moveSpeed: 0.45 },
      { id: 'cm-plat-3', x: 170, y: 66, width: 14, visual: 'stone' },
    ],
  },

  // ============================================================
  // LEVEL 8: Investor Boardroom — Three Sections + QTE (3 screens, ~40s)
  // The longest level yet. Three distinct sections:
  // Section 1: Obstacle gauntlet with skeleton patrol
  // Section 2: Platforming + moving platform + QTE challenge
  // Section 3: Final approach with flying bat, NPC at the end
  // ============================================================
  'castle-hall': {
    id: 'castle-hall',
    name: 'Investor Boardroom',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryMountains, scrollFactor: 0.2 },
      { src: cemeteryGraveyard, scrollFactor: 0.3 },
    ],
    groundY: 78,
    levelWidth: 300,
    playerStartX: 6,
    interactables: [
      {
        id: 'investor-npc',
        type: 'npc',
        x: 268,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: womanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.woman,
        label: 'Lead Investor',
        triggerNodeId: 'startup_funding',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'ch-gem-1', visual: 'gem', x: 140, y: 57, label: '+$1500', resourceBonus: { money: 1500 } },
      { id: 'ch-doc-1', visual: 'document', x: 290, label: 'Term Sheet', flavorText: '"Pre-money valuation: $2M"' },
    ],
    obstacles: [
      { id: 'ch-rock-1', type: 'rock', x: 25, width: 6, height: 9 },
      { id: 'ch-crate-1', type: 'crate', x: 50, width: 6, height: 11 },
      { id: 'ch-barrel-1', type: 'barrel', x: 70, width: 5, height: 10 },
      { id: 'ch-crate-2', type: 'crate', x: 220, width: 6, height: 11 },
      { id: 'ch-grave-1', type: 'grave', x: 248, width: 5, height: 10 },
    ],
    enemies: [
      { id: 'ch-skeleton-1', type: 'skeleton', visual: '', patrolStart: 30, patrolEnd: 65, y: 78, speed: 10, width: 4, height: 7 },
      { id: 'ch-ghost-1', type: 'ghost', visual: '', patrolStart: 120, patrolEnd: 160, y: 78, speed: 10, width: 5, height: 10 },
      { id: 'ch-bat-1', type: 'bat', visual: '', patrolStart: 230, patrolEnd: 270, y: 60, speed: 14, width: 4, height: 5 },
    ],
    platforms: [
      { id: 'ch-plat-1', x: 55, y: 65, width: 12, visual: 'stone' },
      { id: 'ch-plat-2', x: 110, y: 68, width: 12, visual: 'stone' },
      { id: 'ch-plat-3', x: 130, y: 60, width: 14, visual: 'metal' },
      { id: 'ch-plat-move', x: 160, y: 58, width: 10, visual: 'metal', moveAxis: 'horizontal', moveRange: 15, moveSpeed: 0.5 },
    ],
    challenge: {
      id: 'qte-investor-pitch',
      type: 'quick-time',
      title: 'Impress the Investor',
      description: 'Nail the key combos to impress the investor!',
      successThreshold: 3,
      gateX: 190,
      quickTimeConfig: {
        prompts: [
          { key: 'r', displayKey: 'R', combo: [{ key: 'g', displayKey: 'G' }] },
          { key: ' ', displayKey: 'SPACE' },
          { key: 'h', displayKey: 'H', combo: [{ key: 'l', displayKey: 'L' }] },
          { key: 'p', displayKey: 'P', combo: [{ key: 'n', displayKey: 'N' }, { key: 'k', displayKey: 'K' }] },
          { key: 'f', displayKey: 'F', combo: [{ key: 'j', displayKey: 'J' }] },
        ],
        timePerPrompt: 2000,
      },
    },
  },

  // ============================================================
  // LEVEL 9: The Final Push — Hardest Level (3 screens, ~45s)
  // Dense obstacles, 5 enemies (including flying bat), 2 moving platforms.
  // Overlapping patrol zones create tight windows. NPC far right.
  // ============================================================
  'cemetery-launch': {
    id: 'cemetery-launch',
    name: 'The Final Push',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryGraveyard, scrollFactor: 0.3 },
    ],
    groundY: 78,
    levelWidth: 300,
    playerStartX: 6,
    interactables: [
      {
        id: 'launch-npc',
        type: 'npc',
        x: 265,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: hatManIdle,
        spriteConfig: NPC_SPRITE_CONFIG.hatMan,
        label: 'Launch Coordinator',
        triggerNodeId: 'startup_final',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'cl-scroll-1', visual: 'scroll', x: 65, y: 60, label: 'Launch Checklist', flavorText: '"Ship it before it\'s perfect."' },
      { id: 'cl-usb-1', visual: 'usb', x: 285, label: '+20 Rep', resourceBonus: { reputation: 20 } },
      { id: 'cl-coffee-1', visual: 'coffee', x: 195, y: 57, label: '+5 Energy', resourceBonus: { energy: 5 } },
    ],
    obstacles: [
      { id: 'cl-crate-1', type: 'crate', x: 28, width: 6, height: 11 },
      { id: 'cl-barrel-1', type: 'barrel', x: 55, width: 5, height: 10 },
      { id: 'cl-rock-1', type: 'rock', x: 85, width: 6, height: 9 },
      { id: 'cl-grave-1', type: 'grave', x: 130, width: 5, height: 10 },
      { id: 'cl-bush-1', type: 'bush', x: 170, width: 5, height: 8 },
    ],
    enemies: [
      { id: 'cl-skeleton-1', type: 'skeleton', visual: '', patrolStart: 35, patrolEnd: 65, y: 78, speed: 10, width: 4, height: 7 },
      { id: 'cl-ghost-1', type: 'ghost', visual: '', patrolStart: 75, patrolEnd: 110, y: 78, speed: 12, width: 5, height: 10 },
      { id: 'cl-bat-1', type: 'bat', visual: '', patrolStart: 95, patrolEnd: 145, y: 58, speed: 15, width: 4, height: 5 },
      { id: 'cl-skeleton-2', type: 'skeleton', visual: '', patrolStart: 155, patrolEnd: 200, y: 78, speed: 13, width: 4, height: 7 },
      { id: 'cl-ghost-2', type: 'ghost', visual: '', patrolStart: 210, patrolEnd: 250, y: 78, speed: 11, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'cl-plat-1', x: 58, y: 63, width: 14, visual: 'stone' },
      { id: 'cl-plat-move1', x: 100, y: 66, width: 12, visual: 'stone', moveAxis: 'vertical', moveRange: 10, moveSpeed: 0.4 },
      { id: 'cl-plat-move2', x: 185, y: 60, width: 12, visual: 'metal', moveAxis: 'horizontal', moveRange: 20, moveSpeed: 0.5 },
      { id: 'cl-plat-2', x: 225, y: 64, width: 14, visual: 'wood' },
    ],
  },

  // ============================================================
  // LEVEL 10: The Summit — Victory Ascent (2 screens, ~30s)
  // Ascending platform staircase to the summit. No enemies.
  // Gems reward the climb. NPC mentor waits at the highest point.
  // A celebration of all the skills learned throughout the game.
  // ============================================================
  'castle-throne': {
    id: 'castle-throne',
    name: 'The Summit',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryMountains, scrollFactor: 0.2 },
      { src: cemeteryGraveyard, scrollFactor: 0.3 },
    ],
    groundY: 78,
    levelWidth: 200,
    playerStartX: 10,
    interactables: [
      {
        id: 'success-npc',
        type: 'npc',
        x: 130,
        y: 46,
        width: 64,
        height: 64,
        spriteSheet: oldmanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.oldman,
        label: 'Your Mentor',
        triggerNodeId: 'game_success',
        proximityRange: 2,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'ct-gem-1', visual: 'gem', x: 44, y: 69, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-2', visual: 'gem', x: 62, y: 62, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-3', visual: 'gem', x: 82, y: 55, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-4', visual: 'gem', x: 102, y: 49, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-5', visual: 'gem', x: 180, label: '+$2000', resourceBonus: { money: 2000 } },
    ],
    platforms: [
      { id: 'ct-plat-1', x: 35, y: 72, width: 14, visual: 'wood' },
      { id: 'ct-plat-2', x: 55, y: 65, width: 12, visual: 'stone' },
      { id: 'ct-plat-3', x: 75, y: 58, width: 12, visual: 'metal' },
      { id: 'ct-plat-4', x: 95, y: 52, width: 14, visual: 'stone' },
      { id: 'ct-plat-5', x: 115, y: 46, width: 16, visual: 'metal' },
      { id: 'ct-plat-move', x: 145, y: 42, width: 12, visual: 'metal', moveAxis: 'horizontal', moveRange: 10, moveSpeed: 0.3 },
    ],
  },
};

// Maps decision node IDs to scene IDs
export const NODE_TO_SCENE_MAP: Record<string, string> = {
  'uni_intro': 'town-square',
  'uni_clubs': 'town-clubs',
  'uni_event_cofounder': 'dark-castle-interior',
  'uni_final': 'castle-gate',
  'startup_idea': 'swamp-garage',
  'startup_competitor': 'swamp-deep',
  'startup_cofounder': 'church-meeting',
  'startup_funding': 'castle-hall',
  'startup_final': 'cemetery-launch',
  'game_success': 'castle-throne',
  // Random events stay in current scene
  'random_viral': 'CURRENT_SCENE',
  'random_mentor': 'CURRENT_SCENE',
};

export function getSceneForNode(nodeId: string): SceneDefinition | null {
  const sceneId = NODE_TO_SCENE_MAP[nodeId];
  if (!sceneId || sceneId === 'CURRENT_SCENE') return null;
  return scenes[sceneId] || null;
}

export function getSceneById(sceneId: string): SceneDefinition | null {
  return scenes[sceneId] || null;
}
