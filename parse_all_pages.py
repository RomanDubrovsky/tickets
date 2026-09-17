import re

with open('111111.txt', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Let's find each page chunk and its associated metadata
lines = text.splitlines()
pages_found = []
current_page = None
current_content = []

for line in lines:
    if line.startswith('https://rockhitneva.ru/') or line.startswith('Это афиша на главной https://rockhitneva.ru/'):
        if current_page:
            pages_found.append((current_page, '\n'.join(current_content)))
        current_page = line.strip()
        current_content = []
    else:
        current_content.append(line)

if current_page:
    pages_found.append((current_page, '\n'.join(current_content)))

print(f'Total pages parsed: {len(pages_found)}')

for p_url, p_body in pages_found:
    title_m = re.search(r'<title>([^<]+)</title>', p_body)
    title = title_m.group(1) if title_m else 'No title'
    
    tl_m = re.search(r'var\s+TLConf\s*=\s*\{([^}]+)\};', p_body)
    tl_conf = tl_m.group(0) if tl_m else 'No TLConf'
    
    ds_m = re.search(r'(<div\s+id=[\"\']tlFrameContainer[\"\'][^>]*>)', p_body)
    tl_container = ds_m.group(1) if ds_m else 'No Container'
    
    print('---')
    print('URL:', p_url)
    print('TITLE:', title)
    print('CONTAINER:', tl_container)
