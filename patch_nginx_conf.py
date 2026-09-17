with open('/etc/nginx/nginx.conf', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == 'include /etc/nginx/mime.types;':
        new_lines.append(line)
        new_lines.append('    include /etc/nginx/conf.d/*.conf;\n')
    else:
        new_lines.append(line)

with open('/tmp/nginx.conf', 'w') as f:
    f.writelines(new_lines)
print('MODIFIED')
