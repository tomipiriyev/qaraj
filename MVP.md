# Qaraj — MVP Specification (v1)

> Airbnb-style marketplace for unused storage space (garages, basements, spare
> rooms, warehouse corners, parking, lock-ups), localized for the Russian market.
> This document defines the **first buildable version** of the product behind the
> existing marketing landing page ([index.html](index.html)).

---

## 1. MVP goal & guiding decisions

**Goal:** prove the core loop works once, end to end — *an owner lists real
space, a renter finds it, and they agree to a rental* — with the smallest product
that makes that real.

Decisions that scope this MVP (confirmed with product owner):

| Decision | Choice | Consequence for scope |
|---|---|---|
| Transaction model | **Inquiry / match only.** Free for the first 3 months, **payment handled offline** between the two parties. | No ЮKassa, no escrow, no payouts, no commission, no refunds in v1. Qaraj is the matchmaker, not the payment rail. |
| Platform | **Native mobile app** (iOS + Android). | Cross-platform framework; app-store + RuStore distribution. |
| Sizing helper | **Include** the "what m² do I need?" calculator. | Ships as a renter-side helper that feeds search. |
| Tech stack | Recommended below. | Chosen for RU-market fit + speed, not generic defaults. |

**Explicitly out of scope for v1** (v2+ backlog): online payments & commission,
insurance/deposits, ratings & reviews, identity/KYC verification, yearly-plan
billing, in-app disputes, admin/moderation console beyond a basic kill-switch,
promo codes, referrals.

---

## 2. Core loop (the one thing that must work)

```
Owner                          Renter
  |                              |
  |  create listing              |  browse / search (city, map, filters)
  |  (photos, size, price,       |  optional: "what fits?" m² calculator
  |   address, category) ------> |  open listing detail
  |                              |  send Request (dates + message)
  |  <---- notified of Request --|
  |  Accept / Decline            |
  |  ----> contacts revealed ----|
  |                              |
  +----- they arrange payment & handover OFFLINE -----+
```

An owner and a renter are the **same account type** — anyone can list a space and
anyone can rent one. No separate "owner app."

---

## 3. Screens (mobile app)

1. **Auth / onboarding** — phone number → SMS one-time code → name. (Russian users
   expect phone login, not email.)
2. **Home / Search** — list + map toggle; filter by city, **category** (Склад /
   Площадь / Гараж), size, price, and facility amenities (climate control, camera
   monitoring, 24/7 access, smoke detector, electricity). The sizing control is
   **category-specific**: площадь в m² for Склад, item-type picker → suggested m² for
   Площадь, and car size for Гараж. Entry point to the m² calculator.
3. **m² calculator** — only relevant to the **Площадь (m²)** category: pick item
   types (коробки, шины, велосипед, мотоцикл, мебель…), get a suggested m², then "show
   m² spaces ≥ this size."
4. **Listing detail** — photo gallery, size, price/period, location (map pin +
   district; exact address hidden until accepted), description, "Request" button.
5. **Request flow** — pick date range / period + optional message → submit.
6. **Create / edit listing** (owner) — photos (upload), map pin for address, size
   m², price ₽ + period (month/year), category, description, publish/pause.
7. **My activity** — tabbed: *My listings* (owner view + incoming requests) and
   *My requests* (renter view + status).
8. **Contact / lightweight message** — on Accept, reveal phone; MVP messaging is a
   simple thread (stretch) or plain contact reveal (baseline).
9. **Profile / settings** — name, phone, my listings, logout, delete account
   (required for app-store compliance).

> **Design reference:** an interactive Figma prototype models the renter-side flow
> (Home feed → Search → Date/period → Map → Filter), Airbnb-style with the Qaraj green
> theme, Russian copy and ₽ pricing. File: *Qaraj — App UI (Airbnb-style)* in the Qaraj
> Figma team.

---

## 4. Data model (initial)

```
User        id, phone (unique), name, created_at
Listing     id, owner_id→User, title, description,
            category(enum: garage|storage|area),
            city, district, address (private), lat, lng,
            size_sqm, price_rub,
            price_basis(enum: per_space|per_sqm),  // area→per_sqm; garage/storage→per_space
            car_size(enum: compact|standard|large, nullable),  // garage only
            amenities(set: climate|camera|access_24_7|smoke|electricity),
            period(enum: month|year),
            status(enum: active|paused|rented), created_at
ListingPhoto id, listing_id→Listing, url, sort_order
Request     id, listing_id→Listing, renter_id→User,
            start_date, end_date(nullable), message,
            status(enum: requested|accepted|declined|cancelled),
            created_at
Message     id, request_id→Request, sender_id→User, body, created_at   // stretch
```

**Categories (3, simplified):**

