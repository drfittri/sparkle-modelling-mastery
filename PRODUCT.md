# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML/CSS/JS, no build step. Reasons (inferred, overnight run): must host on the user's GitHub Pages (static only, no backend); must run on the user's phone anywhere (fast first load, offline-tolerant); resume-anytime persistence via localStorage; a single-file-per-concern vanilla stack is the most robust thing that can never break at 2am with a dead npm registry. Equations via KaTeX from CDN with graceful no-JS-math fallback text. ODE simulations computed in-browser (RK4) on canvas — no server, no data leaves the device.

## Users

- Primary (confirmed from brief): the user themself — Dr. Fittri, a Malaysian public-health physician (DrPH candidate) who completed the SPARKLE "Modelling Infectious Diseases" short course and wants to *truly internalise* it: not follow along, but be able to derive, build, fit and defend infectious-disease models in any new situation. Uses a phone primarily (mobile-first is a hard requirement), in short sessions, anywhere — commute, clinic downtime, nights.
- Secondary (inferred): any clinician/public-health student who took an intro modelling course and wants active mastery rather than exposure.

## Product Purpose

Turn the SPARKLE short course's *content* into *embodied skill*. The course taught: SIRS from a bean jar, differential-equation models in R, choosing a structure that fits the pathogen, a Malaysia-COVID SEIR model, fitting by least squares and maximum likelihood, vector-borne (dengue) models, and intervention modelling (MCO). This webapp makes the learner *do* each of those things interactively — predict before revealing, simulate with live equations, fit curves by hand against real Malaysia 2020 data, then face transfer challenges with brand-new diseases — until the ideas survive outside the course context. Success = the learner can, cold: write down SEIR equations for an unfamiliar pathogen, justify parameter choices, explain R0 vs Reff vs growth rate, describe how fitting and CIs work, and reason about interventions quantitatively.

## Positioning

An active-recall, predict-then-verify refresher built directly from the course's own materials (its scripts, its Malaysia 2020 dataset, its fitted values) — not a textbook re-skin. Every module: concept → interactive simulation with live equations → predict-check feedback → quiz with explanations → transfer challenge to a disease the course never mentioned. The learner's own fitted values from the course appear as ground truth to verify against.

## Operating Context

- Phone-first (390px-class viewports), thumb-reach controls, usable one-handed; also fine on desktop.
- Short sessions (2–10 min), interruptible at any moment; progress and quiz answers persist in localStorage; a Home screen shows exactly where to resume.
- Hosted on GitHub Pages under https://drfittri.github.io/ — everything client-side, no accounts, no network calls except the KaTeX CDN (content must remain readable if it fails).
- Reference materials the product treats as ground truth: /Users/fittri/Desktop/Sparkle/ (course scripts, malaysia_covid_2020.csv, offline course note). Malaysia 2020 case data (Jan 25–Jun 30, max 277/day, 8,639 cumulative) is embedded in the app for the fitting playground. Course-fitted values used as checkpoints: least-squares R0≈4.56, I(0)≈15.4, SSQ 16,756.64; MLE R0≈5.235, I(0)≈9.00 (95% CI 4.76–5.75); MCO efficacies phase 1 ≈0.728 (CI 0.721–0.735), phase 2 ≈0.869 (CI 0.866–0.873); parameters R0=4, latent=5 d, infectious=6 d, population 3.27e7, seed 20; MCO 2020-03-18, phase 2 2020-04-01.

## Capabilities and Constraints

- Modules mirror the course: 1 Intro/modelling purpose, 2 Differential equations, 3 Match model to pathogen, 4 SEIR & COVID Malaysia, 5 Fitting (LSQ + MLE + CIs), 6 Vector-borne (course sessions 7+8 merged), 7 Interventions (course session 9), 8 Capstone: apply-it-anywhere field guide.
- Each module must run its own interactive simulation client-side (RK4 integration on canvas), pose predict-first questions, grade quizzes with explanations, and end in a transfer challenge to an unrelated pathogen/scenario.
- Hard constraints: static hosting; no build step; no telemetry; light UI (user dislikes loud solid-color value boxes and scrolling layouts on dashboards — but this is a scrolling learning flow, so: generous pacing, never cramped); English copy; respect prefers-reduced-motion; keyboard reachable; body text ≥16px on mobile.
- Assumptions (inferred overnight, flagged): English-only; single user; no offline service-worker in v1 (localStorage progress survives, page needs first load); KaTeX from CDN acceptable.

## Brand Commitments

- Name: "Modelling Mastery" — subtitle "Infectious disease modelling, from the SPARKLE course to any outbreak". Course attribution: "Built from the SPARKLE short course (training.spark.edu.au), Malaysia 2026".
- Voice: coach-like, precise, never gamified-hype. No badges/XP/streaks; progress is shown as honest completion states. No emoji as icons.

## Evidence on Hand

- Full offline copy of the updated course site: /Users/fittri/Desktop/Sparkle/intro-mathematical-modelling/intro-mathematical-modelling-complete.html
- Course R scripts (one final per session) + malaysia_covid_2020.csv: /Users/fittri/Desktop/Sparkle/
- Site ground truth downloaded 2026-09-24: /tmp/sparkle_site/ (may not survive reboot — course data also embedded in the offline note).

## Product Principles

1. Predict before reveal — no passive reading; the learner commits to an answer, then sees reality.
2. Equations are live, not decoration — every formula can be manipulated in a simulation.
3. Transfer or it didn't happen — every module ends in a scenario the course never used.
4. Honest numbers — simulations use the course's real parameters and the real Malaysia 2020 data; checkpoints quote the course's own fitted values.
5. Respect the commute — thumb-reach, interruptible, resumable, no fluff between taps.

## Accessibility & Inclusion

- WCAG AA contrast on the light theme; body ≥16px; focus-visible rings; all interactive elements ≥44px touch targets; prefers-reduced-motion honored; no colour-only state encoding (labels + icons); math has plain-text fallbacks.
