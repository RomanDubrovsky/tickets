import os
import mimetypes
import boto3
from dotenv import load_dotenv

# Загружаем ключи Yandex Object Storage
load_dotenv('c:/Prevention_V3/.env')
access_key = os.getenv('YC_STORAGE_ACCESS_KEY')
secret_key = os.getenv('YC_STORAGE_SECRET_KEY')
bucket_name = 'spb-tickets-ru'

print("Connecting to Yandex Object Storage (boto3)...")
session = boto3.session.Session()
s3 = session.client(
    service_name='s3',
    endpoint_url='https://storage.yandexcloud.net',
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

dist_dir = 'c:/Ships/dist'
print(f"Deploying production React App from {dist_dir} to bucket {bucket_name}...")

count = 0
for root, dirs, files in os.walk(dist_dir):
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
        s3_key = rel_path
        
        content_type, _ = mimetypes.guess_type(full_path)
        if not content_type:
            if f.endswith('.woff2'): content_type = 'font/woff2'
            elif f.endswith('.woff'): content_type = 'font/woff'
            elif f.endswith('.js'): content_type = 'application/javascript; charset=utf-8'
            elif f.endswith('.css'): content_type = 'text/css; charset=utf-8'
            elif f.endswith('.html'): content_type = 'text/html; charset=utf-8'
            else: content_type = 'application/octet-stream'
        elif content_type.startswith('text/') or 'javascript' in content_type:
            content_type += '; charset=utf-8'

        extra_args = {'ContentType': content_type}
        # Устанавливаем кэширование: assets кэшируем надолго, index.html — без кэша
        if f == 'index.html':
            extra_args['CacheControl'] = 'no-cache, no-store, must-revalidate'
        else:
            extra_args['CacheControl'] = 'public, max-age=31536000, immutable'

        s3.upload_file(full_path, bucket_name, s3_key, ExtraArgs=extra_args)
        count += 1
        print(f"[{count}] Uploaded: {s3_key} ({content_type})")

print(f"\nSUCCESS: Production deploy completed! Total {count} files uploaded to https://storage.yandexcloud.net/{bucket_name}/")
