/* Qaraj web app — Yandex Maps (JS API 2.1) for the results map.

   The API needs a key. Set it once in index.html:
       window.QARAJ_YMAPS_KEY = "…";
   Get one at https://developer.tech.yandex.ru/services under "JavaScript API
   и HTTP Геокодер", and list the site's host in the key's allowed referrers.
   (The newer v3 API is a *separate* product — a 2.1 key returns 403 there,
   which is why this file targets 2.1.)

   Without a key — or if the API fails to load — nothing here runs and the pane
   keeps the hand-drawn fallback map, so the demo never ends up blank.

   Pins are our own DOM (.pin), mounted through a custom placemark layout, so
   the price bubbles look identical on the real and the fallback map. */
(function (Q) {
  const D = Q.data;
  const SRC = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=";
  const ZOOM = { min: 3, max: 18 };

  let loading = null;          // promise for the one-time API load
  let map = null;              // the ymaps.Map, kept alive between renders
  let host = null;             // its container, moved into each new pane
  let PinLayout = null;

  function key() { return (window.QARAJ_YMAPS_KEY || "").trim(); }
  function available() { return !!key(); }
  function live() { return !!map; }

  /* Load the API once. Rejects on a missing key, a network error, or if the
     script sits there for more than 8s (blocked host, offline, bad key). */
  function load() {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      if (!available()) return reject(new Error("no-key"));
      if (window.ymaps && window.ymaps.Map) return resolve(window.ymaps);
      const s = document.createElement("script");
      s.src = SRC + encodeURIComponent(key());
      s.async = true;
      const t = setTimeout(() => reject(new Error("timeout")), 8000);
      s.onload = () => {
        clearTimeout(t);
        if (!window.ymaps) return reject(new Error("no-ymaps"));
        window.ymaps.ready(() => resolve(window.ymaps));
      };
      s.onerror = () => { clearTimeout(t); reject(new Error("load-failed")); };
      document.head.appendChild(s);
    });
    return loading;
  }

  /* [[southLat, westLng], [northLat, eastLng]] — 2.1's bounds order. */
  function boundsOf(list) {
    let n = -90, s = 90, w = 180, e = -180;
    list.forEach(l => {
      const p = D.listingLL(l);
      n = Math.max(n, p[0]); s = Math.min(s, p[0]);
      e = Math.max(e, p[1]); w = Math.min(w, p[1]);
    });
    const padY = Math.max((n - s) * 0.06, 0.002), padX = Math.max((e - w) * 0.06, 0.004);
    return [[s - padY, w - padX], [n + padY, e + padX]];
  }
  function fitTo(list, duration) {
    if (!list.length) {
      const c = D.cityLL(Q.store.place().city || Q.store.place().name);
      map.setCenter(c, 11, { duration: duration || 0 });
      return;
    }
    map.setBounds(boundsOf(list), { checkZoomRange: true, zoomMargin: 20, duration: duration || 0 });
  }

  /* Our price bubble as a placemark layout; the pin markup comes from the same
     component the fallback map uses, so the two stay in step. */
  function layoutClass(ymaps) {
    if (PinLayout) return PinLayout;
    PinLayout = ymaps.templateLayoutFactory.createClass('$[properties.pinHtml]');
    return PinLayout;
  }
  function pinHtml(l) { return Q.c.pinHtml(l, false); }

  /* Swap the placemarks for the current results and reframe. */
  function render(ymaps, list) {
    const Layout = layoutClass(ymaps);
    map.geoObjects.removeAll();
    list.forEach(l => {
      map.geoObjects.add(new ymaps.Placemark(D.listingLL(l), { pinHtml: pinHtml(l) }, {
        iconLayout: Layout,
        // the bubble is centred on the point, so its shape is centred too
        iconShape: { type: "Rectangle", coordinates: [[-44, -16], [44, 16]] },
      }));
    });
    fitTo(list, 0);
  }
  function reveal(slot) {
    const pane = slot.closest(".map-pane");
    if (pane) { pane.classList.add("live"); pane.classList.remove("pending"); }
  }

  /* Called on every render of the results page. The map itself is built once —
     after that its container is simply moved into the new pane, so the tiles
     never blink between renders. */
  function mount(list) {
    const slot = document.getElementById("ymap");
    if (!slot || !available()) return;
    if (map && host) {
      slot.appendChild(host);
      map.container.fitToViewport();
      render(window.ymaps, list);
      reveal(slot);
      return;
    }
    load().then((ymaps) => {
      // the route may have changed while the API was loading
      const now = document.getElementById("ymap");
      if (!now || map) return;
      host = document.createElement("div");
      host.className = "ymap-host";
      now.appendChild(host);
      map = new ymaps.Map(host, {
        center: D.cityLL("Москва"), zoom: 11, controls: [],
      }, {
        suppressMapOpenBlock: true, yandexMapDisablePoiInteractivity: true,
        minZoom: ZOOM.min, maxZoom: ZOOM.max,
      });
      render(ymaps, list);
      reveal(now);
    }).catch((err) => {
      // give up on the API and let the fallback map show through
      const pane = document.getElementById("mapPane");
      if (pane) pane.classList.remove("pending");
      if (window.console) console.info("Yandex Maps unavailable (" + err.message + "); using the fallback map");
    });
  }

  /* Leaving the results page: park the container, keep the instance. */
  function detach() {
    if (host && host.parentNode) host.parentNode.removeChild(host);
  }

  /* Zoom buttons on the pane drive the real map when it is live. */
  function zoomBy(d) {
    if (!map) return false;
    map.setZoom(Math.max(ZOOM.min, Math.min(ZOOM.max, map.getZoom() + d)), { duration: 200 });
    return true;
  }
  function fit(list) {
    if (!map) return false;
    fitTo(list, 300);
    return true;
  }

  Q.ymap = { available, mount, detach, zoomBy, fit, live };
})(window.Q = window.Q || {});
