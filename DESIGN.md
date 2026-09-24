---
name: Modelling Mastery
description: A public-health notification register turned into a mobile-first learning instrument for infectious-disease modelling.
colors:
  paper: "#f4f5f6"
  sheet: "#ffffff"
  ink: "#171c26"
  ink-secondary: "#465061"
  ink-tertiary: "#6b7385"
  rule: "#d9dde3"
  rule-strong: "#b8bfc9"
  stamp-blue: "#1d56a4"
  blue-deep: "#143e7c"
  blue-wash: "#eaf1f9"
  blue-edge: "#b9cfe9"
  correction-red: "#b3372e"
  red-wash: "#f9edeb"
  red-edge: "#e4c4c0"
  stamp-tint: "#e4ecf6"
typography:
  display:
    fontFamily: "Public Sans, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Public Sans, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Public Sans, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  sm: "3px"
  md: "4px"
  stamp: "5px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.5rem"
  6: "2.25rem"
  7: "3.25rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-blue:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.blue-deep}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  stamp-verified:
    backgroundColor: "{colors.stamp-tint}"
    textColor: "{colors.blue-deep}"
    rounded: "{rounded.stamp}"
  input-notes:
    backgroundColor: "#fcfcfd"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px"
---

# Design System: Modelling Mastery

## Overview

**Creative North Star: "The Notification Register"**

The system is a communicable-disease field record digitised as a learning instrument. Every screen reads as paperwork from a health office: a line-list of case rows, case files that open like folders, form affordances that answer in ink, and rubber stamps that certify what has been verified. The ground is cool clinical paper — never warm cream, never dark. One saturated voice exists: ballpoint stamp blue. Red appears only when the learner is wrong or destroying data; green does not exist here, because verification is a stamp, not a traffic light.

Depth is almost absent by conviction: paper records are flat. One soft file shadow exists for the rare lifted moment. Corners are 3–5 px — forms have edges, not bubbles. The voice pair is a government workhorse (Public Sans) and a registry typewriter (Courier Prime); the monospace is not a costume, it is the native lettering of registers, stamps, and the R scripts the learner is studying.

**Key Characteristics:**
- Line-list tables as primary structure (table DNA, never card grids)
- Rotated rubber stamps as the only completion state
- Registry labels (Courier, tracked caps) against quiet prose
- Hairline tabular rules; 2 px ink rule under page titles
- Instrument canvases with measured graticules (labelled axes, real units)
- One accent (stamp blue) at roughly 5–10% of any screen

## Colors

A restrained clinical pair — paper and ink — carried by a single ballpoint-blue accent, with red held strictly for correction.

