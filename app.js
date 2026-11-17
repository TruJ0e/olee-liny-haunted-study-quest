// Olee & Liny's Haunted Study Quest
(function () {
  "use strict";

  var STORAGE_KEY = "hsaq-state-v1";
  var DEFAULT_TASKS = ["Reading", "Math", "Homework", "Practice"];
  var CHEERS = [
    "Olee says: Nice work!",
    "Liny says: That added a little shine!",
    "Olee and Liny are cheering for you!"
  ];
  var UNLOCKS = [
    { id: "olee-pumpkin-cap", points: 50, character: "olee", slot: "head", label: "Pumpkin cap", asset: "assets/costumes/olee-pumpkin-cap.svg" },
    { id: "liny-witch-hat", points: 100, character: "liny", slot: "head", label: "Tiny witch hat", asset: "assets/costumes/liny-witch-hat.svg" },
    { id: "olee-star-cape", points: 200, character: "olee", slot: "body", label: "Star cape", asset: "assets/costumes/olee-star-cape.svg" },
    { id: "liny-ghost-sheet", points: 300, character: "liny", slot: "body", label: "Friendly ghost sheet", asset: "assets/costumes/liny-ghost-sheet.svg" },
    { id: "olee-bat-headband", points: 450, character: "olee", slot: "head", label: "Bat-wing headband", asset: "assets/costumes/olee-bat-headband.svg" },
    { id: "liny-candy-corn-beanie", points: 600, character: "liny", slot: "head", label: "Candy-corn beanie", asset: "assets/costumes/liny-candy-corn-beanie.svg" },
    { id: "olee-wizard-robe", points: 800, character: "olee", slot: "body", label: "Moonlight wizard robe", asset: "assets/costumes/olee-wizard-robe.svg" },
    { id: "liny-pumpkin-suit", points: 1000, character: "liny", slot: "body", label: "Jack-o'-lantern suit", asset: "assets/costumes/liny-pumpkin-suit.svg" }
  ];

  function localDate(now) {
    var date = now || new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function freshTemplate() {
    return DEFAULT_TASKS.map(function (label) {
      return {
        id: label.toLowerCase(),
        label: label,
        builtin: true,
        hidden: false
      };
    });
  }

  function tasksFromTemplate(template) {
    return template
      .filter(function (task) {
        return !task.hidden;
      })
      .map(function (task) {
        return { id: task.id, label: task.label, done: false };
      });
  }

  function emptyState(now) {
    var template = freshTemplate();
    return {
      version: 1,
      template: template,
      today: { date: localDate(now), tasks: tasksFromTemplate(template) },
      history: {},
      lantern: { glow: 0, lastStudyDate: null, everLit: false },
      points: { byDate: {} },
      costumes: {
        unlocked: [],
        equipped: {
          olee: { head: null, body: null },
          liny: { head: null, body: null }
        }
      }
    };
  }

  function normalizeState(candidate) {
    var fallback = emptyState();
    if (!candidate || candidate.version !== 1) return fallback;
    if (!Array.isArray(candidate.template)) candidate.template = fallback.template;
    if (!candidate.today || !Array.isArray(candidate.today.tasks)) {
      candidate.today = fallback.today;
    }
    if (!candidate.history || typeof candidate.history !== "object") candidate.history = {};
    if (!candidate.lantern || typeof candidate.lantern !== "object") {
      candidate.lantern = fallback.lantern;
    }
    if (!candidate.points || !candidate.points.byDate) candidate.points = fallback.points;
    if (!candidate.costumes || !Array.isArray(candidate.costumes.unlocked)) {
      candidate.costumes = fallback.costumes;
    }
    if (!candidate.costumes.equipped) candidate.costumes.equipped = fallback.costumes.equipped;
    return candidate;
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return normalizeState(raw ? JSON.parse(raw) : null);
    } catch (error) {
      return emptyState();
    }
  }

  function saveState(nextState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return true;
    } catch (error) {
      return false;
    }
  }

  function copyState(source) {
    return JSON.parse(JSON.stringify(source));
  }

  function ensureToday(source, now) {
    var next = copyState(source);
    var date = localDate(now);
    if (next.today.date >= date) return next;
    var completed = next.today.tasks.filter(function (task) {
      return task.done;
    }).length;
    next.history[next.today.date] = { total: next.today.tasks.length, done: completed };
    var dates = Object.keys(next.history).sort();
    while (dates.length > 60) delete next.history[dates.shift()];
    next.today = { date: date, tasks: tasksFromTemplate(next.template) };
    return next;
  }

  function toggleTask(source, id) {
    var next = copyState(source);
    next.today.tasks = next.today.tasks.map(function (task) {
      return task.id === id
        ? { id: task.id, label: task.label, done: !task.done }
        : task;
    });
    return next;
  }

  function addTask(source, label) {
    var clean = label.trim().slice(0, 40);
    if (!clean || source.template.length >= 12) return copyState(source);
    var next = copyState(source);
    var id = "custom-" + Date.now().toString(36);
    next.template.push({ id: id, label: clean, builtin: false, hidden: false });
    next.today.tasks.push({ id: id, label: clean, done: false });
    return next;
  }

  function removeTask(source, id) {
    var next = copyState(source);
    next.template = next.template.filter(function (task) {
      return task.id !== id || task.builtin;
    });
    next.today.tasks = next.today.tasks.filter(function (task) {
      return task.id !== id;
    });
    return next;
  }

  function dateAtNoon(value) {
    var parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2], 12);
  }

  function daysBetween(from, to) {
    return Math.round((dateAtNoon(to) - dateAtNoon(from)) / 86400000);
  }

  function updateLantern(source, today) {
    var next = copyState(source);
    var studyDates = Object.keys(next.history)
      .filter(function (date) {
        return date <= today && next.history[date].done > 0;
      })
      .sort();
    if (next.today.date === today && completedCountFor(next.today.tasks) > 0) {
      studyDates.push(today);
    }
    studyDates = studyDates.filter(function (date, index, dates) {
      return index === 0 || date !== dates[index - 1];
    });
    var glow = 0;
    var previous = null;
    studyDates.forEach(function (date) {
      if (!previous) {
        glow = 1;
      } else {
        var quietDays = Math.max(0, daysBetween(previous, date) - 1);
        glow = Math.min(7, Math.max(1, glow - quietDays) + 1);
      }
      previous = date;
    });
    if (previous && previous !== today) {
      glow = Math.max(1, glow - Math.max(0, daysBetween(previous, today) - 1));
    }
    next.lantern = {
      glow: glow,
      lastStudyDate: previous,
      everLit: studyDates.length > 0
    };
    return next;
  }

  function completedCountFor(tasks) {
    return tasks.filter(function (task) {
      return task.done;
    }).length;
  }

  function lifetimePoints(source) {
    return Object.values(source.points.byDate).reduce(function (sum, entry) {
      return sum + Number(entry.task || 0) + Number(entry.bonus || 0);
    }, 0);
  }

  function syncTodayPoints(source) {
    var next = copyState(source);
    var done = completedCountFor(next.today.tasks);
    var allDone = next.today.tasks.length > 0 && done === next.today.tasks.length;
    next.points.byDate[next.today.date] = {
      task: done * 10,
      bonus: allDone ? 20 : 0
    };
    return next;
  }

  function startOfWeek(value) {
    var date = dateAtNoon(value);
    var offset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - offset);
    return localDate(date);
  }

  function addDays(value, amount) {
    var date = dateAtNoon(value);
    date.setDate(date.getDate() + amount);
    return localDate(date);
  }

  function weeklyPoints(source) {
    var monday = startOfWeek(source.today.date);
    var sunday = addDays(monday, 6);
    return Object.keys(source.points.byDate).reduce(function (sum, date) {
      if (date < monday || date > sunday) return sum;
      var entry = source.points.byDate[date];
      return sum + Number(entry.task || 0) + Number(entry.bonus || 0);
    }, 0);
  }

  function completionForDate(source, date) {
    var record;
    if (date === source.today.date) {
      record = { total: source.today.tasks.length, done: completedCountFor(source.today.tasks) };
    } else {
      record = source.history[date];
    }
    if (!record || !record.total) return 0;
    var ratio = record.done / record.total;
    if (ratio <= 0) return 0;
    if (ratio <= 0.25) return 0.25;
    if (ratio <= 0.5) return 0.5;
    if (ratio <= 0.75) return 0.75;
    return 1;
  }

  var unlockNotice = "";

  function syncUnlocks(source) {
    var next = copyState(source);
    var total = lifetimePoints(next);
    UNLOCKS.forEach(function (item) {
      if (total >= item.points && !next.costumes.unlocked.includes(item.id)) {
        next.costumes.unlocked.push(item.id);
        unlockNotice = item.label + " unlocked for " + (item.character === "olee" ? "Olee" : "Liny") + "!";
      }
    });
    return next;
  }

  function equipCostume(source, id) {
    var next = copyState(source);
    var item = UNLOCKS.find(function (unlock) {
      return unlock.id === id;
    });
    if (!item || !next.costumes.unlocked.includes(id)) return next;
    var equipped = next.costumes.equipped[item.character];
    equipped[item.slot] = equipped[item.slot] === id ? null : id;
    return next;
  }

  var state = ensureToday(loadState());
  var hint = "";
  var cheer = "";

  function completedCount() {
    return completedCountFor(state.today.tasks);
  }

  function renderChecklist() {
    var body = document.querySelector("#checklist .section-body");
    body.removeAttribute("data-placeholder");
    body.replaceChildren();

    var list = document.createElement("ul");
    list.className = "task-list";
    state.today.tasks.forEach(function (task) {
      var row = document.createElement("li");
      row.className = "task-row";
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "task-toggle";
      toggle.setAttribute("role", "checkbox");
      toggle.setAttribute("aria-checked", String(task.done));
      toggle.textContent = task.label;
      toggle.addEventListener("click", function () {
        state = toggleTask(state, task.id);
        var changed = state.today.tasks.find(function (item) {
          return item.id === task.id;
        });
        cheer = changed.done ? CHEERS[Math.floor(Math.random() * CHEERS.length)] : "";
        saveState(state);
        renderAll();
        document.dispatchEvent(
          new CustomEvent("hsaq:task-changed", {
            detail: { id: task.id, done: changed.done, date: state.today.date }
          })
        );
      });
      row.appendChild(toggle);

      var templateTask = state.template.find(function (item) {
        return item.id === task.id;
      });
      if (templateTask && !templateTask.builtin) {
        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-task";
        remove.setAttribute("aria-label", "Remove " + task.label);
        remove.textContent = "−";
        remove.addEventListener("click", function () {
          state = removeTask(state, task.id);
          saveState(state);
          renderAll();
        });
        row.appendChild(remove);
      }
      list.appendChild(row);
    });
    body.appendChild(list);

    var form = document.createElement("form");
    form.className = "task-form";
    var label = document.createElement("label");
    label.htmlFor = "new-task";
    label.textContent = "Add your own";
    var input = document.createElement("input");
    input.id = "new-task";
    input.maxLength = 40;
    input.autocomplete = "off";
    input.placeholder = "A study task";
    var add = document.createElement("button");
    add.type = "submit";
    add.textContent = "Add";
    form.append(label, input, add);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var clean = input.value.trim();
      if (!clean) {
        hint = "Type a task name first!";
      } else if (state.template.length >= 12) {
        hint = "Your list is full for now. Twelve tasks is plenty!";
      } else {
        state = addTask(state, clean);
        hint = "Added to today's quest!";
        saveState(state);
      }
      renderAll();
    });
    body.appendChild(form);

    var message = document.createElement("p");
    message.className = "hint";
    message.setAttribute("aria-live", "polite");
    message.textContent = hint || cheer;
    body.appendChild(message);

    if (state.today.tasks.length && completedCount() === state.today.tasks.length) {
      var celebration = document.createElement("p");
      celebration.className = "celebration";
      celebration.textContent = "All done for today!";
      body.appendChild(celebration);
    }
  }

  function studyDaysThisMonth() {
    var prefix = state.today.date.slice(0, 7);
    var dates = Object.keys(state.history).filter(function (date) {
      return date.startsWith(prefix) && state.history[date].done > 0;
    });
    if (completedCount() > 0 && !dates.includes(state.today.date)) dates.push(state.today.date);
    return dates.length;
  }

  function renderLantern() {
    var body = document.querySelector("#streak-lantern .section-body");
    body.removeAttribute("data-placeholder");
    body.replaceChildren();
    var wrap = document.createElement("div");
    wrap.className = "lantern-wrap glow-" + state.lantern.glow;
    wrap.innerHTML =
      '<svg class="lantern-art" viewBox="0 0 220 220" role="img" aria-label="A happy jack-o\'lantern with glow level ' +
      state.lantern.glow +
      ' out of 7"><path class="lantern-stem" d="M96 45 Q105 15 130 26 L128 54 Z"/><ellipse class="lantern-pumpkin" cx="110" cy="126" rx="86" ry="72"/><ellipse class="lantern-light" cx="110" cy="128" rx="66" ry="54"/><path class="lantern-face" d="M64 108 Q79 91 94 108 Q79 116 64 108 M126 108 Q141 91 156 108 Q141 116 126 108 M71 139 Q110 174 149 139 Q110 157 71 139"/></svg>';
    body.appendChild(wrap);
    var caption = document.createElement("p");
    caption.className = "lantern-caption";
    if (!state.lantern.everLit) {
      caption.textContent = "Complete a task to light your lantern!";
    } else if (completedCount() > 0) {
      caption.textContent = "Your study glow is shining at level " + state.lantern.glow + "!";
    } else if (
      state.lantern.lastStudyDate &&
      daysBetween(state.lantern.lastStudyDate, state.today.date) > 1
    ) {
      caption.textContent = "Welcome back! Let's add some glow.";
    } else {
      caption.textContent = "Every study day adds a little glow.";
    }
    var month = document.createElement("p");
    month.className = "month-count";
    month.textContent = "Study days this month: " + studyDaysThisMonth();
    body.append(caption, month);
  }

  function renderPoints() {
    var body = document.querySelector("#moonlight-points .section-body");
    body.removeAttribute("data-placeholder");
    body.replaceChildren();
    var stats = document.createElement("div");
    stats.className = "point-stats";
    stats.innerHTML =
      '<p><strong class="point-number">' + lifetimePoints(state) + '</strong><span>Lifetime points</span></p>' +
      '<p><strong class="point-number">' + weeklyPoints(state) + '</strong><span>This week</span></p>';
    body.appendChild(stats);

    var ring = document.getElementById("moon-ring");
    ring.replaceChildren();
    var monday = startOfWeek(state.today.date);
    var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    dayNames.forEach(function (name, index) {
      var date = addDays(monday, index);
      var phase = completionForDate(state, date);
      var day = document.createElement("div");
      day.className = "moon-day" + (date > state.today.date ? " future" : "");
      var size = Math.round(40 * phase);
      var x = 4 + (40 - size);
      day.innerHTML =
        '<svg viewBox="0 0 48 48" role="img" aria-label="' + name + ' moon, ' + Math.round(phase * 100) + ' percent full"><circle class="moon-outline" cx="24" cy="24" r="20"/><rect class="moon-fill" x="' + x + '" y="4" width="' + size + '" height="40" rx="20"/></svg><span>' + name + '</span>';
      ring.appendChild(day);
    });
  }

  function renderCostumes() {
    var body = document.querySelector("#costume-shelf .section-body");
    body.removeAttribute("data-placeholder");
    body.replaceChildren();
    if (unlockNotice) {
      var notice = document.createElement("p");
      notice.className = "celebration";
      notice.setAttribute("aria-live", "polite");
      notice.textContent = unlockNotice;
      body.appendChild(notice);
    }
    var shelf = document.createElement("div");
    shelf.className = "costume-grid";
    var total = lifetimePoints(state);
    UNLOCKS.forEach(function (item) {
      var unlocked = state.costumes.unlocked.includes(item.id);
      var tile = document.createElement(unlocked ? "button" : "div");
      tile.className = "costume-tile" + (unlocked ? " unlocked" : " locked");
      if (unlocked) tile.type = "button";
      var worn = state.costumes.equipped[item.character][item.slot] === item.id;
      tile.innerHTML = '<img src="' + item.asset + '" alt=""/><strong>' + item.label + '</strong><span>' + (unlocked ? (worn ? "Wearing — tap to remove" : "Unlocked — tap to wear") : Math.max(0, item.points - total) + " more points") + '</span>';
      if (unlocked) {
        tile.setAttribute("aria-pressed", String(worn));
        tile.addEventListener("click", function () {
          state = equipCostume(state, item.id);
          saveState(state);
          renderAll();
        });
      }
      shelf.appendChild(tile);
    });
    body.appendChild(shelf);
    ["olee", "liny"].forEach(function (character) {
      var figure = document.querySelector(".guide-" + character);
      var oldBadge = figure.querySelector(".costume-badge");
      if (oldBadge) oldBadge.remove();
      var wornIds = Object.values(state.costumes.equipped[character]).filter(Boolean);
      if (wornIds.length) {
        var badge = document.createElement("span");
        badge.className = "costume-badge";
        badge.textContent = wornIds.map(function (id) {
          return UNLOCKS.find(function (item) { return item.id === id; }).label;
        }).join(" + ");
        figure.appendChild(badge);
      }
    });
  }

  function renderAll() {
    state = syncUnlocks(syncTodayPoints(state));
    state = updateLantern(state, state.today.date);
    renderChecklist();
    renderLantern();
    renderPoints();
    renderCostumes();
  }

  function rollover() {
    var next = ensureToday(state);
    if (next.today.date !== state.today.date) {
      state = next;
      saveState(state);
      renderAll();
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) rollover();
  });
  window.setInterval(rollover, 60000);

  document.addEventListener("hsaq:task-changed", function () {
    state = syncUnlocks(syncTodayPoints(state));
    saveState(state);
    renderPoints();
    renderCostumes();
  });

  saveState(state);
  renderAll();

  window.hsaq = {
    STORAGE_KEY: STORAGE_KEY,
    loadState: loadState,
    saveState: saveState,
    localDate: localDate,
    ensureToday: ensureToday,
    toggleTask: toggleTask,
    addTask: addTask,
    removeTask: removeTask,
    updateLantern: updateLantern,
    daysBetween: daysBetween,
    lifetimePoints: lifetimePoints,
    weeklyPoints: weeklyPoints,
    equipCostume: equipCostume,
    UNLOCKS: UNLOCKS,
    getState: function () {
      return copyState(state);
    }
  };
})();
