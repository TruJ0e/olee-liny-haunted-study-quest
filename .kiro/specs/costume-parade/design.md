# Design Document — Costume Parade

## Overview

`#costume-parade` is a hidden section revealed by the "Costume Parade" button in the
costume shelf. It reads state through the same `loadState()` and renders from the unlock
table defined by the moonlight-points-costume-unlocks feature. It never calls
`saveState()` and adds no new state fields.

## Components

- `paradeItems(state)` — pure; returns the ordered list
  `[{ character, pieceId, name, svgPath, unlocked, pointsNeeded }]` for all eight costume
  pieces, Olee's pieces first, each in unlock-threshold order.
- Stage renderer: draws the existing inline-SVG Olee and Liny, layering the current
  piece's repository-local SVG from `assets/costumes/` over the matching character.
- Cycler: a single `setInterval` at 2500 ms advancing an index into the unlocked subset;
  cleared on close, on hold (pointerdown/up on the stage), and when the section hides.
- Locked strip: silhouette cards (piece SVG at low opacity, grayscale) with
  "N more moonlight" captions.
- Reduced motion: when `matchMedia('(prefers-reduced-motion: reduce)')` matches, skip the
  cycler and render all unlocked pieces as a static grid on the two characters' shelf.

## Constraints

- No inputs; the only controls are the open button and Close.
- Costume SVGs are the existing files in `assets/costumes/` — no new assets, no external
  requests.
- Enforced by review against the kid-safety steering doc (no-shame language: the word
  "locked" never renders).

## Testing Strategy

Fixture states with 0, 1, and all 8 pieces unlocked: confirm stage content, caption text,
cycle order, hold-to-pause, reduced-motion grid, and that `saveState` is never called
while the parade is open.
