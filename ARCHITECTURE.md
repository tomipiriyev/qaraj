# ARCHITECTURE.md — Qaraj Web App

The **web version of the Qaraj application** (the product modeled in Figma "Qaraj — App UI").
This document is the source of truth for how the web app is structured and built. Build the
app by following this file; update this file first if the design changes.

---

## 1. Goal & principles

- Deliver a **responsive web application** — the Qaraj product as a website, laid out natively
  for large screens and reflowing to tablet/mobile.
- **It is NOT a phone mockup.** No fixed device frame anywhere. Desktop uses full width
  (app-bar, card grid, split map+list, modals, detail pages) the way Airbnb's *website* does,
  not the app in a phone shell.
- **Reuse the design system** from the Figma app and the landing page: green tokens
  (`--brand #1f9d55` …), Sora + Inter, and the app's components (SpaceCard, category tabs,
  amenity chips, price histogram, calendar, price pins).
- **Product model** stays consistent with the landing + MVP: three categories
  **Склад** (storage, whole space, per-space price) / **Площадь м²** (area, per-m²) /
  **Гараж** (garage, per-space, sized by car). Five shared amenities: Климат-контроль,
  Видеонаблюдение, Доступ 24/7, Датчик дыма, Электричество.
- **v1 = inquiry / match only** (per [MVP.md](MVP.md)): no payments, no real backend.
  The booking CTA is **"Отправить заявку"**.
- **Static, no build step** (consistent with the repo). Vanilla HTML/CSS/JS, hash-routed SPA.
- Russian copy, ₽ prices, example cities Москва / Санкт-Петербург / Казань.

## 2. Entry point & auth

- Landing `index.html` header **Войти** button → `/app/` (already wired).
- **Demo account gate** on first load: `demo@qaraj.ru` / `demo1234` (pre-filled), plus a
  "Войти как демо-гость" one-tap button.
- Auth flag in `sessionStorage['qaraj_auth']`. A **route guard** redirects unauthenticated
  users to `#/signin`. Sign out lives in Profile.
- The app is `noindex` and stays **out of `sitemap.xml`** (gated demo, not SEO content).

## 3. Directory structure

```
/app/
  index.html              SPA shell: <head> meta, #app root, script/style includes
  styles/
    app.css               design tokens + layout + all component styles
  js/
    data.js               listings dataset, districts, amenities, categories
    store.js              app state: auth, active category, filters, favorites, query, inquiries
    router.js             hash router + auth guard
    components.js         pure render helpers (appbar, searchbar, card, chips, calendar, map…)
    views.js              one render function per route, composed from components
    app.js               bootstrap: mount #app, subscribe to route changes, wire global events
```

Files may be consolidated during build, but this is the module boundary: **data → store →
router → components → views → app**. No framework, no bundler.

## 4. Routes & views

| Route            | View            | Desktop layout                              | Mobile layout                          |
|------------------|-----------------|---------------------------------------------|----------------------------------------|
| `#/signin`       | Sign in         | split: brand hero + form card               | single-column form                     |
| `#/` (explore)   | Search results  | sticky app-bar + category tabs + **card grid** (auto-fill) | stacked cards            |
| `#/map`          | Map + list      | **two-pane**: scrollable list left, sticky map right, pins ↔ cards linked | full map + bottom sheet + list toggle |
| `#/space/:id`    | Listing detail  | photo gallery + 2-col (specs / sticky booking card) | stacked; sticky bottom CTA bar |
| `#/saved`        | Избранное       | favorites card grid                         | stacked                                |
| `#/trips`        | Заявки          | list of submitted inquiries                 | stacked                                |
| `#/profile`      | Профиль         | account panel + sign out                    | stacked                                |

**Overlays (not routes):** Filters modal, Search modal (Где / Когда / Что храните),
Inquiry modal (calendar + term Месяц/Полгода/Год → confirm).

