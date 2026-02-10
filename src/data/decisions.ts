import type { DecisionNode } from '../types/game';

export const decisionNodes: DecisionNode[] = [
  // ==================== PHASE 1: UNIVERSITY ====================
  {
    id: 'uni_intro',
    phase: 'university',
    type: 'decision',
    title: 'Choose Your Path',
    description: `> SYSTEM BOOT: UNIVERSITY_MODULE.exe
> Loading freshman year...

You're starting university with big dreams of building something that matters.
But first, you need to pick your major. Each path opens different doors.

What will you study?`,
    choices: [
      {
        id: 'cs',
        text: 'Computer Science',
        resourceChanges: { momentum: -10, energy: -10 },
        outcome: `[SELECTED: Computer Science]

You dive deep into algorithms, data structures, and software engineering.
The coursework is intense, but you're building the technical foundation
every founder needs. You can now build your own MVPs.

+SKILL UNLOCKED: Technical Implementation`,
        nextNodeId: 'uni_clubs',
      },
      {
        id: 'business',
        text: 'Business Administration',
        resourceChanges: { reputation: 30, money: -500 },
        outcome: `[SELECTED: Business Administration]

You learn the language of startups: P&L statements, market analysis,
and go-to-market strategies. More importantly, you're surrounded by
ambitious peers who might become future co-founders or investors.

+SKILL UNLOCKED: Business Fundamentals
+30 Reputation (business network)`,
        nextNodeId: 'uni_clubs',
      },
      {
        id: 'engineering',
        text: 'Engineering',
        resourceChanges: { momentum: -15, energy: -15 },
        outcome: `[SELECTED: Engineering]

The workload is brutal, but you're learning to solve hard problems
systematically. You develop a reputation for building things that work.
Your problem-solving skills will be invaluable when things break at 3 AM.

+SKILL UNLOCKED: Problem Solving`,
        nextNodeId: 'uni_clubs',
      },
    ],
  },
  {
    id: 'uni_clubs',
    phase: 'university',
    type: 'decision',
    title: 'Extracurricular Activities',
    description: `> YEAR 1 COMPLETE
> Scanning available_opportunities.db...

Campus life offers more than just classes. Student organizations are
recruiting, and each one could shape your founder journey differently.

Which club will you join?`,
    choices: [
      {
        id: 'entrepreneur_club',
        text: 'Entrepreneurship Society',
        resourceChanges: { reputation: 30, money: -200 },
        outcome: `[JOINED: Entrepreneurship Society]

Weekly pitch nights, guest speakers from local startups, and a Discord
full of wannabe founders. You meet Sarah, a design student with startup
dreams, and Marcus, who's already sold two small businesses.

The membership fee hurts, but these connections are priceless.

+30 Reputation (campus credibility)`,
        nextNodeId: 'uni_event_cofounder',
      },
      {
        id: 'hackathon_team',
        text: 'Hackathon Team',
        resourceChanges: { energy: -20, momentum: 5 },
        outcome: `[JOINED: Hackathon Team]

48-hour coding sprints, energy drinks, and shipping products under
impossible deadlines. Your first hackathon project - a study group
matching app - actually gets users.

You learn that "done" beats "perfect" every time.

+SKILL UNLOCKED: Rapid Prototyping
+5% Momentum (you shipped something!)`,
        nextNodeId: 'uni_event_cofounder',
      },
      {
        id: 'skip_clubs',
        text: 'Skip (Focus on Studies)',
        resourceChanges: { energy: 10 },
        outcome: `[SELECTED: No club activities]

You decide to focus on your grades and personal projects. The extra
rest helps, but sometimes you wonder what connections you're missing.

Your GPA looks great, though.

+10% Energy restored`,
        nextNodeId: 'uni_event_cofounder',
      },
    ],
  },
  {
    id: 'uni_event_cofounder',
    phase: 'university',
    type: 'event',
    title: '>>> RANDOM EVENT <<<',
    description: `> ALERT: SOCIAL_EVENT_DETECTED
> Location: Campus party
> Status: UNEXPECTED_OPPORTUNITY

You're at a party when someone starts talking about their startup idea.
They're clearly smart, passionate, and looking for a technical co-founder.

Their idea: An AI-powered study assistant for students.

How do you respond?`,
    isRandomEvent: true,
    choices: [
      {
        id: 'exchange_info',
        text: 'Exchange contact info',
        resourceChanges: { reputation: 20 },
        outcome: `[CONNECTION ESTABLISHED]

You swap numbers and follow each other on LinkedIn. Alex (that's their
name) seems genuinely talented. Even if this particular idea doesn't
work out, you've expanded your reach with a potential future collaborator.

"Let's grab coffee next week," they say.

+20 Reputation (strong connection)`,
        nextNodeId: 'uni_final',
      },
      {
        id: 'deep_dive',
        text: 'Spend the night discussing the idea',
        resourceChanges: { reputation: 30, energy: -15 },
        outcome: `[DEEP DIVE MODE: ENGAGED]

You end up at a 24-hour diner until 4 AM, sketching wireframes on napkins.
Alex is the real deal - they've already done customer interviews and have
early validation data.

You're exhausted, but excited. This could be something.

+30 Reputation (strong co-founder candidate)
-15% Energy`,
        nextNodeId: 'uni_final',
      },
      {
        id: 'polite_decline',
        text: 'Politely excuse yourself',
        resourceChanges: {},
        outcome: `[OPPORTUNITY: DECLINED]

You nod along, make polite conversation, and slip away. Maybe they'll
build something great, maybe they won't. Either way, you have your
own plans.

Nothing gained, nothing lost.`,
        nextNodeId: 'uni_final',
      },
    ],
  },
  {
    id: 'uni_final',
    phase: 'university',
    type: 'decision',
    title: 'Final Semester',
    description: `> YEAR 4 LOADING...
> Graduation.exe countdown: IMMINENT

Your final semester. Job offers are rolling in - stable salaries, good
benefits, clear career paths. But that startup itch hasn't gone away.

How do you spend your last months as a student?`,
    choices: [
      {
        id: 'grades',
        text: 'Focus on grades (secure backup options)',
        resourceChanges: { momentum: -10 },
        outcome: `[PRIORITY: ACADEMIC EXCELLENCE]

You grind out a perfect final semester. The job offers multiply -
Google, McKinsey, Goldman all come knocking. It's nice to have options.

But as you walk across that graduation stage, you can't shake the
feeling that the safe path isn't YOUR path.

PHASE 1 COMPLETE: Solid foundation established`,
        nextNodeId: 'startup_idea',
      },
      {
        id: 'side_project',
        text: 'Work on a side project',
        resourceChanges: { momentum: 10, energy: -20, money: -1000 },
        outcome: `[INITIATING: SIDE_PROJECT.exe]

Screw the grades. You spend every spare moment building a prototype
of your own idea - a marketplace for student freelancers. It's rough,
but it works. You even get 50 beta users.

Your GPA suffers, but you have something to show for it.

PHASE 1 COMPLETE: MVP experience gained
+10% Momentum (you shipped!)`,
        nextNodeId: 'startup_idea',
      },
      {
        id: 'alumni_network',
        text: 'Network aggressively with alumni',
        resourceChanges: { momentum: -10, reputation: 50, money: -500 },
        outcome: `[NETWORK EXPANSION: MAXIMUM]

You attend every alumni event, send cold LinkedIn messages to founders
who graduated from your school, and even score a few coffee meetings
with local VCs.

One alum, now a successful founder, gives you advice that sticks:
"The best time to start is when you have nothing to lose."

PHASE 1 COMPLETE: Strong network established
+50 Reputation (alumni network)`,
        nextNodeId: 'startup_idea',
      },
    ],
  },

  // ==================== PHASE 2: FIRST STARTUP ====================
  {
    id: 'startup_idea',
    phase: 'firstStartup',
    type: 'decision',
    title: 'The Idea',
    description: `> BOOTING: STARTUP_PHASE.exe
> Status: GRADUATED
> Bank account: Still has money
> Student loans: Let's not talk about it

Graduation is behind you. You've been tinkering with an idea for a
productivity app that helps remote teams stay connected. The market
is crowded, but you see an angle others are missing.

How do you validate this idea?`,
    choices: [
      {
        id: 'build_mvp',
        text: 'Build MVP immediately',
        resourceChanges: { money: -2000, momentum: 15, energy: -25 },
        outcome: `[EXECUTING: BUILD_FIRST_MODE]

"Move fast and break things," right? You lock yourself in your apartment
for a month, surviving on ramen and determination. The MVP is janky but
functional - basic team check-ins with async video messages.

You launch to... crickets. But those 12 users who do sign up? They LOVE it.

-$2,000 (hosting, tools, way too much coffee)
+15% Momentum (you shipped an MVP!)
-25% Energy
+Working MVP`,
        nextNodeId: 'startup_competitor',
      },
      {
        id: 'customer_discovery',
        text: 'Talk to 50 customers first',
        resourceChanges: { momentum: -10, reputation: 20 },
        outcome: `[EXECUTING: LEAN_STARTUP_PROTOCOL]

Before writing a single line of code, you talk to 50 remote workers.
Cold emails, LinkedIn DMs, Twitter threads asking for feedback.

What you learn changes everything: the pain point isn't staying
connected - it's maintaining company culture. You pivot your concept.

-10% Momentum (research takes time)
+Critical market insights
+20 Reputation (market credibility)`,
        nextNodeId: 'startup_competitor',
      },
      {
        id: 'pitch_deck',
        text: '[MINI-GAME] Build a pitch deck first',
        resourceChanges: {},
        outcome: '',
        triggersMiniGame: 'pitchDeck',
        nextNodeId: 'startup_competitor',
      },
    ],
  },
  {
    id: 'startup_competitor',
    phase: 'firstStartup',
    type: 'event',
    title: '>>> MARKET ALERT <<<',
    description: `> WARNING: COMPETITOR_DETECTED
> Threat level: SIGNIFICANT
> Source: TechCrunch RSS feed

You wake up to a push notification that makes your stomach drop.
A well-funded startup just launched a product eerily similar to yours.
They have $5M in funding and a team of 8.

The comments are already comparing you unfavorably.

How do you respond?`,
    isRandomEvent: true,
    choices: [
      {
        id: 'double_down',
        text: 'Double down on speed',
        resourceChanges: { energy: -30, momentum: 10 },
        outcome: `[RESPONSE: AGGRESSIVE_ITERATION]

Sleep is cancelled. You ship three major features in two weeks,
differentiate on customer support (you personally respond to every
message), and focus on a niche they're ignoring.

The sprint nearly kills you, but you're still in the game.

-30% Energy (burnout warning!)
+10% Momentum (shipped fast!)
+Competitive differentiation`,
        nextNodeId: 'startup_cofounder',
      },
      {
        id: 'pivot',
        text: 'Pivot to adjacent market',
        resourceChanges: { momentum: -15, energy: -10 },
        outcome: `[RESPONSE: STRATEGIC_PIVOT]

You can't out-fund them, but you can out-maneuver them. You pivot to
focus specifically on creative agencies - a niche they're not targeting.

The pivot costs momentum, but you find a market that's underserved and
eager for a solution built just for them.

-15% Momentum (pivoting slows you down)
-10% Energy
+Clear market positioning`,
        nextNodeId: 'startup_cofounder',
      },
      {
        id: 'ignore',
        text: 'Stay the course',
        resourceChanges: { energy: 5 },
        outcome: `[RESPONSE: STEADY_AS_SHE_GOES]

"Competition validates the market," you tell yourself. You stick to
your roadmap, trust your vision, and don't let the news derail you.

Some days this feels wise. Other days, it feels like denial.

+5% Energy (less stress)
Future uncertain...`,
        nextNodeId: 'startup_cofounder',
      },
    ],
  },
  {
    id: 'startup_cofounder',
    phase: 'firstStartup',
    type: 'decision',
    title: 'The Co-Founder Question',
    description: `> INCOMING MESSAGE FROM: Alex
> Subject: "I want in"

Remember Alex from that party? They've been following your progress
and want to join as a co-founder. They have skills you lack, but
they want to quit their stable job to do this full-time.

This would accelerate everything - but also burn through runway faster.

What do you tell them?`,
    choices: [
      {
        id: 'full_time',
        text: 'Yes - join full time',
        resourceChanges: { money: -3000, reputation: 30, momentum: 10 },
        outcome: `[CO-FOUNDER: ACTIVATED]

Alex quits their job and moves into your cramped office (your apartment).
Development speed doubles. You can finally take a day off occasionally.

The salary burn is real, but having someone who believes in this as
much as you do? Priceless.

-$3,000/month runway burn
+Full-time co-founder
+10% Momentum (team velocity!)
+30 Reputation (co-founder's network)`,
        nextNodeId: 'startup_funding',
      },
      {
        id: 'part_time',
        text: 'Part-time for now',
        resourceChanges: { reputation: 10, momentum: -10 },
        outcome: `[CO-FOUNDER: PARTIALLY_ACTIVATED]

Alex agrees to nights and weekends. Progress is slower, but you're
not betting everything on unproven ground.

They're frustrated with the pace, but understand the reasoning.
For now.

+Part-time help
+10 Reputation (their credibility helps)
-10% Momentum (split attention slows things down)`,
        nextNodeId: 'startup_funding',
      },
      {
        id: 'decline_cofounder',
        text: 'Not yet - keep building solo',
        resourceChanges: { energy: -10 },
        outcome: `[SOLO_FOUNDER_MODE: CONTINUING]

You turn Alex down gently. "Let's revisit when we're further along."

They're disappointed but respect the decision. You continue grinding
alone, questioning the choice at 2 AM debug sessions.

-10% Energy (loneliness debuff)
Independence maintained`,
        nextNodeId: 'startup_funding',
      },
    ],
  },
  {
    id: 'startup_funding',
    phase: 'firstStartup',
    type: 'decision',
    title: 'Money Talks',
    description: `> RESOURCE ALERT: RUNWAY_LOW
> Calculating remaining_months...
> Recommendation: SEEK_FUNDING or REDUCE_BURN

Your bank account is getting uncomfortably light. You've been living
on savings, and the runway is running out. Time to make a call on
how to fund the next phase.

How do you proceed?`,
    choices: [
      {
        id: 'bootstrap',
        text: 'Bootstrap (freelance on the side)',
        resourceChanges: { money: 5000, momentum: -20, energy: -20 },
        outcome: `[FUNDING: BOOTSTRAP_MODE]

You pick up freelance work to extend the runway. It's brutal - coding
your product by day, client work by night. But you keep 100% equity
and answer to no one.

"Ramen profitable" becomes your new favorite phrase.

+$5,000 (freelance income)
-20% Momentum (split focus kills velocity)
-20% Energy`,
        nextNodeId: 'startup_final',
      },
      {
        id: 'raise',
        text: 'Raise a pre-seed round',
        resourceChanges: { money: 100000, momentum: -15, reputation: 50 },
        outcome: `[FUNDING: VENTURE_CAPITAL_ROUTE]

You spend six weeks pitching - demo days, angel meetings, VC office
hours. The rejection rate is brutal (47 nos), but finally, a small
fund bites. $100k on a SAFE, and they open their network to you.

You're no longer completely in control, but you have firepower.

+$100,000
-15% Momentum (fundraising is slow)
+50 Reputation (investor credibility)
-Equity dilution`,
        nextNodeId: 'startup_final',
      },
      {
        id: 'accelerator',
        text: 'Apply to an accelerator',
        resourceChanges: { money: 25000, momentum: -10, reputation: 100, energy: -15 },
        outcome: `[FUNDING: ACCELERATOR_PROGRAM]

You get into a top accelerator. For three months, you're immersed in
startup boot camp - weekly mentor sessions, peer founders, and a
demo day with 200 investors watching.

The program takes 7% equity, but the credibility and introductions
are worth it.

+$25,000
-10% Momentum (application process)
+100 Reputation (accelerator credibility)
-15% Energy (intense program)`,
        nextNodeId: 'startup_final',
      },
    ],
  },
  {
    id: 'startup_final',
    phase: 'firstStartup',
    type: 'decision',
    title: 'Moment of Truth',
    description: `> PHASE 2 CHECKPOINT
> Metrics loading...
> Users: Growing
> Revenue: ...exists?
> Sanity: Questionable

You've survived the first startup gauntlet. The product works, you
have some users, and you haven't completely burned out. Not bad.

But the next phase requires a bigger bet. What's your final move
before leveling up?`,
    choices: [
      {
        id: 'launch_public',
        text: 'Launch publicly (Product Hunt)',
        resourceChanges: { momentum: 15, energy: -20, reputation: 50 },
        outcome: `[LAUNCHING: PRODUCT_HUNT_CAMPAIGN]

You prepare for weeks - GIFs, copy, coordinating upvotes (ethically!).
Launch day is a blur of F5-mashing and responding to comments.

Result: #4 Product of the Day. 500 new signups. One investor DM.

"We're doing this. We're actually doing this."

+15% Momentum (launched!)
+50 Reputation (public launch buzz)
PHASE 2 COMPLETE: Launched and validated`,
        nextNodeId: 'game_success',
      },
      {
        id: 'enterprise_pivot',
        text: 'Pivot to enterprise sales',
        resourceChanges: { momentum: -10, money: 15000, reputation: 20 },
        outcome: `[EXECUTING: B2B_PIVOT]

Consumer is a grind. You pivot to selling to businesses - higher
prices, longer sales cycles, but real revenue. Your first enterprise
deal: $15,000/year.

It takes forever to close, but when it does? Validation.

"This is a real business now."

-10% Momentum (pivoting slows you down)
+20 Reputation (enterprise credibility)
PHASE 2 COMPLETE: Revenue achieved`,
        nextNodeId: 'game_success',
      },
      {
        id: 'growth_experiment',
        text: 'Run a growth experiment',
        resourceChanges: { money: -2000, momentum: 5, reputation: 30 },
        outcome: `[EXECUTING: GROWTH_HACK_PROTOCOL]

You blow $2k on ads, influencer partnerships, and a referral program.
Most of it flops, but the referral program sticks - users inviting
users, organic growth finally clicking.

The CAC is still too high, but you're learning.

"Growth is a skill. And I'm getting better."

+5% Momentum
+30 Reputation (growth proof)
PHASE 2 COMPLETE: Growth engine started`,
        nextNodeId: 'game_success',
      },
    ],
  },

  // ==================== SUCCESS ENDING ====================
  {
    id: 'game_success',
    phase: 'firstStartup',
    type: 'decision',
    title: '>>> MILESTONE REACHED <<<',
    description: `> ACHIEVEMENT_UNLOCKED: SURVIVED_FIRST_STARTUP
> Status: STILL_STANDING
> Founder level: 1 → 2

You did it. Against the odds, through the uncertainty, past the
moments of doubt - you built something real. It's not a unicorn
(yet), but it's yours.

The journey continues...

[PROTOTYPE END - More phases coming soon!]`,
    choices: [
      {
        id: 'continue',
        text: 'View your journey',
        resourceChanges: {},
        outcome: `[GAME COMPLETE - PROTOTYPE VERSION]

Thanks for playing the Founder's Journey prototype! Your decisions
shaped this story, and no two playthroughs are the same.

Coming soon: Phase 3 (Growth), Phase 4 (Scaling), and Phase 5 (Exit)

For now, review your journey and try again with different choices!`,
        nextNodeId: 'end',
      },
    ],
  },
];

