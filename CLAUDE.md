# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Qaraj — marketing landing page for an Airbnb-style marketplace for unused storage space (garages, basements, spare rooms, warehouse corners, parking, lock-ups). Users can rent by the square meter, by item type (the page suggests needed m²), or rent a full space, monthly or yearly.

**The site is localized for the Russian market.** All visible copy, meta tags, JSON-LD, `llms.txt` and `ai.txt` are in Russian (`<html lang="ru">`); the brand name stays "Qaraj" (Latin). Prices are in ₽ (rubles) throughout — including the calculator's `pricePerSqm` constant — and example cities/names are Russian (Москва, Санкт-Петербург, Казань). Keep new copy in Russian and prices in ₽. See [neighbor-ru-seo-geo-todo.md](neighbor-ru-seo-geo-todo.md) for the SEO/GEO plan this localization follows (only the front-end items are implemented).

## Architecture

A single self-contained static page: [index.html](index.html). There is no build step, package manager, framework, or test suite — open the file directly in a browser to view it.

Everything lives in `index.html`:
- **CSS** is a single `<style>` block in `<head>`. The design system is driven by CSS custom properties on `:root` (`--brand`, `--brand-2`, `--brand-deep`, `--accent`, `--bg-*`, spacing/radius/shadow tokens). The current theme is green. Change brand colors and shared styling there rather than in individual rules — but note a rebrand also requires updating hardcoded `rgba(...)` glow/shadow values scattered in rules (button shadows, `.logo-mark`, `.opt.active`, `.step .num`, the `.hero-bg` gradient overlay), since those mirror `--brand` but aren't tokenized.
- **Layout** is a sequence of `<section>` blocks (hero, three ways to book, categories, featured-spaces marquee, how it works, why choose, owners + calculator, reviews, FAQ, CTA, footer), each anchored by an `id` used for in-page nav links.
- **Responsive** behavior is handled by `@media` breakpoints at the bottom of the style block (~980px and ~560px). On mobile the hero photo layer (`.hero-bg`) is hidden and `.hero-right` gets its own single-image background instead.
- **Interactivity is mostly CSS-only.** Two pieces are pure CSS animation (no JS): the **hero background slideshow** (`.hero-bg` holds stacked `.hero-slide` layers; the `heroFade` keyframes + staggered `animation-delay` per `:nth-child` crossfade through them) and the **featured marquee** (`.marquee-track` auto-scrolls via the `marquee-scroll` keyframes — its slides are duplicated in the HTML and it translates by `-50%`, using per-slide `margin-right` rather than flex `gap` so the loop is seamless). Both respect `prefers-reduced-motion`.
- **Vanilla JS** lives in one `<script>` before `</body>` and now drives *only* the storage-size calculator in the "For owners" section: clicking an `.item-opt` sets the base m² (`data-sqm`), the `#qty` range slider applies a sub-linear multiplier, and it live-updates `#sqmOut` / `#priceOut`. Estimated price is `sqm * pricePerSqm` where `pricePerSqm` is a placeholder constant in that script.
- **Hero phone mockups** are CSS-built (`.phones` > `.phone.left` / `.phone.right`), fanned into a V via `rotate()` + `transform-origin: bottom center`; the screens are fixed-height with `overflow:hidden` (content is intentionally clipped, never stretches the frame). The cluster is positioned with a `translateX` percentage on `.phones`.
- **Icons** are inline SVG. **Fonts** are Sora + Inter loaded from Google Fonts.

## Things to know

- All photography is served from the local `images/` folder (hero slideshow, image-backed category tiles, the "why choose" visual, the phone-mockup listing thumbnails, and the featured marquee). Filenames contain spaces, so references are URL-encoded (`%20`). No remote image dependencies.
- The calculator's `pricePerSqm` and the per-item `data-sqm` values are placeholders; tune them to real pricing.
- All nav, CTA, and footer links are placeholder anchors (`#` or in-page `#section`); there is no backend or routing.
- **SEO/GEO assets:** the `<head>` carries four JSON-LD blocks (`Organization`+`AggregateRating`, `WebSite`, `BreadcrumbList`, `FAQPage`) plus Open Graph/Twitter meta. Root files `llms.txt`, `ai.txt`, `robots.txt`, `sitemap.xml` support AI/search crawlers. The `FAQPage` JSON-LD must stay word-for-word in sync with the visible FAQ section — edit both together.
- Canonical/OG/schema/sitemap/robots all use the placeholder domain `https://qubiq.example/` — replace with the real domain before launch.
