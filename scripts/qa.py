# QA over de gebouwde site: links, titels, meta, h1, canonical, alt-teksten, JSON-LD.
import os, re, json, sys, collections, html
D = sys.argv[1] if len(sys.argv) > 1 else 'dist'
pages = {}
for root, _, files in os.walk(D):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            url = '/' + os.path.relpath(p, D).replace('index.html', '').replace('\\', '/')
            pages[url] = open(p, encoding='utf-8').read()
static = set()
for root, _, files in os.walk(D):
    for f in files:
        static.add('/' + os.path.relpath(os.path.join(root, f), D))
problems = collections.defaultdict(list)
titles = collections.defaultdict(list); descs = collections.defaultdict(list)
for url, s in pages.items():
    t = re.search(r'<title>(.*?)</title>', s); t = html.unescape(t.group(1)) if t else ''
    d = re.search(r'<meta name="description" content="([^"]*)"', s); d = html.unescape(d.group(1)) if d else ''
    noindex = 'noindex' in s
    if not noindex:
        titles[t].append(url); descs[d].append(url)
        if not (25 <= len(t) <= 70): problems['title-length'].append(f'{url} ({len(t)}) {t}')
        if not (70 <= len(d) <= 165): problems['desc-length'].append(f'{url} ({len(d)})')
    h1 = re.findall(r'<h1[\s>]', s)
    if len(h1) != 1: problems['h1-count'].append(f'{url}: {len(h1)}')
    c = re.search(r'<link rel="canonical" href="([^"]+)"', s)
    if not c or not c.group(1).startswith('https://sportdietetiek.nl/'): problems['canonical'].append(url)
    for img in re.findall(r'<img\b[^>]*>', s):
        if not re.search(r'\salt[\s=>/]', img): problems['img-no-alt'].append(f'{url}: {img[:80]}')
    for blob in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try: json.loads(blob)
        except Exception as e: problems['jsonld'].append(f'{url}: {e}')
    for h in set(re.findall(r'href="(/[^"#?]*)', s)):
        if h.startswith('//'): continue
        if h in pages or h + 'index.html' in static or h in static or h.rstrip('/') + '/' in pages: continue
        problems['broken-link'].append(f'{url} -> {h}')
    ids = re.findall(r'\sid="([^"]+)"', s)
    dup = [i for i, n in collections.Counter(ids).items() if n > 1]
    if dup: problems['dup-id'].append(f'{url}: {dup[:5]}')
for t, us in titles.items():
    if len(us) > 1: problems['dup-title'].append(f'{t}: {us}')
for d, us in descs.items():
    if len(us) > 1: problems['dup-desc'].append(f'{d[:50]}: {us}')
print(f'{len(pages)} HTML-pagina\'s gecontroleerd')
for k, v in problems.items():
    print(f'\n## {k} ({len(v)})'); [print('  ', x) for x in v[:15]]
if not problems: print('Geen problemen gevonden.')
