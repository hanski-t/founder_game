// DEV MODE: Set to a node ID to lock the game to a specific level.
// After each decision, the game loops back to this level instead of progressing.
// Set to null for normal game flow.
//
// Level → Node ID:
//   1: 'uni_intro'
//   2: 'uni_clubs'
//   3: 'uni_event_cofounder'
//   4: 'uni_final'
//   5: 'startup_idea'
//   6: 'startup_competitor'
//   7: 'startup_cofounder'
//   8: 'startup_funding'
//   9: 'startup_final'
//  10: 'game_success'

export const DEV_LOCK_LEVEL: string | null = 'startup_idea';
