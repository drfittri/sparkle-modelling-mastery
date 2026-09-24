# Modelling Mastery — Infectious disease modelling register

An active-recall, mobile-first refresher built from the [SPARKLE short course](https://training.spark.edu.au/courses/intro-mathematical-modelling/) *Modelling Infectious Diseases* (SPARKLE workshop, Malaysia 2026). It exists to convert course *exposure* into applied *skill*: every module makes you predict before revealing, run live simulations whose equations are the course's own, and close with a transfer challenge to a pathogen the course never used.

## The eight case files

| Case | Investigation | Course session |
|---|---|---|
| 01 | Why model at all — bean jar, incidence vs prevalence, R0 | Session 1 |
| 02 | Differential equations in motion — integrators, r vs R0 | Session 2 |
| 03 | A model that fits the pathogen — compartment design | Session 3 |
| 04 | Malaysia, first wave — the course SEIR vs real data | Session 4 |
| 05 | Fitting — least squares, Poisson MLE, surfaces, CIs | Session 5 |
| 06 | Two hosts: dengue — Ross–Macdonald, why √m | Sessions 7–8 |
| 07 | The MCO — Reff = (1−e)·R0, calibrated efficacies | Session 9 |
| 08 | Field guide — the eight-step protocol, fresh outbreaks | Capstone |

## Ground truth

- Malaysia 2020 daily case data (MoH Malaysia open-data repository, via the course): embedded in `data/malaysia-2020.js`.
- Course-fitted values used as checkpoints: initial SSQ 19,652.25; LSQ optimum R0 ≈ 4.56, I(0) ≈ 15.4 (SSQ 16,756.64); MLE R0 ≈ 5.235 (95% CI 4.76–5.75), I(0) ≈ 9.00; MCO efficacies 0.728 / 0.869, NLL 633.1. The app's in-browser RK4 engine reproduces these to within integration tolerance (verified against the course R scripts).

## Run it

No build step. Serve the folder statically:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Progress, quiz answers, and field notes persist in your browser's localStorage — close the tab any time and resume from the register. Nothing leaves your device.

## Notes

- Equations render via KaTeX from a CDN; offline, the underlying LaTeX stays readable and every equation has a plain-words line.
- Light theme, WCAG-AA contrast, ≥44 px touch targets, `prefers-reduced-motion` honoured.
- Faculty/course credit: Roslyn Hickson and contributors (see the course site). This refresher is a personal study aid, not course material.
