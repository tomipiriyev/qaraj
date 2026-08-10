# -*- coding: utf-8 -*-
"""Отправляет URL сайта в IndexNow — протокол уведомления поисковиков.

IndexNow поддерживают Яндекс, Bing, Seznam и Naver. Google его НЕ использует:
для Google работают только sitemap.xml и «Запросить индексирование» в Search
Console вручную.

Ключ лежит в корне репозитория файлом <ключ>.txt и должен быть доступен по
https://qaraj.ru/<ключ>.txt — иначе поисковик отклонит заявку.

Запуск из корня репозитория:
    python3 tools/indexnow.py            # все URL из sitemap.xml
    python3 tools/indexnow.py --dry-run  # показать, что будет отправлено
    python3 tools/indexnow.py https://qaraj.ru/sklad-dlya-biznesa/  ...  # только эти URL

Отправлять имеет смысл после публикации новых или изменённых страниц.
Заваливать сервис повторными заявками по неизменившимся URL не нужно.
"""
import glob
import json
import os
import re
import ssl
import sys
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOST = "qaraj.ru"
SITE = f"https://{HOST}"
ENDPOINT = "https://api.indexnow.org/indexnow"   # общая точка входа, раздаёт всем участникам


def find_key():
    """Ключ = имя файла <ключ>.txt в корне, содержимое должно совпадать с именем."""
    for path in glob.glob(os.path.join(ROOT, "*.txt")):
        name = os.path.basename(path)[:-4]
        if not re.fullmatch(r"[A-Za-z0-9-]{8,128}", name):
            continue
        with open(path, encoding="utf-8") as f:
            if f.read().strip() == name:
                return name
    raise SystemExit("не найден файл ключа <ключ>.txt в корне репозитория")


def sitemap_urls():
    with open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8") as f:
        return re.findall(r"<loc>(.*?)</loc>", f.read())


def ssl_context():
    """Питон с python.org на macOS часто ставится без корневых сертификатов.
    В этом случае берём набор из certifi. Проверку сертификата не отключаем."""
    ctx = ssl.create_default_context()
    try:
        ctx.load_verify_locations(cafile=None)
        if ctx.cert_store_stats()["x509_ca"]:
            return ctx
    except Exception:
        pass
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        raise SystemExit(
            "нет корневых сертификатов: запустите «Install Certificates.command» "
            "из /Applications/Python 3.x/ либо установите certifi")


def submit(key, urls):
    payload = json.dumps({
        "host": HOST,
        "key": key,
        "keyLocation": f"{SITE}/{key}.txt",
        "urlList": urls,
    }).encode("utf-8")

    req = urllib.request.Request(
        ENDPOINT, data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=30, context=ssl_context()) as r:
            return r.status, r.read().decode("utf-8", "replace")[:400]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:400]


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry = "--dry-run" in sys.argv

    key = find_key()
    urls = args or sitemap_urls()

    print(f"ключ:   {key}")
    print(f"файл:   {SITE}/{key}.txt")
    print(f"URL:    {len(urls)}")
    for u in urls[:5]:
        print(f"        {u}")
    if len(urls) > 5:
        print(f"        … и ещё {len(urls) - 5}")

    if dry:
        print("\n--dry-run: ничего не отправлено")
        raise SystemExit(0)

    status, body = submit(key, urls)
    print(f"\nответ: HTTP {status}")
    if body.strip():
        print(body)
    # 200 — принято, 202 — принято, ключ проверяется асинхронно
    print("OK — заявка принята" if status in (200, 202) else "заявка НЕ принята")
