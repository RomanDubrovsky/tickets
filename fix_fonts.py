import glob

templates = [
    'b2b_cms/templates/aqua_main.html',
    'b2b_cms/templates/aqua_event.html',
    'b2b_cms/templates/flatsome.html',
    'b2b_cms/templates/flatsome_event.html'
]

for t in templates:
    try:
        with open(t, 'r', encoding='utf-8') as f:
            html = f.read()

        html = html.replace("https://aquasound.club/wp-content/fonts/lato/", "https://fonts.gstatic.com/s/lato/v24/")
        html = html.replace("https://aquasound.club/wp-content/fonts/dancing-script/", "https://fonts.gstatic.com/s/dancingscript/v25/")
        html = html.replace("https://rockhitneva.ru/wp-content/fonts/lato/", "https://fonts.gstatic.com/s/lato/v24/")
        html = html.replace("https://rockhitneva.ru/wp-content/fonts/dancing-script/", "https://fonts.gstatic.com/s/dancingscript/v25/")

        with open(t, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Fonts fixed in {t}')
    except Exception as e:
        print(f'Skip/Error {t}: {e}')