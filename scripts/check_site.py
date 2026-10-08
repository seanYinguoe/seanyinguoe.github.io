"""Check the public output, local links and page visibility before deployment."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'dist'
PAGES = {'index.html', 'research/index.html', 'publications/index.html', 'academic/index.html', '404.html'}
assert {str(p.relative_to(OUT)) for p in OUT.rglob('*.html')} == PAGES
assert {p.name for p in (ROOT / 'content').iterdir()} == {'home.html', 'research.html', 'publications.html', 'academic.html'}
assert not any(p.is_symlink() for p in OUT.rglob('*')), 'Unexpected symlink in public output.'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids, self.meta = [], set(), {}
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        for key in ('src', 'href'):
            if key in a:
                self.links.append(a[key])
        if tag == 'meta' and 'name' in a:
            self.meta[a['name']] = a.get('content', '')


parsed = {name: Page((OUT / name).read_text()) for name in PAGES}
for name, page in parsed.items():
    for url in page.links:
        ref = urlsplit(url)
        if ref.scheme or ref.netloc:
            continue
        dest = OUT / unquote(ref.path).lstrip('/') if ref.path.startswith('/') else OUT / name
        if ref.path and not ref.path.startswith('/'):
            dest = (OUT / name).parent / unquote(ref.path)
        if dest.is_dir():
            dest = dest / 'index.html'
        assert dest.is_file(), f'{name}: missing local resource {url}'
        if ref.fragment and dest.suffix == '.html':
            target = parsed[str(dest.relative_to(OUT))]
            assert unquote(ref.fragment) in target.ids, f'{name}: missing anchor {url}'
    expected = 'noindex,follow' if name == '404.html' else 'index,follow'
    assert page.meta.get('robots') == expected, f'{name}: incorrect indexing setting'
    text = (OUT / name).read_text()
    assert '{{' not in text, f'{name}: unrendered template'
    assert not re.search(r'chatgpt\.site|/jobs(?:/|\b)|/notes(?:/|\b)|/Users/|appgprj_', text), f'{name}: private or obsolete reference'

for p in OUT.glob('*.js'):
    for ref in re.findall(r"from\s+['\"](\.[^'\"]+)['\"]", p.read_text()):
        assert (p.parent / ref).is_file(), f'Missing JavaScript module: {ref}'
for ref in re.findall(r"url\(['\"]?([^'\")]+)", (OUT / 'style.css').read_text()):
    assert (OUT / ref.lstrip('/')).is_file(), f'Missing CSS asset: {ref}'
sitemap = ET.parse(OUT / 'sitemap.xml')
assert len(sitemap.getroot()) == 4
print('Public pages, local assets, navigation anchors, indexing and publication boundaries passed.')
