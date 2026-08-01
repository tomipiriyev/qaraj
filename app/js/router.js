/* Qaraj web app — hash router + auth guard. */
(function (Q) {
  const routes = []; // {re, keys, view}
  const PUBLIC = ["/signin", "/signup"];   // reachable while signed out
  let notFound = null;

  function add(pattern, view) {
    const keys = [];
    const re = new RegExp("^" + pattern.replace(/:[^/]+/g, m => { keys.push(m.slice(1)); return "([^/]+)"; }) + "$");
    routes.push({ re, keys, view });
  }
  function setNotFound(view) { notFound = view; }

  function current() { return (location.hash || "#/").replace(/^#/, ""); }
  function navigate(to) { if (current() === to) resolve(); else location.hash = to; }

  /* Routes may carry a query string (#/filters/garage?veh=car). It is stripped
     before matching and read back through query(). */
  function path() { const p = current(), i = p.indexOf("?"); return i === -1 ? p : p.slice(0, i); }
  function query() {
    const p = current(), i = p.indexOf("?"), out = {};
    if (i === -1) return out;
    new URLSearchParams(p.slice(i + 1)).forEach((v, k) => { out[k] = v; });
    return out;
  }
  /* Rewrite the query in place — replaceState fires no hashchange, so the view
     is not re-rendered and the URL stays shareable while the user edits. */
  function setQuery(obj) {
    const qs = new URLSearchParams(obj).toString();
    history.replaceState(null, "", location.pathname + location.search + "#" + path() + (qs ? "?" + qs : ""));
  }

  function match(path) {
    for (const r of routes) {
      const m = r.re.exec(path);
      if (m) { const params = {}; r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1])); return { view: r.view, params }; }
    }
    return notFound ? { view: notFound, params: {} } : null;
  }

  function resolve() {
    const p = path();
    // auth guard: everything except the public routes requires auth
    if (PUBLIC.indexOf(p) === -1 && !Q.store.isAuthed()) { location.hash = "/signin"; return; }
    if (p === "/signin" && Q.store.isAuthed()) { location.hash = "/"; return; }
    const hit = match(p);
    if (!hit) return;
    const root = document.getElementById("app");
    /* A view that is missing (a stale bundle can leave a route pointing at one
       that no longer exists) or that throws would otherwise abort before the
       assignment below, leaving the previous screen up — which reads as a
       button that does nothing. Fall back to the not-found view and say so. */
    let html;
    try {
      if (typeof hit.view !== "function") throw new Error("no view registered");
      html = hit.view(hit.params) || "";
    } catch (err) {
      console.error("[router] " + p + " failed to render:", err);
      if (typeof notFound !== "function" || hit.view === notFound) return;
      try { html = notFound({}) || ""; } catch (e2) { return; }
    }
    root.innerHTML = html;
    window.scrollTo(0, 0);
    Q.app && Q.app.afterRender && Q.app.afterRender(p, hit.params);
  }

  function start() { window.addEventListener("hashchange", resolve); resolve(); }

  Q.router = { add, setNotFound, current, path, query, setQuery, navigate, start, resolve };
})(window.Q = window.Q || {});