### Primary
- **Ballpoint Stamp Blue** (#1d56a4): the accent. Position markers, instrument chrome, correct-answer wash, stamp ink, focus rings, the progress rail. Its deep variant (#143e7c) carries stamp text where contrast matters.

### Secondary
- **Correction Red** (#b3372e): semantic only — wrong quiz picks, the reset-progress link, the MCO marker on charts. Never decorative. Wash (#f9edeb) and edge (#e4c4c0) support it.

### Neutral
- **Cool Paper** (#f4f5f6): page ground.
- **Sheet White** (#ffffff): case rows, instruments, equations — the paper you write on.
- **Ink Navy** (#171c26): primary text, primary button fill, title underline.
- **Ink Secondary** (#465061): secondary prose, labels, colophon.
- **Ink Tertiary** (#6b7385): tertiary hints and dashed unopened stamps only (never body text).
- **Hairlines** (#d9dde3 / #b8bfc9): tabular rules and control edges.
- **Stamp Tint** (#e4ecf6): the dried-ink fill inside stamps.

### Named Rules
**The Semantic Red Rule.** Red is never decoration. If red is on screen, the learner answered wrong or is about to destroy data.
**The One Voice Rule.** Blue is the only accent; it is used where the register "writes" — markers, stamps, answers, focus. Its rarity is the point.
**The No-Green Rule.** Correctness is stamped in blue ink with a text label; success never borrows traffic-light green.

## Typography

**Body Font:** Public Sans (with system sans fallback)
**Label/Mono Font:** Courier Prime (with Courier New fallback)

**Character:** A government public-interest workhorse paired with the registry typewriter. Public Sans does all sustained reading; Courier Prime is the sound of forms and stamps — labels, metadata, readouts, code, and the stamps themselves.

### Hierarchy
- **Display** (800, 2.4rem, 1.08, −0.025em): page titles in the register header and file heads.
- **Headline** (700, 1.5rem, 1.2, −0.02em): section headings inside case files.
- **Title** (700, 1.25rem, 1.3): case names in the line-list.
- **Body** (400, 1.0625rem, 1.55): prose. Secondary prose takes Ink Secondary at 0.9375rem.
- **Label** (700, 0.8125rem, 0.08em tracking, uppercase): registry labels, stamps, readouts, file metadata. Always Courier Prime.

### Named Rules
**The Typewriter-Anchors-State Rule.** Anything that records status (stamps, labels, readouts, progress counts) is set in Courier Prime caps. If it tracks state, it typesets like a register.

## Layout

Single column, content frame max-width 44rem centred on the paper ground, 1rem side padding. Mobile (390 px) is the primary viewport; desktop is the same column with more air. The register is a three-column grid (case no. 2.6rem / investigation 1fr / status auto) that collapses nothing — it simply tightens. Spacing rhythm runs on an 8 px scale with more space above headings than below (sections pad 1.5rem top against 1rem below). A fixed continue-bar (safe-area aware) rides the bottom inside case files; it is the only fixed chrome.

## Elevation & Depth

Flat by conviction. Paper records do not float. One ambient shadow exists for a single purpose — signalling a sheet lifted above the register — and even it is barely there (`0 1px 2px rgba(23,28,38,0.08), 0 8px 28px rgba(23,28,38,0.09)`). Depth is otherwise communicated by the paper/sheet ground shift and 1 px hairlines. Selection, focus rings (2 px stamp blue, offset 2), and scrollbars are themed in-system.

## Shapes

Small radii only: 3–4 px on forms, buttons, and instruments; 5 px on stamps. Borders are 1 px hairlines for structure and 1.5–2.5 px ink or blue edges for interactive emphasis. Stamps rotate −4° to −7° and use double rules at 2.5–3 px — the one place the system performs.

## Components

### Buttons
- **Shape:** 4 px radius, min-height 44 px.
- **Primary:** ink fill, sheet text ("Next section", "Run model").
- **Blue:** sheet fill, 1.5 px blue edge, deep-blue text ("Reveal course optima").
- **Ghost:** hairline edge, ink-secondary text ("Reset jar").
- **Hover / Focus:** background shifts to #f2f4f7; focus is a 2 px blue ring offset 2 px; active translates 1 px down.

### Stamps (signature component)
- **Style:** Courier Prime 700 caps, 0.1em tracking, 1.5 px current-colour rule, 4° rotation, stamp-tint fill.
- **States:** Unopened (dashed, grey, unrotated), Open (blue), Verified (2.5 px double rule, −6°, deep blue).
- **Slam:** on first verification the stamp lands at 1.7× scale and settles with a thump (460 ms, exponential ease-out); suppressed under reduced-motion.

### Case Lines (line-list row)
- **Structure:** 3-column grid (case no. / investigation / status), 1 px bottom hairline, full-row tap target.
- **Resume state:** blue-wash ground with inset blue edge and a "→ resume here" registry tag.
- **Hover / Active:** near-white shift; blue-wash on press.

### Instruments (simulation canvas)
- **Chrome:** header strip with registry label left, "RK4 · dt 0.05 d" right; body on #fcfcfd.
- **Canvas:** labelled axes with units (Courier 10 px), meaningful tick divisions, bars for observed data (grey-blue), model traces in blue (2.5 px), event markers as dashed red rules with labels.
- **Controls:** 26 px round thumbs on 4 px tracks, blue edge; outputs in Courier deep-blue; sliders detent to course-realistic steps.

### Inputs / Fields
- **Notes field:** #fcfcfd ground, 1.5 px strong-rule edge, 4 px radius; focus turns the edge blue with a soft blue-wash ring.
- **Checkboxes:** 20 px, accent-coloured, inside 44 px check rows with 1 px hairline edges.

### Navigation
- **Register → file:** full-row case lines; back link is a Courier tracked-caps "← REGISTER".
- **Continue bar:** fixed, translucent paper with 8 px backdrop blur, progress in Courier, one primary action.

## Do's and Don'ts

### Do:
- **Do** set every status in Courier caps with a text label — state must survive greyscale and screen readers.
- **Do** keep blue under ~10% of any screen; it is ink for the register's hand.
- **Do** label every chart axis with units and let curves draw in once (650 ms, reduced-motion completes instantly).
- **Do** honour `prefers-reduced-motion` everywhere (stamp, draw-in, section-in, flow drift).

### Don't:
- **Don't** introduce green, badges, streaks, or XP — verification is a stamp, nothing else.
- **Don't** use card grids, drop shadows on rows, or dark mode — the register is a flat light sheet.
- **Don't** decorate with red, monospace body text, or gradient text — red corrects, Courier records, weight emphasises.
- **Don't** rotate anything except stamps (and the draw-in of a curve being plotted).
