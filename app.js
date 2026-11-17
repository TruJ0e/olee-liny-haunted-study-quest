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
      history: {}
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

  var state = ensureToday(loadState());
  var hint = "";
  var cheer = "";

  function completedCount() {
    return state.today.tasks.filter(function (task) {
      return task.done;
    }).length;
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

  function renderAll() {
    renderChecklist();
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
    getState: function () {
      return copyState(state);
    }
  };
})();
