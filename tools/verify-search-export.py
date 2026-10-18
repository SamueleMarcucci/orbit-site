"""Check the actual static export, its sitemap, and crawlable navigation graph."""
from collections import deque
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1] / 'out'
HOST = 'https://www.liveorbitapp.com'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.hrefs = []
        self.assets = []
        self.meta = {}
        self.canonical = None
        self.h1s = 0
        self.main = 0
        self.heading = None
        self.heading_levels = []
        self.title = ''
        self.ids = []
        self.schema = []
        self.script = None
        self.script_text = ''
        self.in_title = False
        self.text = []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.append(a['id'])
        if tag == 'a' and a.get('href'):
            self.hrefs.append(a['href'])
        if tag == 'meta':
            self.meta[a.get('name', a.get('property', ''))] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
        if tag == 'main':
            self.main += 1
        if re.fullmatch('h[1-6]', tag):
            level = int(tag[1])
            self.h1s += level == 1
            self.heading_levels.append(level)
        if tag == 'title':
            self.in_title = True
        if tag == 'script':
            self.script = a.get('type', 'script')
            self.script_text = ''
        if tag == 'img' and a.get('src'):
            self.assets.append(a['src'])
            require('alt' in a, f'{self.canonical}: image missing alt')
        for attr in ('srcset',):
            if a.get(attr):
                self.assets += [item.strip().split()[0] for item in a[attr].split(',')]
        if tag == 'script' and a.get('src'):
            self.assets.append(a['src'])
    def handle_data(self, value):
        if self.script:
            self.script_text += value
        elif self.in_title:
            self.title += value
        else:
            self.text.append(value)
    def handle_endtag(self, tag):
        if tag == 'script':
            if self.script == 'application/ld+json':
                try:
                    self.schema.extend(json.loads(self.script_text).get('@graph', []))
                except (ValueError, AttributeError) as error:
                    errors.append(f'{self.canonical}: invalid JSON-LD {error}')
            self.script = None
        if tag == 'title':
            self.in_title = False

pages = {}
for file in ROOT.rglob('index.html'):
    route = '/' + str(file.parent.relative_to(ROOT)).strip('.')
    route = route.rstrip('/') + '/' if route != '/' else '/'
    pages[route] = Page(file)

xml = ET.parse(ROOT / 'sitemap.xml')
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
entries = xml.findall('s:url', ns)
sitemap = [entry.findtext('s:loc', namespaces=ns) for entry in entries]
require(len(sitemap) == len(set(sitemap)), 'Duplicate sitemap URLs')
indexable = {route for route, page in pages.items() if 'noindex' not in page.meta.get('robots', '') and route not in ('/_not-found/', '/404/')}
require(set(sitemap) == {HOST + route for route in indexable}, 'Sitemap must match every indexable HTML route exactly')
require(len([route for route in indexable if route.startswith('/guides/') and route != '/guides/']) == 11, 'Expected eleven substantive guides')
require('/credits/' in indexable, 'Data attribution route omitted')
require('/tools/satellite-visibility/' in indexable, 'Satellite visibility learning tool omitted')

