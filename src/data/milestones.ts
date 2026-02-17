import beardedIdle from '@assets/characters/npcs/bearded-idle.png';

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
    nodeId: 'uni_cofounder',
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

  // ── Phase 3: Growth ──
  {
    id: 'hired_senior',
    nodeId: 'growth_hiring',
    choiceIds: ['hire_senior'],
    category: 'person',
    icon: '👨‍💻',
    label: 'Senior Engineer',
    description: 'Experience pays off',
  },
  {
    id: 'hired_juniors',
    nodeId: 'growth_hiring',
    choiceIds: ['hire_junior'],
    category: 'person',
    icon: '👥',
    label: 'Junior Team',
    description: 'Two eager juniors',
  },
  {
    id: 'press_coverage',
    nodeId: 'growth_marketing',
    choiceIds: ['full_press'],
    category: 'achievement',
    icon: '📰',
    label: 'Press Coverage',
    description: 'TechCrunch feature',
  },
  {
    id: 'product_led_growth',
    nodeId: 'growth_spending',
    choiceIds: ['product_led'],
    category: 'achievement',
    icon: '🔄',
    label: 'Viral Loop',
    description: 'Product-led growth',
  },

  // ── Phase 4: Scaling ──
  {
    id: 'vp_product',
    nodeId: 'scaling_control',
    choiceIds: ['delegate_product'],
    category: 'person',
    icon: '📋',
    label: 'VP Product',
    description: 'Delegated decisions',
  },
  {
    id: 'international',
    nodeId: 'scaling_expansion',
    choiceIds: ['go_international'],
    category: 'achievement',
    icon: '🌍',
    label: 'International',
    description: 'European expansion',
  },

  // ── Phase 5: Exit ──
  {
    id: 'negotiated_deal',
    nodeId: 'exit_legacy',
    choiceIds: ['negotiate_higher'],
    category: 'achievement',
    icon: '💎',
    label: 'Negotiator',
    description: 'Countered the offer',
  },
  {
    id: 'team_first',
    nodeId: 'exit_deal',
    choiceIds: ['generous_packages'],
    category: 'achievement',
    icon: '❤️',
    label: 'Team First',
    description: 'Generous packages',
  },
  {
    id: 'serial_founder',
    nodeId: 'exit_final',
    choiceIds: ['start_again'],
    category: 'achievement',
    icon: '🔁',
    label: 'Serial Founder',
    description: 'Starting again',
  },
];
