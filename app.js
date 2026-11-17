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
      lantern: { glow: 0, lastStudyDate: null, everLit: false }
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

  function renderAll() {
    state = updateLantern(state, state.today.date);
    renderChecklist();
    renderLantern();
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
    getState: function () {
      return copyState(state);
    }
  };
})();
