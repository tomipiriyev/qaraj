/* Qaraj web app — «Поиск гаража»: the garage filter page (#/filters/garage).
   Reached instead of the results grid when you search in the Гараж category.

   State lives in three places, in this order of authority:
     1. `f`  — the working copy this module edits while the page is open
     2. the URL query (?veh=car&min=6000…) — written on every change, shareable
     3. Q.store.get().garage — committed on «Показать», so results and a later
        return to this page both see the same filters.
   Counts recompute on every interaction; only the touched nodes are repainted,
   so focus and the slider drag are never interrupted. */
(function (Q) {
  const D = Q.data, c = Q.c, ic = Q.c.ic, esc = Q.c.esc;

  let f = null;               // working filter set while the page is mounted

  /* ---------- URL <-> filter set ----------
     Move-in dates are the search bar's, not this page's, so they stay out. */
  const KEYS = { vehicle: "veh", parking: "park", priceMin: "min", priceMax: "max",
                 radiusKm: "km", sort: "sort" };
  function toQuery(v) {
    const q = {}, d = D.garageDefaults();
    Object.keys(KEYS).forEach(k => { if (v[k] && v[k] !== d[k]) q[KEYS[k]] = v[k]; });
    if (v.features.length) q.feat = v.features.join(",");
    if (v.nowOnly) q.now = "1";
    return q;
  }
  function fromQuery(q) {
    const v = D.garageDefaults();
    const num = (s, fb) => { const n = parseInt(s, 10); return isNaN(n) ? fb : n; };
    if (q.veh && D.vehicleTypes.some(t => t.id === q.veh)) v.vehicle = q.veh;
    if (q.park && D.parkingTypes.some(t => t.id === q.park)) v.parking = q.park;
    v.priceMin = clampPrice(num(q.min, v.priceMin));
    v.priceMax = clampPrice(num(q.max, v.priceMax));
    if (v.priceMin > v.priceMax) { const t = v.priceMin; v.priceMin = v.priceMax; v.priceMax = t; }
    if (q.km !== undefined && D.radiusOptions.some(r => r.km === num(q.km, -1))) v.radiusKm = num(q.km, 0);
    if (q.feat) v.features = q.feat.split(",").filter(x => D.garageFeatures.some(g => g.id === x));
    if (q.sort && D.sortOptions.some(s => s.id === q.sort)) v.sort = q.sort;
    v.nowOnly = q.now === "1";
    return v;
  }
  function clampPrice(n) {
    const P = D.GARAGE_PRICE;
    return Math.max(P.min, Math.min(P.max, Math.round(n / P.step) * P.step));
  }
  function syncURL() { Q.router.setQuery(toQuery(f)); }

  /* ---------- Live results ---------- */
  function results() { return D.garageResults(f, Q.store.place()); }
  function count() { return results().length; }
  function activeCount() { return D.garageActiveCount(f); }

  /* ---------- Sections ---------- */
  const section = (id, title, sub, body, extra) => Q.kit.section("gf", id, title, sub, body, extra);

  function vehicleCards() {
    return '<div class="gf-veh" role="radiogroup" aria-label="Тип транспорта">' +
      D.vehicleTypes.map(v => {
        const on = f.vehicle === v.id;
        return '<button type="button" class="gf-veh-card' + (on ? " on" : "") + '" role="radio" ' +
          'aria-checked="' + on + '" data-action="gf-veh" data-id="' + v.id + '">' +
          '<span class="gf-veh-art">' + ic(v.icon, 46, 1.5) + '</span>' +
          '<span class="gf-veh-name">' + v.label + '</span>' +
          '<span class="gf-veh-sub">' + v.sub + '</span>' +
          '<span class="gf-tick">' + ic("check", 13, 2.6) + '</span>' +
        '</button>';
      }).join("") + '</div>';
  }

  function parkingCards() {
    return '<div class="gf-park" role="radiogroup" aria-label="Тип парковки">' +
      D.parkingTypes.map(p => {
        const on = f.parking === p.id;
        return '<button type="button" class="gf-park-card' + (on ? " on" : "") + '" role="radio" ' +
          'aria-checked="' + on + '" data-action="gf-park" data-id="' + p.id + '">' +
          '<span class="gf-park-ic">' + ic(p.icon, 24, 1.7) + '</span>' +
          '<span class="gf-park-tx"><b>' + p.label + '</b><small>' + p.desc + '</small></span>' +
          '<span class="gf-tick">' + ic("check", 13, 2.6) + '</span>' +
        '</button>';
      }).join("") + '</div>';
  }

  const K = Q.kit, P = () => D.GARAGE_PRICE;
  function priceSlider() {
    return K.dualSlider({ ns: "gf", P: P(), lo: f.priceMin, hi: f.priceMax, bars: D.garageHistogram(24) });
  }
  function radiusChips()  { return K.radiusChips("gf", f.radiusKm); }
  function featureChips() { return K.featureChips("gf", D.garageFeatures, f.features); }
  function availability() {
    return K.availability({ ns: "gf", fromISO: f.fromISO, toISO: f.toISO });
  }
  /* Dates come from the search bar. Seed them on mount and refresh whenever the
     bar commits a new range (Q.app calls syncDates). */
  function readDates() {
    const q = Q.store.get().query;
    f.fromISO = q.dateISO || null;
    f.toISO = q.dateEndISO || null;
  }
  function syncDates() { if (!f) return; readDates(); repaintAvail(); afterChange(); }
  function sortSelect()   { return K.sortSelect("gf", D.sortOptions, f.sort); }

  function footBar() {
    const n = count(), a = activeCount();
    return '<div class="gf-foot"><div class="gf-foot-in">' +
      '<button type="button" class="btn btn-ghost gf-reset" data-action="gf-reset"' + (a ? "" : " disabled") + '>' +
        ic("rotate", 17, 1.9) + 'Сбросить' + (a ? ' <span class="gf-badge">' + a + '</span>' : "") + '</button>' +
      '<button type="button" class="btn btn-primary gf-show" data-action="gf-apply"' + (n ? "" : " disabled") + ' id="gfShow" aria-live="polite">' +
        (n ? "Показать " + n + " " + D.garagesWord(n) : "Ничего не найдено") + '</button>' +
    '</div></div>';
  }

  /* ---------- The page ---------- */
  function garageFilters() {
    f = fromQuery(Q.router.query());
    // an empty query means "carry on from wherever the user left off"
    if (!Object.keys(Q.router.query()).length) f = Object.assign(D.garageDefaults(), Q.store.get().garage);
    readDates();

    const place = Q.store.place();
    const where = place.kind === "any" ? "" : ' · ' + esc(place.name);
    return c.appbar("") +
      '<main class="gf">' +
        '<header class="gf-head">' +
          '<button type="button" class="gf-back" data-action="gf-back" aria-label="Назад">' + ic("arrowL", 20, 2) + '</button>' +
          '<div class="gf-head-tx"><h1>Поиск гаража</h1>' +
            '<p>Найдите подходящий гараж для вашего автомобиля' + where + '.</p></div>' +
          '<button type="button" class="gf-info" data-action="gf-info" aria-label="Как работают фильтры">' + ic("info", 20, 1.8) + '</button>' +
        '</header>' +

        section("veh", "Тип транспорта", "Подберём гараж по габаритам вашего авто.", vehicleCards()) +
        section("park", "Тип парковки", "Открытая площадка или закрытый бокс.", parkingCards()) +
        section("price", "Бюджет в месяц", "Выберите комфортную стоимость аренды в месяц.", priceSlider()) +
        section("dist", "Расстояние", "Радиус поиска от выбранного места.", radiusChips()) +
        section("feat", "Оснащение гаража", "Отметьте всё, что вам нужно.", featureChips()) +
        section("avail", "Доступность", "Когда планируете заехать?", availability(), K.nowSwitch("gf", f.nowOnly)) +
        section("sort", "Сортировка", "Как показать результаты.", sortSelect()) +

        '<div class="gf-foot-spacer"></div>' +
      '</main>' +
      // no mobile tab bar here: the page is a focused task with its own
      // sticky action bar, and two stacked bottom bars fight for the same space
      footBar();
  }

  /* ---------- Repaint helpers (surgical, never the whole page) ---------- */
  function repaint(sel, html) { const el = document.querySelector(sel); if (el) el.outerHTML = html; }
  function repaintFoot() {
    const bar = document.querySelector(".gf-foot");
    if (bar) bar.outerHTML = footBar();
  }
  function afterChange() { syncURL(); repaintFoot(); }

  function repaintPriceOut() { K.repaintSlider("gf", P(), f.priceMin, f.priceMax); }
  function repaintAvail() { repaint("#gfAvail", availability()); }

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action]");
    if (!t || !f) return;
    switch (t.dataset.action) {
      case "gf-back":
        if (history.length > 1) history.back(); else Q.router.navigate("#/");
        break;
      case "gf-info":
        Q.app.toast("Фильтры применяются сразу — счётчик внизу показывает, сколько гаражей подходит.");
        break;

      case "gf-veh": {                       // single select, click again to clear
        f.vehicle = f.vehicle === t.dataset.id ? null : t.dataset.id;
        repaint(".gf-veh", vehicleCards()); afterChange();
        break;
      }
      case "gf-park": {
        f.parking = f.parking === t.dataset.id ? null : t.dataset.id;
        repaint(".gf-park", parkingCards()); afterChange();
        break;
      }
      case "gf-radius": {
        f.radiusKm = parseInt(t.dataset.km, 10);
        t.parentNode.querySelectorAll(".gf-chip").forEach(b => {
          const on = b === t;
          b.classList.toggle("on", on); b.setAttribute("aria-checked", on);
        });
        afterChange();
        break;
      }
      case "gf-feat": {
        const id = t.dataset.id, i = f.features.indexOf(id);
        if (i === -1) f.features.push(id); else f.features.splice(i, 1);
        t.classList.toggle("on", i === -1); t.setAttribute("aria-pressed", i === -1);
        afterChange();
        break;
      }

      case "gf-reset": {
        f = D.garageDefaults();
        readDates();                         // the bar's dates survive a filter reset
        repaint(".gf-veh", vehicleCards());
        repaint(".gf-park", parkingCards());
        repaint("#gf-dist .gf-chips", radiusChips());
        repaint("#gf-feat .gf-chips", featureChips());
        repaintAvail();
        const lo = document.getElementById("gfMin"), hi = document.getElementById("gfMax");
        if (lo) lo.value = f.priceMin; if (hi) hi.value = f.priceMax;
        repaintPriceOut();
        const sort = document.getElementById("gfSort"); if (sort) sort.value = f.sort;
        const sw = document.querySelector(".gf-switch input"); if (sw) sw.checked = false;
        afterChange();
        Q.app.toast("Фильтры сброшены");
        break;
      }
      case "gf-apply": {
        Q.store.set({ category: "garage", garage: Object.assign({}, f), selectedId: null });
        Q.router.navigate("#/search");
        break;
      }
    }
  });

  /* range drag + select + checkbox */
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (!f || !t.dataset || !t.dataset.action) return;
    if (t.dataset.action === "gf-price") {
      const end = t.dataset.end;
      const v = K.clampHandle(end, parseInt(t.value, 10), f.priceMin, f.priceMax, P());
      if (end === "min") f.priceMin = v; else f.priceMax = v;
      if (String(v) !== t.value) t.value = v;
      repaintPriceOut(); afterChange();
    }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (!f || !t.dataset || !t.dataset.action) return;
    if (t.dataset.action === "gf-sort") { f.sort = t.value; afterChange(); }
    if (t.dataset.action === "gf-now") { f.nowOnly = t.checked; afterChange(); }
  });

  /* the page owns `f` only while it is mounted */
  function unmount() { f = null; }

  Q.filters = { garageFilters, unmount, syncDates };
  Q.views.garageFilters = garageFilters;
})(window.Q = window.Q || {});
