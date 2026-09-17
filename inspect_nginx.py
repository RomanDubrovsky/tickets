import re

with open('/etc/nginx/nginx.conf', 'r') as f:
    text = f.read()

# Let's check how other servers are defined
print('Total servers in nginx.conf:', text.count('server {'))
