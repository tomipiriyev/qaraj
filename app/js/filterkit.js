/* Qaraj web app — shared building blocks for the category filter sets, which
   are rendered into the Фильтры modal (see components.js `filterModal`).

   Every helper is namespaced by `ns` ("gf" / "sf" / "kf"), which prefixes both the
   element ids it generates (gfMin, sfMin…) and the data-action names its
   controls fire (gf-price, sf-price…). That lets two structurally identical
   sets coexist with their own handlers and no id collisions, while sharing
   one set of CSS classes (the `.gf-*` filter design system in filters.css). */
(function (Q) {
  const D = Q.data, c = Q.c, ic = Q.c.ic;

  /* A histogram bar is lit when its bucket overlaps the selected range —
     testing the bucket midpoint would blank the chart on narrow ranges. */
  function barLit(i, n, P, lo, hi) {
    const w = (P.max - P.min) / n, at = P.min + i * w;
    return at + w >= lo && at <= hi;
  }
  function priceText(n, P) { return n >= P.max ? D.fmt(n) + "+ ₽" : D.fmt(n) + " ₽"; }

  /* Dual-handle slider: two stacked range inputs with pointer-events off except
     on the thumbs, so both handles stay reachable and keyboard-operable.

     Defaults to money. Pass `fmt` (a value → string formatter) to measure
     something else — the склад page uses one for its м² range — plus `unit`
     for the aria labels. The top handle always reads "and above", so `fmt` is
     given the raw value and the "+" is appended here. */
  function dualSlider(o) {
    const P = o.P, span = P.max - P.min, ns = o.ns;
    const fmt = o.fmt || (v => D.fmt(v) + " ₽");
    const unit = o.unit || "цена";
    const pct = v => ((v - P.min) / span) * 100;
    const peak = Math.max.apply(null, o.bars) || 1;
    const hist = o.bars.map((h, i) =>
      '<span class="gf-bar' + (barLit(i, o.bars.length, P, o.lo, o.hi) ? " on" : "") +
      '" style="height:' + Math.max(6, h / peak * 100) + '%"></span>').join("");
    return '<div class="gf-price">' +
      '<div class="gf-hist" id="' + ns + 'Hist" aria-hidden="true">' + hist + '</div>' +
      '<div class="gf-slider">' +
        '<span class="gf-rail"></span>' +
        '<span class="gf-rail-on" id="' + ns + 'Rail" style="left:' + pct(o.lo) + '%;right:' + (100 - pct(o.hi)) + '%"></span>' +
        '<input type="range" class="gf-range lo" id="' + ns + 'Min" min="' + P.min + '" max="' + P.max + '" step="' + P.step + '" value="' + o.lo + '" ' +
          'data-action="' + ns + '-price" data-end="min" aria-label="Минимальная ' + unit + '">' +
        '<input type="range" class="gf-range hi" id="' + ns + 'Max" min="' + P.min + '" max="' + P.max + '" step="' + P.step + '" value="' + o.hi + '" ' +
          'data-action="' + ns + '-price" data-end="max" aria-label="Максимальная ' + unit + '">' +
      '</div>' +
      '<div class="gf-price-out">' +
        '<div class="gf-price-box"><small>Минимум</small><b id="' + ns + 'MinOut">' + fmt(o.lo) + '</b></div>' +
        '<span class="gf-price-dash"></span>' +
        '<div class="gf-price-box"><small>Максимум</small><b id="' + ns + 'MaxOut">' + topText(o.hi, P, fmt) + '</b></div>' +
      '</div>' +
    '</div>';
  }
  /* The high handle at the top of the domain means "and above". */
  function topText(v, P, fmt) { return v >= P.max ? fmt(v) + "+" : fmt(v); }
  /* Repaint just the readouts + rail + bars — called on every drag frame, so it
     must never touch the inputs the user is holding. */
  function repaintSlider(ns, P, lo, hi, fmt) {
    const f = fmt || (v => D.fmt(v) + " ₽");
    const span = P.max - P.min, pct = v => ((v - P.min) / span) * 100;
    const rail = document.getElementById(ns + "Rail");
    if (rail) { rail.style.left = pct(lo) + "%"; rail.style.right = (100 - pct(hi)) + "%"; }
    const a = document.getElementById(ns + "MinOut"), b = document.getElementById(ns + "MaxOut");
    if (a) a.textContent = f(lo);
    if (b) b.textContent = topText(hi, P, f);
    const hist = document.getElementById(ns + "Hist");
    if (hist) {
      const bars = hist.children, n = bars.length;
      for (let i = 0; i < n; i++) bars[i].classList.toggle("on", barLit(i, n, P, lo, hi));
    }
  }
  /* Keep the handles from crossing: each stops one step short of the other.
     Returns the corrected value for the end that moved. */
  function clampHandle(end, v, lo, hi, P) {
    return end === "min" ? Math.min(v, hi - P.step) : Math.max(v, lo + P.step);
  }

  /* Single-choice radius row (horizontally scrollable on narrow screens). */
  function radiusChips(ns, km) {
    return '<div class="gf-chips" role="radiogroup" aria-label="Расстояние">' +
      D.radiusOptions.map(r => {
        const on = km === r.km;
        return '<button type="button" class="gf-chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" ' +
          'data-action="' + ns + '-radius" data-km="' + r.km + '">' + r.label + '</button>';
      }).join("") + '</div>';
  }
  /* Multi-select feature chips. `items` are {id,label,icon}. */
  function featureChips(ns, items, selected) {
    return '<div class="gf-chips wrap">' +
      items.map(g => {
        const on = selected.indexOf(g.id) !== -1;
        return '<button type="button" class="gf-chip ic' + (on ? " on" : "") + '" aria-pressed="' + on + '" ' +
          'data-action="' + ns + '-feat" data-id="' + g.id + '">' + ic(g.icon, 16, 1.8) + g.label + '</button>';
      }).join("") + '</div>';
  }

  /* Dates are picked once, in the search bar — this page only mirrors them, so
     no calendar here. "Изменить" reopens the bar's date panel. */
  function availability(o) {
    const ns = o.ns;
    return '<div class="gf-avail" id="' + ns + 'Avail">' +
      '<div class="gf-dates">' +
        '<span class="gf-date' + (o.fromISO ? " set" : "") + '">' +
          '<small>Заезд</small><b>' + (o.fromISO ? D.dateLong(o.fromISO) : "Не выбрана") + '</b></span>' +
        '<span class="gf-date' + (o.toISO ? " set" : "") + '">' +
          '<small>Выезд <span class="gf-opt">необязательно</span></small>' +
          '<b>' + (o.toISO ? D.dateLong(o.toISO) : "Не указана") + '</b></span>' +
      '</div>' +
      '<div class="gf-avail-note">' + ic("calendar", 16, 1.8) +
        '<span>' + (o.fromISO ? "Даты выбраны в строке поиска." : "Даты не выбраны — покажем всё, что свободно.") + '</span>' +
        '<button type="button" class="linkbtn" data-action="open-search" data-panel="when">Изменить</button>' +
      '</div>' +
    '</div>';
  }
  /* Where a calendar click lands: first sets the start, the next the end;
     clicking on/before the start (or with a full range set) starts over. */
  function nextRange(fromISO, toISO, iso) {
    if (!fromISO || toISO || iso <= fromISO) return { fromISO: iso, toISO: null };
    return { fromISO: fromISO, toISO: iso };
  }

  function sortSelect(ns, options, current) {
    return '<div class="gf-select">' + ic("sort", 18, 1.8) +
      '<select id="' + ns + 'Sort" data-action="' + ns + '-sort" aria-label="Сортировка">' +
        options.map(s => '<option value="' + s.id + '"' + (current === s.id ? " selected" : "") + '>' + s.label + '</option>').join("") +
      '</select>' + ic("chevR", 16, 2.2) + '</div>';
  }

  /* Section wrapper shared by both pages. */
  function section(ns, id, title, sub, body, extra) {
    return '<section class="gf-sec" id="' + ns + '-' + id + '">' +
      '<div class="gf-sec-head"><div><h2>' + title + '</h2>' +
        (sub ? '<p>' + sub + '</p>' : "") + '</div>' + (extra || "") + '</div>' + body + '</section>';
  }
  /* "Свободно сейчас" toggle that rides in a section header. */
  function nowSwitch(ns, on) {
    return '<label class="gf-switch"><input type="checkbox" data-action="' + ns + '-now"' + (on ? " checked" : "") + '>' +
      '<span class="gf-switch-ui"></span><span>Свободно сейчас</span></label>';
  }

  Q.kit = { barLit, priceText, topText, dualSlider, repaintSlider, clampHandle, radiusChips,
            featureChips, availability, nextRange, sortSelect, section, nowSwitch };
})(window.Q = window.Q || {});
