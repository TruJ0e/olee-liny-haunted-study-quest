# Design Document — Parent View

## Overview

`#parent-view` is a hidden section revealed by the "Grown-ups" button (`aria-expanded`). It
reads state through the same `loadState()` and renders summary cards; it never calls
`saveState()`.

## Components

- `summarize(state, today)` — pure; returns
  `{ todayDone, todayTotal, weekDays, last30Days, glow, lifetime, unlockedCount, last14 }`
  where `last14` is `[{ date, studied }]`.
- Rendering: stat cards plus a 14-cell calendar (studied = small lit pumpkin, not studied =
  plain cream dot).

## Constraints

- No inputs and no buttons except Close.
- Enforced by review against the kid-safety steering doc.

## Testing Strategy

Compare `summarize` output against fixture state; confirm `saveState` is never called while the
view is open.
