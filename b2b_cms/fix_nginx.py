import re
with open('/etc/nginx/nginx.conf', 'r') as f:
    content = f.read()
if 'b2b_cms.conf' not in content:
    # Insert include before the very last closing brace
    content = re.sub(r'\}(\s*)$', '\n    include /etc/nginx/conf.d/b2b_cms.conf;\n}\g<1>', content)
    with open('/etc/nginx/nginx.conf', 'w') as f:
        f.write(content)
    print('Include directive added!')
else:
    print('Already present, nothing to do.')
