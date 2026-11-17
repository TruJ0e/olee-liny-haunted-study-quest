---
inclusion: always
---

# Design System — Olee & Liny's Haunted Study Quest

Spooky-cute, never scary. Every Halloween element is friendly and doubles as a game mechanic.

## Palette

Use only these tokens (defined as CSS custom properties in `styles.css`). Do not hard-code hex
values in components.

| Token | Hex | Use |
| --- | --- | --- |
| `--midnight-purple` | `#2B1B4A` | Page background, night sky |
| `--midnight-purple-deep` | `#1C1033` | Header, card shadows, deepest surfaces |
| `--midnight-purple-soft` | `#3E2A66` | Cards and sections on the background |
| `--pumpkin-orange` | `#FF8A1F` | Primary actions, lantern glow, checked tasks |
| `--pumpkin-orange-dim` | `#B5651D` | Dimmed lantern, pressed states |
| `--moonlight-cream` | `#FFF4D6` | Body text, moon, points |
| `--ghost-white` | `#F8F8FF` | Headings, icons, highlights |

Contrast: body text is `--moonlight-cream` or `--ghost-white` on midnight purple surfaces (well
above WCAG AA). Never put cream text on pumpkin orange; use `--midnight-purple-deep` text on
orange buttons.

## Spooky-cute rules

- Rounded shapes everywhere: big corner radii, soft shadows, no sharp spikes or claws.
- Faces are smiling or sleepy, never angry, crying, or menacing. No blood, skulls with teeth,
  gore, jump scares, flashing, or sudden loud sounds.
- Ghosts are round and giggly; bats wave; the jack-o'-lantern has a happy carved face.
- Darkness is cozy night-time, not threat. The moon and lantern are sources of warm light.
- Animation is gentle (bob, sway, glow) and respects `prefers-reduced-motion`.

## Typography

- Read-aloud-friendly: a rounded, highly legible sans-serif. Stack:
  `"Atkinson Hyperlegible", "Nunito", "Trebuchet MS", system-ui, sans-serif` (system fonts only;
  no web-font requests — see kid-safety.md).
- Base size 20px minimum; headings 28–40px. Line height 1.5.
- Short sentences, plain words a 6–10 year old can read or have read to them. Sentence case.
- Never rely on icons alone; every icon has a visible text label.

## Tap targets

- Every interactive element is at least **56 × 56 px** with at least 12px between targets.
- Checkboxes are large custom toggles, not native 16px boxes.
- Focus is always visible (thick `--ghost-white` outline) for keyboard and switch users.

## Characters

- **Olee** is a **balloon** and **Liny** is a **ball** — Truman's original characters. Keep that
  shape identity in every costume and pose (Olee floats with a string; Liny rolls and bounces).
- They are friendly guides: they cheer, give hints, and celebrate. They never scold, frighten,
  or express disappointment.
- Costume pieces are worn by Olee and Liny; costumes are cute (witch hat, cape, pumpkin cap,
  ghost sheet with eye holes), not gory.
- Use placeholder art clearly labelled until final art lands in `assets/`.

## Layout

- Single column on phones, two columns on tablets and up. 16px side gutter minimum; no
  horizontal scroll.
- Sections in order: checklist, streak lantern, moonlight points + moon ring, costume shelf,
  parent view.
