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
    playerStartX: 15,
    interactables: [
      {
        id: 'advisor-npc',
        type: 'npc',
        x: 60,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: oldmanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.oldman,
        label: 'Academic Advisor',
        triggerNodeId: 'uni_intro',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'ts-coin-1', visual: 'coin', x: 28, label: '+$500', resourceBonus: { money: 500 } },
      { id: 'ts-coin-2', visual: 'coin', x: 42, label: '+$200', resourceBonus: { money: 200 } },
      { id: 'ts-scroll-1', visual: 'scroll', x: 78, label: 'Startup Tip', flavorText: '"The best time to start is yesterday."' },
      { id: 'ts-gem-plat', visual: 'gem', x: 45, y: 60, label: '+$800', resourceBonus: { money: 800 } },
    ],
    obstacles: [
      { id: 'ts-bush-1', type: 'bush', x: 35, width: 4, height: 5 },
      { id: 'ts-crate-1', type: 'crate', x: 50, width: 4, height: 6 },
    ],
    platforms: [
      { id: 'ts-plat-1', x: 38, y: 65, width: 15, visual: 'wood' },
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
    playerStartX: 15,
    interactables: [
      {
        id: 'clubs-npc',
        type: 'npc',
        x: 55,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: womanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.woman,
        label: 'Student Activities Lead',
        triggerNodeId: 'uni_clubs',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'tc-coffee-1', visual: 'coffee', x: 30, label: '+5 Energy', resourceBonus: { energy: 5 } },
      { id: 'tc-doc-1', visual: 'document', x: 75, label: 'Club Flyer', flavorText: '"Join the Entrepreneur Club!"' },
    ],
    obstacles: [
      { id: 'tc-rock-1', type: 'rock', x: 38, width: 5, height: 5 },
    ],
    enemies: [
      { id: 'tc-bat-1', type: 'bat', visual: '\u{1F987}', patrolStart: 42, patrolEnd: 52, y: 68, speed: 10, width: 4, height: 4 },
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
    playerStartX: 15,
    interactables: [
      {
        id: 'cofounder-npc',
        type: 'npc',
        x: 50,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: beardedIdle,
        spriteConfig: NPC_SPRITE_CONFIG.bearded,
        label: 'Interesting Stranger',
        triggerNodeId: 'uni_event_cofounder',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'dci-gem-1', visual: 'gem', x: 22, label: '+$1000', resourceBonus: { money: 1000 } },
    ],
    challenge: {
      id: 'qte-social-gathering',
      type: 'quick-time',
      title: 'Social Reflexes',
      description: 'Quick! Match the prompts to make a good first impression.',
      successThreshold: 2,
      gateX: 35,
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
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 15,
    interactables: [
      {
        id: 'final-advisor-npc',
        type: 'npc',
        x: 55,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: oldmanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.oldman,
        label: 'Career Advisor',
        triggerNodeId: 'uni_final',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'cg-doc-1', visual: 'document', x: 25, label: 'Resume Draft', flavorText: '"Skills: Leadership, Problem-Solving"' },
      { id: 'cg-doc-2', visual: 'document', x: 80, label: '+10 Rep', resourceBonus: { reputation: 10 } },
      { id: 'cg-gem-plat', visual: 'gem', x: 60, y: 55, label: '+$1000', resourceBonus: { money: 1000 } },
    ],
    obstacles: [
      { id: 'cg-grave-1', type: 'grave', x: 32, width: 4, height: 6 },
      { id: 'cg-rock-1', type: 'rock', x: 45, width: 5, height: 5 },
    ],
    platforms: [
      { id: 'cg-plat-1', x: 35, y: 65, width: 12, visual: 'stone' },
      { id: 'cg-plat-2', x: 55, y: 58, width: 15, visual: 'stone' },
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
    playerStartX: 15,
    interactables: [
      {
        id: 'idea-sign',
        type: 'object',
        x: 55,
        y: 78,
        width: 48,
        height: 48,
        staticImage: signImg,
        label: 'Business Plan Board',
        triggerNodeId: 'startup_idea',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'sg-usb-1', visual: 'usb', x: 25, label: '+10 Rep', resourceBonus: { reputation: 10 } },
      { id: 'sg-coffee-1', visual: 'coffee', x: 40, label: '+5 Energy', resourceBonus: { energy: 5 } },
    ],
    obstacles: [
      { id: 'sg-barrel-1', type: 'barrel', x: 33, width: 4, height: 6 },
      { id: 'sg-crate-1', type: 'crate', x: 45, width: 4, height: 5 },
    ],
    enemies: [
      { id: 'sg-rat-1', type: 'rat', visual: '\u{1F400}', patrolStart: 28, patrolEnd: 42, y: 78, speed: 14, width: 3, height: 3 },
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
    playerStartX: 15,
    ambientColor: 'sepia(0.2) brightness(0.8)',
    interactables: [
      {
        id: 'competitor-npc',
        type: 'npc',
        x: 60,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: hatManIdle,
        spriteConfig: NPC_SPRITE_CONFIG.hatMan,
        label: 'Market Analyst',
        triggerNodeId: 'startup_competitor',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'sd-coin-1', visual: 'coin', x: 22, label: '+$300', resourceBonus: { money: 300 } },
    ],
    challenge: {
      id: 'falling-market-noise',
      type: 'falling-catch',
      title: 'Navigate the Market Noise',
      description: 'Catch customers and dodge disreputations! Move left/right to catch the green items.',
      successThreshold: 4,
      gateX: 38,
      fallingCatchConfig: {
        duration: 12000,
        spawnInterval: 900,
        goodItems: [
          { visual: '\u{1F9D1}', label: 'Customer' },
          { visual: '\u{1F465}', label: 'Users' },
          { visual: '\u{1F31F}', label: 'Fan' },
        ],
        badItems: [
          { visual: '\u{1F3E2}', label: 'Accelerator' },
          { visual: '\u{1F378}', label: 'Networking' },
          { visual: '\u{1F4F1}', label: 'Social Media' },
          { visual: '\u{1F4DA}', label: 'Conference' },
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
    playerStartX: 15,
    interactables: [
      {
        id: 'alex-npc',
        type: 'npc',
        x: 55,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: beardedIdle,
        spriteConfig: NPC_SPRITE_CONFIG.bearded,
        label: 'Alex (Co-Founder)',
        triggerNodeId: 'startup_cofounder',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'cm-coin-1', visual: 'coin', x: 25, label: '+$500', resourceBonus: { money: 500 } },
      { id: 'cm-coin-2', visual: 'coin', x: 80, label: '+$300', resourceBonus: { money: 300 } },
      { id: 'cm-coffee-1', visual: 'coffee', x: 40, label: '+5 Energy', resourceBonus: { energy: 5 } },
    ],
    obstacles: [
      { id: 'cm-crate-1', type: 'crate', x: 35, width: 4, height: 6 },
      { id: 'cm-rock-1', type: 'rock', x: 48, width: 5, height: 5 },
    ],
    enemies: [
      { id: 'cm-ghost-1', type: 'ghost', visual: '\u{1F47B}', patrolStart: 30, patrolEnd: 50, y: 72, speed: 8, width: 4, height: 5 },
    ],
    platforms: [
      { id: 'cm-plat-1', x: 30, y: 67, width: 14, visual: 'wood' },
    ],
  },

  'castle-hall': {
    id: 'castle-hall',
    name: 'Investor Boardroom',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryMountains, scrollFactor: 0.2 },
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 15,
    interactables: [
      {
        id: 'investor-npc',
        type: 'npc',
        x: 50,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: womanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.woman,
        label: 'Lead Investor',
        triggerNodeId: 'startup_funding',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'ch-gem-1', visual: 'gem', x: 22, label: '+$1500', resourceBonus: { money: 1500 } },
      { id: 'ch-doc-1', visual: 'document', x: 75, label: 'Term Sheet', flavorText: '"Pre-money valuation: $2M"' },
    ],
    challenge: {
      id: 'qte-investor-pitch',
      type: 'quick-time',
      title: 'Impress the Investor',
      description: 'React quickly to show your confidence! 5 prompts, faster timing.',
      successThreshold: 3,
      gateX: 35,
      quickTimeConfig: {
        prompts: [
          { key: 'r', displayKey: 'R' },
          { key: 'g', displayKey: 'G' },
          { key: ' ', displayKey: 'SPACE' },
          { key: 'h', displayKey: 'H' },
          { key: 'l', displayKey: 'L' },
          { key: 'p', displayKey: 'P' },
          { key: 'n', displayKey: 'N' },
        ],
        timePerPrompt: 1200,
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
    playerStartX: 15,
    interactables: [
      {
        id: 'launch-npc',
        type: 'npc',
        x: 60,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: hatManIdle,
        spriteConfig: NPC_SPRITE_CONFIG.hatMan,
        label: 'Launch Coordinator',
        triggerNodeId: 'startup_final',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'cl-scroll-1', visual: 'scroll', x: 30, label: 'Launch Checklist', flavorText: '"Ship it before it\'s perfect."' },
      { id: 'cl-usb-1', visual: 'usb', x: 80, label: '+20 Rep', resourceBonus: { reputation: 20 } },
    ],
    obstacles: [
      { id: 'cl-grave-1', type: 'grave', x: 25, width: 4, height: 6 },
      { id: 'cl-grave-2', type: 'grave', x: 40, width: 4, height: 6 },
      { id: 'cl-rock-1', type: 'rock', x: 52, width: 5, height: 5 },
    ],
    enemies: [
      { id: 'cl-skeleton-1', type: 'skeleton', visual: '\u{1F480}', patrolStart: 30, patrolEnd: 55, y: 78, speed: 10, width: 4, height: 7 },
      { id: 'cl-bat-1', type: 'bat', visual: '\u{1F987}', patrolStart: 45, patrolEnd: 58, y: 65, speed: 12, width: 3, height: 3 },
    ],
  },

  'castle-throne': {
    id: 'castle-throne',
    name: 'The Summit',
    phase: 'firstStartup',
    backgroundLayers: [
      { src: cemeteryBg, scrollFactor: 0 },
      { src: cemeteryMountains, scrollFactor: 0.2 },
    ],
    groundY: 78,
    sceneWidth: 960,
    playerStartX: 40,
    interactables: [
      {
        id: 'success-npc',
        type: 'npc',
        x: 50,
        y: 78,
        width: 64,
        height: 64,
        spriteSheet: oldmanIdle,
        spriteConfig: NPC_SPRITE_CONFIG.oldman,
        label: 'Your Mentor',
        triggerNodeId: 'game_success',
        proximityRange: 10,
        interactionType: 'decision',
      },
    ],
    collectibles: [
      { id: 'ct-gem-1', visual: 'gem', x: 25, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-2', visual: 'gem', x: 65, label: '+$2000', resourceBonus: { money: 2000 } },
      { id: 'ct-gem-3', visual: 'gem', x: 85, label: '+$2000', resourceBonus: { money: 2000 } },
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
