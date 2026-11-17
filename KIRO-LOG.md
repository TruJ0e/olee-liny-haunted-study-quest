# Kiro usage log

## 2026-11-17 — Foundation hook validation

- **Surface:** Kiro IDE 1.4.215 project launch, installed hook editor/runtime code, IDE runtime log, and current Kiro Hooks documentation.
- **Outcome:** The two foundation hooks used the retired IDE 0.x `.kiro.hook` object format. They were migrated to IDE 1.x/CLI V3 `.json` files using `version: "v1"`, a `hooks` array, `PostFileSave` triggers, regex matchers, and `agent` actions.
- **IDE state:** Kiro showed GitHub sign-in and the Kiro Free usage meter. The project opened, but the runtime log reported `hooks.v2.executionDisabledUntrustedWorkspace` and loaded zero hooks because the workspace trust prompt could not be reached through the elevated always-on-top desktop window that was already present.
- **CLI state:** `kiro-cli --version` was not available. The 3.4.0 MSI installer exists in the user's Temp directory, but Windows reports no installed Kiro CLI product and no `kiro-cli` executable on disk in the expected install locations.
- **Hand correction:** Migration was applied directly because the Kiro hook UI was blocked and the old files cannot register in current Kiro. No hook was claimed to have fired.
