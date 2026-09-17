with open('/etc/nginx/conf.d/b2b_public.conf', 'rb') as f:
    content = f.read()

if content.startswith(b'\xef\xbb\xbf'):
    content = content[3:]

with open('/tmp/b2b_clean.conf', 'wb') as f:
    f.write(content)
print('BOM STRIPPED')
