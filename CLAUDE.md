# Founder's Journey

## Overview
Gothic-themed startup simulation game — narrative decisions, resource management, 2D platformer. TypeScript + React + Vite + Vercel.

## Design Specification
Always reference GAME_DESIGN_DOCUMENT.md as the authoritative design 
specification. All feature decisions, architecture choices, and 
implementation priorities must align with this document. When in doubt 
about what to build or how something should work, check the GDD first.

## Commands
- `npm run dev` — development server
- `npm run build` — production build

## Self-Maintenance Rules
- When a change introduces or alters a structural convention
  (e.g. folder layout, asset pipeline, naming scheme, build workflow),
  add or update a rule in this file so future sessions follow it
  without being told.
- When a change removes a convention (e.g. a folder is deleted,
  a workflow is replaced), remove the corresponding rule from this
  file so it doesn't mislead future sessions.
- Rules should be concise, actionable, and describe *what to do*
  — not history. If a rule no longer matches the codebase, delete it.
- This file is the single source of truth for project-specific
  patterns. Read it at the start of every task; update it whenever
  the patterns change.

## Asset Management
- Tracked assets: `src/assets/used/` (path alias `@assets`)
- Unused assets: `src/assets/game/` (gitignored)

## Gotchas
- CRLF warnings from Git are normal on Windows, ignore them
- Stale closures in RAF loops: always use `useRef` for values read inside `requestAnimationFrame` callbacks

## Architecture Decisions

### State Management (3 contexts)
- **GameContext** (`src/context/GameContext.tsx`) — game logic, resources, decisions. Has `APPLY_BONUS` action for collectible resource changes.
- **SceneContext** (`src/context/SceneContext.tsx`) — visual state, player position, UI panels.
- **VarietyContext** (`src/context/VarietyContext.tsx`) — collectibles (collected IDs, pickup animation) and mini-challenges (phase, score, completed IDs).

### Preserved Files
- `GameContext.tsx` core logic, `decisions.ts`, `types/game.ts` — don't modify these without good reason.

### Variety System (collectibles + mini-challenges)
- **Collectibles**: defined in `scenes.ts` as `collectibles` array on each scene. Rendered by `CollectibleLayer.tsx`. Proximity-triggered (5% range). CSS emoji icons with bob animation.
- **Mini-challenges**: defined in `scenes.ts` as optional `challenge` on a scene. Types: `quick-time` (QTE key press) and `falling-catch` (catch falling items). Gated by X position (`gateX`). Managed by `ChallengeOverlay.tsx`.
- Challenge gating in `GothicGameScreen.tsx` blocks NPC proximity while a challenge is active.
- Challenges are non-punishing: both success and failure let the player proceed.
- Types in `src/types/variety.ts`. Components in `src/components/collectibles/` and `src/components/challenges/`.
