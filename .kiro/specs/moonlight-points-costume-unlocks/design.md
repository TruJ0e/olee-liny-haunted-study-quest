# Design Document — Moonlight Points & Costume Unlocks

## Data Model

```js
points: { byDate: { "2026-11-17": { task: 30, bonus: 0 } } },
costumes: {
  unlocked: ["olee-pumpkin-cap"],
  equipped: { olee: { head: "olee-pumpkin-cap", body: null }, liny: { head: null, body: null } }
}
```

Lifetime points are the sum of `byDate`, recomputed on load (single source of truth). Weekly
points are the sum over the current Monday–Sunday dates.

## Components

- `UNLOCKS` constant mirrors the requirements table (`id`, `points`, `character`, `slot`,
  `label`, `asset`).
- A listener on `hsaq:task-changed` updates `byDate[today]`, recomputes lifetime, diffs the
  unlocked set, and fires one celebration per newly unlocked id.
- Moon ring (`#moon-ring`): inline SVG, 7 moons around a ring; phase from `done / total`
  bucketed to 0, 0.25, 0.5, 0.75, 1.
- Costume shelf (`#costume-shelf`): grid of tiles at least 56 px; tap an unlocked tile to equip
  or unequip.

## Assets

Costume images live at `assets/costumes/<id>.svg`. The asset-check hook verifies every `asset`
path referenced by the app exists.

## Testing Strategy

Check/uncheck symmetry; bonus once per day; week boundary on Monday; crossing a threshold fires
exactly one celebration; points never drop across a day without study.
