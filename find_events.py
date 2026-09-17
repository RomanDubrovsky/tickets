import re

with open('111111.txt', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Let's inspect where ticketland widgets and pages are in the text
# Split by lines like: 'Это афиша на главной https://rockhitneva.ru/' or 'https://rockhitneva.ru/...'
headers = re.findall(r'(?:Это\s+[^\n\r]+)?https://rockhitneva\.ru/[^\s\n\r<>\'\"]*', text)
for h in set(headers):
    print('PAGE HEADER:', h)

print('\n--- ALL TL DATA ---')
matches = re.finditer(r'(https://rockhitneva\.ru/[^\s\n\r<>\'\"]*)', text)
for m in matches:
    pos = m.start()
    snippet = text[max(0, pos-100):min(len(text), pos+150)]
    if 'Это' in snippet or '\n\n' in snippet:
        print('FOUND SECTION AT:', m.group(1))

# Find all occurrences of data-start in ticketland iframe
data_starts = re.findall(r'data-start=[\"\']([^\"\']+)[\"\']', text)
print('\nTotal data-starts found:', len(data_starts))
for ds in set(data_starts):
    print('data-start:', ds)
