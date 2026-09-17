import urllib.request
import re

req = urllib.request.Request('https://rockhitneva.ru/routes/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    print('Title:', re.search(r'<title>(.*?)</title>', html))
    print('TLConf:', re.search(r'var\s+TLConf\s*=\s*\{[^}]+\};', html))
    print('Container:', re.search(r'<div id=[\"\']tlFrameContainer[\"\'][^>]*>', html))
except Exception as e:
    print('Error:', e)