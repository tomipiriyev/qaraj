/* Qaraj web app — регистрация пользователя. Route: #/signup.
   Two-column premium layout: benefits left, form card right (they swap on
   mobile). Live per-field validation, live password checklist, avatar
   drag & drop, autosave of everything except the passwords, success screen.
   Same conventions as host.js: own state, own data-s="…" delegated handlers. */
(function (Q) {
  const LS = "qaraj_signup_v1";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- Icons (thin line, matching the app set) ---------------- */
  const P = {
    box:'<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    phone:'<path d="M7 3h3l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L21 14v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5 5.2 2 2 0 0 1 7 3Z"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/>',
    lock:'<rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    lockCheck:'<rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3M9.5 15l1.8 1.8L15 13"/>',
    eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:'<path d="M4 4l16 16M10.6 6.1A9.4 9.4 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.3 4M6.5 8.3A17 17 0 0 0 2.5 12S6 18 12 18c1.4 0 2.6-.3 3.7-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    check:'<path d="m5 12 5 5 9-11"/>',
    shield:'<path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h3.5"/>',
    bolt:'<path d="M13 3 5 13h6l-2 8 8-11h-6l2-7Z"/>',
    people:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 20c1-3.2 3-5 5.5-5s4.5 1.8 5.5 5M15 20c.6-2.2 2-3.6 3.6-3.6 1.3 0 2.4.8 3 2.2"/>',
    cam:'<path d="M4 8h3l1.6-2h6.8L17 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8Z"/><circle cx="12" cy="13" r="3.4"/>',
    home:'<path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    star:'<path d="m12 2 3 6.5 7 .6-5.3 4.6L18.4 21 12 17.3 5.6 21l1.7-7.3L2 9.1l7-.6L12 2Z"/>',
    trash:'<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    doc:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M8 16h5"/>',
    idcard:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5 16c.7-1.4 2-2.2 3.5-2.2S11.3 14.6 12 16M14.5 10h4M14.5 13.5h4"/>',
    upload:'<path d="M12 16V4M8 8l4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16v.01"/>',
  };
  function ic(n, s, w) {
    return '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="' + (w || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + '</svg>';
  }
  /* brand marks for the social buttons */
  const BRAND = {
    google: '<svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path fill="#4285F4" d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2 3.44-4.96 3.44-8.57Z"/>' +
      '<path fill="#34A853" d="M12 23.5c3.1 0 5.7-1.03 7.62-2.78l-3.72-2.9c-1.03.7-2.35 1.1-3.9 1.1-3 0-5.55-2.03-6.46-4.76H1.7v2.99A11.5 11.5 0 0 0 12 23.5Z"/>' +
      '<path fill="#FBBC05" d="M5.54 14.16a6.9 6.9 0 0 1 0-4.32V6.85H1.7a11.5 11.5 0 0 0 0 10.3l3.84-2.99Z"/>' +
      '<path fill="#EA4335" d="M12 5.08c1.69 0 3.2.58 4.4 1.72l3.3-3.3C17.7 1.63 15.1.5 12 .5 7.6.5 3.8 3.02 1.7 6.85l3.84 2.99C6.45 7.11 9 5.08 12 5.08Z"/></svg>',
    apple: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M16.36 12.7c.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.19-.02 1.94-1.08 2.66-2.15.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.34-3.54ZM14.2 6.3c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.56 1.31-.56.65-1.05 1.69-.92 2.69.97.07 1.96-.49 2.58-1.22Z"/></svg>',
    facebook: '<svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path fill="#1877F2" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>',
  };

  /* ---------------- Reference data ---------------- */
  const COUNTRIES = [
    { id: "RU", t: "Россия", code: "+7" }, { id: "KZ", t: "Казахстан", code: "+7" },
    { id: "BY", t: "Беларусь", code: "+375" }, { id: "AM", t: "Армения", code: "+374" },
    { id: "UZ", t: "Узбекистан", code: "+998" }, { id: "KG", t: "Киргизия", code: "+996" },
  ];
  const RULES = [
    { id: "len",   t: "Минимум 8 символов",        test: v => v.length >= 8 },
    { id: "upper", t: "Одна заглавная буква",      test: v => /[A-ZА-ЯЁ]/.test(v) },
    { id: "lower", t: "Одна строчная буква",       test: v => /[a-zа-яё]/.test(v) },
    { id: "digit", t: "Одна цифра",                test: v => /\d/.test(v) },
    { id: "spec",  t: "Один специальный символ",   test: v => /[^\w\sА-Яа-яЁё]/.test(v) },
  ];
  const NEXT_STEPS = [
    ["Подтвердите эл. почту", "Мы отправили письмо со ссылкой", "Отправлено"],
    ["Заполните профиль", "Добавьте фото и контактные данные", "2 мин"],
    ["Подтвердите личность", "Документ и селфи — для доверия сообщества", "24 ч"],
    ["Разместите первое объявление", "Или найдите место для хранения", "Далее"],
  ];

  /* ---------------- State ---------------- */
  const DEFAULTS = () => ({
    first: "", last: "", email: "", phone: "", country: "RU",
    pass: "", pass2: "", role: "renter", avatar: "",
    terms: false, news: false, done: false,
  });
  let f = DEFAULTS();
  const touched = {};
  let showPass = false, showPass2 = false, saveT = 0;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS) || "null");
      // passwords are deliberately never persisted
      if (raw) f = Object.assign(DEFAULTS(), raw, { pass: "", pass2: "", done: false });
    } catch (e) { f = DEFAULTS(); }
  }
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      const keep = Object.assign({}, f);
      delete keep.pass; delete keep.pass2; delete keep.done;
      try { localStorage.setItem(LS, JSON.stringify(keep)); }
      catch (e) {
        try { keep.avatar = ""; localStorage.setItem(LS, JSON.stringify(keep)); } catch (e2) {}
      }
    }, 350);
  }
  function clearSaved() { try { localStorage.removeItem(LS); } catch (e) {} }

  /* ---------------- Validation ---------------- */
  const NAME_RE = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s'-]{1,}$/;
  const MAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zа-я]{2,}$/i;
  function digits(s) { return String(s).replace(/\D/g, ""); }

  const CHECKS = {
    first: () => !f.first.trim() ? "Укажите имя" : !NAME_RE.test(f.first.trim()) ? "Только буквы, минимум 2 символа" : "",
    last:  () => !f.last.trim() ? "Укажите фамилию" : !NAME_RE.test(f.last.trim()) ? "Только буквы, минимум 2 символа" : "",
    email: () => !f.email.trim() ? "Укажите эл. почту" : !MAIL_RE.test(f.email.trim()) ? "Проверьте адрес — например, name@mail.ru" : "",
    phone: () => { const d = digits(f.phone); return !d ? "Укажите номер телефона" : d.length < 10 ? "Слишком короткий номер" : d.length > 15 ? "Слишком длинный номер" : ""; },
    country: () => !f.country ? "Выберите страну" : "",
    pass:  () => { const bad = RULES.filter(r => !r.test(f.pass)); return !f.pass ? "Придумайте пароль" : bad.length ? "Пароль не отвечает требованиям ниже" : ""; },
    pass2: () => !f.pass2 ? "Повторите пароль" : f.pass2 !== f.pass ? "Пароли не совпадают" : "",
    terms: () => !f.terms ? "Примите условия, чтобы продолжить" : "",
  };
  const errorOf = (k) => (CHECKS[k] ? CHECKS[k]() : "");
  const formValid = () => Object.keys(CHECKS).every(k => !errorOf(k));

  /* ---------------- Field markup ----------------
     Airbnb-style floating label: the input carries placeholder=" " so
     :not(:placeholder-shown) can lift the label once anything is typed. */
  function field(o) {
    const val = f[o.k] == null ? "" : f[o.k];
    return '<div class="hs-field" data-field="' + o.k + '">' +
      '<div class="hs-ctrl' + (o.toggle ? " hs-has-eye" : "") + '">' +
        '<input id="hs-' + o.k + '" class="hs-input" type="' + (o.type || "text") + '" data-s="in" data-k="' + o.k + '" ' +
          'value="' + esc(val) + '" placeholder=" " ' +
          (o.autocomplete ? 'autocomplete="' + o.autocomplete + '" ' : "") +
          (o.inputmode ? 'inputmode="' + o.inputmode + '" ' : "") +
          'aria-describedby="hs-' + o.k + '-err">' +
        '<label for="hs-' + o.k + '">' + o.label + '</label>' +
        (o.toggle
          ? '<button type="button" class="hs-eye" data-s="eye" data-k="' + o.k + '" aria-label="Показать пароль" aria-pressed="false">' + ic("eye", 18, 1.7) + '</button>'
          : '<span class="tickok">' + ic("check", 17, 2.4) + '</span>') +
      '</div>' +
      '<div class="hs-err" id="hs-' + o.k + '-err" role="alert">' + ic("alert", 13, 2) + '<span></span></div>' +
    '</div>';
  }
  function selectField(o) {
    // a select always has a value, so its label stays in the lifted position
    return '<div class="hs-field" data-field="' + o.k + '">' +
      '<div class="hs-ctrl float">' +
        '<select id="hs-' + o.k + '" class="hs-input" data-s="sel" data-k="' + o.k + '" autocomplete="country">' +
          COUNTRIES.map(c => '<option value="' + c.id + '"' + (f[o.k] === c.id ? " selected" : "") + '>' + c.t + '</option>').join("") +
        '</select>' +
        '<label for="hs-' + o.k + '">' + o.label + '</label>' +
      '</div>' +
      '<div class="hs-err" id="hs-' + o.k + '-err" role="alert">' + ic("alert", 13, 2) + '<span></span></div>' +
    '</div>';
  }

  /* ---------------- View ---------------- */
  function view() {
    load();
    requestAnimationFrame(mount);
    // #hsMain has no width of its own — formBody/successBody bring .hs-page
    return '<div class="hsign">' + nav() + '<main class="hs-main"><div id="hsMain">' +
      (f.done ? successBody() : formBody()) + '</div></main></div>';
  }

  function nav() {
    return '<header class="hs-nav"><div class="hs-wrap"><div class="hs-nav-in">' +
      '<a class="hs-brand" href="../"><span class="mk">' + ic("box", 19, 1.7) + '</span>' +
        '<span class="name">Qar<b>aj</b></span></a>' +
      '<nav class="hs-links">' +
        '<a href="../">Главная</a><a href="../#how">Как это работает</a>' +
        '<a href="../#owners">Тарифы</a><a href="../#faq">Помощь</a>' +
      '</nav>' +
      '<span class="hs-nav-sp"></span>' +
      '<div class="hs-nav-act">' +
        '<button type="button" class="hs-btn hs-btn-ghost hs-btn-sm" data-s="signin">Войти</button>' +
        '<button type="button" class="hs-btn hs-btn-primary hs-btn-sm" data-s="focus-form">Регистрация</button>' +
      '</div>' +
    '</div></div></header>';
  }

  /* One centred card, fields stacked — the Airbnb signup shape. */
  function formBody() {
    return '<div class="hs-page">' +
      '<div class="hs-card">' +
        '<div class="hs-card-head"><h2>Регистрация</h2></div>' +
        '<div class="hs-card-body">' +
          '<h1 class="hs-title">Добро пожаловать в Qaraj</h1>' +
          '<p class="hs-sub">Создайте аккаунт, чтобы искать места для хранения или сдавать своё.</p>' +

          '<div class="hs-stack">' +
            '<div class="hs-2">' +
              field({ k: "first", label: "Имя", autocomplete: "given-name" }) +
              field({ k: "last", label: "Фамилия", autocomplete: "family-name" }) +
            '</div>' +
            field({ k: "email", label: "Эл. почта", type: "email", autocomplete: "email" }) +
            selectField({ k: "country", label: "Страна" }) +
            field({ k: "phone", label: "Телефон", type: "tel", autocomplete: "tel", inputmode: "tel" }) +
            field({ k: "pass", label: "Пароль", type: showPass ? "text" : "password", autocomplete: "new-password", toggle: true }) +
          '</div>' +

          '<div class="hs-meter" data-level="0" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>' +
          '<ul class="hs-rules" id="hsRules" aria-label="Требования к паролю">' +
            RULES.map(r => '<li data-rule="' + r.id + '"><span class="bx">' + ic("check", 10, 3.2) + '</span>' + r.t + '</li>').join("") +
          '</ul>' +

          '<div style="margin-top:12px">' +
            field({ k: "pass2", label: "Повторите пароль", type: showPass2 ? "text" : "password", autocomplete: "new-password", toggle: true }) +
          '</div>' +

          '<div class="hs-lbl">Тип аккаунта<small>Можно изменить позже в профиле.</small></div>' +
          '<div class="hs-types" role="radiogroup" aria-label="Тип аккаунта">' +
            [["owner", "Владелец", "Хочу сдавать помещение"],
             ["renter", "Арендатор", "Ищу место для хранения"]].map(r =>
              '<button type="button" class="hs-type" role="radio" aria-checked="' + (f.role === r[0]) + '" data-s="role" data-id="' + r[0] + '">' +
                '<span class="dot"></span><b>' + r[1] + '</b><span>' + r[2] + '</span></button>').join("") +
          '</div>' +

          '<div class="hs-lbl">Фото профиля<small>Необязательно — но с фото на заявки отвечают охотнее.</small></div>' +
          '<div class="hs-avatar-row">' +
            '<div class="hs-drop" id="hsDrop" data-s="avatar" role="button" tabindex="0" ' +
              'aria-label="Загрузить фото профиля">' + avatarInner() + '</div>' +
            '<div class="hs-avatar-tx">Перетащите файл сюда или выберите — JPG либо PNG, до 5 МБ.' +
              '<span class="acts">' +
                '<button type="button" class="hs-linkbtn" data-s="avatar">Выбрать файл</button>' +
                (f.avatar ? '<button type="button" class="hs-linkbtn danger" data-s="avatar-del">Удалить</button>' : "") +
              '</span></div>' +
          '</div>' +
          '<input type="file" id="hsFile" accept="image/*" hidden>' +

          '<div style="margin-top:18px">' +
            '<label class="hs-agree" data-agree><input type="checkbox" data-s="chk" data-k="terms"' + (f.terms ? " checked" : "") + '>' +
              '<span>Я принимаю <a href="#/signup" data-s="noop">Условия использования</a> и <a href="#/signup" data-s="noop">Политику конфиденциальности</a>.</span></label>' +
            '<label class="hs-agree"><input type="checkbox" data-s="chk" data-k="news"' + (f.news ? " checked" : "") + '>' +
              '<span>Хочу получать новости продукта и полезные советы.</span></label>' +
            '<div class="hs-err" id="hs-terms-err" role="alert">' + ic("alert", 13, 2) + '<span></span></div>' +
          '</div>' +

          '<div style="margin-top:16px">' +
            '<button type="submit" class="hs-btn hs-btn-primary hs-btn-lg hs-block" id="hsSubmit"' +
              (formValid() ? "" : " disabled") + '>Создать аккаунт</button>' +
            '<div class="hs-note" id="hsLeft" style="text-align:center" aria-live="polite"></div>' +
          '</div>' +

          '<div class="hs-div">или</div>' +
          '<div class="hs-social">' +
            '<button type="button" class="hs-soc" data-s="social" data-p="Google"><span class="bi">' + BRAND.google + '</span>Продолжить с Google</button>' +
            '<button type="button" class="hs-soc" data-s="social" data-p="Apple"><span class="bi">' + BRAND.apple + '</span>Продолжить с Apple</button>' +
            '<button type="button" class="hs-soc" data-s="social" data-p="Facebook"><span class="bi">' + BRAND.facebook + '</span>Продолжить с Facebook</button>' +
          '</div>' +

          '<div class="hs-foot-alt">Уже есть аккаунт? <a href="#/signin" data-s="signin">Войти</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="hs-legal">Регистрация демонстрационная — данные остаются в этом браузере и никуда не отправляются.</div>' +
    '</div>';
  }

  function avatarInner() {
    return (f.avatar
      ? '<img src="' + f.avatar + '" alt="Фото профиля">'
      : ic("user", 34, 1.5)) +
      '<span class="cam">' + ic("cam", 15, 1.9) + '</span>';
  }

  function successBody() {
    const name = (f.first || "").trim();
    return '<div class="hs-page"><div class="hs-card"><div class="hs-card-body"><div class="hs-done">' +
      '<div class="hs-done-ic"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" ' +
        'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-11"/></svg></div>' +
      '<h1>Добро пожаловать в сообщество' + (name ? ", " + esc(name) : "") + '!</h1>' +
      '<p class="lead">Ваш аккаунт создан. Осталось несколько шагов, чтобы получить полный доступ.</p>' +
      '<div class="hs-steps">' +
        NEXT_STEPS.map((s, i) =>
          '<div class="hs-stepcard' + (i === 0 ? " on" : "") + '" style="animation-delay:' + (0.1 + i * 0.08) + 's">' +
            '<span class="n">' + (i + 1) + '</span>' +
            '<span class="tx"><b>' + s[0] + '</b><span>' + s[1] + '</span></span>' +
            '<span class="st">' + s[2] + '</span></div>').join("") +
      '</div>' +
      '<div class="hs-done-acts">' +
        '<button type="button" class="hs-btn hs-btn-primary" data-s="continue">Продолжить</button>' +
        '<button type="button" class="hs-btn hs-btn-ghost" data-s="dashboard">Перейти в личный кабинет</button>' +
      '</div>' +
    '</div></div></div></div>';
  }

  /* ---------------- Mount + surgical updates ---------------- */
  function mount() {
    const host = document.getElementById("hsMain");
    if (!host) return;
    document.title = (f.done ? "Аккаунт создан" : "Регистрация") + " — Qaraj";
    if (f.done) return;
    const form = document.getElementById("hsForm");
    if (form) form.addEventListener("submit", (e) => { e.preventDefault(); submit(); });
    bindAvatar();
    refreshRules();
    Object.keys(CHECKS).forEach(k => { if (touched[k]) paintField(k); });
    refreshSubmit();
  }
  function repaint() {
    const host = document.getElementById("hsMain");
    if (!host) return;
    host.innerHTML = f.done ? successBody() : formBody();
    mount();
  }

  function paintField(k) {
    const wrap = document.querySelector('.hs-field[data-field="' + k + '"]');
    const msg = errorOf(k);
    if (k === "terms") {
      const box = document.getElementById("hs-terms-err");
      if (box) { box.querySelector("span").textContent = msg; box.classList.toggle("on", !!msg && !!touched.terms); }
      const lbl = document.querySelector("[data-agree]");
      if (lbl) lbl.classList.toggle("bad", !!msg && !!touched.terms);
      return;
    }
    if (!wrap) return;
    const input = wrap.querySelector(".hs-input");
    const box = wrap.querySelector(".hs-err");
    const show = !!msg && !!touched[k];
    box.querySelector("span").textContent = msg;
    box.classList.toggle("on", show);
    input.classList.toggle("bad", show);
    input.classList.toggle("ok", !msg && !!String(f[k] || "").length);
    const ctrl = wrap.querySelector(".hs-ctrl");
    if (ctrl) ctrl.classList.toggle("good", !msg && !!String(f[k] || "").length);
  }
  function refreshRules() {
    const list = document.getElementById("hsRules");
    if (!list) return;
    let passed = 0;
    RULES.forEach(r => {
      const ok = r.test(f.pass);
      if (ok) passed++;
      const li = list.querySelector('[data-rule="' + r.id + '"]');
      if (li) li.classList.toggle("ok", ok);
    });
    const meter = document.querySelector(".hs-meter");
    if (meter) meter.setAttribute("data-level", f.pass ? String(passed) : "0");
  }
  function refreshSubmit() {
    const btn = document.getElementById("hsSubmit");
    const left = Object.keys(CHECKS).filter(k => errorOf(k)).length;
    if (btn) btn.disabled = !!left;
    // the button stays disabled until the form is valid, so say what is missing
    const hint = document.getElementById("hsLeft");
    if (hint) hint.textContent = left
      ? "Осталось заполнить: " + left + " " + plural(left, "поле", "поля", "полей")
      : "Всё заполнено — можно создавать аккаунт";
  }
  function plural(n, one, few, many) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return few;
    return many;
  }

  /* ---------------- Avatar ---------------- */
  function bindAvatar() {
    const drop = document.getElementById("hsDrop");
    if (!drop) return;
    ["dragenter", "dragover"].forEach(t => drop.addEventListener(t, (e) => {
      e.preventDefault(); drop.classList.add("over");
    }));
    ["dragleave", "drop"].forEach(t => drop.addEventListener(t, (e) => {
      e.preventDefault(); drop.classList.remove("over");
    }));
    drop.addEventListener("drop", (e) => {
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) readAvatar(file);
    });
    drop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickAvatar(); }
    });
  }
  function pickAvatar() {
    const inp = document.getElementById("hsFile");
    if (!inp) return;
    inp.value = "";
    inp.onchange = () => { const file = inp.files && inp.files[0]; if (file) readAvatar(file); };
    inp.click();
  }
  function readAvatar(file) {
    if (!/^image\//.test(file.type)) { toast("Нужен файл изображения"); return; }
    if (file.size > 5 * 1024 * 1024) { toast("Файл больше 5 МБ"); return; }
    const drop = document.getElementById("hsDrop");
    if (drop) drop.classList.add("busy");
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        // square crop + downscale, so the data URL fits in localStorage
        const S = 256, side = Math.min(img.width, img.height);
        const cv = document.createElement("canvas");
        cv.width = cv.height = S;
        cv.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
        try { f.avatar = cv.toDataURL("image/jpeg", 0.82); } catch (e) { f.avatar = fr.result; }
        save(); repaint();
      };
      img.onerror = () => { if (drop) drop.classList.remove("busy"); toast("Не удалось прочитать файл"); };
      img.src = fr.result;
    };
    fr.onerror = () => { if (drop) drop.classList.remove("busy"); toast("Не удалось прочитать файл"); };
    fr.readAsDataURL(file);
  }

  /* ---------------- Submit ---------------- */
  function submit() {
    Object.keys(CHECKS).forEach(k => touched[k] = true);
    Object.keys(CHECKS).forEach(paintField);
    if (!formValid()) {
      const firstBad = Object.keys(CHECKS).find(k => errorOf(k));
      const el = document.getElementById("hs-" + firstBad) || document.querySelector("[data-agree]");
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); if (el.focus) try { el.focus({ preventScroll: true }); } catch (e) {} }
      return;
    }
    const btn = document.getElementById("hsSubmit");
    if (btn) { btn.classList.add("busy"); btn.textContent = "Создаём аккаунт…"; btn.disabled = true; }
    setTimeout(() => { f.done = true; repaint(); window.scrollTo({ top: 0, behavior: "smooth" }); }, 1100);
  }
  function enter() {
    // sign the new account in so the app is reachable from the success screen
    if (Q.store.register) Q.store.register(f.email || Q.store.DEMO.email);
    else Q.store.loginDemo();
    clearSaved();
  }
  function toast(m) { if (Q.app && Q.app.toast) Q.app.toast(m); }

  /* ---------------- Events ---------------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-s]");
    if (!t || !t.closest(".hsign")) return;
    const a = t.dataset.s;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return;
    e.preventDefault();

    switch (a) {
      case "noop": toast("Недоступно в демо-версии"); break;
      case "signin": location.hash = "/signin"; break;
      case "focus-form": {
        const el = document.getElementById("hs-first");
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus({ preventScroll: true }); }
        break;
      }
      case "role":
        f.role = t.dataset.id;
        t.parentNode.querySelectorAll(".hs-type").forEach(c => c.setAttribute("aria-checked", String(c === t)));
        save();
        break;
      case "eye": {
        const k = t.dataset.k;
        if (k === "pass") showPass = !showPass; else showPass2 = !showPass2;
        const on = k === "pass" ? showPass : showPass2;
        const input = document.getElementById("hs-" + k);
        if (input) { input.type = on ? "text" : "password"; input.focus({ preventScroll: true }); }
        t.innerHTML = ic(on ? "eyeOff" : "eye", 18, 1.7);
        t.setAttribute("aria-pressed", String(on));
        t.setAttribute("aria-label", on ? "Скрыть пароль" : "Показать пароль");
        break;
      }
      case "avatar": pickAvatar(); break;
      case "avatar-del": f.avatar = ""; save(); repaint(); break;
      case "social": toast("Вход через " + t.dataset.p + " — недоступен в демо"); break;
      case "continue": enter(); location.hash = "/"; break;
      case "dashboard": enter(); location.hash = "/profile"; break;
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target.closest("[data-s]");
    if (!t || !t.closest(".hsign") || t.dataset.s !== "in") return;
    const k = t.dataset.k;
    if (k === "phone") t.value = maskPhone(t.value);
    f[k] = t.value;
    if (k === "pass") { refreshRules(); if (touched.pass2) paintField("pass2"); }
    if (k === "pass2" && touched.pass) paintField("pass");
    if (touched[k]) paintField(k);
    refreshSubmit();
    if (k !== "pass" && k !== "pass2") save();
  });

  document.addEventListener("change", (e) => {
    const t = e.target.closest("[data-s]");
    if (!t || !t.closest(".hsign")) return;
    if (t.dataset.s === "sel") {
      f[t.dataset.k] = t.value;
      // re-mask the phone for the new country code (the placeholder stays " "
      // so the floating label keeps working)
      const ph = document.getElementById("hs-phone");
      if (ph && f.phone) { ph.value = maskPhone(ph.value); f.phone = ph.value; }
      paintField(t.dataset.k); paintField("phone"); refreshSubmit(); save();
    }
    if (t.dataset.s === "chk") {
      f[t.dataset.k] = t.checked;
      if (t.dataset.k === "terms") { touched.terms = true; paintField("terms"); }
      refreshSubmit(); save();
    }
  });

  /* validate on blur — the standard "don't shout while I type" pattern */
  document.addEventListener("focusout", (e) => {
    const t = e.target.closest("[data-s]");
    if (!t || !t.closest(".hsign") || (t.dataset.s !== "in" && t.dataset.s !== "sel")) return;
    touched[t.dataset.k] = true;
    paintField(t.dataset.k);
  }, true);

  function maskPhone(v) {
    const c = COUNTRIES.find(x => x.id === f.country) || COUNTRIES[0];
    let d = digits(v);
    if (c.code === "+7") {
      if (d[0] === "8") d = "7" + d.slice(1);
      if (d[0] !== "7") d = "7" + d;
      d = d.slice(0, 11);
      let out = "+7";
      if (d.length > 1) out += " " + d.slice(1, 4);
      if (d.length > 4) out += " " + d.slice(4, 7);
      if (d.length > 7) out += "-" + d.slice(7, 9);
      if (d.length > 9) out += "-" + d.slice(9, 11);
      return out;
    }
    const raw = c.code.replace("+", "");
    if (d.indexOf(raw) !== 0) d = raw + d;
    d = d.slice(0, 15);
    return "+" + d.replace(new RegExp("^(" + raw + ")(\\d{0,3})(\\d{0,3})(\\d{0,4})"), (m, a, b, cc, dd) =>
      [a, b, cc, dd].filter(Boolean).join(" "));
  }

  Q.views.signup = view;
  Q.router.add("/signup", view);
})(window.Q = window.Q || {});
