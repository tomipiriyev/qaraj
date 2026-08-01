/* Qaraj web app — «Поиск площади»: the Площадь filter set.
   Supplies sections + footer bar for the Фильтры modal — see filters.js.

   Площадь is let by the square metre, so this page is a sizing assistant first
   and a filter second: pick what you're storing → each item contributes its own
   m² → the sum becomes a recommended area → the area drives the estimated price
   and which listings are large enough. Dragging the size control switches to
   manual mode (`sizeTouched`) and the recommendation stops overwriting it.

   State layering (working copy → URL → store) and the shared section/slider/
   chip/calendar widgets are the same as the garage page; see filterkit.js. */
(function (Q) {
  const D = Q.data, c = Q.c, K = Q.kit, ic = Q.c.ic, esc = Q.c.esc;
  const S = () => D.SPACE_SIZE;
  // the budget domain depends on the chosen area, so it is recomputed, never cached
  const P = () => D.spacePriceDomain(size());

  let f = null;


  /* ---------- Derived values ---------- */
  function size() { return D.spaceSize(f); }
  function results() { return D.spaceResults(f, Q.store.place()); }
  function count() { return results().length; }
  function m2(n) { return (Math.round(n * 10) / 10).toString().replace(".", ",") + " м²"; }
  function chosen() { return D.storeItems.filter(i => f.items[i.id] > 0); }

  /* ---------- Section 1: item cards ---------- */
  function itemCards() {
    return '<div class="sf-items">' + D.storeItems.map(it => {
      const q = f.items[it.id] || 0;
      const art = it.img
        ? '<img src="../images/items/' + it.img + '.webp" alt="" loading="lazy" draggable="false">'
        : '<span class="sf-item-ic">' + ic(it.icon, 40, 1.5) + '</span>';
      return '<button type="button" class="sf-item' + (q ? " on" : "") + '" aria-pressed="' + !!q + '" ' +
        'data-action="sf-item" data-id="' + it.id + '">' +
        '<span class="sf-item-art">' + art + '</span>' +
        '<span class="sf-item-name">' + it.label + '</span>' +
        '<span class="sf-item-m2">' + m2(it.m2) + ' / ' + it.unit + '</span>' +
        '<span class="gf-tick">' + ic("check", 13, 2.6) + '</span>' +
      '</button>';
    }).join("") + '</div>';
  }

  /* ---------- Section 2: chosen items with quantity steppers ---------- */
  function selectedItems() {
    const list = chosen();
    if (!list.length) {
      return '<div class="sf-empty" id="sfSelected">' + ic("box", 26, 1.6) +
        '<p>Пока ничего не выбрано. Отметьте, что планируете хранить — мы посчитаем площадь.</p></div>';
    }
    return '<div class="sf-sel" id="sfSelected">' + list.map(it => {
      const q = f.items[it.id];
      const art = it.img
        ? '<img src="../images/items/' + it.img + '.webp" alt="" loading="lazy">'
        : ic(it.icon, 26, 1.6);
      return '<div class="sf-sel-row">' +
        '<span class="sf-sel-art">' + art + '</span>' +
        '<span class="sf-sel-tx"><b>' + it.label + '</b><small>' + m2(it.m2) + ' за ' + it.unit + '</small></span>' +
        '<span class="sf-qty">' +
          '<button type="button" class="rnd" data-action="sf-qty" data-id="' + it.id + '" data-d="-1" aria-label="Меньше">−</button>' +
          '<span class="sf-qty-n" aria-live="polite">' + q + '</span>' +
          '<button type="button" class="rnd" data-action="sf-qty" data-id="' + it.id + '" data-d="1" aria-label="Больше">+</button>' +
        '</span>' +
        '<span class="sf-sel-m2">' + m2(q * it.m2) + '</span>' +
        '<button type="button" class="sf-sel-x" data-action="sf-remove" data-id="' + it.id + '" aria-label="Убрать ' + esc(it.label) + '">' +
          ic("x", 13, 2.2) + '</button>' +
      '</div>';
    }).join("") + '</div>';
  }

  /* ---------- Section 3: recommendation + manual size ---------- */
  function sizeBlock() {
    const s = S(), rec = D.spaceRecommended(f.items), cur = size();
    const pctv = ((cur - s.min) / (s.max - s.min)) * 100;
    const diverged = f.sizeTouched && rec && Math.abs(rec - cur) > 0.01;
    return '<div class="sf-size" id="sfSize">' +
      '<div class="sf-cards">' +
        '<div class="sf-card"><small>Рекомендуемая площадь</small>' +
          '<b>' + (rec ? m2(rec) : "—") + '</b>' +
          '<span>' + (rec ? "По выбранным вещам." : "Выберите вещи выше.") + '</span></div>' +
        '<div class="sf-card accent"><small>Итоговая площадь</small>' +
          '<b id="sfSizeOut">' + m2(cur) + '</b>' +
          '<span id="sfPriceEst">≈ ' + D.fmt(D.spaceEstimate(f)) + ' ₽ / мес</span></div>' +
      '</div>' +
      '<div class="sf-size-ctl">' +
        '<button type="button" class="rnd big" data-action="sf-size-step" data-d="-1" aria-label="Уменьшить площадь">−</button>' +
        '<span class="sf-size-slider">' +
          '<span class="gf-rail"></span>' +
          '<span class="gf-rail-on" id="sfSizeRail" style="left:0;right:' + (100 - pctv) + '%"></span>' +
          '<input type="range" class="gf-range" id="sfSizeRange" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" ' +
            'value="' + cur + '" data-action="sf-size" aria-label="Итоговая площадь, м²">' +
        '</span>' +
        '<button type="button" class="rnd big" data-action="sf-size-step" data-d="1" aria-label="Увеличить площадь">+</button>' +
      '</div>' +
      '<div class="sf-size-hint">' +
        (diverged
          ? 'Задано вручную. <button type="button" class="linkbtn" data-action="sf-size-reset">Вернуть рекомендацию (' + m2(rec) + ')</button>'
          : 'Двигайте ползунок, если нужно больше или меньше места.') +
      '</div>' +
    '</div>';
  }

  /* ---------- Sections 4–8 (shared widgets) ---------- */
  function priceSlider() {
    const dom = D.spaceFitPrice(f);          // keep the window inside the live domain
    return K.dualSlider({ ns: "sf", P: dom, lo: f.priceMin, hi: f.priceMax,
                          bars: D.spaceHistogram(24, size(), dom) });
  }
  function featureChips() { return K.featureChips("sf", D.spaceFeatures, f.features); }
  function radiusChips()  { return K.radiusChips("sf", f.radiusKm); }
  function availability() {
    return K.availability({ ns: "sf", fromISO: f.fromISO, toISO: f.toISO });
  }
  /* Dates come from the search bar. Seed them on mount and refresh whenever the
     bar commits a new range (Q.app calls syncDates). */
  function readDates() {
    const q = Q.store.get().query;
    f.fromISO = q.dateISO || null;
    f.toISO = q.dateEndISO || null;
  }
  function syncDates() { if (!f) return; readDates(); repaintAvail(); afterChange(); }
  function sortSelect()   { return K.sortSelect("sf", D.spaceSortOptions, f.sort); }

  /* ---------- Sticky summary ---------- */
  function footBar() {
    const n = count(), a = D.spaceActiveCount(f);
    return '<div class="gf-foot sf-foot"><div class="gf-foot-in">' +
      '<div class="sf-foot-sum">' +
        '<span class="sf-foot-cell"><small>Площадь</small><b id="sfFootSize">' + m2(size()) + '</b></span>' +
        '<span class="sf-foot-cell"><small>Примерно в месяц</small><b id="sfFootPrice">' + D.fmt(D.spaceEstimate(f)) + ' ₽</b></span>' +
      '</div>' +
      '<div class="sf-foot-btns">' +
        '<button type="button" class="btn btn-ghost gf-reset" data-action="sf-reset"' + (a ? "" : " disabled") + '>' +
          ic("rotate", 17, 1.9) + 'Сбросить' + (a ? ' <span class="gf-badge">' + a + '</span>' : "") + '</button>' +
        '<button type="button" class="btn btn-primary gf-show" data-action="sf-apply"' + (n ? "" : " disabled") + ' id="sfShow" aria-live="polite">' +
          (n ? "Показать " + n + " " + D.placesWord(n) : "Ничего не найдено") + '</button>' +
      '</div>' +
    '</div></div>';
  }

  /* ---------- Sections for the Фильтры modal ---------- */
  const section = (id, title, sub, body, extra) => K.section("sf", id, title, sub, body, extra);

  function sections() {
    f = Object.assign(D.spaceDefaults(), Q.store.get().space);
    if (!f.items) f.items = {};
    D.spaceFitPrice(f);
    readDates();
    return section("items", "Категории вещей", "Можно выбрать несколько — количество укажете ниже.", itemCards()) +
      section("sel", "Выбранные вещи", "Меняйте количество — площадь пересчитается сразу.", selectedItems()) +
      section("size", "Нужная площадь", "Рассчитано по выбранным вещам.", sizeBlock()) +
      section("price", "Бюджет в месяц", "Стоимость аренды выбранной площади.", priceSlider()) +
      section("feat", "Дополнительные фильтры", "Отметьте всё, что вам нужно.", featureChips()) +
      section("avail", "Доступность", "Когда планируете заехать?", availability(), K.nowSwitch("sf", f.nowOnly)) +
      section("dist", "Расстояние", "Радиус поиска от выбранного места.", radiusChips()) +
      section("sort", "Сортировка", "Как показать результаты.", sortSelect());
  }

  /* ---------- Repaints ---------- */
  function repaint(sel, html) { const el = document.querySelector(sel); if (el) el.outerHTML = html; }
  function repaintFoot() { const b = document.querySelector(".gf-foot"); if (b) b.outerHTML = footBar(); }
  /* Anything that changes the area also moves the price histogram and the count. */
  function afterSizeChange() {
    repaint("#sfSize", sizeBlock());
    repaint(".gf-price", priceSlider());
    afterChange();
  }
  function afterChange() { repaintFoot(); }
  function repaintItems() {
    repaint(".sf-items", itemCards());
    repaint("#sfSelected", selectedItems());
  }
  function repaintAvail() { repaint("#sfAvail", availability()); }

  function setQty(id, qty) {
    if (qty <= 0) delete f.items[id]; else f.items[id] = Math.min(99, qty);
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action]");
    if (!t || !f) return;
    switch (t.dataset.action) {
      case "sf-item": {                       // toggle a category on/off
        const id = t.dataset.id;
        setQty(id, f.items[id] ? 0 : 1);
        repaintItems(); afterSizeChange();
        break;
      }
      case "sf-qty": {
        const id = t.dataset.id;
        setQty(id, (f.items[id] || 0) + parseInt(t.dataset.d, 10));
        repaintItems(); afterSizeChange();
        break;
      }
      case "sf-remove": setQty(t.dataset.id, 0); repaintItems(); afterSizeChange(); break;

      case "sf-size-step": {
        const s = S();
        f.sizeM2 = Math.max(s.min, Math.min(s.max, size() + parseInt(t.dataset.d, 10) * s.step));
        f.sizeTouched = true;
        afterSizeChange();
        break;
      }
      case "sf-size-reset": f.sizeTouched = false; afterSizeChange(); break;

      case "sf-feat": {
        const id = t.dataset.id, i = f.features.indexOf(id);
        if (i === -1) f.features.push(id); else f.features.splice(i, 1);
        t.classList.toggle("on", i === -1); t.setAttribute("aria-pressed", i === -1);
        afterChange();
        break;
      }
      case "sf-radius": {
        f.radiusKm = parseFloat(t.dataset.km);
        t.parentNode.querySelectorAll(".gf-chip").forEach(b => {
          const on = b === t;
          b.classList.toggle("on", on); b.setAttribute("aria-checked", on);
        });
        afterChange();
        break;
      }

      case "sf-reset": {
        f = D.spaceDefaults();
        readDates();                       // the bar's dates survive a filter reset
        repaintItems();
        repaint("#sf-feat .gf-chips", featureChips());
        repaint("#sf-dist .gf-chips", radiusChips());
        repaintAvail();
        const sort = document.getElementById("sfSort"); if (sort) sort.value = f.sort;
        const sw = document.querySelector(".gf-switch input"); if (sw) sw.checked = false;
        afterSizeChange();
        Q.app.toast("Фильтры сброшены");
        break;
      }
      case "sf-apply":
        Q.store.set({ category: "ploshad", space: Object.assign({}, f), selectedId: null });
        Q.app.applyFilters();
        break;
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (!f || !t.dataset || !t.dataset.action) return;
    if (t.dataset.action === "sf-price") {
      const end = t.dataset.end;
      const dom = P();
      const v = K.clampHandle(end, parseInt(t.value, 10), f.priceMin, f.priceMax, dom);
      if (end === "min") f.priceMin = v; else f.priceMax = v;
      if (String(v) !== t.value) t.value = v;
      f.priceTouched = true;
      K.repaintSlider("sf", dom, f.priceMin, f.priceMax);
      afterChange();
      return;
    }
    if (t.dataset.action === "sf-size") {
      f.sizeM2 = parseFloat(t.value); f.sizeTouched = true;
      // repaint the readouts live, but leave the input the user is dragging alone
      const s = S(), pctv = ((f.sizeM2 - s.min) / (s.max - s.min)) * 100;
      const rail = document.getElementById("sfSizeRail");
      if (rail) rail.style.right = (100 - pctv) + "%";
      const out = document.getElementById("sfSizeOut");
      if (out) out.textContent = m2(f.sizeM2);
      const est = document.getElementById("sfPriceEst");
      if (est) est.textContent = "≈ " + D.fmt(D.spaceEstimate(f)) + " ₽ / мес";
      repaint(".gf-price", priceSlider());
      afterChange();
    }
  });

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (!f || !t.dataset || !t.dataset.action) return;
    if (t.dataset.action === "sf-sort") { f.sort = t.value; afterChange(); }
    if (t.dataset.action === "sf-now") { f.nowOnly = t.checked; afterChange(); }
    // dragging the size input fires `change` on release — settle the section then
    if (t.dataset.action === "sf-size") afterSizeChange();
  });

  function unmount() { f = null; }

  Q.space = { sections, footBar, unmount, syncDates };
})(window.Q = window.Q || {});
