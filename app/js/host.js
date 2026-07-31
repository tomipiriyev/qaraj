/* Qaraj web app — мастер регистрации владельца (10 шагов + экран успеха).
   Route: #/host. Self-contained: own state (localStorage autosave), own icon
   set, own delegated event handler (data-h="…", so it never collides with
   app.js's data-action switch). Copy is Russian; the three listing types
   mirror the product model — Площадь по м² / Склад / Гараж. */
(function (Q) {
  const LS = "qaraj_host_draft_v1";
  const STEPS = 10;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  /* ---------------- Icons ---------------- */
  const P = {
    check:'<path d="m5 12 5 5 9-11"/>', x:'<path d="m6 6 12 12M18 6 6 18"/>',
    chevL:'<path d="m15 6-6 6 6 6"/>', chevR:'<path d="m9 6 6 6-6 6"/>',
    box:'<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    grid:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 4v16M4 12h16"/>',
    garage:'<path d="M3 10 12 4l9 6"/><path d="M5 10v10h14V10M8 20v-5h8v5"/>',
    shelves:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16"/>',
    basement:'<path d="M4 4h16v5H4z"/><path d="M6 9v11h12V9M9 20v-5h6v5"/>',
    container:'<rect x="2.5" y="7" width="19" height="10" rx="1.5"/><path d="M7 7v10M12 7v10M17 7v10"/>',
    warehouse:'<path d="M3 20V9l9-5 9 5v11"/><path d="M7 20v-7h10v7M7 16h10"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pinloc:'<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    crosshair:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    ruler:'<path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    key:'<circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21l-2 2.5M17 12v3"/>',
    keypad:'<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="9" cy="8" r="1"/><circle cx="15" cy="8" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="16" r="1"/><circle cx="15" cy="16" r="1"/>',
    people:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 20c1-3.2 3-5 5.5-5s4.5 1.8 5.5 5M15 20c.6-2.2 2-3.6 3.6-3.6 1.3 0 2.4.8 3 2.2"/>',
    door:'<path d="M6 3h9a2 2 0 0 1 2 2v16H6zM17 21h3M14 12v1"/>',
    wallet:'<path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M3 7h16a2 2 0 0 1 2 2v2h-5a2 2 0 0 0 0 4h5"/>',
    card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h3.5"/>',
    idcard:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5 16c.7-1.4 2-2.2 3.5-2.2S11.3 14.6 12 16M14.5 10h4M14.5 13.5h4"/>',
    selfie:'<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="10" r="2.6"/><path d="M7.5 18c1-2 2.6-3 4.5-3s3.5 1 4.5 3"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/>',
    shield:'<path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    lock:'<rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    bolt:'<path d="M13 3 5 13h6l-2 8 8-11h-6l2-7Z"/>',
    cam:'<rect x="3" y="6" width="14" height="10" rx="2"/><path d="m17 9 4-2v8l-4-2"/>',
    bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2 1 1.9v.2h5v-.2c.1-.7.4-1.4 1-1.9A6 6 0 0 0 12 3Z"/>',
    plug:'<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v5"/>',
    cart:'<path d="M3 4h2.2l2.4 11h9.2L19 8H7"/><circle cx="10" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    truck:'<path d="M3 17V7h11v10M14 11h4l3 3v3M3 17h1M11 17h4"/><circle cx="7" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/>',
    flame:'<path d="M12 3s5 4.5 5 9a5 5 0 0 1-10 0c0-1.7.8-3 1.6-4 .3 1.2 1 2 1.9 2 1.2 0 1.5-1.4 1.5-3 0-2-.9-3-.9-4Z"/>',
    dry:'<path d="M12 3.5 7 10a5.6 5.6 0 1 0 10 0L12 3.5Z"/><path d="m4 20 16-16"/>',
    dots:'<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
    pencil:'<path d="M4 20h4L18 10l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
    trash:'<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    upload:'<path d="M12 16V4M8 8l4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    doc:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M8 16h5"/>',
    star:'<path d="m12 2 3 6.5 7 .6-5.3 4.6L18.4 21 12 17.3 5.6 21l1.7-7.3L2 9.1l7-.6L12 2Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    repeat:'<path d="M4 9V7a3 3 0 0 1 3-3h10l-3-3M20 15v2a3 3 0 0 1-3 3H7l3 3"/>',
    coins:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  };
  function ic(n, s, w) {
    return '<svg width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + '</svg>';
  }
  /* line-art scenes for the three type cards */
  const ILL = {
    ploshad: '<svg width="118" height="76" viewBox="0 0 118 76" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M6 68h106" stroke-opacity=".35"/><rect x="14" y="40" width="34" height="28" rx="2"/><rect x="20" y="24" width="22" height="16" rx="2"/><path d="M14 54h34M31 40v28" stroke-opacity=".45"/><rect x="62" y="30" width="42" height="38" rx="3" stroke-dasharray="5 4"/><path d="M70 46h26M83 38v16" stroke-opacity=".6"/><circle cx="83" cy="46" r="3.2" fill="currentColor" stroke="none"/></svg>',
    sklad:   '<svg width="118" height="76" viewBox="0 0 118 76" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M6 68h106" stroke-opacity=".35"/><path d="M22 68V30l37-18 37 18v38"/><path d="M40 68V44h38v24"/><path d="M40 56h38" stroke-opacity=".5"/><rect x="52" y="20" width="14" height="10" rx="1.5" stroke-opacity=".55"/></svg>',
    garage:  '<svg width="118" height="76" viewBox="0 0 118 76" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M6 68h106" stroke-opacity=".35"/><path d="M16 34 59 12l43 22"/><path d="M26 34v34h66V34"/><rect x="38" y="44" width="42" height="24" rx="2"/><path d="M38 52h42M38 60h42" stroke-opacity=".45"/></svg>',
  };

  /* ---------------- Reference data ---------------- */
  const TYPES = [
    { id: "ploshad", ill: "ploshad", t: "Площадь по м²",  d: "Для коробок, шин и личных вещей — сдаётся часть помещения" },
    { id: "sklad",   ill: "sklad",   t: "Склад целиком",  d: "Закрытое помещение под ключ — арендатор получает его полностью" },
    { id: "garage",  ill: "garage",  t: "Гараж",          d: "Отдельный бокс под авто — цена за место, по размеру машины" },
  ];
  const SPACES = [
    { id: "garage",    icon: "garage",    t: "Гараж",              d: "Отдельно стоящий бокс или гараж в кооперативе" },
    { id: "kladovka",  icon: "shelves",   t: "Кладовая",           d: "Кладовка в квартире, доме или на этаже" },
    { id: "basement",  icon: "basement",  t: "Подвал",             d: "Подвальное или цокольное помещение" },
    { id: "container", icon: "container", t: "Контейнер",          d: "Морской или складской контейнер" },
    { id: "warehouse", icon: "warehouse", t: "Коммерческий склад", d: "Складское помещение или его часть" },
  ];
  const ACCESS = [
    { id: "key",    icon: "key",    t: "Физический ключ",    d: "Передаёте ключ при заселении" },
    { id: "pin",    icon: "keypad", t: "PIN-код",            d: "Кодовый замок, код отправляется арендатору" },
    { id: "person", icon: "people", t: "Личная передача",    d: "Встречаете арендатора лично" },
    { id: "self",   icon: "door",   t: "Самостоятельный вход", d: "Круглосуточный доступ без встречи" },
  ];
  const FEATURES = [
    { id: "guard",  icon: "shield", t: "Охрана" },
    { id: "cctv",   icon: "cam",    t: "Видеонаблюдение" },
    { id: "light",  icon: "bulb",   t: "Освещение" },
    { id: "power",  icon: "plug",   t: "Розетки" },
    { id: "cart",   icon: "cart",   t: "Тележка" },
    { id: "dock",   icon: "truck",  t: "Погрузочная зона" },
    { id: "heat",   icon: "flame",  t: "Отопление" },
    { id: "dry",    icon: "dry",    t: "Сухое помещение" },
    { id: "other",  icon: "dots",   t: "Другое" },
  ];
  const PHOTO_CATS = [
    { id: "out",   t: "Снаружи" }, { id: "in", t: "Внутри" },
    { id: "entry", t: "Вход" },    { id: "other", t: "Другое" },
  ];
  const DOW = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const CURRENCIES = [{ id: "RUB", sym: "₽", t: "₽ Российский рубль" }, { id: "KZT", sym: "₸", t: "₸ Тенге" }, { id: "BYN", sym: "Br", t: "Br Белорусский рубль" }];
  const COUNTRIES = ["Россия", "Казахстан", "Беларусь", "Армения", "Узбекистан"];
  /* recommendation baselines, ₽/мес — placeholders like the landing calculator */
  const BASE_PRICE = { ploshad: 700, sklad: 620, garage: 480 };

  /* ---------------- State ---------------- */
  const DEFAULTS = () => ({
    step: 1, done: false,
    listingType: null, spaceType: null,
    address: "", pin: { x: 46, y: 44 }, geo: null,
    totalM2: 20, rentM2: 10, minM2: 1, minCustom: false,
    dateFrom: "", dateTo: "", access: null,
    recur: "always", weekdays: [], blockFrom: "", blockTo: "",
    price: "", currency: "RUB", payMonthly: true, payDiscount: false, payLong: false,
    desc: "", features: [], photos: [], photoCat: "out",
    verify: { id: false, selfie: false, country: "" }, agree1: false, agree2: false,
    card: { number: "", exp: "", cvv: "", name: "", country: "Россия" },
  });
  let st = DEFAULTS();
  let dir = "fwd";              // step transition direction
  let saveT = 0;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS) || "null");
      if (raw) st = Object.assign(DEFAULTS(), raw, {
        verify: Object.assign(DEFAULTS().verify, raw.verify || {}),
        card: Object.assign(DEFAULTS().card, raw.card || {}),
        pin: Object.assign(DEFAULTS().pin, raw.pin || {}),
      });
    } catch (e) { st = DEFAULTS(); }
  }
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem(LS, JSON.stringify(st)); }
      catch (e) {
        // photo data URLs can blow the quota — keep the meta, drop the pixels
        try {
          localStorage.setItem(LS, JSON.stringify(Object.assign({}, st,
            { photos: st.photos.map(p => ({ id: p.id, cat: p.cat, name: p.name, src: "" })) })));
        } catch (e2) {}
      }
      flashSaved();
    }, 350);
  }
  function flashSaved() {
    const el = document.getElementById("hwSaved");
    if (!el) return;
    el.classList.add("on");
    setTimeout(() => el.classList.remove("on"), 1100);
  }
  function reset() { st = DEFAULTS(); try { localStorage.removeItem(LS); } catch (e) {} }

  /* ---------------- Small render helpers ---------------- */
  const err = (name) => '<div class="hw-err" data-err="' + name + '">' + ic("info", 14, 2) + '<span></span></div>';
  const info = (title, body, grey) =>
    '<div class="hw-info' + (grey ? " grey" : "") + '"><span class="ic">' + ic("info", 20, 1.8) + '</span>' +
    '<div><b>' + title + '</b><p>' + body + '</p></div></div>';
  const currency = () => (CURRENCIES.find(c => c.id === st.currency) || CURRENCIES[0]).sym;
  const typeMeta = () => TYPES.find(t => t.id === st.listingType) || null;
  const spaceMeta = () => SPACES.find(s => s.id === st.spaceType) || null;
  const priceUnit = () => st.listingType === "ploshad" ? "за м² / мес." : "за место / мес.";
  const dateRu = (iso) => {
    if (!iso) return "—";
    const p = iso.split("-");
    return p[2] + "." + p[1] + "." + p[0];
  };

  /* ---------------- Steps ---------------- */
  const STEP = {};

  /* 1 — что сдаём */
  STEP[1] = () =>
    '<h1 class="hw-title">Что вы хотите сдавать?</h1>' +
    '<p class="hw-sub">Выберите тип объявления. От него зависит, как считается цена и что увидит арендатор.</p>' +
    '<div class="hw-cards" role="radiogroup" aria-label="Тип объявления">' +
      TYPES.map(t =>
        '<button type="button" class="hw-card" role="radio" aria-checked="' + (st.listingType === t.id) + '" ' +
          'data-h="type" data-id="' + t.id + '">' +
          '<span class="tick">' + ic("check", 15, 2.4) + '</span>' +
          '<span class="ill">' + ILL[t.ill] + '</span>' +
          '<span class="tx"><span class="t">' + t.t + '</span><span class="d">' + t.d + '</span></span>' +
        '</button>').join("") +
    '</div>' + err("listingType") +
    info("Можно изменить позже", "Тип объявления влияет только на карточку и расчёт цены — вы сможете отредактировать его в любой момент до публикации.");

  /* 2 — тип помещения */
  STEP[2] = () =>
    '<h1 class="hw-title">Какое это помещение?</h1>' +
    '<p class="hw-sub">Выберите, что именно вы сдаёте. Так арендаторы быстрее найдут ваше место в поиске.</p>' +
    '<div class="hw-rows" role="radiogroup" aria-label="Тип помещения">' +
      SPACES.map(s =>
        '<button type="button" class="hw-row" role="radio" aria-checked="' + (st.spaceType === s.id) + '" ' +
          'data-h="space" data-id="' + s.id + '">' +
          '<span class="ico">' + ic(s.icon, 24, 1.7) + '</span>' +
          '<span class="tx"><b>' + s.t + '</b><span>' + s.d + '</span></span>' +
          '<span class="mark">' + ic("check", 14, 2.6) + '</span>' +
        '</button>').join("") +
    '</div>' + err("spaceType");

  /* 3 — расположение */
  STEP[3] = () =>
    '<h1 class="hw-title">Где находится помещение?</h1>' +
    '<p class="hw-sub">Введите адрес или найдите его на карте. Точку можно перетащить, чтобы уточнить вход.</p>' +
    '<div class="hw-cols wide-left">' +
      '<div>' +
        '<div class="hw-field"><label for="hwAddr">Адрес</label>' +
          '<div class="hw-search"><span class="mag">' + ic("search", 18, 1.9) + '</span>' +
            '<input id="hwAddr" class="hw-input" type="text" autocomplete="street-address" ' +
              'placeholder="Город, улица, дом" value="' + esc(st.address) + '" data-h="addr">' +
          '</div>' + err("address") +
          '<div class="hw-hint">Например: Москва, Пресненский район, ул. Красная Пресня, 12</div>' +
        '</div>' +
        '<button type="button" class="hw-geo" data-h="geo">' + ic("crosshair", 18, 1.9) + 'Использовать моё местоположение</button>' +
        (st.geo ? '<div class="hw-hint">Координаты: ' + esc(st.geo) + '</div>' : "") +
        info("Точный адрес скрыт", "Пока бронирование не подтверждено, арендатор видит только район и примерную точку на карте. Полный адрес открывается после бронирования.") +
      '</div>' +
      '<div>' +
        '<div class="hw-map" id="hwMap" data-h="map">' +
          (Q.c && Q.c.mapCanvas ? Q.c.mapCanvas() : '<div class="map-canvas"></div>') +
          '<span class="hw-pin" id="hwPin" style="left:' + st.pin.x + '%;top:' + st.pin.y + '%" ' +
            'role="button" tabindex="0" aria-label="Метка помещения — перетащите или используйте стрелки">' +
            '<svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" stroke="#fff" stroke-width="1.4">' +
            '<path d="M12 22s7-6.4 7-12A7 7 0 1 0 5 10c0 5.6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg>' +
          '</span>' +
          '<span class="hw-map-hint">Перетащите метку или нажмите на карту</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* 4 — доступная площадь */
  STEP[4] = () => {
    const quick = [1, 2, 5];
    return '<h1 class="hw-title">Сколько площади вы сдаёте?</h1>' +
      '<p class="hw-sub">Укажите общий размер помещения и ту часть, которую готовы сдавать.</p>' +
      '<div class="hw-cols">' +
        '<div>' +
          '<div class="hw-field"><label for="hwTotal">Общая площадь помещения</label>' +
            '<div class="hw-suffix"><input id="hwTotal" class="hw-input" type="number" min="1" max="1000" step="0.5" ' +
              'inputmode="decimal" value="' + st.totalM2 + '" data-h="total"><span class="sfx">м²</span></div>' +
            err("totalM2") +
          '</div>' +
          '<div class="hw-field"><label for="hwRent">Доступно для аренды</label>' +
            '<div class="hw-range-head"><b id="hwRentVal">' + st.rentM2 + ' м²</b>' +
              '<span class="hw-hint" style="margin:0">из ' + st.totalM2 + ' м²</span></div>' +
            '<input id="hwRent" class="hw-range" type="range" min="1" max="' + Math.max(1, st.totalM2) + '" step="0.5" ' +
              'value="' + Math.min(st.rentM2, st.totalM2) + '" data-h="rent" aria-label="Доступная для аренды площадь">' +
            '<div class="hw-range-scale"><span>1 м²</span><span>' + st.totalM2 + ' м²</span></div>' +
            err("rentM2") +
          '</div>' +
          '<div class="hw-sec"><h2>Минимальный размер аренды</h2>' +
            '<div class="hw-note">Меньше этой площади арендатор забронировать не сможет.</div>' +
            '<div class="hw-chips" role="group" aria-label="Минимальный размер аренды">' +
              quick.map(v => '<button type="button" class="hw-chip" aria-pressed="' + (!st.minCustom && st.minM2 === v) + '" ' +
                'data-h="min" data-v="' + v + '"><span class="tick">' + ic("check", 14, 2.6) + '</span>' + v + ' м²</button>').join("") +
              '<button type="button" class="hw-chip" aria-pressed="' + st.minCustom + '" data-h="min" data-v="custom">Другое</button>' +
            '</div>' +
            (st.minCustom ? '<div class="hw-field" style="max-width:240px"><label for="hwMin">Свой размер</label>' +
              '<div class="hw-suffix"><input id="hwMin" class="hw-input" type="number" min="0.5" step="0.5" inputmode="decimal" ' +
              'value="' + st.minM2 + '" data-h="minval"><span class="sfx">м²</span></div></div>' : "") +
            err("minM2") +
          '</div>' +
        '</div>' +
        '<div>' +
          info("Арендатор бронирует только выбранную площадь",
               "Он оплачивает лишь ту часть, которую забронировал, а не всё помещение. Остальное пространство остаётся вашим — можно сдать его другому арендатору.") +
          info("Как считать площадь", "Учитывайте только полезную площадь, до которой арендатор действительно может дотянуться: без проходов, колонн и зоны у двери.", true) +
        '</div>' +
      '</div>';
  };

  /* 5 — доступность */
  STEP[5] = () =>
    '<h1 class="hw-title">Когда помещение доступно?</h1>' +
    '<p class="hw-sub">Укажите период, способ доступа и повторяющееся расписание.</p>' +
    '<div class="hw-sec"><h2>Период доступности</h2>' +
      '<div class="hw-note">С какой даты помещение можно занять.</div>' +
      '<div class="hw-inline">' +
        '<div><label class="hw-lbl" for="hwFrom">Дата заезда</label>' +
          '<input id="hwFrom" class="hw-input" type="date" value="' + esc(st.dateFrom) + '" data-h="from"></div>' +
        '<div><label class="hw-lbl" for="hwTo">Дата окончания <span style="color:var(--hmute);font-weight:500">(необязательно)</span></label>' +
          '<input id="hwTo" class="hw-input" type="date" value="' + esc(st.dateTo) + '" data-h="to"></div>' +
      '</div>' + err("dateFrom") + err("dateTo") +
    '</div>' +
    '<div class="hw-sec"><h2>Способ доступа</h2>' +
      '<div class="hw-note">Как арендатор попадёт внутрь.</div>' +
      '<div class="hw-opts" role="radiogroup" aria-label="Способ доступа">' +
        ACCESS.map(a =>
          '<label class="hw-opt"><input type="radio" name="hwAccess" value="' + a.id + '" data-h="access"' +
            (st.access === a.id ? " checked" : "") + '>' +
            '<span class="ico">' + ic(a.icon, 22, 1.7) + '</span>' +
            '<span><b>' + a.t + '</b><small>' + a.d + '</small></span></label>').join("") +
      '</div>' + err("access") +
    '</div>' +
    '<div class="hw-sec"><h2>Повторяющаяся доступность</h2>' +
      '<div class="hw-note">Можно открыть доступ постоянно или только в выбранные дни.</div>' +
      '<div class="hw-opts" role="radiogroup" aria-label="Повторяющаяся доступность">' +
        [["always", "Всегда доступно", "Помещение открыто для брони круглый год"],
         ["days", "Доступно по выбранным дням недели", "Например, только в будни"],
         ["block", "Недоступно в выбранный период", "Отпуск, ремонт или свои дела"]].map(o =>
          '<label class="hw-opt"><input type="radio" name="hwRecur" value="' + o[0] + '" data-h="recur"' +
            (st.recur === o[0] ? " checked" : "") + '>' +
            '<span><b>' + o[1] + '</b><small>' + o[2] + '</small></span></label>').join("") +
      '</div>' +
      (st.recur === "days"
        ? '<div class="hw-days" role="group" aria-label="Дни недели">' +
            DOW.map((d, i) => '<button type="button" class="hw-day" aria-pressed="' + (st.weekdays.indexOf(i) !== -1) + '" ' +
              'data-h="weekday" data-i="' + i + '">' + d + '</button>').join("") + '</div>' + err("weekdays")
        : "") +
      (st.recur === "block"
        ? '<div class="hw-inline" style="margin-top:12px">' +
            '<div><label class="hw-lbl" for="hwBlockFrom">Недоступно с</label>' +
              '<input id="hwBlockFrom" class="hw-input" type="date" value="' + esc(st.blockFrom) + '" data-h="blockfrom"></div>' +
            '<div><label class="hw-lbl" for="hwBlockTo">по</label>' +
              '<input id="hwBlockTo" class="hw-input" type="date" value="' + esc(st.blockTo) + '" data-h="blockto"></div>' +
          '</div>' + err("block")
        : "") +
    '</div>' +
    info("Чем шире доступность, тем больше броней", "Объявления с открытой датой заезда и доступом 24/7 получают заметно больше заявок, чем места с узким окном.");

  /* 6 — цена */
  STEP[6] = () => {
    const base = BASE_PRICE[st.listingType] || 600;
    const lo = Math.round(base * 0.85), hi = Math.round(base * 1.25);
    const perSpace = st.listingType !== "ploshad";
    const rec = perSpace ? [Math.round(lo * st.rentM2), Math.round(hi * st.rentM2)] : [lo, hi];
    return '<h1 class="hw-title">Назначьте цену</h1>' +
      '<p class="hw-sub">Вы всегда сможете изменить её позже — цена не фиксируется на момент публикации.</p>' +
      '<div class="hw-cols">' +
        '<div>' +
          '<div class="hw-field"><label for="hwPrice">Цена ' + (perSpace ? "за помещение в месяц" : "за квадратный метр в месяц") + '</label>' +
            '<div class="hw-inline">' +
              '<div class="hw-suffix"><input id="hwPrice" class="hw-input" type="number" min="1" step="50" inputmode="numeric" ' +
                'placeholder="' + rec[0] + '" value="' + esc(st.price) + '" data-h="price"><span class="sfx">' + currency() + '</span></div>' +
              '<select class="hw-select" aria-label="Валюта" data-h="currency" style="max-width:230px">' +
                CURRENCIES.map(c => '<option value="' + c.id + '"' + (st.currency === c.id ? " selected" : "") + '>' + c.t + '</option>').join("") +
              '</select>' +
            '</div>' + err("price") +
            (st.price && !perSpace ? '<div class="hw-hint">При ' + st.rentM2 + ' м² это около <b>' + fmt(st.price * st.rentM2) + ' ' + currency() + '</b> в месяц.</div>' : "") +
          '</div>' +
          '<div class="hw-sec"><h2>Условия оплаты</h2>' +
            sw("Помесячная оплата", "Арендатор платит раз в месяц", "payMonthly") +
            sw("Скидка за несколько месяцев", "−10% при оплате от 3 месяцев вперёд", "payDiscount") +
            sw("Долгосрочная аренда", "Готовы сдавать от полугода и дольше", "payLong") +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="hw-info" style="flex-direction:column;gap:8px">' +
            '<div style="display:flex;align-items:center;gap:10px;color:var(--hb)">' + ic("coins", 22, 1.7) +
              '<b style="font-size:15px;color:var(--hink)">Рекомендуемая цена</b></div>' +
            '<div style="font-size:26px;font-weight:700">' + fmt(rec[0]) + ' – ' + fmt(rec[1]) + ' ' + currency() + '</div>' +
            '<p style="color:var(--hsoft);font-size:13.5px">' +
              (perSpace ? "За всё помещение в месяц" : "За 1 м² в месяц") +
              ' · рассчитано по похожим объявлениям' + (spaceMeta() ? " («" + spaceMeta().t.toLowerCase() + "»)" : "") + '.</p>' +
          '</div>' +
          info("Конкурентная цена повышает видимость", "Объявления в рекомендуемом диапазоне показываются выше в поиске и чаще попадают в подборки.", true) +
        '</div>' +
      '</div>';
  };
  function sw(title, sub, key) {
    return '<div class="hw-switch"><span class="tx"><b>' + title + '</b><small>' + sub + '</small></span>' +
      '<button type="button" class="hw-sw" role="switch" aria-label="' + title + '" aria-checked="' + !!st[key] + '" ' +
        'data-h="toggle" data-k="' + key + '"></button></div>';
  }

  /* 7 — описание и фото */
  STEP[7] = () => {
    const n = st.photos.length, over = st.desc.length > 1000;
    return '<h1 class="hw-title">Описание и фотографии</h1>' +
      '<p class="hw-sub">Расскажите, чем ваше место удобно, и покажите его вживую.</p>' +
      '<div class="hw-field"><label for="hwDesc">Описание</label>' +
        '<textarea id="hwDesc" class="hw-area" maxlength="1000" data-h="desc" ' +
          'placeholder="Сухое отапливаемое помещение с отдельным входом. Ровный пол, стеллажи по стенам, рядом парковка для разгрузки…">' + esc(st.desc) + '</textarea>' +
        '<div class="hw-counter' + (over ? " over" : "") + '" id="hwDescN">' + st.desc.length + ' / 1000</div>' + err("desc") +
      '</div>' +
      '<div class="hw-sec"><h2>Что есть в помещении</h2>' +
        '<div class="hw-note">Отметьте всё, что подходит — эти метки видны в карточке и в фильтрах.</div>' +
        '<div class="hw-chips" role="group" aria-label="Удобства">' +
          FEATURES.map(f => '<button type="button" class="hw-chip" aria-pressed="' + (st.features.indexOf(f.id) !== -1) + '" ' +
            'data-h="feature" data-id="' + f.id + '">' + ic(f.icon, 16, 1.8) + f.t + '</button>').join("") +
        '</div>' +
      '</div>' +
      '<div class="hw-sec"><h2>Фотографии</h2>' +
        '<div class="hw-note">Минимум 3 фото. Снимайте при дневном свете, без вещей в кадре.</div>' +
        '<div class="hw-chips" role="group" aria-label="Категория фото">' +
          PHOTO_CATS.map(c => '<button type="button" class="hw-chip" aria-pressed="' + (st.photoCat === c.id) + '" ' +
            'data-h="photocat" data-id="' + c.id + '">' + c.t + '</button>').join("") +
        '</div>' +
        '<div class="hw-photos" id="hwPhotos">' + photoTiles() + '</div>' +
        '<input type="file" id="hwFile" accept="image/*" multiple hidden>' +
        '<div class="hw-photo-bar">' +
          '<span class="hw-count' + (n >= 3 ? " ok" : "") + '" id="hwPhotoN">' + n + ' из минимум 3 фото загружено</span>' +
          '<span class="hw-hint" style="margin:0">Загрузка идёт в этот браузер — файлы никуда не отправляются.</span>' +
        '</div>' + err("photos") +
      '</div>';
  };
  function photoTiles() {
    const cat = (id) => (PHOTO_CATS.find(c => c.id === id) || PHOTO_CATS[3]).t;
    return st.photos.map(p =>
      '<div class="hw-photo">' + (p.src ? '<img src="' + p.src + '" alt="' + esc(p.name) + '">' : '<div style="display:grid;place-items:center;height:100%;color:var(--hmute)">' + ic("doc", 22, 1.7) + '</div>') +
        '<span class="cat">' + cat(p.cat) + '</span>' +
        '<button type="button" class="del" data-h="photo-del" data-id="' + p.id + '" aria-label="Удалить фото">' + ic("trash", 15, 1.9) + '</button>' +
      '</div>').join("") +
      '<button type="button" class="hw-add" data-h="photo-add">' + ic("plus", 22, 2) +
        '<span>Добавить в «' + (PHOTO_CATS.find(c => c.id === st.photoCat) || PHOTO_CATS[0]).t + '»</span></button>';
  }

  /* 8 — проверка */
  STEP[8] = () => {
    const t = typeMeta(), s = spaceMeta();
    const feat = st.features.map(id => (FEATURES.find(f => f.id === id) || {}).t).filter(Boolean);
    const acc = (ACCESS.find(a => a.id === st.access) || {}).t || "—";
    const recur = st.recur === "always" ? "Всегда доступно"
      : st.recur === "days" ? "По дням: " + (st.weekdays.length ? st.weekdays.slice().sort().map(i => DOW[i]).join(", ") : "не выбрано")
      : "Недоступно " + dateRu(st.blockFrom) + " – " + dateRu(st.blockTo);
    const priceLine = st.price ? fmt(st.price) + " " + currency() + " " + priceUnit() : "—";
    return '<h1 class="hw-title">Проверьте информацию</h1>' +
      '<p class="hw-sub">Убедитесь, что всё верно. Любой блок можно поправить — вы вернётесь сюда же.</p>' +
      sum("Общая информация", 1, [
        ["Тип объявления", t ? t.t : "—"],
        ["Тип помещения", s ? s.t : "—"],
        ["Адрес", st.address || "—"],
      ]) +
      sum("Площадь", 4, [
        ["Общая площадь", st.totalM2 + " м²"],
        ["Доступно для аренды", st.rentM2 + " м²"],
        ["Минимальная аренда", st.minM2 + " м²"],
      ]) +
      sum("Доступность", 5, [
        ["Период", dateRu(st.dateFrom) + (st.dateTo ? " – " + dateRu(st.dateTo) : " – бессрочно")],
        ["Способ доступа", acc],
        ["Расписание", recur],
      ]) +
      sum("Цена", 6, [
        ["Стоимость", priceLine],
        ["Оплата", [st.payMonthly ? "помесячно" : null, st.payDiscount ? "скидка за несколько месяцев" : null, st.payLong ? "долгосрочная аренда" : null].filter(Boolean).join(", ") || "—"],
      ]) +
      sum("Описание", 7, [
        ["Текст", st.desc ? esc(st.desc.slice(0, 160)) + (st.desc.length > 160 ? "…" : "") : "—"],
        ["Удобства", feat.length ? feat.join(", ") : "—"],
      ]) +
      '<div class="hw-sum"><div class="hw-sum-head"><h3>Фотографии</h3>' +
        '<button type="button" class="hw-edit" data-h="goto" data-step="7">' + ic("pencil", 14, 1.9) + 'Изменить</button></div>' +
        (st.photos.length
          ? '<div class="hw-sum-photos">' + st.photos.slice(0, 5).map(p => p.src
              ? '<img src="' + p.src + '" alt="">'
              : '<span class="more">' + ic("doc", 18, 1.7) + '</span>').join("") +
            (st.photos.length > 5 ? '<span class="more">+' + (st.photos.length - 5) + '</span>' : "") + '</div>'
          : '<div class="hw-hint" style="margin:0">Фотографии не загружены</div>') +
      '</div>';
  };
  function sum(title, step, rows) {
    return '<div class="hw-sum"><div class="hw-sum-head"><h3>' + title + '</h3>' +
      '<button type="button" class="hw-edit" data-h="goto" data-step="' + step + '">' + ic("pencil", 14, 1.9) + 'Изменить</button></div>' +
      '<dl class="hw-dl">' + rows.map(r => '<dt>' + r[0] + '</dt><dd>' + (r[1] === "—" ? "—" : esc(r[1])) + '</dd>').join("") + '</dl></div>';
  }

  /* 9 — верификация */
  STEP[9] = () => {
    const items = [
      ["id", "idcard", "Документ, удостоверяющий личность", "Паспорт или водительское удостоверение — только для проверки"],
      ["selfie", "selfie", "Селфи", "Нужно, чтобы сверить фото с документом"],
    ];
    return '<h1 class="hw-title">Подтвердите личность</h1>' +
      '<p class="hw-sub">Проверка нужна, чтобы арендаторы знали, что за помещением стоит реальный человек. Проверенные владельцы получают больше заявок, а их объявления показываются выше.</p>' +
      '<div class="hw-checklist">' +
        items.map(i =>
          '<div class="hw-cl' + (st.verify[i[0]] ? " done" : "") + '">' +
            '<span class="ico">' + ic(i[1], 22, 1.7) + '</span>' +
            '<span class="tx"><b>' + i[2] + '</b><span>' + i[3] + '</span></span>' +
            '<button type="button" class="hw-mini' + (st.verify[i[0]] ? " done" : "") + '" data-h="verify" data-k="' + i[0] + '">' +
              (st.verify[i[0]] ? ic("check", 14, 2.4) + " Загружено" : "Загрузить") + '</button>' +
          '</div>').join("") +
        '<div class="hw-cl' + (st.verify.country ? " done" : "") + '">' +
          '<span class="ico">' + ic("globe", 22, 1.7) + '</span>' +
          '<span class="tx"><b>Страна проживания</b><span>Где вы постоянно живёте</span></span>' +
          '<select class="hw-select" data-h="vcountry" aria-label="Страна проживания" style="max-width:210px">' +
            '<option value="">Выберите…</option>' +
            COUNTRIES.map(c => '<option' + (st.verify.country === c ? " selected" : "") + '>' + c + '</option>').join("") +
          '</select>' +
        '</div>' +
      '</div>' + err("verify") +
      info("Как мы храним документы", "Документы шифруются, доступны только службе проверки и не показываются арендаторам. Мы не передаём их третьим лицам и удаляем копии после проверки.") +
      '<div class="hw-sec">' +
        '<label class="hw-agree" data-err-target="agree"><input type="checkbox" data-h="agree1"' + (st.agree1 ? " checked" : "") + '>' +
          '<span>Подтверждаю, что указанная информация верна, а помещение принадлежит мне или я имею право сдавать его в аренду.</span></label>' +
        '<label class="hw-agree" data-err-target="agree"><input type="checkbox" data-h="agree2"' + (st.agree2 ? " checked" : "") + '>' +
          '<span>Согласен с <a href="#/host" data-h="noop">Политикой конфиденциальности</a> и <a href="#/host" data-h="noop">Условиями использования</a>.</span></label>' +
        err("agree") +
      '</div>' +
      info("Проверка занимает до 24 часов", "Обычно мы отвечаем быстрее. Пока идёт проверка, вы можете дозаполнить объявление — публикация начнётся автоматически.", true);
  };

  /* 10 — выплаты */
  STEP[10] = () => {
    const brand = cardBrand(st.card.number);
    return '<h1 class="hw-title">Куда отправлять выплаты?</h1>' +
      '<p class="hw-sub">Мы переводим оплату от арендатора на эту карту. Данные нужны только для выплат — списаний с неё не будет.</p>' +
      '<div class="hw-cols wide-left">' +
        '<div class="hw-cardbox">' +
          '<div class="hw-field" style="margin-top:0"><label for="hwCard">Номер карты</label>' +
            '<div class="hw-suffix"><input id="hwCard" class="hw-input" type="text" inputmode="numeric" autocomplete="cc-number" ' +
              'placeholder="0000 0000 0000 0000" maxlength="23" value="' + esc(st.card.number) + '" data-h="cnum">' +
              '<span class="sfx">' + ic("card", 20, 1.7) + '</span></div>' + err("cnum") +
          '</div>' +
          '<div class="hw-inline" style="margin-top:18px">' +
            '<div><label class="hw-lbl" for="hwExp">Срок действия</label>' +
              '<input id="hwExp" class="hw-input" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="ММ/ГГ" ' +
                'maxlength="5" value="' + esc(st.card.exp) + '" data-h="cexp">' + err("cexp") + '</div>' +
            '<div><label class="hw-lbl" for="hwCvv">CVV</label>' +
              '<input id="hwCvv" class="hw-input" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" ' +
                'maxlength="4" value="' + esc(st.card.cvv) + '" data-h="ccvv">' + err("ccvv") + '</div>' +
          '</div>' +
          '<div class="hw-field"><label for="hwHolder">Имя держателя карты</label>' +
            '<input id="hwHolder" class="hw-input" type="text" autocomplete="cc-name" placeholder="IVAN IVANOV" ' +
              'value="' + esc(st.card.name) + '" data-h="cname">' + err("cname") +
          '</div>' +
          '<div class="hw-field"><label for="hwCountry">Страна банка</label>' +
            '<select id="hwCountry" class="hw-select" data-h="ccountry">' +
              COUNTRIES.map(c => '<option' + (st.card.country === c ? " selected" : "") + '>' + c + '</option>').join("") +
            '</select>' +
          '</div>' +
          '<div class="hw-brands" aria-label="Поддерживаемые карты">' +
            ["visa", "mastercard", "mir"].map(b => '<span class="hw-brandchip' + (brand === b ? " on" : "") + '">' +
              (b === "visa" ? "VISA" : b === "mastercard" ? "MASTERCARD" : "МИР") + '</span>').join("") +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="hw-trio" style="grid-template-columns:1fr;margin-top:0">' +
            trio("lock", "Безопасные выплаты", "Данные карты шифруются и хранятся у платёжного провайдера, а не в объявлении.") +
            trio("bolt", "Быстрые переводы", "Деньги приходят в течение 1–3 рабочих дней после начала аренды.") +
            trio("shield", "Без скрытых комиссий", "Вы получаете сумму из объявления — Qaraj не удерживает процент с владельца.") +
          '</div>' +
          info("Конфиденциальность", "Реквизиты видны только платёжной службе. Арендатор никогда не видит номер вашей карты.", true) +
        '</div>' +
      '</div>';
  };
  function trio(icon, title, body) {
    return '<div class="it"><span class="ic">' + ic(icon, 20, 1.8) + '</span><b>' + title + '</b><span>' + body + '</span></div>';
  }

  /* Экран успеха */
  function success() {
    const t = typeMeta(), s = spaceMeta();
    const first = st.photos.find(p => p.src);
    const priceLine = st.price ? fmt(st.price) + " " + currency() : "—";
    return '<div class="hw-step">' +
      '<div class="hw-done-ic">' + ic("check", 46, 2.4) + '</div>' +
      '<h1 class="hw-title" style="text-align:center">Ваше объявление на проверке</h1>' +
      '<p class="hw-sub" style="text-align:center;margin:12px auto 0">Мы проверим объявление и фотографии в течение 24 часов и пришлём уведомление, как только оно будет опубликовано.</p>' +
      '<div class="hw-cols" style="margin-top:38px">' +
        '<div>' +
          '<h2 style="font-size:18px;font-weight:700;margin-bottom:16px">Что дальше</h2>' +
          '<ol class="hw-tl">' +
            [["1", "Объявление опубликовано", "После проверки место появится в поиске", true],
             ["2", "Приходят заявки", "Арендаторы отправляют запрос с датами и площадью", false],
             ["3", "Вы управляете бронями", "Подтверждаете, переносите или отклоняете заявки", false],
             ["4", "Получаете доход", "Выплаты приходят на привязанную карту", false]].map(i =>
              '<li' + (i[3] ? ' class="on"' : "") + '><span class="n">' + i[0] + '</span>' +
                '<span><b>' + i[1] + '</b><span>' + i[2] + '</span></span></li>').join("") +
          '</ol>' +
        '</div>' +
        '<div>' +
          '<h2 style="font-size:18px;font-weight:700;margin-bottom:16px">Как это увидят арендаторы</h2>' +
          '<div class="hw-preview">' +
            '<div class="ph">' + (first ? '<img src="' + first.src + '" alt="">' : ic("box", 34, 1.5)) + '</div>' +
            '<div class="bd">' +
              '<div class="t">' + esc((s ? s.t : "Помещение") + (st.address ? " · " + st.address.split(",")[0] : "")) + '</div>' +
              '<div class="s">' + esc((t ? t.t : "") + " · " + st.rentM2 + " м² · от " + st.minM2 + " м²") + '</div>' +
              '<div class="p">' + priceLine + ' <small>' + priceUnit() + '</small></div>' +
              '<span class="hw-pending">' + ic("clock", 14, 2) + 'На проверке</span>' +
            '</div>' +
          '</div>' +
          info("Заполненный профиль работает лучше", "Объявления с 5+ качественными фото и подробным описанием получают примерно вдвое больше заявок.") +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------------- Validation ---------------- */
  function validate(step) {
    const e = [];
    const num = (v) => parseFloat(String(v).replace(",", ".")) || 0;
    if (step === 1 && !st.listingType) e.push(["listingType", "Выберите, что вы хотите сдавать"]);
    if (step === 2 && !st.spaceType) e.push(["spaceType", "Выберите тип помещения"]);
    if (step === 3 && st.address.trim().length < 5) e.push(["address", "Укажите адрес — минимум 5 символов"]);
    if (step === 4) {
      if (num(st.totalM2) <= 0) e.push(["totalM2", "Укажите общую площадь помещения"]);
      if (num(st.rentM2) <= 0) e.push(["rentM2", "Укажите площадь, доступную для аренды"]);
      else if (num(st.rentM2) > num(st.totalM2)) e.push(["rentM2", "Площадь для аренды не может быть больше общей"]);
      if (num(st.minM2) <= 0) e.push(["minM2", "Укажите минимальный размер аренды"]);
      else if (num(st.minM2) > num(st.rentM2)) e.push(["minM2", "Минимальный размер больше доступной площади"]);
    }
    if (step === 5) {
      if (!st.dateFrom) e.push(["dateFrom", "Выберите дату, с которой помещение доступно"]);
      if (st.dateTo && st.dateFrom && st.dateTo <= st.dateFrom) e.push(["dateTo", "Дата окончания должна быть позже даты заезда"]);
      if (!st.access) e.push(["access", "Выберите способ доступа"]);
      if (st.recur === "days" && !st.weekdays.length) e.push(["weekdays", "Отметьте хотя бы один день недели"]);
      if (st.recur === "block") {
        if (!st.blockFrom || !st.blockTo) e.push(["block", "Укажите период, когда помещение недоступно"]);
        else if (st.blockTo <= st.blockFrom) e.push(["block", "Конец периода должен быть позже начала"]);
      }
    }
    if (step === 6 && num(st.price) <= 0) e.push(["price", "Укажите цену больше нуля"]);
    if (step === 7) {
      if (st.desc.trim().length < 40) e.push(["desc", "Опишите помещение подробнее — минимум 40 символов"]);
      if (st.photos.length < 3) e.push(["photos", "Загрузите минимум 3 фотографии"]);
    }
    if (step === 9) {
      if (!st.verify.id || !st.verify.selfie || !st.verify.country) e.push(["verify", "Пройдите все три пункта проверки"]);
      if (!st.agree1 || !st.agree2) e.push(["agree", "Отметьте оба согласия, чтобы продолжить"]);
    }
    if (step === 10) {
      const digits = st.card.number.replace(/\D/g, "");
      if (digits.length < 16 || !luhn(digits)) e.push(["cnum", "Проверьте номер карты"]);
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(st.card.exp)) e.push(["cexp", "Формат ММ/ГГ"]);
      else if (expired(st.card.exp)) e.push(["cexp", "Срок действия карты истёк"]);
      if (!/^\d{3,4}$/.test(st.card.cvv)) e.push(["ccvv", "3 или 4 цифры"]);
      if (st.card.name.trim().length < 3) e.push(["cname", "Укажите имя держателя карты"]);
    }
    return e;
  }
  function luhn(d) {
    let sum = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
      let n = +d[i];
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  }
  function expired(exp) {
    const p = exp.split("/"), now = new Date();
    const y = 2000 + parseInt(p[1], 10), m = parseInt(p[0], 10);
    return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1);
  }
  function cardBrand(v) {
    const d = v.replace(/\D/g, "");
    if (/^4/.test(d)) return "visa";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(d)) return "mastercard";
    if (/^220[0-4]/.test(d)) return "mir";
    return "";
  }
  function showErrors(list) {
    document.querySelectorAll(".hw-err.on").forEach(el => el.classList.remove("on"));
    document.querySelectorAll(".hw-input.bad,.hw-area.bad,.hw-select.bad,.hw-agree.bad").forEach(el => el.classList.remove("bad"));
    const foot = document.getElementById("hwFormErr");
    if (!list.length) { if (foot) foot.classList.remove("on"); return; }
    list.forEach(([name, msg]) => {
      const box = document.querySelector('.hw-err[data-err="' + name + '"]');
      if (box) { box.querySelector("span").textContent = msg; box.classList.add("on"); }
    });
    const map = { address: "hwAddr", totalM2: "hwTotal", rentM2: "hwRent", minM2: "hwMin", dateFrom: "hwFrom",
      dateTo: "hwTo", price: "hwPrice", desc: "hwDesc", cnum: "hwCard", cexp: "hwExp", ccvv: "hwCvv", cname: "hwHolder" };
    list.forEach(([name]) => { const el = document.getElementById(map[name]); if (el) el.classList.add("bad"); });
    if (list.some(l => l[0] === "agree")) document.querySelectorAll('[data-err-target="agree"]').forEach(l => l.classList.add("bad"));
    if (foot) { foot.textContent = list.length === 1 ? list[0][1] : "Заполните обязательные поля — их " + list.length; foot.classList.add("on"); }
    const firstEl = document.getElementById(map[list[0][0]]) || document.querySelector('.hw-err[data-err="' + list[0][0] + '"]');
    if (firstEl) firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
    if (firstEl && firstEl.focus) try { firstEl.focus({ preventScroll: true }); } catch (e) {}
  }

  /* Hide the message for one field as soon as the user fixes it. */
  const ERR_OF = { addr: "address", total: "totalM2", rent: "rentM2", minval: "minM2", from: "dateFrom",
    to: "dateTo", price: "price", desc: "desc", cnum: "cnum", cexp: "cexp", ccvv: "ccvv", cname: "cname",
    access: "access", weekday: "weekdays", blockfrom: "block", blockto: "block",
    agree1: "agree", agree2: "agree", vcountry: "verify", verify: "verify" };
  function clearErr(key) {
    const name = ERR_OF[key];
    if (!name) return;
    const box = document.querySelector('.hw-err[data-err="' + name + '"]');
    if (box) box.classList.remove("on");
    document.querySelectorAll(".hw-input.bad,.hw-area.bad,.hw-select.bad").forEach(el => {
      if (el.dataset.h === key) el.classList.remove("bad");
    });
    if (name === "agree") document.querySelectorAll('[data-err-target="agree"]').forEach(l => l.classList.remove("bad"));
    const foot = document.getElementById("hwFormErr");
    if (foot && !document.querySelector(".hw-err.on")) foot.classList.remove("on");
  }

  /* ---------------- Shell + paint ---------------- */
  function view() {
    load();
    requestAnimationFrame(mount);
    return '<div class="hostwiz">' +
      '<header class="hw-head"><div class="hw-wrap">' +
        '<div class="hw-head-in">' +
          '<a class="hw-brand" href="#/" data-link><span class="mk">' + ic("box", 19, 1.7) + '</span>' +
            '<span class="name">Qar<b>aj</b></span></a>' +
          '<span class="hw-head-sp"></span>' +
          '<span class="hw-saved" id="hwSaved">' + ic("check", 15, 2.2) + 'Черновик сохранён</span>' +
          '<span class="hw-step-n" id="hwStepN"></span>' +
          '<button type="button" class="hw-exit" data-h="exit" aria-label="Выйти из мастера">' + ic("x", 16, 2.1) + '</button>' +
        '</div>' +
        '<div class="hw-prog" id="hwProg" role="progressbar" aria-valuemin="1" aria-valuemax="' + STEPS + '" aria-valuenow="1" ' +
          'aria-label="Прогресс регистрации"><i style="width:10%"></i></div>' +
      '</div></header>' +
      '<div class="hw-body"><div class="hw-wrap" id="hwBody" aria-live="polite"></div></div>' +
      '<footer class="hw-foot"><div class="hw-wrap"><div class="hw-foot-in" id="hwFoot"></div></div></footer>' +
    '</div>';
  }

  function paint() {
    const body = document.getElementById("hwBody");
    if (!body) return;
    body.innerHTML = st.done ? success()
      : '<div class="hw-step' + (dir === "back" ? " back" : "") + '">' + STEP[st.step]() + '</div>';
    const n = document.getElementById("hwStepN");
    const prog = document.getElementById("hwProg");
    if (n) n.textContent = st.done ? "Готово" : "Шаг " + st.step + " из " + STEPS;
    if (prog) {
      prog.setAttribute("aria-valuenow", st.done ? STEPS : st.step);
      prog.querySelector("i").style.width = (st.done ? 100 : Math.round(st.step / STEPS * 100)) + "%";
    }
    document.getElementById("hwFoot").innerHTML = foot();
    document.title = (st.done ? "Объявление отправлено" : "Шаг " + st.step + " из " + STEPS) + " — Qaraj для владельцев";
    if (st.step === 3 && !st.done) bindMap();
    window.scrollTo({ top: 0, behavior: dir === "init" ? "auto" : "smooth" });
    dir = "fwd";
  }

  function foot() {
    if (st.done) {
      return '<button type="button" class="hw-btn hw-btn-ghost" data-h="back">' + ic("chevL", 16, 2.2) + 'Назад</button>' +
        '<span class="hw-foot-sp"></span>' +
        '<button type="button" class="hw-btn hw-btn-primary" data-h="finish">Перейти к моим объявлениям</button>';
    }
    const last = st.step === STEPS;
    const label = st.step === 9 ? "Продолжить" : last ? "Сохранить карту" : "Далее";
    return '<button type="button" class="hw-btn hw-btn-ghost" data-h="back"' + (st.step === 1 ? " disabled" : "") + '>' +
        ic("chevL", 16, 2.2) + 'Назад</button>' +
      '<span class="hw-foot-sp"></span>' +
      '<span class="hw-formerr" id="hwFormErr"></span>' +
      '<button type="button" class="hw-btn hw-btn-primary" id="hwNext" data-h="next">' + label +
        (last ? "" : ic("chevR", 16, 2.2)) + '</button>';
  }

  function mount() {
    if (!document.getElementById("hwBody")) return;
    dir = "init";
    paint();
  }

  function go(step) {
    dir = step < st.step ? "back" : "fwd";
    st.step = Math.max(1, Math.min(STEPS, step));
    save();
    paint();
  }
  function next() {
    const e = validate(st.step);
    if (e.length) { showErrors(e); return; }
    showErrors([]);
    if (st.step === STEPS) return finishSubmit();
    go(st.step + 1);
  }
  function finishSubmit() {
    const btn = document.getElementById("hwNext");
    if (btn) { btn.classList.add("busy"); btn.textContent = "Сохраняем…"; }
    setTimeout(() => { st.done = true; save(); paint(); }, 900);
  }

  /* ---------------- Map pin ---------------- */
  function bindMap() {
    const map = document.getElementById("hwMap"), pin = document.getElementById("hwPin");
    if (!map || !pin) return;
    let dragging = false;
    const place = (ev) => {
      const r = map.getBoundingClientRect();
      const x = Math.max(4, Math.min(96, (ev.clientX - r.left) / r.width * 100));
      const y = Math.max(8, Math.min(96, (ev.clientY - r.top) / r.height * 100));
      st.pin = { x: +x.toFixed(1), y: +y.toFixed(1) };
      pin.style.left = st.pin.x + "%"; pin.style.top = st.pin.y + "%";
    };
    pin.addEventListener("pointerdown", (ev) => {
      ev.preventDefault(); dragging = true; pin.classList.add("drag");
      try { pin.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    pin.addEventListener("pointermove", (ev) => { if (dragging) place(ev); });
    pin.addEventListener("pointerup", () => { dragging = false; pin.classList.remove("drag"); save(); });
    pin.addEventListener("keydown", (ev) => {
      const d = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[ev.key];
      if (!d) return;
      ev.preventDefault();
      st.pin = { x: Math.max(4, Math.min(96, st.pin.x + d[0])), y: Math.max(8, Math.min(96, st.pin.y + d[1])) };
      pin.style.left = st.pin.x + "%"; pin.style.top = st.pin.y + "%";
      save();
    });
    map.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".hw-pin")) return;
      place(ev); save();
    });
  }

  /* ---------------- Photos ---------------- */
  function pickPhotos() {
    const inp = document.getElementById("hwFile");
    if (!inp) return;
    inp.value = "";
    inp.onchange = () => addFiles(Array.prototype.slice.call(inp.files || []));
    inp.click();
  }
  function addFiles(files) {
    if (!files.length) return;
    const grid = document.getElementById("hwPhotos");
    const cat = st.photoCat;
    // optimistic placeholders while the files are read + downscaled
    if (grid) files.forEach(() => grid.insertAdjacentHTML("afterbegin", '<div class="hw-photo busy"></div>'));
    let left = files.length;
    files.forEach(f => {
      downscale(f, (src) => {
        st.photos.push({ id: "p" + Date.now() + Math.random().toString(36).slice(2, 6), cat: cat, name: f.name, src: src });
        if (--left === 0) { save(); repaintPhotos(); }
      });
    });
  }
  function downscale(file, cb) {
    if (!/^image\//.test(file.type)) { cb(""); return; }
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 640, sc = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        try { cb(cv.toDataURL("image/jpeg", 0.72)); } catch (e) { cb(fr.result); }
      };
      img.onerror = () => cb("");
      img.src = fr.result;
    };
    fr.onerror = () => cb("");
    fr.readAsDataURL(file);
  }
  function repaintPhotos() {
    const grid = document.getElementById("hwPhotos");
    if (grid) grid.innerHTML = photoTiles();
    const n = document.getElementById("hwPhotoN");
    if (n) {
      n.textContent = st.photos.length + " из минимум 3 фото загружено";
      n.classList.toggle("ok", st.photos.length >= 3);
    }
  }

  /* ---------------- Events ---------------- */
  function pressed(el, on) { el.setAttribute("aria-pressed", on ? "true" : "false"); }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-h]");
    if (!t || !t.closest(".hostwiz")) return;
    const a = t.dataset.h;
    // radios/checkboxes/selects carry data-h too, but they are driven by the
    // change handler — cancelling their default here would stop them ticking
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return;
    if (a !== "map") e.preventDefault();
    clearErr(a);

    switch (a) {
      case "noop": break;
      case "exit": location.hash = "/"; break;
      case "back": if (st.done) { st.done = false; go(STEPS); } else if (st.step > 1) go(st.step - 1); break;
      case "next": next(); break;
      case "goto": go(parseInt(t.dataset.step, 10)); break;
      case "finish":
        reset();
        if (Q.app && Q.app.toast) Q.app.toast("Объявление отправлено на проверку ✓");
        location.hash = "/";
        break;

      case "type":
        st.listingType = t.dataset.id;
        t.parentNode.querySelectorAll(".hw-card").forEach(c => c.setAttribute("aria-checked", String(c === t)));
        showErrors([]); save();
        break;
      case "space":
        st.spaceType = t.dataset.id;
        t.parentNode.querySelectorAll(".hw-row").forEach(r => r.setAttribute("aria-checked", String(r === t)));
        showErrors([]); save();
        break;

      case "geo": {
        t.disabled = true;
        const done = (txt, x, y) => {
          st.geo = txt;
          if (x != null) st.pin = { x: x, y: y };
          st.address = st.address || "Москва, Пресненский район";
          save(); paint();
        };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => done(pos.coords.latitude.toFixed(5) + ", " + pos.coords.longitude.toFixed(5), 50, 50),
            () => { t.disabled = false; if (Q.app) Q.app.toast("Не удалось определить местоположение"); },
            { timeout: 8000 });
        } else { t.disabled = false; if (Q.app) Q.app.toast("Геолокация недоступна в этом браузере"); }
        break;
      }

      case "min":
        if (t.dataset.v === "custom") { st.minCustom = true; }
        else { st.minCustom = false; st.minM2 = parseFloat(t.dataset.v); }
        save(); paint();
        break;

      case "toggle":
        st[t.dataset.k] = !st[t.dataset.k];
        t.setAttribute("aria-checked", String(st[t.dataset.k]));
        save();
        break;

      case "weekday": {
        const i = parseInt(t.dataset.i, 10), at = st.weekdays.indexOf(i);
        if (at === -1) st.weekdays.push(i); else st.weekdays.splice(at, 1);
        pressed(t, at === -1); save();
        break;
      }

      case "feature": {
        const id = t.dataset.id, at = st.features.indexOf(id);
        if (at === -1) st.features.push(id); else st.features.splice(at, 1);
        pressed(t, at === -1); save();
        break;
      }

      case "photocat":
        st.photoCat = t.dataset.id;
        t.parentNode.querySelectorAll(".hw-chip").forEach(c => pressed(c, c === t));
        repaintPhotos(); save();
        break;
      case "photo-add": pickPhotos(); break;
      case "photo-del": {
        const id = t.dataset.id;
        st.photos = st.photos.filter(p => p.id !== id);
        save(); repaintPhotos();
        break;
      }

      case "verify": {
        // demo: a real build opens the document/selfie capture flow here
        const k = t.dataset.k;
        t.classList.add("busy"); t.textContent = "Загрузка…";
        setTimeout(() => { st.verify[k] = true; save(); paint(); }, 700);
        break;
      }
    }
  });

  /* text / number / date inputs */
  document.addEventListener("input", (e) => {
    const t = e.target.closest("[data-h]");
    if (!t || !t.closest(".hostwiz")) return;
    const a = t.dataset.h;
    clearErr(a);
    switch (a) {
      case "addr": st.address = t.value; save(); break;
      case "total": {
        st.totalM2 = Math.max(0, parseFloat(t.value) || 0);
        const r = document.getElementById("hwRent");
        if (r) {
          r.max = String(Math.max(1, st.totalM2));
          if (st.rentM2 > st.totalM2) { st.rentM2 = st.totalM2; r.value = String(st.rentM2); }
          const lbl = document.getElementById("hwRentVal");
          if (lbl) lbl.textContent = st.rentM2 + " м²";
          const scale = r.parentNode.querySelector(".hw-range-scale");
          if (scale) scale.lastChild.textContent = st.totalM2 + " м²";
        }
        save();
        break;
      }
      case "rent": {
        st.rentM2 = parseFloat(t.value) || 0;
        const lbl = document.getElementById("hwRentVal");
        if (lbl) lbl.textContent = st.rentM2 + " м²";
        save();
        break;
      }
      case "minval": st.minM2 = parseFloat(t.value) || 0; save(); break;
      case "from": st.dateFrom = t.value; save(); break;
      case "to": st.dateTo = t.value; save(); break;
      case "blockfrom": st.blockFrom = t.value; save(); break;
      case "blockto": st.blockTo = t.value; save(); break;
      case "price": st.price = t.value; save(); break;
      case "desc": {
        st.desc = t.value;
        const c = document.getElementById("hwDescN");
        if (c) { c.textContent = st.desc.length + " / 1000"; c.classList.toggle("over", st.desc.length > 1000); }
        save();
        break;
      }
      case "cnum": {
        const d = t.value.replace(/\D/g, "").slice(0, 19);
        t.value = d.replace(/(.{4})/g, "$1 ").trim();
        st.card.number = t.value;
        const b = cardBrand(d);
        document.querySelectorAll(".hw-brandchip").forEach((c, i) => c.classList.toggle("on", ["visa", "mastercard", "mir"][i] === b));
        save();
        break;
      }
      case "cexp": {
        let d = t.value.replace(/\D/g, "").slice(0, 4);
        if (d.length >= 3) d = d.slice(0, 2) + "/" + d.slice(2);
        t.value = d; st.card.exp = d; save();
        break;
      }
      case "ccvv": t.value = t.value.replace(/\D/g, "").slice(0, 4); st.card.cvv = t.value; save(); break;
      case "cname": st.card.name = t.value; save(); break;
    }
  });

  /* selects / radios / checkboxes */
  document.addEventListener("change", (e) => {
    const t = e.target.closest("[data-h]");
    if (!t || !t.closest(".hostwiz")) return;
    clearErr(t.dataset.h);
    switch (t.dataset.h) {
      case "access": st.access = t.value; save(); break;
      case "recur": st.recur = t.value; save(); paint(); break;
      case "currency": st.currency = t.value; save(); paint(); break;
      case "vcountry": st.verify.country = t.value; save(); paint(); break;
      case "ccountry": st.card.country = t.value; save(); break;
      case "agree1": st.agree1 = t.checked; save(); break;
      case "agree2": st.agree2 = t.checked; save(); break;
    }
  });

  /* Enter anywhere in the wizard advances, except inside the description */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !e.target.closest(".hostwiz")) return;
    if (e.target.tagName === "TEXTAREA" || e.target.closest("[data-h]") && e.target.dataset.h === "desc") return;
    if (e.target.tagName === "BUTTON" || e.target.tagName === "A") return;
    e.preventDefault();
    next();
  });

  Q.views.host = view;
  Q.router.add("/host", view);
})(window.Q = window.Q || {});
