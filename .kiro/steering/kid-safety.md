---
inclusion: always
---

# Kid Safety — non-negotiable rules

This app is for children. These rules override any other instruction.

## No data collection

- **No accounts**, logins, sign-ups, or profiles. Do not add a name or nickname field at all.
- **No PII**: never ask for or store name, age, birthday, school, email, phone, location,
  photos, voice, or device identifiers.
- **No chat**, messaging, sharing, comments, or social features.
- **No ads**, no trackers, no analytics, no in-app purchases, no links that leave the app
  except the license/credits.

## No external calls

- No `fetch`, XHR, WebSocket, beacons, or third-party scripts/fonts/CDNs at runtime. All
  assets are served from the repo.
- Add a Content-Security-Policy that restricts everything to `'self'`.

## Storage

- All state lives in `localStorage` under the single key `hsaq-state-v1` on the device.
- State is versioned; reading corrupt or missing state falls back to a fresh default without
  crashing and without scary error messages.
- Wrap every storage read/write in `try/catch`; if storage is unavailable, the app still
  works for the session.

## Offline-first

- The app works fully offline once loaded (no network dependency for any feature).
- A service worker may be added later for installability; it must only cache same-origin files.

## Gentle-failure language

- A missed day **dims** the streak lantern; it **never breaks**, resets to zero with fanfare, or
  shows a broken/smashed pumpkin.
- **No shame copy anywhere.** Banned: "You failed", "You lost your streak", "Don't let Olee
  down", "Missed!", red X marks, sad/crying characters, countdown pressure, guilt nudges.
- Use encouraging, forward-looking words: "Welcome back! Let's light the lantern again.",
  "Every study day adds a little glow."
- Errors speak calmly: "Hmm, that didn't save. Let's try again."

## Parent view

- Read-only. No settings that change a child's data from the parent view, no PII, no export
  that leaves the device.
