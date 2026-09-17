content = """server {
    listen 80;
    server_name rockhit.public-health-ai.ru;

    location /static/ {
        alias /home/ubuntu/b2b_cms/static_assets/;
        expires 30d;
    }

    root /home/ubuntu/b2b_cms/dist/rockhitneva.ru;
    index index.html;

    location / {
        try_files  / /index.html;
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
        try_files  / /index.html;
    }
}

server {
    listen 80;
    server_name admin.public-health-ai.ru cms.public-health-ai.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host System.Management.Automation.Internal.Host.InternalHost;
        proxy_set_header X-Real-IP ;
        proxy_set_header X-Forwarded-For ;
        proxy_set_header X-Forwarded-Proto ;
    }
}
"""
with open("/etc/nginx/conf.d/b2b_public.conf", "w") as f:
    f.write(content)
print("SUCCESS WRITING")
