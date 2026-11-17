# Agent hooks

| File | Trigger | Action |
| --- | --- | --- |
| `format-lint-on-save.kiro.hook` | An `*.html`, `*.css` or `*.js` file is saved | Agent formats the file and lints it against the steering docs |
| `asset-check.kiro.hook` | `index.html`, `styles.css`, `app.js` or anything in `assets/` is saved | Agent lists image assets the app references that are missing |

## Assumptions about the hook format

These files were written by hand, from memory of Kiro's hook format, on a machine without Kiro
installed. JSON has no comments, so the assumptions are listed here instead:

- **File name and location:** hooks live in `.kiro/hooks/` with the extension `.kiro.hook`, one
  JSON object per file.
- **Fields:** `enabled`, `name`, `description`, `version` (the string `"1"`), `when`, `then`.
- **Trigger:** `when.type: "fileEdited"` with `when.patterns` as an array of glob patterns
  relative to the workspace root. Other trigger types assumed to exist (`fileCreated`,
  `fileDeleted`, `userTriggered`) are not used.
- **Action:** `then.type: "askAgent"` with a natural-language `then.prompt`. A shell-command
  action type was not used because its exact field names are unverified.
- **Not verified:** whether `version` is required, whether patterns need a `**/` prefix to
  match root files, and whether `assets/**/*` matches binary files. Confirm by opening these in
  the Kiro hook UI (or recreate them there) and commit whatever Kiro writes back.
