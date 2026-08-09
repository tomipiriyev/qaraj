# -*- coding: utf-8 -*-
"""Общая обвязка страниц Qaraj: шапка, футер, JSON-LD, FAQ.

Единственный источник шапки и футера для генераторов:
  * tools/gen_pages.py — шесть SEO-лендингов в корне
  * tools/gen_blog.py  — статьи блога в /blog/

index.html собирается вручную; его футер нужно править вместе с FOOTER здесь.
"""
import json

from blog_posts import POSTS, CLUSTERS

SITE = "https://qaraj.ru"

LOGO_SVG = ('<svg viewBox="0 0 24 24" fill="none">'
  '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>'
  '<path d="M3 7l9 5 9-5M12 12v10" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>')

AMENITIES = ('<div class="amenities"><span>Климат-контроль</span><span>Видеонаблюдение</span>'
             '<span>Доступ 24/7</span><span>Датчик дыма</span><span>Электричество</span></div>')

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E"
           "%3Crect width='24' height='24' rx='5' fill='%231f9d55'/%3E"
           "%3Cpath d='M12 4 5 8v8l7 4 7-4V8l-7-4Z' fill='none' stroke='white' stroke-width='1.4' stroke-linejoin='round'/%3E"
           "%3Cpath d='M5 8l7 4 7-4M12 12v8' fill='none' stroke='white' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E")

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com" />\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
         '<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&'
         'family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />')

HEADER = f'''<header>
  <div class="wrap nav">
    <a href="/" class="brand"><span class="logo-mark">{LOGO_SVG}</span><span>Qar<b>aj</b></span></a>
    <nav class="nav-links">
      <a href="/arenda-garazha-moskva/">Гаражи</a>
      <a href="/arenda-kladovki-moskva/">Кладовки</a>
      <a href="/hranenie-veshchey-moskva/">Хранение вещей</a>
      <a href="/sdat-garazh-v-arendu/">Сдать место</a>
      <a href="/blog/">Блог</a>
    </nav>
    <a class="nav-cta" href="/#waitlist">Оставить заявку</a>
  </div>
</header>'''


def blog_tag_groups():
    """Ссылки на все статьи блога, сгруппированные по кластерам — для футера."""
    out = []
    for key, label in CLUSTERS.items():
        posts = [p for p in POSTS if p["cluster"] == key]
        if not posts:
            continue
        links = "".join(
            f'<a href="/blog/{p["slug"]}/">{p["title"]}</a>' for p in posts)
        out.append(f'        <div class="tag-group"><span class="tag-label">{label}</span>'
                   f'<div class="tag-links">{links}</div></div>')
    return "\n".join(out)


FOOTER = f'''<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="brand"><span class="logo-mark">{LOGO_SVG}</span><span>Qar<b>aj</b></span></div>
        <p class="foot-about">Маркетплейс свободного места для хранения. Аренда гаражей, кладовок, комнат и углов на складах — по м², по типу вещей или целиком.</p>
        <div class="socials">
          <a href="#" aria-label="Telegram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.5-7.7c.4-.3-.1-.5-.6-.2L7.2 13 2.7 11.6c-1-.3-1-1 .2-1.5l17.7-6.8c.8-.3 1.5.2 1.3 1Z"/></svg></a>
          <a href="#" aria-label="VK"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.8 17c-5 0-8.2-3.5-8.3-9.3h2.6c.1 4.3 2.1 6.1 3.6 6.5V7.7h2.5v3.8c1.4-.2 2.9-1.9 3.4-3.8h2.4c-.4 2.3-1.9 4-3 4.7 1.1.6 2.8 2.1 3.5 4.6h-2.7c-.5-1.7-1.8-3-3.6-3.2V17h-.4Z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a>
        </div>
      </div>
      <div class="foot-col">
        <h5>Арендаторам</h5>
        <a href="/arenda-garazha-moskva/">Аренда гаража в Москве</a>
        <a href="/arenda-kladovki-moskva/">Аренда кладовки в Москве</a>
        <a href="/hranenie-veshchey-moskva/">Хранение вещей в Москве</a>
        <a href="/skolko-stoit-arenda-garazha/">Сколько стоит аренда гаража</a>
      </div>
      <div class="foot-col">
        <h5>Хозяевам</h5>
        <a href="/sdat-garazh-v-arendu/">Сдать гараж в аренду</a>
        <a href="/skolko-stoit-arenda-garazha/">Сколько можно заработать</a>
        <a href="/dogovor-arendy-garazha/">Договор аренды гаража</a>
        <a href="/#owners">Калькулятор размера</a>
      </div>
      <div class="foot-col">
        <h5>Компания</h5>
        <a href="/">О Qaraj</a>
        <a href="/blog/">Блог</a>
        <a href="/#how">Как это работает</a>
        <a href="/#faq">Вопросы и ответы</a>
      </div>
    </div>
    <div class="foot-tags">
      <h5>Блог</h5>
{blog_tag_groups()}
    </div>
    <div class="foot-tags">
      <h5>Смотрите также</h5>
      <div class="tag-links">
        <a href="/arenda-garazha-moskva/">Аренда гаража в Москве</a>
        <a href="/arenda-kladovki-moskva/">Аренда кладовки в Москве</a>
        <a href="/hranenie-veshchey-moskva/">Хранение вещей в Москве</a>
        <a href="/sdat-garazh-v-arendu/">Сдать гараж в аренду</a>
        <a href="/dogovor-arendy-garazha/">Договор аренды гаража — образец</a>
        <a href="/skolko-stoit-arenda-garazha/">Сколько стоит аренда гаража</a>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Qaraj. Все права защищены.</span>
      <span>Конфиденциальность · Условия · Cookies</span>
    </div>
  </div>
</footer>'''


def faq_jsonld(items):
    return json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]
    }, ensure_ascii=False, indent=2)


def crumbs_jsonld(*trail):
    """trail — пары (название, url). Первым элементом всегда идёт «Главная»."""
    items = [{"@type": "ListItem", "position": 1, "name": "Главная", "item": f"{SITE}/"}]
    for i, (name, url) in enumerate(trail, start=2):
        items.append({"@type": "ListItem", "position": i, "name": name, "item": url})
    return json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList",
                       "itemListElement": items}, ensure_ascii=False, indent=2)


def faq_html(items):
    rows = []
    for q, a in items:
        rows.append(f'      <details>\n'
                    f'        <summary>{q}<span class="plus">+</span></summary>\n'
                    f'        <div class="ans">{a}</div>\n'
                    f'      </details>')
    return "\n".join(rows)
