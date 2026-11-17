# Agent hooks

| File | Trigger | Action |
| --- | --- | --- |
| `format-lint-on-save.json` | An HTML, CSS, or JS file is saved | Agent formats the file and lints it against the steering docs |
| `asset-check.json` | `index.html`, `styles.css`, `app.js`, or anything in `assets/` is saved | Agent lists image assets the app references that are missing |

## Validated hook format

The foundation hooks were migrated on 2026-11-17 after opening the project in Kiro IDE 1.4.215
and checking the installed runtime plus current Kiro Hooks documentation:

- Hooks are standalone `.json` files under `.kiro/hooks/`.
- The root uses `version: "v1"` and a `hooks` array.
- File saves use `trigger: "PostFileSave"` and a regex `matcher`.
- Agent prompts use `action.type: "agent"` with `action.prompt`.
- See `KIRO-LOG.md` for the workspace-trust limitation that prevented a live hook firing in this
  build session.
