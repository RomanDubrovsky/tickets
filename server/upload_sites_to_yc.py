import os
import mimetypes
import boto3
from dotenv import load_dotenv

load_dotenv('c:/Prevention_V3/.env')

access_key = os.getenv('YC_STORAGE_ACCESS_KEY')
secret_key = os.getenv('YC_STORAGE_SECRET_KEY')
bucket_name = 'spb-tickets-ru'

session = boto3.session.Session()
s3 = session.client(
    service_name='s3',
    endpoint_url='https://storage.yandexcloud.net',
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

cms_dist = 'c:/Ships/b2b_cms/dist'

uploaded = 0
for domain in ['rockhitneva.ru', 'aquasound.club']:
    domain_dir = os.path.join(cms_dist, domain)
    if not os.path.exists(domain_dir):
        continue
    for root, dirs, files in os.walk(domain_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, domain_dir).replace('\\', '/')
            
            # Put in sites/<domain>/<path>
            s3_key = f"sites/{domain}/{rel_path}"
            content_type, _ = mimetypes.guess_type(full_path)
            if not content_type:
                if file.endswith('.html') or file.endswith('.htm'):
                    content_type = 'text/html; charset=utf-8'
                elif file.endswith('.js'):
                    content_type = 'application/javascript; charset=utf-8'
                elif file.endswith('.css'):
                    content_type = 'text/css; charset=utf-8'
                else:
                    content_type = 'application/octet-stream'
            elif 'text' in content_type:
                content_type += '; charset=utf-8'

            cache_control = 'no-cache, no-store, must-revalidate' if file.endswith('.html') else 'public, max-age=31536000, immutable'
            print(f"Uploading {s3_key} ({content_type})")
            with open(full_path, 'rb') as data:
                s3.put_object(
                    Bucket=bucket_name,
                    Key=s3_key,
                    Body=data,
                    ContentType=content_type,
                    CacheControl=cache_control,
                    ACL='public-read'
                )
            uploaded += 1

print(f"\n--- Uploaded {uploaded} site pages to Yandex Object Storage! ---")
