import re
import json

with open('111111.txt', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

lines = text.splitlines()
pages_raw = []
current_url = None
current_chunk = []

for line in lines:
    if line.startswith('https://rockhitneva.ru/') or line.startswith('Это афиша на главной https://rockhitneva.ru/'):
        if current_url:
            pages_raw.append((current_url, '\n'.join(current_chunk)))
        current_url = line.strip()
        current_chunk = []
    else:
        current_chunk.append(line)

if current_url:
    pages_raw.append((current_url, '\n'.join(current_chunk)))

events = []

for u, body in pages_raw:
    clean_u = u.replace('Это афиша на главной ', '').strip()
    slug_m = re.search(r'rockhitneva\.ru/([^/\s\?#]*)', clean_u)
    slug = '/' if not slug_m or not slug_m.group(1) else slug_m.group(1)
    
    title_m = re.search(r'<title>(.*?)&#8212;', body)
    if not title_m:
        title_m = re.search(r'<title>(.*?)</title>', body)
    title = title_m.group(1).strip() if title_m else slug
    
    title = title.replace('&amp;', '&').replace('&#8212;', '—').replace('&quot;', '"').strip()
    
    cnt_m = re.search(r'(<div\s+id=[\"\']tlFrameContainer[\"\'][^>]*>.*?</div>|<div\s+id=[\"\']tlFrameContainer[\"\'][^>]*>)', body, re.DOTALL)
    if cnt_m:
        widget_code = cnt_m.group(1)
        if not widget_code.endswith('</div>'):
            widget_code += '</div>'
    else:
        widget_code = ''
        
    hash_m = re.search(r'accessHash:\s*[\"\']([^\"\']+)[\"\']', body)
    access_hash = hash_m.group(1) if hash_m else ''
    
    events.append({
        'raw_url': clean_u,
        'slug': slug,
        'title': title,
        'widget_code': widget_code,
        'access_hash': access_hash
    })

print(f'Total extracted events: {len(events)}')
for e in events:
    print('Slug: ' + e['slug'] + ' | Hash: ' + e['access_hash'] + ' | Title: ' + e['title'])

with open('extracted_events.json', 'w', encoding='utf-8') as out:
    json.dump(events, out, ensure_ascii=False, indent=2)
