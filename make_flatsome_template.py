import re

def process_template(src_path, dest_path):
    with open(src_path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # 1. Replace title
    text = re.sub(r'<title>.*?</title>', '<title>{{TITLE}}</title>', text)

    # 2. Replace ticketland widget container
    text = re.sub(r'<div id=[\"\']tlFrameContainer[\"\'][^>]*>.*?</div>|<div id=[\"\']tlFrameContainer[\"\'][^>]*>', '{{IFRAME_CODE}}', text)

    # 3. Replace ticketland script block
    text = re.sub(r'<script type=[\"\']text/javascript[\"\']>\s*var TLConf = \{[^}]+\};\s*</script>\s*<script async src=[\"\']https://www\.ticketland\.ru/iframe/loaderJs/[\"\']></script>', '{{TICKET_SCRIPT}}', text)

    # 4. Remove admin bar and wordfence UI noise
    text = re.sub(r'<div id=\"wpadminbar\"[^>]*>.*?</div>\s*</div>', '', text, flags=re.DOTALL)
    text = text.replace('logged-in admin-bar', '')

    # 5. Insert global scripts before </head>
    if '{{GLOBAL_SCRIPTS}}' not in text:
        text = text.replace('</head>', '{{GLOBAL_SCRIPTS}}\n</head>')

    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'Saved {dest_path}')

process_template('original_main_template.html', 'b2b_cms/templates/flatsome.html')
process_template('Сайты Влада/aquasound.club - главнгая.txt', 'b2b_cms/templates/aqua_main.html')
process_template('Сайты Влада/aquasound.club - мероприятеи.txt', 'b2b_cms/templates/aqua_event.html')

print('All flatsome templates saved successfully!')