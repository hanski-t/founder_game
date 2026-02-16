# GAME DESIGN DOCUMENT — Founder's Journey
# Machine-readable reference for AI development agents
# Source: Game Design Document by Hannes Täyrönen (Spring 2026)
# This file is the authoritative design specification. All implementation decisions must align with this document.

---

## CORE CONCEPT

- **Title:** Founder's Journey
- **Genre:** Narrative simulation + resource management + 2D platformer
- **Platform:** Desktop/laptop browser only (not mobile)
- **URL:** hannestayronen.com/foundergame
- **Engine:** None — built with web technologies
- **Player count:** Single-player only
- **Session length:** 15–30 minutes full playthrough
- **Core insight:** Founders know the "right" answers. The real challenge is execution under resource constraints and chaos. The game makes this tension the central experience.

---

## DESIGN PRIORITIES (in order)

1. **Narrative and story** — the decisions, dialogue, and branching consequences
2. **Mini-games** — short skill-based challenges that test founder abilities
3. **Resource management** — four resources always visible, always in tension
4. **Level traversal** — 2D platformer elements are secondary connective tissue, NOT the main attraction

---

## TECH STACK

- **Language:** TypeScript
- **UI Framework:** React
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Deployment:** Vercel → hannestayronen.com
- **Version Control:** GitHub

---

## RESOURCES

Four resources are always visible. They fluctuate based on gameplay and decisions.

| Resource | Starting Value | Description |
|----------|---------------|-------------|
| Momentum | 70/100 | Forward progress and execution speed. Losing momentum slows everything — decisions take longer, opportunities shrink, competitors gain ground. |
| Energy | 100% | Burnout meter. Every action drains energy. Hits zero = game over. The founder's mental and physical capacity — most precious, non-renewable. |
| Money | 10,000 | Financial runway. Determines available options and operating time. Up through revenue, fundraising, smart decisions. Down through everything else. |
| Reputation | 0 | Standing in the startup ecosystem. Starts at zero — nobody knows you. Builds through launches, good decisions, relationships. Opens doors money cannot. |

---

## PLAYER CHARACTER

- **Identity:** Unnamed university freshman (blank slate — player projects themselves)
- **Starting state:** Energy and ambition, no experience, no reputation, limited resources
- **Sprite:** Gothic hero from Gothicvania collection
- **Metaphor:** Startup journey as dark quest requiring courage and strategic thinking

---

## GAME STRUCTURE — 5 PHASES, 22 LEVELS

### Phase I — University (Levels 1–4)
- **Theme:** Discovery, possibility, first sparks of ambition
- **Atmosphere:** Warm and inviting
- **Narrative:** Foundational choices — what to study, who to connect with, safe path vs. startup path
- **Key tension:** Decisions shape which skills and relationships are available later

| Level | Name | NPC | Sprite | ID | Role |
|-------|------|-----|--------|----|------|
| 1 | University Courtyard | Academic Advisor | oldman | advisor-npc | Guides major selection. First strategic decision: technical vs. business focus. |
| 2 | Campus Activities | Student Activities Lead | woman | clubs-npc | Introduces clubs/extracurriculars. Trade-offs between Reputation and Energy. |
| 3 | The Social Gathering | Interesting Stranger | bearded | cofounder-npc | Fellow student, potential future co-founder. Pivotal relationship decision. |
| 4 | Graduation Hall | Career Advisor | oldman | final-advisor-npc | The fork: safe corporate path vs. risky startup path. |

### Phase II — First Startup (Levels 5–10)
- **Theme:** Execution, hustle, survival
- **Atmosphere:** Warmer but darker, the grind setting in
- **Narrative:** Building something real. Resources tight, decisions consequential, failure always close.
- **Key tension:** Building product vs. managing relationships vs. securing funding

| Level | Name | NPC | Sprite | ID | Role |
|-------|------|-----|--------|----|------|
| 5 | Business Plan | Business Plan Board | sign (object) | — | Interactive object: business planning challenge. |
| 6 | Competitive Landscape | Market Analyst | hat-man | competitor-npc | Reveals competition. Player decides how to differentiate. |
| 7 | Co-Founder Partnership | Alex (Co-Founder) | bearded | alex-npc | The Stranger returns. Equity split and role allocation. |
| 8 | The Pitch | Lead Investor | woman | investor-npc | Fundraising gate. Outcome depends on prior decisions + mini-game. |
| 9 | The Final Push | Launch Coordinator | hat-man | launch-npc | Product launch prep under time pressure and resource constraints. |
| 10 | The Summit | Your Mentor | oldman | success-npc | Experienced founder reflects on journey, prepares for next phase. |

