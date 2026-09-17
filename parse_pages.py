import re

with open('111111.txt', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Find all occurrences of TLConf or tlFrameContainer or ticketland scripts
tlconfs = re.findall(r'var\s+TLConf\s*=\s*\{[^}]+\};', text)
print('TLConfs found:', len(tlconfs))
for t in set(tlconfs):
    print(t)

# Find containers
containers = re.findall(r'<div\s+id=[\"\']tlFrameContainer[\"\'][^>]*>', text)
print('\nContainers found:', len(containers))
for c in set(containers):
    print(c)

# Let's find sections in 111111.txt
sections = re.split(r'https?://[^\s\n\r]+', text)
print('\nTotal sections split by URL:', len(sections))

urls = re.findall(r'(https?://[^\s\n\r]+)', text)
print('\nURLs found:', len(urls))
for u in set(urls):
    if 'rockhitneva.ru/' in u and not any(ext in u for ext in ['.jpg','.png','.css','.js','.php','.woff','.svg','.xml']):
        print('Target Page URL:', u)
