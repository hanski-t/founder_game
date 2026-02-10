import beardedIdle from '@assets/characters/npcs/bearded-idle.png';
import oldmanIdle from '@assets/characters/npcs/oldman-idle.png';

export interface MilestoneDefinition {
  id: string;
  nodeId: string;
  /** Which choice(s) at that node trigger this milestone. Empty = any choice. */
  choiceIds: string[];
  category: 'skill' | 'person' | 'club' | 'funding' | 'achievement';
  icon: string;
  label: string;
  description: string;
  /** Optional NPC sprite sheet for thumbnail portrait */
  sprite?: { src: string; frameWidth: number; frameHeight: number };
  /** If set, this milestone replaces (hides) the one with this id */
  replacesId?: string;
}

/**
 * Static milestone definitions, ordered by story sequence.
 * Only the first matching entry per nodeId is shown (one choice per node).
 */
export const MILESTONES: MilestoneDefinition[] = [
  // ── University Major ──
  {
    id: 'major_cs',
    nodeId: 'uni_intro',
    choiceIds: ['cs'],
    category: 'skill',
    icon: '💻',
    label: 'CS Major',
    description: 'Technical Implementation',
  },
  {
    id: 'major_business',
    nodeId: 'uni_intro',
    choiceIds: ['business'],
    category: 'skill',
    icon: '📊',
    label: 'Business Major',
    description: 'Business Fundamentals',
  },
  {
    id: 'major_engineering',
    nodeId: 'uni_intro',
    choiceIds: ['engineering'],
    category: 'skill',
    icon: '🔧',
    label: 'Engineering Major',
    description: 'Problem Solving',
  },

  // ── Club ──
  {
    id: 'club_entrepreneur',
    nodeId: 'uni_clubs',
    choiceIds: ['entrepreneur_club'],
    category: 'club',
    icon: '🏛️',
    label: 'Entrepreneur Society',
    description: 'Met Sarah & Marcus',
  },
  {
    id: 'club_hackathon',
    nodeId: 'uni_clubs',
    choiceIds: ['hackathon_team'],
    category: 'club',
    icon: '⚡',
    label: 'Hackathon Team',
    description: 'Rapid Prototyping',
  },
  // skip_clubs → no milestone

  // ── Met Alex ──
  {
    id: 'met_alex',
    nodeId: 'uni_event_cofounder',
    choiceIds: ['exchange_info', 'deep_dive'],
    category: 'person',
    icon: '🤝',
    label: 'Met Alex',
    description: 'A potential co-founder',
    sprite: { src: beardedIdle, frameWidth: 40, frameHeight: 47 },
  },
  // polite_decline → no milestone

  // ── Co-founder Alex ──
  {
    id: 'cofounder_alex_full',
    nodeId: 'startup_cofounder',
    choiceIds: ['full_time'],
    category: 'person',
    icon: '👥',
    label: 'Co-founder: Alex',
    description: 'Full-time partner',
    sprite: { src: beardedIdle, frameWidth: 40, frameHeight: 47 },
    replacesId: 'met_alex',
  },
  {
    id: 'cofounder_alex_part',
    nodeId: 'startup_cofounder',
    choiceIds: ['part_time'],
    category: 'person',
    icon: '👥',
    label: 'Advisor: Alex',
    description: 'Part-time help',
    sprite: { src: beardedIdle, frameWidth: 40, frameHeight: 47 },
    replacesId: 'met_alex',
  },
  // decline_cofounder → no milestone

  // ── Funding ──
  {
    id: 'funding_bootstrap',
    nodeId: 'startup_funding',
    choiceIds: ['bootstrap'],
    category: 'funding',
    icon: '🔨',
    label: 'Bootstrapped',
    description: '100% equity retained',
  },
  {
    id: 'funding_preseed',
    nodeId: 'startup_funding',
    choiceIds: ['raise'],
    category: 'funding',
    icon: '💰',
    label: 'Pre-seed $100k',
    description: 'Investor backed',
  },
  {
    id: 'funding_accelerator',
    nodeId: 'startup_funding',
    choiceIds: ['accelerator'],
    category: 'funding',
    icon: '🚀',
    label: 'Accelerator',
    description: 'Program + $25k',
  },

  // ── Idea Validation ──
  {
    id: 'idea_mvp',
    nodeId: 'startup_idea',
    choiceIds: ['build_mvp'],
    category: 'achievement',
    icon: '🛠️',
    label: 'MVP Shipped',
    description: '12 early users',
  },
  {
    id: 'idea_discovery',
    nodeId: 'startup_idea',
    choiceIds: ['customer_discovery'],
    category: 'achievement',
    icon: '🔍',
    label: 'Customer Discovery',
    description: '50 interviews done',
  },
  {
    id: 'idea_pitch',
    nodeId: 'startup_idea',
    choiceIds: ['pitch_deck'],
    category: 'achievement',
    icon: '📋',
    label: 'Pitch Deck',
    description: 'Investor-ready deck',
  },

  // ── Launch Strategy ──
  {
    id: 'launch_public',
    nodeId: 'startup_final',
    choiceIds: ['launch_public'],
    category: 'achievement',
    icon: '🏆',
    label: 'Product Hunt #4',
    description: '500 signups',
  },
  {
    id: 'launch_enterprise',
    nodeId: 'startup_final',
    choiceIds: ['enterprise_pivot'],
    category: 'achievement',
    icon: '🏢',
    label: 'Enterprise Deal',
    description: '$15k/yr contract',
  },
  {
    id: 'launch_growth',
    nodeId: 'startup_final',
    choiceIds: ['growth_experiment'],
    category: 'achievement',
    icon: '📈',
    label: 'Growth Engine',
    description: 'Referral program works',
  },

  // ── Mentor (random event) ──
  {
    id: 'mentor_met',
    nodeId: 'random_mentor',
    choiceIds: ['take_meeting'],
    category: 'person',
    icon: '⭐',
    label: 'Mentor',
    description: '$50M founder connection',
    sprite: { src: oldmanIdle, frameWidth: 34, frameHeight: 42 },
  },
  // reschedule → no milestone
];
