// js/admin-fixed.js  (drop-in replacement)
(() => {
  // ------- tiny utils -------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el?.addEventListener(ev, fn, opt);
  const uid = () =>
    Math.random().toString(36).slice(2) + Date.now().toString(36);
  const now = () => new Date().toLocaleString();
  const esc = (s) =>
    String(s ?? "").replace(
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

  // ------- storage layer -------
  const KEY = "elearn_admin_state_v1";
  const defaults = {
    home: [],
    courses: [], // {id,title,instructor,category,status,description,image}
    bookmarks: [], // {id,title,url,category}
    playlists: [], // {id,title,description,items,category}
    shorts: [], // {id,title,thumbnail,duration,views,creator,likes,comments}
    websites: [], // {id,name,url,category,status,description}
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
    save(state);
    try {
      localStorage.setItem("__ping__", String(Math.random()));
      localStorage.removeItem("__ping__");
    } catch {}
  };
  let state = load();

  // ------- sections -------
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
    updateStats();
  }
  const firstVisibleSection = () =>
    $(".menu-item.active")?.dataset.section || "dashboard";

  // ------- simple table helpers -------
  function emptyRow(cols, text) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-empty", "1");
    tr.innerHTML = `<td colspan="${cols}" style="text-align:center; padding: 20px 0; color:#7f8c8d;">${esc(
      text
    )}</td>`;
    return tr;
  }
  function wipeTbody(tbody, cols, textIfEmpty) {
    tbody.innerHTML = "";
    tbody.appendChild(emptyRow(cols, textIfEmpty));
  }

  // ------- DASHBOARD -------
  function updateStats() {
    $("#total-courses") &&
      ($("#total-courses").textContent = state.courses.length);
    $("#total-bookmarks") &&
      ($("#total-bookmarks").textContent = state.bookmarks.length);
    $("#total-playlists") &&
      ($("#total-playlists").textContent = state.playlists.length);

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
          li.innerHTML = `<strong>${esc(
            a.text
          )}</strong><br/><small style="color:#7f8c8d">${esc(a.ts)}</small>`;
          ul.appendChild(li);
        });
        actBox.appendChild(ul);
      }
    }
  }

  // ------- RENDERERS -------
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
        <td>${esc(item.id.slice(-6))}</td>
        <td>${esc(item.title)}</td>
        <td>${esc(item.type || "")}</td>
        <td>${esc(item.status || "Draft")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="home"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger"  data-action="delete" data-entity="home"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

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
        <td>${esc(c.id.slice(-6))}</td>
        <td>${esc(c.title)}</td>
        <td>${esc(c.instructor || "")}</td>
        <td>${esc(c.category || "")}</td>
        <td>${esc(c.status || "Draft")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="courses"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger"  data-action="delete" data-entity="courses"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

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
        <td>${esc(b.id.slice(-6))}</td>
        <td>${esc(b.title)}</td>
        <td><a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(
        b.url
      )}</a></td>
        <td>${esc(b.category || "")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="bookmarks"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger"  data-action="delete" data-entity="bookmarks"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

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
        <td>${esc(p.id.slice(-6))}</td>
        <td>${esc(p.title)}</td>
        <td>${esc(p.description || "")}</td>
        <td>${Number(p.items || 0)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="playlists"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger"  data-action="delete" data-entity="playlists"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function renderShorts() {
    const tbody = $("#shorts-list");
    if (!tbody) return;
    if (!state.shorts.length) return wipeTbody(tbody, 6, "No shorts added yet");
    tbody.innerHTML = "";
    state.shorts.forEach((s) => {
      const tr = document.createElement("tr");
      tr.dataset.id = s.id;
      tr.innerHTML = `
        <td>${esc(s.id.slice(-6))}</td>
        <td>${esc(s.title)}</td>
        <td>${esc(s.thumbnail || "")}</td>
        <td>${esc(s.duration || "")}</td>
        <td>${Number(s.views || 0)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="shorts"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger"  data-action="delete" data-entity="shorts"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

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
        <td>${esc(w.id.slice(-6))}</td>
        <td>${esc(w.name)}</td>
        <td><a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(
        w.url
      )}</a></td>
        <td>${esc(w.category || "")}</td>
        <td>${esc(w.status || "Active")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" data-action="edit" data-entity="websites"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger"  data-action="delete" data-entity="websites"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  const rerender = (entity) =>
    ({
      home: renderHome,
      courses: renderCourses,
      bookmarks: renderBookmarks,
      playlists: renderPlaylists,
      shorts: renderShorts,
      websites: renderWebsites,
    }[entity]?.());

  // ------- Modal styles (injected once) -------
  function injectModalStylesOnce() {
    if (document.getElementById("admin-modal-styles")) return;
    const style = document.createElement("style");
    style.id = "admin-modal-styles";
    style.textContent = `
      body.modal-open { overflow: hidden; }
      .modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,.45);
        display: grid; place-items: center; z-index: 9999; padding: 16px;
      }
      .modal-card {
        width: min(720px, 100%); background: #fff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.25);
        display: flex; flex-direction: column; max-height: min(88vh, 100%); overflow: hidden;
      }
      .modal-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; border-bottom:1px solid #eee; }
      .modal-head h3 { margin:0; font-size: 18px; }
      .modal-close { border:none; background:transparent; cursor:pointer; padding:6px; font-size: 16px; }
      .modal-form { display:flex; flex-direction:column; min-height:0; }
      .modal-body {
        padding: 16px 20px; overflow: auto; /* <= gives a scrollbar for long forms */
        display: grid; gap: 12px;
      }
      .modal-foot { display:flex; gap:10px; justify-content:flex-end; padding: 14px 20px; border-top:1px solid #eee; }
      .form-group label { display:block; margin-bottom:6px; font-weight:600; }
      .form-control {
        width: 100%; padding: 10px 12px; border:1px solid #ddd; border-radius:8px; font-size:14px;
      }
      .form-control:focus { outline:none; border-color:#4a90e2; box-shadow: 0 0 0 3px rgba(74,144,226,.15); }
      .btn { padding: 9px 14px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
      .btn-ghost { background: transparent; border:1px solid #eee; color:#333; }
      .btn-primary { background:#4a90e2; color:#fff; }
      .btn-danger { background:#e74c3c; color:#fff; }
      .form-error { background:#fee; color:#b00; border:1px solid #f88; padding:10px 12px; border-radius:8px; margin-bottom:10px; }
    `;
    document.head.appendChild(style);
  }

  // ------- MODAL UI -------
  const modalRoot = $("#modal-container");
  function openModal({ title, fields, values = {}, onSubmit }) {
    injectModalStylesOnce();

    const id = "modal-" + uid();
    modalRoot.innerHTML = `
      <div class="modal-backdrop" id="${id}">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
          <div class="modal-head">
            <h3 id="${id}-title">${esc(title)}</h3>
            <button class="modal-close" aria-label="Close"><i class="fas fa-times"></i></button>
          </div>
          <form class="modal-form">
            <div class="modal-body">
              ${fields.map(renderField(values)).join("")}
            </div>
            <div class="modal-foot">
              <button type="button" class="btn btn-ghost btn-danger modal-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // lock background scroll
    document.body.classList.add("modal-open");

    const wrap = $("#" + id);
    const close = () => {
      modalRoot.innerHTML = "";
      document.body.classList.remove("modal-open");
    };

    on(wrap.querySelector(".modal-close"), "click", close);
    on(wrap.querySelector(".modal-cancel"), "click", close);
    on(wrap, "click", (e) => {
      if (e.target === wrap) close();
    });

    const form = wrap.querySelector("form.modal-form");
    on(form, "submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      fields.forEach((f) => {
        if (f.type === "number") data[f.name] = Number(data[f.name] || 0);
        if (f.type === "checkbox") data[f.name] = form.elements[f.name].checked;
      });
      const err = onSubmit?.(data);
      if (!err) close();
      else showFormError(form, err);
    });
  }

  function renderField(values) {
    return (f) => {
      const v = values[f.name] ?? f.default ?? "";
      const hint = f.hint
        ? `<small class="field-hint" style="color:#7f8c8d">${esc(
            f.hint
          )}</small>`
        : "";
      const required = f.required ? "required" : "";
      const common = `name="${esc(f.name)}" id="f-${esc(
        f.name
      )}" class="form-control" ${required}`;
      if (f.type === "select") {
        const opts = (f.options || [])
          .map((o) => {
            const [val, label] = Array.isArray(o) ? o : [o, o];
            const sel = String(v) === String(val) ? "selected" : "";
            return `<option value="${esc(val)}" ${sel}>${esc(label)}</option>`;
          })
          .join("");
        return `<div class="form-group"><label for="f-${esc(f.name)}">${esc(
          f.label
        )}</label><select ${common}>${opts}</select>${hint}</div>`;
      }
      if (f.type === "textarea") {
        return `<div class="form-group"><label for="f-${esc(f.name)}">${esc(
          f.label
        )}</label><textarea ${common} rows="${f.rows || 4}">${esc(
          v
        )}</textarea>${hint}</div>`;
      }
      return `<div class="form-group"><label for="f-${esc(f.name)}">${esc(
        f.label
      )}</label><input type="${esc(f.type || "text")}" ${common} value="${esc(
        v
      )}" placeholder="${esc(f.placeholder || "")}" />${hint}</div>`;
    };
  }

  function showFormError(form, msg) {
    let box = form.querySelector(".form-error");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-error";
      form.prepend(box);
    }
    box.textContent = msg;
  }

  // ------- CRUD with modal forms -------
  const forms = {
    home: [
      { name: "title", label: "Title", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["banner", "card", "section"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Published", "Draft"],
        default: "Published",
      },
    ],
    courses: [
      {
        name: "title",
        label: "Course Title",
        required: true,
        placeholder: "e.g. Intro to Web Dev",
      },
      { name: "instructor", label: "Instructor", placeholder: "e.g. Jane Doe" },
      {
        name: "category",
        label: "Category",
        placeholder: "e.g. Web Development",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Published", "Draft"],
        default: "Published",
      },
      { name: "image", label: "Image URL (optional)" },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
    ],
    bookmarks: [
      { name: "title", label: "Title", required: true },
      {
        name: "url",
        label: "URL",
        required: true,
        placeholder: "https://example.com",
      },
      { name: "category", label: "Category", placeholder: "General" },
    ],
    playlists: [
      { name: "title", label: "Playlist Title", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "items", label: "Items", type: "number", default: 0 },
      { name: "category", label: "Category (optional)" },
    ],
    shorts: [
      { name: "title", label: "Short Title", required: true },
      { name: "thumbnail", label: "Thumbnail URL" },
      { name: "duration", label: "Duration (MM:SS)", placeholder: "00:30" },
      { name: "creator", label: "Creator" },
      { name: "views", label: "Views", type: "number", default: 0 },
      { name: "likes", label: "Likes", type: "number", default: 0 },
      { name: "comments", label: "Comments", type: "number", default: 0 },
    ],
    websites: [
      { name: "name", label: "Website Name", required: true },
      {
        name: "url",
        label: "URL",
        required: true,
        placeholder: "https://example.com",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          "education",
          "productivity",
          "development",
          "design",
          "other",
        ],
        default: "education",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
        default: "Active",
      },
      { name: "description", label: "Description", type: "textarea" },
    ],
  };

  function addItem(entity) {
    openModal({
      title: `Add ${
        entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, "")
      }`,
      fields: forms[entity],
      onSubmit: (data) => {
        if (entity === "courses" && !data.title)
          return "Please enter a course title.";
        if (
          entity === "websites" &&
          data.url &&
          !/^https?:\/\//i.test(data.url)
        )
          data.url = "https://" + data.url;
        const id = uid();
        const toPush = { id, ...data };
        state[entity].push(toPush);
        pushActivity(
          state,
          `Added ${entity.slice(0, 1).toUpperCase() + entity.slice(1)}: ${
            toPush.title || toPush.name || id.slice(-6)
          }`
        );
        save(state);
        rerender(entity);
        updateStats();
      },
    });
  }

  // robust id resolver (supports suffix shown in first column)
  function resolveId(entity, maybeId) {
    const list = state[entity] || [];
    return (
      list.find((x) => x.id === maybeId)?.id ||
      list.find((x) => (x.id || "").endsWith(String(maybeId)))?.id ||
      null
    );
  }

  function editItem(entity, idMaybe) {
    const id = resolveId(entity, idMaybe);
    if (!id) return;
    const list = state[entity];
    const obj = list.find((x) => x.id === id);
    if (!obj) return;

    openModal({
      title: `Edit ${entity.slice(0, 1).toUpperCase() + entity.slice(1)}`,
      fields: forms[entity],
      values: obj,
      onSubmit: (data) => {
        if (
          entity === "websites" &&
          data.url &&
          !/^https?:\/\//i.test(data.url)
        )
          data.url = "https://" + data.url;
        const idx = list.findIndex((x) => x.id === id);
        list[idx] = { ...obj, ...data, id };
        pushActivity(
          state,
          `Edited ${entity.slice(0, 1).toUpperCase() + entity.slice(1)}: ${
            obj.title || obj.name || id.slice(-6)
          }`
        );
        save(state);
        rerender(entity);
        updateStats();
      },
    });
  }

  function deleteItem(entity, idMaybe, rowEl) {
    const list = state[entity] || [];
    const id = resolveId(entity, idMaybe);
    if (!id) return;
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
    rowEl?.remove();
    rerender(entity);
    updateStats();
  }

  // ------- wiring -------
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
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const row = btn.closest("tr");
      const table = btn.closest("table");
      if (!table) return;

      let entity = btn.dataset.entity;
      if (!entity) {
        const id = table.querySelector("tbody")?.id || "";
        if (id.includes("courses")) entity = "courses";
        else if (id.includes("bookmarks")) entity = "bookmarks";
        else if (id.includes("playlists")) entity = "playlists";
        else if (id.includes("shorts")) entity = "shorts";
        else if (id.includes("websites")) entity = "websites";
        else if (id.includes("home")) entity = "home";
      }
      if (!entity) return;

      const action = btn.dataset.action;
      const idVal =
        row?.dataset?.id || row?.querySelector("td")?.textContent?.trim();
      if (!idVal) return;

      if (action === "edit") editItem(entity, idVal);
      if (action === "delete") deleteItem(entity, idVal, row);
    });
  }

  // ------- boot -------
  document.addEventListener("DOMContentLoaded", () => {
    wireSidebar();
    wireAddButtons();
    wireTableActions();

    renderHome();
    renderCourses();
    renderBookmarks();
    renderPlaylists();
    renderShorts();
    renderWebsites();
    updateStats();

    showSection(firstVisibleSection());
  });
})();
