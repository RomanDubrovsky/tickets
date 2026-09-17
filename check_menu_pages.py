import urllib.request
import re

pages = ['schedule', 'routes', 'rent', 'menu', 'marshrutes', 'oferta', 'pr']
for p in pages:
    url = f'https://rockhitneva.ru/{p}/'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        tl = 'TLConf' in html
        tc = 'tlFrameContainer' in html
        title_m = re.search(r'<title>(.*?)</title>', html)
        title = title_m.group(1) if title_m else ''
        print(f'{url:<35} | TL: {tl} | Container: {tc} | Title: {title}')
    except Exception as e:
        print(f'{url:<35} | Error: {e}')