for route, page in pages.items():
    if route in ('/_not-found/', '/404/'):
        continue
    require(page.h1s == 1, f'{route}: expected one H1, found {page.h1s}')
    require(page.main == 1, f'{route}: expected one main landmark')
    require(page.canonical == HOST + route, f'{route}: incorrect canonical {page.canonical}')
    require(bool(page.meta.get('description')), f'{route}: missing description')
    require(len(page.ids) == len(set(page.ids)), f'{route}: duplicate HTML IDs')
    require(all(b <= a + 1 for a, b in zip(page.heading_levels, page.heading_levels[1:])), f'{route}: skipped heading level')
    for asset in page.assets:
        parsed = urlparse(asset)
        if parsed.netloc and parsed.netloc != 'www.liveorbitapp.com':
            continue
        require((ROOT / unquote(parsed.path).lstrip('/')).is_file(), f'{route}: missing asset {asset}')
    for href in page.hrefs:
        parsed = urlparse(href)
        if parsed.netloc and parsed.netloc != 'www.liveorbitapp.com' or parsed.scheme in ('mailto', 'tel'):
            continue
        target = parsed.path or route
        file = ROOT / unquote(target).lstrip('/')
        require(target in pages or file.is_file(), f'{route}: broken internal link {href}')
        if parsed.fragment and target in pages:
            require(unquote(parsed.fragment) in pages[target].ids, f'{route}: missing anchor {href}')
    if route in indexable:
        require('noindex' not in page.meta.get('robots', ''), f'{route}: unintentional noindex')
        require(page.meta.get('og:url') == HOST + route, f'{route}: incorrect OG URL')
    for node in page.schema:
        for field in ('datePublished', 'dateModified'):
            if field in node:
                require(date.fromisoformat(node[field]) <= date.today(), f'{route}: future {field}')
        require('aggregateRating' not in node and 'review' not in node, f'{route}: unsupported review markup')
        if node.get('@type') == 'Article':
            require(node.get('url') == HOST + route and node.get('mainEntityOfPage') == HOST + route, f'{route}: article identity mismatch')
            for citation in node.get('citation', []):
                require(citation in page.hrefs, f'{route}: citation not visible')
    if route.startswith('/guides/') and route != '/guides/':
        article = next((node for node in page.schema if node.get('@type') == 'Article'), {})
        require(bool(article), f'{route}: missing Article')
        require('Reviewed' in ''.join(page.text), f'{route}: review date not visible')
        lastmod = next(entry.findtext('s:lastmod', namespaces=ns) for entry in entries if entry.findtext('s:loc', namespaces=ns) == HOST + route)
        require(article.get('dateModified') == lastmod, f'{route}: sitemap and article dates disagree')
        if route not in ['/guides/satellite-tracking-iphone/', '/guides/how-to-see-iss/', '/guides/visible-satellite-passes/']:
            require(article.get('datePublished') == '2026-10-12', f'{route}: publication date must match the approved release date')

for field in ('title', 'description'):
    values = [page.title if field == 'title' else page.meta.get('description') for route, page in pages.items() if route in indexable]
    require(len(values) == len(set(values)), f'Duplicate {field} across indexable pages')
for route in ('/testing/', '/testing/thanks/', '/support/thanks/'):
    require('noindex' in pages[route].meta.get('robots', ''), f'{route}: must remain noindex')
software = next(node for node in pages['/'].schema if node.get('@type') == 'SoftwareApplication')
require(software['operatingSystem'] == ['iOS', 'iPadOS'], 'Wrong platform facts in software schema')
require(software['offers']['price'] == '0', 'Download price mismatch')
faq = next(node for node in pages['/'].schema if node.get('@type') == 'FAQPage')
visible_home = ' '.join(' '.join(pages['/'].text).split())
for entry in faq['mainEntity']:
    require(entry['name'] in visible_home and entry['acceptedAnswer']['text'] in visible_home, 'FAQ schema differs from visible content')

# Prove discovery from the homepage using exported anchor links, without JavaScript.
depths = {'/': 0}
queue = deque(['/'])
while queue:
    route = queue.popleft()
    for href in pages[route].hrefs:
        parsed = urlparse(href)
        if parsed.netloc and parsed.netloc != 'www.liveorbitapp.com':
            continue
        target = parsed.path or route
        if target in pages and target not in depths:
            depths[target] = depths[route] + 1
            queue.append(target)
for route in indexable:
    require(route in depths and depths[route] <= 2, f'{route}: not discoverable within two links from home')

llms = (ROOT / 'llms.txt').read_text()
require('iOS and iPadOS' in llms, 'Machine-readable navigation has stale platform wording')
for href in re.findall(r'https://www\.liveorbitapp\.com/[^)\s]*', llms):
    require(urlparse(href).path in pages, f'llms.txt: broken route {href}')

tool = pages['/tools/satellite-visibility/']
tool_text = ' '.join(' '.join(tool.text).split())
for explanation in ('Above your horizon', 'Satellite in sunlight', 'Dark observer sky', 'not a pass prediction', 'not a guarantee'):
    require(explanation in tool_text, f'Visibility lab missing readable explanation: {explanation}')
require('/guides/satellite-observing-checklist/' in tool.hrefs, 'Visibility lab must link to the printable observation worksheet')

if errors:
    for error in errors:
        print('FAIL:', error)
    raise SystemExit(1)
print(json.dumps({'passed': True, 'indexable_pages': len(indexable), 'guides': 11, 'maximum_link_depth': max(depths[route] for route in indexable), 'schema': 'parsed and matched to visible facts', 'no_javascript_discovery': True, 'external_submissions': False}, indent=2))
