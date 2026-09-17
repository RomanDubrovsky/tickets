with open('/etc/nginx/sites-available/ru_proxy.conf', 'r') as f:
    content = f.read()

replacement = '''    # 5. Gurvich Personal Site & Ships Project
    server {
        listen 80;
        listen 443 ssl http2;
        server_name gurvich.in www.gurvich.in;

        ssl_certificate /etc/letsencrypt/live/gurvich.in/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/gurvich.in/privkey.pem;

        # Spectral Static Assets for Ships
        location /static/ {
            alias /home/ubuntu/b2b_cms/static_assets/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Akvatoria Zvuka (Spectral)
        location /akvatoria/ {
            alias /home/ubuntu/b2b_cms/dist/aquasound.club/;
            index index.html;
            try_files \ \/ /akvatoria/index.html;
        }

        # Rock Hit Neva (Spectral)
        location /rockhit/ {
            alias /home/ubuntu/b2b_cms/dist/rockhitneva.ru/;
            index index.html;
            try_files \ \/ /rockhit/index.html;
        }

        # Ships App (Vite SPA)
        location /ships/ {
            alias /var/www/ships/;
            index index.html;
            try_files \ \/ /ships/index.html;
        }

        # CMS Admin Panel
        location /admin/ {
            proxy_pass http://127.0.0.1:3000/;
            proxy_http_version 1.1;
            proxy_set_header Host \System.Management.Automation.Internal.Host.InternalHost;
            proxy_set_header X-Real-IP \;
            proxy_set_header X-Forwarded-For \;
            proxy_set_header X-Forwarded-Proto \;
        }

        location / {
            root /var/www/gurvich.in;
            index index.html;
            try_files \ \/ =404;
        }
    }
}
'''

idx = content.rfind('    # 5. Gurvich Personal Site')
if idx != -1:
    new_content = content[:idx] + replacement
    with open('/tmp/ru_proxy.conf', 'w') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('NOT FOUND')
