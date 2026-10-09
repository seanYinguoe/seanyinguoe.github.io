"""Build the public academic site using only the selected content and assets."""
from hashlib import sha256
from html import escape
from pathlib import Path
from urllib.parse import urlsplit
import os
import re
import shutil

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'dist'
SITE_URL = os.environ.get('SITE_URL', 'https://xiaoyuanying.me').rstrip('/')
parsed = urlsplit(SITE_URL)
if parsed.scheme != 'https' or not parsed.netloc or parsed.path or parsed.query or parsed.fragment:
    raise ValueError('SITE_URL must be an HTTPS origin without a path, query or fragment.')
PRIMARY_PAGES = [
    ('home', '/', 'Home', 'Xiaoyuan (Sean) Ying — Architected Structures & Metamaterials'),
    ('research', '/research/', 'Research', 'Research — Xiaoyuan (Sean) Ying'),
    ('publications', '/publications/', 'Publications', 'Publications — Xiaoyuan (Sean) Ying'),
    ('academic', '/academic/', 'Academic', 'Academic Background — Xiaoyuan (Sean) Ying'),
]
PAGES = PRIMARY_PAGES + [
    ('bistable-note', '/research/bistable-kirigami/', 'Illustrated note', 'Bistable shape-morphing kirigami — Illustrated note — Xiaoyuan Ying'),
]
DESCRIPTIONS = {
    'bistable-note': 'An illustrated guide to ligament-based bistability, finite-cell anisotropy and the inverse design of curved kirigami structures, with animations from the research.',
    'home': 'Xiaoyuan (Sean) Ying, PhD student at the University of Edinburgh. Research in architected structures, kirigami, metamaterials and inverse design, extending to soft electronics and metasurfaces.',
    'research': 'Research in geometry, inverse design and elastic instability, with engineering applications in flexible sensors, soft electronics and metasurfaces.',
    'publications': 'Journal articles and manuscripts under review by Xiaoyuan Ying on shape-morphing kirigami and adaptive structures.',
    'academic': 'Education, conference presentations, teaching, software, fabrication, experimental methods, languages and summer schools of Xiaoyuan Ying.',
}

# Rebuild from the public asset directory. Drafts and other projects never enter dist.
if OUT.exists():
    shutil.rmtree(OUT)
shutil.copytree(ROOT / 'static', OUT)
STYLE_VERSION = sha256((OUT / 'style.css').read_bytes()).hexdigest()[:12]
# Each entry in this hand-maintained file starts at the beginning of a line.
BIBTEX = {
    entry.group(1): entry.group(0).strip()
    for entry in re.finditer(r'(?ms)^@\w+\{([^,\s]+),.*?(?=^@\w+\{|\Z)', (OUT / 'publications.bib').read_text())
}


def render_citation(match):
    key = match.group(1)
    citation = escape(BIBTEX[key])
    return f'''<details class="bibtex" id="citation-{escape(key, quote=True)}">
<summary>BibTeX</summary>
<div class="bibtex-panel">
<div class="bibtex-toolbar"><span>BibTeX citation</span><button class="copy-bibtex" type="button" hidden>Copy</button><span class="bibtex-status" role="status"></span></div>
<pre tabindex="0" aria-label="BibTeX citation"><code>{citation}</code></pre>
</div>
</details>'''


def render_page(key, route, title, description, body, *, index=True):
    nav_key = 'research' if key == 'bistable-note' else key
    extra_head = ''
    if key == 'bistable-note':
        for filename, tag in [('bistable-note.css', '<link rel="stylesheet" href="/{file}?v={version}">'), ('bistable-note.js', '<script type="module" src="/{file}?v={version}"></script>')]:
            version = sha256((OUT / filename).read_bytes()).hexdigest()[:12]
            extra_head += tag.format(file=filename, version=version) + '\n'
    nav = ''.join(
        f'<a href="{url}"' + (' aria-current="page"' if nav_key == slug else '') + f'>{label.lower()}</a>'
        for slug, url, label, _ in PRIMARY_PAGES[1:]
    )
    home_current = ' aria-current="page"' if key == 'home' else ''
    robots = 'index,follow' if index else 'noindex,follow'
    canonical = f'<link rel="canonical" href="{escape(SITE_URL + route, quote=True)}">' if index else ''
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}">
<meta name="robots" content="{robots}"><meta name="theme-color" content="#fdfdfd">
{canonical}
<link rel="icon" type="image/svg+xml" href="/assets/dot.svg"><link rel="stylesheet" href="/style.css?v={STYLE_VERSION}">
<script src="/site.js" type="module"></script>
{extra_head}
</head>
<body class="page-{key}">
<a class="skip-link" href="#main">Skip to content</a>
<div class="site-shell">
<header class="site-header"><a class="identity" href="/" aria-label="Xiaoyuan (Sean) Ying — home"{home_current}><span>Xiaoyuan (Sean) Ying</span></a><nav class="primary-nav" aria-label="Main navigation">{nav}</nav></header>
<main id="main">{body}</main>
<footer class="site-footer"><div class="footer-links"><a href="mailto:Xiaoyuan.Ying@ed.ac.uk">email</a><a href="https://github.com/seanYinguoe">github</a><a href="/academic/">academic background</a></div><p>© 2026 Xiaoyuan (Sean) Ying</p></footer>
</div>
</body>
</html>
'''


for key, route, _, title in PAGES:
    body = (ROOT / 'content' / f'{key}.html').read_text()
    body = re.sub(r'\{\{BIBTEX:([^}]+)\}\}', render_citation, body)
    for kind, action in [('kirigami', 'Rotate the kirigami tiles'), ('kresling', 'Compress the Kresling fold')]:
        svg = (OUT / 'assets' / f'{kind}.svg').read_text()
        button = f'<button class="structure-icon" type="button" data-structure="{kind}" aria-label="{action}" title="{action}" disabled>{svg}</button>'
        body = body.replace('{{' + kind.upper() + '_ICON}}', button)
    directory = OUT / route.strip('/')
    directory.mkdir(parents=True, exist_ok=True)
    (directory / 'index.html').write_text(render_page(key, route, title, DESCRIPTIONS[key], body))

(OUT / '404.html').write_text(render_page(
    'not-found', '/404.html', 'Page not found — Xiaoyuan (Sean) Ying', 'This page could not be found.',
    '<header class="page-heading"><h1>Page not found</h1><p>The page may have moved. <a href="/">Return to the homepage</a>.</p></header>',
    index=False,
))
(OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n')
urls = ''.join(f'  <url><loc>{escape(SITE_URL + route)}</loc></url>\n' for _, route, _, _ in PAGES)
(OUT / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
(OUT / '.nojekyll').touch()
print(f'Built {len(PAGES)} public pages for {SITE_URL}.')
