/* Qaraj web app — bootstrap, routing table, global event delegation, modals. */
(function (Q) {
  const D = Q.data;
  let draft = null;            // ephemeral modal state
  const modalRoot = () => document.getElementById("modal-root");

  /* ---------- Routes ---------- */
  Q.router.add("/signin", Q.views.signin);
  Q.router.add("/", Q.views.home);
  Q.router.add("/search", Q.views.results);
  Q.router.add("/map", Q.views.results);      // list + map are one page now
  Q.router.add("/space/:id", Q.views.detail);
  Q.router.add("/saved", Q.views.saved);
  Q.router.add("/trips", Q.views.trips);
  Q.router.add("/profile", Q.views.profile);
  Q.router.setNotFound(Q.views.home);

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1700);
  }

  function closeMenu() { document.querySelectorAll(".menu-pop.open").forEach(m => m.classList.remove("open")); }

  /* ---------- Modals ---------- */
  // reopen=true swaps the contents of an already-open sheet (no re-entry animation)
  function openModal(inner, reopen) {
    const live = reopen && modalRoot().querySelector(".overlay.open");
    if (live) { live.innerHTML = inner; return; }
    modalRoot().innerHTML = '<div class="overlay">' + inner + '</div>';
    const ov = modalRoot().firstChild;
    requestAnimationFrame(() => ov.classList.add("open"));
  }
  function closeModal() {
    const ov = modalRoot().firstChild;
    if (!ov) return;
    ov.classList.remove("open");
    setTimeout(() => { modalRoot().innerHTML = ""; }, 180);
    draft = null;
    // the filter modules own their working copy only while the sheet is up
    Q.filters.unmount(); Q.space.unmount(); Q.sklad.unmount();
  }


  /* ----- Search dropdown: anchored under the bar, re-rendered on every change ----- */
  function searchHost() { return document.querySelector(".searchpop-host"); }
  function renderSearch() {
    const host = searchHost();
    if (!host) return;
    host.innerHTML = Q.c.searchPop(draft);
    // grey out the bar and lift the segment that owns the open panel
    document.querySelectorAll(".searchpill, .home-bar").forEach(p => {
      p.classList.add("searching");
      p.querySelectorAll("[data-panel]").forEach(sg => sg.classList.toggle("active", sg.dataset.panel === draft.panel));
    });
    document.body.classList.add("search-open");
    requestAnimationFrame(() => {
      const el = host.firstChild;
      if (!el) return;
      el.classList.add("in");
      // The hero bar sits mid-page, so a tall panel (the calendar) hangs below
      // the fold. "nearest" scrolls only as far as it takes to show the whole
      // panel, and does nothing when it already fits. Smoothness comes from
      // html{scroll-behavior}, which the reduced-motion query turns off.
      el.scrollIntoView({ block: "nearest" });
    });
    refreshSearchCount();
    if (draft.panel === "where") {
      const inp = document.getElementById("qPlace");
      if (inp) { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
                 inp.setSelectionRange(inp.value.length, inp.value.length); }
    }
  }
  function closeSearch() {
    const host = searchHost();
    if (host) host.innerHTML = "";
    document.querySelectorAll(".searchpill, .home-bar").forEach(p => {
      p.classList.remove("searching");
      p.querySelectorAll("[data-panel]").forEach(sg => sg.classList.remove("active"));
    });
    document.body.classList.remove("search-open");
    if (draft && draft.kind === "search") draft = null;
  }
  function searchOpen() { const h = searchHost(); return !!(h && h.firstChild); }
  /* Counts against the category being picked in the sheet, not the stored one,
     and through each category's own filter set so it agrees with the results. */
  function refreshSearchCount() {
    const el = document.getElementById("scount");
    if (!el || !draft || draft.kind !== "search") return;
    const s = Q.store.get(), cat = draft.category || s.category, place = draft.place;
    let n;
    if (cat === "garage") n = D.garageResults(s.garage, place).length;
    else if (cat === "ploshad") n = D.spaceResults(s.space, place).length;
    else if (cat === "sklad") n = D.skladResults(s.sklad, place).length;
    else {
      const f = s.filters;
      n = D.listings.filter(l => l.category === cat && D.placeMatches(l, place) &&
        l.sizeM2 >= f.minM2 && D.monthly(l) <= f.priceMax &&
        (!f.amenities.length || f.amenities.every(a => l.amenities.indexOf(a) !== -1))).length;
    }
    el.textContent = "· " + n + " " + placesWord(n);
  }

  /* ---------- afterRender hook ---------- */
  function afterRender(path) {
    document.title = titleFor(path);
    // the router replaces #app wholesale, taking any open search dropdown with it
    document.body.classList.remove("search-open");
    if (draft && draft.kind === "search") draft = null;
    if (path === "/") {
      const form = document.getElementById("homeSearch");
      if (form) form.addEventListener("submit", (e) => { e.preventDefault(); submitHome(); });
      wireSubscribe();
    }
    if (path === "/signin") {
      const form = document.getElementById("signinForm");
      if (form) form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const pass = document.getElementById("pass").value;
        if (Q.store.login(email, pass)) { location.hash = "/"; }
        else document.getElementById("loginErr").classList.add("show");
      });
    }
    mountMap();
  }

  /* Called by a filter module's «Показать» once it has committed to the store:
     close the sheet and repaint the results underneath it. */
  function applyFilters() {
    closeModal();
    const path = Q.router.path();
    if (path === "/search" || path === "/map") Q.router.resolve();
    else Q.router.navigate("#/search");
  }

  /* ---------- Footer subscribe ----------
     Posts to the same Formspree endpoint as the landing page and reports back
     in the note under the field. Mirrors index.html's email-capture handler. */
  function wireSubscribe() {
    const form = document.getElementById("footSubForm");
    const note = document.getElementById("footSubNote");
    if (!form || !note) return;
    const email = document.getElementById("footSubEmail");
    const set = (msg, cls) => { note.className = "fs-note" + (cls ? " " + cls : ""); note.textContent = msg; };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = (email.value || "").trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) { set("Введите корректный email.", "err"); email.focus(); return; }
      set("Отправляем…", "");
      fetch(form.getAttribute("action"), { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(r => {
          if (r.ok) { set("Спасибо! Вы подписаны. ✅", "ok"); form.reset(); }
          else set("Не удалось отправить. Попробуйте ещё раз.", "err");
        })
        .catch(() => set("Ошибка сети. Попробуйте позже.", "err"));
    });
  }

  /* ---------- Map: drag to pan, wheel or buttons to zoom ----------
     The stage carries the transform; pins sit inside it but are counter-scaled
     through --pinz so their labels keep one size at every zoom level. */
  // 1 is "fits the pane": zooming out past it would show gaps at the edges
  const MAP_Z = { min: 1, max: 4 };
  let mapT = { x: 0, y: 0, z: 1 };
  function mapStage() { return document.getElementById("mapStage"); }
  function applyMapT() {
    const st = mapStage();
    if (!st) return;
    st.style.transform = "translate(" + mapT.x + "px," + mapT.y + "px) scale(" + mapT.z + ")";
    st.style.setProperty("--pinz", 1 / mapT.z);
  }
  /* Keep the stage covering the pane: at zoom z it may slide by half the
     overhang, so the background never shows through at the edges. */
  function clampMapT() {
    const pane = document.getElementById("mapPane");
    if (!pane) return;
    const over = (n) => Math.max(0, (n * mapT.z - n) / 2);
    const mx = over(pane.clientWidth), my = over(pane.clientHeight);
    mapT.x = Math.max(-mx, Math.min(mx, mapT.x));
    mapT.y = Math.max(-my, Math.min(my, mapT.y));
  }
  /* Zoom about a point given relative to the pane's centre (0,0 = centre). */
  function zoomMap(factor, cx, cy) {
    const z = Math.max(MAP_Z.min, Math.min(MAP_Z.max, mapT.z * factor));
    if (z === mapT.z) return;
    const k = z / mapT.z;
    mapT.x = cx - (cx - mapT.x) * k;
    mapT.y = cy - (cy - mapT.y) * k;
    mapT.z = z;
    clampMapT(); applyMapT();
  }
  function mountMap() {
    const pane = document.getElementById("mapPane");
    if (!pane) { Q.ymap.detach(); return; }
    mapT = { x: 0, y: 0, z: 1 };
    applyMapT();
    // when a Yandex key is configured the real map takes over this pane and
    // brings its own drag/zoom; the handlers below stay for the fallback
    Q.ymap.mount(Q.store.filtered());

    pane.addEventListener("wheel", (e) => {
      if (Q.ymap.live()) return;             // the real map does its own zooming
      e.preventDefault();
      const r = pane.getBoundingClientRect();
      zoomMap(Math.pow(0.9985, e.deltaY), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    }, { passive: false });

    // drag anywhere on the pane; a drag that moved swallows the pin click
    let drag = null;
    pane.addEventListener("pointerdown", (e) => {
      if (Q.ymap.live() || e.button !== 0 || e.target.closest(".map-ctl")) return;
      drag = { x: e.clientX, y: e.clientY, ox: mapT.x, oy: mapT.y, moved: false };
      pane.setPointerCapture(e.pointerId);
      pane.classList.add("grabbing");
    });
    pane.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      mapT.x = drag.ox + dx; mapT.y = drag.oy + dy;
      clampMapT(); applyMapT();
    });
    const end = () => {
      if (drag && drag.moved) pane.dataset.dragged = "1";
      drag = null; pane.classList.remove("grabbing");
    };
    pane.addEventListener("pointerup", end);
    pane.addEventListener("pointercancel", end);
  }
  function titleFor(path) {
    const map = { "/signin": "Вход — Qaraj", "/": "Qaraj — аренда места для хранения",
                  "/search": "Поиск — Qaraj", "/map": "Карта — Qaraj",
                  "/saved": "Избранное — Qaraj", "/trips": "Заявки — Qaraj", "/profile": "Профиль — Qaraj" };
    if (path.indexOf("/space/") === 0) { const l = D.listings.find(x => x.id === path.split("/")[2]); return (l ? l.title : "Объявление") + " — Qaraj"; }
    return map[path] || "Qaraj";
  }
  function placesWord(n) { const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "место"; if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "места"; return "мест"; }

  /* Dates picked in the dropdown are committed as they are clicked — like the
     place picker — so the hero bar and the store never drift apart. The bar's
     label is patched in place rather than re-rendered, keeping the panel open. */
  function commitDates(from, to) {
    Q.store.set({ query: Object.assign({}, Q.store.get().query,
                                       { dateISO: from, dateEndISO: to }), selectedId: null });
    // a filter page open behind the dropdown mirrors these dates — keep it in step
    Q.filters.syncDates(); Q.space.syncDates(); Q.sklad.syncDates();
    const btn = document.querySelector(".hb-when");
    if (!btn) return;
    btn.classList.toggle("filled", !!from);
    const lbl = document.getElementById("hbWhen");
    if (lbl) lbl.textContent = Q.c.whenLabel(Q.store.get().query) || "Когда";
  }

  /* The hero search: place and dates are already committed, so this just goes to
     the results. Every category's filters default to "no limit", so the first
     screen is the full list for the category and the filter page is a step the
     user takes when they want it (via Фильтры), not a toll gate before results. */
  function submitHome() {
    // no free-text field on the bar any more; drop a query left by an older session
    Q.store.set({ query: Object.assign({}, Q.store.get().query, { q: "" }), selectedId: null });
    Q.router.navigate("#/search");
  }

  /* ---------- Global click delegation ---------- */
  document.addEventListener("click", (e) => {
    // close modal when clicking the dimmed overlay itself
    if (e.target.classList && e.target.classList.contains("overlay")) { closeModal(); return; }
    // close the account dropdown / search dropdown when clicking outside them
    if (!e.target.closest(".usermenu-wrap")) closeMenu();
    if (!e.target.closest(".searchbox") && searchOpen()) closeSearch();
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const a = t.dataset.action;

    switch (a) {
      case "noop": e.preventDefault(); toast("Недоступно в демо-версии"); break;
      case "nav": e.preventDefault(); Q.router.navigate(t.dataset.route); break;
      case "toggle-menu": {
        const pop = t.closest(".usermenu-wrap").querySelector(".menu-pop");
        pop.classList.toggle("open");
        break;
      }
      case "menu-help": closeMenu(); toast("Справочный центр — демо"); break;
      case "menu-host": closeMenu(); Q.router.navigate("#/host"); break;
      case "menu-cohost": closeMenu(); toast("Со-хозяева — демо-функция"); break;
      case "menu-gift": closeMenu(); toast("Подарочные карты — демо-функция"); break;
      case "menu-signup": closeMenu(); Q.router.navigate("#/signup"); break;
      case "menu-login": closeMenu(); Q.store.logout(); location.hash = "/signin"; Q.router.resolve(); break;
      case "login-demo": Q.store.loginDemo(); location.hash = "/"; break;
      case "logout": Q.store.logout(); location.hash = "/signin"; Q.router.resolve(); break;

      case "cat":
        Q.store.set({ category: t.dataset.cat, selectedId: null });
        Q.router.resolve();
        break;
      /* Quick filter chip in the results filter row — the scope says which of
         the three filter sets in the store owns it. */
      case "qfeat": {
        const s = Q.store.get(), id = t.dataset.id, scope = t.dataset.scope;
        const set = scope === "garage" ? Object.assign({}, s.garage, { features: s.garage.features.slice() })
                  : scope === "space"  ? Object.assign({}, s.space,  { features: s.space.features.slice() })
                  : scope === "sklad"  ? Object.assign({}, s.sklad,  { features: s.sklad.features.slice() })
                  :                      Object.assign({}, s.filters, { amenities: s.filters.amenities.slice() });
        const arr = scope === "amen" ? set.amenities : set.features;
        const i = arr.indexOf(id);
        if (i === -1) arr.push(id); else arr.splice(i, 1);
        Q.store.set(scope === "garage" ? { garage: set, selectedId: null }
                  : scope === "space"  ? { space: set, selectedId: null }
                  : scope === "sklad"  ? { sklad: set, selectedId: null }
                  :                      { filters: set, selectedId: null });
        Q.router.resolve();
        break;
      }

      case "open": e.preventDefault(); Q.router.navigate("#/space/" + t.dataset.id); break;

      case "fav": {
        e.preventDefault(); e.stopPropagation();
        const id = t.dataset.id, on = Q.store.toggleFav(id);
        document.querySelectorAll('.card .fav[data-id="' + id + '"]').forEach(b => b.classList.toggle("on", on));
        if (Q.router.current() === "/saved") Q.router.resolve();
        else if (Q.router.current().indexOf("/space/") === 0) Q.router.resolve();
        toast(on ? "Добавлено в избранное" : "Убрано из избранного");
        break;
      }

      case "map-zoom": {
        const d = t.dataset.d === "1" ? 1 : -1;
        if (!Q.ymap.zoomBy(d)) zoomMap(d === 1 ? 1.45 : 1 / 1.45, 0, 0);
        break;
      }
      case "map-reset":
        // back to "everything in view" on the real map, 1:1 on the fallback
        if (!Q.ymap.fit(Q.store.filtered())) { mapT = { x: 0, y: 0, z: 1 }; applyMapT(); }
        break;

      case "pin": {
        // a pin click that ended a map drag is the drag, not a selection
        const pane = document.getElementById("mapPane");
        if (pane && pane.dataset.dragged) { delete pane.dataset.dragged; break; }
        const id = t.dataset.id;
        Q.store.get().selectedId = id;
        document.querySelectorAll(".pin").forEach(p => p.classList.toggle("sel", p.dataset.pinid === id));
        document.querySelectorAll(".card").forEach(cd => cd.classList.toggle("sel", cd.dataset.pinid === id));
        const card = document.querySelector('.card[data-pinid="' + id + '"]');
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }

      /* ----- Search dropdown ----- */
      case "open-search": {
        const panel = t.dataset.panel || "where";
        if (draft && draft.kind === "search" && searchOpen()) {
          // already open — just move to the panel the user clicked
          if (draft.panel === panel) { closeSearch(); break; }
          draft.panel = panel; renderSearch(); break;
        }
        const q = Q.store.get().query;
        const anchor = q.dateISO ? D.fromISO(q.dateISO) : D.today();
        draft = {
          kind: "search", panel: panel,
          place: Q.store.place(), placeQuery: "",
          category: Q.store.get().category,
          dateISO: q.dateISO || null, dateEndISO: q.dateEndISO || null,
          calYear: anchor.getFullYear(), calMonth: anchor.getMonth(),
        };
        renderSearch();
        break;
      }
      case "pick-place": {
        const p = D.places.find(x => x.id === t.dataset.id);
        if (!p) break;
        draft.place = p; draft.placeQuery = "";
        Q.store.set({ query: Object.assign({}, Q.store.get().query, { place: p }), selectedId: null });
        closeSearch();
        // on the hero, relabel in place so the typed query survives; elsewhere re-render
        const lbl = document.getElementById("hbLoc");
        if (lbl) lbl.textContent = p.name; else Q.router.resolve();
        break;
      }

      /* ----- Home hero ----- */
      /* Just move the selection: re-rendering the block would rebuild the three
         <img> tags and replay the hero's entry animation, which reads as the
         cards flashing on every pick. */
      case "home-cat": {
        Q.store.set({ category: t.dataset.cat, selectedId: null });
        document.querySelectorAll(".home-cat").forEach(b => {
          const on = b === t;
          b.classList.toggle("on", on);
          b.setAttribute("aria-checked", on);
        });
        break;
      }
      case "place-clear": draft.placeQuery = ""; renderSearch(); break;
      case "calnav": {
        if (!draft) break;
        const m = draft.calMonth + parseInt(t.dataset.d, 10);
        draft.calYear += Math.floor(m / 12);
        draft.calMonth = ((m % 12) + 12) % 12;
        if (draft.kind === "inquiry") openModal(Q.c.inquiryModal(D.listings.find(x => x.id === draft.id), draft), true);
        else renderSearch();
        break;
      }
      case "search-clear":
        draft = Object.assign({}, draft, { place: D.ANY_PLACE, placeQuery: "",
                                          dateISO: null, dateEndISO: null });
        commitDates(null, null);
        renderSearch();
        break;
      case "search-apply": {
        // The collapsed pill's magnifier is the only submit there is — the
        // dropdown has no button of its own. With the dropdown shut there is
        // nothing to commit, so a click would silently re-render the same
        // results and read as a dead button; open the panel instead.
        if (!searchOpen()) {
          const seg = document.querySelector('.searchpill [data-panel="where"], .home-bar [data-panel="where"]');
          if (seg) { seg.click(); break; }
        }
        if (draft && draft.kind === "search") {
          // the bar only owns place + category; dates and Срок are set elsewhere
          // (the per-category filter pages and the inquiry form) — carry them through
          Q.store.set({ query: Object.assign({}, Q.store.get().query, { place: draft.place }),
                        category: draft.category || Q.store.get().category,
                        selectedId: null });
        }
        closeSearch();
        const here = Q.router.path();
        if (here === "/search" || here === "/map") Q.router.resolve();
        else Q.router.navigate("#/search");
        break;
      }

      /* ----- Filter modal ----- */
      case "open-filters":
        openModal(Q.c.filterModal());
        break;
      case "filter-reset-all":
        Q.store.set({ garage: D.garageDefaults(), space: D.spaceDefaults(), sklad: D.skladDefaults(),
                      query: Object.assign({}, Q.store.get().query, { place: null }) });
        Q.router.resolve();
        break;

      /* ----- Inquiry modal ----- */
      case "open-inquiry": {
        e.preventDefault();
        const l = D.listings.find(x => x.id === t.dataset.id);
        const q = Q.store.get().query;
        const anchor = q.dateISO ? D.fromISO(q.dateISO) : D.today();
        draft = { kind: "inquiry", id: l.id, dateISO: q.dateISO || D.toISO(D.today()), term: q.term || "Месяц",
                  calYear: anchor.getFullYear(), calMonth: anchor.getMonth() };
        openModal(Q.c.inquiryModal(l, draft));
        break;
      }
      case "iterm": groupActive(t, "iterm"); draft.term = t.dataset.t; break;
      case "inquiry-send": {
        const l = D.listings.find(x => x.id === t.dataset.id);
        Q.store.addInquiry({ id: l.id, title: l.title, district: l.district,
                             date: D.dateLong(draft.dateISO), term: draft.term });
        closeModal(); toast("Заявка отправлена ✓"); Q.router.navigate("#/trips");
        break;
      }

      case "calday": {
        if (!draft) break;
        // the hero bar picks a range: first click sets the start, second the end
        if (draft.kind === "search") {
          const r = Q.kit.nextRange(draft.dateISO, draft.dateEndISO, t.dataset.date);
          draft.dateISO = r.fromISO; draft.dateEndISO = r.toISO;
          commitDates(r.fromISO, r.toISO);
          if (r.toISO) closeSearch(); else renderSearch();
          break;
        }
        // the inquiry form: a single move-in date
        draft.dateISO = t.dataset.date;
        const wrap = t.closest(".cal-wrap");
        if (wrap) wrap.outerHTML = Q.c.calBlock(draft.calYear, draft.calMonth, draft.dateISO, null, 1);
        break;
      }

      case "close-modal": closeModal(); break;
    }
  });

  function groupActive(el, group) {
    const box = el.closest('[data-group="' + group + '"]');
    if (box) box.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === el));
  }

  /* calendar days are spans with role="button" — give them Enter/Space */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target.closest && e.target.closest('[data-action="calday"]');
    if (!t) return;
    e.preventDefault();
    t.click();
  });

  /* place type-ahead — patch just the list so the input keeps focus + caret */
  document.addEventListener("input", (e) => {
    if (e.target.id !== "qPlace" || !draft) return;
    draft.placeQuery = e.target.value;
    const list = document.getElementById("placeList");
    if (list) list.innerHTML = Q.c.placeList(draft.placeQuery, draft.place.id);
    const lbl = list && list.previousElementSibling;
    if (lbl && lbl.classList.contains("sec-label")) lbl.textContent = draft.placeQuery ? "Совпадения" : "Популярные направления";
  });

  /* Enter in the place field picks the first suggestion */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.target.id !== "qPlace") return;
    e.preventDefault();
    const first = document.querySelector("#placeList .suggest");
    if (first) first.click();
  });

  /* Escape closes whichever overlay is up */
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSearch(); closeModal(); } });

  Q.app = { afterRender, toast, applyFilters };

  /* ---------- Boot ---------- */
  // Optional deep-link: /app/?demo=1 signs in the demo guest and skips the gate.
  try { if (new URLSearchParams(location.search).get("demo") === "1") Q.store.loginDemo(); } catch (e) {}
  Q.router.start();
})(window.Q = window.Q || {});
