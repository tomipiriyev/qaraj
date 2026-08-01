/* Qaraj web app — «Поиск склада»: the Склад filter set.
   Supplies sections + footer bar for the Фильтры modal — see filters.js.

   Склад is a whole closed space let per space, so this page reads like the
   garage one: pick a kind, a heating type, then narrow by size, budget,
   distance and kit. The one section the garage page has no equivalent for is
   «Площадь помещения» — a garage is sized by the car that fits, a склад by its
   floor area — so it gets a range slider of its own alongside the budget.

   State layering (working copy → URL → store) and the shared section/slider/
   chip widgets are the same as the other two pages; see filterkit.js.

   Two slider namespaces: "kf" for the budget and "kfs" for the area, so the
   ids the kit generates (kfMin/kfsMin…) and the actions it fires (kf-price /
   kfs-price) stay distinct on one page. */
(function (Q) {
  const D = Q.data, c = Q.c, K = Q.kit, ic = Q.c.ic, esc = Q.c.esc;
  const P = () => D.SKLAD_PRICE, S = () => D.SKLAD_SIZE;

  let f = null;               // working filter set while the page is mounted

  const m2 = (n) => n + " м²";


  /* ---------- Live results ---------- */
  function results() { return D.skladResults(f, Q.store.place()); }
  function count() { return results().length; }
  function activeCount() { return D.skladActiveCount(f); }

  /* ---------- Sections ---------- */
  const section = (id, title, sub, body, extra) => K.section("kf", id, title, sub, body, extra);

  /* Same card shape as the garage page's «Тип транспорта». */
  function typeCards() {
    // reuses the garage page's card grid (.gf-veh); .kf-type is just the repaint hook
    return '<div class="gf-veh kf-type" role="radiogroup" aria-label="Тип помещения">' +
      D.skladTypes.map(t => {
        const on = f.type === t.id;
        return '<button type="button" class="gf-veh-card' + (on ? " on" : "") + '" role="radio" ' +
          'aria-checked="' + on + '" data-action="kf-type" data-id="' + t.id + '">' +
          '<span class="gf-veh-art">' + ic(t.icon, 46, 1.5) + '</span>' +
          '<span class="gf-veh-name">' + t.label + '</span>' +
          '<span class="gf-veh-sub">' + t.sub + '</span>' +
          '<span class="gf-tick">' + ic("check", 13, 2.6) + '</span>' +
        '</button>';
      }).join("") + '</div>';
  }
  /* Same card shape as the garage page's «Тип парковки». */
  function heatingCards() {
    // reuses .gf-park, the garage page's two-up card row
    return '<div class="gf-park kf-heat" role="radiogroup" aria-label="Отопление">' +
      D.heatingTypes.map(h => {
        const on = f.heating === h.id;
        return '<button type="button" class="gf-park-card' + (on ? " on" : "") + '" role="radio" ' +
          'aria-checked="' + on + '" data-action="kf-heat" data-id="' + h.id + '">' +
          '<span class="gf-park-ic">' + ic(h.icon, 24, 1.7) + '</span>' +
          '<span class="gf-park-tx"><b>' + h.label + '</b><small>' + h.desc + '</small></span>' +
          '<span class="gf-tick">' + ic("check", 13, 2.6) + '</span>' +
        '</button>';
      }).join("") + '</div>';
  }

  function sizeSlider() {
    return K.dualSlider({ ns: "kfs", P: S(), lo: f.sizeMin, hi: f.sizeMax,
                          bars: D.skladSizeHistogram(24), fmt: m2, unit: "площадь" });
  }
  function priceSlider() {
    return K.dualSlider({ ns: "kf", P: P(), lo: f.priceMin, hi: f.priceMax,
                          bars: D.skladHistogram(24) });
  }
  function radiusChips()  { return K.radiusChips("kf", f.radiusKm); }
  function featureChips() { return K.featureChips("kf", D.skladFeatures, f.features); }
  function availability() {
    return K.availability({ ns: "kf", fromISO: f.fromISO, toISO: f.toISO });
  }
  /* Dates come from the search bar. Seed them on mount and refresh whenever the
     bar commits a new range (Q.app calls syncDates). */
  function readDates() {
    const q = Q.store.get().query;
    f.fromISO = q.dateISO || null;
    f.toISO = q.dateEndISO || null;
  }
  function syncDates() { if (!f) return; readDates(); repaintAvail(); afterChange(); }
  function sortSelect() { return K.sortSelect("kf", D.sortOptions, f.sort); }

  function footBar() {
    const n = count(), a = activeCount();
    return '<div class="gf-foot"><div class="gf-foot-in">' +
      '<button type="button" class="btn btn-ghost gf-reset" data-action="kf-reset"' + (a ? "" : " disabled") + '>' +
        ic("rotate", 17, 1.9) + 'Сбросить' + (a ? ' <span class="gf-badge">' + a + '</span>' : "") + '</button>' +
      '<button type="button" class="btn btn-primary gf-show" data-action="kf-apply"' + (n ? "" : " disabled") + ' id="kfShow" aria-live="polite">' +
        (n ? "Показать " + n + " " + D.placesWord(n) : "Ничего не найдено") + '</button>' +
    '</div></div>';
  }

  /* ---------- Sections for the Фильтры modal ---------- */
  function sections() {
    f = Object.assign(D.skladDefaults(), Q.store.get().sklad);
    readDates();
    return section("type", "Тип помещения", "Кладовая, подвал, бокс или целое помещение.", typeCards()) +
      section("heat", "Отопление", "Тёплый склад или холодное сухое хранение.", heatingCards()) +
      section("size", "Площадь помещения", "Склад сдаётся целиком — выберите нужный размер.", sizeSlider()) +
      section("price", "Бюджет в месяц", "Выберите комфортную стоимость аренды в месяц.", priceSlider()) +
      section("dist", "Расстояние", "Радиус поиска от выбранного места.", radiusChips()) +
      section("feat", "Оснащение склада", "Отметьте всё, что вам нужно.", featureChips()) +
      section("avail", "Доступность", "Когда планируете заехать?", availability(), K.nowSwitch("kf", f.nowOnly)) +
      section("sort", "Сортировка", "Как показать результаты.", sortSelect());
  }

  /* ---------- Repaint helpers (surgical, never the whole page) ---------- */
  function repaint(sel, html) { const el = document.querySelector(sel); if (el) el.outerHTML = html; }
  function repaintFoot() {
    const bar = document.querySelector(".gf-foot");
    if (bar) bar.outerHTML = footBar();
  }
  function afterChange() { repaintFoot(); }

  function repaintPriceOut() { K.repaintSlider("kf", P(), f.priceMin, f.priceMax); }
  function repaintSizeOut()  { K.repaintSlider("kfs", S(), f.sizeMin, f.sizeMax, m2); }
  function repaintAvail() { repaint("#kfAvail", availability()); }

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action]");
    if (!t || !f) return;
    switch (t.dataset.action) {
      case "kf-type": {                      // single select, click again to clear
        f.type = f.type === t.dataset.id ? null : t.dataset.id;
        repaint(".kf-type", typeCards()); afterChange();
        break;
      }
      case "kf-heat": {
        f.heating = f.heating === t.dataset.id ? null : t.dataset.id;
        repaint(".kf-heat", heatingCards()); afterChange();
        break;
      }
      case "kf-radius": {
        f.radiusKm = parseInt(t.dataset.km, 10);
        t.parentNode.querySelectorAll(".gf-chip").forEach(b => {
          const on = b === t;
          b.classList.toggle("on", on); b.setAttribute("aria-checked", on);
        });
        afterChange();
        break;
      }
      case "kf-feat": {
        const id = t.dataset.id, i = f.features.indexOf(id);
        if (i === -1) f.features.push(id); else f.features.splice(i, 1);
        t.classList.toggle("on", i === -1); t.setAttribute("aria-pressed", i === -1);
        afterChange();
        break;
      }

      case "kf-reset": {
        f = D.skladDefaults();
        readDates();                         // the bar's dates survive a filter reset
        repaint(".kf-type", typeCards());
        repaint(".kf-heat", heatingCards());
        repaint("#kf-dist .gf-chips", radiusChips());
        repaint("#kf-feat .gf-chips", featureChips());
        repaintAvail();
        const lo = document.getElementById("kfMin"), hi = document.getElementById("kfMax");
        if (lo) lo.value = f.priceMin; if (hi) hi.value = f.priceMax;
        const slo = document.getElementById("kfsMin"), shi = document.getElementById("kfsMax");
        if (slo) slo.value = f.sizeMin; if (shi) shi.value = f.sizeMax;
        repaintPriceOut(); repaintSizeOut();
        const sort = document.getElementById("kfSort"); if (sort) sort.value = f.sort;
        const sw = document.querySelector(".gf-switch input"); if (sw) sw.checked = false;
        afterChange();
        Q.app.toast("Фильтры сброшены");
        break;
      }
      case "kf-apply": {
        Q.store.set({ category: "sklad", sklad: Object.assign({}, f), selectedId: null });
        Q.app.applyFilters();
        break;
      }
    }
  });

  /* range drag + select + checkbox */
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (!f || !t.dataset || !t.dataset.action) return;
    if (t.dataset.action === "kf-price") {
      const end = t.dataset.end;
      const v = K.clampHandle(end, parseInt(t.value, 10), f.priceMin, f.priceMax, P());
      if (end === "min") f.priceMin = v; else f.priceMax = v;
      if (String(v) !== t.value) t.value = v;
      repaintPriceOut(); afterChange();
      return;
    }
    if (t.dataset.action === "kfs-price") {
      const end = t.dataset.end;
      const v = K.clampHandle(end, parseInt(t.value, 10), f.sizeMin, f.sizeMax, S());
      if (end === "min") f.sizeMin = v; else f.sizeMax = v;
      if (String(v) !== t.value) t.value = v;
      repaintSizeOut(); afterChange();
    }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (!f || !t.dataset || !t.dataset.action) return;
    if (t.dataset.action === "kf-sort") { f.sort = t.value; afterChange(); }
    if (t.dataset.action === "kf-now") { f.nowOnly = t.checked; afterChange(); }
  });

  /* the page owns `f` only while it is mounted */
  function unmount() { f = null; }

  Q.sklad = { sections, footBar, unmount, syncDates };
})(window.Q = window.Q || {});
