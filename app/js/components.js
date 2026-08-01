/* Qaraj web app — pure render helpers (return HTML strings). */
(function (Q) {
  const D = Q.data;

  /* ---------- Icons (inline SVG, stroke = currentColor) ---------- */
  const paths = {
    box:'<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    grid:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 4v16M4 12h16"/>',
    garage:'<path d="M3 10 12 4l9 6"/><path d="M5 10v10h14V10M8 20v-5h8v5"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    tune:'<path d="M4 7h11M19 7h1M4 17h1M9 17h11"/><circle cx="17" cy="7" r="2.3"/><circle cx="7" cy="17" r="2.3"/>',
    heart:'<path d="M12 20s-7-4.5-9.5-9C.5 7 3 4 6 4c2 0 3.2 1.3 4 2.4C10.8 5.3 12 4 14 4c3 0 5.5 3 3.5 7-2.5 4.5-9.5 9-9.5 9Z"/>',
    star:'<path d="m12 2 3 6.5 7 .6-5.3 4.6L18.4 21 12 17.3 5.6 21l1.7-7.3L2 9.1l7-.6L12 2Z"/>',
    nav:'<path d="m22 3-9 18-2.5-7.5L3 11l19-8Z"/>',
    city:'<path d="M4 20V9l5-3 5 3v11M14 20v-7l4-2 2 1v8"/>',
    bank:'<path d="M4 9h16M5 9 12 4l7 5M6 9v9M18 9v9M4 18h16"/>',
    home:'<path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"/>',
    snow:'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9M12 6l-2.5-2.5M12 6l2.5-2.5M12 18l-2.5 2.5M12 18l2.5 2.5"/>',
    cam:'<rect x="3" y="6" width="14" height="10" rx="2"/><path d="m17 9 4-2v8l-4-2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    alert:'<path d="M10.3 4 3 17a2 2 0 0 0 1.7 3h14.6A2 2 0 0 0 21 17L13.7 4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 16v.5"/>',
    bolt:'<path d="M13 3 5 13h6l-2 8 8-11h-6l2-7Z"/>',
    chevR:'<path d="m9 6 6 6-6 6"/>',
    chevL:'<path d="m15 6-6 6 6 6"/>',
    x:'<path d="m6 6 12 12M18 6 6 18"/>',
    ruler:'<path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>',
    burger:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    doc:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M8 16h5"/>',
    check:'<path d="m5 12 5 5 9-11"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    expand:'<path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/>',
    tag:'<path d="M20.6 13.4 12 4.8H4.8V12l8.6 8.6a2 2 0 0 0 2.8 0l4.4-4.4a2 2 0 0 0 0-2.8Z"/><path d="M8 8v.01"/>',
    pinloc:'<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    shield:'<path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    door:'<path d="M6 3h9a2 2 0 0 1 2 2v16H6zM17 21h3M14 12v1"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.4-1 .8-1 1.7M12 16.8v.01"/>',
    /* garage search */
    /* three silhouettes distinguished by roof height: low sedan, boxy SUV, tall van */
    car:'<path d="M2.5 15.2v-2.4c0-.3.1-.6.3-.8l2.6-2.8c.4-.4.9-.6 1.5-.6h7.6c.5 0 1 .2 1.4.5l3 2.6c.2.2.5.3.8.4l1.4.3c.6.1 1 .6 1 1.2v1.6Z"/><path d="M2.8 12.4h18.4M11.5 8.6v3.8"/><circle cx="7.2" cy="15.6" r="2.1"/><circle cx="16.8" cy="15.6" r="2.1"/>',
    moto:'<circle cx="5" cy="16" r="3.2"/><circle cx="19" cy="16" r="3.2"/><path d="M5 16h4l4-6h4"/><path d="m15 7 2.4 4.8L19 16"/><path d="M11.5 10 10 7H7.5"/>',
    suv:'<path d="M2.5 15.5V10c0-.4.2-.8.5-1l2.3-2c.4-.3.8-.5 1.3-.5h10.8c.5 0 .9.2 1.3.5l2.3 2c.3.2.5.6.5 1v5.5Z"/><path d="M2.8 10.6h18.4M12 7v3.6"/><circle cx="7.2" cy="15.8" r="2.1"/><circle cx="16.8" cy="15.8" r="2.1"/>',
    van:'<path d="M2.5 15.5V6.8c0-.6.4-1 1-1h8.8c.4 0 .7.2.9.5l3 4c.2.2.4.4.7.5l2.1.9c.4.2.6.5.6.9v2.9Z"/><path d="M12.6 6v4.6h6.4"/><circle cx="7" cy="15.8" r="2.1"/><circle cx="16.9" cy="15.8" r="2.1"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    roof:'<path d="M3 11 12 4l9 7"/><path d="M6 11v8h12v-8"/>',
    bulb:'<path d="M9.2 16a6 6 0 1 1 5.6 0v2.2a1.5 1.5 0 0 1-1.5 1.5h-2.6a1.5 1.5 0 0 1-1.5-1.5Z"/><path d="M9.5 17.5h5"/>',
    plug:'<path d="M9 3v5M15 3v5"/><path d="M6.5 8h11v2.5a5.5 5.5 0 0 1-5.5 5.5 5.5 5.5 0 0 1-5.5-5.5Z"/><path d="M12 16v5"/>',
    gate:'<path d="M3 20V8.5L12 4l9 4.5V20"/><path d="M3 20h18M7 20v-7h10v7M7 16.5h10"/>',
    umbrella:'<path d="M3 12a9 9 0 0 1 18 0Z"/><path d="M12 12v6.5a2.5 2.5 0 0 0 5 0"/>',
    truck:'<path d="M2 7.5h11.5v9H2z"/><path d="M13.5 10.5h3.7l2.8 3v3h-6.5z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    sliders:'<path d="M4 7h11M19 7h1M4 17h1M9 17h11"/><circle cx="17" cy="7" r="2.3"/><circle cx="7" cy="17" r="2.3"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.01"/>',
    arrowL:'<path d="M20 12H4M10 6l-6 6 6 6"/>',
    arrowR:'<path d="M4 12h16M14 6l6 6-6 6"/>',
    sort:'<path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/>',
    rotate:'<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5V10h5.5"/>',
    /* space search */
    dry:'<path d="M12 3.5s5.5 6 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5Z"/><path d="m4 4 16 16"/>',
    shelf:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.3h18M3 14.7h18M8 4v16"/>',
    stairs:'<path d="M3 20h4v-4h4v-4h4V8h4V4"/><path d="M3 20V16"/>',
    lift:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18"/><path d="m8 10 1.6-2 1.6 2M8 14l1.6 2 1.6-2"/>',
  };
  function ic(name, size, sw) {
    return '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || "") + '</svg>';
  }
  function icFill(name, size) {
    return '<svg width="' + (size || 14) + '" height="' + (size || 14) + '" viewBox="0 0 24 24" fill="currentColor">' + (paths[name] || "") + '</svg>';
  }
  const catIcon = { sklad: "box", ploshad: "grid", garage: "garage" };
  const amIcon = {};
  D.amenities.forEach(a => amIcon[a.id] = a.icon);

  /* ---------- App bar ---------- */
  function appbar(active) {
    const s = Q.store.get();
    const two = (active === "explore" || active === "map");
    const brand = '<a class="brand" href="#/" data-link><span class="mark">' + ic("box", 20, 1.6) + '</span><span class="name">Qar<b>aj</b></span></a>';
    const right = '<div class="appbar-right">' +
        '<a class="host-link" data-action="menu-host">Сдавайте своё место</a>' +
        '<button class="globe" data-action="noop" aria-label="Язык">' + ic("globe", 18, 1.7) + '</button>' +
        '<div class="usermenu-wrap">' +
          '<div class="usermenu">' +
            '<button class="um-burger" data-action="toggle-menu" aria-label="Меню">' + ic("burger", 18, 1.8) + '</button>' +
            '<button class="um-avatar" data-action="nav" data-route="#/profile" aria-label="Профиль">Д</button>' +
          '</div>' + menuPop() +
        '</div>' +
      '</div>';
    // .searchbox is the positioning context for the anchored search dropdowns
    const box = (inner) => '<div class="searchbox">' + inner + '<div class="searchpop-host"></div></div>';
    // the hero page carries its own search bar, so the bar itself stays empty
    const center = active === "home" ? "" : box(collapsedPill(s));
    // the results page adds the filter row under the bar, as on Airbnb
    return '<header class="appbar ' + (two ? "two" : "one") + '">' +
      '<div class="wrap appbar-top">' + brand + '<div class="appbar-center">' + center + '</div>' + right + '</div>' +
      (two ? filterRow(s) : "") +
    '</header>';
  }

  /* The bar asks where and when; the category is picked on the hero cards or
     the filter row, and Срок is chosen per listing in the inquiry form. */
  function queryLabels(s) {
    return { where: Q.store.place().name };
  }
  /* Labels a stored range on the hero bar, the results header and the listing's
     booking card. Empty string when no date is set — callers supply the prompt. */
  function whenLabel(q) {
    if (!q.dateISO) return "";
    return q.dateEndISO ? D.dateRange(q.dateISO, q.dateEndISO) : D.dateShort(q.dateISO);
  }
  function menuPop() {
    return '<div class="menu-pop" role="menu">' +
      '<button class="menu-item" data-action="menu-help">' + ic("help", 20, 1.7) + '<span>Справочный центр</span></button>' +
      '<div class="menu-div"></div>' +
      '<button class="menu-item menu-promo" data-action="menu-host">' +
        '<span class="mp-txt"><b>Сдавайте своё место</b><small>Легко начать сдавать и получать доход</small></span>' +
        '<span class="mp-ill">🏡</span>' +
      '</button>' +
      '<div class="menu-div"></div>' +
      '<button class="menu-item" data-action="menu-cohost"><span>Найти со-хозяина</span></button>' +
      '<button class="menu-item" data-action="menu-gift"><span>Подарочные карты</span></button>' +
      '<div class="menu-div"></div>' +
      '<button class="menu-item" data-action="menu-signup"><span>Зарегистрироваться</span></button>' +
      '<button class="menu-item" data-action="menu-login"><span>Войти</span></button>' +
    '</div>';
  }

  /* The bar carried by every page except the hero: place · dates · search.
     Each segment reopens its own panel of the search dropdown. */
  function collapsedPill(s) {
    const v = queryLabels(s), when = whenLabel(s.query);
    return '<div class="searchpill collapsed" role="search">' +
      '<button class="c-seg" data-action="open-search" data-panel="where">' +
        ic(catIcon[s.category], 18, 1.8) + esc(v.where) + '</button>' +
      '<span class="div"></span>' +
      '<button class="c-seg' + (when ? "" : " muted") + '" data-action="open-search" data-panel="when">' +
        esc(when || "Даты") + '</button>' +
      '<button class="go small" data-action="search-apply" aria-label="Найти">' + ic("search", 16, 2) + '</button></div>';
  }

  /* ---------- Filter row (under the bar on the results page) ----------
     Фильтры → the category's own filter step, then the three categories and
     quick toggles for whatever that category filters by. */
  function catFilterCount(s) {
    if (s.category === "garage") return D.garageActiveCount(s.garage);
    if (s.category === "ploshad") return D.spaceActiveCount(s.space);
    if (s.category === "sklad") return D.skladActiveCount(s.sklad);
    const f = s.filters;
    return f.amenities.length + (f.minM2 ? 1 : 0) + (f.priceMax < 30000 ? 1 : 0);
  }
  /* ---------- Refine prompt ----------
     Гараж and Площадь each have a filter page that used to sit between the
     search and the results. It is optional now, so the results have to offer
     it: this is the only place those two categories' real filters (габариты,
     вещи → м², радиус, сортировка) are advertised. Shown only while nothing
     has been set — once the user has filtered, the Фильтры badge says so. */
  const REFINE = {
    garage: { icon: "car", title: "Подобрать гараж по вашему авто",
              sub: "Габариты, тип парковки, оснащение и радиус поиска.", cta: "Подобрать" },
    ploshad: { icon: "ruler", title: "Не знаете, сколько м² нужно?",
               sub: "Отметьте, что храните, — рассчитаем площадь и подберём места.", cta: "Рассчитать" },
    sklad: { icon: "box", title: "Подобрать склад под ваши вещи",
             sub: "Тип помещения, отопление, площадь, бюджет и оснащение.", cta: "Подобрать" },
  };
  function refinePrompt(s) {
    const r = REFINE[s.category];
    // nothing to advertise once the user has actually filtered
    if (!r || catFilterCount(s)) return "";
    return '<button class="refine" data-action="open-filters">' +
      '<span class="rf-ic">' + ic(r.icon, 22, 1.7) + '</span>' +
      '<span class="rf-tx"><b>' + r.title + '</b><small>' + r.sub + '</small></span>' +
      '<span class="rf-cta">' + r.cta + ic("arrowR", 16, 2.2) + '</span>' +
    '</button>';
  }

  /* {items, on, scope} — where a category's quick filters live in the store */
  function quickSet(s) {
    if (s.category === "garage") return { items: D.garageFeatures, on: s.garage.features, scope: "garage" };
    if (s.category === "ploshad") return { items: D.spaceFeatures, on: s.space.features, scope: "space" };
    if (s.category === "sklad") return { items: D.skladFeatures, on: s.sklad.features, scope: "sklad" };
    return { items: D.amenities, on: s.filters.amenities, scope: "amen" };
  }
  function filterRow(s) {
    const n = catFilterCount(s), q = quickSet(s);
    return '<div class="filterrow"><div class="wrap fr-in">' +
      '<button class="fr-btn" data-action="open-filters">' + ic("tune", 16, 1.9) + 'Фильтры' +
        (n ? '<span class="gf-badge">' + n + '</span>' : "") + '</button>' +
      '<span class="fr-div"></span>' +
      // text-only pills, as in the reference — only Фильтры carries an icon
      D.categories.map(cat => '<button class="fr-chip' + (cat.id === s.category ? " on" : "") + '" ' +
        'data-action="cat" data-cat="' + cat.id + '">' + cat.label + '</button>').join("") +
      q.items.map(it => '<button class="fr-chip' + (q.on.indexOf(it.id) !== -1 ? " on" : "") + '" ' +
        'aria-pressed="' + (q.on.indexOf(it.id) !== -1) + '" data-action="qfeat" data-scope="' + q.scope + '" ' +
        'data-id="' + it.id + '">' + esc(it.label) + '</button>').join("") +
    '</div></div>';
  }

  /* ---------- Space card ---------- */
  /* Four stacked lines under the photo — title + rating, a description line, a
     spec line, then the price — the same hierarchy as an Airbnb listing card. */
  function card(l) {
    const p = D.priceLabel(l), fav = Q.store.isFav(l.id), sel = Q.store.get().selectedId === l.id;
    const cat = D.categories.find(x => x.id === l.category);
    const dots = l.photos.slice(0, 5).map((_, i) =>
      '<span class="dot' + (i ? "" : " on") + '"></span>').join("");
    return '<article class="card' + (sel ? " sel" : "") + '" data-action="open" data-id="' + l.id + '" data-pinid="' + l.id + '">' +
      '<div class="media"><img src="' + l.photos[0] + '" alt="' + esc(l.title) + '" loading="lazy">' +
        (l.badge ? '<span class="badge">' + esc(l.badge) + '</span>' : "") +
        '<button class="fav' + (fav ? " on" : "") + '" data-action="fav" data-id="' + l.id + '" aria-label="В избранное">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,.5)" stroke="#fff" stroke-width="2" stroke-linejoin="round">' + paths.heart + '</svg>' +
        '</button>' +
        '<span class="dots">' + dots + '</span>' +
      '</div>' +
      '<div class="cardbody">' +
        '<div class="titlerow"><span class="title">' + esc(cat.label) + ' · ' + esc(l.district) + '</span>' +
          '<span class="rate">' + icFill("star", 12) + l.rating.toFixed(2).replace(".", ",") +
            ' <span class="rev">(' + l.reviews + ')</span></span></div>' +
        '<div class="cline">' + esc(l.title) + '</div>' +
        '<div class="cline">' + l.sizeM2 + ' м² · ' + esc(l.city) +
          (l.availableNow ? ' · свободно сейчас' : '') + '</div>' +
        '<div class="price"><b>' + p.main + '</b> <span>' + p.unit + '</span></div>' +
        '<div class="ctags"><span class="ctag">Без предоплаты</span>' +
          '<span class="ctag">Бесплатная отмена</span></div>' +
      '</div>' +
    '</article>';
  }

  /* ---------- Map ---------- */
  function mapCanvas() {
    return '<div class="map-canvas">' +
      '<div class="water" style="right:-40px;bottom:60px;width:170px;height:200px;transform:rotate(16deg)"></div>' +
      '<div class="blob" style="left:-30px;top:34%;width:150px;height:150px"></div>' +
      '<div class="blob" style="right:8%;top:30%;width:110px;height:110px"></div>' +
      '<div class="road" style="left:0;right:0;top:36%;height:10px;transform:rotate(-5deg)"></div>' +
      '<div class="road" style="left:0;right:0;top:62%;height:8px;transform:rotate(4deg)"></div>' +
      '<div class="road" style="top:12%;bottom:0;left:34%;width:9px;transform:rotate(6deg)"></div>' +
      '<div class="road" style="top:12%;bottom:0;left:64%;width:8px;transform:rotate(-4deg)"></div>' +
      '<div class="map-lbl" style="left:40%;top:36%">АРБАТ</div>' +
      '<div class="map-lbl" style="left:12%;top:52%">ХАМОВНИКИ</div>' +
    '</div>';
  }
  /* The whole pane: a stage that pans/zooms under a fixed set of controls.
     Q.app drives the transform — see the map interaction block there. */
  /* Two layers: the Yandex map mounts into #ymap, and the hand-drawn stage
     underneath it stands in until (or unless) the API comes up.

     With a key configured the pane starts `pending`, which keeps the fallback
     hidden — otherwise it would paint first and then be swapped out from under
     the user. It is revealed only if the API never arrives. */
  function mapPane(list) {
    const pending = (Q.ymap && Q.ymap.available() && !Q.ymap.live()) ? " pending" : "";
    return '<div class="map-pane' + pending + '" id="mapPane">' +
      '<div class="ymap" id="ymap"></div>' +
      '<div class="map-stage" id="mapStage">' + mapCanvas() + pins(list) + '</div>' +
      '<div class="map-ctl">' +
        '<button type="button" class="map-btn" data-action="map-reset" aria-label="Сбросить масштаб">' + ic("expand", 16, 2) + '</button>' +
      '</div>' +
      '<div class="map-ctl map-zoom">' +
        '<button type="button" class="map-btn" data-action="map-zoom" data-d="1" aria-label="Приблизить">' + ic("plus", 16, 2) + '</button>' +
        '<button type="button" class="map-btn" data-action="map-zoom" data-d="-1" aria-label="Отдалить">' + ic("minus", 16, 2) + '</button>' +
      '</div>' +
    '</div>';
  }
  /* One price bubble. `placed` positions it by percentage for the fallback map;
     on the Yandex layer the placemark owns the position, so it is left off. */
  function pinHtml(l, placed) {
    const sel = Q.store.get().selectedId === l.id;
    const label = l.category === "ploshad" ? D.fmt(l.pricePerM2) + " ₽/м²" : D.fmt(l.price) + " ₽";
    return '<button class="pin' + (sel ? " sel" : "") + (placed ? "" : " on-ymap") + '"' +
      (placed ? ' style="left:' + l.map.x + '%;top:' + l.map.y + '%"' : "") +
      ' data-action="pin" data-id="' + l.id + '" data-pinid="' + l.id + '">' + label + '</button>';
  }
  function pins(list) { return list.map(l => pinHtml(l, true)).join(""); }

  /* ---------- Calendar ----------
     Real month grid: weekday columns are computed from the date, leading/trailing
     cells come from the neighbouring months, and past days are not selectable.
     Selection is a range: `a` is the start, `b` the (optional) end. Passing only
     `a` gives plain single-date behaviour, which is what the inquiry form wants.

     Every day is a .cell (full grid column, carries the range band) wrapping a
     .day (the 38px circle), so the band between the two ends reads as one bar. */
  function rangeCls(iso, a, b) {
    if (!a) return "";
    if (iso === a) return b ? "sel start" : "sel start end";
    if (!b) return "";
    if (iso === b) return "sel end";
    return (iso > a && iso < b) ? "in" : "";     // ISO dates compare as strings
  }
  function dayCell(cls, n, attrs) {
    // range classes live on the cell (band) and the day (circle) alike
    return '<span class="cell ' + cls + '"><span class="day ' + cls + '"' + (attrs || "") + '>' + n + '</span></span>';
  }
  /* `ns` namespaces the data-action names (e.g. "x-" → x-calday/x-calnav) so a
     second calendar on the page can be driven by its own handlers. */
  function calendar(year, month, a, b, ns) {
    const todayISO = D.toISO(D.today());
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;                 // Mon = 0
    const days = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    let out = D.DOW.map(d => '<span class="dow">' + d + '</span>').join("");
    for (let i = lead; i > 0; i--) out += dayCell("out", prevDays - i + 1);
    for (let d = 1; d <= days; d++) {
      const iso = D.toISO(new Date(year, month, d));
      const past = iso < todayISO;
      const cls = rangeCls(iso, a, b) + (past ? " mut" : "") + (iso === todayISO ? " today" : "");
      out += dayCell(cls, d, past ? "" : ' data-action="' + (ns || "") + 'calday" data-date="' + iso + '" role="button" tabindex="0"');
    }
    const tail = (7 - ((lead + days) % 7)) % 7;
    for (let d = 1; d <= tail; d++) out += dayCell("out", d);
    return '<div class="cal-grid">' + out + '</div>';
  }
  /* Two months side by side (the second collapses away on narrow screens),
     with the month arrows pinned to the outer edges — as on Airbnb. */
  function calBlock(year, month, a, b, months, ns) {
    const t = D.today();
    const atMin = (year === t.getFullYear() && month === t.getMonth());
    const p = ns || "";
    let out = '<div class="cal-wrap">' +
      '<button class="cal-nav prev" data-action="' + p + 'calnav" data-d="-1" aria-label="Предыдущий месяц"' +
        (atMin ? ' disabled' : '') + '>' + ic("chevL", 16, 2) + '</button>' +
      '<button class="cal-nav next" data-action="' + p + 'calnav" data-d="1" aria-label="Следующий месяц">' + ic("chevR", 16, 2) + '</button>' +
      '<div class="cal-months">';
    for (let i = 0; i < (months || 1); i++) {
      const m = month + i, y = year + Math.floor(m / 12), mm = ((m % 12) + 12) % 12;
      out += '<div class="cal-month' + (i ? " second" : "") + '">' +
        '<div class="cal-title">' + D.MONTHS_NOM[mm] + ' ' + y + '</div>' + calendar(y, mm, a, b, ns) + '</div>';
    }
    return out + '</div></div>';
  }
  /* Prompt under the Даты/Гибко switch — tells you which end you're picking. */
  function calHint(a, b) {
    if (!a) return "Выберите дату заезда";
    if (!b) return "Выберите дату выезда";
    const n = D.nights(a, b);
    return D.dateRange(a, b) + " · " + n + " " + (n % 10 === 1 && n % 100 !== 11 ? "день" :
      (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "дня" : "дней"));
  }

  /* ---------- Filter modal ---------- */
  /* ---------- Фильтры modal ----------
     The Airbnb filter-modal layout (centred sheet, sticky header, sectioned
     scroll body, sticky action footer), carrying whichever category's filter
     set is active. The sections and the footer bar come from the per-category
     modules, so the modal is only the shell — see filters.js / space.js /
     sklad.js. Their existing repaint selectors resolve inside it unchanged. */
  const FILTER_MOD = { garage: () => Q.filters, ploshad: () => Q.space, sklad: () => Q.sklad };
  function filterModule() {
    const m = FILTER_MOD[Q.store.get().category];
    return m ? m() : null;
  }
  function filterModal() {
    const mod = filterModule();
    if (!mod) return "";
    return '<div class="fmodal" role="dialog" aria-modal="true" aria-labelledby="fmTitle">' +
      '<header class="fm-head">' +
        '<h2 id="fmTitle">Фильтры</h2>' +
        '<button type="button" class="fm-close" data-action="close-modal" aria-label="Закрыть">' +
          ic("x", 16, 2.2) + '</button>' +
      '</header>' +
      '<div class="fm-body">' + mod.sections() + '</div>' +
      mod.footBar() +
    '</div>';
  }

  /* ---------- Search sheet ----------
     Just the place picker now: the category is chosen on the hero cards (or the
     results tabs), and dates live on the per-category filter pages. */
  const TERMS = ["Месяц", "Полгода", "Год"];

  function placeRow(p, sel) {
    return '<button class="suggest' + (sel ? " on" : "") + '" data-action="pick-place" data-id="' + esc(p.id) + '">' +
      '<span class="ico k-' + p.kind + '">' + ic(p.icon, 22, 1.6) + '</span>' +
      '<span class="tx"><span class="t">' + esc(p.name) + '</span><span class="s">' + esc(p.sub) + '</span></span></button>';
  }
  function placeList(q, selId) {
    const list = D.matchPlaces(q, 6);
    if (!list.length) return '<div class="suggest-empty">Ничего не найдено. Попробуйте «Москва» или «Тверской».</div>';
    // "Рядом" is the default, so don't mark it as an active choice
    return list.map(p => placeRow(p, p.id === selId && p.kind !== "any")).join("");
  }

  function wherePanel(d) {
    return '<label class="search-input">' + ic("search", 20, 1.8) +
        '<input type="text" placeholder="Город или район" id="qPlace" autocomplete="off" value="' + esc(d.placeQuery || "") + '">' +
        '<button class="input-x" data-action="place-clear" aria-label="Очистить">' + ic("x", 12, 2.2) + '</button>' +
      '</label>' +
      '<div class="sec-label">' + (d.placeQuery ? "Совпадения" : "Предложенные направления") + '</div>' +
      '<div id="placeList">' + placeList(d.placeQuery, d.place.id) + '</div>';
  }

  /* Two-month range picker for the hero bar's "Когда". Uses the unprefixed
     calday/calnav actions, which the search dropdown owns. */
  function whenPanel(d) {
    return '<div class="pop-when-hint">' + calHint(d.dateISO, d.dateEndISO) + '</div>' +
      calBlock(d.calYear, d.calMonth, d.dateISO, d.dateEndISO, 2);
  }

  /* The dropdown that hangs under the search bar, anchored to whatever opened it. */
  const PANELS = {
    where: { title: "Куда вам нужно место", body: wherePanel },
    when:  { title: "На какой срок нужно место", body: whenPanel },
  };
  function searchPop(d) {
    const p = PANELS[d.panel] || PANELS.where;
    return '<div class="searchpop pop-' + d.panel + '" role="dialog" aria-label="Поиск места">' +
      '<div class="pop-body">' + (p.title ? '<div class="pop-title">' + p.title + '</div>' : "") + p.body(d) + '</div>' +
      '<div class="pop-foot">' +
        '<button class="linkbtn" data-action="search-clear">Очистить всё</button>' +
        '<span class="pop-count" id="scount"></span>' +
      '</div>' +
    '</div>';
  }

  /* ---------- Inquiry modal ---------- */
  function inquiryModal(l, d) {
    const p = D.priceLabel(l);
    return modalShell("Отправить заявку",
      '<div class="fsec" style="border-bottom:0">' +
        '<div style="display:flex;gap:14px;align-items:center;margin-bottom:8px">' +
          '<img src="' + l.photos[0] + '" style="width:84px;height:64px;border-radius:12px;object-fit:cover" alt="">' +
          '<div><div style="font-weight:700">' + esc(l.title) + '</div><div style="color:var(--ink-soft);font-size:14px">' + esc(l.district) + ' · ' + l.sizeM2 + ' м²</div>' +
          '<div style="font-weight:700;margin-top:2px">' + p.main + ' <small style="font-weight:600;color:var(--ink-soft)">' + p.unit + '</small></div></div>' +
        '</div>' +
        '<h3 style="margin-top:16px">Когда заселяетесь?</h3>' + calBlock(d.calYear, d.calMonth, d.dateISO, null, 1) +
        '<div class="sec-label">Срок аренды</div>' +
        '<div class="term-chips" data-group="iterm">' +
          TERMS.map(t => '<button class="chip-out' + (d.term === t ? " active" : "") + '" data-action="iterm" data-t="' + t + '">' + t + '</button>').join("") +
        '</div>' +
        '<div class="demo-hint" style="margin-top:18px">' + ic("shield", 18, 1.7) + '<span>Оплата не требуется. Владелец получит заявку и свяжется с вами для подтверждения (демо).</span></div>' +
      '</div>',
      '<span style="font-weight:700;font-size:16px">' + p.main + ' <small style="font-weight:600;color:var(--ink-soft)">' + p.unit + '</small></span>' +
      '<button class="btn btn-primary" data-action="inquiry-send" data-id="' + l.id + '">Отправить заявку</button>'
    );
  }

  function modalShell(title, body, foot) {
    return '<div class="modal">' +
      '<div class="modal-head"><h2>' + title + '</h2><button class="close-x" data-action="close-modal">' + ic("x", 16, 2) + '</button></div>' +
      '<div class="modal-body">' + body + '</div>' +
      (foot ? '<div class="modal-foot">' + foot + '</div>' : "") +
    '</div>';
  }

  /* ---------- Mobile bottom nav ---------- */
  function mobilenav(active) {
    const items = [["#/","explore","search","Поиск"],["#/saved","saved","heart","Избранное"],["#/trips","trips","doc","Заявки"],["#/profile","profile","user","Профиль"]];
    return '<nav class="mobilenav">' + items.map(i =>
      '<a href="' + i[0] + '" data-link class="' + (active === i[1] ? "active" : "") + '">' + ic(i[2], 22, 1.8) + '<span>' + i[3] + '</span></a>').join("") + '</nav>';
  }

  /* ---------- Site footer ----------
     Laid out to the Airbnb footer spec: three equal link columns, a hairline
     rule, then a bottom bar with the legal row left and locale + socials right.
     The copy is Qaraj's own — the app lives at /app/, so links out to the
     marketing site are relative ("../…") and anything with an in-app
     equivalent points at the route instead (Разместить место → #/host). */
  const FOOT_COLS = [
    ["Арендаторам", [
      ["../arenda-garazha-moskva/", "Аренда гаража в Москве"],
      ["../arenda-kladovki-moskva/", "Аренда кладовки в Москве"],
      ["../hranenie-veshchey-moskva/", "Хранение вещей в Москве"],
      ["../skolko-stoit-arenda-garazha/", "Сколько стоит аренда гаража"],
      ["#/search", "Найти место"],
      ["#/saved", "Избранное"],
    ]],
    ["Хозяевам", [
      ["../sdat-garazh-v-arendu/", "Сдать гараж в аренду"],
      ["../skolko-stoit-arenda-garazha/", "Сколько можно заработать"],
      ["../dogovor-arendy-garazha/", "Договор аренды гаража"],
      ["#/host", "Разместить место"],
    ]],
    ["Qaraj", [
      ["../#how", "Как это работает"],
      ["../#faq", "Вопросы и ответы"],
      ["../#why", "Защита"],
      ["../", "На сайт Qaraj"],
    ]],
  ];
  const FOOT_LEGAL = ["© 2026 Qaraj", "Конфиденциальность", "Условия", "Cookies"];
  // filled paths, unlike the stroked set in ic()
  const SOCIALS = [
    ["X", '<path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5 21H1.9l7.3-8.3L1.5 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.1h1.7L6.7 4.8H4.9l11.5 14.3Z"/>'],
    ["Instagram", '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1.3"/>'],
    ["LinkedIn", '<path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/>'],
  ];
  // in-app routes keep the router's data-link hook; site links are plain hrefs
  const footLink = (href, label) =>
    '<li><a href="' + href + '"' + (href.charAt(0) === "#" ? " data-link" : "") + '>' + esc(label) + '</a></li>';

  /* The landing's subscribe section, folded in above the columns. Same Formspree
     endpoint; _source marks the app so its sign-ups are told apart from the
     landing's. Not part of the Airbnb reference — see the note in app.css. */
  function footSub() {
    return '<div class="foot-sub">' +
      '<div class="fs-copy">' +
        '<h2>Новые места — первыми</h2>' +
        '<p>Свежие предложения хранения в вашем городе, советы и акции.</p>' +
      '</div>' +
      '<div class="fs-formwrap">' +
        '<form class="fs-form" id="footSubForm" action="https://formspree.io/f/mojownrq" method="POST" novalidate>' +
          '<input type="hidden" name="_source" value="subscribe-app-footer">' +
          '<input type="email" name="email" id="footSubEmail" placeholder="Ваш email" required autocomplete="email" aria-label="Email">' +
          '<button type="submit" class="fs-btn">Подписаться</button>' +
        '</form>' +
        '<p class="fs-note" id="footSubNote">Без спама. Отписаться можно в любой момент.</p>' +
      '</div>' +
    '</div>';
  }

  function sitefoot() {
    return '<footer class="sitefoot">' +
      '<div class="foot-wrap">' +
        footSub() +
        '<div class="foot-cols">' +
          FOOT_COLS.map((col, i) => {
            const id = "footcol" + i;
            return '<nav class="foot-col" aria-labelledby="' + id + '">' +
              '<h2 class="foot-h" id="' + id + '">' + esc(col[0]) + '</h2>' +
              '<ul>' + col[1].map(l => footLink(l[0], l[1])).join("") + '</ul>' +
            '</nav>';
          }).join("") +
        '</div>' +
        '<div class="foot-rule"></div>' +
        '<div class="foot-bottom">' +
          '<ul class="foot-legal">' + FOOT_LEGAL.map((x, i) =>
            '<li>' + (i ? '<a href="#" data-action="noop">' + esc(x) + '</a>' : esc(x)) + '</li>').join("") + '</ul>' +
          '<div class="foot-prefs">' +
            '<button type="button" class="foot-pref" data-action="noop">' + ic("globe", 16, 1.9) + 'Русский</button>' +
            '<button type="button" class="foot-pref" data-action="noop"><span class="foot-cur">₽</span>RUB</button>' +
            '<ul class="foot-social">' + SOCIALS.map(s =>
              '<li><a href="#" aria-label="' + s[0] + '" data-action="noop">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">' + s[1] + '</svg></a></li>').join("") +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  Q.c = { ic, icFill, catIcon, amIcon, appbar, filterRow, card, mapCanvas, mapPane, pins, pinHtml, calendar, calBlock, calHint,
          filterModal, searchPop, inquiryModal, mobilenav, sitefoot, refinePrompt, esc, whenLabel, placeList,
          FILTER_MOD };
})(window.Q = window.Q || {});
