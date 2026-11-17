// Olee & Liny's Haunted Study Quest — app shell.
// Feature logic is specified in .kiro/specs/ and is not implemented yet.
(function () {
  "use strict";

  var STORAGE_KEY = "hsaq-state-v1";

  function emptyState() {
    return { version: 1 };
  }

  // All storage access is wrapped: the app must keep working if storage is unavailable
  // (see .kiro/steering/kid-safety.md).
  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || parsed.version !== 1) return emptyState();
      return parsed;
    } catch (e) {
      return emptyState();
    }
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  var PLACEHOLDERS = {
    "checklist": "Olee and Liny are getting your study list ready.",
    "streak-lantern": "Your jack-o'-lantern will glow here.",
    "moonlight-points": "Moonlight points will shine here.",
    "costume-shelf": "Costume pieces for Olee and Liny will hang here.",
    "parent-view": "A quick progress glance for grown-ups will appear here."
  };

  function renderPlaceholders() {
    Object.keys(PLACEHOLDERS).forEach(function (id) {
      var body = document.querySelector("#" + id + " [data-placeholder]");
      if (!body) return;
      var p = document.createElement("p");
      p.className = "placeholder-note";
      p.textContent = PLACEHOLDERS[id];
      body.replaceChildren(p);
    });
  }

  var state = loadState();
  saveState(state);
  renderPlaceholders();

  window.hsaq = { STORAGE_KEY: STORAGE_KEY, loadState: loadState, saveState: saveState };
})();