## 5. Design system (tokens mirror Figma & `styles/page.css`)

- **Color:** `--brand #1f9d55`, `--brand-2 #34b56a`, `--brand-deep #0f5132`,
  `--brand-tint #e7f4ec`, `--ink`, `--ink-soft`, `--ink-mute`, `--line`, `--bg`, `--bg-soft`.
- **Type:** Sora 600–800 (headings), Inter 400–800 (body).
- **Tokens:** radius scale, shadow scale, spacing scale — defined once in `app.css :root`.
- **AppBar (Airbnb-style):** on explore/map it's two rows — row 1 `logo · centered CategoryTabs · right cluster (Стать хозяином + globe + menu pill)`, row 2 a big centered SearchPill; on other routes it collapses to one row with a compact pill. Mobile reflows to `brand + menu` / scrollable cats / full-width pill (grid-template-areas). Offsets use `--appbar-h` (one-row) and `--appbar-two` (two-row, for the map sticky panes).
- **Components:** AppBar, SearchPill, UserMenu/Avatar, CategoryTabs, SpaceCard, Badge, Rating,
  AmenityChip, FilterModal, PriceHistogram, Stepper, Calendar, MapPane + PricePin, BottomSheet,
  Button (primary/ghost/dark), EmptyState, Toast.

## 6. Data model

`data.js` exports ~15 listings across the three categories using local `images/*.jpeg`.

```js
Listing = {
  id, title, category: 'sklad' | 'ploshad' | 'garage',
  city, district, sizeM2,
  price,            // number (₽/mo)  — for sklad & garage
  pricePerM2,       // number (₽/m²)  — for ploshad (price computed from size)
  rating, reviews,
  badge,            // 'Проверено' | 'Гараж' | 'Площадь' | null
  amenities: [],    // subset of the 5 shared amenities
  photos: [],       // paths into ../images/
  map: { x, y },    // relative % coords for the stylized map pins
  verified, availableNow
}
```

Also: `districts[]` (Рядом, Москва, Санкт-Петербург, Казань…), `amenities[]`, `categories[]`.

## 7. Responsive strategy

- **Desktop-first web app.** Breakpoints ≈ **1100px / 760px / 520px**.
- Card grid: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`.
- Map view: CSS-grid split at ≥760px; below that, single map pane + bottom sheet + list toggle.
- Nav: full horizontal app-bar on desktop; condensed bar + bottom tab bar on mobile.
- **Never** a hardcoded device frame.

## 8. State & interactions (client-side only)

- Category tabs + Filters modal (category, min m², price range, amenities) **filter `data.js`
  live**, updating both the card grid and the map pins/count.
- Favorites (heart) toggle persists in `sessionStorage`; drives the Избранное view.
- Search pill captures query (district / dates / term) and reflects it in the app-bar.
- Inquiry flow: choose dates + term → confirm → appends to `store.inquiries` → shows in Заявки.
- Map: hovering/selecting a pin highlights its list card and vice-versa.

## 9. Out of scope (v1)

Real backend & auth, payments, real maps/geolocation, owner listing-creation flow, messaging,
i18n beyond Russian. These are noted in MVP.md as later phases.

## 10. Build order (milestones)

1. `/app/index.html` shell + `app.css` tokens & primitives.
2. `data.js` dataset.
3. Sign-in view + auth guard + landing entry.
4. AppBar + CategoryTabs + SpaceCard **grid** (Explore) with live category filtering.
5. Filters modal + Search modal wired to live filtering.
6. Map split view + pins ↔ cards.
7. Listing detail page + inquiry flow (calendar/term → Заявки).
8. Saved / Заявки / Профиль + sign out.
9. Responsive passes; verify with headless screenshots at desktop + mobile widths.

## 11. Verification

Each milestone is checked by rendering the served page headless (Chrome) at ~1280px and ~390px
and visually confirming layout — not just that files exist.
