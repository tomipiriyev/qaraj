/* Qaraj web app — state store (sessionStorage-backed, no backend). */
(function (Q) {
  const KEY = "qaraj_state_v2";   // v2: query.{place,dateISO,flex} replaced query.district
  const AUTH = "qaraj_auth";
  const DEMO = { email: "demo@qaraj.ru", pass: "demo1234", name: "Демо-гость" };

  const defaults = {
    category: "sklad",
    // place + category come from the search bar; the dates are set per listing
    // in the inquiry form (the bar no longer asks for them)
    query: { place: null, q: "", dateISO: null, dateEndISO: null, term: "Месяц" },
    filters: { minM2: 0, priceMax: 30000, amenities: [] },
    // each category has its own filter page under #/filters/
    garage: Q.data.garageDefaults(),
    space: Q.data.spaceDefaults(),
    sklad: Q.data.skladDefaults(),
    favorites: [],
    inquiries: [],
    selectedId: null,
  };

  let state = load();
  const subs = [];

  function load() {
    let s;
    try { s = Object.assign({}, defaults, JSON.parse(sessionStorage.getItem(KEY) || "{}")); }
    catch (e) { s = Object.assign({}, defaults); }
    // fill in keys added after a session was stored
    s.garage = Object.assign(Q.data.garageDefaults(), s.garage);
    s.space = Object.assign(Q.data.spaceDefaults(), s.space);
    s.sklad = Object.assign(Q.data.skladDefaults(), s.sklad);
    if (!s.space.items) s.space.items = {};
    return s;
  }
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function get() { return state; }
  function set(patch) { Object.assign(state, patch); persist(); emit(); }
  function subscribe(fn) { subs.push(fn); }
  function emit() { subs.forEach(fn => fn(state)); }

  /* auth */
  function isAuthed() { try { return !!sessionStorage.getItem(AUTH); } catch (e) { return false; } }
  function currentEmail() { try { return sessionStorage.getItem(AUTH) || DEMO.email; } catch (e) { return DEMO.email; } }
  function login(email, pass) {
    if (email.trim().toLowerCase() === DEMO.email && pass === DEMO.pass) { doAuth(DEMO.email); return true; }
    return false;
  }
  function loginDemo() { doAuth(DEMO.email); }
  function register(email) { doAuth((email || DEMO.email).trim().toLowerCase()); }
  function doAuth(email) { try { sessionStorage.setItem(AUTH, email); } catch (e) {} }
  function logout() { try { sessionStorage.removeItem(AUTH); sessionStorage.removeItem(KEY); } catch (e) {} state = load(); }

  /* favorites */
  function isFav(id) { return state.favorites.indexOf(id) !== -1; }
  function toggleFav(id) {
    const i = state.favorites.indexOf(id);
    if (i === -1) state.favorites.push(id); else state.favorites.splice(i, 1);
    persist(); emit();
    return isFav(id);
  }

  /* inquiries */
  function addInquiry(inq) { state.inquiries.unshift(inq); persist(); emit(); }

  /* the search query's place, always a valid Q.data.places entry */
  function place() { return state.query.place || Q.data.ANY_PLACE; }

  /* filtering — returns listings matching category + place + filters.
     Every category is filtered and sorted by its own filter page. */
  function filtered() {
    const f = state.filters, cat = state.category, p = place();
    const q = (state.query.q || "").trim();
    let list;
    if (cat === "garage") list = Q.data.garageResults(state.garage, p);
    else if (cat === "ploshad") list = Q.data.spaceResults(state.space, p);
    else if (cat === "sklad") list = Q.data.skladResults(state.sklad, p);
    else list = Q.data.listings.filter(l => {
      if (l.category !== cat) return false;
      if (!Q.data.placeMatches(l, p)) return false;
      if (l.sizeM2 < f.minM2) return false;
      if (Q.data.monthly(l) > f.priceMax) return false;
      if (f.amenities.length && !f.amenities.every(a => l.amenities.indexOf(a) !== -1)) return false;
      return true;
    });
    // the home search field narrows whatever the category produced
    return q ? list.filter(l => Q.data.textMatches(l, q)) : list;
  }

  Q.store = {
    DEMO, get, set, subscribe,
    isAuthed, currentEmail, login, loginDemo, register, logout,
    isFav, toggleFav, addInquiry, filtered, place,
  };
})(window.Q = window.Q || {});