| Category | Что это | Pricing basis | Sizing dimension | m² calculator? |
|---|---|---|---|---|
| **Склад** (storage) | Отдельное закрытое помещение целиком | per space | площадь, м² | no |
| **Площадь, м²** (area) | Часть большого помещения, аренда по м² | per m² | тип вещей → расчёт м² | **yes** |
| **Гараж** (garage) | Гараж / бокс под авто и вещи | per space | размер авто (компакт / стандарт / большой) | no |

> **v1 category change:** the third category is now **Гараж (garage)**, replacing the
> earlier **Парковка (parking)** — a garage is a storable space, whereas open parking is
> a car-spot product. This is reflected in the Figma app UI.

`size_sqm` still describes storage/garage listings (useful for filtering), but their
**price is per space**; only the *area* category is priced per m². Garages additionally
carry a `car_size`.

**Filter attributes per category** (all three share the five facility amenities —
`climate` / `camera` / `access_24_7` / `smoke` / `electricity`):

| | Склад | Площадь, м² | Гараж |
|---|---|---|---|
| Primary sizing | Area, m² | item type (коробки / шины / велосипед / мотоцикл) → calc m² | car size (компакт / стандарт / большой) |
| Facility amenities | ✓ | ✓ | ✓ |

---

## 5. Recommended tech stack (and why — RU market drives this)

The usual "Next.js + Supabase on Vercel/AWS" default is a **poor fit here** because
of Russian-market constraints. Recommendation:

### Mobile app — **React Native + Expo** *(primary)* or **Flutter** *(strong alt)*
- One codebase → iOS + Android. Expo gives fast builds, over-the-air updates, and
  can produce APKs for **RuStore** (see distribution below).
- React Native reuses the JavaScript/React ecosystem the web landing already lives
  in. **Flutter** is an equally good choice — very popular in the RU dev market
  (easier hiring) and gives pixel-perfect control to match the landing's design.
  Pick RN if the team is JS-first; pick Flutter if hiring RU mobile devs.

### Backend — **NestJS (Node/TypeScript) + PostgreSQL**, hosted in **Russia**
- **Host in Russia (Yandex Cloud / VK Cloud / Selectel).** Federal Law **152-ФЗ**
  requires personal data of Russian citizens (names, phones, addresses) to be
  stored on servers physically in Russia. We collect exactly that — so a
  US/EU-hosted BaaS (Supabase cloud, Firebase) is a legal risk from day one.
- Managed PostgreSQL + S3-compatible **object storage** (Yandex Object Storage) for
  listing photos.
- Simple REST API. This can be a hand-written NestJS API, or self-hosted
  **Supabase/Directus** on Yandex Cloud if we want auth+DB+storage+API out of the
  box while keeping data in-country.

### Platform services (all RU-appropriate)
- **Auth:** phone number + SMS OTP via a Russian SMS aggregator (SMS.ru / SMSC.ru).
- **Maps:** **Yandex Maps SDK** (не Google Maps) — better RU coverage, expected UX.
- **Push notifications:** APNs on iOS; on Android, Google FCM is unreliable in RU —
  use **RuStore Push SDK**. For MVP, lean on **SMS + in-app** and treat push as a
  fast-follow.
- **Distribution:** iOS → App Store. Android → **RuStore** (VK's store, now the
  default in Russia) **+** Google Play if available. Budget extra time for RuStore
  review and its SDK requirements.

> If speed-to-first-demo matters more than compliance for an internal prototype, we
> *could* start on a managed BaaS and migrate before public launch — but given we
> collect personal data of RU citizens, I recommend hosting in Russia from the
> start to avoid a rebuild.

---

## 6. Milestones

- **M0 — Foundations:** repo, backend skeleton on Yandex Cloud, DB schema, phone
  OTP auth, app shell + navigation.
- **M1 — Owner side:** create/edit/publish a listing with photo upload + map pin;
  "My listings."
- **M2 — Renter side:** search (list + map), filters, listing detail, m² calculator.
- **M3 — The match:** Request → notify owner → Accept/Decline → contact reveal;
  "My requests."
- **M4 — Polish & ship:** profile/settings, account deletion, empty/error states,
  store assets, submit to App Store + RuStore.

Messaging thread is a **stretch** slotted after M3 if time allows; contact reveal
is the baseline.

---

## 7. Open questions

1. **iOS distribution** — do you have (or can you get) an Apple Developer account
   usable from Russia? This affects the iOS timeline more than the code.
2. **Team/skills** — JS/React team (→ React Native) or hiring RU mobile devs
   (→ Flutter is easier to staff here)?
3. **Geographic launch** — single city first (e.g. Москва) to concentrate supply &
   demand, or nationwide?
4. **Messaging** — is contact-reveal enough for v1, or is in-app chat a must-have?
5. **Legal entity** — is there a registered company yet? Needed for RuStore/App
   Store publishing and for 152-ФЗ data-operator registration.
```
