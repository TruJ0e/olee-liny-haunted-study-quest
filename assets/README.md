# Assets

Image assets for the app live here (SVG preferred). The foundation scaffold uses placeholder
art drawn in CSS, so no images are referenced yet.

Planned layout:

- `characters/olee.svg`, `characters/liny.svg` — Olee (balloon) and Liny (ball).
- `costumes/<id>.svg` — one per costume piece; ids are listed in
  `.kiro/specs/moonlight-points-costume-unlocks/requirements.md`.

The `asset-check` hook in `.kiro/hooks/` flags any referenced image that is missing.
