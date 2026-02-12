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
  'town-square': {
    id: 'town-square',
    name: 'University Courtyard',
    phase: 'university',
    backgroundLayers: [
      { src: townBg, scrollFactor: 0 },
      { src: townMid, scrollFactor: 0.3 },
    ],
    groundY: 78,
    sceneWidth: 960,
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
      // On the ground but behind an obstacle - player must navigate past it
      { id: 'ts-coin-1', visual: 'coin', x: 25, label: '+$500', resourceBonus: { money: 500 } },
      // On a platform - requires jumping to reach
      { id: 'ts-gem-plat', visual: 'gem', x: 45, y: 60, label: '+$800', resourceBonus: { money: 800 } },
      // Past the NPC - player must go beyond the goal to collect
      { id: 'ts-scroll-1', visual: 'scroll', x: 95, label: 'Startup Tip', flavorText: '"The best time to start is yesterday."' },
    ],
    obstacles: [
      { id: 'ts-bush-1', type: 'barrel', x: 32, width: 5, height: 10 },
      { id: 'ts-crate-1', type: 'crate', x: 55, width: 6, height: 11 },
      { id: 'ts-rock-1', type: 'rock', x: 72, width: 6, height: 9 },
    ],
    platforms: [
      { id: 'ts-plat-1', x: 38, y: 63, width: 15, visual: 'wood' },
    ],
  },

  'town-clubs': {
    id: 'town-clubs',
    name: 'Campus Activities',
    phase: 'university',
    backgroundLayers: [
      { src: townBg, scrollFactor: 0 },
      { src: townMid, scrollFactor: 0.3 },
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'clubs-npc',
        type: 'npc',
        x: 82,
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
      // On a high platform - requires jumping
      { id: 'tc-coffee-1', visual: 'coffee', x: 50, y: 58, label: '+5 Energy', resourceBonus: { energy: 5 } },
      // Past the NPC
      { id: 'tc-doc-1', visual: 'document', x: 95, label: 'Club Flyer', flavorText: '"Join the Entrepreneur Club!"' },
    ],
    obstacles: [
      { id: 'tc-rock-1', type: 'rock', x: 38, width: 6, height: 9 },
      { id: 'tc-crate-1', type: 'crate', x: 65, width: 6, height: 11 },
    ],
    enemies: [
      { id: 'tc-ghost-1', type: 'ghost', visual: '\u{1F47B}', patrolStart: 42, patrolEnd: 60, y: 78, speed: 10, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'tc-plat-1', x: 43, y: 62, width: 14, visual: 'stone' },
    ],
  },

  'dark-castle-interior': {
    id: 'dark-castle-interior',
    name: 'The Social Gathering',
    phase: 'university',
    backgroundLayers: [
      { src: churchBg, scrollFactor: 0 },
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'cofounder-npc',
        type: 'npc',
        x: 80,
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
      // Up on platform - detour to collect
      { id: 'dci-gem-1', visual: 'gem', x: 35, y: 58, label: '+$1000', resourceBonus: { money: 1000 } },
    ],
    platforms: [
      { id: 'dci-plat-1', x: 28, y: 63, width: 15, visual: 'wood' },
    ],
    obstacles: [
      { id: 'dci-barrel-1', type: 'barrel', x: 50, width: 6, height: 11 },
      { id: 'dci-crate-1', type: 'crate', x: 68, width: 5, height: 10 },
    ],
    challenge: {
      id: 'qte-social-gathering',
      type: 'quick-time',
      title: 'Social Reflexes',
      description: 'Quick! Match the prompts to make a good first impression.',
      successThreshold: 2,
      gateX: 55,
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
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'final-advisor-npc',
        type: 'npc',
        x: 85,
        y: 78,
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
      // On ground early - easy pickup
      { id: 'cg-doc-1', visual: 'document', x: 22, label: 'Resume Draft', flavorText: '"Skills: Leadership, Problem-Solving"' },
      // On high platform - requires two jumps
      { id: 'cg-gem-plat', visual: 'gem', x: 55, y: 53, label: '+$1000', resourceBonus: { money: 1000 } },
      // Past the NPC - player must go beyond
      { id: 'cg-doc-2', visual: 'document', x: 95, label: '+10 Rep', resourceBonus: { reputation: 10 } },
    ],
    obstacles: [
      { id: 'cg-grave-1', type: 'crate', x: 35, width: 6, height: 11 },
      { id: 'cg-rock-1', type: 'rock', x: 65, width: 6, height: 9 },
    ],
    enemies: [
      { id: 'cg-skeleton-1', type: 'skeleton', visual: '\u{1F480}', patrolStart: 40, patrolEnd: 60, y: 78, speed: 9, width: 4, height: 7 },
    ],
    platforms: [
      { id: 'cg-plat-1', x: 38, y: 65, width: 12, visual: 'stone' },
      { id: 'cg-plat-2', x: 50, y: 57, width: 12, visual: 'stone' },
    ],
  },

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
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'idea-sign',
        type: 'object',
        x: 82,
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
      // On platform - requires jumping
      { id: 'sg-usb-1', visual: 'usb', x: 48, y: 60, label: '+10 Rep', resourceBonus: { reputation: 10 } },
      // Past the sign/NPC
      { id: 'sg-coffee-1', visual: 'coffee', x: 93, label: '+5 Energy', resourceBonus: { energy: 5 } },
    ],
    obstacles: [
      { id: 'sg-barrel-1', type: 'barrel', x: 30, width: 6, height: 11 },
      { id: 'sg-crate-1', type: 'crate', x: 55, width: 5, height: 10 },
      { id: 'sg-rock-1', type: 'rock', x: 72, width: 6, height: 9 },
    ],
    enemies: [
      { id: 'sg-skeleton-1', type: 'skeleton', visual: '\u{1F480}', patrolStart: 35, patrolEnd: 50, y: 78, speed: 12, width: 4, height: 7 },
    ],
    platforms: [
      { id: 'sg-plat-1', x: 40, y: 63, width: 16, visual: 'wood' },
    ],
  },

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
    sceneWidth: 960,
    playerStartX: 10,
    ambientColor: 'sepia(0.2) brightness(0.8)',
    interactables: [
      {
        id: 'competitor-npc',
        type: 'npc',
        x: 83,
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
      // On platform above the challenge gate
      { id: 'sd-coin-1', visual: 'coin', x: 30, y: 58, label: '+$300', resourceBonus: { money: 300 } },
      // Past the NPC
      { id: 'sd-gem-1', visual: 'gem', x: 95, label: '+$500', resourceBonus: { money: 500 } },
    ],
    obstacles: [
      { id: 'sd-bush-1', type: 'barrel', x: 45, width: 5, height: 10 },
      { id: 'sd-rock-1', type: 'rock', x: 68, width: 6, height: 9 },
    ],
    platforms: [
      { id: 'sd-plat-1', x: 23, y: 63, width: 14, visual: 'wood' },
    ],
    challenge: {
      id: 'falling-market-noise',
      type: 'falling-catch',
      title: 'Navigate the Market Noise',
      description: 'Startup life is full of distractions! Move left/right to catch revenue and customers (green glow). Dodge the parties and doomscrolling (red glow)!',
      successThreshold: 8,
      gateX: 50,
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

  'church-meeting': {
    id: 'church-meeting',
    name: 'The Meeting Room',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: churchBg, scrollFactor: 0 },
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'alex-npc',
        type: 'npc',
        x: 84,
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
      // On platform - requires a jump detour
      { id: 'cm-coin-1', visual: 'coin', x: 38, y: 58, label: '+$500', resourceBonus: { money: 500 } },
      // Behind the NPC at far right
      { id: 'cm-coin-2', visual: 'coin', x: 95, label: '+$300', resourceBonus: { money: 300 } },
      // On another platform further along
      { id: 'cm-coffee-1', visual: 'coffee', x: 65, y: 60, label: '+5 Energy', resourceBonus: { energy: 5 } },
    ],
    obstacles: [
      { id: 'cm-crate-1', type: 'crate', x: 28, width: 6, height: 11 },
      { id: 'cm-rock-1', type: 'rock', x: 52, width: 6, height: 9 },
      { id: 'cm-barrel-1', type: 'barrel', x: 75, width: 6, height: 11 },
    ],
    enemies: [
      { id: 'cm-ghost-1', type: 'ghost', visual: '\u{1F47B}', patrolStart: 35, patrolEnd: 55, y: 78, speed: 8, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'cm-plat-1', x: 30, y: 63, width: 16, visual: 'wood' },
      { id: 'cm-plat-2', x: 58, y: 64, width: 14, visual: 'stone' },
    ],
  },

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
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'investor-npc',
        type: 'npc',
        x: 82,
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
      // High platform gem - big reward for skilled players
      { id: 'ch-gem-1', visual: 'gem', x: 42, y: 55, label: '+$1500', resourceBonus: { money: 1500 } },
      // Past the NPC
      { id: 'ch-doc-1', visual: 'document', x: 95, label: 'Term Sheet', flavorText: '"Pre-money valuation: $2M"' },
    ],
    obstacles: [
      { id: 'ch-rock-1', type: 'rock', x: 35, width: 6, height: 9 },
      { id: 'ch-crate-1', type: 'crate', x: 60, width: 6, height: 11 },
    ],
    enemies: [
      { id: 'ch-ghost-1', type: 'ghost', visual: '\u{1F47B}', patrolStart: 39, patrolEnd: 56, y: 78, speed: 10, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'ch-plat-1', x: 35, y: 65, width: 14, visual: 'stone' },
      { id: 'ch-plat-2', x: 38, y: 57, width: 10, visual: 'metal' },
    ],
    challenge: {
      id: 'qte-investor-pitch',
      type: 'quick-time',
      title: 'Impress the Investor',
      description: 'Nail the key combos to impress the investor!',
      successThreshold: 3,
      gateX: 65,
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

  'cemetery-launch': {
    id: 'cemetery-launch',
    name: 'The Final Push',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryGraveyard, scrollFactor: 0.3 },
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 10,
    interactables: [
      {
        id: 'launch-npc',
        type: 'npc',
        x: 85,
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
      // On a platform - detour above the obstacle course
      { id: 'cl-scroll-1', visual: 'scroll', x: 35, y: 58, label: 'Launch Checklist', flavorText: '"Ship it before it\'s perfect."' },
      // Past the NPC at far right
      { id: 'cl-usb-1', visual: 'usb', x: 95, label: '+20 Rep', resourceBonus: { reputation: 20 } },
    ],
    obstacles: [
      { id: 'cl-grave-1', type: 'crate', x: 28, width: 6, height: 11 },
      { id: 'cl-grave-2', type: 'barrel', x: 50, width: 6, height: 11 },
      { id: 'cl-rock-1', type: 'rock', x: 70, width: 6, height: 9 },
    ],
    enemies: [
      { id: 'cl-skeleton-1', type: 'skeleton', visual: '\u{1F480}', patrolStart: 35, patrolEnd: 60, y: 78, speed: 10, width: 4, height: 7 },
      { id: 'cl-ghost-1', type: 'ghost', visual: '\u{1F47B}', patrolStart: 55, patrolEnd: 75, y: 78, speed: 12, width: 5, height: 10 },
    ],
    platforms: [
      { id: 'cl-plat-1', x: 28, y: 63, width: 16, visual: 'stone' },
    ],
  },

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
    sceneWidth: 960,
    playerStartX: 40,
    interactables: [
      {
        id: 'success-npc',
        type: 'npc',
        x: 80,
        y: 78,
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
      // Victory rewards - on platforms and past NPC
      { id: 'ct-gem-1', visual: 'gem', x: 55, y: 58, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-2', visual: 'gem', x: 90, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-3', visual: 'gem', x: 95, label: '+$2000', resourceBonus: { money: 2000 } },
    ],
    platforms: [
      { id: 'ct-plat-1', x: 48, y: 62, width: 14, visual: 'metal' },
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
