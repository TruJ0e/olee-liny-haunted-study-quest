# Olee & Liny's Haunted Study Quest

> A **Kiroween 2026 Costume Contest** entry.

Olee & Liny's Haunted Study Quest is a local-first study and habit tracker for kids, wearing a
full spooky-cute Halloween costume where the spooky parts *are* the mechanics. Each day brings a
short checklist (Reading, Math, Homework, Practice, plus anything you add yourself), guided by
Olee the balloon and Liny the ball. Studying lights a jack-o'-lantern streak lantern — a missed
day only dims it, it never breaks. Finished tasks earn moonlight points that fill a moon-phase
ring for the week and unlock costume pieces for Olee and Liny, and a read-only parent view shows
progress at a glance. No accounts, no personal information, no chat, no ads: everything stays on
the device and works offline.

**Live app:** <https://truj0e.github.io/olee-liny-haunted-study-quest/>

## Run locally

No build step and no dependencies.

- **Quickest:** open `index.html` in any modern browser.
- **Static server (recommended):** from the repo root run any static server, for example
  - `python -m http.server 8000` then visit <http://localhost:8000>
  - `npx serve .`

The site is GitHub Pages-ready from the repo root.

## Project layout

- `index.html`, `styles.css`, `app.js` — the static app.
- `assets/` — image assets.
- `.kiro/steering/` — design-system and kid-safety steering docs.
- `.kiro/specs/` — one spec per feature, written before the code.
- `.kiro/hooks/` — agent hook definitions (format/lint on save, asset check).

## Status

The daily checklist, streak lantern, moonlight points and costume unlocks, and read-only parent
view are implemented. The foundation specs were written before Kiro was installed; the hook
migration, Kiro limitations, feature work, and verification evidence are recorded honestly in
[`KIRO-LOG.md`](KIRO-LOG.md).

## License

[MIT](LICENSE) © 2026 TruJoe Digital LLC. Olee and Liny are original characters by Truman.
