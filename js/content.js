/* Authored course content: 8 case files mirroring the SPARKLE course.
   Ground truth: course scripts + Malaysia 2020 data + the course's own fitted values. */
(function () {
  'use strict';

  const MODULES = [
    /* ================================================================== */
    {
      id: 'm1', caseNo: '01',
      title: 'Why model at all',
      scope: 'The bean jar, states and flows, incidence vs prevalence, R0',
      opened: 'SPARKLE Session 1',
      brief: ['Before any equation, a model is a **claim about mechanism**: who can catch, who is infectious, who is done. You will rebuild the course\'s bean-jar experiment as a live system, then connect it to the quantities epidemiologists actually report.',
        'This file establishes the habit the whole register runs on: **commit a prediction, then look**.'],
      sections: [
        {
          id: 'm1-s1', kind: 'concept', title: 'States, flows, and the jar',
          blocks: [
            { t: 'p', md: 'The bean jar splits a population into three <span class="term">states</span>: <strong>Susceptible</strong> (can catch), <strong>Infectious</strong> (can spread), <strong>Recovered</strong> (immune, for now). Each week, two things happen: susceptibles who draw an infectious bean become infectious, and last week\'s infectious cases recover.' },
            { t: 'eq', tex: 'S \\;\\to\\; I \\;\\to\\; R', words: 'Susceptible → Infectious → Recovered. Every model you will ever write is a drawing like this plus numbers on the arrows.' },
            { t: 'p', md: 'The bean jar is a <em>discrete-time</em> model: one step = one week. The differential-equation models from Session 2 onwards are the same claims with time made continuous. Nothing conceptual changes — only the integration.' },
            { t: 'note', label: 'Field note', md: 'A model is not "true". It is <strong>useful</strong> if it reproduces the observed pattern and predicts interventions better than guessing. Judge models by their predictions, never by their realism.' }
          ]
        },
        {
          id: 'm1-s2', kind: 'concept', title: 'Incidence, prevalence, and R0 — precisely',
          blocks: [
            { t: 'table', head: ['Quantity', 'Definition', 'Units in the jar'], rows: [
              ['Incidence', 'NEW cases in an interval', 'infections per week'],
              ['Prevalence', 'existing cases at an instant', 'infectious people right now'],
              ['Cumulative', 'all cases so far', 'everyone ever infected'],
              ['R0', 'secondary infections from 1 case in a fully susceptible population', 'people per case']
            ]},
            { t: 'p', md: 'These get confused constantly, in practice and in papers. Incidence is a <strong>flow</strong> (per week); prevalence is a <strong>stock</strong> (a snapshot). When a news chart shows "daily cases", that is incidence. When it shows "active cases", that is prevalence.' },
            { t: 'eq', tex: 'R_0 = \\beta\\, c \\times D', words: 'R0 = (transmission probability per contact β) × (contact rate c) × (duration of infectiousness D). Three levers, and every intervention pulls at least one of them.' },
            { t: 'p', md: 'The herd-immunity threshold follows immediately: an epidemic can only grow while each case replaces itself, i.e. while the susceptible fraction s satisfies R0·s > 1.' },
            { t: 'eq', tex: 's^* = \\frac{1}{R_0}', words: 'The epidemic stops (growth turns negative) once the susceptible fraction falls below 1/R0. For R0 = 4: below 25% susceptible — i.e. 75% immune.' }
          ]
        },
        {
          id: 'm1-s3', kind: 'sim', sim: 'jar', title: 'Field exercise — run the jar',
          intro: 'A jar of 500 beans, 1 infectious to start. Each week every susceptible mixes with a few others; the slider sets the per-contact transmission probability. Predict before you run.',
          predict: {
            q: 'With transmission p = 0.5, run one week. Roughly how many NEW infections (incidence) do you expect in week 1, given each susceptible draws about 4 beans?',
            opts: ['about 2', 'about 8', 'about 60', 'about 250'],
            correct: 2,
            why: 'Each of the 500 susceptibles has ~4 contacts; only contacts with the (few) infectious beans can transmit. With 1 infectious bean among 500 (0.2%), expected transmissions ≈ 500 × 4 × 0.2% × 0.5 ≈ 2 at the very start — but the infectious pool grows each week, so incidence accelerates. That acceleration is the whole epidemic.'
          },
          controls: 'Run it: step week by week (predict next week\'s incidence before each step), then let it run to 10 weeks. Halve p and run again — watch what happens to the final size.'
        },
        {
          id: 'm1-s4', kind: 'quiz', title: 'Checkpoint — definitions you must not blur',
          intro: 'All questions must be answered correctly before the case can be stamped. Wrong picks show the reason; retry freely.',
          questions: [
            { id: 'm1q1', q: 'A report states: "2,340 active cases as of Monday; 180 new cases that day." Which pairing is right?', opts: ['2,340 = incidence, 180 = prevalence', '2,340 = prevalence, 180 = incidence', 'both are cumulative', 'both are prevalence at different times'], correct: 1, why: 'Active cases right now = prevalence (a stock). New cases that day = incidence (a flow). Mixing these up is the most common misreading of surveillance data.' },
            { id: 'm1q2', q: 'A pathogen has R0 = 5. What fraction of the population must be immune (before the outbreak) to prevent an epidemic?', opts: ['20%', '40%', '60%', '80%'], correct: 0, why: 'Threshold susceptible fraction = 1/R0 = 1/5 = 20%. So 80% must be immune. Herd-immunity percentages quoted in the news are exactly 1 − 1/R0.' },
            { id: 'm1q3', q: 'Doubling a pathogen\'s infectious duration D (same β, same c) does what to R0?', opts: ['nothing — R0 only depends on contacts', 'doubles it', 'halves it', 'squares it'], correct: 1, why: 'R0 = β·c·D is linear in D: twice the infectious days, twice the windows to transmit. This is why keeping infectious cases isolated (cutting effective D) works.' },
            { id: 'm1q4', q: 'In the bean jar the epidemic eventually stops even though nobody intervened. Why?', opts: ['the pathogen evolved to be milder', 'susceptibles ran out — transmission needs S·I contact', 'infectious beans stopped being drawn at random', 'recovered beans became susceptible again'], correct: 1, why: 'Incidence ∝ S × I. As S depletes, each case finds fewer susceptibles and replaces itself less than once. Depletion of susceptibles — not衰减 of the virus — ends the wave.' },
            { id: 'm1q5', q: 'Which statement about R0 is defensible?', opts: ['R0 is a property of the pathogen alone', 'R0 includes behaviour and contact patterns of the population', 'R0 measures how fast the outbreak grows in absolute terms', 'R0 changes during an epidemic as people recover'], correct: 1, why: 'R0 bundles the pathogen AND the population\'s contact patterns (c) — the same virus has different R0 in a metropolis and a village. Growth rate is a different quantity (Case 02), and R0 is by definition measured in a fully susceptible population.' }
          ]
        },
        {
          id: 'm1-s5', kind: 'transfer', title: 'Transfer — a pathogen the course never used',
          scenario: 'Canine rabies in a rural district of 40,000 dogs. Biology: incubation 3–12 weeks before infectiousness; infectiousness ends in death within ~10 days; no recovery, ever; vaccination of 70% of dogs is achievable. The district vet asks: if one rabid dog wanders in, do we get an outbreak, and does vaccination stop it?',
          tasks: [
            'Draw the state diagram for ONE dog (states + arrows). Does a Recovered state exist for rabies?',
            'Name the three levers of R0 (β, c, D) in dog terms, and say which lever mass vaccination pulls.',
            'Using 1 − 1/R0: if dog rabies R0 ≈ 1.2 without control, what susceptible fraction stops transmission — and is 70% vaccination enough?',
            'State one way this model is wrong for rabies (hint: where do infectious dogs GO?)'
          ],
          modelAnswer: '1) S → E (latent, 3–12 wk, not infectious) → I (infectious ~10 days) → **dead** (removal, not recovery). ARecovered state does not exist; rabies is fatal, so the third box is a removed/dead state — structurally still "SIR" but the R means Removed.\n2) β = bite transmission probability; c = dog contact/bite rate; D ≈ 10 days. Vaccination pulls the susceptible pool (S) — it is the 1−1/R0 lever, not R0 itself.\n3) 1 − 1/1.2 ≈ 0.167 → ~17% immune suffices to block dog-to-dog transmission; 70% vaccination is far above threshold, so yes — provided coverage is even.\n4) Dead/removed dogs still occupy the population count (demography replaces them with puppies — a constant inflow of susceptibles!); rabies also has a long latent period that a plain SIR ignores, and spatial structure (territorial dogs) matters. Endemic rabies persists because susceptible puppies are born continuously.',
          selfNote: 'Your notes — where would this dog model need a new compartment or a birth term?'
        },
        {
          id: 'm1-s6', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'Incidence is a flow per unit time; prevalence is a stock; cumulative only grows.',
            'R0 = β·c·D bundles pathogen and population; every intervention maps onto one of its levers or onto S.',
            'The epidemic threshold is a susceptible fraction: s* = 1/R0.',
            'Epidemics can end with no intervention at all — susceptible depletion is a mechanism, not a policy.'
          ],
          eqs: [
            { tex: 'R_0 = \\beta\\, c\\, D', words: 'the three levers' },
            { tex: 's^* = 1/R_0', words: 'the threshold susceptible fraction' }
          ]
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm2', caseNo: '02',
      title: 'Differential equations in motion',
      scope: 'From week-steps to d/dt, integrators, and why dt matters',
      opened: 'SPARKLE Session 2',
      brief: ['The jar stepped in weeks. Real pathogens do not check the calendar. Making time continuous turns your state diagram into <strong>differential equations</strong> — and introduces a quietly critical decision: how the computer actually integrates them.'],
      sections: [
        {
          id: 'm2-s1', kind: 'concept', title: 'From week-steps to instantaneous rates',
          blocks: [
            { t: 'p', md: 'Replace "each week" with "each instant". The S→I flow becomes the <span class="term">force of infection</span> λ acting on every susceptible continuously; the I→R flow drains infectious cases at rate γ. For a closed population of size N:' },
            { t: 'eq', tex: '\\frac{dS}{dt} = -\\lambda S, \\qquad \\lambda = \\beta \\frac{I}{N}', words: 'Force of infection λ = rate an average susceptible is infected. β is R0·γ — recall R0 = βcD and D = 1/γ, so β·c collapses into one transmission parameter.' },
            { t: 'eq', tex: '\\frac{dI}{dt} = \\lambda S - \\gamma I \\qquad \\frac{dR}{dt} = \\gamma I', words: 'Infectious grows by new infections, shrinks by recovery. The three equations sum to zero — the population is conserved. Always check this.' },
            { t: 'p', md: 'The early growth of an epidemic has its own constant, the <span class="term">growth rate</span> r. For a simple SIR with everyone susceptible, r and R0 are linked:' },
            { t: 'eq', tex: 'r = \\gamma\\,(R_0 - 1)', words: 'Growth rate per day. R0 asks "how many, in total?"; r asks "how fast, right now?". Doubling time = ln 2 / r.' },
            { t: 'note', label: 'Why this distinction saves lives', md: 'Two outbreaks can share R0 = 2 but grow at wildly different speeds (flu generation ~3 days, SARS-CoV-1 ~8 days). Policy timing depends on <strong>r</strong> and the generation interval, not on R0 alone.' }
          ]
        },
        {
          id: 'm2-s2', kind: 'concept', title: 'How a computer walks the curve',
          blocks: [
            { t: 'p', md: 'dI/dt tells you the slope; to draw the curve you must <strong>integrate</strong>. The crude way (Euler): step forward using the slope at the current point. The error scales with your step size dt. R\'s <code>deSolve::ode</code> defaults to smarter methods (lsoda) that adapt dt — the course used it in every session.' },
            { t: 'eq', tex: 'I_{t+\\Delta t} \\approx I_t + \\frac{dI}{dt}\\Big|_t \\, \\Delta t', words: 'Euler\'s step. Small dt: fine. Big dt: the tangent line overshoots the curve, and the epidemic can "ring" or even go negative — pure numerical artefact.' },
            { t: 'p', md: 'You will now see this failure with your own eyes, because a solver you cannot break is a solver you do not understand.' }
          ]
        },
        {
          id: 'm2-s3', kind: 'sim', sim: 'sir', title: 'Field exercise — break the integrator',
          intro: 'A continuous SIR, N = 10,000, one infectious seed, R0 set by slider. The solver toggle compares a lazy Euler integrator (weekly steps, dt = 7 days — deliberately terrible) against the RK4 integrator the app uses everywhere else (dt = 0.05 days).',
          predict: {
            q: 'With dt = 7 days and a mean infectious period of 6 days, what will the Euler curve do compared to the true curve?',
            opts: ['match it closely — 7 days is short', 'overshoot and oscillate — a whole generation passes between steps', 'run slower but stay accurate', 'stay flat at zero'], correct: 1,
            why: 'The generation interval (~6 days) is comparable to dt = 7. Euler keeps using week-old slopes: the susceptible pool is drained in bursts, the curve overshoots, oscillates, and can undershoot the true final size. If a step is longer than the disease\'s own timescale, the numerics — not the epidemiology — drive the output.'
          },
          controls: 'Switch solvers, push R0 up, and watch the peak. Then answer: which curve would you trust in a briefing?'
        },
        {
          id: 'm2-s4', kind: 'quiz', title: 'Checkpoint — rates, solvers, growth',
          questions: [
            { id: 'm2q1', q: 'For SIR with R0 = 4, mean infectious period 6 days: early growth rate r ≈ ?', opts: ['0.5 /day', '2 /day', '0.25 /day', '4 /day'], correct: 0, why: 'r = γ(R0−1) = (1/6)(3) = 0.5/day. Doubling time = ln2/0.5 ≈ 1.4 days. This is exactly the kind of back-of-envelope you should do in a meeting.' },
            { id: 'm2q2', q: 'Why does dS/dt + dI/dt + dR/dt = 0 matter when you write a new model?', opts: ['it guarantees the epidemic grows', 'it is the conservation check — people are neither created nor destroyed', 'it proves R0 is positive', 'it only matters for vector models'], correct: 1, why: 'Closed population: flows move people between boxes, never out of the model. If your three derivatives don\'t sum to zero, you have a typo — and every downstream prediction is wrong. The course\'s covid_base always recomputed Total_population for this reason.' },
            { id: 'm2q3', q: 'β is 0.5/day, mean infectious period 6 days. What is R0?', opts: ['0.5', '3', '6', '12'], correct: 1, why: 'R0 = β/γ = β × D = 0.5 × 6 = 3. Watch units: β is per day, γ = 1/6 per day.' },
            { id: 'm2q4', q: 'A modeller reports "Euler at dt = 1 day agrees with RK4 to 3 decimal places." What does this actually establish?', opts: ['the model is correct', 'the numerical solution has converged at that step size', 'R0 was fitted properly', 'the data was Poisson'], correct: 1, why: 'Convergence across step sizes is the only defence against solver artefacts. It says nothing about whether the model structure or parameters are right — that is Case 05\'s problem.' },
            { id: 'm2q5', q: 'Two pathogens both have R0 = 3. Flu-like: infectious 3 days. Slow virus: infectious 30 days. Which statement is true?', opts: ['same peak height, same timing', 'same final size (no intervention), tenfold slower take-off', 'the slow one has a bigger peak', 'the fast one has a bigger R0'], correct: 1, why: 'Final size depends on R0 alone; timing scales with the generation interval. Same R0, same end point — radically different urgency.' }
          ]
        },
        {
          id: 'm2-s5', kind: 'transfer', title: 'Transfer — Ebola and the funeral flow',
          scenario: 'During the 2014 West African Ebola epidemic a substantial share of transmissions occurred at funerals — the body of an Ebola victim remains highly infectious. Standard SIR buries the dead in the silent R box. You are asked to brief a district team on why modelling funerals matters.',
          tasks: [
            'Write the modified dI/dt for an SEIR+S(model) system where infectious bodies (state F, "funeral") remain infectious for an average of 2 days before safe burial.',
            'Which new parameter replaces part of γ\'s job, and what is its unit?',
            'Predict: does adding F raise or lower the fitted R0 compared to a model that ignores funerals? Why?',
            'Name a control measure this structure can evaluate that plain SIR cannot.'
          ],
          modelAnswer: '1) Add: dF/dt = σE − (φ)F with φ = 1/2 per day burial rate, and subtract: dI/dt = σE − γ\'I − δF-flow where a fraction of I exits to F instead of R. E.g. dI/dt = σE − γ₁I − γ₂I, with γ₁ sending survivors to R and γ₂ sending deaths to F; dF/dt = γ₂I − φF; safe burial sends F → removed.\n2) φ = 1/(mean days to safe burial) — units per day.\n3) It LOWERS the R0 attributed to person-to-person contact: some secondary infections previously credited to living cases are now explained by the funeral route. Splitting transmission routes re-attributes, not amplifies — total R0 may stay similar but the intervention lever (safe burial) becomes visible.\n4) Safe/dignified burial, rapid burial teams, funeral-ban policies — all are parameter changes on φ that plain SIR cannot represent.',
          selfNote: 'Where else in your own practice does a "silent R" hide an important flow?'
        },
        {
          id: 'm2-s6', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'Continuous time turns your state diagram into ODEs; force of infection λ = βI/N is the phrase to memorise.',
            'r = γ(R0 − 1) connects "how many" to "how fast"; doubling time = ln2/r.',
            'Conservation: flows between boxes must sum to zero change.',
            'A solver is part of the model: steps longer than the disease timescale invent dynamics. Convergence checks are hygiene, not optional.'
          ],
          eqs: [
            { tex: '\\lambda = \\beta\\, I/N', words: 'force of infection' },
            { tex: 'r = \\gamma (R_0 - 1)', words: 'early exponential growth rate' }
          ]
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm3', caseNo: '03',
      title: 'A model that fits the pathogen',
      scope: 'Choosing compartments from biology — HIV, measles, flu, dengue',
      opened: 'SPARKLE Session 3',
      brief: ['The course\'s central design lesson: <strong>the pathogen\'s biology dictates the boxes</strong>. Latency, waning immunity, vectors, chronic carriage — each is a structural decision you must be able to defend, not copy.'],
      sections: [
        {
          id: 'm3-s1', kind: 'concept', title: 'Structure follows biology',
          blocks: [
            { t: 'table', head: ['Biological fact', 'Structural consequence', 'Example'], rows: [
              ['infectiousness delayed after infection', 'add E (exposed/latent)', 'measles (~10 d), flu (~1.5 d)'],
              ['immunity fades', 'R → S flow (SIRS)', 'seasonal coronaviruses, flu (partial)'],
              ['no recovery, ever', 'remove R; I is chronic', 'HIV (untreated)'],
              ['transmission via another species', 'add vector compartments', 'dengue, malaria'],
              ['infectious but never symptomatic', 'asymptomatic branch', 'many respiratory viruses']
            ]},
            { t: 'p', md: 'Two traps. First, <span class="term">exposed ≠ infectious</span>: E means "infected, not yet transmitting" — for measles the child in E is already febrile? No: pre-rash measles patients are actually infectious _before_ the rash, which is why E must be defined by <strong>transmission status</strong>, not symptoms. Second, <span class="term">latent ≠ incubation</span>: latency is time-to-infectiousness; incubation is time-to-symptoms. They differ for almost every pathogen (they differ by ~4 days for measles).' }
          ]
        },
        {
          id: 'm3-s2', kind: 'sim', sim: 'builder', title: 'Field exercise — assemble structures',
          intro: 'Toggle biology facts on and off; the compartment diagram rebuilds and the register tells you what the structure is called and which real pathogen demands it. The arrows animate at rates proportional to the flows — the current in the wires is the epidemic.',
          predict: {
            q: 'Before toggling: HIV (untreated) and influenza differ in exactly one structural element in this builder. Which?',
            opts: ['HIV needs a vector', 'flu has a recovered state; HIV (untreated) never leaves I', 'HIV has no latent period', 'flu needs an exposed compartment; HIV does not'],
            correct: 1, why: 'Untreated HIV: infected for life, transmissible for life — S → I and stay. Flu: days of infectiousness then lasting (if strain-specific) immunity — S → I → R. One arrow difference, utterly different epidemic.'
          },
          controls: 'Toggle latency, waning immunity, and vector-borne transmission. Watch the model name and the matching pathogens update. Then check: what structure does norovirus suggest (very short immunity after infection)?'
        },
        {
          id: 'm3-s3', kind: 'quiz', title: 'Checkpoint — defend the structure',
          questions: [
            { id: 'm3q1', q: 'For measles (latent ~10 d, infectious ~8 d starting ~4 d BEFORE rash, lifelong immunity), the standard teaching structure is:', opts: ['SI', 'SIR with no E — symptoms mark infectiousness', 'SEIR where E = infected, not yet infectious', 'SIRS — immunity wanes'], correct: 2, why: 'E is about TRANSMISSION status, not symptoms. Measles patients are infectious ~4 days before the rash: the E→I transition happens mid-incubation. The course\'s SEIR used E identically (incidence = E/latent).' },
            { id: 'm3q2', q: 'A colleague models HIV with SEIR, justifying E with the ~10-year lag from infection to AIDS. What is the error?', opts: ['none — 10 years is a fine latency', 'E means not-yet-INFECTIOUS; untreated HIV is infectious throughout the decade', 'HIV needs a vector', 'the error is the time unit'], correct: 1, why: 'HIV is transmissible from weeks after infection onwards. The 10-year lag is to AIDS (disease), not to infectiousness. Structure must track transmission states — this is the latent/incubation trap in its most famous form.' },
            { id: 'm3q3', q: 'Seasonal coronaviruses (e.g. 229E) show reinfection after ~1 year. Which flow must the model add?', opts: ['E → S', 'I → E', 'R → S (waning immunity)', 'S → R directly'], correct: 2, why: 'Immunity that fades re-feeds the susceptible pool: R → S at rate 1/(duration of immunity). The course\'s SEIRS Shiny app (Session 3) existed precisely to let you feel what waning does.' },
            { id: 'm3q4', q: 'Dengue cannot be modeled with human compartments alone because:', opts: ['humans recover too fast', 'transmission requires a mosquito extrinsic incubation and a bite bridge — two more boxes and two more flows', 'dengue has no recovered state', 'mosquitoes are small'], correct: 1, why: 'The pathogen must complete a loop: human → (bite) → mosquito (E ~8–12 d, limited by mosquito lifespan!) → (bite) → human. Case 06 builds this loop.' },
            { id: 'm3q5', q: 'You must model a 3-month boarding-school flu outbreak with vaccination at day 0. The minimal defensible structure is:', opts: ['SI', 'SIR (+ vaccination as S → R at day 0)', 'SEIRS with waning over decades', 'add a vector'], correct: 1, why: 'Flu latency ~1–1.5 days barely matters at weekly resolution (structure must earn its complexity), immunity outlasts the horizon, and vaccination is a one-time S → R transfer. Simplest structure that answers the question wins.' }
          ]
        },
        {
          id: 'm3-s4', kind: 'transfer', title: 'Transfer — the ship, the farm, and the clinic',
          scenario: 'Three briefs land on the same day. (a) Norovirus on a 5-day cruise: vomiting illness, ~1 day incubation to infectiousness, immunity after infection lasts weeks-to-months, environmental fomite transmission. (b) Bovine tuberculosis in a dairy herd: chronic, months-to-years infectious, test-and-slaughter control. (c) Influenza A (H1N1) in that same boarding school, vaccination available mid-outbreak.',
          tasks: [
            'For each: choose the minimal structure (states + arrows) and defend each box in one line.',
            'For (a): does the 5-day cruise horizon change whether waning immunity belongs in the model?',
            'For (b): what does test-and-slaughter do in your diagram, expressed as a flow?',
            'For (c): express "vaccinate 60% of students at day 14" as a change to state variables at t = 14.'
          ],
          modelAnswer: '(a) SI (or SIR with R for the post-cruise return) — immunity waning over weeks is irrelevant inside a 5-day horizon; omit it and say why. Consider an E for the ~1-day incubation only if resolution is daily.\n(b) S → I chronic (months-years), no recovery by biological recovery — but control ADDS I → Removed(detect & removed from herd) at the testing rate. The control IS a recovery flow; its rate = test sensitivity × testing frequency.\n(c) At t = 14: S →= S − 0.6·S, R →= R + 0.6·S (assume 60% coverage among still-susceptible). It is an instantaneous transfer, not a new compartment — the same lever the course\'s MCO was not (the MCO changed transmission, not states).',
          selfNote: 'Which real briefing in your work have you seen answered with an over-built model?'
        },
        {
          id: 'm3-s5', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'Every compartment must be purchased with a biological reason; complexity is a cost.',
            'Latency = time to INFECTIOUSNESS; incubation = time to SYMPTOMS. They are different clocks.',
            'Controls live in the diagram too: vaccination moves people between states; masks/closures change β; burial teams add flows.',
            'The minimal structure that answers the question is the defensible one.'
          ],
          eqs: []
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm4', caseNo: '04',
      title: 'Malaysia, first wave',
      scope: 'The course SEIR against real data: R0=4, seed 20, 3.27e7',
      opened: 'SPARKLE Session 4',
      brief: ['Now the course\'s real case: SARS-CoV-2 in Malaysia, early 2020. Parameters from the course: <strong>R0 = 4, latent 5 d, infectious 6 d, population 3.27 × 10⁷, seed 20</strong>, epidemic started from the model clock on <strong>28 Feb 2020</strong>. The country\'s first controlled wave was real data — and you will reproduce it before fitting it in Case 05.'],
      sections: [
        {
          id: 'm4-s1', kind: 'concept', title: 'The course model, exactly',
          blocks: [
            { t: 'eq', tex: 'E \\xrightarrow{\\;1/5\\;} I \\xrightarrow{\\;1/6\\;} R \\qquad \\lambda = \\frac{R_0}{D}\\,\\frac{I}{N}', words: 'The course covid_base: force of infection = R0 × I / (N × infectious_period). Latent 5 d, infectious 6 d.' },
            { t: 'p', md: 'Two derived quantities mattered in Session 4. <span class="term">Incidence</span> — new infections per day — is the flux out of E:' },
            { t: 'eq', tex: '\\text{incidence}(t) = \\frac{E(t)}{5}', words: 'Because everyone leaving E becomes a new (infectious) case that day. This is what you compare against "daily cases" data.' },
            { t: 'p', md: '<span class="term">Prevalence</span> = E + I (everyone currently infected), and <span class="term">cumulative incidence</span> is the running total of incidence — the curve that only ever rises. The data (MoH Malaysia open data): daily cases from 25 Jan 2020, peaking at 277/day, 8,639 cumulative by 30 June.' },
            { t: 'note', label: 'Why the window ends 18 March', md: 'The Movement Control Order began 18 March 2020. Before that date the epidemic grew ~uncontrolled — a pure R0 signature. After it, policy bent the curve. Fitting the uncontrolled window (28 Feb – 18 Mar) is Case 05; the MCO itself is Case 07.' }
          ]
        },
        {
          id: 'm4-s2', kind: 'sim', sim: 'seir', title: 'Field exercise — reproduce the first wave',
          intro: 'The course model runs against the real Malaysian daily-case bars (28 Feb onward). The model curve is incidence = E/5, seeded with 20 infectious people on 28 Feb.',
          predict: {
            q: 'With R0 = 4 and generation time ~11 days (5+6), roughly when does modelled incidence cross 100 cases/day, starting from 20 cases on 28 Feb?',
            opts: ['within ~1 week (early March)', 'around mid–late March', 'around end of April', 'never — it stays below 100'], correct: 1,
            why: 'Growth r = γ(R0−1) = (3)/6 = 0.5/day is fast, but from a seed of 20 reaching 100 is barely one doubling — the visible climb to hundreds takes ~2–4 weeks. The real data peaked 277/day end-March: the model window 28 Feb–18 Mar sits on the steep part.'
          },
          controls: 'Run the base model. Then push R0 down toward 1.5 and watch the peak slide right and shrink — sensitivity you can quote in a briefing. Restore R0 = 4.'
        },
        {
          id: 'm4-s3', kind: 'quiz', title: 'Checkpoint — the model you just ran',
          questions: [
            { id: 'm4q1', q: 'Why is modelled incidence E(t)/5 rather than new entries INTO E?', opts: ['E entries are infections; they show up as cases only after the 5-day latency, when they leave E', 'E/5 is prevalence', 'it is an approximation the course apologises for', 'because data is weekly'], correct: 0, why: 'A person infected today (S→E) is not counted as a case until becoming infectious. The outflow E/latent IS today\'s new-infectious count — the right comparison for daily reported cases (up to reporting fraction).' },
            { id: 'm4q2', q: 'Modelled cumulative incidence at day 30 is compared against MoH cumulative cases. What systematic difference should you expect?', opts: ['none', 'model counts INFECTIONS; data counts REPORTED cases — ascertainment < 100% means data under-counts', 'the model double-counts', 'cumulative always matches'], correct: 1, why: 'Every fitting exercise quietly assumes a reporting fraction. If observed > modelled early, either R0 is higher or ascertainment changed — Case 05\'s objective function is where that tension gets priced.' },
            { id: 'm4q3', q: 'With seed I(0) = 20 instead of 1, the epidemic peak arrives:', opts: ['~19 doublings earlier, same height', 'earlier by roughly ln(20)/r days, same height', 'later, because more people are sick at once', 'lower peak'], correct: 1, why: 'The seed shifts the curve in TIME by ln(seed)/r ≈ 3/0.5 ≈ 6 days here; it does not change R0 or the susceptible-depletion dynamics. Seeding is a clock adjustment — this is exactly why the fitting session treats I(0) as a free parameter.' },
            { id: 'm4q4', q: 'The 277/day observed peak (late March) sits ABOVE the base model\'s curve in the 28 Feb–18 Mar window. The most defensible reading is:', opts: ['R0 = 4 must be wrong, full stop', 'the model is a smooth average; day-of-week reporting, import clusters (the Sri Petaling tabligh cluster) and ascertainment make real data lumpier', 'SEIR cannot produce peaks', 'the latent period must be negative'], correct: 1, why: 'Deterministic SEIR draws a smooth exponential; real early-COVID data jumped with detection drives and super-spreading clusters. Model-vs-data mismatches diagnose process (reporting, clusters) as often as parameters — and Case 05 chooses an objective that tolerates counts being noisy.' },
            { id: 'm4q5', q: 'Total_population is recomputed inside the ODE as S+E+I+R each step. Why bother when it started at 3.27e7?', opts: ['numerical drift check — with beta = R0/infectious the force of infection uses the CURRENT total, and floating-point drift or error in equations shows up immediately', 'R requires it', 'to make the model stochastic', 'no reason, style'], correct: 0, why: 'Same conservation discipline as Case 02: the denominator must be the live population. It also makes the code reusable for models with births/deaths later.' }
          ]
        },
        {
          id: 'm4-s4', kind: 'transfer', title: 'Transfer — influenza A in the same city',
          scenario: 'Reimagine Malaysia, Feb 2020 — but the pathogen is influenza A: R0 ≈ 1.5, latent ~1.5 d, infectious ~3 d, same 3.27e7 population, same seed of 20, same 28 Feb start. The Health DG asks how the threat picture differs from the SARS-CoV-2 model you just ran.',
          tasks: [
            'Compute the early growth rate r = γ(R0−1) for flu and for the course COVID model. How many times faster is flu growing per day?',
            'Compute doubling times (ln2/r) for both.',
            'Predict, in words, the flu peak vs the COVID peak: earlier or later? Higher or lower in daily incidence at peak? (Think final size + speed.)',
            'One-sentence brief to the DG: which of the two pathogens does "wait and see" cost more, and why?'
          ],
          modelAnswer: '1) Flu: r = (1/3)(0.5) ≈ 0.167/day. COVID course model: r = (1/6)(3) = 0.5/day. COVID grows ~3× faster per day DESPITE both being "respiratory" — R0 = 4 vs 1.5 dominates.\n2) Doubling: flu ln2/0.167 ≈ 4.2 days; COVID ln2/0.5 ≈ 1.4 days.\n3) Flu: slower take-off, later peak, and much smaller attack rate (R0 1.5 → final size ~58% susceptible-depletion limit vs COVID R0 4 → ~94% in an unmitigated SEIR). Lower peak daily incidence spread over longer time.\n4) "Wait and see" costs more with the faster-growing, higher-R0 virus (COVID here): the same week of delay is ~2–3 doublings — up to 8× the cases — and the final size is far larger without action.',
          selfNote: 'Sanity-check habit: r, doubling time, final size — three numbers before any simulation.'
        },
        {
          id: 'm4-s5', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'Incidence = E/latent is the model–data bridge for daily case reports.',
            'Seed size is a time shift; R0 and rates shape the curve itself.',
            'Real data ≠ smooth curve: reporting artefacts and clusters are signal about PROCESS, not noise to be ashamed of.',
            'Uncontrolled window = 28 Feb–18 Mar 2020. Everything after is Case 07.'
          ],
          eqs: [
            { tex: '\\text{incidence} = E/\\tau_{lat}', words: 'the model–data bridge' }
          ]
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm5', caseNo: '05',
      title: 'Fitting: make the model answer to data',
      scope: 'Least squares, Poisson MLE, surfaces, confidence intervals',
      opened: 'SPARKLE Session 5',
      brief: ['Parameters guessed are parameters doubted. Session 5 fit R0 and the seed I(0) to the real Malaysian uncontrolled window (28 Feb – 18 Mar) twice — once minimising squared residuals, once maximising a Poisson likelihood — and got <strong>different answers</strong>. By the end you will know why, and why the MLE won.'],
      sections: [
        {
          id: 'm5-s1', kind: 'concept', title: 'Two objective functions',
          blocks: [
            { t: 'eq', tex: 'SSQ(\\theta) = \\sum_t \\left( y_t - \\text{model}_t(\\theta) \\right)^2', words: 'Least squares: penalise every miss by its square. Classic, intuitive, but treats a miss of 20 cases the same whether the day had 30 cases or 300.' },
            { t: 'eq', tex: '\\text{NLL}(\\theta) = -\\sum_t \\log \\text{Pois}(y_t \\mid \\text{model}_t(\\theta))', words: 'Maximum likelihood with a Poisson observation model: each day\'s cases are a Poisson draw with mean = model incidence. Low-count days get their proper weight.' },
            { t: 'p', md: 'The course optimised over <strong>log-parameters</strong> (searching R0 in log space keeps the search positive and scale-free) using Nelder-Mead, and read uncertainty off the <span class="term">Hessian</span>: the curvature of the likelihood at its peak. Sharp peak → tight CI; flat valley → wide CI.' },
            { t: 'eq', tex: '\\text{SE}(\\hat\\theta) \\approx \\sqrt{\\left[ \\nabla^2 \\text{NLL}(\\hat\\theta) \\right]^{-1}}', words: 'Inverse Hessian ≈ covariance matrix. ±1.96 SE on the log scale, then back-transform — exactly what the course R code did.' }
          ]
        },
        {
          id: 'm5-s2', kind: 'sim', sim: 'fit', title: 'Field exercise — fit it with your hands',
          intro: 'The real Malaysian daily cases, 28 Feb – 18 Mar (19 points, bars). Your two free parameters: R0 and the seed I(0) — exactly the course\'s setup. The readout shows your SSQ and NLL live.',
          predict: {
            q: 'The course\'s least-squares optimum was R0 ≈ 4.56, I(0) ≈ 15.4 (SSQ 16,756.64); its MLE was R0 ≈ 5.24, I(0) ≈ 9.0. Before touching the sliders: why would LSQ want a BIGGER seed and SMALLER R0 than the likelihood?',
            opts: ['it shouldn\'t — the two optima always coincide', 'squared error is dominated by the biggest (late, high-count) days; a head start lowers early residuals cheaply', 'Poisson cannot handle small counts', 'the seed is not identifiable'], correct: 1,
            why: 'Squares weight large residuals quadratically, so LSQ chases the high-count tail and buys early-fit with a larger I(0). Poisson counts each day\'s information properly (a day with 5 cases constrains proportionally as hard as a day with 200), pulling the optimum to a faster-growing, later-starting solution. This difference is the entire lesson of the session.'
          },
          controls: 'Fit by hand: match the red curve to the bars, watching SSQ. Then flip to NLL mode and try to beat the course MLE (NLL shown after reveal). Finally reveal the surface — your position vs the landscape.'
        },
        {
          id: 'm5-s3', kind: 'quiz', title: 'Checkpoint — the fitting seminar',
          questions: [
            { id: 'm5q1', q: 'Why optimise over log(R0) instead of R0 directly?', opts: ['to make the optimiser faster in all cases', 'the search then stays positive and moves multiplicatively (doubling steps), matching how R0 scales', 'Nelder-Mead requires it', 'to make the CIs symmetric in R0'], correct: 1, why: 'Optimisers wander over (−∞,∞); exp() maps that to (0,∞). A step in log space is a ratio, not a difference — R0 = 4 to 8 is "one step", like 400 to 800. The course log-transformed I(0) the same way.' },
            { id: 'm5q2', q: 'The fitted Hessian for R0 is nearly FLAT near the optimum. The correct CI report is:', opts: ['a very tight CI — flat means stable', 'a wide CI — flat curvature means many R0s fit nearly as well', 'no CI can be computed', 'R0 is proven constant'], correct: 1, why: 'Curvature is information: a flat bowl means the data barely prefers the optimum over neighbours → large SE → wide CI. Practical meaning: your data cannot pin R0; argue for more data or fix the parameter from literature.' },
            { id: 'm5q3', q: 'Observational ribbons (qpois 2.5–97.5% around the fitted curve) communicate:', opts: ['uncertainty in R0', 'the range of data counts consistent with the fitted MEAN, assuming Poisson observation', 'model structural error', 'reporting delays'], correct: 1, why: 'Parameter uncertainty (what the Hessian gives) and observation uncertainty (what Poisson quantiles give) are different layers. Briefings need both, clearly labelled — conflating them overstates precision.' },
            { id: 'm5q4', q: 'LSQ on CUMULATIVE cases instead of daily incidence would be a mistake mainly because:', opts: ['cumulative is always noisier', 'cumulative points are strongly autocorrelated and dominated by the last (largest) values — they carry almost no independent information about growth', 'Poisson requires cumulative data', 'cumulative cannot be modelled'], correct: 1, why: 'Each cumulative point contains all previous ones. Fitting them as if independent inflates confidence and lets the biggest day dictate everything. Fit the increments (incidence) — or model the cumulative WITH its correlation, which is harder.' },
            { id: 'm5q5', q: 'Course values: LSQ gave R0 ≈ 4.56 (SSQ 16,756.64); MLE gave R0 ≈ 5.24, 95% CI 4.76–5.75. A journalist asks "so is R0 4.56 or 5.24?" Your answer:', opts: ['average them', 'they answer different questions; the MLE with its CI is the reportable estimate — LSQ is a sensitivity view', 'report the smaller one', 'R0 is 4, as assumed'], correct: 1, why: 'The objective function is a modelling CHOICE. The Poisson MLE is defensible for count data and comes with honest uncertainty; the LSQ value shows the estimate\'s sensitivity to that choice. Hiding the difference would be the only wrong answer.' }
          ]
        },
        {
          id: 'm5-s4', kind: 'transfer', title: 'Transfer — the colleague who fits cumulative',
          scenario: 'A colleague emails: "Fitted our flu outbreak with SSQ on CUMULATIVE cases. R0 = 3.2, CI (3.15, 3.25). Beautiful tight fit, writing it up." You have five minutes to reply before this goes into a ministry brief.',
          tasks: [
            'Name the two statistical problems with cumulative-SSQ fitting (think: information duplication; residual structure).',
            'Predict the direction of the bias in the reported CI (too wide or too tight?) and why.',
            'Draft the three-line reply you would actually send.',
            'State what alternative you would offer if only cumulative data existed (e.g. serology at one timepoint).'
          ],
          modelAnswer: '1) (i) Cumulative points are nested — each contains every earlier one — so the N "observations" carry roughly the information of one; (ii) residuals on cumulative curves are dominated by the latest, largest points and are near-systematically signed (not centred noise), violating the least-squares premise.\n2) Too TIGHT, badly: treating ~19 dependent points as independent shrinks SEs roughly by √(effective information loss) — a CI that tight on outbreak data is a red flag by itself.\n3) "Nice start — please refit on daily increments with a Poisson likelihood (or report both). The cumulative CI will collapse once autocorrelation is handled, and I\'d rather we pre-empt the reviewer. Happy to pair on the refactor."\n4) With only cumulative data: fit growth rate to log-cumulative slope in the exponential phase (one parameter, one line), or collect a cross-sectional serology sample and fit final-size/attack-rate — a different, but legitimately independent, information source.',
          selfNote: 'Whose current project does this apply to?'
        },
        {
          id: 'm5-s5', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'The objective function is a modelling decision, and it moves the answer (4.56 vs 5.24).',
            'Log-transform positive parameters: multiplicative steps, feasible search.',
            'Curvature (Hessian) = identifiability: sharp peak, tight CI; flat valley, wide CI.',
            'Observation uncertainty (Poisson ribbons) and parameter uncertainty (CIs) are separate layers. Report both.'
          ],
          eqs: [
            { tex: '\\text{NLL} = -\\sum_t \\log \\text{Pois}(y_t \\mid \\lambda_t)', words: 'the course objective' },
            { tex: '\\mathrm{Cov} \\approx [\\nabla^2 \\text{NLL}]^{-1}', words: 'parameter uncertainty from curvature' }
          ]
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm6', caseNo: '06',
      title: 'Two hosts: dengue',
      scope: 'The mosquito loop, Ross–Macdonald R0, why sqrt(m)',
      opened: 'SPARKLE Sessions 7 & 8',
      brief: ['Dengue cannot jump without wings. The virus must complete a loop: human → bite → mosquito → extrinsic incubation (survive it!) → bite → human. Every term of the vector-borne R0 is one step of that loop, and the loop\'s double-crossing is where the famous square root comes from.'],
      sections: [
        {
          id: 'm6-s1', kind: 'concept', title: 'The loop and its R0',
          blocks: [
            { t: 'eq', tex: 'R_0^{2} \\;=\\; m \\cdot \\frac{a^{2} b c}{r\\,\\mu_V} \\; e^{-\\mu_V n}', words: 'Ross–Macdonald (simplified): m = vectors per human, a = bite rate, b,c = transmission efficiencies, r = human recovery rate, μV = mosquito mortality, n = extrinsic incubation days. R0 = √(all of it).' },
            { t: 'p', md: 'Read it as a story: a case must (1) be bitten — factor <strong>a</strong>; the mosquito must <strong>survive incubation</strong> — factor e^(−μV·n); bite a human again — second <strong>a</strong>; and the two transmissions b, c complete the crossing. Mosquito death μV appears twice: once as the denominator (short lives, fewer bites) and once in the survival exponential. <strong>Adult mosquito mortality is a double-lever.</strong>' },
            { t: 'eq', tex: 'R_0 \\propto \\sqrt{m}', words: 'Because one generation of transmission needs TWO bites, vector density enters under a root: halving m multiplies R0 by √½ ≈ 0.71. (For directly-transmitted disease, halving contact halves R0.)' },
            { t: 'note', label: 'Why dengue control is brutal', md: 'Urban Aedes live ~2 weeks; n ≈ 8–12 days. Most mosquitoes die before becoming infectious — that e^(−μV·n) is dengue\'s weakness, and larval-source reduction + adulticide attack it directly. Cases 07\'s lesson (reduce Reff below 1) applies double here.' }
          ]
        },
        {
          id: 'm6-s2', kind: 'sim', sim: 'vector', title: 'Field exercise — run the loop',
          intro: 'A coupled human–mosquito model (per the course\'s Session 8 dengue model): humans S→I→R; mosquitoes S→E→I with continuous emergence keeping vector numbers stable. Realistic mid-range parameters are preset.',
          predict: {
            q: 'You can halve the bite rate (a) OR halve adult mosquito lifespan (raise μV). Which cuts R0 more?',
            opts: ['they cut R0 equally', 'halving bite rate — it appears twice too', 'halving lifespan — it appears in the denominator AND the survival exponential', 'neither affects R0'], correct: 2,
            why: 'a appears as a² (two bites), yes — but μV appears THREE ways in R0²: in the denominator, in e^(−μV·n), and through m (fewer living adults per human). Shorter lives compound. This is why source reduction + adulticide outperforms repellent-only campaigns at population scale.'
          },
          controls: 'Run the loop, watch human incidence and infectious mosquitoes climb together. Then apply the levers: cut bite rate, raise mortality (shorter lifespan), and cut m. Watch which bends the human curve fastest.'
        },
        {
          id: 'm6-s3', kind: 'quiz', title: 'Checkpoint — the two-host seminar',
          questions: [
            { id: 'm6q1', q: 'Why does vector density m enter R0 as √m rather than m?', opts: ['because mosquitoes are small', 'a full transmission generation needs two bites — human→mosquito→human — so the per-generation factor squares, and R0 is its square root', 'mosquitoes do not recover', 'm is measured with error'], correct: 1, why: 'R0 counts secondary HUMAN cases per human case, which requires the round trip. The squared factor (m·a²…) is R0², not R0. Same logic gives malaria its √m.' },
            { id: 'm6q2', q: 'A district halves larval habitats so m halves. It also wants R0 < 1. If baseline R0 = 6, is one halving enough?', opts: ['yes, 6 → 3 < ... no wait', 'no: 6 × √½ ≈ 4.2 — still far above 1; they need ~36-fold reduction in m', 'yes because sqrt', 'cannot tell'], correct: 1, why: 'R0 scales as √m: to take R0 from 6 to <1 you need m down by a factor of 36. No city halved its way out of dengue with one measure — which is why combined programmes (source reduction + adulticide + personal protection) are the standard.' },
            { id: 'm6q3', q: 'Wolbachia deployments replace wild mosquitoes with strains that shorten viral replication in the mosquito. In Ross–Macdonald terms this mostly:', opts: ['reduces m', 'increases b or c (transmission efficiency) reduction and effectively lengthens n — fewer mosquitoes complete e^(−μV·n) with virus ready', 'increases human recovery r', 'changes nothing in the formula'], correct: 1, why: 'Wolbachia blocks virus replication/competition — the practical read is lower b/c and effectively longer incubation, pushing more mosquitoes past e^(−μV·n) before being infective. It is a formula-native way to see why it works.' },
            { id: 'm6q4', q: 'The course\'s dengue ODE kept the mosquito population constant via continuous emergence. If instead mosquito numbers crash seasonally (monsoon end), the model predicts:', opts: ['dengue declines with a lag — vector competence falls with the falling m and older (non-infected) mosquitoes dominate', 'nothing changes', 'humans get immune faster', 'R0 rises'], correct: 0, why: 'Falling m and rising effective μV crush R0 seasonally — Malaysian dengue\'s seasonality largely IS this term. The lag comes from incubation and the turnover already in flight.' },
            { id: 'm6q5', q: 'For malaria specifically, one extra factor appears that dengue\'s simple loop lacks. The classic addition is:', opts: ['an exposed human state handled via r', 'mosquito infection surviving the extrinsic period is per-species — but the classic Ross model adds superinfection / multiple feeds; for our purposes: humans return to S after treatment (SIS), and mosquito latency e^(−μV·n) stays central', 'a vaccine compartment', 'airborne transmission'], correct: 1, why: 'Malaria humans can be re-treated and return towards susceptibility (SIS-flavoured), infections last weeks not days (r small — big R0), and gametocyte carriage is imperfect (c < 1). The loop grammar is the same; the parameter values and human-recovery structure differ.' }
          ]
        },
        {
          id: 'm6-s4', kind: 'transfer', title: 'Transfer — Zika and the pregnant-traveller brief',
          scenario: 'Zika virus: Aedes aegypti vector (same loop as dengue, n ≈ 8–12 d), but with two human twists: many infections are asymptomatic (~80%), and infection during pregnancy risks congenital syndrome. A state health department asks you to brief why "case counts" systematically mislead for Zika.',
          tasks: [
            'Express "~80% asymptomatic" as an observation problem, not a model problem — which curve (infection incidence vs REPORTED incidence) does the department see, and what fixed multiplier sits between them?',
            'In Ross–Macdonald terms, which lever does a traveller-protection campaign (repellent, long sleeves) pull, and is it a or m?',
            'The department proposes fogging (adulticide). Which term of R0² does it hit, and why is the effect so short-lived unless repeated?',
            'One-paragraph brief: why Zika control must be measured in INFECTIONS (serology/RT-PCR surveillance), not reported cases.'
          ],
          modelAnswer: '1) The department sees reported (symptomatic, tested) incidence ≈ 0.2 × infection incidence — a fixed ascertainment multiplier as long as care-seeking is stable. Curves keep the same shape; absolute levels are ~5× under-counted. Any R0 fitted to REPORTED cases without this multiplier is ~5× too low (fitted β absorbs it).\n2) Personal protection pulls the bite rate a — squared in R0² (two bites per generation), so even modest per-person reductions compound: a 30% cut → R0² × 0.49.\n3) Fogging hits μV (adult mortality) — the double-lever (denominator + e^(−μV·n)). But it only kills the flying adults present that day; eggs and larvae replenish m within days, so the effect decays until the next round. Source reduction (containers) attacks m persistently.\n4) "Reported Zika cases are the visible ~20% of infections and move with testing behaviour, not transmission. Serologically-anchored infection estimates — or consistent RT-PCR surveillance in antenatal clinics — track the true force of infection that pregnancy risk depends on. We should set targets in infections, and treat case counts as a scaled, noisy proxy."',
          selfNote: 'Where does YOUR surveillance sit on the infection-vs-report ladder?'
        },
        {
          id: 'm6-s5', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'The two-bite loop squares the per-generation factor — hence R0 ∝ √m.',
            'Mosquito mortality μV is a double (really triple) lever: lifespan is dengue\'s weakest point.',
            'Vector capacity terms map one-to-one onto real programmes: fogging = μV (transient), source reduction = m (persistent), repellents = a (squared).',
            'Reported cases are ascertainment × infections; the multiplier is a parameter you must state.'
          ],
          eqs: [
            { tex: 'R_0^2 = m\\, a^2 b c\\, e^{-\\mu_V n} / (r \\mu_V)', words: 'every term is a programme' }
          ]
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm7', caseNo: '07',
      title: 'The MCO',
      scope: 'Reff = (1−e)·R0 — calibrating Malaysia\'s movement control',
      opened: 'SPARKLE Session 9',
      brief: ['18 March 2020: Malaysia\'s Movement Control Order. The course modelled it as a two-phase reduction in transmission — and then <strong>fitted the efficacies from the data</strong>, the same MLE machinery as Case 05. The result: phase 1 e ≈ 0.73, phase 2 (from 1 April) e ≈ 0.87.'],
      sections: [
        {
          id: 'm7-s1', kind: 'concept', title: 'Interventions as parameter surgery',
          blocks: [
            { t: 'eq', tex: 'R_{\\text{eff}}(t) = (1 - e(t))\\, R_0 \\cdot s(t)', words: 'The course\'s intervention model: efficacy e(t) switches on at policy dates; s(t) is the remaining susceptible fraction (≈1 early on). Every NPI — masks, closures, distancing — is a claim about e.' },
            { t: 'p', md: 'The course schedule: phase 1 (18 Mar) e₁, then phase 2 (1 Apr) e₂, fitted by Poisson MLE over 28 Feb – 13 May with logit-transformed efficacies (search must stay in (0,1)). Calibrated result: <strong>e₁ = 0.728 (95% CI 0.721–0.735), e₂ = 0.869 (CI 0.866–0.873)</strong> — i.e. Reff dropped from 5.24 to ~1.42, then ~0.69.' },
            { t: 'note', label: 'Reading the CIs like a clinician', md: 'The CIs are TIGHT because the curve\'s bend pins the efficacies hard (sharp likelihood: Case 05\'s curvature lesson). Tight CI ≠ the model is true — it means THIS structure, given THIS data, is well-determined. Structural honesty is a separate axis.' }
          ]
        },
        {
          id: 'm7-s2', kind: 'sim', sim: 'mco', title: 'Field exercise — re-run the MCO',
          intro: 'The full Malaysian first wave (28 Feb – 13 May, real bars). You hold the policy levers: the MCO start date and the two phase efficacies. The readout shows your NLL against the data — lower is better. The course\'s calibration is your target.',
          predict: {
            q: 'Before touching the sliders: with R0 = 5.24 (Case 05\'s MLE), roughly what efficacy e makes Reff fall below 1?',
            opts: ['e > 0.19 — any meaningful distancing', 'e > 0.5', 'e > 0.81', 'impossible — R0 5.24 cannot be brought under 1'], correct: 2,
            why: 'Reff = (1−e)·R0 < 1 needs 1−e < 1/5.24 ≈ 0.19, i.e. e > 81%. Phase 1\'s 0.73 did NOT push Reff under 1 — cases kept growing (slower) until phase 2\'s 0.87 tipped Reff ≈ 0.69. Two phases were not political theatre; they were arithmetically necessary.'
          },
          controls: 'Reproduce the calibration: set the MCO to 18 March, phase 2 to 1 April, and tune e₁, e₂ until your NLL approaches the course\'s fitted value (633.1, revealed on request). Then run the counterfactual: shift the MCO one week later. Watch the total.'
        },
        {
          id: 'm7-s3', kind: 'quiz', title: 'Checkpoint — the policy seminar',
          questions: [
            { id: 'm7q1', q: 'Phase 1 (e₁ = 0.73) left Reff ≈ 1.42 > 1. What did Malaysian case data do between 18 and 31 March?', opts: ['immediately declined', 'kept rising, at a slower exponential rate', 'flatlined at zero', 'rose at the same rate as before'], correct: 1, why: 'Reff > 1 means growth continues — only the exponent shrinks (r scales by (1−e)). The daily curve kept climbing through late March; the DECLINE began after phase 2 pushed Reff below 1. "Intervention" ≠ "instant reversal" — this is the single most miscommunicated fact in outbreak politics.' },
            { id: 'm7q2', q: 'Why logit-transform the efficacies for the optimiser?', opts: ['to speed up Nelder-Mead', 'e lives in (0,1); logit maps the real line onto it so the search cannot propose e = 2 or e = −0.3', 'because Poisson needs it', 'to symmetrise the data'], correct: 1, why: 'Same trick as log-transforming R0 in Case 05, adapted to a bounded parameter: inverse-logit((−∞,∞)) = (0,1). The course code literally defined logit() and inverse_logit() for this.' },
            { id: 'm7q3', q: 'The counterfactual "MCO one week later" shows total cases ballooning. The cleanest one-line explanation:', opts: ['more people were infectious at peak', 'one extra week at Reff ≈ 5.24 is ~5 doublings of the pre-intervention base — the peak you must climb is exponentially higher', 'phase 2 would have failed', 'hospitals filled up'], correct: 1, why: 'Pre-intervention growth rate ~0.5/day → a week ≈ 3 doublings ≈ 8× the seed the intervention must contain. Timing compounds; this is why "two weeks to flatten" was never a slogan but arithmetic.' },
            { id: 'm7q4', q: 'Suppose compliance fades after 6 weeks (e decays toward 0.5). In the course structure this is:', opts: ['impossible to model', 'replace the step efficacy with time-decaying e(t) — the same Reff = (1−e(t))·R0·s(t) machinery, refit', 'a new pathogen', 'only possible with an agent-based model'], correct: 1, why: 'The efficacy schedule is arbitrary code inside one term. Fatigue, reopening, seasonal change — all are edits to e(t). The structure\'s power is exactly this; its weakness is that e(t) must then be ESTIMATED, not assumed.' },
            { id: 'm7q5', q: 'The fitted e₂ = 0.87 is a statement about:', opts: ['the legal text of the MCO', 'the realised average transmission reduction in phase 2 — behaviour, enforcement, and epidemiology folded into one number', 'the virulence of the virus', 'hospital capacity'], correct: 1, why: 'e is a behavioural-epidemiological composite. It can differ between countries with identical laws. That is a feature for prediction (it summarises what actually happened) and a trap for export (copying "e = 0.87" to another population assumes their behaviour).' }
          ]
        },
        {
          id: 'm7-s4', kind: 'transfer', title: 'Transfer — circuit breaker for a novel flu',
          scenario: 'A novel influenza A (R0 ≈ 1.8, generation ~3 d) emerges in a city of 2M. You advise a two-phase "circuit breaker": closures (phase 1) then closures+home-isolation of cases (phase 2, adds case isolation). The minister asks for: target efficacies, and whether phase 1 alone can work.',
          tasks: [
            'Compute the e threshold for Reff < 1 (R0 = 1.8). Is phase 1 alone plausible for flu?',
            'Express phase 2\'s case isolation in the model: does it change e, or does it act on another quantity? (Hint: isolation removes I — which term?)',
            'With a 3-day generation, translate "one week of delay" into doublings — contrast with the MCO\'s ~11-day generation arithmetic.',
            'Draft the two-sentence ministerial brief: what e₁ target to legislate for, and when to trigger phase 2.'
          ],
          modelAnswer: '1) e* = 1 − 1/1.8 ≈ 0.44. Phase 1 alone CAN push flu under 1 — a 44% transmission cut is attainable with distancing for a low-R0 pathogen (unlike the MCO\'s 81% requirement). This is the R0-dependence of policy: the same law buys more for flu than for SARS-CoV-2.\n2) Case isolation acts on the INFECTIOUS pool, not on β: it shortens the effective infectious period D (detect + isolate → effective D from 3 d to ~1.5 d), i.e. it multiplies R0 itself down. In the course grammar you can fold it into e (transmission reduction) but it is cleaner as a separate lever because its cost/logic differs.\n3) r = γ(R0−1) = (1/3)(0.8) ≈ 0.27/day → doubling ≈ 2.6 days. One week ≈ 2.7 doublings ≈ 6.4× the case base — still punishing, though gentler than the MCO\'s ~8× at 0.5/day.\n4) "Legislate phase 1 to a verified ≥45% contact reduction, and pre-authorise phase 2 (case isolation, target: effective infectious period ≤2 days) the day incidence doubles twice. With a 3-day generation we will not get a second chance to decide."',
          selfNote: 'For your next briefing: compute e* = 1 − 1/R0 FIRST — it frames every NPI discussion.'
        },
        {
          id: 'm7-s5', kind: 'debrief', title: 'Debrief — file what you proved',
          points: [
            'Reff = (1−e)·R0·s: every NPI is an e claim; vaccination is an s claim; isolation is a D change.',
            'e < 1 − 1/R0 required to force decline: phase 1\'s 0.73 against R0 5.24 was never enough — phase 2\'s 0.87 was.',
            'Timing compounds exponentially: delay costs doublings, and doublings cost cases.',
            'Fitted e is a behavioural composite — honest within population and period, dangerous to export.'
          ],
          eqs: [
            { tex: 'R_{\\text{eff}} = (1-e) R_0 s', words: 'the policy equation' },
            { tex: 'e^* = 1 - 1/R_0', words: 'efficacy needed for decline' }
          ]
        }
      ]
    },

    /* ================================================================== */
    {
      id: 'm8', caseNo: '08',
      title: 'Field guide: any outbreak',
      scope: 'The eight-step protocol, four fresh scenarios, register closure',
      opened: 'Capstone',
      brief: ['Everything so far, compressed into a repeatable protocol — then four outbreaks the course never touched. This is the file that earns the register\'s final stamp.'],
      sections: [
        {
          id: 'm8-s1', kind: 'concept', title: 'The protocol you have been practising',
          blocks: [
            { t: 'list', items: [
              '<strong>Nail the question.</strong> Forecast size? Compare interventions? Attribute sources? The question sets the structure budget.',
              '<strong>Biology → compartments.</strong> Latency? waning? vector? chronicity? (Case 03) Every box justified in one line.',
              '<strong>Write the flows.</strong> Conservation check: derivatives sum to zero. (Case 02)',
              '<strong>Parameterise from literature.</strong> R0 range, generation time, latent/infectious durations — cite or flag as assumption.',
              '<strong>Threshold arithmetic first.</strong> r = γ(R0−1), doubling time, e* = 1 − 1/R0 — three numbers before any simulation. (Cases 02, 07)',
              '<strong>Fit if data exists.</strong> Poisson MLE on incidence (never cumulative), log/logit transforms, Hessian honesty. (Case 05)',
              '<strong>Interventions as parameter surgery.</strong> e(t), s, D — and the counterfactuals that matter. (Case 07)',
              '<strong>State the limits.</strong> Ascertainment, structure errors, the behaviour inside e. A model without stated limits is a liability.'
            ]},
            { t: 'note', label: 'The habit', md: 'Cases 01–07 each drilled one step. From here on, you run the whole loop yourself, fast and rough, then refine what the question actually needs.' }
          ]
        },
        {
          id: 'm8-s2', kind: 'sim', sim: 'scenarios', title: 'Field exercise — four fresh outbreaks',
          intro: 'Four scenarios, no answers shown until you commit. For each: choose the structure, set the arithmetic, defend the fit. These are graded like the register grades everything — by your reasoning, not your memory.',
          predict: null,
          controls: 'Work all four. Open the model answer only after committing your own — the point is the difference, not the answer.'
        },
        {
          id: 'm8-s3', kind: 'quiz', title: 'Checkpoint — cold recall',
          questions: [
            { id: 'm8q1', q: 'Cholera in a flood district: R0 ≈ 2.5, mean infectious 5 d, environmental water reservoir matters. The MINIMAL defensible structure is:', opts: ['plain SIR — water is a detail', 'SIR + a water-reservoir compartment (W) with shedding dS→W and ingestion λW→S: a second "host" — the same two-host grammar as dengue', 'SEIRS with 1-year waning', 'SI only'], correct: 1, why: 'The water reservoir is a state the pathogen lives in — structurally a second host with its own inflow (shedding) and outflow (inactivation). Same loop logic as Case 06, no mosquitoes. Recognising "another reservoir = another box" transfers to environmental, zoonotic, and fomite transmission alike.' },
            { id: 'm8q2', q: 'Your boss wants "the R0 of this outbreak" from 10 days of data, flat epidemic curve so far. The professional answer:', opts: ['fit SSQ to cumulative — fast', '10 days of near-flat data cannot identify R0; report growth-rate bounds instead, or pool with neighbouring districts / line-list exposure intervals', 'R0 = 1 by definition', 'wait for the peak, then divide'], correct: 1, why: 'Identifiability honesty (Case 05\'s flat-Hessian lesson) is a REFUSAL skill: the Hessian would be a pancake, any CI fake-tight. Offer what the data CAN say: r with CI, doubling time if growing.' },
            { id: 'm8q3', q: 'For the boarding-school flu (R0 1.8) you computed e* = 0.44. The headmaster proposes "close the library" (e ≈ 0.05). Your verdict:', opts: ['insufficient alone — but it contributes to a portfolio; every e adds: (1−e_total) = Π(1−e_i)', 'sufficient', 'library closure has no effect ever', 'close the kitchens too and it works'], correct: 0, why: 'Independent transmission reductions multiply as (1−e₁)(1−e₂)…, not add. Library (0.05) + classroom mixing cut (0.2) + 40% case isolation ≈ 1−(0.95×0.8×0.6) ≈ 0.54 > 0.44 ✓. Portfolios beat single measures — and the arithmetic to prove it takes one line.' },
            { id: 'm8q4', q: 'Mid-outbreak, you refit and R0\'s CI is (0.9, 3.0). The public wants one number. You give:', opts: ['the point estimate, drop the CI', 'the median of the CI', 'the point estimate with the interval and a plain sentence about what would narrow it — plus policy that is robust across the interval (e.g. e* needed at R0 = 3.0)', 'refuse to comment'], correct: 2, why: 'Honest communication = point + interval + decision rule that works at the pessimistic end. "If R0 is as high as 3.0, we need a 67% cut" is more useful — and more credible — than a false single number.' },
            { id: 'm8q5', q: 'Which of these is NOT one of the course\'s models, but IS defensibly equivalent to one of them, structurally?', opts: ['a chickenpox model with lifelong immunity after infection (SEIR)', 'a zombie model with S→I→R where R are immune zombies', 'an information-rumor model S→I→R on social media (same grammar, different "pathogen")', 'a stock-market model'], correct: 2, why: 'Rumor/information spreading is literally SIR with "susceptible = hasn\'t heard it, infectious = sharing it". The grammar\'s portability is the entire point of this register: learn the flows once, recognise them anywhere — from measles to misinformation.' }
          ]
        },
        {
          id: 'm8-s4', kind: 'transfer', title: 'Transfer — the four outbreaks',
          scenario: 'Commit to each BEFORE opening its model answer. One page each, in the field, no references: this is the exam the register exists to prepare you for.\n\n(A) RABIES: a dog bite case reaches your district hospital; R0 ≈ 1.2 among dogs; describe the control question and the one number that answers it.\n(B) CHOLERA: flood district, water reservoir; name the two most targeted flows and their R0 terms.\n(C) FLU BOARDING SCHOOL: R0 1.8, 600 students, one index case Sunday night; how many infected by the following Sunday (r arithmetic, not simulation)?\n(D) ZIKA: pregnant traveller returns from a dengue-endemic district; what does the mosquito loop tell you about her actual risk window?',
          tasks: [
            '(A) State the susceptible-fraction threshold and whether 70% dog vaccination clears it.',
            '(B) For cholera: which two flows, which terms of R0 (hygiene = transmission efficiency; water chlorination = reservoir inactivation; both multiply).',
            '(C) Compute r = γ(R0−1) with infectious ≈ 3 d, then cases ≈ seed × e^(r×7). Compare with the naive doubling-time count.',
            '(D) In one paragraph: viraemia ~1 week before symptoms; mosquitoes must survive n ≈ 8–12 d extrinsic incubation — what does that imply for local (autochthonous) transmission risk around her home?'
          ],
          modelAnswer: '(A) Threshold s* = 1/1.2 ≈ 0.83 → 17% immune suffices. 70% vaccination clears it with margin. The one number: effective susceptible fraction of the dog population — vaccinate coverage is the lever, rabies R0 is low enough that elimination is genuinely achievable.\n(B) Hygiene/hand-washing cuts transmission efficiency (b or c terms); chlorination cuts reservoir survival (the W inactivation rate), and ORS/hospitalisation shortens infectious shedding (the r term / shedding duration). They multiply in R0²: (1−e₁)(1−e₂)…\n(C) r = (1/3)(0.8) ≈ 0.267/day → 7 days: e^(1.87) ≈ 6.5× → ~6–7 cases from one index (before depletion or behaviour changes). Doubling-time route: ln2/0.267 ≈ 2.6 d → 7/2.6 ≈ 2.7 doublings → 2^2.7 ≈ 6.5 — same answer, good cross-check.\n(D) Her viraemia window (~1 week, pre-symptomatic onset) means local mosquitoes feeding on her can be infected; after ~8–12 days extrinsic incubation, a SMALL fraction (e^(−μV·n), often <10–20% for Aedes aegypti at 25–30°C) survive to be infectious. Risk of sustained local transmission is gated by m (Aedes density) and bite rates — in high-density districts, that is not negligible: the arithmetic of e^(−μV·n)·m·a² decides whether the health department monitors or sprays.',
          selfNote: 'Which scenario felt least automatic? That is the next file to redo.'
        },
        {
          id: 'm8-s5', kind: 'debrief', title: 'Debrief — close the register',
          points: [
            'The protocol is eight steps; you have now run it on ten pathogens.',
            'Refusals are findings: "the data cannot identify R0" is a professional answer.',
            'Interventions multiply: (1−e₁)(1−e₂)… — portfolios beat silver bullets.',
            'The grammar transfers: water reservoirs, mosquitoes, rumours on social media — same flows, new labels.'
          ],
          eqs: [
            { tex: '(1 - e_{\\text{total}}) = \\prod_i (1 - e_i)', words: 'portfolio arithmetic' }
          ]
        }
      ]
    }
  ];

  window.CONTENT = { MODULES };
})();