### Phase III — Growth (Levels 11–14)
- **Theme:** Scaling challenges, transition from builder to leader
- **Atmosphere:** Deeper, more intense
- **Key tensions:** Hiring speed vs. culture fit, customer requests vs. product vision, PR opportunity vs. premature exposure, spending on growth vs. preserving runway
- **Planned NPCs:** First Hire, Key Customer, Journalist, Competitor Founder

### Phase IV — Scaling (Levels 15–18)
- **Theme:** Organizational complexity, co-founder dynamics, personal limits
- **Atmosphere:** Dark, corporate tension
- **Key tensions:** Control vs. delegation, domestic vs. international, co-founder alignment, personal health vs. company demands
- **Planned NPCs:** Board Member, PR Crisis Handler, International Partner

### Phase V — Exit (Levels 19–22)
- **Theme:** Legacy, endgame decisions, reflection
- **Atmosphere:** Dramatic contrasts — light at the end of the tunnel
- **Multiple endings:** IPO, acquisition, sustainable lifestyle business, or graceful shutdown. Each reflects cumulative decisions. No ending is "wrong."
- **Planned NPCs:** Investment Banker, Acquirer, Returning Mentor (from Level 10)

---

## MINI-GAMES

Short interactive challenges (15–60 seconds) testing real founder skills. Performance directly affects resource outcomes.

| Mini-Game | When | Mechanic | Tests |
|-----------|------|----------|-------|
| Pitch Deck Builder | Before investor meetings | Drag-and-drop slides into correct order | Pitch structure and prioritization |
| Feature Prioritization | Product development decisions | Sort features by impact vs. effort | Ruthless prioritization skills |
| Quick-Time Events | High-pressure moments | Timed key presses | Decision speed under pressure |

---

## ENEMIES AND OBSTACLES

Enemies are **level hazards, not narrative antagonists.** They represent distractions and minor setbacks.

| Enemy | Behavior | Penalty |
|-------|----------|---------|
| Ghost | Floating, drifting | Small Money loss |
| Skeleton | Ground patrol | Small Money loss |
| Bat | Fast, swooping | Small Money loss |

**Static obstacles:** Crates, gaps, elevated platforms. Jump over or navigate around. Purely mechanical, no narrative weight.

**Collectibles:** Coins (increase Money), Energy orbs (restore Energy). Reward exploration.

**True "enemies" are systemic:** Resource depletion, bad decision cascades, time pressure, unpredictable events.

---

## VISUAL IDENTITY

- **Asset source:** Gothicvania Patreon Collection by Ansimuz (ansimuz.itch.io/gothicvania-patreon-collection)
- **Style:** 16-bit gothic pixel art
- **Metaphor:** Startup journey as dark fantasy quest
- **Phase atmospheres:** University (warm/inviting) → First Startup (orange/sepia, grind) → Growth (deeper/intense) → Scaling (dark/corporate) → Exit (dramatic contrasts)
- **NPC sprites:** oldman, woman, bearded, hat-man — visually distinct roles

---

## AUDIO

- **Voice/SFX:** ElevenLabs AI voice synthesis
- **Music:** Royalty-free libraries + AI audio generation

---

## CONTROLS

| Input | Action |
|-------|--------|
| WASD / Arrow Keys | Move left/right |
| Space | Jump |
| Enter / Mouse Click | Interact with NPCs, select dialogue options, operate mini-game UI |

Mini-games may introduce temporary additional controls (drag-and-drop, timed presses) explained in context.

---

## BUSINESS MODEL

- **Launch:** Free to play, no paywalls, no in-app purchases
- **Future potential:** Ad integration between levels, one-time premium content pack (extra levels/paths)

---

## IMPLEMENTATION SCOPE

- **Current focus:** Phases I–II (Levels 1–10) as complete proof-of-concept
- **Future development:** Phases III–V to be built as project progresses
- **State management:** All client-side (no server-side game logic)
- **Target device:** Desktop/laptop browsers (Chrome, Firefox, Safari, Edge)
- **Not supported:** Mobile devices