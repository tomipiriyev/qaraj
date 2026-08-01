/* Qaraj web app — per-route views. Each returns an HTML string. */
(function (Q) {
  const D = Q.data, c = Q.c, esc = Q.c.esc, ic = Q.c.ic;

  /* ---------- Sign in ---------- */
  function signin() {
    const pt = (t) => '<div class="pt"><span class="dot">' + ic("check", 15, 2) + '</span>' + t + '</div>';
    return '<div class="signin">' +
      '<div class="signin-hero">' +
        '<a class="brand" href="#/signin" data-link><span class="mark">' + ic("box", 20, 1.6) + '</span><span class="name">Qar<b>aj</b></span></a>' +
        '<div><h1>Аренда места для хранения — рядом с вами</h1>' +
          '<p>Склады, площади и гаражи от проверенных владельцев. Находите, сравнивайте и отправляйте заявку — без предоплаты.</p>' +
          '<div class="pts">' + pt("Три формата: склад, площадь по м², гараж") + pt("Помесячно, на полгода или на год") + pt("Оплата напрямую владельцу — без комиссии") + '</div>' +
        '</div>' +
        '<div style="opacity:.75;font-size:13px">© Qaraj · демо-версия</div>' +
      '</div>' +
      '<div class="signin-form-wrap"><form class="signin-form" id="signinForm" autocomplete="off" novalidate>' +
        '<h2>Вход в аккаунт</h2><p class="lead">Войдите, чтобы искать места и сохранять избранное.</p>' +
        '<div class="field-l"><label for="email">Эл. почта</label><input id="email" type="email" value="demo@qaraj.ru" spellcheck="false"></div>' +
        '<div class="field-l"><label for="pass">Пароль</label><input id="pass" type="password" value="demo1234"></div>' +
        '<div class="err" id="loginErr">Неверная почта или пароль. Используйте демо-доступ ниже.</div>' +
        '<div class="demo-hint">' + ic("shield", 18, 1.7) + '<span>Демо-аккаунт: <b>demo@qaraj.ru</b> / <b>demo1234</b> — уже заполнено, просто нажмите «Войти».</span></div>' +
        '<button type="submit" class="btn btn-primary btn-block" style="margin-top:6px">Войти</button>' +
        '<button type="button" class="btn btn-block" data-action="login-demo" style="background:var(--bg-soft);color:var(--ink);margin-top:10px">Войти как демо-гость</button>' +
        '<div class="signin-alt">Нет аккаунта? <a href="#/signup" data-link>Зарегистрироваться</a></div>' +
        '<div class="signin-legal">Вход не отправляет данные на сервер — сессия хранится только в этом браузере.</div>' +
        '<div style="text-align:center;margin-top:14px"><a href="../" style="color:var(--ink-mute);font-size:13px">← На главную сайта</a></div>' +
      '</form></div>' +
    '</div>';
  }

  /* ---------- Home (hero: tagline → category → search) ----------
     The landing page owns the whole search intent: pick one of the three kinds
     of place, optionally narrow by city and free text, then Найти goes straight
     to the results for every category — refining is offered there, not before. */
  const HOME_CATS = ["ploshad", "garage", "sklad"];   // Space · Garage · Storage
  // 3D renders in images/facilities/ stand in for the flat icons on the home cards
  const HOME_CAT_ART = { ploshad: "space", garage: "garage", sklad: "storage" };
  function homeCats() {
    const cur = Q.store.get().category;
    return '<div class="home-cats" role="radiogroup" aria-label="Тип места">' +
      HOME_CATS.map(id => {
        const cat = D.categories.find(x => x.id === id), on = cat.id === cur;
        return '<button type="button" class="home-cat' + (on ? " on" : "") + '" role="radio" ' +
          'aria-checked="' + on + '" data-action="home-cat" data-cat="' + cat.id + '">' +
          '<span class="home-cat-art">' +
            '<img src="../images/facilities/' + HOME_CAT_ART[cat.id] + '.jpeg" alt="" draggable="false">' +
          '</span>' +
          '<span class="home-cat-name">' + cat.label + '</span>' +
          '<span class="home-cat-sub">' + cat.sub + '</span>' +
        '</button>';
      }).join("") + '</div>';
  }
  function home() {
    const s = Q.store.get(), p = Q.store.place();
    return c.appbar("home") +
      '<main class="home">' +
        '<h1 class="home-title">Найдите место для хранения рядом</h1>' +
        '<p class="home-sub">Склады, площади и гаражи от проверенных владельцев — аренда за несколько минут.</p>' +
        homeCats() +
        // .searchbox anchors the place dropdown under the bar
        '<div class="searchbox home-box">' +
          '<form class="home-bar" id="homeSearch" role="search">' +
            '<button type="button" class="hb-loc" data-action="open-search" data-panel="where">' +
              ic("pinloc", 18, 1.8) + '<span id="hbLoc">' + esc(p.name) + '</span>' +
            '</button>' +
            '<span class="hb-div"></span>' +
            // dates live on the bar itself: the dropdown's "when" panel writes
            // straight to the store and relabels this button in place
            '<button type="button" class="hb-when' + (s.query.dateISO ? " filled" : "") + '" ' +
              'data-action="open-search" data-panel="when">' +
              ic("calendar", 18, 1.8) +
              '<span id="hbWhen">' + esc(c.whenLabel(s.query) || "Когда") + '</span>' +
            '</button>' +
            '<button type="submit" class="btn btn-primary hb-go">Найти</button>' +
          '</form>' +
          '<div class="searchpop-host"></div>' +
        '</div>' +
      '</main>' + c.sitefoot() + c.mobilenav("explore");
  }

  function emptyResults() {
    return '<div class="empty"><span class="ic">' + ic("search", 30, 1.7) + '</span><h2>Ничего не найдено</h2>' +
      '<p>Попробуйте изменить фильтры или выбрать другую категорию.</p>' +
      '<button class="btn btn-primary" data-action="filter-reset-all">Сбросить фильтры</button></div>';
  }

  /* ---------- Results: list on the left, map on the right ----------
     Where every search lands. The search bar and the filter row live in the
     appbar above; this owns the two columns under it. */
  function results() {
    const list = Q.store.filtered();
    const s = Q.store.get(), p = Q.store.place();
    const cat = D.categories.find(x => x.id === s.category);
    const where = p.kind === "any" ? " рядом" : " · " + esc(p.name);
    // a range reads on its own; a single date needs the "с" ("from …")
    const when = s.query.dateISO
      ? (s.query.dateEndISO ? "" : "с ") + esc(c.whenLabel(s.query))
      : "";
    return c.appbar("map") +
      '<div class="mapview">' +
        '<div class="map-list">' +
          '<div class="results-head">' +
            '<h1>' + list.length + ' ' + placesWord(list.length) + ' · ' + cat.label + where +
              (when ? ' · ' + when : "") + '</h1>' +
            '<span class="rh-note">' + ic("tag", 18, 1.7) + 'Цены с учётом всех сборов</span>' +
          '</div>' +
          c.refinePrompt(s) +
          (list.length ? '<div class="grid">' + list.map(c.card).join("") + '</div>' : emptyResults()) +
        '</div>' +
        c.mapPane(list) +
      '</div>' + c.mobilenav("explore");
  }

  /* ---------- Listing detail ---------- */
  function detail(params) {
    const l = D.listings.find(x => x.id === params.id);
    if (!l) return c.appbar("") + '<main class="wrap"><div class="empty"><h2>Объявление не найдено</h2><button class="btn btn-primary" data-action="nav" data-route="#/">К поиску</button></div></main>';
    const p = D.priceLabel(l), fav = Q.store.isFav(l.id), q = Q.store.get().query;
    const gallery = [0,1,2,0,1].map(i => '<img src="' + l.photos[i % l.photos.length] + '" alt="" loading="lazy">').join("");
    const specs = [
      ["ruler","Площадь", l.sizeM2 + " м²"],
      ["box","Категория", D.categories.find(x=>x.id===l.category).label],
      ["pinloc","Район", l.district + ", " + l.city],
      [l.availableNow?"check":"clock","Доступность", l.availableNow ? "Свободно сейчас" : "Под запрос"],
    ].map(s => '<div class="spec">' + ic(s[0], 22, 1.7) + '<div><b>' + s[2] + '</b><span>' + s[1] + '</span></div></div>').join("");
    const amrows = l.amenities.map(a => { const am = D.amenities.find(x=>x.id===a); return '<div class="amrow">' + ic(am.icon, 20, 1.8) + am.label + '</div>'; }).join("");
    return c.appbar("") +
      '<main class="wrap detail">' +
        '<a class="back" data-action="nav" data-route="#/search">' + ic("chevL", 18, 1.9) + 'Назад к результатам</a>' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">' +
          '<div><h1>' + esc(l.title) + '</h1>' +
            '<div class="subline"><span class="r">' + c.icFill("star",15) + l.rating.toFixed(2).replace(".",",") + '</span>' +
            '<span>' + l.reviews + ' отзывов</span><span>·</span><span>' + esc(l.district) + ', ' + esc(l.city) + '</span>' +
            (l.badge ? '<span>·</span><span>' + l.badge + '</span>' : "") + '</div></div>' +
          '<button class="btn btn-ghost btn-sm" data-action="fav" data-id="' + l.id + '">' +
            '<span style="color:' + (fav?'#ef4444':'inherit') + '">' + ic("heart",16,1.8) + '</span>' + (fav?"В избранном":"Сохранить") + '</button>' +
        '</div>' +
        '<div class="gallery">' + gallery + '</div>' +
        '<div class="detail-cols">' +
          '<div>' +
            '<h2>Об этом месте</h2><p class="detail-desc">' + esc(l.desc) + '</p>' +
            '<h2>Характеристики</h2><div class="spec-grid">' + specs + '</div>' +
            '<h2>Удобства</h2><div class="amgrid">' + amrows + '</div>' +
            '<h2>Расположение</h2><div class="mini-map">' + miniMap(l) + '</div>' +
          '</div>' +
          '<aside><div class="booking">' +
            '<div class="pr">' + p.main + ' <small>' + p.unit + '</small></div>' +
            (l.availableNow ? '<span class="free-badge">Свободно сейчас</span>' : "") +
            '<div class="field" data-action="open-inquiry" data-id="' + l.id + '"><small>Даты</small><b>' +
              (q.dateISO ? (q.dateEndISO ? D.dateRange(q.dateISO, q.dateEndISO) : D.dateLong(q.dateISO)) : "Выбрать дату") + '</b></div>' +
            '<div class="field" data-action="open-inquiry" data-id="' + l.id + '"><small>Срок аренды</small><b>' + q.term + '</b></div>' +
            '<button class="btn btn-primary btn-block" style="margin-top:14px" data-action="open-inquiry" data-id="' + l.id + '">Отправить заявку</button>' +
            '<div class="note">Пока вы ни за что не платите</div>' +
          '</div></aside>' +
        '</div>' +
      '</main>' + c.mobilenav("");
  }
  function miniMap(l) {
    return c.mapCanvas() + '<button class="pin sel" style="left:' + l.map.x + '%;top:' + l.map.y + '%">' + (l.category==="ploshad"?D.fmt(l.pricePerM2)+" ₽/м²":D.fmt(l.price)+" ₽") + '</button>';
  }

  /* ---------- Saved ---------- */
  function saved() {
    const list = D.listings.filter(l => Q.store.isFav(l.id));
    return c.appbar("saved") + '<main class="wrap" style="flex:1"><div class="page-head"><h1>Избранное</h1>' +
      '<p>' + (list.length ? list.length + ' ' + placesWord(list.length) : "Здесь появятся сохранённые места") + '</p></div>' +
      (list.length ? '<div class="grid">' + list.map(c.card).join("") + '</div>' :
        '<div class="empty"><span class="ic">' + ic("heart",30,1.7) + '</span><h2>Пока пусто</h2><p>Нажимайте на сердечко у понравившихся мест — они соберутся здесь.</p><button class="btn btn-primary" data-action="nav" data-route="#/">Найти место</button></div>') +
      '</main>' + c.mobilenav("saved");
  }

  /* ---------- Trips / inquiries ---------- */
  function trips() {
    const inq = Q.store.get().inquiries;
    return c.appbar("trips") + '<main class="wrap" style="flex:1"><div class="page-head"><h1>Заявки</h1>' +
      '<p>' + (inq.length ? "Ваши обращения к владельцам" : "Отправленные заявки появятся здесь") + '</p></div>' +
      (inq.length ? inq.map(q => {
        const l = D.listings.find(x => x.id === q.id) || {};
        return '<div class="inquiry-row"><img src="' + (l.photos?l.photos[0]:"") + '" alt="">' +
          '<div><div class="t">' + esc(q.title) + '</div><div class="s">' + esc(q.district) + ' · ' + q.date + ' · ' + q.term + '</div></div>' +
          '<span class="status">Отправлено</span></div>';
      }).join("") :
        '<div class="empty"><span class="ic">' + ic("doc",30,1.7) + '</span><h2>Пока нет заявок</h2><p>Когда вы отправите заявку владельцу места, она появится здесь со статусом и датами.</p><button class="btn btn-primary" data-action="nav" data-route="#/">Найти место</button></div>') +
      '</main>' + c.mobilenav("trips");
  }

  /* ---------- Profile ---------- */
  function profile() {
    return c.appbar("profile") + '<main class="wrap" style="flex:1"><div class="page-head"><h1>Профиль</h1></div>' +
      '<div class="profile-card"><span class="av">Д</span><div><div class="nm">' + Q.store.DEMO.name + '</div><div class="em">' + Q.store.currentEmail() + '</div></div></div>' +
      '<div class="plist">' +
        '<a data-action="noop">Личные данные <span class="chev">' + ic("chevR",16,2) + '</span></a>' +
        '<a data-action="nav" data-route="#/saved">Избранное <span class="chev">' + ic("chevR",16,2) + '</span></a>' +
        '<a data-action="nav" data-route="#/trips">Мои заявки <span class="chev">' + ic("chevR",16,2) + '</span></a>' +
        '<a data-action="nav" data-route="#/host">Сдать своё место <span class="chev">' + ic("chevR",16,2) + '</span></a>' +
        '<a data-action="noop">Способы связи <span class="chev">' + ic("chevR",16,2) + '</span></a>' +
        '<a data-action="noop">Помощь <span class="chev">' + ic("chevR",16,2) + '</span></a>' +
      '</div>' +
      '<div style="max-width:520px;margin-top:18px"><button class="btn btn-block" style="background:var(--bg-soft);color:var(--danger)" data-action="logout">Выйти</button></div>' +
      '<div style="max-width:520px;text-align:center;margin-top:14px"><a href="../" style="color:var(--ink-mute);font-size:13px">← На главную сайта</a></div>' +
      '</main>' + c.mobilenav("profile");
  }

  function placesWord(n) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "место";
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "места";
    return "мест";
  }

  Q.views = { signin, home, results, detail, saved, trips, profile };
})(window.Q = window.Q || {});
