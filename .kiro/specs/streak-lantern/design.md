# Design Document — Streak Lantern

## Overview

The lantern is derived from checklist history plus today, so it cannot drift from the real
record.

## Data Model

```js
lantern: { glow: 0, lastStudyDate: null, everLit: false }
```

## Algorithm

`updateLantern(state, today)`:

1. `gap = max(0, daysBetween(lastStudyDate, today) - 1)` — days without study since the last
   study day.
2. If today is a study day and `lastStudyDate !== today`:
   `glow = min(7, max(everLit ? 1 : 0, glow - gap) + 1)`; `lastStudyDate = today`;
   `everLit = true`.
3. If today has no completed tasks: the displayed glow is `max(1, glow - gap)` when `everLit`
   (dimming is visual and recomputed, so un-checking never counts twice).
4. Un-checking the last task today reverts today's increment.

## UI

`#streak-lantern`: inline SVG pumpkin with a happy face; glow drives a `--glow` CSS variable
(opacity and blur of the inner light). Caption is a glow-based friendly line.
`prefers-reduced-motion` disables flicker.

## Testing Strategy

Table tests: consecutive days up to 7; 1, 3 and 10 days without study; never-lit start;
un-check revert.
