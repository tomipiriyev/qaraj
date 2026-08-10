# -*- coding: utf-8 -*-
"""Генерирует статьи Qaraj — по одной самостоятельной странице на статью.

Каждая статья лежит в корне сайта: /<slug>/index.html, рядом с шестью
SEO-лендингами. Общей страницы-индекса («блога») нет: статьи связаны между
собой блоком «Читайте также» и ссылками в футере.

Запуск из корня репозитория:  python3 tools/gen_blog.py
Контент лежит в tools/blog_posts.py, шапка и футер — в tools/chrome.py.
Править нужно их, а не готовый .html: следующая генерация перезапишет правки.
"""
import os, sys, json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from blog_posts import POSTS, CLUSTERS
from chrome import (SITE, HEADER, FOOTER, AMENITIES, FAVICON, FONTS,
                    faq_jsonld, crumbs_jsonld, faq_html)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLISHED = "2026-08-09"      # дата публикации в JSON-LD, править при переработке


# ------------------------------------------------------------------ рендер тела
def render_blocks(blocks):
    """Собирает секцию. Абзацы и списки идут внутри .prose, таблицы и плашки — вне."""
    out, prose = [], []

    def flush():
        if prose:
            out.append('    <div class="prose">\n' + "\n".join(prose) + "\n    </div>")
            prose.clear()

    for block in blocks:
        kind = block[0]
        if kind == "p":
            prose.append(f"      <p>{block[1]}</p>")
        elif kind == "h3":
            prose.append(f"      <h3>{block[1]}</h3>")
        elif kind in ("ul", "ol"):
            items = "\n".join(f"        <li>{i}</li>" for i in block[1])
            prose.append(f"      <{kind}>\n{items}\n      </{kind}>")
        elif kind == "table":
            flush()
            _, cols, rows, note = block
            head = "".join(f"<th>{c}</th>" for c in cols)
            body = "\n".join(
                "          <tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
            out.append('    <div class="table-scroll">\n      <table>\n'
                       f'        <thead><tr>{head}</tr></thead>\n'
                       f'        <tbody>\n{body}\n        </tbody>\n'
                       '      </table>\n    </div>')
            if note:
                out.append(f'    <p class="table-note">{note}</p>')
        elif kind == "amenities":
            flush()
            out.append(f"    {AMENITIES}")
        else:
            raise ValueError(f"неизвестный тип блока: {kind}")
    flush()
    return "\n".join(out)


def render_sections(sections):
    parts = []
    for s in sections:
        parts.append(f'  <section>\n    <h2>{s["h2"]}</h2>\n'
                     f'{render_blocks(s["blocks"])}\n  </section>')
    return "\n\n".join(parts)


def article_jsonld(post, url):
    return json.dumps({
        "@context": "https://schema.org", "@type": "Article",
        "headline": f'{post["title"]}: {post["subtitle"]}',
        "description": post["desc"],
        "url": url, "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": PUBLISHED, "dateModified": PUBLISHED,
        "inLanguage": "ru-RU",
        "author": {"@type": "Organization", "name": "Qaraj", "url": f"{SITE}/"},
        "publisher": {"@type": "Organization", "name": "Qaraj", "url": f"{SITE}/",
                      "logo": {"@type": "ImageObject",
                               "url": f"{SITE}/images/photo_2026-06-23%2022.11.58.jpeg"}},
        "image": f"{SITE}/images/photo_2026-06-23%2022.11.58.jpeg",
        "articleSection": CLUSTERS[post["cluster"]],
    }, ensure_ascii=False, indent=2)


def build_post(post):
    slug, url = post["slug"], f'{SITE}/{post["slug"]}/'
    title = f'{post["title"]}: {post["subtitle"]} | Qaraj'

    ld_blocks = "\n".join(f'<script type="application/ld+json">\n{b}\n</script>' for b in [
        crumbs_jsonld((post["title"], url)),
        faq_jsonld(post["faq"]),
        article_jsonld(post, url),
    ])

    related = "".join(f'<a href="{href}">{label}</a>' for href, label in post["related"])

    page = f'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{post["desc"]}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="theme-color" content="#1f9d55" />
<link rel="canonical" href="{url}" />
<link rel="icon" href="{FAVICON}" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="Qaraj" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{post["desc"]}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{SITE}/images/photo_2026-06-23%2022.11.58.jpeg" />
<meta property="og:locale" content="ru_RU" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{post["desc"]}" />

{FONTS}
<link rel="stylesheet" href="/styles/page.css" />

{ld_blocks}
</head>
<body>
{HEADER}

<div class="wrap">
  <nav class="crumbs"><a href="/">Главная</a> · <span>{post["title"]}</span></nav>
</div>

<div class="page-hero">
  <div class="wrap">
    <p class="post-kicker">{CLUSTERS[post["cluster"]]}</p>
    <h1>{post["title"]}: {post["subtitle"]}</h1>
    <p class="lede">{post["lede"]}</p>
    <a class="hero-cta" href="/#waitlist">Оставить заявку</a>
    <p class="hero-note">Qaraj в раннем доступе — оставьте почту, и мы напишем, когда в вашем районе появятся места.</p>
  </div>
</div>

<main class="wrap">
{render_sections(post["sections"])}

  <section>
    <h2>Частые вопросы</h2>
    <div class="faq">
{faq_html(post["faq"])}
    </div>
  </section>

  <section>
    <h2>Читайте также</h2>
    <div class="related">{related}</div>
  </section>

  <section>
    <div class="cta-band">
      <h2>Ищете место рядом с домом?</h2>
      <p>Qaraj собирает свободные гаражи, кладовки и складские метры у частных хозяев. Оставьте заявку — подберём вариант в вашем районе.</p>
      <a href="/#waitlist">Оставить заявку</a>
    </div>
  </section>
</main>

{FOOTER}
</body>
</html>
'''
    d = os.path.join(ROOT, slug)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    return len(page)


def write_sitemap():
    """Перезаписывает блок между маркерами blog:start / blog:end в sitemap.xml."""
    path = os.path.join(ROOT, "sitemap.xml")
    with open(path, encoding="utf-8") as f:
        xml = f.read()

    start = "  <!-- blog:start — генерируется tools/gen_blog.py, вручную не править -->"
    end = "  <!-- blog:end -->"
    if start not in xml or end not in xml:
        print("  ! маркеры blog:start/blog:end не найдены в sitemap.xml — пропускаю")
        return 0

    entries = [f"""  <url>
    <loc>{SITE}/{p["slug"]}/</loc>
    <lastmod>{PUBLISHED}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>""" for p in POSTS]

    head = xml[:xml.index(start) + len(start)]
    tail = xml[xml.index(end):]
    with open(path, "w", encoding="utf-8") as f:
        f.write(head + "\n" + "\n".join(entries) + "\n" + tail)
    return len(entries)


if __name__ == "__main__":
    print("Генерация статей:")
    total = 0
    for post in POSTS:
        size = build_post(post)
        total += size
        print(f'  wrote /{post["slug"]}/index.html  ({size:,} bytes)')
    n = write_sitemap()
    print(f"  обновлён sitemap.xml ({n} URL статей)")
    print(f"\nГотово: {len(POSTS)} статей, {total:,} bytes.")
