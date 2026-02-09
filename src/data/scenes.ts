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
