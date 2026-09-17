server_block = """
    # --- Ships Demo Subdomains ---
    server {
        listen 80;
        server_name rockhit.public-health-ai.ru;

        location /static/ {
            alias /home/ubuntu/b2b_cms/static_assets/;
            expires 30d;
        }

        root /home/ubuntu/b2b_cms/dist/rockhitneva.ru;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }

    server {
        listen 80;
        server_name aquasound.public-health-ai.ru;

        location /static/ {
            alias /home/ubuntu/b2b_cms/static_assets/;
            expires 30d;
        }

        root /home/ubuntu/b2b_cms/dist/aquasound.club;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }

    server {
        listen 80;
        server_name admin.public-health-ai.ru cms.public-health-ai.ru;

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
"""

with open('/etc/nginx/nginx.conf.bak', 'r') as f:
    conf = f.read()

idx = conf.rfind('}')
if idx != -1:
    new_conf = conf[:idx] + server_block
    with open('/tmp/nginx_patched.conf', 'w') as f:
        f.write(new_conf)
    print("PATCHED SUCCESSFULLY")