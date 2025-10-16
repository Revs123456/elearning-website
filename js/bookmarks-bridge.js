(function () {
  // Inject minimal CSS once
  if (!document.getElementById("elearn-bookmark-css")) {
    const s = document.createElement("style");
    s.id = "elearn-bookmark-css";
    s.textContent = `
      .bookmark-toggle{
        position:absolute; top:10px; right:10px; z-index:5;
        background: rgba(0,0,0,.55); color:#fff; border:none;
        width:38px; height:38px; display:flex; align-items:center; justify-content:center;
        border-radius:50%; cursor:pointer; transition:transform .15s ease, background .15s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,.25);
      }
      .bookmark-toggle:hover{ transform:scale(1.06); background: rgba(0,0,0,.7); }
      .bookmark-toggle .far, .bookmark-toggle .fas { pointer-events:none; }
      .bookmarked .bookmark-toggle{ background:#49bbbd; }
    `;
    document.head.appendChild(s);
  }

  const KEY = "elearn_admin_state_v1";

  function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function now() {
    return new Date().toLocaleString();
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      const base = {
        home: [],
        courses: [],
        bookmarks: [],
        playlists: [],
        shorts: [],
        websites: [],
        activity: [],
      };
      return raw ? { ...base, ...JSON.parse(raw) } : base;
    } catch {
      return {
        home: [],
        courses: [],
        bookmarks: [],
        playlists: [],
        shorts: [],
        websites: [],
        activity: [],
      };
    }
  }

  function saveState(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  function pushActivity(s, text) {
    s.activity.unshift({ id: uid(), text, ts: now() });
    s.activity = s.activity.slice(0, 30);
  }

  function makeBookmarkKey(b) {
    // normalize identity across types
    return [
      b.source || "",
      b.sourceId || "",
      b.url || "",
      b.title || "",
      b.category || "",
    ]
      .join("::")
      .toLowerCase();
  }

  function isBookmarked(state, b) {
    const key = makeBookmarkKey(b);
    return state.bookmarks.some((x) => makeBookmarkKey(x) === key);
  }

  function addBookmark(b) {
    const state = loadState();
    if (!isBookmarked(state, b)) {
      const item = {
        id: uid(),
        title: b.title || "Untitled",
        url: b.url || "",
        category: b.category || "General",
        // extras for your use:
        source: b.source || "",
        sourceId: b.sourceId || "",
        thumbnail: b.thumbnail || "",
        addedAt: now(),
      };
      state.bookmarks.unshift(item);
      pushActivity(state, `Bookmarked: ${item.title}`);
      saveState(state);
      // notify other tabs/pages
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: KEY,
          newValue: JSON.stringify(state),
        })
      );
    }
  }

  function removeBookmark(b) {
    const state = loadState();
    const key = makeBookmarkKey(b);
    const before = state.bookmarks.length;
    state.bookmarks = state.bookmarks.filter((x) => makeBookmarkKey(x) !== key);
    if (state.bookmarks.length !== before) {
      pushActivity(state, `Removed bookmark: ${b.title || b.url || "Item"}`);
      saveState(state);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: KEY,
          newValue: JSON.stringify(state),
        })
      );
    }
  }

  function toggleBookmark(b) {
    const state = loadState();
    if (isBookmarked(state, b)) {
      removeBookmark(b);
      return false;
    } else {
      addBookmark(b);
      return true;
    }
  }

  /**
   * Append a floating bookmark button inside a card/container.
   * @param {HTMLElement} cardEl - container element (positioned ancestor).
   * @param {Object} meta - {source, sourceId, title, url, category, thumbnail}
   */
  function appendBookmarkButton(cardEl, meta) {
    if (!cardEl) return;
    // ensure the card can anchor absolutely
    const computed = getComputedStyle(cardEl);
    if (computed.position === "static") {
      cardEl.style.position = "relative";
    }

    // avoid duplicating button
    if (cardEl.querySelector(".bookmark-toggle")) return;

    const btn = document.createElement("button");
    btn.className = "bookmark-toggle";
    btn.type = "button";
    btn.innerHTML = `<i class="far fa-bookmark"></i>`;
    cardEl.appendChild(btn);

    // initial state
    if (isBookmarked(loadState(), meta)) {
      btn.innerHTML = `<i class="fas fa-bookmark"></i>`;
      cardEl.classList.add("bookmarked");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const nowBookmarked = toggleBookmark(meta);
      if (nowBookmarked) {
        btn.innerHTML = `<i class="fas fa-bookmark"></i>`;
        cardEl.classList.add("bookmarked");
      } else {
        btn.innerHTML = `<i class="far fa-bookmark"></i>`;
        cardEl.classList.remove("bookmarked");
      }
    });
  }

  // Expose globally
  window.ElearnBookmarks = {
    appendBookmarkButton,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
})();
