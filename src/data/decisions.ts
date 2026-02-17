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
        nextNodeId: 'uni_cofounder',
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
        nextNodeId: 'uni_cofounder',
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
        nextNodeId: 'uni_cofounder',
      },
    ],
  },
  {
    id: 'uni_cofounder',
    phase: 'university',
    type: 'decision',
    title: 'The Co-Founder Encounter',
    description: `> ALERT: SOCIAL_EVENT_DETECTED
> Location: Campus party
> Status: UNEXPECTED_OPPORTUNITY

You're at a party when someone starts talking about their startup idea.
They're clearly smart, passionate, and looking for a technical co-founder.

Their idea: An AI-powered study assistant for students.

How do you respond?`,
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
        nextNodeId: 'startup_cofounder',
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
        nextNodeId: 'startup_cofounder',
      },
      {
        id: 'pitch_deck',
        text: '[MINI-GAME] Build a pitch deck first',
        resourceChanges: {},
        outcome: '',
        triggersMiniGame: 'pitchDeck',
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
        resourceChanges: { money: 50000, momentum: -20, energy: -20 },
        outcome: `[FUNDING: BOOTSTRAP_MODE]

You pick up freelance work to extend the runway. It's brutal - coding
your product by day, client work by night. But you keep 100% equity
and answer to no one. Over a few months, freelance gigs and your
first paying customers bring in real money.

"Ramen profitable" becomes your new favorite phrase.

+$50,000 (freelance + early revenue)
-20% Momentum (split focus kills velocity)
-20% Energy`,
        nextNodeId: 'growth_hiring',
      },
      {
        id: 'raise',
        text: 'Raise a pre-seed round',
        resourceChanges: { money: 500000, momentum: -15, reputation: 50 },
        outcome: `[FUNDING: VENTURE_CAPITAL_ROUTE]

You spend six weeks pitching - demo days, angel meetings, VC office
hours. The rejection rate is brutal (47 nos), but finally, a fund
bites. $500k on a SAFE at a $3M valuation, and they open their
network to you.

You're no longer completely in control, but you have real firepower.

+$500,000
-15% Momentum (fundraising is slow)
+50 Reputation (investor credibility)
-Equity dilution (gave up ~15%)`,
        nextNodeId: 'growth_hiring',
      },
      {
        id: 'accelerator',
        text: 'Apply to an accelerator',
        resourceChanges: { money: 150000, momentum: -10, reputation: 100, energy: -15 },
        outcome: `[FUNDING: ACCELERATOR_PROGRAM]

You get into a top accelerator. For three months, you're immersed in
startup boot camp - weekly mentor sessions, peer founders, and a
demo day with 200 investors watching.

The program invests $150k for 7% equity. The credibility and
introductions alone are worth more than the check.

+$150,000
-10% Momentum (application process)
+100 Reputation (accelerator credibility)
-15% Energy (intense program)`,
        nextNodeId: 'growth_hiring',
      },
    ],
  },

  // ==================== PHASE 3: GROWTH ====================
  {
    id: 'growth_hiring',
    phase: 'growth',
    type: 'decision',
    title: 'The First Hire',
    description: `> PHASE 3: GROWTH_MODE.exe
> Team size: 2 → ?
> Inbox: 200 applicants
> Culture: Still vibes-based

Your startup is growing. You need people — but who?
The applicant pool ranges from hungry juniors to expensive
veterans. Every hire at this stage shapes the company culture.

How do you approach your first real hire?`,
    choices: [
      {
        id: 'hire_senior',
        text: 'Hire an expensive senior engineer',
        resourceChanges: { money: -80000, momentum: 10, energy: -5 },
        outcome: `[HIRE: SENIOR_ENGINEER]

You bring on a 10-year veteran at $160k/year. Their salary eats
into runway, but they immediately fix your architecture, set up
CI/CD, and mentor the whole team (both of you).

The codebase goes from "startup spaghetti" to "startup linguine."
Progress accelerates overnight.

-$80,000 (six months salary)
+10% Momentum (experience pays off)
-5% Energy (onboarding effort)`,
        nextNodeId: 'growth_product',
      },
      {
        id: 'hire_junior',
        text: 'Hire two hungry juniors',
        resourceChanges: { money: -50000, momentum: 5, energy: -15 },
        outcome: `[HIRE: TWO_JUNIORS]

They're cheap, eager, and work insane hours. But they need
constant guidance, break things regularly, and you spend half
your time reviewing their code instead of building.

Still — their energy is infectious. And they'll be loyal forever.

-$50,000 (two junior salaries, six months)
+5% Momentum (more hands, slower start)
-15% Energy (mentoring overhead)`,
        nextNodeId: 'growth_product',
      },
      {
        id: 'hire_contractor',
        text: 'Use contractors for now',
        resourceChanges: { money: -30000, reputation: -10 },
        outcome: `[HIRE: CONTRACTOR_MODE]

No commitment, no equity, no drama. Contractors ship the feature
and move on. It's efficient but impersonal.

Your company culture remains... undefined. And one contractor
disappears mid-sprint without notice.

-$30,000 (contractor fees)
-10 Reputation (no team to show investors)
Flexibility maintained`,
        nextNodeId: 'growth_product',
      },
    ],
  },
  {
    id: 'growth_product',
    phase: 'growth',
    type: 'decision',
    title: 'Feature Crossroads',
    description: `> INCOMING: 47 feature requests
> Biggest customer: "Add X or we leave"
> Product vision: Getting blurry
> Competitor just shipped: Your roadmap item #3

Your biggest customer wants a feature that would take the product
in a direction you never planned. It's lucrative but off-strategy.
Meanwhile, competitors are catching up on your core features.

What's the product call?`,
    choices: [
      {
        id: 'build_customer_feature',
        text: 'Build what the big customer wants',
        resourceChanges: { money: 250000, momentum: -15, reputation: 10 },
        outcome: `[PRODUCT: CUSTOMER_DRIVEN]

You bend the roadmap. The customer is thrilled and signs a two-year
enterprise contract worth $250k/year. But your product is becoming
a franken-tool — half platform, half custom solution.

Other customers start asking: "Wait, you do THAT now?"

+$250,000 (enterprise deal)
-15% Momentum (off-roadmap detour)
+10 Reputation (enterprise credibility)`,
        nextNodeId: 'growth_marketing',
      },
      {
        id: 'stay_on_vision',
        text: 'Stay on your product vision',
        resourceChanges: { money: 100000, momentum: 5, energy: -10 },
        outcome: `[PRODUCT: VISION_FIRST]

You politely decline the request. The customer threatens to leave.
But you ship three core improvements that make the product
undeniably better for everyone else.

Two months later, five new customers sign up specifically because
of those improvements. ARR crosses $100k. The big customer? They stayed too.

+$100,000 (new customer revenue)
+5% Momentum (focused execution)
-10% Energy (standing your ground is exhausting)`,
        nextNodeId: 'growth_marketing',
      },
      {
        id: 'build_both',
        text: 'Try to build both (crunch mode)',
        resourceChanges: { money: 150000, energy: -25, momentum: -5 },
        outcome: `[PRODUCT: CRUNCH_MODE_ENGAGED]

You promise everything to everyone. The team works nights and
weekends for a month. Both features ship, both are... okay.

Neither is great. The tech debt is mounting. But you land a $150k
contract from a customer impressed by the breadth. Sort of a win.

+$150,000 (mixed contracts)
-25% Energy (team burnout warning!)
-5% Momentum (quality suffers)`,
        nextNodeId: 'growth_marketing',
      },
    ],
  },
  {
    id: 'growth_marketing',
    phase: 'growth',
    type: 'decision',
    title: 'Going Public',
    description: `> NOTIFICATION: TechCrunch wants to write about you
> Twitter followers: 2,400
> Product: Ready? Maybe?
> Competitor funding: $15M Series A

A journalist from a major tech publication wants to profile your
startup. It could be massive exposure — or premature attention
that brings scrutiny you're not ready for.

Your product still has rough edges. Do you go public?`,
    choices: [
      {
        id: 'full_press',
        text: 'Go all-in on the press coverage',
        resourceChanges: { reputation: 40, energy: -15, momentum: -5 },
        outcome: `[MARKETING: FULL_PRESS_BLITZ]

The article drops and your inbox explodes. 2,000 signups in
24 hours. Support tickets multiply by 10x. Three VCs slide
into your DMs.

But users are hitting bugs you know about. Reviews are mixed.
The attention is a double-edged sword.

+40 Reputation (media exposure)
-15% Energy (managing the storm)
-5% Momentum (firefighting mode)`,
        nextNodeId: 'growth_spending',
      },
      {
        id: 'delay_press',
        text: 'Ask to delay until product is ready',
        resourceChanges: { reputation: 10, momentum: 10 },
        outcome: `[MARKETING: STRATEGIC_DELAY]

You ask the journalist to wait two months. They're mildly
annoyed but agree. You use the time to polish, fix bugs,
and prepare your infrastructure for scale.

When the article finally runs, the product is solid. Reviews
are glowing. No firefighting needed.

+10 Reputation (controlled narrative)
+10% Momentum (shipped a polished product)`,
        nextNodeId: 'growth_spending',
      },
      {
        id: 'stealth_mode',
        text: 'Decline and stay in stealth',
        resourceChanges: { energy: 10, reputation: -5 },
        outcome: `[MARKETING: STEALTH_CONTINUES]

You turn down the coverage. The journalist writes about your
competitor instead. They get the spotlight, the signups, the
investor attention.

But you have peace, focus, and time. Some days that feels
wise. Other days, it feels like hiding.

+10% Energy (no media circus)
-5 Reputation (invisible startup)`,
        nextNodeId: 'growth_spending',
      },
    ],
  },
  {
    id: 'growth_spending',
    phase: 'growth',
    type: 'decision',
    title: 'The Growth Budget',
    description: `> RUNWAY: 8 months remaining
> Growth rate: 15% month-over-month
> Board expectation: 25% MoM
> Marketing budget: $0 allocated

The board (your investor and advisor) wants faster growth.
You have money in the bank but spending it on growth means
less runway if things don't work.

How do you allocate the growth budget?`,
    choices: [
      {
        id: 'aggressive_spend',
        text: 'Burn fast — paid ads and partnerships',
        resourceChanges: { money: -150000, momentum: 10, reputation: 20 },
        outcome: `[GROWTH: AGGRESSIVE_SPEND]

You blow through $150k on ads, partnerships, and a sponsored
event. Growth jumps to 30% MoM. The board is happy.

But the CAC is $200 per user, and LTV is... unclear. You're
buying growth, not earning it. The clock is ticking faster.

-$150,000 (marketing spend)
+10% Momentum (numbers go up)
+20 Reputation (visible growth)`,
        nextNodeId: 'scaling_control',
      },
      {
        id: 'organic_growth',
        text: 'Focus on organic — content and community',
        resourceChanges: { money: -30000, energy: -15, momentum: -5, reputation: 15 },
        outcome: `[GROWTH: ORGANIC_SLOW_BURN]

You write blog posts, host webinars, and build a community
Discord. Growth stays at 15% but the users who come are
passionate and sticky.

The board is impatient. "When does this hockey stick?"

-$30,000 (content team + production)
-15% Energy (content creation grind)
-5% Momentum (board pressure)
+15 Reputation (thought leadership)`,
        nextNodeId: 'scaling_control',
      },
      {
        id: 'product_led',
        text: 'Product-led growth — build virality in',
        resourceChanges: { money: -60000, energy: -20, momentum: 10 },
        outcome: `[GROWTH: PRODUCT_LED]

You spend two months building referral features, shareable
reports, and a freemium tier. It's a bet on the product
selling itself.

Month one: nothing. Month two: a trickle. Month three:
the viral loop catches. Users invite users who invite users.

-$60,000 (engineering investment)
-20% Energy (building features)
+10% Momentum (compounding growth)`,
        nextNodeId: 'scaling_control',
      },
    ],
  },

  // ==================== PHASE 4: SCALING ====================
  {
    id: 'scaling_control',
    phase: 'scaling',
    type: 'decision',
    title: 'Control vs. Delegation',
    description: `> TEAM SIZE: 12 employees
> YOUR CALENDAR: 8 hours of meetings daily
> CODE COMMITS (you): 0 this week
> DECISIONS WAITING: 23

The company is too big for you to touch everything, but
you built this from nothing. Letting go feels like losing
control. Your calendar is wall-to-wall meetings.

Something has to give. What do you delegate?`,
    choices: [
      {
        id: 'delegate_product',
        text: 'Hire a VP of Product',
        resourceChanges: { money: -200000, momentum: 10, energy: 15 },
        outcome: `[SCALING: DELEGATE_PRODUCT]

Sarah, your VP Product hire, is brilliant. Within a month
she's running standups, writing specs, and making calls you
would have agonized over for days.

The product evolves in directions you didn't expect. Some good.
Some... different. It's not YOUR product anymore. It's better.

-$200,000 (VP salary + equity)
+10% Momentum (unblocked decisions)
+15% Energy (you can breathe again)`,
        nextNodeId: 'scaling_expansion',
      },
      {
        id: 'delegate_ops',
        text: 'Hire a COO',
        resourceChanges: { money: -180000, energy: 10, reputation: 10 },
        outcome: `[SCALING: DELEGATE_OPS]

Your COO takes over HR, finance, legal, and office management.
You didn't realize how much mental overhead those tasks consumed
until someone else handled them.

You're back to building. But product decisions still pile up
on YOUR desk. At least the office runs itself now.

-$180,000 (COO salary + equity)
+10% Energy (operational relief)
+10 Reputation (professional operation)`,
        nextNodeId: 'scaling_expansion',
      },
      {
        id: 'keep_control',
        text: 'Keep control — you can handle it',
        resourceChanges: { energy: -20, momentum: -10 },
        outcome: `[SCALING: FOUNDER_DOES_EVERYTHING]

You cancel your vacation. Again. You review every PR, approve
every expense, and sit in every customer call. The team waits
for YOUR approval on everything.

Quality stays high. Speed drops. Your co-founder gives you
"the look" during standup. You ignore it.

-20% Energy (approaching burnout)
-10% Momentum (bottleneck: you)`,
        nextNodeId: 'scaling_expansion',
      },
    ],
  },
  {
    id: 'scaling_expansion',
    phase: 'scaling',
    type: 'decision',
    title: 'International Waters',
    description: `> INBOUND: Partnership offer from European distributor
> DOMESTIC MARKET: 40% penetrated
> INTERNATIONAL: 0% presence
> TEAM LANGUAGE: English only

A European company wants to distribute your product across
the EU. It's a huge market, but localization, time zones,
compliance (GDPR!), and cultural differences add complexity.

Do you expand internationally?`,
    choices: [
      {
        id: 'go_international',
        text: 'Take the deal — expand to Europe',
        resourceChanges: { money: -300000, reputation: 30, momentum: -10, energy: -10 },
        outcome: `[SCALING: INTERNATIONAL_EXPANSION]

You sign the deal. Suddenly you're dealing with GDPR compliance,
multi-currency billing, and 3 AM support calls from Berlin.

But revenue from Europe starts flowing. New logo? Check.
International credibility? Check. Sleep schedule? Destroyed.

-$300,000 (localization + compliance + EU team)
+30 Reputation (international brand)
-10% Momentum (complexity overhead)
-10% Energy (time zone juggling)`,
        nextNodeId: 'scaling_cofounder',
      },
      {
        id: 'domestic_focus',
        text: 'Double down on domestic market',
        resourceChanges: { money: 800000, momentum: 5 },
        outcome: `[SCALING: DOMESTIC_DOMINANCE]

You politely decline and double down on the home market.
Your sales team closes three enterprise deals worth $500k each.
ARR hits $2M. The pipeline is overflowing.

Europe can wait. You're not done winning here yet.

+$800,000 (enterprise revenue)
+5% Momentum (focused execution)`,
        nextNodeId: 'scaling_cofounder',
      },
      {
        id: 'remote_first',
        text: 'Go remote-first and serve everyone',
        resourceChanges: { money: -200000, energy: -15, reputation: 20 },
        outcome: `[SCALING: REMOTE_FIRST_GLOBAL]

You restructure as a remote-first company. Hire contractors
in Europe for support, auto-translate the product, and serve
customers in any time zone.

It's messy. It's chaotic. But your team now spans 6 countries
and your product works everywhere. Sort of.

-$200,000 (infrastructure + remote hiring)
-15% Energy (managing remote chaos)
+20 Reputation (global presence)`,
        nextNodeId: 'scaling_cofounder',
      },
    ],
  },
  {
    id: 'scaling_cofounder',
    phase: 'scaling',
    type: 'decision',
    title: 'Co-Founder Tensions',
    description: `> ALERT: CO-FOUNDER_CONFLICT_DETECTED
> Alex's vision: "We should pivot to enterprise"
> Your vision: "We should stay product-led"
> Board meeting: Next Tuesday
> Tension level: HIGH

Alex wants to pivot the company toward enterprise sales.
You believe in the product-led approach that got you here.
This isn't a small disagreement — it's a fundamental
difference in company direction.

The board will ask for a unified strategy. How do you handle this?`,
    choices: [
      {
        id: 'compromise_hybrid',
        text: 'Propose a hybrid approach',
        resourceChanges: { energy: -10, momentum: -5, reputation: 10 },
        outcome: `[COFOUNDER: COMPROMISE_REACHED]

You spend a weekend with Alex hammering out a hybrid strategy:
product-led for SMBs, light-touch sales for enterprise. Both
of you give up something.

The board buys it. Alex is... satisfied. Not happy. Satisfied.
The tension drops from "explosive" to "simmering."

-10% Energy (emotional labor)
-5% Momentum (strategic ambiguity)
+10 Reputation (mature leadership)`,
        nextNodeId: 'exit_legacy',
      },
      {
        id: 'assert_vision',
        text: 'Assert your vision as CEO',
        resourceChanges: { momentum: 10, reputation: -10, energy: -15 },
        outcome: `[COFOUNDER: CEO_OVERRIDE]

You pull rank. "I'm the CEO. We're staying product-led."
Alex is furious but accepts. The board backs your decision.

Execution is fast and focused. But Alex starts working shorter
hours. The partnership that built this company feels... strained.

+10% Momentum (clear direction)
-10 Reputation (co-founder conflict visible)
-15% Energy (relationship damage)`,
        nextNodeId: 'exit_legacy',
      },
      {
        id: 'let_alex_lead',
        text: 'Let Alex run an enterprise experiment',
        resourceChanges: { money: 1000000, momentum: -10, reputation: 15 },
        outcome: `[COFOUNDER: ALEX_EXPERIMENT]

You give Alex a quarter and a budget to prove the enterprise
thesis. If it works, you pivot. If not, product-led wins.

Alex comes alive. The experiment lands two enterprise deals
worth $500k each. The data is... inconvenient for your thesis.

+$1,000,000 (enterprise deals)
-10% Momentum (split focus)
+15 Reputation (mature co-founder dynamic)`,
        nextNodeId: 'exit_legacy',
      },
    ],
  },

  // ==================== PHASE 5: EXIT ====================
  {
    id: 'exit_legacy',
    phase: 'exit',
    type: 'decision',
    title: 'The Acquisition Offer',
    description: `> INCOMING: Acquisition interest from BigCorp
> Offer: $50M cash + $20M earnout
> Company valuation (internal): $40M-$80M
> Team reaction: Mixed
> Alex's take: "Let's hear them out"

A large corporation wants to acquire your startup. The offer
is significant — life-changing money for you and the team.
Your investors would get 10x+ returns, and you'd be... an
employee again.

How do you respond?`,
    choices: [
      {
        id: 'negotiate_higher',
        text: 'Counter with a higher number',
        resourceChanges: { reputation: 20, energy: -10 },
        outcome: `[EXIT: NEGOTIATION_MODE]

You counter at $100M. They come back at $65M. You counter at $85M.
Three weeks of back-and-forth, lawyers, due diligence requests.

The final offer: $80M with favorable terms. Not bad for a
company you started in your apartment.

+20 Reputation (strong negotiation)
-10% Energy (deal fatigue)
Option still open...`,
        nextNodeId: 'exit_deal',
      },
      {
        id: 'decline_offer',
        text: "Decline — you're building something bigger",
        resourceChanges: { momentum: 15, money: -100000, energy: -5 },
        outcome: `[EXIT: INDEPENDENCE_CHOSEN]

"We're not for sale." The words feel powerful leaving your mouth.
The BigCorp exec nods respectfully. Your team is energized.

But now you need to prove it was the right call. The pressure
to perform just doubled. No safety net.

+15% Momentum (conviction energy)
-$100,000 (legal fees from the process)
-5% Energy (weight of the decision)`,
        nextNodeId: 'exit_deal',
      },
      {
        id: 'explore_options',
        text: 'Explore other buyers too',
        resourceChanges: { reputation: 10, energy: -15, money: -200000 },
        outcome: `[EXIT: COMPETITIVE_PROCESS]

You hire a banker and run a competitive process. Three companies
express interest. The resulting bidding war is stressful but
pushes the valuation past $100M.

You now have options. Real options. But the process has consumed
two months of your life.

+10 Reputation (market validation)
-15% Energy (process exhaustion)
-$200,000 (banker fees + legal)`,
        nextNodeId: 'exit_deal',
      },
    ],
  },
  {
    id: 'exit_deal',
    phase: 'exit',
    type: 'decision',
    title: 'The Team Question',
    description: `> TEAM MORALE: Anxious
> EARLY EMPLOYEES: Asking about their equity
> ALEX: "Whatever you decide, I'm with you"
> YOUR REPUTATION: On the line

Whatever path you choose, your team's future hangs in the
balance. The people who believed in you when no one else did.
The ones who took below-market salaries for equity promises.

How do you handle the team through this transition?`,
    choices: [
      {
        id: 'generous_packages',
        text: 'Guarantee generous packages for everyone',
        resourceChanges: { money: -500000, reputation: 30, energy: 5 },
        outcome: `[EXIT: TEAM_FIRST]

You personally guarantee retention bonuses, accelerated vesting,
and severance packages. It costs you $500k from your own payout.

Every single team member sends you a message that night.
Most of them say the same thing: "Thank you for being different."

-$500,000 (from your share)
+30 Reputation (legendary founder move)
+5% Energy (clear conscience)`,
        nextNodeId: 'exit_final',
      },
      {
        id: 'standard_terms',
        text: 'Follow standard equity terms (what they signed)',
        resourceChanges: { reputation: -5, energy: -5 },
        outcome: `[EXIT: BY_THE_BOOK]

You honor every contract exactly as written. Some team members
do well. Some who joined later get less than they hoped.

It's fair. It's legal. But two early employees — the ones who
took the biggest risks — leave disappointed. You see it in
their eyes during the all-hands.

-5 Reputation (just okay isn't great)
-5% Energy (guilt weighs on you)`,
        nextNodeId: 'exit_final',
      },
      {
        id: 'fight_for_team',
        text: 'Fight the acquirer for better team terms',
        resourceChanges: { money: -200000, reputation: 20, energy: -10 },
        outcome: `[EXIT: TEAM_ADVOCATE]

You go back to the negotiating table. "My team gets better terms
or the deal is off." The acquirer pushes back. You hold firm.

They agree to retention bonuses and a two-year guarantee.
Your own payout drops, but your team is protected.

-$200,000 (legal + reduced personal terms)
+20 Reputation (earned deep loyalty)
-10% Energy (tough negotiations)`,
        nextNodeId: 'exit_final',
      },
    ],
  },
  {
    id: 'exit_final',
    phase: 'exit',
    type: 'decision',
    title: "The Founder's Choice",
    description: `> STATUS: Decision time
> YEARS SINCE UNI_INTRO: ~5
> STARTUPS FOUNDED: 1
> LIVES CHANGED: Many
> WHAT'S NEXT: ?

This is it. The final decision. Everything you've built,
every relationship you've forged, every risk you've taken —
it all leads to this moment.

What does the next chapter look like?`,
    choices: [
      {
        id: 'sell_and_rest',
        text: 'Close the deal and take a break',
        resourceChanges: { money: 25000000, energy: 20, momentum: -20 },
        outcome: `[EXIT: THE_REST]

You sign the papers. The wire hits your account — $25 million.
You take three months off — the first real vacation in five years.

On a beach somewhere, you catch yourself sketching product ideas
on a napkin. Old habits. But for now, you rest.

+$25,000,000 (exit proceeds)
+20% Energy (finally resting)
-20% Momentum (stepping back)`,
        nextNodeId: 'exit_endgame',
      },
      {
        id: 'keep_building',
        text: 'Stay independent and keep building',
        resourceChanges: { momentum: 20, energy: -10, reputation: 10 },
        outcome: `[EXIT: THE_BUILDER]

"We're not done." You turn down the final offer and double down.
The company is yours. The vision is yours. The risk is yours.

Your team rallies. Alex grins. "I was hoping you'd say that."

This isn't the end. It's the beginning of the real game.

+20% Momentum (conviction)
-10% Energy (pressure continues)
+10 Reputation (founder conviction)`,
        nextNodeId: 'exit_endgame',
      },
      {
        id: 'start_again',
        text: 'Sell, then start something new',
        resourceChanges: { money: 15000000, reputation: 20, momentum: 10 },
        outcome: `[EXIT: THE_SERIAL_FOUNDER]

You close the deal, pocket $15 million, and immediately start
thinking about company #2. This time you have money, connections,
and hard-won wisdom.

"I know what I'd do differently," you tell Alex over coffee.
They smile. "I know. I've been thinking about something too..."

+$15,000,000 (exit proceeds)
+20 Reputation (serial founder status)
+10% Momentum (new energy)`,
        nextNodeId: 'exit_endgame',
      },
    ],
  },
  {
    id: 'exit_endgame',
    phase: 'exit',
    type: 'decision',
    title: 'Looking Back',
    description: `> SYSTEM: JOURNEY_REVIEW.exe
> Loading founder_memories.db...
> Status: REFLECTION_MODE

Five years. Countless decisions. From a university freshman
with a dream to... this. Whatever "this" is, it's yours.

One final reflection. What was it all about?`,
    choices: [
      {
        id: 'about_impact',
        text: '"It was about making a difference"',
        resourceChanges: { reputation: 15 },
        outcome: `[REFLECTION: IMPACT]

You changed how people work. Your product touched thousands
of lives. Some users wrote to say it changed their careers.

Impact can't be measured in dollars. But it can be felt
in every thank-you email you never deleted.

The founder's journey continues... in a different form.

+15 Reputation (legacy of impact)`,
        nextNodeId: 'game_success',
      },
      {
        id: 'about_people',
        text: '"It was about the people I met"',
        resourceChanges: { reputation: 15 },
        outcome: `[REFLECTION: RELATIONSHIPS]

Alex. Your first hire. The investor who believed. The customer
who stayed. The mentor who saw something in you before you
saw it yourself.

Companies come and go. The people? They're forever.

The founder's journey continues... together.

+15 Reputation (legacy of relationships)`,
        nextNodeId: 'game_success',
      },
      {
        id: 'about_growth',
        text: '"It was about who I became"',
        resourceChanges: { reputation: 15 },
        outcome: `[REFLECTION: PERSONAL_GROWTH]

You walked into university uncertain. You walk out of this
chapter transformed. Not just a founder — a leader, a
decision-maker, a person who ships.

The person you were five years ago wouldn't recognize you.
That's the point.

The founder's journey continues... with you.

+15 Reputation (legacy of growth)`,
        nextNodeId: 'game_success',
      },
    ],
  },

  // ==================== SUCCESS ENDING ====================
  {
    id: 'game_success',
    phase: 'exit',
    type: 'decision',
    title: 'JOURNEY COMPLETE',
    description: `> ACHIEVEMENT_UNLOCKED: THE_FOUNDER'S_JOURNEY
> Status: COMPLETE
> Phases survived: 5/5
> Decisions made: 18

From university freshman to startup founder, through growth,
scaling, and the ultimate question — what was it all for?

Your answers shaped this story. No two journeys are the same.`,
    choices: [
      {
        id: 'continue',
        text: 'View your journey',
        resourceChanges: {},
        outcome: `GAME COMPLETE

Your founder archetype, final resources, and decision history
await on the next screen.

Thank you for playing Founder's Journey.`,
        nextNodeId: 'end',
      },
    ],
  },
];

export function getNodeById(id: string): DecisionNode | undefined {
  return decisionNodes.find(node => node.id === id);
}