export const randomEvents: DecisionNode[] = [
  {
    id: 'random_viral',
    phase: 'firstStartup',
    type: 'event',
    title: '>>> VIRAL ALERT <<<',
    description: `> UNEXPECTED_TRAFFIC_SPIKE
> Source: Reddit thread
> Status: SERVERS_SWEATING

Someone posted your product on Reddit and it's blowing up.
Comments are mostly positive, but your server is struggling
and there's one bug everyone's complaining about.

Quick - how do you handle this?`,
    isRandomEvent: true,
    choices: [
      {
        id: 'fix_bug',
        text: 'Drop everything and fix the bug',
        resourceChanges: { energy: -15, reputation: 80 },
        outcome: `You ship a fix in 2 hours and post about it in the thread.
The community loves the responsiveness. Several users sign up just
because of how you handled it.

+80 Reputation (viral moment!)
-15% Energy`,
        nextNodeId: 'RETURN_TO_STORY',
      },
      {
        id: 'scale_servers',
        text: 'Scale servers first',
        resourceChanges: { money: -500, reputation: 30 },
        outcome: `You throw money at the problem - bigger servers, CDN,
the works. The site stays up, but the bug complaints continue.

-$500
+30 Reputation (stayed online under pressure)`,
        nextNodeId: 'RETURN_TO_STORY',
      },
    ],
  },
  {
    id: 'random_mentor',
    phase: 'firstStartup',
    type: 'event',
    title: '>>> OPPORTUNITY <<<',
    description: `> INCOMING_MESSAGE
> From: Successful founder in your space
> Subject: "Saw your product, let's chat"

A well-known founder reaches out. They exited their last company
for $50M and are curious about what you're building.

But the meeting would be across town during your busiest week.`,
    isRandomEvent: true,
    choices: [
      {
        id: 'take_meeting',
        text: 'Take the meeting',
        resourceChanges: { momentum: -5, reputation: 40, energy: -10 },
        outcome: `The meeting runs 3 hours. They share hard-won wisdom about
your market, offer to make intros, and hint at potential angel investment.

-5% Momentum
+40 Reputation (mentor endorsement)
-10% Energy
+Invaluable advice`,
        nextNodeId: 'RETURN_TO_STORY',
      },
      {
        id: 'reschedule',
        text: 'Ask to reschedule',
        resourceChanges: { reputation: 10 },
        outcome: `They understand - founders are busy. You schedule for next
month, but momentum is lost. The follow-up meeting never quite happens.

+10 Reputation (stayed on their radar)
Opportunity partially missed`,
        nextNodeId: 'RETURN_TO_STORY',
      },
    ],
  },
];

export function getNodeById(id: string): DecisionNode | undefined {
  return decisionNodes.find(node => node.id === id) ||
         randomEvents.find(node => node.id === id);
}

export function getRandomEvent(phase: string): DecisionNode | null {
  const phaseEvents = randomEvents.filter(e => e.phase === phase);
  if (phaseEvents.length === 0) return null;
  return phaseEvents[Math.floor(Math.random() * phaseEvents.length)];
}
