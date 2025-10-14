// js/admin-fixed.js
(() => {
  // ------- tiny utils -------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el?.addEventListener(ev, fn, opt);
  const uid = () =>
    Math.random().toString(36).slice(2) + Date.now().toString(36);
  const now = () => new Date().toLocaleString();

  // ------- storage layer -------
  const KEY = "elearn_admin_state_v1";
  const defaults = {
    home: [], // {id,title,type,status}
    courses: [], // {id,title,instructor,category,status}
    bookmarks: [], // {id,title,url,category}
    playlists: [], // {id,title,description,items}
    shorts: [], // {id,title,thumbnail,duration,views}
    websites: [], // {id,name,url,category,status}
    activity: [], // {id,text,ts}
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch {
      return { ...defaults };
    }
  };
  const save = (state) => localStorage.setItem(KEY, JSON.stringify(state));
  const pushActivity = (state, text) => {
    state.activity.unshift({ id: uid(), text, ts: now() });
    state.activity = state.activity.slice(0, 30);
  };

  let state = load();

  // ------- section switching -------
  const sectionsByName = {
    dashboard: $("#dashboard-section"),
    home: $("#home-section"),
    courses: $("#courses-section"),
    bookmarks: $("#bookmarks-section"),
    playlists: $("#playlists-section"),
    shorts: $("#shorts-section"),
    websites: $("#websites-section"),
  };

  function showSection(name) {
    Object.entries(sectionsByName).forEach(([key, el]) => {
      if (!el) return;
      el.style.display = key === name ? "" : "none";
    });
    $$(".menu-item").forEach((li) => {
      li.classList.toggle("active", li.dataset.section === name);
    });
    // Recompute stats when we leave/enter pages
    updateStats();
  }

  // ------- render helpers -------
  function emptyRow(cols, text) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-empty", "1");
    tr.innerHTML = `<td colspan="${cols}" style="text-align:center; padding: 20px 0; color:#7f8c8d;">${text}</td>`;
    return tr;
  }

  function wipeTbody(tbody, cols, textIfEmpty) {
    tbody.innerHTML = "";
    tbody.appendChild(emptyRow(cols, textIfEmpty));
  }

  // ------- DASHBOARD -------
  function updateStats() {
    $("#total-courses").textContent = state.courses.length;
    $("#total-bookmarks").textContent = state.bookmarks.length;
    $("#total-playlists").textContent = state.playlists.length;

    const actBox = $("#recent-activity");
    if (actBox) {
      actBox.innerHTML = "";
      if (!state.activity.length) {
        actBox.appendChild(emptyRow(1, "No recent activity"));
      } else {
        const ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.display = "grid";
        ul.style.gap = "10px";
        state.activity.slice(0, 10).forEach((a) => {
          const li = document.createElement("li");
          li.style.padding = "10px";
          li.style.background = "#f8f9fa";
          li.style.borderRadius = "6px";
          li.innerHTML = `<strong>${a.text}</strong><br/><small style="color:#7f8c8d">${a.ts}</small>`;
          ul.appendChild(li);
        });
        actBox.appendChild(ul);
      }
    }
  }

  // ------- HOME -------
  function renderHome() {
    const tbody = $("#home-content-list");
    if (!tbody) return;
    if (!state.home.length)
      return wipeTbody(tbody, 5, "No home content added yet");

    tbody.innerHTML = "";
    state.home.forEach((item) => {
      const tr = document.createElement("tr");
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td>${item.id.slice(-6)}</td>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.type || "")}</td>
        <td>${escapeHtml(item.status || "Draft")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="home"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-entity="home"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------- COURSES -------
  function renderCourses() {
    const tbody = $("#courses-list");
    if (!tbody) return;
    if (!state.courses.length)
      return wipeTbody(tbody, 6, "No courses added yet");

    tbody.innerHTML = "";
    state.courses.forEach((c) => {
      const tr = document.createElement("tr");
      tr.dataset.id = c.id;
      tr.innerHTML = `
        <td>${c.id.slice(-6)}</td>
        <td>${escapeHtml(c.title)}</td>
        <td>${escapeHtml(c.instructor || "")}</td>
        <td>${escapeHtml(c.category || "")}</td>
        <td>${escapeHtml(c.status || "Draft")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="courses"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-entity="courses"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------- BOOKMARKS -------
  function renderBookmarks() {
    const tbody = $("#bookmarks-list");
    if (!tbody) return;
    if (!state.bookmarks.length)
      return wipeTbody(tbody, 5, "No bookmarks added yet");

    tbody.innerHTML = "";
    state.bookmarks.forEach((b) => {
      const tr = document.createElement("tr");
      tr.dataset.id = b.id;
      tr.innerHTML = `
        <td>${b.id.slice(-6)}</td>
        <td>${escapeHtml(b.title)}</td>
        <td><a href="${escapeAttr(
          b.url
        )}" target="_blank" rel="noopener">${escapeHtml(b.url)}</a></td>
        <td>${escapeHtml(b.category || "")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="bookmarks"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-entity="bookmarks"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------- PLAYLISTS -------
  function renderPlaylists() {
    const tbody = $("#playlists-list");
    if (!tbody) return;
    if (!state.playlists.length)
      return wipeTbody(tbody, 5, "No playlists added yet");

    tbody.innerHTML = "";
    state.playlists.forEach((p) => {
      const tr = document.createElement("tr");
      tr.dataset.id = p.id;
      tr.innerHTML = `
        <td>${p.id.slice(-6)}</td>
        <td>${escapeHtml(p.title)}</td>
        <td>${escapeHtml(p.description || "")}</td>
        <td>${Number(p.items || 0)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="playlists"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-entity="playlists"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------- SHORTS -------
  function renderShorts() {
    const tbody = $("#shorts-list");
    if (!tbody) return;
    if (!state.shorts.length) return wipeTbody(tbody, 6, "No shorts added yet");

    tbody.innerHTML = "";
    state.shorts.forEach((s) => {
      const tr = document.createElement("tr");
      tr.dataset.id = s.id;
      tr.innerHTML = `
        <td>${s.id.slice(-6)}</td>
        <td>${escapeHtml(s.title)}</td>
        <td>${escapeHtml(s.thumbnail || "")}</td>
        <td>${escapeHtml(s.duration || "")}</td>
        <td>${Number(s.views || 0)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="shorts"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-entity="shorts"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------- WEBSITES -------
  function renderWebsites() {
    const tbody = $("#websites-list");
    if (!tbody) return;
    if (!state.websites.length)
      return wipeTbody(tbody, 6, "No websites added yet");

    tbody.innerHTML = "";
    state.websites.forEach((w) => {
      const tr = document.createElement("tr");
      tr.dataset.id = w.id;
      tr.innerHTML = `
        <td>${w.id.slice(-6)}</td>
        <td>${escapeHtml(w.name)}</td>
        <td><a href="${escapeAttr(
          w.url
        )}" target="_blank" rel="noopener">${escapeHtml(w.url)}</a></td>
        <td>${escapeHtml(w.category || "")}</td>
        <td>${escapeHtml(w.status || "Active")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="websites"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-entity="websites"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------- CRUD (prompt-based, simple) -------
  function addItem(entity) {
    const id = uid();
    if (entity === "home") {
      const title = prompt("Title?");
      if (!title) return;
      const type = prompt("Type? (banner/card/…)", "banner") || "banner";
      const status =
        prompt("Status? (Published/Draft)", "Published") || "Published";
      state.home.push({ id, title, type, status });
      pushActivity(state, `Added Home Content: ${title}`);
      save(state);
      renderHome();
      updateStats();
      return;
    }
    if (entity === "courses") {
      const title = prompt("Course title?");
      if (!title) return;
      const instructor = prompt("Instructor?", "Admin") || "Admin";
      const category = prompt("Category?", "General") || "General";
      const status = prompt("Status? (Published/Draft)", "Draft") || "Draft";
      state.courses.push({ id, title, instructor, category, status });
      pushActivity(state, `Added Course: ${title}`);
      save(state);
      renderCourses();
      updateStats();
      return;
    }
    if (entity === "bookmarks") {
      const title = prompt("Bookmark title?");
      if (!title) return;
      const url = prompt("URL?", "https://") || "";
      const category = prompt("Category?", "General") || "General";
      state.bookmarks.push({ id, title, url, category });
      pushActivity(state, `Added Bookmark: ${title}`);
      save(state);
      renderBookmarks();
      updateStats();
      return;
    }
    if (entity === "playlists") {
      const title = prompt("Playlist title?");
      if (!title) return;
      const description = prompt("Description?", "") || "";
      const items = Number(prompt("Items count?", "0") || 0);
      state.playlists.push({ id, title, description, items });
      pushActivity(state, `Added Playlist: ${title}`);
      save(state);
      renderPlaylists();
      updateStats();
      return;
    }
    if (entity === "shorts") {
      const title = prompt("Short title?");
      if (!title) return;
      const thumbnail = prompt("Thumbnail (path/url)?", "") || "";
      const duration = prompt("Duration (e.g., 00:30)?", "00:30") || "00:30";
      const views = Number(prompt("Views?", "0") || 0);
      state.shorts.push({ id, title, thumbnail, duration, views });
      pushActivity(state, `Added Short: ${title}`);
      save(state);
      renderShorts();
      updateStats();
      return;
    }
    if (entity === "websites") {
      const name = prompt("Website name?");
      if (!name) return;
      const url = prompt("URL?", "https://") || "";
      const category = prompt("Category?", "Learning") || "Learning";
      const status = prompt("Status? (Active/Inactive)", "Active") || "Active";
      state.websites.push({ id, name, url, category, status });
      pushActivity(state, `Added Website: ${name}`);
      save(state);
      renderWebsites();
      updateStats();
      return;
    }
  }

  function editItem(entity, id) {
    const list = state[entity];
    const obj = list.find((x) => x.id === id);
    if (!obj) return;

    // Simple JSON edit via prompt
    const edited = prompt("Edit as JSON", JSON.stringify(obj, null, 2));
    if (!edited) return;
    try {
      const newObj = JSON.parse(edited);
      const idx = list.findIndex((x) => x.id === id);
      list[idx] = { ...obj, ...newObj, id }; // keep id stable
      pushActivity(
        state,
        `Edited ${entity.slice(0, 1).toUpperCase() + entity.slice(1)}: ${
          obj.title || obj.name || id.slice(-6)
        }`
      );
      save(state);
      rerender(entity);
      updateStats();
    } catch (e) {
      alert("Invalid JSON");
    }
  }

  function deleteItem(entity, id) {
    const list = state[entity];
    const obj = list.find((x) => x.id === id);
    if (!obj) return;
    if (!confirm("Delete this item?")) return;
    state[entity] = list.filter((x) => x.id !== id);
    pushActivity(
      state,
      `Deleted ${entity.slice(0, 1).toUpperCase() + entity.slice(1)}: ${
        obj.title || obj.name || id.slice(-6)
      }`
    );
    save(state);
    rerender(entity);
    updateStats();
  }

  function rerender(entity) {
    ({
      home: renderHome,
      courses: renderCourses,
      bookmarks: renderBookmarks,
      playlists: renderPlaylists,
      shorts: renderShorts,
      websites: renderWebsites,
    })[entity]?.();
  }

  // ------- events / wiring -------
  function wireSidebar() {
    $$(".menu-item").forEach((li) => {
      on(li, "click", () => showSection(li.dataset.section));
    });
  }

  function wireAddButtons() {
    on($("#add-home-content"), "click", () => addItem("home"));
    on($("#add-course"), "click", () => addItem("courses"));
    on($("#add-bookmark"), "click", () => addItem("bookmarks"));
    on($("#add-playlist"), "click", () => addItem("playlists"));
    on($("#add-short"), "click", () => addItem("shorts"));
    on($("#add-website"), "click", () => addItem("websites"));
  }

  function wireTableActions() {
    // Delegate clicks for all tables
    $$(".content-section .admin-card .table-responsive table").forEach(
      (tbl) => {
        on(tbl, "click", (e) => {
          const btn = e.target.closest("button[data-action]");
          if (!btn) return;
          const action = btn.dataset.action;
          const entity = btn.dataset.entity;
          const row = btn.closest("tr");
          const id = row?.dataset?.id;
          if (!entity || !id) return;

          if (action === "edit") return editItem(entity, id);
          if (action === "delete") return deleteItem(entity, id);
        });
      }
    );
  }

  function firstVisibleSection() {
    const activeLi = $(".menu-item.active");
    return activeLi?.dataset.section || "dashboard";
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  // ------- boot -------
  document.addEventListener("DOMContentLoaded", () => {
    wireSidebar();
    wireAddButtons();
    wireTableActions();

    // initial renders
    renderHome();
    renderCourses();
    renderBookmarks();
    renderPlaylists();
    renderShorts();
    renderWebsites();
    updateStats();

    // default section (whatever is active in sidebar)
    showSection(firstVisibleSection());
  });
})();
