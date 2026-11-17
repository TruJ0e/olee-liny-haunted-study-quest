# Design Document — Daily Checklist

## Overview

A plain-JS module renders `#checklist` from state and owns task mutations. No framework, no
network.

## Data Model (inside `hsaq-state-v1`)

```js
{
  version: 1,
  template: [ { id: "reading", label: "Reading", builtin: true, hidden: false } /* ... */ ],
  today: { date: "2026-11-17", tasks: [ { id: "reading", label: "Reading", done: false } ] },
  history: { "2026-11-16": { total: 4, done: 3 } }   // at most 60 entries
}
```

Custom task ids: `custom-<timestamp base36>`.

## Components

- `ensureToday(state, now)` — compares `today.date` with `localDate(now)`; when the new date is
  later, writes `history[today.date] = { total, done }` and rebuilds `today` from visible
  template tasks. An earlier date (clock moved back) changes nothing.
- `toggleTask(state, id)`, `addTask(state, label)`, `removeTask(state, id)` — pure functions
  returning new state; the caller saves and re-renders.
- Rollover triggers: app start, `visibilitychange` to visible, and a 60 s interval.
- Cheer lines: a small static array per character, picked at random; all positive.

## UI

- List of large toggle buttons (`role="checkbox"`, `aria-checked`), label text at least 20 px.
- "Add your own" text input plus a 56 px "Add" button below the list.
- Celebration banner when all tasks are done.

## Error Handling

Storage failures are swallowed by the storage layer; in-memory state keeps working for the
session.

## Testing Strategy

Unit-test the pure functions (rollover across midnight, backwards clock, cap of 12, empty
label) in a plain browser test page; manual tap-target check at 360 px width.
